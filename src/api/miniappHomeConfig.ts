import { request } from './http';

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export interface MiniappHomeModulePageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface MiniappHomeMenuItemPageQuery {
  moduleId: number;
  pageNo: number;
  pageSize: number;
}

export interface MiniappHomeBannerPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface MiniappHomeModuleItem {
  id: number;
  appCode: string;
  moduleKey: string;
  title: string;
  description: string;
  tone: string;
  visibleLimit: number;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MiniappHomeMenuItem {
  id: number;
  moduleId: number;
  itemKey: string;
  title: string;
  description: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  iconKey: string;
  iconUrl: string;
  fontWeight: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MiniappHomeBannerItem {
  id: number;
  appCode: string;
  bannerKey: string;
  title: string;
  subtitle: string;
  announcementText: string;
  imageUrl: string;
  targetPath: string;
  detailTitle: string;
  detailContent: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MiniappHomeModulePayload = Omit<MiniappHomeModuleItem, 'createdAt' | 'updatedAt'>;
export type MiniappHomeMenuItemPayload = Omit<MiniappHomeMenuItem, 'createdAt' | 'updatedAt'>;
export type MiniappHomeBannerPayload = Omit<MiniappHomeBannerItem, 'createdAt' | 'updatedAt'>;

export function pageMiniappHomeModules(
  query: MiniappHomeModulePageQuery
): Promise<PageResult<MiniappHomeModuleItem>> {
  return request<PageResult<MiniappHomeModuleItem>>('/api/admin/miniapp-home-config/modules/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveMiniappHomeModule(payload: MiniappHomeModulePayload): Promise<MiniappHomeModuleItem> {
  return request<MiniappHomeModuleItem>('/api/admin/miniapp-home-config/modules/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableMiniappHomeModule(moduleId: number): Promise<MiniappHomeModuleItem> {
  return request<MiniappHomeModuleItem>(`/api/admin/miniapp-home-config/modules/${moduleId}/disable`, {
    method: 'POST'
  });
}

export function pageMiniappHomeMenuItems(
  query: MiniappHomeMenuItemPageQuery
): Promise<PageResult<MiniappHomeMenuItem>> {
  return request<PageResult<MiniappHomeMenuItem>>('/api/admin/miniapp-home-config/menu-items/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveMiniappHomeMenuItem(payload: MiniappHomeMenuItemPayload): Promise<MiniappHomeMenuItem> {
  return request<MiniappHomeMenuItem>('/api/admin/miniapp-home-config/menu-items/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableMiniappHomeMenuItem(itemId: number): Promise<MiniappHomeMenuItem> {
  return request<MiniappHomeMenuItem>(`/api/admin/miniapp-home-config/menu-items/${itemId}/disable`, {
    method: 'POST'
  });
}

export function pageMiniappHomeBanners(
  query: MiniappHomeBannerPageQuery
): Promise<PageResult<MiniappHomeBannerItem>> {
  return request<PageResult<MiniappHomeBannerItem>>('/api/admin/miniapp-home-config/banners/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveMiniappHomeBanner(payload: MiniappHomeBannerPayload): Promise<MiniappHomeBannerItem> {
  return request<MiniappHomeBannerItem>('/api/admin/miniapp-home-config/banners/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableMiniappHomeBanner(bannerId: number): Promise<MiniappHomeBannerItem> {
  return request<MiniappHomeBannerItem>(`/api/admin/miniapp-home-config/banners/${bannerId}/disable`, {
    method: 'POST'
  });
}
