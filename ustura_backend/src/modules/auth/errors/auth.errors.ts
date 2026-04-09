import { ERROR_CODES } from '../../../shared/errors/error-codes';
import {
  conflictError,
  serviceUnavailableError,
  unauthorizedError,
} from '../../../shared/errors/http-exception.factory';

export function accessTokenInvalidError() {
  return unauthorizedError(
    'Access token is invalid.',
    ERROR_CODES.AUTH.ACCESS_TOKEN_INVALID,
  );
}

export function accountInactiveError() {
  return unauthorizedError(
    'User account is inactive.',
    ERROR_CODES.AUTH.ACCOUNT_INACTIVE,
  );
}

export function customerGoogleOnlyError() {
  return conflictError(
    'Firebase Google sign-in is only available for customer accounts.',
    ERROR_CODES.AUTH.CUSTOMER_GOOGLE_ONLY,
  );
}

export function generatedTokenInvalidError() {
  return unauthorizedError(
    'Generated token payload is invalid.',
    ERROR_CODES.AUTH.GENERATED_TOKEN_INVALID,
  );
}

export function googleAccessTokenInvalidError() {
  return unauthorizedError(
    'Google access token is invalid.',
    ERROR_CODES.AUTH.GOOGLE_ACCESS_TOKEN_INVALID,
  );
}

export function googleEmailAlreadyLinkedError() {
  return conflictError(
    'This email is already linked to another Google account.',
    ERROR_CODES.AUTH.GOOGLE_EMAIL_ALREADY_LINKED,
  );
}

export function googleIdentityTokenInvalidError(message?: string) {
  return unauthorizedError(
    message ?? 'Google identity token is invalid.',
    ERROR_CODES.AUTH.GOOGLE_IDENTITY_TOKEN_INVALID,
  );
}

export function googleVerificationUnavailableError() {
  return serviceUnavailableError(
    'Google sign-in verification service is unavailable.',
    ERROR_CODES.AUTH.GOOGLE_VERIFICATION_UNAVAILABLE,
  );
}

export function googleWebNotConfiguredError() {
  return serviceUnavailableError(
    'Google web sign-in is not configured on the backend.',
    ERROR_CODES.AUTH.GOOGLE_WEB_NOT_CONFIGURED,
  );
}

export function invalidCredentialsError() {
  return unauthorizedError(
    'Invalid email or password.',
    ERROR_CODES.AUTH.INVALID_CREDENTIALS,
  );
}

export function refreshTokenInvalidError(message?: string) {
  return unauthorizedError(
    message ?? 'Refresh token is invalid or expired.',
    ERROR_CODES.AUTH.REFRESH_TOKEN_INVALID,
  );
}

export function firebaseGoogleNotConfiguredError() {
  return serviceUnavailableError(
    'Firebase Google sign-in is not configured on the backend.',
    ERROR_CODES.AUTH.FIREBASE_GOOGLE_NOT_CONFIGURED,
  );
}

export function firebaseCertificatesUnavailableError() {
  return serviceUnavailableError(
    'Firebase signing certificates could not be fetched.',
    ERROR_CODES.AUTH.FIREBASE_CERTIFICATES_UNAVAILABLE,
  );
}

export function firebaseCertificatesInvalidError() {
  return serviceUnavailableError(
    'Firebase signing certificates response is invalid.',
    ERROR_CODES.AUTH.FIREBASE_CERTIFICATES_INVALID,
  );
}
