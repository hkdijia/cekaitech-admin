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
      key: 'codex_test_entry_2159',
      title: '近期法律工具',
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
      title: '近期法律工具',
      description: '查看近期吸收的法律工具',
      targetPath: '/pages/tools/tools',
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
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-orchestration/entries/save', {
      method: 'POST',
      body: JSON.stringify({
        sourceType: 'home_menu_item',
        sourceId: 14,
        title: '近期法律工具',
        description: '查看近期吸收的法律工具',
        targetPath: '/pages/tools/tools',
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
});
