import { Inject, Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { SalonOwnershipService } from '../salon/salon-ownership.service';
import {
  SALON_CATALOG_SERVICE,
  type SalonCatalogServiceContract,
} from '../salon/interfaces/salon.contracts';
import { CreateSalonServiceDto } from './dto/create-salon-service.dto';
import { UpdateSalonServiceDto } from './dto/update-salon-service.dto';
import {
  salonServiceInvalidFieldError,
  salonServiceNotFoundError,
  salonServiceSalonNotFoundError,
} from './errors/salon-service.errors';
import type {
  SalonServiceCatalogServiceContract,
  SalonServiceItem,
  SalonServiceProvisioningServiceContract,
} from './interfaces/salon-service.types';
import { SalonServiceRepository } from './repositories/salon-service.repository';

@Injectable()
export class SalonServiceService
  implements
    SalonServiceCatalogServiceContract,
    SalonServiceProvisioningServiceContract
{
  constructor(
    private readonly salonServiceRepository: SalonServiceRepository,
    private readonly salonOwnershipService: SalonOwnershipService,
    @Inject(SALON_CATALOG_SERVICE)
    private readonly salonCatalogService: SalonCatalogServiceContract,
  ) {}

  async findActiveBySalonId(salonId: string): Promise<SalonServiceItem[]> {
    const salon = await this.salonCatalogService.findActiveById(salonId);

    if (!salon) {
      throw salonServiceSalonNotFoundError();
    }

    return this.salonServiceRepository.findBySalonId(salonId);
  }

  async findOwnedBySalonId(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<SalonServiceItem[]> {
    await this.salonOwnershipService.requireOwnedSalon(currentUser, salonId);
    return this.salonServiceRepository.findBySalonId(salonId, {
      includeInactive: true,
    });
  }

  async create(
    currentUser: JwtPayload,
    salonId: string,
    createSalonServiceDto: CreateSalonServiceDto,
  ): Promise<SalonServiceItem> {
    await this.salonOwnershipService.requireOwnedSalon(currentUser, salonId);

    return this.createOwnedSalonService(salonId, {
      name: createSalonServiceDto.name,
      description: createSalonServiceDto.description,
      durationMinutes: createSalonServiceDto.durationMinutes,
      priceAmount: createSalonServiceDto.priceAmount,
      isActive: createSalonServiceDto.isActive,
    });
  }

  async createOwnedSalonService(
    salonId: string,
    input: {
      name: string;
      description?: string | null;
      durationMinutes: number;
      priceAmount: number;
      isActive?: boolean;
    },
  ): Promise<SalonServiceItem> {
    return this.salonServiceRepository.create({
      salonId,
      name: this.normalizeRequiredString(input.name, 'name'),
      description: this.normalizeOptionalString(input.description) ?? null,
      durationMinutes: this.normalizeDuration(input.durationMinutes),
      priceAmount: this.normalizePrice(input.priceAmount),
      isActive: input.isActive ?? true,
    });
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    serviceId: string,
    updateSalonServiceDto: UpdateSalonServiceDto,
  ): Promise<SalonServiceItem> {
    await this.salonOwnershipService.requireOwnedSalon(currentUser, salonId);
    const existingService = await this.requireOwnedService(salonId, serviceId);

    const updatedService = await this.salonServiceRepository.update(
      existingService.id,
      {
        ...(updateSalonServiceDto.name !== undefined
          ? {
              name: this.normalizeRequiredString(
                updateSalonServiceDto.name,
                'name',
              ),
            }
          : {}),
        ...(updateSalonServiceDto.description !== undefined
          ? {
              description:
                this.normalizeOptionalString(
                  updateSalonServiceDto.description,
                ) ?? null,
            }
          : {}),
        ...(updateSalonServiceDto.durationMinutes !== undefined
          ? {
              durationMinutes: this.normalizeDuration(
                updateSalonServiceDto.durationMinutes,
              ),
            }
          : {}),
        ...(updateSalonServiceDto.priceAmount !== undefined
          ? {
              priceAmount: this.normalizePrice(
                updateSalonServiceDto.priceAmount,
              ),
            }
          : {}),
        ...(updateSalonServiceDto.isActive !== undefined
          ? {
              isActive: updateSalonServiceDto.isActive,
            }
          : {}),
      },
    );

    if (!updatedService) {
      throw salonServiceNotFoundError();
    }

    return updatedService;
  }

  async delete(
    currentUser: JwtPayload,
    salonId: string,
    serviceId: string,
  ): Promise<{ deleted: true }> {
    await this.salonOwnershipService.requireOwnedSalon(currentUser, salonId);
    await this.requireOwnedService(salonId, serviceId);

    const deleted = await this.salonServiceRepository.delete(serviceId);

    if (!deleted) {
      throw salonServiceNotFoundError();
    }

    return { deleted: true };
  }

  private async requireOwnedService(
    salonId: string,
    serviceId: string,
  ): Promise<SalonServiceItem> {
    const service = await this.salonServiceRepository.findById(serviceId);

    if (!service || service.salonId !== salonId) {
      throw salonServiceNotFoundError();
    }

    return service;
  }

  private normalizeRequiredString(value: string, fieldName: string): string {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw salonServiceInvalidFieldError(fieldName);
    }

    return normalizedValue;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }

  private normalizeDuration(value: number): number {
    if (!Number.isInteger(value) || value < 5 || value > 480) {
      throw salonServiceInvalidFieldError('durationMinutes');
    }

    return value;
  }

  private normalizePrice(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value > 100000) {
      throw salonServiceInvalidFieldError('priceAmount');
    }

    return value;
  }
}
