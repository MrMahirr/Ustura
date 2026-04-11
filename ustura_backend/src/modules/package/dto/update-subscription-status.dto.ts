import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ enum: ['pending', 'active', 'cancelled'] })
  @IsEnum(['pending', 'active', 'cancelled'])
  status: 'pending' | 'active' | 'cancelled';
}
