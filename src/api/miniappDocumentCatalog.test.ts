import { describe, expect, it, vi } from 'vitest';
import {
  disableMiniappDocumentCatalogItem,
  pageMiniappDocumentCatalogItems,
  saveMiniappDocumentCatalogItem
} from './miniappDocumentCatalog';

describe('miniapp document catalog api', () => {
  it('posts page, save and disable requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 1, appCode: 'lawsuit-material-assistant', caseType: 'private_lending' }],
            totalCount: 1
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 1, appCode: 'lawsuit-material-assistant', caseType: 'private_lending' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 1, enabled: false }
        })
      } as Response);

    const items = await pageMiniappDocumentCatalogItems({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    const saved = await saveMiniappDocumentCatalogItem({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      title: '民间借贷纠纷',
      description: '借款和还款材料整理',
      targetPath: '/pages/order/order?caseType=private_lending',
      action: 'free_document',
      status: 'open',
      statusText: '已开放',
      iconKey: 'file-text',
      sortOrder: 10,
      enabled: true
    });
    await disableMiniappDocumentCatalogItem(1, 'lawsuit-material-assistant');

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-document-catalog/items/page', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        pageNo: 1,
        pageSize: 50
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-document-catalog/items/save', {
      method: 'POST',
      body: JSON.stringify({
        id: 1,
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        title: '民间借贷纠纷',
        description: '借款和还款材料整理',
        targetPath: '/pages/order/order?caseType=private_lending',
        action: 'free_document',
        status: 'open',
        statusText: '已开放',
        iconKey: 'file-text',
        sortOrder: 10,
        enabled: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/miniapp-document-catalog/items/1/disable?appCode=lawsuit-material-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(items.totalCount).toBe(1);
    expect(saved.caseType).toBe('private_lending');
  });
});
