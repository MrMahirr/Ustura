import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AdminPatchUserStatusDto {
  @ApiProperty({
    description: 'Whether the managed account can sign in and operate.',
  })
  @IsBoolean()
  isActive!: boolean;
}
