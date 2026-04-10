import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  phoneAlreadyExistsError,
  userNotFoundError,
} from './errors/user.errors';
import type { User, UserProfile } from './interfaces/user.types';
import { UserAccountPolicy } from './policies/user-account.policy';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccountPolicy: UserAccountPolicy,
  ) {}

  async getProfileById(id: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw userNotFoundError();
    }

    return this.toProfile(user);
  }

  async updateProfile(id: string, input: UpdateUserDto): Promise<UserProfile> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw userNotFoundError();
    }

    const normalizedInput = this.normalizeProfileUpdate(input);
    this.userAccountPolicy.assertProfileUpdateRequirements(normalizedInput);

    if (normalizedInput.phone && normalizedInput.phone !== user.phone) {
      const userWithPhone = await this.userRepository.findByPhone(
        normalizedInput.phone,
      );

      if (userWithPhone && userWithPhone.id !== id) {
        throw phoneAlreadyExistsError();
      }
    }

    if (Object.keys(normalizedInput).length === 0) {
      return this.toProfile(user);
    }

    const updatedUser = await this.userRepository.updateProfile(id, normalizedInput);

    if (!updatedUser) {
      throw userNotFoundError();
    }

    return this.toProfile(updatedUser);
  }

  private normalizeProfileUpdate(input: UpdateUserDto): UpdateUserDto {
    const normalizedInput: UpdateUserDto = {};

    if (input.name !== undefined) {
      normalizedInput.name = input.name.trim();
    }

    if (input.phone !== undefined) {
      normalizedInput.phone = input.phone.trim();
    }

    return normalizedInput;
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
