import { Platform } from 'react-native';

export const MAX_MANAGED_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MANAGED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export function extractUploadedFileName(photoUrl: string | null): string | null {
  if (!photoUrl) {
    return null;
  }

  try {
    const pathname = new URL(photoUrl).pathname;
    const segments = pathname.split('/');
    return segments.at(-1) || null;
  } catch {
    const segments = photoUrl.split('/');
    return segments.at(-1) || null;
  }
}

export function validateManagedImageFile(file: File): string | null {
  if (!ALLOWED_MANAGED_IMAGE_MIME_TYPES.has(file.type)) {
    return 'Sadece PNG, JPEG ve WEBP dosyalari yuklenebilir.';
  }

  if (file.size > MAX_MANAGED_IMAGE_FILE_SIZE_BYTES) {
    return 'Dosya boyutu 5 MB veya daha kucuk olmali.';
  }

  return null;
}

export async function selectImageFilesFromBrowser(options?: {
  multiple?: boolean;
}): Promise<File[]> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return [];
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.multiple = Boolean(options?.multiple);
    input.onchange = () => {
      resolve(Array.from(input.files ?? []));
      input.remove();
    };
    input.click();
  });
}
