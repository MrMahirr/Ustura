import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/auth/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationService } from './reservation.service';

@ApiTags('reservations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.OWNER, Role.BARBER, Role.RECEPTIONIST)
  @ApiOperation({
    summary:
      'Create a reservation for the current customer or on behalf of a customer',
  })
  @ApiCreatedResponse({ type: ReservationResponseDto })
  async create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(currentUser, createReservationDto);
  }

  @Get('my')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'List reservations belonging to the authenticated customer',
  })
  @ApiOkResponse({ type: ReservationResponseDto, isArray: true })
  async findMyReservations(@CurrentUser() currentUser: JwtPayload) {
    return this.reservationService.findByCustomerId(currentUser);
  }

  @Get('salon/:salonId')
  @Roles(Role.OWNER, Role.RECEPTIONIST, Role.BARBER)
  @ApiOperation({
    summary: 'List reservations for a salon within the caller scope',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: ReservationResponseDto, isArray: true })
  async findSalonReservations(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.reservationService.findBySalonId(currentUser, salonId);
  }

  @Patch(':reservationId/status')
  @Roles(Role.OWNER, Role.RECEPTIONIST, Role.BARBER)
  @ApiOperation({
    summary:
      'Update a reservation operational status within the caller permission scope',
  })
  @ApiParam({ name: 'reservationId', format: 'uuid' })
  @ApiOkResponse({ type: ReservationResponseDto })
  async updateStatus(
    @CurrentUser() currentUser: JwtPayload,
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Body() updateReservationStatusDto: UpdateReservationStatusDto,
  ) {
    return this.reservationService.updateStatus(
      currentUser,
      reservationId,
      updateReservationStatusDto,
    );
  }

  @Delete(':reservationId')
  @Roles(Role.CUSTOMER, Role.OWNER, Role.RECEPTIONIST, Role.BARBER)
  @ApiOperation({ summary: 'Cancel a reservation within caller permissions' })
  @ApiParam({ name: 'reservationId', format: 'uuid' })
  @ApiOkResponse({ type: ReservationResponseDto })
  async cancel(
    @CurrentUser() currentUser: JwtPayload,
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
  ) {
    return this.reservationService.cancel(currentUser, reservationId);
  }
}
