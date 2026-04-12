import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type { Request } from 'express';
import { AuthSessionResponseDto } from './dto/auth-session-response.dto';
import { GoogleCustomerAuthDto } from './dto/google-customer-auth.dto';
import { GoogleWebCustomerAuthDto } from './dto/google-web-customer-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a direct customer account',
    description:
      'Owner onboarding is handled outside this endpoint through EmailJS and admin approval.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async register(@Body() registerDto: RegisterDto, @Req() request: Request) {
    return this.authService.register(
      registerDto,
      this.buildSessionClientContext(request),
    );
  }

  @Post('login')
  @Throttle({
    default: {
      ttl: 60_000,
      limit: 5,
    },
  })
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    return this.authService.login(
      loginDto,
      this.buildSessionClientContext(request),
    );
  }

  @Post('google/customer')
  @Throttle({
    default: {
      ttl: 60_000,
      limit: 5,
    },
  })
  @ApiOperation({ summary: 'Authenticate a customer with Firebase Google sign-in' })
  @ApiBody({ type: GoogleCustomerAuthDto })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async authenticateCustomerWithGoogle(
    @Body() googleCustomerAuthDto: GoogleCustomerAuthDto,
    @Req() request: Request,
  ) {
    return this.authService.authenticateCustomerWithGoogle(
      googleCustomerAuthDto,
      this.buildSessionClientContext(request),
    );
  }

  @Get('google/customer/web/config')
  @ApiOperation({
    summary: 'Expose public Google web sign-in configuration',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        clientId: {
          oneOf: [{ type: 'string' }, { type: 'null' }],
          example: '1234567890-abcdefg.apps.googleusercontent.com',
        },
      },
    },
  })
  getGoogleCustomerWebConfiguration() {
    return this.authService.getGoogleCustomerWebConfiguration();
  }

  @Post('google/customer/web')
  @Throttle({
    default: {
      ttl: 60_000,
      limit: 5,
    },
  })
  @ApiOperation({
    summary: 'Authenticate a customer with Google web sign-in',
  })
  @ApiBody({ type: GoogleWebCustomerAuthDto })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async authenticateCustomerWithGoogleWeb(
    @Body() googleWebCustomerAuthDto: GoogleWebCustomerAuthDto,
    @Req() request: Request,
  ) {
    return this.authService.authenticateCustomerWithGoogleWeb(
      googleWebCustomerAuthDto,
      this.buildSessionClientContext(request),
    );
  }

  @Post('refresh')
  @Throttle({
    default: {
      ttl: 300_000,
      limit: 12,
    },
  })
  @ApiOperation({ summary: 'Rotate refresh token and issue a new session' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() request: Request) {
    return this.authService.refreshToken(
      refreshTokenDto,
      this.buildSessionClientContext(request),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke the supplied refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  async logout(
    @CurrentUser() currentUser: JwtPayload,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.logout(
      currentUser,
      refreshTokenDto.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke all active refresh tokens for the current user' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        revokedSessionCount: {
          type: 'number',
          example: 3,
        },
      },
    },
  })
  async logoutAll(
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.authService.logoutAll(currentUser);
  }

  private buildSessionClientContext(request: Request) {
    const forwardedForHeader = request.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwardedForHeader)
      ? forwardedForHeader[0]
      : forwardedForHeader?.split(',')[0];

    return {
      userAgent: request.get('user-agent')?.trim() ?? null,
      ipAddress: forwardedIp?.trim() || request.ip || null,
    };
  }
}
