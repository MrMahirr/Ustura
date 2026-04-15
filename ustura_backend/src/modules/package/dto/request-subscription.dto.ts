import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RequestSubscriptionDto {
  @ApiProperty({ example: 'uuid-of-desired-package' })
  @IsUUID()
  @IsNotEmpty()
  packageId: string;
}
