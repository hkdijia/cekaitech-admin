import { request } from './http';

export interface AdminOperator {
  id: string;
  name: string;
  roleCode: string;
  roleName: string;
  permissions: string[];
}

export interface AdminLoginResponse {
  token: string;
  expiresIn: number;
  operator: AdminOperator;
}

export interface AdminCurrentOperatorResponse extends AdminOperator {
  authenticated: boolean;
}

export interface AdminChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminChangePasswordResponse {
  changed: boolean;
}

export function loginAdmin(username: string, password: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export function getCurrentOperator(token: string): Promise<AdminCurrentOperatorResponse> {
  return request<AdminCurrentOperatorResponse>('/api/admin/auth/current-operator', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function changeAdminPassword(payload: AdminChangePasswordRequest): Promise<AdminChangePasswordResponse> {
  return request<AdminChangePasswordResponse>('/api/admin/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
