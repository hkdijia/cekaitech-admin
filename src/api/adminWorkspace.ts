import { request } from './http';

export interface BackendWorkspace {
  id: number;
  workspaceCode: string;
  workspaceName: string;
  appCode: string;
  status: string;
}

export interface BackendWorkspaceMenu {
  menuCode: string;
  menuName: string;
  route: string;
  permissionCode: string;
  sortOrder: number;
}

export function listAccessibleWorkspaces(): Promise<BackendWorkspace[]> {
  return request<BackendWorkspace[]>('/api/admin/workspaces');
}

export function listWorkspaceMenus(workspaceId: number): Promise<BackendWorkspaceMenu[]> {
  return request<BackendWorkspaceMenu[]>(`/api/admin/workspaces/${workspaceId}/menus`);
}
