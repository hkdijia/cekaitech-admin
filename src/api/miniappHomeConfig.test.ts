import { describe, expect, it, vi } from 'vitest';
import {
  disableMiniappHomeBanner,
  disableMiniappHomeMenuItem,
  disableMiniappHomeModule,
  pageMiniappHomeBanners,
  pageMiniappHomeMenuItems,
  pageMiniappHomeModules,
  saveMiniappHomeBanner,
  saveMiniappHomeMenuItem,
  saveMiniappHomeModule
} from './miniappHomeConfig';

describe('miniapp home config api', () => {
  it('posts module page and save requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 1, appCode: 'lawsuit-material-assistant', moduleKey: 'tools', title: '工具类' }],
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
          data: { id: 1, appCode: 'lawsuit-material-assistant', moduleKey: 'tools', title: '工具类' }
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

    const modules = await pageMiniappHomeModules({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    const saved = await saveMiniappHomeModule({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      moduleKey: 'tools',
      title: '工具类',
      description: '常用诉讼辅助计算与办事指引',
      tone: 'teal',
      visibleLimit: 8,
      sortOrder: 10,
      enabled: true
    });
    await disableMiniappHomeModule(1);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-home-config/modules/page', {
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
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-home-config/modules/save', {
      method: 'POST',
      body: JSON.stringify({
        id: 1,
        appCode: 'lawsuit-material-assistant',
        moduleKey: 'tools',
        title: '工具类',
        description: '常用诉讼辅助计算与办事指引',
        tone: 'teal',
        visibleLimit: 8,
        sortOrder: 10,
        enabled: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/miniapp-home-config/modules/1/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(modules.totalCount).toBe(1);
    expect(saved.moduleKey).toBe('tools');
  });

  it('posts menu item page, save and disable requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 2, moduleId: 1, itemKey: 'interest', title: '利息计算' }],
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
          data: { id: 2, moduleId: 1, itemKey: 'interest', title: '利息计算' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 2, enabled: false }
        })
      } as Response);

    await pageMiniappHomeMenuItems({ moduleId: 1, pageNo: 1, pageSize: 50 });
    await saveMiniappHomeMenuItem({
      id: 2,
      moduleId: 1,
      itemKey: 'interest',
      title: '利息计算',
      description: '估算利息',
      targetPath: '/pages/interest/interest',
      action: 'navigate',
      status: 'open',
      statusText: '可用',
      iconKey: 'calculator',
      iconUrl: '',
      fontWeight: 'bold',
      sortOrder: 10,
      enabled: true
    });
    await disableMiniappHomeMenuItem(2);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-home-config/menu-items/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ moduleId: 1, pageNo: 1, pageSize: 50 })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-home-config/menu-items/save', expect.objectContaining({
      method: 'POST'
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/miniapp-home-config/menu-items/2/disable', expect.objectContaining({
      method: 'POST'
    }));
  });

  it('posts banner page, save and disable requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 3, bannerKey: 'launch_notice', title: '试运行公告' }],
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
          data: { id: 3, bannerKey: 'launch_notice', title: '试运行公告' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 3, enabled: false }
        })
      } as Response);

    await pageMiniappHomeBanners({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    await saveMiniappHomeBanner({
      id: 3,
      appCode: 'lawsuit-material-assistant',
      bannerKey: 'launch_notice',
      title: '试运行公告',
      subtitle: '首页入口将逐步支持后台配置',
      announcementText: '材料内容请自行核对',
      imageUrl: '',
      targetPath: '/pages/notice-detail/notice-detail?noticeKey=launch_notice',
      detailTitle: '试运行公告',
      detailContent: '详情',
      sortOrder: 10,
      enabled: true
    });
    await disableMiniappHomeBanner(3);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-home-config/banners/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        pageNo: 1,
        pageSize: 50
      })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-home-config/banners/save', expect.objectContaining({
      method: 'POST'
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/miniapp-home-config/banners/3/disable', expect.objectContaining({
      method: 'POST'
    }));
  });
});
