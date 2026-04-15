import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { SqlQueryExecutor } from '../../../database/database.types';
import { PrincipalKind } from '../../../shared/auth/principal-kind.enum';
import { Role } from '../../../shared/auth/role.enum';
import {
  AdminUserActivityEntry,
  AdminUserFilterOption,
  AdminUserFilterOptions,
  AdminUserOverview,
  AdminUserReservation,
  AdminUserStats,
  AdminUserSummary,
  AdminUserWorkingDay,
  FindAdminUsersFilters,
  CreateUserRecordInput,
  UpdateManagedEmployeeInput,
  UpdateUserProfileInput,
  User,
} from '../interfaces/user.types';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByPrincipal(kind: PrincipalKind, id: string): Promise<User | null> {
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const fromClause =
      kind === PrincipalKind.CUSTOMER
        ? `customers p`
        : kind === PrincipalKind.PLATFORM_ADMIN
          ? `platform_admins p`
          : `personnel p`;

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    const result = await this.databaseService.query<UserRow>({
      text: `
        SELECT
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${this.mustChangePasswordSelect(kind)} AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM ${fromClause}
        WHERE p.id = $1
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByEmailForPrincipal(
    email: string,
    kind: PrincipalKind,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const fromClause =
      kind === PrincipalKind.CUSTOMER
        ? `customers p`
        : kind === PrincipalKind.PLATFORM_ADMIN
          ? `platform_admins p`
          : `personnel p`;

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    const result = await executor.query<UserRow>({
      text: `
        SELECT
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${this.mustChangePasswordSelect(kind)} AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM ${fromClause}
        WHERE LOWER(p.email) = LOWER($1)
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
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          p.firebase_uid,
          '${Role.CUSTOMER}'::varchar(20) AS role,
          FALSE::boolean AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM customers p
        WHERE p.firebase_uid = $1
        LIMIT 1
      `,
      values: [firebaseUid],
    });

    return this.mapRow(result.rows[0]);
  }

  async findByPhoneForPrincipal(
    phone: string,
    kind: PrincipalKind,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const fromClause =
      kind === PrincipalKind.CUSTOMER
        ? `customers p`
        : kind === PrincipalKind.PLATFORM_ADMIN
          ? `platform_admins p`
          : `personnel p`;

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    const result = await executor.query<UserRow>({
      text: `
        SELECT
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${this.mustChangePasswordSelect(kind)} AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM ${fromClause}
        WHERE p.phone = $1
        LIMIT 1
      `,
      values: [phone],
    });

    return this.mapRow(result.rows[0]);
  }

  private tableForPrincipalKind(kind: PrincipalKind): string {
    switch (kind) {
      case PrincipalKind.CUSTOMER:
        return 'customers';
      case PrincipalKind.PLATFORM_ADMIN:
        return 'platform_admins';
      default:
        return 'personnel';
    }
  }

  private mustChangePasswordSelect(kind: PrincipalKind): string {
    return kind === PrincipalKind.PERSONNEL
      ? 'p.must_change_password'
      : 'FALSE::boolean';
  }

  async findAdminUsers(
    filters: FindAdminUsersFilters,
  ): Promise<AdminUserSummary[]> {
    const { values, whereClause } = this.buildAdminFilters(filters);
    const result = await this.databaseService.query<AdminUserRow>({
      text: `
        ${this.getAdminUserCtes()}
        SELECT
          u.id,
          u.name,
          u.email,
          u.phone,
          ${this.getAdminRoleSql()} AS admin_role,
          staff_assignment.staff_role,
          staff_assignment.bio AS staff_bio,
          staff_assignment.photo_url AS avatar_url,
          COALESCE(staff_assignment.salon_id, owner_salon.salon_id) AS salon_id,
          COALESCE(staff_salon.name, owner_salon.salon_name, 'USTURA Merkez') AS salon_name,
          COALESCE(
            CONCAT_WS(', ', staff_salon.city, COALESCE(staff_salon.district, staff_salon.address)),
            CONCAT_WS(', ', owner_salon.salon_city, COALESCE(owner_salon.salon_district, owner_salon.salon_address)),
            'Platform Geneli'
          ) AS salon_location,
          COALESCE(staff_salon.city, owner_salon.salon_city, 'Platform') AS city,
          COALESCE(staff_salon.is_active, owner_salon.salon_is_active) AS salon_is_active,
          latest_subscription.package_tier,
          COALESCE(today_reservations.reservation_count, 0)::int AS today_reservation_count,
          ${this.getAdminStatusSql()} AS admin_status,
          u.created_at,
          u.updated_at
        ${this.getAdminUserFromClause()}
        ${whereClause}
        ORDER BY
          ${this.getAdminStatusRankSql()},
          u.created_at DESC
      `,
      values,
    });

    return result.rows.map(
      (row) => this.mapAdminUserRow(row) as AdminUserSummary,
    );
  }

  async findAdminUserById(id: string): Promise<AdminUserSummary | null> {
    const result = await this.databaseService.query<AdminUserRow>({
      name: 'user.find-admin-user-by-id',
      text: `
        ${this.getAdminUserCtes()}
        SELECT
          u.id,
          u.name,
          u.email,
          u.phone,
          ${this.getAdminRoleSql()} AS admin_role,
          staff_assignment.staff_role,
          staff_assignment.bio AS staff_bio,
          staff_assignment.photo_url AS avatar_url,
          COALESCE(staff_assignment.salon_id, owner_salon.salon_id) AS salon_id,
          COALESCE(staff_salon.name, owner_salon.salon_name, 'USTURA Merkez') AS salon_name,
          COALESCE(
            CONCAT_WS(', ', staff_salon.city, COALESCE(staff_salon.district, staff_salon.address)),
            CONCAT_WS(', ', owner_salon.salon_city, COALESCE(owner_salon.salon_district, owner_salon.salon_address)),
            'Platform Geneli'
          ) AS salon_location,
          COALESCE(staff_salon.city, owner_salon.salon_city, 'Platform') AS city,
          COALESCE(staff_salon.is_active, owner_salon.salon_is_active) AS salon_is_active,
          latest_subscription.package_tier,
          COALESCE(today_reservations.reservation_count, 0)::int AS today_reservation_count,
          ${this.getAdminStatusSql()} AS admin_status,
          u.created_at,
          u.updated_at
        ${this.getAdminUserFromClause()}
        WHERE u.id = $1
          AND (u.role IN ('super_admin', 'owner') OR staff_assignment.staff_id IS NOT NULL)
        LIMIT 1
      `,
      values: [id],
    });

    return this.mapAdminUserRow(result.rows[0]);
  }

  /**
   * Super-admin: enable/disable salon personnel or platform admins.
   * Staff rows for personnel are aligned so admin list status stays consistent.
   */
  async adminSetManagedUserActive(
    userId: string,
    isActive: boolean,
  ): Promise<boolean> {
    return this.databaseService.transaction(async (tx) => {
      const platformResult = await tx.query(
        `
        UPDATE platform_admins
        SET is_active = $2,
            updated_at = NOW()
        WHERE id = $1
        `,
        [userId, isActive],
      );

      if (platformResult.rowCount && platformResult.rowCount > 0) {
        return true;
      }

      const personnelResult = await tx.query(
        `
        UPDATE personnel
        SET is_active = $2,
            updated_at = NOW()
        WHERE id = $1
        `,
        [userId, isActive],
      );

      if (!personnelResult.rowCount || personnelResult.rowCount < 1) {
        return false;
      }

      await tx.query(
        `
        UPDATE staff
        SET is_active = $2,
            updated_at = NOW()
        WHERE user_id = $1
        `,
        [userId, isActive],
      );

      return true;
    });
  }

  async findReservationsForUser(
    userId: string,
    limit = 10,
  ): Promise<AdminUserReservation[]> {
    const result = await this.databaseService.query<{
      id: string;
      customer_name: string;
      slot_start: Date;
      slot_end: Date;
      status: string;
      notes: string | null;
    }>({
      text: `
        SELECT
          r.id,
          COALESCE(c.name, 'Misafir') AS customer_name,
          r.slot_start,
          r.slot_end,
          r.status,
          r.notes
        FROM reservations r
        INNER JOIN staff st ON st.id = r.staff_id
        LEFT JOIN customers c ON c.id = r.customer_id
        WHERE st.user_id = $1
        ORDER BY r.slot_start DESC
        LIMIT $2
      `,
      values: [userId, limit],
    });

    return result.rows.map((row) => ({
      id: row.id,
      customerName: row.customer_name,
      slotStart: row.slot_start,
      slotEnd: row.slot_end,
      status: row.status,
      notes: row.notes,
    }));
  }

  async findStatsForUser(userId: string): Promise<AdminUserStats> {
    const result = await this.databaseService.query<{
      total: number;
      completed: number;
      cancelled: number;
      last_30: number;
      avg_per_day: number;
    }>({
      text: `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE r.status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE r.status = 'cancelled')::int AS cancelled,
          COUNT(*) FILTER (WHERE r.slot_start >= NOW() - INTERVAL '30 days')::int AS last_30,
          COALESCE(
            ROUND(
              COUNT(*) FILTER (WHERE r.slot_start >= NOW() - INTERVAL '30 days')::numeric
              / NULLIF(30, 0),
              1
            ),
            0
          )::float8 AS avg_per_day
        FROM reservations r
        INNER JOIN staff st ON st.id = r.staff_id
        WHERE st.user_id = $1
      `,
      values: [userId],
    });

    const row = result.rows[0];
    return {
      totalReservations: row?.total ?? 0,
      completedReservations: row?.completed ?? 0,
      cancelledReservations: row?.cancelled ?? 0,
      last30DaysReservations: row?.last_30 ?? 0,
      averagePerDay: Number(row?.avg_per_day ?? 0),
    };
  }

  async findActivityForUser(
    userId: string,
    limit = 10,
  ): Promise<AdminUserActivityEntry[]> {
    const result = await this.databaseService.query<{
      id: string;
      action: string;
      entity_type: string;
      metadata: Record<string, unknown> | null;
      created_at: Date;
    }>({
      text: `
        SELECT
          id,
          action,
          entity_type,
          metadata,
          created_at
        FROM audit_logs
        WHERE actor_user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `,
      values: [userId, limit],
    });

    return result.rows.map((row) => ({
      id: row.id,
      action: row.action,
      entityType: row.entity_type,
      detail: this.formatAuditDetail(row.action, row.metadata),
      createdAt: row.created_at,
    }));
  }

  async findWorkingHoursForUser(
    userId: string,
  ): Promise<AdminUserWorkingDay[]> {
    const result = await this.databaseService.query<{
      working_hours: Record<
        string,
        { open: string; close: string } | null
      > | null;
    }>({
      text: `
        SELECT s.working_hours
        FROM salons s
        LEFT JOIN staff st ON st.salon_id = s.id AND st.user_id = $1 AND st.is_active = TRUE
        LEFT JOIN salons os ON os.owner_id = $1
        WHERE st.id IS NOT NULL OR os.id IS NOT NULL
        ORDER BY st.id IS NOT NULL DESC
        LIMIT 1
      `,
      values: [userId],
    });

    const wh = result.rows[0]?.working_hours;
    if (!wh) {
      return [];
    }

    const dayLabels: Record<string, string> = {
      monday: 'Pazartesi',
      tuesday: 'Sali',
      wednesday: 'Carsamba',
      thursday: 'Persembe',
      friday: 'Cuma',
      saturday: 'Cumartesi',
      sunday: 'Pazar',
    };

    return Object.entries(dayLabels).map(([key, label]) => {
      const entry = wh[key];
      return {
        day: label,
        open: entry?.open ?? null,
        close: entry?.close ?? null,
      };
    });
  }

  private formatAuditDetail(
    action: string,
    metadata: Record<string, unknown> | null,
  ): string | null {
    if (!metadata) return null;

    switch (action) {
      case 'auth.logged_in':
        return 'Sisteme giris yapildi';
      case 'auth.logged_out':
        return 'Oturum kapatildi';
      case 'auth.registered':
        return 'Hesap olusturuldu';
      case 'staff.created':
        return `Personel olarak atandi${metadata.salonId ? '' : ''}`;
      case 'staff.updated':
        return 'Personel bilgileri guncellendi';
      case 'staff.deactivated':
        return 'Personel kaydi devre disi birakildi';
      case 'reservation.created':
        return 'Yeni randevu olusturuldu';
      case 'reservation.cancelled':
        return 'Randevu iptal edildi';
      case 'reservation.status_updated':
        return `Randevu durumu guncellendi`;
      default:
        return action.replace(/\./g, ' ');
    }
  }

  async adminUpdateUserProfile(
    userId: string,
    input: UpdateUserProfileInput,
  ): Promise<boolean> {
    return this.databaseService.transaction(async (tx) => {
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
        return true;
      }

      const setClause = updates.join(', ');
      values.push(userId);
      const idParam = `$${values.length}`;

      const platformResult = await tx.query(
        `UPDATE platform_admins SET ${setClause}, updated_at = NOW() WHERE id = ${idParam}`,
        values,
      );

      if (platformResult.rowCount && platformResult.rowCount > 0) {
        return true;
      }

      const personnelResult = await tx.query(
        `UPDATE personnel SET ${setClause}, updated_at = NOW() WHERE id = ${idParam}`,
        values,
      );

      return !!(personnelResult.rowCount && personnelResult.rowCount > 0);
    });
  }

  async updateManagedEmployee(
    id: string,
    input: UpdateManagedEmployeeInput & { passwordHash?: string | null },
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      updates.push(`name = $${values.length}`);
    }

    if (input.email !== undefined) {
      values.push(input.email);
      updates.push(`email = $${values.length}`);
    }

    if (input.phone !== undefined) {
      values.push(input.phone);
      updates.push(`phone = $${values.length}`);
    }

    if (input.role !== undefined) {
      values.push(input.role);
      updates.push(`role = $${values.length}`);
    }

    if (input.passwordHash !== undefined) {
      values.push(input.passwordHash);
      updates.push(`password_hash = $${values.length}`);
    }

    if (input.mustChangePassword !== undefined) {
      values.push(input.mustChangePassword);
      updates.push(`must_change_password = $${values.length}`);
    }

    if (updates.length === 0) {
      return this.findByPrincipal(PrincipalKind.PERSONNEL, id);
    }

    values.push(id);

    const result = await executor.query<UserRow>({
      name: 'user.update-managed-employee',
      text: `
        UPDATE personnel p
        SET ${updates.join(', ')},
            updated_at = NOW()
        WHERE p.id = $${values.length}
        RETURNING
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          NULL::varchar(128) AS firebase_uid,
          p.role,
          p.must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
      `,
      values,
    });

    return this.mapRow(result.rows[0]);
  }

  async getAdminOverview(): Promise<AdminUserOverview> {
    const result = await this.databaseService.query<AdminUserOverviewRow>({
      name: 'user.get-admin-overview',
      text: `
        ${this.getAdminUserCtes()}
        , admin_users AS (
          SELECT
            u.id,
            ${this.getAdminStatusSql()} AS admin_status,
            u.created_at
          ${this.getAdminUserFromClause()}
          WHERE (u.role IN ('super_admin', 'owner') OR staff_assignment.staff_id IS NOT NULL)
        )
        SELECT
          COUNT(*)::int AS total_users,
          COUNT(*) FILTER (WHERE admin_status IN ('active', 'busy'))::int AS active_today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_last_30_days,
          COALESCE(
            ROUND(
              (
                COUNT(*) FILTER (WHERE admin_status IN ('active', 'busy'))::numeric
                / NULLIF(COUNT(*), 0)
              ) * 100,
              1
            ),
            0
          )::float8 AS active_rate
        FROM admin_users
      `,
      values: [],
    });

    const row = result.rows[0];

    return {
      totalUsers: row?.total_users ?? 0,
      activeToday: row?.active_today ?? 0,
      newLast30Days: row?.new_last_30_days ?? 0,
      activeRate: Number(row?.active_rate ?? 0),
    };
  }

  async findAdminFilterOptions(): Promise<AdminUserFilterOptions> {
    const [salonResult, cityResult] = await Promise.all([
      this.databaseService.query<AdminUserFilterOptionRow>({
        name: 'user.find-admin-filter-salons',
        text: `
          ${this.getAdminUserCtes()}
          SELECT DISTINCT
            COALESCE(staff_assignment.salon_id, owner_salon.salon_id) AS id,
            COALESCE(staff_salon.name, owner_salon.salon_name, 'USTURA Merkez') AS name
          ${this.getAdminUserFromClause()}
          WHERE (u.role IN ('super_admin', 'owner') OR staff_assignment.staff_id IS NOT NULL)
            AND COALESCE(staff_assignment.salon_id, owner_salon.salon_id) IS NOT NULL
          ORDER BY name ASC
        `,
        values: [],
      }),
      this.databaseService.query<AdminUserCityRow>({
        name: 'user.find-admin-filter-cities',
        text: `
          ${this.getAdminUserCtes()}
          SELECT DISTINCT
            COALESCE(staff_salon.city, owner_salon.salon_city) AS city
          ${this.getAdminUserFromClause()}
          WHERE (u.role IN ('super_admin', 'owner') OR staff_assignment.staff_id IS NOT NULL)
            AND COALESCE(staff_salon.city, owner_salon.salon_city) IS NOT NULL
          ORDER BY city ASC
        `,
        values: [],
      }),
    ]);

    return {
      salons: salonResult.rows.map(
        (row) => this.mapAdminFilterOptionRow(row) as AdminUserFilterOption,
      ),
      cities: cityResult.rows.map((row) => row.city),
    };
  }

  async create(
    input: CreateUserRecordInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User> {
    if (input.role === Role.SUPER_ADMIN) {
      const result = await executor.query<UserRow>({
        name: 'user.create-platform-admin',
        text: `
          INSERT INTO platform_admins (
            name,
            email,
            phone,
            password_hash
          )
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            name,
            email,
            phone,
            password_hash,
            NULL::varchar(128) AS firebase_uid,
            '${Role.SUPER_ADMIN}'::varchar(20) AS role,
            FALSE::boolean AS must_change_password,
            is_active,
            created_at,
            updated_at
        `,
        values: [
          input.name,
          input.email,
          input.phone,
          input.passwordHash!.trim(),
        ],
      });

      return this.mapRow(result.rows[0]) as User;
    }

    if (input.role === Role.CUSTOMER) {
      const result = await executor.query<UserRow>({
        name: 'user.create-customer',
        text: `
          INSERT INTO customers (
            name,
            email,
            phone,
            password_hash,
            firebase_uid
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING
            id,
            name,
            email,
            phone,
            password_hash,
            firebase_uid,
            '${Role.CUSTOMER}'::varchar(20) AS role,
            FALSE::boolean AS must_change_password,
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
        ],
      });

      return this.mapRow(result.rows[0]) as User;
    }

    const mustChangePassword = input.mustChangePassword === true;

    const result = await executor.query<UserRow>({
      name: 'user.create-personnel',
      text: `
        INSERT INTO personnel (
          name,
          email,
          phone,
          password_hash,
          role,
          must_change_password
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          name,
          email,
          phone,
          password_hash,
          NULL::varchar(128) AS firebase_uid,
          role,
          must_change_password,
          is_active,
          created_at,
          updated_at
      `,
      values: [
        input.name,
        input.email,
        input.phone,
        input.passwordHash ?? null,
        input.role,
        mustChangePassword,
      ],
    });

    return this.mapRow(result.rows[0]) as User;
  }

  async updateProfile(
    kind: PrincipalKind,
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
      return this.findByPrincipal(kind, id);
    }

    const table = this.tableForPrincipalKind(kind);
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    values.push(id);

    const result = await executor.query<UserRow>({
      text: `
        UPDATE ${table} p
        SET ${updates.join(', ')}
        WHERE p.id = $${values.length}
        RETURNING
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${this.mustChangePasswordSelect(kind)} AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
      `,
      values,
    });

    return this.mapRow(result.rows[0]);
  }

  async deactivate(
    kind: PrincipalKind,
    id: string,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const table = this.tableForPrincipalKind(kind);
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    const result = await executor.query<UserRow>({
      text: `
        UPDATE ${table} p
        SET is_active = FALSE
        WHERE p.id = $1
        RETURNING
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${this.mustChangePasswordSelect(kind)} AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
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
        UPDATE customers p
        SET firebase_uid = $1
        WHERE p.id = $2
        RETURNING
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          p.firebase_uid,
          '${Role.CUSTOMER}'::varchar(20) AS role,
          FALSE::boolean AS must_change_password,
          p.is_active,
          p.created_at,
          p.updated_at
      `,
      values: [firebaseUid, id],
    });

    return this.mapRow(result.rows[0]);
  }

  async updatePasswordHashForPrincipal(
    kind: PrincipalKind,
    id: string,
    passwordHash: string,
    options: { clearMustChangePassword: boolean },
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<User | null> {
    const table = this.tableForPrincipalKind(kind);
    const roleSql =
      kind === PrincipalKind.PLATFORM_ADMIN
        ? `'${Role.SUPER_ADMIN}'::varchar(20) AS role`
        : kind === PrincipalKind.CUSTOMER
          ? `'${Role.CUSTOMER}'::varchar(20) AS role`
          : 'p.role';

    const selectFirebase =
      kind === PrincipalKind.CUSTOMER
        ? 'p.firebase_uid'
        : 'NULL::varchar(128) AS firebase_uid';

    const mustChangeSql =
      kind === PrincipalKind.PERSONNEL && options.clearMustChangePassword
        ? 'FALSE::boolean AS must_change_password'
        : kind === PrincipalKind.PERSONNEL
          ? 'p.must_change_password'
          : 'FALSE::boolean AS must_change_password';

    const setClause =
      kind === PrincipalKind.PERSONNEL && options.clearMustChangePassword
        ? 'password_hash = $2, must_change_password = FALSE'
        : 'password_hash = $2';

    const result = await executor.query<UserRow>({
      text: `
        UPDATE ${table} p
        SET ${setClause}
        WHERE p.id = $1
        RETURNING
          p.id,
          p.name,
          p.email,
          p.phone,
          p.password_hash,
          ${selectFirebase},
          ${roleSql},
          ${mustChangeSql},
          p.is_active,
          p.created_at,
          p.updated_at
      `,
      values: [id, passwordHash],
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
      mustChangePassword: Boolean(row.must_change_password),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAdminUserRow(row?: AdminUserRow): AdminUserSummary | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.admin_role,
      staffRole: row.staff_role,
      status: row.admin_status,
      staffBio: row.staff_bio,
      avatarUrl: row.avatar_url,
      salonId: row.salon_id,
      salonName: row.salon_name,
      salonLocation: row.salon_location,
      city: row.city,
      salonIsActive: row.salon_is_active,
      packageTier: row.package_tier,
      todayReservationCount: row.today_reservation_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAdminFilterOptionRow(
    row?: AdminUserFilterOptionRow,
  ): AdminUserFilterOption | null {
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
    };
  }

  private buildAdminFilters(filters: FindAdminUsersFilters) {
    const clauses: string[] = [
      `(u.role IN ('super_admin', 'owner') OR staff_assignment.staff_id IS NOT NULL)`,
    ];
    const values: unknown[] = [];

    if (filters.city) {
      values.push(filters.city);
      clauses.push(
        `LOWER(COALESCE(staff_salon.city, owner_salon.salon_city, '')) = LOWER($${values.length})`,
      );
    }

    if (filters.salonId) {
      values.push(filters.salonId);
      clauses.push(
        `COALESCE(staff_assignment.salon_id, owner_salon.salon_id) = $${values.length}`,
      );
    }

    if (filters.role) {
      values.push(filters.role);
      clauses.push(`${this.getAdminRoleSql()} = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      clauses.push(`${this.getAdminStatusSql()} = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      clauses.push(`
        (
          u.name ILIKE $${values.length}
          OR u.email ILIKE $${values.length}
          OR COALESCE(staff_assignment.bio, '') ILIKE $${values.length}
          OR COALESCE(staff_salon.name, owner_salon.salon_name, '') ILIKE $${values.length}
          OR COALESCE(staff_salon.city, owner_salon.salon_city, '') ILIKE $${values.length}
        )
      `);
    }

    return {
      values,
      whereClause: `WHERE ${clauses.join(' AND ')}`,
    };
  }

  private getAdminUserCtes() {
    return `
      WITH staff_assignment AS (
        SELECT DISTINCT ON (st.user_id)
          st.user_id,
          st.id AS staff_id,
          st.salon_id,
          st.role AS staff_role,
          st.bio,
          st.photo_url,
          st.is_active AS staff_is_active,
          st.created_at
        FROM staff st
        ORDER BY st.user_id, st.is_active DESC, st.created_at DESC
      ),
      owner_salon AS (
        SELECT DISTINCT ON (s.owner_id)
          s.owner_id,
          s.id AS salon_id,
          s.name AS salon_name,
          s.city AS salon_city,
          s.address AS salon_address,
          s.district AS salon_district,
          s.is_active AS salon_is_active,
          s.created_at
        FROM salons s
        ORDER BY s.owner_id, s.is_active DESC, s.created_at DESC
      ),
      latest_subscription AS (
        SELECT DISTINCT ON (sub.salon_id)
          sub.salon_id,
          p.tier AS package_tier
        FROM subscriptions sub
        INNER JOIN packages p ON p.id = sub.package_id
        ORDER BY
          sub.salon_id,
          CASE
            WHEN sub.status = 'active' THEN 0
            WHEN sub.status = 'pending' THEN 1
            ELSE 2
          END,
          sub.created_at DESC
      ),
      today_reservations AS (
        SELECT
          st.user_id,
          COUNT(*) FILTER (
            WHERE r.slot_start >= CURRENT_DATE
              AND r.slot_start < CURRENT_DATE + INTERVAL '1 day'
              AND r.status IN ('pending', 'confirmed')
          )::int AS reservation_count
        FROM staff st
        LEFT JOIN reservations r ON r.staff_id = st.id
        GROUP BY st.user_id
      )
    `;
  }

  private getAdminUserFromClause() {
    return `
      FROM (
        SELECT
          id,
          name,
          email,
          phone,
          role,
          is_active,
          created_at,
          updated_at
        FROM personnel
        UNION ALL
        SELECT
          id,
          name,
          email,
          phone,
          'super_admin'::varchar(20) AS role,
          is_active,
          created_at,
          updated_at
        FROM platform_admins
      ) u
      LEFT JOIN staff_assignment ON staff_assignment.user_id = u.id
      LEFT JOIN salons staff_salon ON staff_salon.id = staff_assignment.salon_id
      LEFT JOIN owner_salon ON owner_salon.owner_id = u.id
      LEFT JOIN latest_subscription
        ON latest_subscription.salon_id = COALESCE(staff_assignment.salon_id, owner_salon.salon_id)
      LEFT JOIN today_reservations ON today_reservations.user_id = u.id
    `;
  }

  private getAdminRoleSql() {
    return `
      CASE
        WHEN u.role = 'super_admin' THEN 'manager'
        WHEN u.role = 'owner' THEN 'owner'
        ELSE 'employee'
      END
    `;
  }

  private getAdminStatusSql() {
    return `
      CASE
        WHEN u.is_active = FALSE AND u.role IN ('super_admin', 'owner') THEN 'suspended'
        WHEN u.is_active = FALSE THEN 'inactive'
        WHEN staff_assignment.staff_id IS NOT NULL AND staff_assignment.staff_is_active = FALSE THEN 'inactive'
        WHEN COALESCE(today_reservations.reservation_count, 0) > 0 THEN 'busy'
        ELSE 'active'
      END
    `;
  }

  private getAdminStatusRankSql() {
    return `
      CASE
        WHEN ${this.getAdminStatusSql()} = 'active' THEN 0
        WHEN ${this.getAdminStatusSql()} = 'busy' THEN 1
        WHEN ${this.getAdminStatusSql()} = 'inactive' THEN 2
        ELSE 3
      END
    `;
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
  must_change_password?: boolean | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AdminUserRow extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  admin_role: AdminUserSummary['role'];
  staff_role: AdminUserSummary['staffRole'];
  staff_bio: string | null;
  avatar_url: string | null;
  salon_id: string | null;
  salon_name: string;
  salon_location: string;
  city: string;
  salon_is_active: boolean | null;
  package_tier: AdminUserSummary['packageTier'];
  today_reservation_count: number;
  admin_status: AdminUserSummary['status'];
  created_at: Date;
  updated_at: Date;
}

interface AdminUserOverviewRow extends QueryResultRow {
  total_users: number;
  active_today: number;
  new_last_30_days: number;
  active_rate: number;
}

interface AdminUserFilterOptionRow extends QueryResultRow {
  id: string;
  name: string;
}

interface AdminUserCityRow extends QueryResultRow {
  city: string;
}
