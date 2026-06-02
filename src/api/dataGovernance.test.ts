import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  pageAnnualCommonDataRevisions,
  pageAnnualCommonDataSyncBatches,
  pageLprRateRevisions,
  pageLprSyncBatches,
  syncAnnualCommonData,
  syncLprRates
} from './dataGovernance';

describe('data governance api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('posts LPR sync batch page request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [{ id: 1, batchNo: 'LPR-20260531-001', status: 'published' }],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageLprSyncBatches({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/lpr-sync-batches/page', {
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
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].batchNo).toBe('LPR-20260531-001');
  });

  it('posts LPR rate revision page request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [{ id: 2, quoteDate: '2025-05-20', revisionType: 'upsert' }],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageLprRateRevisions({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/lpr-rate-revisions/page', {
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
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].quoteDate).toBe('2025-05-20');
  });

  it('posts LPR JSON sync request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: { batchNo: 'LPR-20260531-002', importedCount: 2 }
      })
    } as Response);

    const payload = {
      appCode: 'lawsuit-material-assistant',
      items: [
        { quoteDate: '2025-04-20', oneYearRate: 3.1, fiveYearPlusRate: 3.6 },
        { quoteDate: '2025-05-20', oneYearRate: 3, fiveYearPlusRate: 3.5 }
      ]
    };
    const result = await syncLprRates(payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/lpr-rates/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.batchNo).toBe('LPR-20260531-002');
    expect(result.importedCount).toBe(2);
  });

  it('posts annual common data sync batch page request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [{ id: 11, requestId: 'crawler-annual-2024', status: 'completed' }],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageAnnualCommonDataSyncBatches({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/annual-common-data-sync-batches/page', {
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
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].requestId).toBe('crawler-annual-2024');
  });

  it('posts annual common data revision page request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [{ id: 12, year: 2024, metricKey: 'average_salary', changeType: 'created' }],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageAnnualCommonDataRevisions({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/annual-common-data-revisions/page', {
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
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].metricKey).toBe('average_salary');
  });

  it('posts annual common data JSON sync request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: { requestId: 'crawler-annual-2024', createdCount: 1 }
      })
    } as Response);

    const payload = {
      appCode: 'lawsuit-material-assistant',
      requestId: 'crawler-annual-2024',
      sourceKey: 'annual_public_stats',
      payloadHash: 'hash-annual-2024',
      items: [
        {
          regionCode: 'cn-shanghai',
          regionName: '上海市',
          year: 2024,
          metricKey: 'average_salary',
          metricName: '平均工资',
          value: 120000,
          unit: '元/年',
          sourceName: '统计公报',
          sourceUrl: 'https://tjj.sh.gov.cn/'
        }
      ]
    };
    const result = await syncAnnualCommonData(payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/data-governance/annual-common-data/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.requestId).toBe('crawler-annual-2024');
    expect(result.createdCount).toBe(1);
  });
});
