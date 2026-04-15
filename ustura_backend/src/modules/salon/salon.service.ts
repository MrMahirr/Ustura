import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type { SqlQueryExecutor } from '../../database/database.types';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import type {
  CreateOwnedSalonDraft,
  OwnedSalonDetail,
  OwnedSalonSummary,
  PaginatedResult,
  PreparedOwnedSalonInput,
  Salon,
  SalonPublicDetail,
  SalonPublicSummary,
} from './interfaces/salon.types';
import { SalonManagementService } from './salon-management.service';
import { SalonQueryService } from './salon-query.service';

@Injectable()
export class SalonService {
  constructor(
    private readonly salonQueryService: SalonQueryService,
    private readonly salonManagementService: SalonManagementService,
  ) {}

  async findAll(
    query: FindSalonsQueryDto,
  ): Promise<PaginatedResult<SalonPublicSummary>> {
    return this.salonQueryService.findPublicList(query);
  }

  async findPublicCities(): Promise<string[]> {
    return this.salonQueryService.findPublicCities();
  }

  async findOwned(currentUser: JwtPayload): Promise<OwnedSalonSummary[]> {
    return this.salonQueryService.findOwned(currentUser);
  }

  async findById(id: string): Promise<SalonPublicDetail> {
    return this.salonQueryService.findPublicById(id);
  }

  async findActiveById(id: string): Promise<Salon | null> {
    return this.salonQueryService.findActiveById(id);
  }

  async create(
    currentUser: JwtPayload,
    createSalonDto: CreateSalonDto,
  ): Promise<OwnedSalonDetail> {
    return this.salonManagementService.create(currentUser, createSalonDto);
  }

  prepareOwnedSalonInput(
    input: CreateOwnedSalonDraft,
  ): PreparedOwnedSalonInput {
    return this.salonManagementService.prepareOwnedSalonInput(input);
  }

  async createOwnedSalon(
    ownerId: string,
    input: CreateOwnedSalonDraft,
    executor?: SqlQueryExecutor,
  ): Promise<Salon> {
    return this.salonManagementService.createOwnedSalon(
      ownerId,
      input,
      executor,
    );
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    updateSalonDto: UpdateSalonDto,
  ): Promise<OwnedSalonDetail> {
    return this.salonManagementService.update(
      currentUser,
      salonId,
      updateSalonDto,
    );
  }

  async remove(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<OwnedSalonDetail> {
    return this.salonManagementService.remove(currentUser, salonId);
  }
}
