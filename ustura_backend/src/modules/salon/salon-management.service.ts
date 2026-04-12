import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type { SqlQueryExecutor } from '../../database/database.types';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { salonInvalidFieldError, salonNotFoundError } from './errors/salon.errors';
import type {
  CreateOwnedSalonDraft,
  OwnedSalonDetail,
  PreparedOwnedSalonInput,
  Salon,
  SalonOwnerProvisioningServiceContract,
  UpdateSalonInput,
} from './interfaces/salon.types';
import { SalonPolicy } from './policies/salon.policy';
import { SalonProjectionService } from './salon-projection.service';
import { SalonOwnershipService } from './salon-ownership.service';
import { SalonWorkingHoursService } from './salon-working-hours.service';
import { SalonRepository } from './repositories/salon.repository';

@Injectable()
export class SalonManagementService implements SalonOwnerProvisioningServiceContract {
  constructor(
    private readonly salonRepository: SalonRepository,
    private readonly salonPolicy: SalonPolicy,
    private readonly salonWorkingHoursService: SalonWorkingHoursService,
    private readonly salonOwnershipService: SalonOwnershipService,
    private readonly salonProjectionService: SalonProjectionService,
  ) {}

  async create(
    currentUser: JwtPayload,
    createSalonDto: CreateSalonDto,
  ): Promise<OwnedSalonDetail> {
    this.salonPolicy.assertCanManage(currentUser);

    const salon = await this.createOwnedSalon(currentUser.sub, {
      name: createSalonDto.name,
      address: createSalonDto.address,
      city: createSalonDto.city,
      district: createSalonDto.district,
      photoUrl: createSalonDto.photoUrl,
      workingHours: createSalonDto.workingHours,
    });

    return this.salonProjectionService.toOwnedDetail(salon);
  }

  prepareOwnedSalonInput(
    input: CreateOwnedSalonDraft,
  ): PreparedOwnedSalonInput {
    return {
      name: this.normalizeRequiredString(input.name, 'name'),
      address: this.normalizeRequiredString(input.address, 'address'),
      city: this.normalizeRequiredString(input.city, 'city'),
      district: this.normalizeOptionalString(input.district) ?? null,
      photoUrl: this.normalizeOptionalString(input.photoUrl) ?? null,
      workingHours: this.salonWorkingHoursService.normalize(input.workingHours, {
        requireAtLeastOneOpenDay: true,
      }),
    };
  }

  async createOwnedSalon(
    ownerId: string,
    input: CreateOwnedSalonDraft,
    executor?: SqlQueryExecutor,
  ): Promise<Salon> {
    return this.salonRepository.create(
      {
        ownerId,
        ...this.prepareOwnedSalonInput(input),
      },
      executor,
    );
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    updateSalonDto: UpdateSalonDto,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );
    const updateInput = this.buildUpdateInput(existingSalon, updateSalonDto);
    this.salonOwnershipService.assertCanUpdate(existingSalon, updateInput);

    if (Object.keys(updateInput).length === 0) {
      return this.salonProjectionService.toOwnedDetail(existingSalon);
    }

    const updatedSalon = await this.salonRepository.update(salonId, updateInput);

    if (!updatedSalon) {
      throw salonNotFoundError();
    }

    return this.salonProjectionService.toOwnedDetail(updatedSalon);
  }

  async remove(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );

    if (!existingSalon.isActive) {
      return this.salonProjectionService.toOwnedDetail(existingSalon);
    }

    const salon = await this.salonRepository.deactivate(salonId);

    if (!salon) {
      throw salonNotFoundError();
    }

    return this.salonProjectionService.toOwnedDetail(salon);
  }

  private buildUpdateInput(
    existingSalon: Salon,
    updateSalonDto: UpdateSalonDto,
  ): UpdateSalonInput {
    return {
      ...(updateSalonDto.name !== undefined
        ? {
            name: this.normalizeRequiredString(updateSalonDto.name, 'name'),
          }
        : {}),
      ...(updateSalonDto.address !== undefined
        ? {
            address: this.normalizeRequiredString(
              updateSalonDto.address,
              'address',
            ),
          }
        : {}),
      ...(updateSalonDto.city !== undefined
        ? {
            city: this.normalizeRequiredString(updateSalonDto.city, 'city'),
          }
        : {}),
      ...(updateSalonDto.district !== undefined
        ? {
            district: this.normalizeOptionalString(updateSalonDto.district) ?? null,
          }
        : {}),
      ...(updateSalonDto.photoUrl !== undefined
        ? {
            photoUrl: this.normalizeOptionalString(updateSalonDto.photoUrl) ?? null,
          }
        : {}),
      ...(updateSalonDto.workingHours !== undefined
        ? {
            workingHours: this.salonWorkingHoursService.normalize(
              updateSalonDto.workingHours,
              {
                base: existingSalon.workingHours,
                requireAtLeastOneOpenDay: true,
              },
            ),
          }
        : {}),
      ...(updateSalonDto.isActive !== undefined
        ? {
            isActive: updateSalonDto.isActive,
          }
        : {}),
    };
  }

  private normalizeRequiredString(value: string, fieldName: string): string {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw salonInvalidFieldError(fieldName);
    }

    return normalizedValue;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
