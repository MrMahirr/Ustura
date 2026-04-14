import { Injectable } from '@nestjs/common';
import { userNotFoundError } from './errors/user.errors';
import { FindAdminUsersQueryDto } from './dto/find-admin-users-query.dto';
import type {
  AdminUserDetailResponse,
  AdminUserListResult,
  AdminUserSummary,
} from './interfaces/user.types';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserAdminQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAdminUsers(query: FindAdminUsersQueryDto): Promise<AdminUserListResult> {
    const filters = {
      search: this.normalizeOptionalString(query.search),
      role: query.role,
      status: query.status,
      salonId: query.salonId,
      city: this.normalizeOptionalString(query.city),
    };

    const [items, overview, filterOptions] = await Promise.all([
      this.userRepository.findAdminUsers(filters),
      this.userRepository.getAdminOverview(),
      this.userRepository.findAdminFilterOptions(),
    ]);

    return {
      items,
      overview,
      filters: filterOptions,
    };
  }

  async findAdminUserById(userId: string): Promise<AdminUserSummary> {
    const user = await this.userRepository.findAdminUserById(userId);

    if (!user) {
      throw userNotFoundError();
    }

    return user;
  }

  async findAdminUserDetail(userId: string): Promise<AdminUserDetailResponse> {
    const user = await this.userRepository.findAdminUserById(userId);

    if (!user) {
      throw userNotFoundError();
    }

    const [stats, recentReservations, recentActivity, workingHours] =
      await Promise.all([
        this.userRepository.findStatsForUser(userId),
        this.userRepository.findReservationsForUser(userId, 10),
        this.userRepository.findActivityForUser(userId, 10),
        this.userRepository.findWorkingHoursForUser(userId),
      ]);

    return {
      user,
      stats,
      recentReservations,
      recentActivity,
      workingHours,
    };
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
