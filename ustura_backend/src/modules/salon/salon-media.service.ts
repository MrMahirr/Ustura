import { Injectable } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type { OwnedSalonDetail } from './interfaces/salon.types';
import {
  salonInvalidMediaFileError,
  salonNotFoundError,
} from './errors/salon.errors';
import { SalonOwnershipService } from './salon-ownership.service';
import { SalonProjectionService } from './salon-projection.service';
import { SalonRepository } from './repositories/salon.repository';

interface UploadedImageFile {
  originalname?: string;
  mimetype?: string;
  size?: number;
  buffer?: Buffer;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_ROOT = join(process.cwd(), 'uploads');
const SALON_UPLOAD_ROOT = join(UPLOAD_ROOT, 'salons');
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Injectable()
export class SalonMediaService {
  constructor(
    private readonly salonOwnershipService: SalonOwnershipService,
    private readonly salonRepository: SalonRepository,
    private readonly salonProjectionService: SalonProjectionService,
  ) {}

  async uploadOwnedStorefrontPhoto(
    currentUser: JwtPayload,
    salonId: string,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );

    this.assertValidImageFile(file);

    const salonDirectory = join(SALON_UPLOAD_ROOT, salonId);
    await mkdir(salonDirectory, { recursive: true });

    const fileExtension = this.resolveExtension(file.originalname, file.mimetype);
    const filename = `${Date.now()}-${randomUUID()}${fileExtension}`;
    const absoluteFilePath = join(salonDirectory, filename);
    await writeFile(absoluteFilePath, file.buffer as Buffer);

    const publicPhotoUrl = `${publicBaseUrl}/uploads/salons/${salonId}/${filename}`;

    try {
      const updatedSalon = await this.salonRepository.update(salonId, {
        photoUrl: publicPhotoUrl,
      });

      if (!updatedSalon) {
        await this.safeDeleteFile(absoluteFilePath);
        throw salonNotFoundError();
      }

      await this.deleteManagedMediaFile(existingSalon.photoUrl);
      return this.salonProjectionService.toOwnedDetail(updatedSalon);
    } catch (error) {
      await this.safeDeleteFile(absoluteFilePath);
      throw error;
    }
  }

  async removeOwnedStorefrontPhoto(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );

    const updatedSalon = await this.salonRepository.update(salonId, {
      photoUrl: null,
    });

    if (!updatedSalon) {
      throw salonNotFoundError();
    }

    await this.deleteManagedMediaFile(existingSalon.photoUrl);
    return this.salonProjectionService.toOwnedDetail(updatedSalon);
  }

  private assertValidImageFile(file: UploadedImageFile | undefined): asserts file is UploadedImageFile & { buffer: Buffer; mimetype: string; size: number } {
    if (!file?.buffer || file.buffer.length === 0) {
      throw salonInvalidMediaFileError('Image file is required.');
    }

    if (!file.mimetype || !ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw salonInvalidMediaFileError(
        'Only PNG, JPEG and WEBP image files are supported.',
      );
    }

    if (!file.size || file.size > MAX_FILE_SIZE_BYTES) {
      throw salonInvalidMediaFileError(
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
