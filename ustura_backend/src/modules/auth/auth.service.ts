import { createHmac } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { AppConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import type { SqlQueryExecutor } from '../../database/database.types';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { Role } from '../../shared/auth/role.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogAction } from '../audit-log/enums/audit-log-action.enum';
import { AuditLogEntityType } from '../audit-log/enums/audit-log-entity-type.enum';
import type { User, UserProfile } from '../user/interfaces/user.types';
import {
  USER_PROVISIONING_SERVICE,
  USER_QUERY_SERVICE,
  type UserProvisioningServiceContract,
  type UserQueryServiceContract,
} from '../user/interfaces/user.contracts';
import { GoogleCustomerAuthDto } from './dto/google-customer-auth.dto';
import { GoogleWebCustomerAuthDto } from './dto/google-web-customer-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthSessionResponse,
  AuthTokens,
  SessionClientContext,
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
  refreshTokenReuseDetectedError,
} from './errors/auth.errors';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  private readonly passwordCost = 12;

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: UserQueryServiceContract,
    @Inject(USER_PROVISIONING_SERVICE)
    private readonly userProvisioningService: UserProvisioningServiceContract,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly databaseService: DatabaseService,
    private readonly firebaseTokenVerifierService: FirebaseTokenVerifierService,
    private readonly googleWebTokenVerifierService: GoogleWebTokenVerifierService,
    private readonly auditLogService: AuditLogService,
    private readonly domainEventBus: DomainEventBus,
  ) {}

  getGoogleCustomerWebConfiguration(): { clientId: string | null } {
    const clientId = this.configService.google.webClientId.trim();

    return {
      clientId: clientId || null,
    };
  }

  async register(
    registerDto: RegisterDto,
    clientContext?: SessionClientContext,
  ): Promise<AuthSessionResponse> {
    const passwordHash = await this.hashPassword(registerDto.password);

    const user = await this.userProvisioningService.createCustomer({
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      passwordHash,
    });

    const session = await this.createSession(user, {
      clientContext,
    });

    this.recordUserAudit(AuditLogAction.AUTH_REGISTERED, user, {
      provider: 'password',
    });

    return session;
  }

  async login(
    loginDto: LoginDto,
    clientContext?: SessionClientContext,
  ): Promise<AuthSessionResponse> {
    const user = await this.userQueryService.findByEmail(loginDto.email);

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

    const session = await this.createSession(user, {
      clientContext,
    });

    this.recordUserAudit(AuditLogAction.AUTH_LOGGED_IN, user, {
      provider: 'password',
    });

    return session;
  }

  async authenticateCustomerWithGoogle(
    googleCustomerAuthDto: GoogleCustomerAuthDto,
    clientContext?: SessionClientContext,
  ): Promise<AuthSessionResponse> {
    const googleIdentity =
      await this.firebaseTokenVerifierService.verifyGoogleCustomerToken(
        googleCustomerAuthDto.idToken,
      );

    const userByFirebaseUid = await this.userQueryService.findByFirebaseUid(
      googleIdentity.firebaseUid,
    );

    if (userByFirebaseUid) {
      this.assertCustomerGoogleEligibility(userByFirebaseUid);
      const session = await this.createSession(userByFirebaseUid, {
        clientContext,
      });

      this.recordUserAudit(
        AuditLogAction.AUTH_GOOGLE_CUSTOMER_AUTHENTICATED,
        userByFirebaseUid,
        {
          provider: 'firebase_google',
          linkedAccount: true,
        },
      );

      return session;
    }

    const userByEmail = await this.userQueryService.findByEmail(
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
        : await this.userProvisioningService.linkFirebaseCustomerIdentity(
            userByEmail.id,
            googleIdentity.firebaseUid,
          );

      const session = await this.createSession(linkedUser, {
        clientContext,
      });

      this.recordUserAudit(
        AuditLogAction.AUTH_GOOGLE_CUSTOMER_AUTHENTICATED,
        linkedUser,
        {
          provider: 'firebase_google',
          linkedAccount: !userByEmail.firebaseUid,
        },
      );

      return session;
    }

    const phone = googleCustomerAuthDto.phone?.trim() ?? '';

    const customer = await this.userProvisioningService.createCustomer({
      name: googleIdentity.name,
      email: googleIdentity.email,
      phone,
      firebaseUid: googleIdentity.firebaseUid,
      allowEmptyPhone: phone.length === 0,
    });

    const session = await this.createSession(customer, {
      clientContext,
    });

    this.recordUserAudit(
      AuditLogAction.AUTH_GOOGLE_CUSTOMER_AUTHENTICATED,
      customer,
      {
        provider: 'firebase_google',
        linkedAccount: false,
      },
    );

    return session;
  }

  async authenticateCustomerWithGoogleWeb(
    googleWebCustomerAuthDto: GoogleWebCustomerAuthDto,
    clientContext?: SessionClientContext,
  ): Promise<AuthSessionResponse> {
    const googleIdentity =
      await this.googleWebTokenVerifierService.verifyCustomerAccessToken(
        googleWebCustomerAuthDto.accessToken,
      );
    const existingUser = await this.userQueryService.findByEmail(googleIdentity.email);

    if (existingUser) {
      this.assertCustomerGoogleEligibility(existingUser);
      const session = await this.createSession(existingUser, {
        clientContext,
      });

      this.recordUserAudit(
        AuditLogAction.AUTH_GOOGLE_WEB_CUSTOMER_AUTHENTICATED,
        existingUser,
        {
          provider: 'google_web',
          linkedAccount: true,
        },
      );

      return session;
    }

    const customer = await this.userProvisioningService.createCustomer({
      name: googleIdentity.name,
      email: googleIdentity.email,
      phone: '',
      allowPasswordless: true,
      allowEmptyPhone: true,
    });

    const session = await this.createSession(customer, {
      clientContext,
    });

    this.recordUserAudit(
      AuditLogAction.AUTH_GOOGLE_WEB_CUSTOMER_AUTHENTICATED,
      customer,
      {
        provider: 'google_web',
        linkedAccount: false,
      },
    );

    return session;
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    clientContext?: SessionClientContext,
  ): Promise<AuthSessionResponse> {
    const verifiedToken = await this.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    const tokenHash = this.hashRefreshToken(refreshTokenDto.refreshToken);
    const storedToken = await this.authRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw refreshTokenInvalidError();
    }

    if (storedToken.userId !== verifiedToken.sub) {
      throw refreshTokenInvalidError();
    }

    if (storedToken.revoked) {
      await this.handleRefreshTokenReuse(storedToken.userId, storedToken);
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      throw refreshTokenInvalidError();
    }

    const user = await this.userQueryService.findById(verifiedToken.sub);

    if (!user?.isActive) {
      throw refreshTokenInvalidError();
    }

    const session = await this.databaseService.transaction(async (transaction) => {
      const revoked = await this.authRepository.revokeToken(
        tokenHash,
        user.id,
        transaction,
      );

      if (!revoked) {
        throw refreshTokenInvalidError();
      }

      return this.createSession(user, {
        clientContext,
        rotatedFromTokenId: storedToken.id,
        executor: transaction,
      });
    });

    this.recordUserAudit(AuditLogAction.AUTH_REFRESHED, user, {
      provider: 'refresh_token',
    });

    return session;
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

    const user = await this.userQueryService.findById(userId);
    this.publishLogoutEvent({
      userId,
      userEmail: user?.email ?? null,
      userName: user?.name ?? null,
      provider: 'refresh_token',
      reason: 'manual_logout',
      revokedSessionCount: 1,
    });

    return { success: true };
  }

  async logoutAll(
    currentUser: JwtPayload,
  ): Promise<{ success: true; revokedSessionCount: number }> {
    const revokedSessionCount = await this.authRepository.revokeAllUserTokens(
      currentUser.sub,
    );
    const user = await this.userQueryService.findById(currentUser.sub);

    this.publishLogoutEvent({
      userId: currentUser.sub,
      userEmail: user?.email ?? currentUser.email,
      userName: user?.name ?? null,
      provider: 'refresh_token',
      reason: 'logout_all',
      revokedSessionCount,
    });

    return {
      success: true,
      revokedSessionCount,
    };
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private async createSession(
    user: User,
    options: {
      clientContext?: SessionClientContext;
      rotatedFromTokenId?: string | null;
      executor?: SqlQueryExecutor;
    } = {},
  ): Promise<AuthSessionResponse> {
    const executor = options.executor ?? this.databaseService;
    const profile = this.toProfile(user);
    const tokens = await this.generateTokens(profile);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken(
      {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: this.getTokenExpirationDate(tokens.refreshToken),
        userAgent: options.clientContext?.userAgent ?? null,
        ipAddress: options.clientContext?.ipAddress ?? null,
        rotatedFrom: options.rotatedFromTokenId ?? null,
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

  private recordUserAudit(
    action: AuditLogAction,
    user: User,
    metadata?: Record<string, unknown>,
  ): void {
    this.auditLogService.recordBestEffort({
      actorUserId: user.id,
      actorRole: user.role,
      action,
      entityType: AuditLogEntityType.USER,
      entityId: user.id,
      metadata,
    });
  }

  private async handleRefreshTokenReuse(
    userId: string,
    storedToken: { id: string },
  ): Promise<never> {
    const revokedSessionCount = await this.authRepository.revokeAllUserTokens(
      userId,
    );
    const user = await this.userQueryService.findById(userId);

    this.publishLogoutEvent({
      userId,
      userEmail: user?.email ?? null,
      userName: user?.name ?? null,
      provider: 'refresh_token',
      reason: 'suspicious_reuse',
      revokedSessionCount,
      sourceRefreshTokenId: storedToken.id,
    });

    throw refreshTokenReuseDetectedError();
  }

  private publishLogoutEvent(input: {
    userId: string;
    userEmail?: string | null;
    userName?: string | null;
    provider: 'refresh_token';
    reason: 'manual_logout' | 'logout_all' | 'suspicious_reuse';
    revokedSessionCount: number;
    sourceRefreshTokenId?: string | null;
  }): void {
    this.domainEventBus.publish({
      name: 'auth.logged_out',
      occurredAt: new Date(),
      payload: {
        userId: input.userId,
        userEmail: input.userEmail ?? null,
        userName: input.userName ?? null,
        provider: input.provider,
        reason: input.reason,
        revokedSessionCount: input.revokedSessionCount,
        sourceRefreshTokenId: input.sourceRefreshTokenId ?? null,
      },
    });
  }
}
