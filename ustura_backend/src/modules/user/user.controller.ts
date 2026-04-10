import {
  Body,
  Controller,
  Get,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileService } from './user-profile.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() currentUser?: JwtPayload) {
    return this.userProfileService.getProfileById(
      this.requireAuthenticatedUserId(currentUser),
    );
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() currentUser: JwtPayload | undefined,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userProfileService.updateProfile(
      this.requireAuthenticatedUserId(currentUser),
      updateUserDto,
    );
  }

  private requireAuthenticatedUserId(currentUser?: JwtPayload): string {
    if (!currentUser?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }

    return currentUser.sub;
  }
}
