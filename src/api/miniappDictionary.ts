import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface MiniappDictionaryGroupPageRequest {
  appCode?: string;
  enabled?: string;
  pageNo: number;
  pageSize: number;
}

export interface MiniappDictionaryGroup {
  groupId: number;
  appCode: string;
  groupCode: string;
  groupName: string;
  scopeType: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MiniappDictionaryItemPageRequest {
  appCode?: string;
  groupCode?: string;
  enabled?: string;
  pageNo: number;
  pageSize: number;
}

export interface MiniappDictionaryItem {
  itemId: number;
  appCode: string;
  groupCode: string;
  itemCode: string;
  itemLabel: string;
  itemValue: string;
  description: string;
  tagType: string;
  colorToken: string;
  sortOrder: number;
  enabled: boolean;
  systemBuiltin: boolean;
  createdAt: string;
  updatedAt: string;
}

export function pageMiniappDictionaryGroups(
  payload: MiniappDictionaryGroupPageRequest
): Promise<PageResult<MiniappDictionaryGroup>> {
  return request<PageResult<MiniappDictionaryGroup>>('/api/admin/miniapp-dictionaries/groups/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageMiniappDictionaryItems(
  payload: MiniappDictionaryItemPageRequest
): Promise<PageResult<MiniappDictionaryItem>> {
  return request<PageResult<MiniappDictionaryItem>>('/api/admin/miniapp-dictionaries/items/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
