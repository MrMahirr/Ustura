import { createHmac } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { AppConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import type { SqlQueryExecutor } from '../../database/database.types';
import { Role } from '../../common/enums/role.enum';
import { UserService } from '../user/user.service';
import type { User, UserProfile } from '../user/interfaces/user.types';
import { GoogleCustomerAuthDto } from './dto/google-customer-auth.dto';
import { GoogleWebCustomerAuthDto } from './dto/google-web-customer-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthSessionResponse,
  AuthTokens,
  VerifiedRefreshToken,
} from './interfaces/auth.types';
import { FirebaseTokenVerifierService } from './firebase-token-verifier.service';
import { GoogleWebTokenVerifierService } from './google-web-token-verifier.service';
import {
  accountInactiveError,
  customerGoogleOnlyError,
  generatedTokenInvalidError,
  googleEmailAlreadyLinkedError,
  invalidCredentialsError,
  refreshTokenInvalidError,
} from './errors/auth.errors';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  private readonly passwordCost = 12;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly databaseService: DatabaseService,
    private readonly firebaseTokenVerifierService: FirebaseTokenVerifierService,
    private readonly googleWebTokenVerifierService: GoogleWebTokenVerifierService,
  ) {}

  getGoogleCustomerWebConfiguration(): { clientId: string | null } {
    const clientId = this.configService.google.webClientId.trim();

    return {
      clientId: clientId || null,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthSessionResponse> {
    const passwordHash = await this.hashPassword(registerDto.password);

    const user = await this.userService.createCustomer({
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      passwordHash,
    });

    return this.createSession(user);
  }

  async login(loginDto: LoginDto): Promise<AuthSessionResponse> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user?.isActive || !user.passwordHash) {
      throw invalidCredentialsError();
    }

    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw invalidCredentialsError();
    }

    return this.createSession(user);
  }

  async authenticateCustomerWithGoogle(
    googleCustomerAuthDto: GoogleCustomerAuthDto,
  ): Promise<AuthSessionResponse> {
    const googleIdentity =
      await this.firebaseTokenVerifierService.verifyGoogleCustomerToken(
        googleCustomerAuthDto.idToken,
      );

    const userByFirebaseUid = await this.userService.findByFirebaseUid(
      googleIdentity.firebaseUid,
    );

    if (userByFirebaseUid) {
      this.assertCustomerGoogleEligibility(userByFirebaseUid);
      return this.createSession(userByFirebaseUid);
    }

    const userByEmail = await this.userService.findByEmail(
      googleIdentity.email,
    );

    if (userByEmail) {
      this.assertCustomerGoogleEligibility(userByEmail);

      if (
        userByEmail.firebaseUid &&
        userByEmail.firebaseUid !== googleIdentity.firebaseUid
      ) {
        throw googleEmailAlreadyLinkedError();
      }

      const linkedUser = userByEmail.firebaseUid
        ? userByEmail
        : await this.userService.linkFirebaseCustomerIdentity(
            userByEmail.id,
            googleIdentity.firebaseUid,
          );

      return this.createSession(linkedUser);
    }

    const phone = googleCustomerAuthDto.phone?.trim() ?? '';

    const customer = await this.userService.createCustomer({
      name: googleIdentity.name,
      email: googleIdentity.email,
      phone,
      firebaseUid: googleIdentity.firebaseUid,
      allowEmptyPhone: phone.length === 0,
    });

    return this.createSession(customer);
  }

  async authenticateCustomerWithGoogleWeb(
    googleWebCustomerAuthDto: GoogleWebCustomerAuthDto,
  ): Promise<AuthSessionResponse> {
    const googleIdentity =
      await this.googleWebTokenVerifierService.verifyCustomerAccessToken(
        googleWebCustomerAuthDto.accessToken,
      );
    const existingUser = await this.userService.findByEmail(googleIdentity.email);

    if (existingUser) {
      this.assertCustomerGoogleEligibility(existingUser);
      return this.createSession(existingUser);
    }

    const customer = await this.userService.createCustomer({
      name: googleIdentity.name,
      email: googleIdentity.email,
      phone: '',
      allowPasswordless: true,
      allowEmptyPhone: true,
    });

    return this.createSession(customer);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthSessionResponse> {
    const verifiedToken = await this.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    const tokenHash = this.hashRefreshToken(refreshTokenDto.refreshToken);
    const storedToken = await this.authRepository.findByTokenHash(tokenHash);

    if (
      !storedToken ||
      storedToken.revoked ||
      storedToken.userId !== verifiedToken.sub ||
      storedToken.expiresAt.getTime() <= Date.now()
    ) {
      throw refreshTokenInvalidError();
    }

    const user = await this.userService.findById(verifiedToken.sub);

    if (!user?.isActive) {
      throw refreshTokenInvalidError();
    }

    return this.databaseService.transaction(async (transaction) => {
      const revoked = await this.authRepository.revokeToken(
        tokenHash,
        user.id,
        transaction,
      );

      if (!revoked) {
        throw refreshTokenInvalidError();
      }

      return this.createSession(user, transaction);
    });
  }

  async logout(
    userId: string,
    refreshToken: string,
  ): Promise<{ success: true }> {
    const tokenHash = this.hashRefreshToken(refreshToken);
    const revoked = await this.authRepository.revokeToken(tokenHash, userId);

    if (!revoked) {
      throw refreshTokenInvalidError(
        'Refresh token is invalid or already revoked.',
      );
    }

    return { success: true };
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private async createSession(
    user: User,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<AuthSessionResponse> {
    const profile = this.toProfile(user);
    const tokens = await this.generateTokens(profile);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken(
      {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: this.getTokenExpirationDate(tokens.refreshToken),
      },
      executor,
    );

    return {
      user: profile,
      tokens,
    };
  }

  private async generateTokens(user: UserProfile): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'access',
    };
    const refreshPayload: JwtPayload = {
      ...accessPayload,
      tokenType: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.jwt.secret,
        expiresIn: this.configService.jwt.accessExpiresIn as never,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.jwt.secret,
        expiresIn: this.configService.jwt.refreshExpiresIn as never,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.configService.jwt.accessExpiresIn,
      refreshTokenExpiresIn: this.configService.jwt.refreshExpiresIn,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.passwordCost);
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHmac('sha256', this.configService.jwt.secret)
      .update(refreshToken)
      .digest('hex');
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<VerifiedRefreshToken> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.jwt.secret,
        },
      );

      if (payload.tokenType !== 'refresh') {
        throw refreshTokenInvalidError();
      }

      return payload as VerifiedRefreshToken;
    } catch {
      throw refreshTokenInvalidError();
    }
  }

  private getTokenExpirationDate(token: string): Date {
    const decodedToken: unknown = this.jwtService.decode(token);

    if (!this.hasNumericExpiration(decodedToken)) {
      throw generatedTokenInvalidError();
    }

    return new Date(decodedToken.exp * 1000);
  }

  private hasNumericExpiration(payload: unknown): payload is { exp: number } {
    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('exp' in payload)
    ) {
      return false;
    }

    return typeof payload.exp === 'number';
  }

  private assertCustomerGoogleEligibility(user: User): void {
    if (!user.isActive) {
      throw accountInactiveError();
    }

    if (user.role !== Role.CUSTOMER) {
      throw customerGoogleOnlyError();
    }
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
