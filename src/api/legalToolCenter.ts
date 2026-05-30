import { request } from './http';

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export interface LegalToolCapabilityPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolExposureGroupPageQuery {
  appCode?: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolExposureItemPageQuery {
  groupId: number;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolCapabilityItem {
  id: number;
  appCode: string;
  toolKey: string;
  title: string;
  description: string;
  category: string;
  status: string;
  audience: string;
  sourceLevel: string;
  dataDependency: string;
  executionMode: string;
  riskLevel: string;
  defaultIconKey: string;
  defaultTargetPath: string;
  defaultAction: string;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
  sourceEffectiveDate: string;
  lastCheckedDate: string;
  ownerNote: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolExposureGroupItem {
  id: number;
  appCode: string;
  groupKey: string;
  title: string;
  description: string;
  tone: string;
  visibility: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolExposureItem {
  id: number;
  groupId: number;
  capabilityId: number;
  entryKey: string;
  titleOverride: string;
  descriptionOverride: string;
  iconKey: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  visibility: string;
  audience: string;
  releaseStage: string;
  disclaimerProfile: string;
  linkedServiceKey: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LegalToolCapabilityPayload = Omit<LegalToolCapabilityItem, 'createdAt' | 'updatedAt'>;
export type LegalToolExposureGroupPayload = Omit<LegalToolExposureGroupItem, 'createdAt' | 'updatedAt'>;
export type LegalToolExposureItemPayload = Omit<LegalToolExposureItem, 'createdAt' | 'updatedAt'>;

export function pageLegalToolCapabilities(
  query: LegalToolCapabilityPageQuery
): Promise<PageResult<LegalToolCapabilityItem>> {
  return request<PageResult<LegalToolCapabilityItem>>('/api/admin/legal-tool-center/capabilities/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolCapability(
  payload: LegalToolCapabilityPayload
): Promise<LegalToolCapabilityItem> {
  return request<LegalToolCapabilityItem>('/api/admin/legal-tool-center/capabilities/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageLegalToolExposureGroups(
  query: LegalToolExposureGroupPageQuery
): Promise<PageResult<LegalToolExposureGroupItem>> {
  return request<PageResult<LegalToolExposureGroupItem>>('/api/admin/legal-tool-center/groups/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolExposureGroup(
  payload: LegalToolExposureGroupPayload
): Promise<LegalToolExposureGroupItem> {
  return request<LegalToolExposureGroupItem>('/api/admin/legal-tool-center/groups/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableLegalToolExposureGroup(groupId: number): Promise<LegalToolExposureGroupItem> {
  return request<LegalToolExposureGroupItem>(`/api/admin/legal-tool-center/groups/${groupId}/disable`, {
    method: 'POST'
  });
}

export function pageLegalToolExposureItems(
  query: LegalToolExposureItemPageQuery
): Promise<PageResult<LegalToolExposureItem>> {
  return request<PageResult<LegalToolExposureItem>>('/api/admin/legal-tool-center/exposure-items/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolExposureItem(
  payload: LegalToolExposureItemPayload
): Promise<LegalToolExposureItem> {
  return request<LegalToolExposureItem>('/api/admin/legal-tool-center/exposure-items/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableLegalToolExposureItem(itemId: number): Promise<LegalToolExposureItem> {
  return request<LegalToolExposureItem>(`/api/admin/legal-tool-center/exposure-items/${itemId}/disable`, {
    method: 'POST'
  });
}
