const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions<TBody> {
  path: string;
  method?: HttpMethod;
  body?: TBody;
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
}

interface ApiAuthBindings {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  refreshSession: () => Promise<boolean>;
  onUnauthorized: () => void;
}

function normalizeBaseUrl(value?: string) {
  const trimmedValue = value?.trim().replace(/\/+$/, '');

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedValue;
}

function appendQuery(url: URL, query?: Record<string, QueryValue>) {
  if (!query) {
    return;
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });
}

function resolveErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (typeof payload !== 'object' || payload == null) {
    return fallbackMessage;
  }

  const candidate = payload as {
    message?: string | string[];
    error?: string;
  };

  if (Array.isArray(candidate.message) && candidate.message.length > 0) {
    return candidate.message.join(', ');
  }

  if (typeof candidate.message === 'string' && candidate.message.trim()) {
    return candidate.message;
  }

  if (typeof candidate.error === 'string' && candidate.error.trim()) {
    return candidate.error;
  }

  return fallbackMessage;
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

let authBindings: ApiAuthBindings = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  refreshSession: async () => false,
  onUnauthorized: () => {},
};

let activeRefreshRequest: Promise<boolean> | null = null;

export const API_BASE_URL = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function configureApiAuth(bindings: Partial<ApiAuthBindings>) {
  authBindings = {
    ...authBindings,
    ...bindings,
  };
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  const responseText = await response.text();
  const parsedPayload = responseText ? tryParseJson(responseText) : null;

  if (!response.ok) {
    throw new ApiError(
      resolveErrorMessage(
        parsedPayload,
        response.statusText || 'Beklenmeyen bir API hatasi olustu.',
      ),
      response.status,
      parsedPayload,
    );
  }

  // Handle standard backend response envelope { success, data, timestamp }
  if (
    parsedPayload &&
    typeof parsedPayload === 'object' &&
    'success' in parsedPayload &&
    'data' in parsedPayload
  ) {
    return (parsedPayload as { data: TResponse }).data;
  }

  return parsedPayload as TResponse;
}

async function tryRefreshSession() {
  if (!authBindings.getRefreshToken()) {
    return false;
  }

  if (!activeRefreshRequest) {
    activeRefreshRequest = (async () => {
      try {
        return await authBindings.refreshSession();
      } catch {
        return false;
      } finally {
        activeRefreshRequest = null;
      }
    })();
  }

  return activeRefreshRequest;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(`${API_BASE_URL}/${normalizedPath}`);
  appendQuery(url, query);
  return url.toString();
}

export async function apiRequest<TResponse, TBody = unknown>({
  path,
  method = 'GET',
  body,
  query,
  headers,
  auth = false,
  retryOnUnauthorized = true,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const accessToken = authBindings.getAccessToken();

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const didRefresh = await tryRefreshSession();

    if (didRefresh) {
      return apiRequest<TResponse, TBody>({
        path,
        method,
        body,
        query,
        headers,
        auth,
        retryOnUnauthorized: false,
      });
    }

    authBindings.onUnauthorized();
  }

  return parseResponse<TResponse>(response);
}

export default API_BASE_URL;
