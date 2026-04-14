import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { FindAdminSalonsQueryDto } from './dto/find-admin-salons-query.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { salonNotFoundError } from './errors/salon.errors';
import type {
  AdminSalonDetail,
  AdminSalonSummary,
  PaginatedAdminSalonResult,
  OwnedSalonSummary,
  PaginatedResult,
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
  ): Promise<PaginatedResult<SalonPublicSummary>> {
    const result = await this.salonRepository.findPublicPage({
      city: this.normalizeOptionalString(query.city),
      search: this.normalizeOptionalString(query.search),
      page: query.page,
      pageSize: query.pageSize,
    });

    return {
      items: result.items.map((salon) =>
        this.salonProjectionService.toPublicSummary(salon),
      ),
      pagination: result.pagination,
    };
  }

  async findPublicCities(): Promise<string[]> {
    return this.salonRepository.findDistinctCities();
  }

  async findAdminList(
    query: FindAdminSalonsQueryDto,
  ): Promise<PaginatedAdminSalonResult> {
    const result = await this.salonRepository.findAdminPage({
      search: this.normalizeOptionalString(query.search),
      city: this.normalizeOptionalString(query.city),
      status: query.status,
      sort: query.sort,
      page: query.page,
      pageSize: query.pageSize,
    });
    const overview = await this.salonRepository.getAdminOverview();

    return {
      items: result.items.map((salon) => this.toAdminSummary(salon)),
      pagination: result.pagination,
      overview,
    };
  }

  async findAdminCities(): Promise<string[]> {
    return this.salonRepository.findAdminDistinctCities();
  }

  async findAdminSalonById(id: string): Promise<AdminSalonDetail> {
    const detail = await this.salonRepository.findAdminDetailById(id);

    if (!detail) {
      throw salonNotFoundError();
    }

    return detail;
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

  private toAdminSummary(salon: AdminSalonSummary): AdminSalonSummary {
    return salon;
  }
}
