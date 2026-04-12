import { Injectable } from '@nestjs/common';
import { userNotFoundError } from './errors/user.errors';
import { FindAdminUsersQueryDto } from './dto/find-admin-users-query.dto';
import type { AdminUserListResult, AdminUserSummary } from './interfaces/user.types';
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

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
