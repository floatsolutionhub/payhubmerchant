export type QueryParams = Record<string, string | number | boolean | null | undefined>;

import { logout } from '../../store/authSlice';
import { store } from '../../store';
import {
  SESSION_EMPLOYEE_ID_KEY,
  SESSION_ONBOARDING_CURRENT_STEP_KEY,
  SESSION_ONBOARDING_PREFILL_KEY,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY
} from '../../config/sessionKeys';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: QueryParams;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '';
export const SESSION_EXPIRED_EVENT = 'employee:session-expired';

let inMemoryAccessToken: string | null = null;
let tokenGetter: (() => string | null) | null = () => inMemoryAccessToken;
let hasHandledUnauthorized = false;

export function setApiAccessToken(token: string | null): void {
  inMemoryAccessToken = token;

  if (token) {
    hasHandledUnauthorized = false;
  }
}

export function clearApiAccessToken(): void {
  inMemoryAccessToken = null;
}

export function setApiTokenGetter(getter: (() => string | null) | null): void {
  tokenGetter = getter;
}

function handleUnauthorizedSession(): void {
  if (hasHandledUnauthorized) {
    return;
  }

  hasHandledUnauthorized = true;
  window.localStorage.removeItem(SESSION_USER_KEY);
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_EMPLOYEE_ID_KEY);
  window.localStorage.removeItem(SESSION_ONBOARDING_CURRENT_STEP_KEY);
  window.localStorage.removeItem(SESSION_ONBOARDING_PREFILL_KEY);
  clearApiAccessToken();
  store.dispatch(logout());
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

function buildQueryString(query?: QueryParams): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || '';

  const isJsonResponse = contentType.includes('application/json') || contentType.includes('+json');

  if (isJsonResponse) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, headers, signal } = options;
  const queryString = buildQueryString(query);
  const url = `${DEFAULT_API_BASE_URL}${path}${queryString}`;

  const token = tokenGetter ? tokenGetter() : null;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    signal
  });

  const responseData = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedSession();
    }

    const message = typeof responseData === 'object' && responseData !== null
      ? (() => {
        const errorPayload = responseData as { detail?: unknown; message?: unknown; title?: unknown };

        if (typeof errorPayload.detail === 'string' && errorPayload.detail.trim()) {
          return errorPayload.detail.trim();
        }

        if (typeof errorPayload.message === 'string' && errorPayload.message.trim()) {
          return errorPayload.message.trim();
        }

        if (typeof errorPayload.title === 'string' && errorPayload.title.trim()) {
          return errorPayload.title.trim();
        }

        return `Request failed with status ${response.status}`;
      })()
      : `Request failed with status ${response.status}`;

    throw new HttpError(message, response.status, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'GET' });
  },
  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'POST', body });
  },
  put<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'PUT', body });
  },
  patch<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },
  delete<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(path, { ...options, method: 'DELETE' });
  }
};
