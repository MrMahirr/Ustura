import { Injectable } from '@nestjs/common';
import type {
  OwnedSalonDetail,
  OwnedSalonSummary,
  Salon,
  SalonPublicDetail,
  SalonPublicSummary,
} from './interfaces/salon.types';

@Injectable()
export class SalonProjectionService {
  toPublicSummary(salon: Salon): SalonPublicSummary {
    return {
      id: salon.id,
      name: salon.name,
      city: salon.city,
      district: salon.district,
      photoUrl: salon.photoUrl,
    };
  }

  toPublicDetail(salon: Salon): SalonPublicDetail {
    return {
      ...this.toPublicSummary(salon),
      address: salon.address,
      workingHours: salon.workingHours,
    };
  }

  toOwnedSummary(salon: Salon): OwnedSalonSummary {
    return {
      id: salon.id,
      name: salon.name,
      city: salon.city,
      district: salon.district,
      photoUrl: salon.photoUrl,
      isActive: salon.isActive,
      updatedAt: salon.updatedAt,
    };
  }

  toOwnedDetail(salon: Salon): OwnedSalonDetail {
    return {
      ...this.toOwnedSummary(salon),
      address: salon.address,
      workingHours: salon.workingHours,
      createdAt: salon.createdAt,
    };
  }
}
