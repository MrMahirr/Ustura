import { SlotGateway } from './slot.gateway';
import { SlotService } from './slot.service';
import type { SlotSelection } from './slot.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockSlotService(): jest.Mocked<
  Pick<
    SlotService,
    'getSelections' | 'holdSelection' | 'releaseSelection'
  >
> {
  return {
    getSelections: jest.fn().mockResolvedValue([]),
    holdSelection: jest.fn().mockResolvedValue([]),
    releaseSelection: jest.fn().mockResolvedValue([]),
  };
}

interface MockSocket {
  id: string;
  data: Record<string, unknown>;
  join: jest.Mock;
  leave: jest.Mock;
}

function createMockSocket(id: string): MockSocket {
  return {
    id,
    data: {},
    join: jest.fn(),
    leave: jest.fn(),
  };
}

function createMockServer(): { to: jest.Mock; emit: jest.Mock } {
  const emit = jest.fn();
  const to = jest.fn().mockReturnValue({ emit });
  return { to, emit };
}

const SCOPE = {
  salonId: 'salon-1',
  date: '2026-04-10',
  staffId: 'staff-1',
};

const SELECTION_PAYLOAD = {
  ...SCOPE,
  slotStart: '2026-04-10T10:00:00.000Z',
};

function buildSelections(holderId: string): SlotSelection[] {
  return [
    {
      holderId,
      slotStart: '2026-04-10T10:00:00.000Z',
      expiresAt: new Date(Date.now() + 45_000).toISOString(),
    },
  ];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SlotGateway – WebSocket slot interaction', () => {
  let gateway: SlotGateway;
  let slotService: ReturnType<typeof createMockSlotService>;
  let server: ReturnType<typeof createMockServer>;

  beforeEach(() => {
    slotService = createMockSlotService();
    gateway = new SlotGateway(slotService as unknown as SlotService);
    server = createMockServer();
    (gateway as any).server = server;
  });

  // -----------------------------------------------------------------------
  // slot:join
  // -----------------------------------------------------------------------

  describe('slot:join', () => {
    it('joins the room and broadcasts the current selection snapshot', async () => {
      const client = createMockSocket('client-1');
      const existingSelections = buildSelections('other-client');
      slotService.getSelections.mockResolvedValue(existingSelections);

      const result = await gateway.joinRoom(client as any, SCOPE as any);

      expect(client.join).toHaveBeenCalledWith(
        `slots:${SCOPE.salonId}:${SCOPE.date}:${SCOPE.staffId}`,
      );
      expect(client.data.slotScope).toEqual(SCOPE);
      expect(server.to).toHaveBeenCalled();
      expect(server.to.mock.results[0].value.emit).toHaveBeenCalledWith(
        'slot:selection.snapshot',
        expect.objectContaining({
          scope: SCOPE,
          selections: existingSelections,
        }),
      );
      expect(result).toMatchObject({
        selections: existingSelections,
      });
    });

    it('leaves the previous room before joining a new one', async () => {
      const client = createMockSocket('client-1');
      client.data.slotScope = {
        salonId: 'old-salon',
        date: '2026-04-09',
        staffId: 'old-staff',
      };
      client.data.selectedSlotStart = '2026-04-09T10:00:00.000Z';

      await gateway.joinRoom(client as any, SCOPE as any);

      expect(slotService.releaseSelection).toHaveBeenCalledWith(
        {
          salonId: 'old-salon',
          date: '2026-04-09',
          staffId: 'old-staff',
        },
        '2026-04-09T10:00:00.000Z',
        'client-1',
      );
      expect(client.leave).toHaveBeenCalledWith(
        'slots:old-salon:2026-04-09:old-staff',
      );
    });
  });

  // -----------------------------------------------------------------------
  // slot:select
  // -----------------------------------------------------------------------

  describe('slot:select', () => {
    it('holds the selection and broadcasts the updated snapshot', async () => {
      const client = createMockSocket('client-1');
      const selections = buildSelections('client-1');
      slotService.holdSelection.mockResolvedValue(selections);

      const result = await gateway.selectSlot(
        client as any,
        SELECTION_PAYLOAD as any,
      );

      expect(slotService.holdSelection).toHaveBeenCalledWith(
        SELECTION_PAYLOAD,
        SELECTION_PAYLOAD.slotStart,
        'client-1',
      );
      expect(client.data.selectedSlotStart).toBe(
        SELECTION_PAYLOAD.slotStart,
      );
      expect(server.to).toHaveBeenCalled();
      expect(result).toMatchObject({ selections });
    });

    it('releases the previous selection when selecting a different slot', async () => {
      const client = createMockSocket('client-1');
      client.data.slotScope = SCOPE;
      client.data.selectedSlotStart = '2026-04-10T09:30:00.000Z';

      slotService.holdSelection.mockResolvedValue(
        buildSelections('client-1'),
      );

      await gateway.selectSlot(client as any, SELECTION_PAYLOAD as any);

      expect(slotService.releaseSelection).toHaveBeenCalledWith(
        SCOPE,
        '2026-04-10T09:30:00.000Z',
        'client-1',
      );
    });

    it('does not release the previous selection when re-selecting the same slot', async () => {
      const client = createMockSocket('client-1');
      client.data.slotScope = SCOPE;
      client.data.selectedSlotStart = SELECTION_PAYLOAD.slotStart;

      slotService.holdSelection.mockResolvedValue(
        buildSelections('client-1'),
      );

      await gateway.selectSlot(client as any, SELECTION_PAYLOAD as any);

      expect(slotService.releaseSelection).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // slot:unselect
  // -----------------------------------------------------------------------

  describe('slot:unselect', () => {
    it('releases the selection and broadcasts the updated snapshot', async () => {
      const client = createMockSocket('client-1');
      client.data.selectedSlotStart = SELECTION_PAYLOAD.slotStart;

      slotService.releaseSelection.mockResolvedValue([]);

      const result = await gateway.unselectSlot(
        client as any,
        SELECTION_PAYLOAD as any,
      );

      expect(slotService.releaseSelection).toHaveBeenCalledWith(
        SELECTION_PAYLOAD,
        SELECTION_PAYLOAD.slotStart,
        'client-1',
      );
      expect(client.data.selectedSlotStart).toBeUndefined();
      expect(result).toMatchObject({ selections: [] });
    });

    it('does not clear selectedSlotStart when unselecting a different slot', async () => {
      const client = createMockSocket('client-1');
      client.data.selectedSlotStart = '2026-04-10T11:00:00.000Z';

      slotService.releaseSelection.mockResolvedValue([]);

      await gateway.unselectSlot(client as any, SELECTION_PAYLOAD as any);

      expect(client.data.selectedSlotStart).toBe(
        '2026-04-10T11:00:00.000Z',
      );
    });
  });

  // -----------------------------------------------------------------------
  // handleDisconnect
  // -----------------------------------------------------------------------

  describe('handleDisconnect', () => {
    it('releases the held selection and broadcasts the updated snapshot on disconnect', async () => {
      const client = createMockSocket('client-1');
      client.data.slotScope = SCOPE;
      client.data.selectedSlotStart = '2026-04-10T10:00:00.000Z';

      slotService.releaseSelection.mockResolvedValue([]);

      await gateway.handleDisconnect(client as any);

      expect(slotService.releaseSelection).toHaveBeenCalledWith(
        SCOPE,
        '2026-04-10T10:00:00.000Z',
        'client-1',
      );
      expect(server.to).toHaveBeenCalled();
    });

    it('does nothing when the client has no active scope', async () => {
      const client = createMockSocket('client-1');

      await gateway.handleDisconnect(client as any);

      expect(slotService.releaseSelection).not.toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled();
    });

    it('does nothing when the client has a scope but no selected slot', async () => {
      const client = createMockSocket('client-1');
      client.data.slotScope = SCOPE;

      await gateway.handleDisconnect(client as any);

      expect(slotService.releaseSelection).not.toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled();
    });
  });
});
