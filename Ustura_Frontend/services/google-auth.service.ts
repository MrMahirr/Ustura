import { Platform } from 'react-native';

const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

interface GoogleOauthError {
  type: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

interface GoogleOauth2Namespace {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
    error_callback?: (error: GoogleOauthError) => void;
  }) => GoogleTokenClient;
}

interface GoogleIdentityNamespace {
  accounts?: {
    oauth2?: GoogleOauth2Namespace;
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityNamespace;
  }
}

let googleScriptPromise: Promise<void> | null = null;

function assertWebEnvironment() {
  if (
    Platform.OS !== 'web' ||
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    throw new Error('Google ile giris su an yalnizca web istemcisinde etkin.');
  }
}

function resolveGoogleErrorMessage(error: GoogleOauthError | GoogleTokenResponse) {
  const errorType = 'type' in error ? error.type : error.error;

  switch (errorType) {
    case 'popup_closed':
      return 'Google giris penceresi kapatildi.';
    case 'popup_failed_to_open':
      return 'Google giris penceresi acilamadi. Tarayici popup engeli olabilir.';
    case 'access_denied':
      return 'Google hesabi erisim izni vermedi.';
    default:
      return (
        ('error_description' in error && error.error_description) ||
        'Google ile giris tamamlanamadi.'
      );
  }
}

async function loadGoogleIdentityScript() {
  assertWebEnvironment();

  if (window.google?.accounts?.oauth2) {
    return;
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise<void>((resolve, reject) => {
      const handleReady = () => {
        if (window.google?.accounts?.oauth2) {
          resolve();
          return;
        }

        reject(new Error('Google giris istemcisi yuklenemedi.'));
      };

      const handleError = () => {
        reject(new Error('Google giris istemcisi yuklenemedi.'));
      };

      const existingScript = document.querySelector(
        `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`
      ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', handleReady, { once: true });
        existingScript.addEventListener('error', handleError, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = GOOGLE_IDENTITY_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', handleReady, { once: true });
      script.addEventListener('error', handleError, { once: true });
      document.head.appendChild(script);
    }).catch((error) => {
      googleScriptPromise = null;
      throw error;
    });
  }

  return googleScriptPromise;
}

export async function preloadGoogleWebIdentityClient() {
  if (Platform.OS !== 'web') {
    return;
  }

  await loadGoogleIdentityScript();
}

export async function requestGoogleWebAccessToken(clientId: string) {
  const normalizedClientId = clientId.trim();

  if (!normalizedClientId) {
    throw new Error('Google girisi icin istemci kimligi tanimli degil.');
  }

  await loadGoogleIdentityScript();

  return new Promise<string>((resolve, reject) => {
    const oauthClient = window.google?.accounts?.oauth2;

    if (!oauthClient) {
      reject(new Error('Google giris istemcisi hazir degil.'));
      return;
    }

    const tokenClient = oauthClient.initTokenClient({
      client_id: normalizedClientId,
      scope: 'openid email profile',
      callback: (response) => {
        if (response.error) {
          reject(new Error(resolveGoogleErrorMessage(response)));
          return;
        }

        if (!response.access_token) {
          reject(new Error('Google erisim belirteci alinamadi.'));
          return;
        }

        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(resolveGoogleErrorMessage(error)));
      },
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  });
}
