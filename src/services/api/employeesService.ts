import { apiClient } from './httpClient';

export type ResourceId = string | number;

export interface VersionedEmployeeRequest {
  version?: string | number;
}

export interface NudgeAdminPayload {
  nudgeDescription: string;
}

export interface VerifyMagicLinkResponse {
  isSuccess?: boolean;
  isFailure?: boolean;
  error?: unknown;
  value?: {
    expiresAt?: string;
    token?: string;
    accessToken?: string;
    employeeType?: string;
    userType?: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
  token?: string;
  accessToken?: string;
  expiresAt?: string;
  employeeType?: string;
  userType?: string;
  name?: string;
  fullName?: string;
  email?: string;
  data?: VerifyMagicLinkResponse;
}

export interface VerifyAllDocumentsValue {
  canProceed?: boolean;
  message?: string;
  missingDocuments?: string[];
}

export interface VerifyAllDocumentsResponse {
  value?: VerifyAllDocumentsValue;
  isSuccess?: boolean;
  isFailure?: boolean;
  error?: unknown;
}

export const employeesService = {
  addEmployee<TResponse = unknown, TPayload = Record<string, unknown>>(payload: TPayload) {
    return apiClient.post<TResponse>('/api/v1/employees', payload);
  },

  getEmployees<T = unknown>() {
    return apiClient.get<T>('/api/v1/employees');
  },

  getPendingEmployees<T = unknown>() {
    return apiClient.get<T>('/api/v1/employees/pending');
  },

  getCompletedEmployees<T = unknown>() {
    return apiClient.get<T>('/api/v1/employees/completed');
  },

  getEmployeeById<T = unknown>(employeeId: ResourceId) {
    return apiClient.get<T>(`/api/v1/employees/${employeeId}`);
  },

  updateEmployeeById<TResponse = unknown, TPayload = Record<string, unknown>>(
    employeeId: ResourceId,
    payload: TPayload
  ) {
    return apiClient.patch<TResponse>(`/api/v1/employees/${employeeId}/profile`, payload);
  },

  upsertEmployeeProfileById<TResponse = unknown, TPayload = Record<string, unknown>>(
    employeeId: ResourceId,
    payload: TPayload,
    options: VersionedEmployeeRequest = {}
  ) {
    const { version = 1 } = options;
    return apiClient.patch<TResponse>(`/api/v${version}/employees/${employeeId}/profile`, payload);
  },

  getEmployeeFullRecord<T = unknown>(employeeId: ResourceId, options: VersionedEmployeeRequest = {}) {
    const { version = 1 } = options;
    return apiClient.get<T>(`/api/v${version}/employees/${employeeId}/get-full-record`);
  },

  nudgeAdmin<T = unknown>(
    employeeId: ResourceId,
    payload: NudgeAdminPayload,
    options: VersionedEmployeeRequest = {}
  ) {
    const { version = 1 } = options;
    return apiClient.patch<T>(`/api/v${version}/employees/nudge-admin`, {
      query: payload
    });
  },

  verifyMagicLink<T = VerifyMagicLinkResponse>(token: string) {
    return apiClient.post<T>('/api/v1/auth/verify', {
      code: token
    });
  },

  verifyAllDocumentsUploaded<T = VerifyAllDocumentsResponse>(employeeId: ResourceId) {
    return apiClient.get<T>(`/api/v1/employees/${employeeId}/verify-all-documents-uploaded`);
  }
};
