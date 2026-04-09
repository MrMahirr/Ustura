import { Injectable } from '@nestjs/common';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { SalonRepository } from '../salon/repositories/salon.repository';
import { UserService } from '../user/user.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  staffNotFoundError,
  staffSalonNotFoundError,
  staffUserNotFoundError,
  staffAlreadyAssignedError,
} from './errors/staff.errors';
import type { StaffMember, UpdateStaffInput } from './interfaces/staff.types';
import { StaffPolicy } from './policies/staff.policy';
import { StaffRepository } from './repositories/staff.repository';

@Injectable()
export class StaffService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly salonRepository: SalonRepository,
    private readonly userService: UserService,
    private readonly staffPolicy: StaffPolicy,
  ) {}

  async findBySalonId(salonId: string): Promise<StaffMember[]> {
    await this.requireSalon(salonId);
    return this.staffRepository.findActiveBySalonId(salonId);
  }

  async create(
    currentUser: JwtPayload,
    salonId: string,
    createStaffDto: CreateStaffDto,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const user = await this.requireUser(createStaffDto.user_id);
    this.staffPolicy.assertCanAssignUserToRole(user, createStaffDto.role);

    const existingStaffMember = await this.staffRepository.findByUserIdAndSalon(
      createStaffDto.user_id,
      salonId,
    );

    this.staffPolicy.assertCanCreate(existingStaffMember);

    const normalizedInput = {
      salonId,
      userId: createStaffDto.user_id,
      role: createStaffDto.role,
      bio: this.normalizeOptionalString(createStaffDto.bio) ?? null,
      photoUrl: this.normalizeOptionalString(createStaffDto.photo_url) ?? null,
    } as const;

    if (existingStaffMember) {
      const reactivatedStaffMember = await this.staffRepository.update(
        existingStaffMember.id,
        {
          role: normalizedInput.role,
          bio: normalizedInput.bio,
          photoUrl: normalizedInput.photoUrl,
          isActive: true,
        },
      );

      if (!reactivatedStaffMember) {
        throw staffNotFoundError();
      }

      return reactivatedStaffMember;
    }

    try {
      return await this.staffRepository.create(normalizedInput);
    } catch (error) {
      if (error instanceof DatabaseConstraintViolationError) {
        throw staffAlreadyAssignedError();
      }

      throw error;
    }
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
    updateStaffDto: UpdateStaffDto,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const existingStaffMember = await this.requireStaffMember(salonId, staffId);
    const nextRole = updateStaffDto.role ?? existingStaffMember.role;

    if (updateStaffDto.role !== undefined || updateStaffDto.is_active === true) {
      const user = await this.requireUser(existingStaffMember.userId);
      this.staffPolicy.assertCanAssignUserToRole(user, nextRole);
    }

    const normalizedInput = this.normalizeUpdateInput(updateStaffDto);

    if (Object.keys(normalizedInput).length === 0) {
      return existingStaffMember;
    }

    const updatedStaffMember = await this.staffRepository.update(
      existingStaffMember.id,
      normalizedInput,
    );

    if (!updatedStaffMember) {
      throw staffNotFoundError();
    }

    return updatedStaffMember;
  }

  async delete(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const existingStaffMember = await this.requireStaffMember(salonId, staffId);

    if (!existingStaffMember.isActive) {
      return existingStaffMember;
    }

    const deactivatedStaffMember = await this.staffRepository.deactivate(
      existingStaffMember.id,
    );

    if (!deactivatedStaffMember) {
      throw staffNotFoundError();
    }

    return deactivatedStaffMember;
  }

  private async requireSalon(salonId: string) {
    const salon = await this.salonRepository.findById(salonId);

    if (!salon?.isActive) {
      throw staffSalonNotFoundError();
    }

    return salon;
  }

  private async requireStaffMember(
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const staffMember = await this.staffRepository.findById(staffId);

    if (!staffMember || staffMember.salonId !== salonId) {
      throw staffNotFoundError();
    }

    return staffMember;
  }

  private async requireUser(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw staffUserNotFoundError();
    }

    return user;
  }

  private normalizeUpdateInput(updateStaffDto: UpdateStaffDto): UpdateStaffInput {
    const normalizedInput: UpdateStaffInput = {};

    if (updateStaffDto.role !== undefined) {
      normalizedInput.role = updateStaffDto.role;
    }

    if (updateStaffDto.bio !== undefined) {
      normalizedInput.bio = this.normalizeOptionalString(updateStaffDto.bio) ?? null;
    }

    if (updateStaffDto.photo_url !== undefined) {
      normalizedInput.photoUrl =
        this.normalizeOptionalString(updateStaffDto.photo_url) ?? null;
    }

    if (updateStaffDto.is_active !== undefined) {
      normalizedInput.isActive = updateStaffDto.is_active;
    }

    return normalizedInput;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
