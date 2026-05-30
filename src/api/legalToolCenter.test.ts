import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  pageLegalToolCapabilities,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  saveLegalToolCapability,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem
} from './legalToolCenter';

describe('legal tool center api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('posts capability page and save requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 1, toolKey: 'litigation_fee', title: '诉讼费用' }],
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
          data: { id: 1, toolKey: 'litigation_fee', title: '诉讼费用' }
        })
      } as Response);

    const capabilities = await pageLegalToolCapabilities({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    const saved = await saveLegalToolCapability({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      toolKey: 'litigation_fee',
      title: '诉讼费用',
      description: '按标的额估算案件受理费参考值',
      category: 'calculator',
      status: 'public',
      audience: 'general_user',
      sourceLevel: 'official',
      dataDependency: 'static_table',
      executionMode: 'local_static',
      riskLevel: 'medium',
      defaultIconKey: 'scale',
      defaultTargetPath: '/pages/litigation-fee/litigation-fee',
      defaultAction: 'navigate',
      sourceName: '阳光法律助手本地工具口径',
      sourceUrl: '',
      sourceVersion: 'local-v1',
      sourceEffectiveDate: '',
      lastCheckedDate: '2026-05-30',
      ownerNote: '后续补充官方收费依据版本。',
      sortOrder: 20,
      enabled: true
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/capabilities/page', {
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
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/capabilities/save', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        id: 1,
        appCode: 'lawsuit-material-assistant',
        toolKey: 'litigation_fee',
        title: '诉讼费用',
        description: '按标的额估算案件受理费参考值',
        category: 'calculator',
        status: 'public',
        audience: 'general_user',
        sourceLevel: 'official',
        dataDependency: 'static_table',
        executionMode: 'local_static',
        riskLevel: 'medium',
        defaultIconKey: 'scale',
        defaultTargetPath: '/pages/litigation-fee/litigation-fee',
        defaultAction: 'navigate',
        sourceName: '阳光法律助手本地工具口径',
        sourceUrl: '',
        sourceVersion: 'local-v1',
        sourceEffectiveDate: '',
        lastCheckedDate: '2026-05-30',
        ownerNote: '后续补充官方收费依据版本。',
        sortOrder: 20,
        enabled: true
      })
    }));
    expect(capabilities.totalCount).toBe(1);
    expect(saved.toolKey).toBe('litigation_fee');
  });

  it('posts exposure group page, save and disable requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 11, groupKey: 'legal_calculators', title: '诉讼计算' }],
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
          data: { id: 11, groupKey: 'legal_calculators', title: '诉讼计算' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 11, enabled: false }
        })
      } as Response);

    await pageLegalToolExposureGroups({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    await saveLegalToolExposureGroup({
      id: 11,
      appCode: 'lawsuit-material-assistant',
      groupKey: 'legal_calculators',
      title: '诉讼计算',
      description: '常用诉讼费用、利息和日期辅助计算',
      tone: 'teal',
      visibility: 'public',
      sortOrder: 10,
      enabled: true
    });
    await disableLegalToolExposureGroup(11);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/groups/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        pageNo: 1,
        pageSize: 50
      })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/groups/save', expect.objectContaining({
      method: 'POST'
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal-tool-center/groups/11/disable', expect.objectContaining({
      method: 'POST'
    }));
  });

  it('posts exposure item page, save and disable requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 21, groupId: 11, capabilityId: 1, entryKey: 'litigation_fee' }],
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
          data: { id: 21, groupId: 11, capabilityId: 1, entryKey: 'litigation_fee' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 21, enabled: false }
        })
      } as Response);

    await pageLegalToolExposureItems({ groupId: 11, pageNo: 1, pageSize: 50 });
    await saveLegalToolExposureItem({
      id: 21,
      groupId: 11,
      capabilityId: 1,
      entryKey: 'litigation_fee',
      titleOverride: '',
      descriptionOverride: '',
      iconKey: 'scale',
      targetPath: '/pages/litigation-fee/litigation-fee',
      action: 'navigate',
      status: 'open',
      statusText: '已开放',
      visibility: 'public',
      audience: 'general_user',
      releaseStage: 'public',
      disclaimerProfile: 'legal_tool_reference',
      linkedServiceKey: '',
      sortOrder: 20,
      enabled: true
    });
    await disableLegalToolExposureItem(21);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/exposure-items/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ groupId: 11, pageNo: 1, pageSize: 50 })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/exposure-items/save', expect.objectContaining({
      method: 'POST'
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal-tool-center/exposure-items/21/disable', expect.objectContaining({
      method: 'POST'
    }));
  });
});
