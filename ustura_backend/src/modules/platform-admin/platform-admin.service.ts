import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../database/database.service';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { SalonService } from '../salon/salon.service';
import { UserService } from '../user/user.service';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { RejectOwnerApplicationDto } from './dto/reject-owner-application.dto';
import {
  ownerApplicationAlreadyExistsError,
  ownerApplicationNotFoundError,
} from './errors/platform-admin.errors';
import type {
  OwnerApplication,
  OwnerApplicationRecord,
} from './interfaces/platform-admin.types';
import { PlatformAdminPolicy } from './policies/platform-admin.policy';
import { PlatformAdminRepository } from './repositories/platform-admin.repository';

@Injectable()
export class PlatformAdminService {
  private readonly passwordCost = 12;

  constructor(
    private readonly platformAdminRepository: PlatformAdminRepository,
    private readonly platformAdminPolicy: PlatformAdminPolicy,
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly salonService: SalonService,
    private readonly domainEventBus: DomainEventBus,
  ) {}

  async createOwnerApplication(
    createOwnerApplicationDto: CreateOwnerApplicationDto,
  ): Promise<OwnerApplication> {
    const applicantEmail = this.normalizeEmail(
      createOwnerApplicationDto.applicantEmail,
    );
    const existingApplication =
      await this.platformAdminRepository.findPendingByApplicantEmail(
        applicantEmail,
      );

    if (existingApplication) {
      throw ownerApplicationAlreadyExistsError();
    }

    const normalizedSalonInput = this.salonService.prepareOwnedSalonInput({
      name: createOwnerApplicationDto.salonName,
      address: createOwnerApplicationDto.salonAddress,
      city: createOwnerApplicationDto.salonCity,
      district: createOwnerApplicationDto.salonDistrict,
      photoUrl: createOwnerApplicationDto.salonPhotoUrl,
      workingHours: createOwnerApplicationDto.salonWorkingHours,
    });
    const createdApplication = await this.platformAdminRepository.create({
      applicantName: createOwnerApplicationDto.applicantName.trim(),
      applicantEmail,
      applicantPhone: createOwnerApplicationDto.applicantPhone.trim(),
      passwordHash: await bcrypt.hash(
        createOwnerApplicationDto.password,
        this.passwordCost,
      ),
      salonName: normalizedSalonInput.name,
      salonAddress: normalizedSalonInput.address,
      salonCity: normalizedSalonInput.city,
      salonDistrict: normalizedSalonInput.district,
      salonPhotoUrl: normalizedSalonInput.photoUrl,
      salonWorkingHours: normalizedSalonInput.workingHours,
      notes: this.normalizeOptionalString(createOwnerApplicationDto.notes) ?? null,
    });

    return this.toOwnerApplication(createdApplication);
  }

  async listOwnerApplications(
    currentUser: JwtPayload,
  ): Promise<OwnerApplication[]> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    const applications = await this.platformAdminRepository.findAll();
    return applications.map((application) => this.toOwnerApplication(application));
  }

  async approveOwnerApplication(
    currentUser: JwtPayload,
    applicationId: string,
  ): Promise<OwnerApplication> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    const approvedApplication = await this.databaseService.transaction(async (transaction) => {
      const application =
        await this.platformAdminRepository.findByIdForUpdate(
          applicationId,
          transaction,
        );

      if (!application) {
        throw ownerApplicationNotFoundError();
      }

      this.platformAdminPolicy.assertPendingApplication(application);

      const owner = await this.userService.createOwner(
        {
          name: application.applicantName,
          email: application.applicantEmail,
          phone: application.applicantPhone,
          passwordHash: application.passwordHash,
        },
        transaction,
      );
      const salon = await this.salonService.createOwnedSalon(
        owner.id,
        {
          name: application.salonName,
          address: application.salonAddress,
          city: application.salonCity,
          district: application.salonDistrict,
          photoUrl: application.salonPhotoUrl,
          workingHours: application.salonWorkingHours,
        },
        transaction,
      );
      const approvedApplication =
        await this.platformAdminRepository.markApproved(
          application.id,
          {
            reviewedByUserId: currentUser.sub,
            approvedOwnerUserId: owner.id,
            approvedSalonId: salon.id,
          },
          transaction,
        );

      if (!approvedApplication) {
        throw ownerApplicationNotFoundError();
      }

      return this.toOwnerApplication(approvedApplication);
    });

    this.domainEventBus.publish({
      name: 'owner.approved',
      occurredAt: new Date(),
      payload: {
        applicationId: approvedApplication.id,
        applicantName: approvedApplication.applicantName,
        applicantEmail: approvedApplication.applicantEmail,
        salonName: approvedApplication.salonName,
        approvedAt: (approvedApplication.reviewedAt ?? new Date()).toISOString(),
        reviewedByUserId: approvedApplication.reviewedByUserId,
        approvedOwnerUserId: approvedApplication.approvedOwnerUserId,
        approvedSalonId: approvedApplication.approvedSalonId,
      },
    });

    return approvedApplication;
  }

  async rejectOwnerApplication(
    currentUser: JwtPayload,
    applicationId: string,
    rejectOwnerApplicationDto: RejectOwnerApplicationDto,
  ): Promise<OwnerApplication> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    return this.databaseService.transaction(async (transaction) => {
      const application =
        await this.platformAdminRepository.findByIdForUpdate(
          applicationId,
          transaction,
        );

      if (!application) {
        throw ownerApplicationNotFoundError();
      }

      this.platformAdminPolicy.assertPendingApplication(application);

      const rejectedApplication =
        await this.platformAdminRepository.markRejected(
          application.id,
          currentUser.sub,
          rejectOwnerApplicationDto.reason.trim(),
          transaction,
        );

      if (!rejectedApplication) {
        throw ownerApplicationNotFoundError();
      }

      return this.toOwnerApplication(rejectedApplication);
    });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }

  private toOwnerApplication(
    application: OwnerApplicationRecord,
  ): OwnerApplication {
    const { passwordHash: _passwordHash, ...ownerApplication } = application;
    return ownerApplication;
  }
}
