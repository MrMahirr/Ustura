import { Injectable } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { extname, join, normalize } from 'node:path';
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

interface SavedMediaFile {
  absoluteFilePath: string;
  publicUrl: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 8;
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
    const savedFile = await this.saveManagedMediaFile(
      salonId,
      file,
      publicBaseUrl,
      'cover',
    );

    try {
      const updatedSalon = await this.salonRepository.update(salonId, {
        photoUrl: savedFile.publicUrl,
      });

      if (!updatedSalon) {
        await this.safeDeleteFile(savedFile.absoluteFilePath);
        throw salonNotFoundError();
      }

      await this.deleteManagedMediaFile(existingSalon.photoUrl);
      return this.salonProjectionService.toOwnedDetail(updatedSalon);
    } catch (error) {
      await this.safeDeleteFile(savedFile.absoluteFilePath);
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

  async uploadOwnedGalleryPhotos(
    currentUser: JwtPayload,
    salonId: string,
    files: UploadedImageFile[] | undefined,
    publicBaseUrl: string,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );
    const existingGalleryUrls = existingSalon.galleryUrls ?? [];
    const safeFiles = files?.filter(Boolean) ?? [];

    if (safeFiles.length === 0) {
      throw salonInvalidMediaFileError('At least one image file is required.');
    }

    if (existingGalleryUrls.length + safeFiles.length > MAX_GALLERY_IMAGES) {
      throw salonInvalidMediaFileError(
        `Gallery can contain at most ${MAX_GALLERY_IMAGES} images.`,
      );
    }

    const savedFiles: SavedMediaFile[] = [];

    try {
      for (const file of safeFiles) {
        const savedFile = await this.saveManagedMediaFile(
          salonId,
          file,
          publicBaseUrl,
          'gallery',
        );
        savedFiles.push(savedFile);
      }

      const updatedSalon = await this.salonRepository.update(salonId, {
        galleryUrls: [
          ...existingGalleryUrls,
          ...savedFiles.map((savedFile) => savedFile.publicUrl),
        ],
      });

      if (!updatedSalon) {
        throw salonNotFoundError();
      }

      return this.salonProjectionService.toOwnedDetail(updatedSalon);
    } catch (error) {
      await Promise.all(
        savedFiles.map((savedFile) =>
          this.safeDeleteFile(savedFile.absoluteFilePath),
        ),
      );
      throw error;
    }
  }

  async removeOwnedGalleryPhoto(
    currentUser: JwtPayload,
    salonId: string,
    photoUrl: string,
  ): Promise<OwnedSalonDetail> {
    const existingSalon = await this.salonOwnershipService.requireOwnedSalon(
      currentUser,
      salonId,
    );
    const existingGalleryUrls = existingSalon.galleryUrls ?? [];

    if (!existingGalleryUrls.includes(photoUrl)) {
      throw salonInvalidMediaFileError('Gallery photo does not belong to salon.');
    }

    const updatedSalon = await this.salonRepository.update(salonId, {
      galleryUrls: existingGalleryUrls.filter((url) => url !== photoUrl),
    });

    if (!updatedSalon) {
      throw salonNotFoundError();
    }

    await this.deleteManagedMediaFile(photoUrl);
    return this.salonProjectionService.toOwnedDetail(updatedSalon);
  }

  private async saveManagedMediaFile(
    salonId: string,
    file: UploadedImageFile | undefined,
    publicBaseUrl: string,
    prefix: 'cover' | 'gallery',
  ): Promise<SavedMediaFile> {
    this.assertValidImageFile(file);

    const salonDirectory = join(SALON_UPLOAD_ROOT, salonId);
    await mkdir(salonDirectory, { recursive: true });

    const fileExtension = this.resolveExtension(
      file.originalname,
      file.mimetype,
    );
    const filename = `${prefix}-${Date.now()}-${randomUUID()}${fileExtension}`;
    const absoluteFilePath = join(salonDirectory, filename);
    await writeFile(absoluteFilePath, file.buffer);

    return {
      absoluteFilePath,
      publicUrl: `${publicBaseUrl}/uploads/salons/${salonId}/${filename}`,
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
