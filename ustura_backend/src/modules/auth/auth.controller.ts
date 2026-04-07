import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { GoogleCustomerAuthDto } from './dto/google-customer-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google/customer')
  async authenticateCustomerWithGoogle(
    @Body() googleCustomerAuthDto: GoogleCustomerAuthDto,
  ) {
    return this.authService.authenticateCustomerWithGoogle(
      googleCustomerAuthDto,
    );
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() currentUser: JwtPayload,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.logout(
      currentUser.sub,
      refreshTokenDto.refreshToken,
    );
  }
}
