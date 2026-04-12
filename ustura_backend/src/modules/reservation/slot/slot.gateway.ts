import { ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { SlotRoomDto } from './dto/slot-room.dto';
import { SlotSelectionDto } from './dto/slot-selection.dto';
import { SlotService } from './slot.service';
import { SlotScope } from './slot.types';

interface ReservationSocketData {
  slotScope?: SlotRoomDto;
  selectedSlotStart?: string;
}

type ReservationSocket = Socket<any, any, any, ReservationSocketData>;

@WebSocketGateway({
  namespace: '/slots',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class SlotGateway implements OnGatewayDisconnect<ReservationSocket> {
  @WebSocketServer()
  server: Server;

  constructor(private readonly slotService: SlotService) {}

  @SubscribeMessage('slot:join')
  async joinRoom(
    @ConnectedSocket() client: ReservationSocket,
    @MessageBody(new ValidationPipe({ transform: true, whitelist: true }))
    payload: SlotRoomDto,
  ) {
    await this.leaveCurrentRoom(client);
    client.data.slotScope = payload;
    client.join(this.getRoomName(payload));

    const selections = await this.slotService.getSelections(payload);
    this.server.to(this.getRoomName(payload)).emit('slot:selection.snapshot', {
      scope: payload,
      selections,
    });

    return {
      room: this.getRoomName(payload),
      selections,
    };
  }

  @SubscribeMessage('slot:select')
  async selectSlot(
    @ConnectedSocket() client: ReservationSocket,
    @MessageBody(new ValidationPipe({ transform: true, whitelist: true }))
    payload: SlotSelectionDto,
  ) {
    try {
      await this.ensureScope(client, payload);
      await this.releasePreviousSelectionIfNeeded(client, payload);

      const selections = await this.slotService.holdSelection(
        payload,
        payload.slotStart,
        client.id,
      );

      client.data.slotScope = payload;
      client.data.selectedSlotStart = payload.slotStart;
      this.server.to(this.getRoomName(payload)).emit('slot:selection.snapshot', {
        scope: payload,
        selections,
      });

      return { selections };
    } catch (error) {
      throw this.asWsException(error);
    }
  }

  @SubscribeMessage('slot:unselect')
  async unselectSlot(
    @ConnectedSocket() client: ReservationSocket,
    @MessageBody(new ValidationPipe({ transform: true, whitelist: true }))
    payload: SlotSelectionDto,
  ) {
    try {
      const selections = await this.slotService.releaseSelection(
        payload,
        payload.slotStart,
        client.id,
      );

      if (client.data.selectedSlotStart === payload.slotStart) {
        client.data.selectedSlotStart = undefined;
      }

      this.server.to(this.getRoomName(payload)).emit('slot:selection.snapshot', {
        scope: payload,
        selections,
      });

      return { selections };
    } catch (error) {
      throw this.asWsException(error);
    }
  }

  async handleDisconnect(client: ReservationSocket): Promise<void> {
    const scope = client.data.slotScope;
    const selectedSlotStart = client.data.selectedSlotStart;

    if (!scope || !selectedSlotStart) {
      return;
    }

    const selections = await this.slotService.releaseSelection(
      scope,
      selectedSlotStart,
      client.id,
    );

    this.server.to(this.getRoomName(scope)).emit('slot:selection.snapshot', {
      scope,
      selections,
    });
  }

  private async leaveCurrentRoom(client: ReservationSocket): Promise<void> {
    const scope = client.data.slotScope;
    const selectedSlotStart = client.data.selectedSlotStart;

    if (!scope) {
      return;
    }

    if (selectedSlotStart) {
      const selections = await this.slotService.releaseSelection(
        scope,
        selectedSlotStart,
        client.id,
      );

      this.server.to(this.getRoomName(scope)).emit('slot:selection.snapshot', {
        scope,
        selections,
      });
    }

    client.leave(this.getRoomName(scope));
    client.data.slotScope = undefined;
    client.data.selectedSlotStart = undefined;
  }

  private async releasePreviousSelectionIfNeeded(
    client: ReservationSocket,
    nextScope: SlotScope & { slotStart: string },
  ): Promise<void> {
    const currentScope = client.data.slotScope;
    const currentSlotStart = client.data.selectedSlotStart;

    if (
      !currentScope ||
      !currentSlotStart ||
      (currentScope.salonId === nextScope.salonId &&
        currentScope.date === nextScope.date &&
        currentScope.staffId === nextScope.staffId &&
        currentSlotStart === nextScope.slotStart)
    ) {
      return;
    }

    const selections = await this.slotService.releaseSelection(
      currentScope,
      currentSlotStart,
      client.id,
    );

    this.server.to(this.getRoomName(currentScope)).emit('slot:selection.snapshot', {
      scope: currentScope,
      selections,
    });
  }

  private async ensureScope(
    client: ReservationSocket,
    scope: SlotScope,
  ): Promise<void> {
    const roomName = this.getRoomName(scope);
    const currentScope = client.data.slotScope;

    if (!currentScope || this.getRoomName(currentScope) !== roomName) {
      client.join(roomName);
    }
  }

  private getRoomName(scope: SlotScope): string {
    return `slots:${scope.salonId}:${scope.date}:${scope.staffId ?? 'all'}`;
  }

  private asWsException(error: unknown): WsException {
    if (error instanceof Error) {
      return new WsException(error.message);
    }

    return new WsException('Unexpected slot selection error.');
  }
}
