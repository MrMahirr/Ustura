import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto';
import { SlotResponseDto } from './dto/slot-response.dto';
import { SlotService } from './slot.service';

@ApiTags('slots')
@Controller('salons/:salonId/slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get()
  @ApiOperation({
    summary: 'List available 30-minute slots for a salon and optional barber',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiQuery({ name: 'date', type: String, example: '2026-04-08' })
  @ApiQuery({
    name: 'staff_id',
    required: false,
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({ type: SlotResponseDto, isArray: true })
  async getAvailableSlots(
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Query() query: GetSlotsQueryDto,
  ) {
    return this.slotService.getAvailableSlots(salonId, query);
  }
}
