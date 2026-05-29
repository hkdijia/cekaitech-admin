import { request } from './http';

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export interface MiniappDocumentCatalogPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface MiniappDocumentCatalogItem {
  id: number;
  appCode: string;
  caseType: string;
  title: string;
  description: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  iconKey: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MiniappDocumentCatalogPayload = Omit<MiniappDocumentCatalogItem, 'createdAt' | 'updatedAt'>;

export function pageMiniappDocumentCatalogItems(
  query: MiniappDocumentCatalogPageQuery
): Promise<PageResult<MiniappDocumentCatalogItem>> {
  return request<PageResult<MiniappDocumentCatalogItem>>('/api/admin/miniapp-document-catalog/items/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveMiniappDocumentCatalogItem(
  payload: MiniappDocumentCatalogPayload
): Promise<MiniappDocumentCatalogItem> {
  return request<MiniappDocumentCatalogItem>('/api/admin/miniapp-document-catalog/items/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableMiniappDocumentCatalogItem(itemId: number, appCode: string): Promise<MiniappDocumentCatalogItem> {
  const query = new URLSearchParams({ appCode }).toString();
  return request<MiniappDocumentCatalogItem>(`/api/admin/miniapp-document-catalog/items/${itemId}/disable?${query}`, {
    method: 'POST'
  });
}
