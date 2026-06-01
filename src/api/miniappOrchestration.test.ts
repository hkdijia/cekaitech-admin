import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  loadMiniappOrchestrationTree,
  saveMiniappOrchestrationEntry
} from './miniappOrchestration';

describe('miniapp orchestration api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('posts tree and entry save requests to backend endpoints', async () => {
    const tree = {
      nodeType: 'app',
      sourceType: 'app',
      sourceId: null,
      key: 'lawsuit-material-assistant',
      title: 'lawsuit-material-assistant',
      children: []
    };
    const savedEntry = {
      nodeType: 'entry',
      sourceType: 'home_menu_item',
      sourceId: 14,
      key: 'litigation_fee',
      title: '诉讼费计算',
      children: []
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: tree
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: savedEntry
        })
      } as Response);

    const loaded = await loadMiniappOrchestrationTree('lawsuit-material-assistant');
    const saved = await saveMiniappOrchestrationEntry({
      sourceType: 'home_menu_item',
      sourceId: 14,
      title: '诉讼费计算',
      description: '估算财产案件受理费',
      targetPath: '/pages/litigation-fee/litigation-fee',
      action: 'navigate',
      status: 'open',
      statusText: '可用',
      iconKey: 'scale',
      visibility: 'public',
      releaseStage: 'public',
      sortOrder: 10,
      enabled: true
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-orchestration/tree', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant', includeDisabled: false }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-orchestration/entries/save', {
      method: 'POST',
      body: JSON.stringify({
        sourceType: 'home_menu_item',
        sourceId: 14,
        title: '诉讼费计算',
        description: '估算财产案件受理费',
        targetPath: '/pages/litigation-fee/litigation-fee',
        action: 'navigate',
        status: 'open',
        statusText: '可用',
        iconKey: 'scale',
        visibility: 'public',
        releaseStage: 'public',
        sortOrder: 10,
        enabled: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(loaded.key).toBe('lawsuit-material-assistant');
    expect(saved.sourceId).toBe(14);
  });

  it('can request disabled nodes for admin recovery', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          nodeType: 'app',
          sourceType: 'app',
          sourceId: null,
          key: 'lawsuit-material-assistant',
          title: 'lawsuit-material-assistant',
          children: []
        }
      })
    } as Response);

    await loadMiniappOrchestrationTree('lawsuit-material-assistant', true);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/miniapp-orchestration/tree', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant', includeDisabled: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
});
