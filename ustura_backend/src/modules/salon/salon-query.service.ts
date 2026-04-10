import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { salonNotFoundError } from './errors/salon.errors';
import type {
  OwnedSalonSummary,
  Salon,
  SalonCatalogServiceContract,
  SalonPublicDetail,
  SalonPublicSummary,
} from './interfaces/salon.types';
import { SalonPolicy } from './policies/salon.policy';
import { SalonProjectionService } from './salon-projection.service';
import { SalonRepository } from './repositories/salon.repository';

@Injectable()
export class SalonQueryService implements SalonCatalogServiceContract {
  constructor(
    private readonly salonRepository: SalonRepository,
    private readonly salonPolicy: SalonPolicy,
    private readonly salonProjectionService: SalonProjectionService,
  ) {}

  async findPublicList(
    query: FindSalonsQueryDto,
  ): Promise<SalonPublicSummary[]> {
    const salons = await this.salonRepository.findAll({
      city: this.normalizeOptionalString(query.city),
      search: this.normalizeOptionalString(query.search),
    });

    return salons.map((salon) => this.salonProjectionService.toPublicSummary(salon));
  }

  async findOwned(currentUser: JwtPayload): Promise<OwnedSalonSummary[]> {
    this.salonPolicy.assertCanManage(currentUser);

    const salons = await this.salonRepository.findByOwnerId(currentUser.sub);
    return salons.map((salon) => this.salonProjectionService.toOwnedSummary(salon));
  }

  async findPublicById(id: string): Promise<SalonPublicDetail> {
    const salon = await this.findActiveById(id);

    if (!salon) {
      throw salonNotFoundError();
    }

    return this.salonProjectionService.toPublicDetail(salon);
  }

  async findActiveById(id: string): Promise<Salon | null> {
    const salon = await this.salonRepository.findById(id);

    if (!salon?.isActive) {
      return null;
    }

    return salon;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
