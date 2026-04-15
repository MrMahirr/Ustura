import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import {
  SALON_CATALOG_SERVICE,
  type SalonCatalogServiceContract,
} from '../salon/interfaces/salon.contracts';
import { Inject } from '@nestjs/common';
import { StaffPolicy } from './policies/staff.policy';
import { StaffRepository } from './repositories/staff.repository';
import {
  staffInvalidMediaFileError,
  staffNotFoundError,
  staffSalonNotFoundError,
  staffSelfManagementForbiddenError,
} from './errors/staff.errors';
import type { StaffMember } from './interfaces/staff.types';

interface UploadedImageFile {
  originalname?: string;
  mimetype?: string;
  size?: number;
  buffer?: Buffer;
}

interface SavedMediaFile {
  absoluteFilePath: string;
  publicUrl: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_ROOT = join(process.cwd(), 'uploads');
const STAFF_UPLOAD_ROOT = join(UPLOAD_ROOT, 'staff');
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Injectable()
export class StaffMediaService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly staffPolicy: StaffPolicy,
    @Inject(SALON_CATALOG_SERVICE)
    private readonly salonCatalogService: SalonCatalogServiceContract,
  ) {}

  async uploadManagedPhoto(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
  ): Promise<StaffMember> {
    const staffMember = await this.requireManagedStaffMember(
      currentUser,
      salonId,
      staffId,
    );

    return this.replaceStaffPhoto(staffMember, file, publicBaseUrl);
  }

  async removeManagedPhoto(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const staffMember = await this.requireManagedStaffMember(
      currentUser,
      salonId,
      staffId,
    );

    return this.clearStaffPhoto(staffMember);
  }

  async uploadOwnPhoto(
    currentUser: JwtPayload,
    staffId: string,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
  ): Promise<StaffMember> {
    this.staffPolicy.assertCanViewOwnAssignments(currentUser);
    const staffMember = await this.requireSelfManagedStaffMember(
      currentUser,
      staffId,
    );

    return this.replaceStaffPhoto(staffMember, file, publicBaseUrl);
  }

  async removeOwnPhoto(
    currentUser: JwtPayload,
    staffId: string,
  ): Promise<StaffMember> {
    this.staffPolicy.assertCanViewOwnAssignments(currentUser);
    const staffMember = await this.requireSelfManagedStaffMember(
      currentUser,
      staffId,
    );

    return this.clearStaffPhoto(staffMember);
  }

  private async requireManagedStaffMember(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const salon = await this.salonCatalogService.findActiveById(salonId);

    if (!salon) {
      throw staffSalonNotFoundError();
    }

    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const staffMember = await this.staffRepository.findById(staffId);

    if (!staffMember || staffMember.salonId !== salonId) {
      throw staffNotFoundError();
    }

    return staffMember;
  }

  private async requireSelfManagedStaffMember(
    currentUser: JwtPayload,
    staffId: string,
  ): Promise<StaffMember> {
    const staffMember = await this.staffRepository.findById(staffId);

    if (!staffMember || !staffMember.isActive) {
      throw staffNotFoundError();
    }

    if (staffMember.userId !== currentUser.sub) {
      throw staffSelfManagementForbiddenError();
    }

    return staffMember;
  }

  private async replaceStaffPhoto(
    staffMember: StaffMember,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
  ): Promise<StaffMember> {
    const savedFile = await this.saveManagedMediaFile(
      staffMember.id,
      file,
      publicBaseUrl,
    );

    try {
      const updatedStaffMember = await this.staffRepository.update(
        staffMember.id,
        {
          photoUrl: savedFile.publicUrl,
        },
      );

      if (!updatedStaffMember) {
        await this.safeDeleteFile(savedFile.absoluteFilePath);
        throw staffNotFoundError();
      }

      await this.deleteManagedMediaFile(staffMember.photoUrl);
      return updatedStaffMember;
    } catch (error) {
      await this.safeDeleteFile(savedFile.absoluteFilePath);
      throw error;
    }
  }

  private async clearStaffPhoto(
    staffMember: StaffMember,
  ): Promise<StaffMember> {
    const updatedStaffMember = await this.staffRepository.update(
      staffMember.id,
      {
        photoUrl: null,
      },
    );

    if (!updatedStaffMember) {
      throw staffNotFoundError();
    }

    await this.deleteManagedMediaFile(staffMember.photoUrl);
    return updatedStaffMember;
  }

  private async saveManagedMediaFile(
    staffId: string,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
  ): Promise<SavedMediaFile> {
    this.assertValidImageFile(file);

    const staffDirectory = join(STAFF_UPLOAD_ROOT, staffId);
    await mkdir(staffDirectory, { recursive: true });

    const fileExtension = this.resolveExtension(
      file.originalname,
      file.mimetype,
    );
    const filename = `profile-${Date.now()}-${randomUUID()}${fileExtension}`;
    const absoluteFilePath = join(staffDirectory, filename);
    await writeFile(absoluteFilePath, file.buffer);

    return {
      absoluteFilePath,
      publicUrl: `${publicBaseUrl}/uploads/staff/${staffId}/${filename}`,
    };
  }

  private assertValidImageFile(
    file: UploadedImageFile | undefined,
  ): asserts file is UploadedImageFile & {
    buffer: Buffer;
    mimetype: string;
    size: number;
  } {
    if (!file?.buffer || file.buffer.length === 0) {
      throw staffInvalidMediaFileError('Image file is required.');
    }

    if (!file.mimetype || !ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw staffInvalidMediaFileError(
        'Only PNG, JPEG and WEBP image files are supported.',
      );
    }

    if (!file.size || file.size > MAX_FILE_SIZE_BYTES) {
      throw staffInvalidMediaFileError(
        'Image file size must be 5 MB or smaller.',
      );
    }
  }

  private resolveExtension(
    originalName: string | undefined,
    mimeType: string | undefined,
  ): string {
    if (mimeType === 'image/png') return '.png';
    if (mimeType === 'image/webp') return '.webp';
    if (mimeType === 'image/jpeg') return '.jpg';

    const extension = extname(originalName ?? '').toLowerCase();
    return extension || '.jpg';
  }

  private async deleteManagedMediaFile(photoUrl: string | null): Promise<void> {
    const absoluteFilePath = this.resolveManagedMediaPath(photoUrl);

    if (!absoluteFilePath) {
      return;
    }

    await this.safeDeleteFile(absoluteFilePath);
  }

  private resolveManagedMediaPath(photoUrl: string | null): string | null {
    if (!photoUrl) {
      return null;
    }

    try {
      const parsedUrl = new URL(photoUrl);

      if (!parsedUrl.pathname.startsWith('/uploads/')) {
        return null;
      }

      const relativePath = parsedUrl.pathname.replace(/^\/uploads\//, '');
      return this.toSafeUploadPath(relativePath);
    } catch {
      if (!photoUrl.startsWith('/uploads/')) {
        return null;
      }

      const relativePath = photoUrl.replace(/^\/uploads\//, '');
      return this.toSafeUploadPath(relativePath);
    }
  }

  private toSafeUploadPath(relativePath: string): string | null {
    const normalizedPath = normalize(relativePath);

    if (
      normalizedPath.startsWith('..') ||
      normalizedPath.includes(`..\\`) ||
      normalizedPath.includes('../')
    ) {
      return null;
    }

    return join(UPLOAD_ROOT, normalizedPath);
  }

  private async safeDeleteFile(filePath: string): Promise<void> {
    try {
      await rm(filePath, { force: true });
    } catch {
      // Ignore cleanup failures to avoid masking the main operation result.
    }
  }
}
