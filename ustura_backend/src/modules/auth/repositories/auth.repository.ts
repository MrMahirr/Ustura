import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import { PrincipalKind } from '../../../shared/auth/principal-kind.enum';
import { RefreshTokenRecord } from '../interfaces/auth.types';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveRefreshToken(
    input: {
      principalId: string;
      principalKind: PrincipalKind;
      tokenHash: string;
      expiresAt: Date;
      userAgent?: string | null;
      ipAddress?: string | null;
      rotatedFrom?: string | null;
    },
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<RefreshTokenRecord> {
    const result = await executor.query<RefreshTokenRow>({
      name: 'auth.save-refresh-token',
      text: `
        INSERT INTO refresh_tokens (
          principal_id,
          principal_kind,
          token_hash,
          expires_at,
          user_agent,
          ip_address,
          rotated_from
        )
        VALUES ($1, $2, $3, $4, $5, $6::inet, $7)
        RETURNING
          id,
          principal_id,
          principal_kind,
          token_hash,
          expires_at,
          revoked,
          revoked_at,
          user_agent,
          ip_address,
          rotated_from,
          created_at
      `,
      values: [
        input.principalId,
        input.principalKind,
        input.tokenHash,
        input.expiresAt,
        input.userAgent ?? null,
        input.ipAddress ?? null,
        input.rotatedFrom ?? null,
      ],
    });

    return this.mapRow(result.rows[0]) as RefreshTokenRecord;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const result = await this.databaseService.query<RefreshTokenRow>({
      name: 'auth.find-refresh-token-by-hash',
      text: `
        SELECT
          id,
          principal_id,
          principal_kind,
          token_hash,
          expires_at,
          revoked,
          revoked_at,
          user_agent,
          ip_address,
          rotated_from,
          created_at
        FROM refresh_tokens
        WHERE token_hash = $1
        LIMIT 1
      `,
      values: [tokenHash],
    });

    return this.mapRow(result.rows[0]);
  }

  async revokeToken(
    tokenHash: string,
    principal?: { id: string; kind: PrincipalKind },
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<boolean> {
    const values: unknown[] = [tokenHash];
    let principalFilter = '';

    if (principal) {
      values.push(principal.id, principal.kind);
      principalFilter = `AND principal_id = $2 AND principal_kind = $3`;
    }

    const result = await executor.query({
      name: 'auth.revoke-refresh-token',
      text: `
        UPDATE refresh_tokens
        SET revoked = TRUE,
            revoked_at = NOW()
        WHERE token_hash = $1
          AND revoked = FALSE
          AND revoked_at IS NULL
          ${principalFilter}
      `,
      values,
    });

    return result.rowCount !== null && result.rowCount > 0;
  }

  async revokeAllPrincipalTokens(
    principalId: string,
    principalKind: PrincipalKind,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<number> {
    const result = await executor.query({
      name: 'auth.revoke-all-principal-refresh-tokens',
      text: `
        UPDATE refresh_tokens
        SET revoked = TRUE,
            revoked_at = NOW()
        WHERE principal_id = $1
          AND principal_kind = $2
          AND revoked = FALSE
          AND revoked_at IS NULL
      `,
      values: [principalId, principalKind],
    });

    return result.rowCount ?? 0;
  }

  private mapRow(row?: RefreshTokenRow): RefreshTokenRecord | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      principalId: row.principal_id,
      principalKind: row.principal_kind as PrincipalKind,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      revoked: row.revoked,
      revokedAt: row.revoked_at,
      userAgent: row.user_agent,
      ipAddress: row.ip_address,
      rotatedFrom: row.rotated_from,
      createdAt: row.created_at,
    };
  }
}

interface RefreshTokenRow extends QueryResultRow {
  id: string;
  principal_id: string;
  principal_kind: string;
  token_hash: string;
  expires_at: Date;
  revoked: boolean;
  revoked_at: Date | null;
  user_agent: string | null;
  ip_address: string | null;
  rotated_from: string | null;
  created_at: Date;
}
