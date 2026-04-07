import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import {
  CreateUserRecordInput,
  UpdateUserProfileInput,
  User,
} from '../interfaces/user.types';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.databaseService.query<UserRow>({
      name: 'user.find-by-id',
      text: `
        SELECT
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.databaseService.query<UserRow>({
      name: 'user.find-by-email',
      text: `
        SELECT
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      values: [email],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const result = await this.databaseService.query<UserRow>({
      name: 'user.find-by-firebase-uid',
      text: `
        SELECT
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
        FROM users
        WHERE firebase_uid = $1
        LIMIT 1
      `,
      values: [firebaseUid],
    });

    return this.mapRow(result.rows[0]);
  }

  async create(
    input: CreateUserRecordInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User> {
    const result = await executor.query<UserRow>({
      name: 'user.create',
      text: `
        INSERT INTO users (
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
      `,
      values: [
        input.name,
        input.email,
        input.phone,
        input.passwordHash ?? null,
        input.firebaseUid ?? null,
        input.role,
      ],
    });

    return this.mapRow(result.rows[0]) as User;
  }

  async updateProfile(
    id: string,
    input: UpdateUserProfileInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      updates.push(`name = $${values.length}`);
    }

    if (input.phone !== undefined) {
      values.push(input.phone);
      updates.push(`phone = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await executor.query<UserRow>({
      name: 'user.update-profile',
      text: `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
      `,
      values,
    });

    return this.mapRow(result.rows[0]);
  }

  async deactivate(
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const result = await executor.query<UserRow>({
      name: 'user.deactivate',
      text: `
        UPDATE users
        SET is_active = FALSE
        WHERE id = $1
        RETURNING
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async linkFirebaseIdentity(
    id: string,
    firebaseUid: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const result = await executor.query<UserRow>({
      name: 'user.link-firebase-identity',
      text: `
        UPDATE users
        SET firebase_uid = $1
        WHERE id = $2
        RETURNING
          id,
          name,
          email,
          phone,
          password_hash,
          firebase_uid,
          role,
          is_active,
          created_at,
          updated_at
      `,
      values: [firebaseUid, id],
    });

    return this.mapRow(result.rows[0]);
  }

  private mapRow(row?: UserRow): User | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      passwordHash: row.password_hash,
      firebaseUid: row.firebase_uid,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface UserRow extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string | null;
  firebase_uid: string | null;
  role: User['role'];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
