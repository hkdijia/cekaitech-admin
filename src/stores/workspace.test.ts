import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from './workspace';

describe('useWorkspaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('loads accessible workspaces from backend and switches by workspace code', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: [
          {
            id: 1,
            workspaceCode: 'legal-material-assistant',
            workspaceName: '法律材料助手',
            appCode: 'lawsuit-material-assistant',
            status: 'enabled'
          },
          {
            id: 2,
            workspaceCode: 'rehab-appointment-assistant',
            workspaceName: '康复预约助手',
            appCode: 'rehab-appointment-miniapp',
            status: 'enabled'
          }
        ]
      })
    } as Response);

    const workspace = useWorkspaceStore();

    await workspace.loadWorkspaces();
    workspace.switchWorkspace('rehab-appointment-assistant');

    expect(workspace.options).toHaveLength(2);
    expect(workspace.currentWorkspace.name).toBe('康复预约助手');
    expect(workspace.currentWorkspace.appCode).toBe('rehab-appointment-miniapp');
  });

  it('loads workspace menus after switching workspace', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: [
            {
              id: 1,
              workspaceCode: 'legal-material-assistant',
              workspaceName: '法律材料助手',
              appCode: 'lawsuit-material-assistant',
              status: 'enabled'
            }
          ]
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: [
            {
              menuCode: 'lawyer-verifications',
              menuName: '律师认证审核',
              route: '/legal/lawyer-verifications',
              permissionCode: 'legal:verification:review',
              sortOrder: 30
            }
          ]
        })
      } as Response);

    const workspace = useWorkspaceStore();

    await workspace.loadWorkspaces();

    expect(workspace.currentMenus).toHaveLength(1);
    expect(workspace.currentMenus[0].menuName).toBe('律师认证审核');
    expect(workspace.currentMenus[0].permissionCode).toBe('legal:verification:review');
  });

  it('keeps fallback workspaces when backend workspace loading fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const workspace = useWorkspaceStore();

    await workspace.loadWorkspaces();

    expect(workspace.options.length).toBeGreaterThan(0);
    expect(workspace.currentWorkspace.name).toBe('全局后台');
    expect(workspace.loadError).toBe('network down');
  });
});
