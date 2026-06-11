import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  pageLegalToolCapabilities,
  pageLegalToolDataSources,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  pageLegalToolInteractionBlueprints,
  inspectLegalToolReadiness,
  updateLegalToolCapabilityStatus,
  applyElementTemplateFileImport,
  manifestElementTemplateFiles,
  pageAnnualCommonData,
  pageLitigationFeeRules,
  pageLegalLprRates,
  previewElementTemplateFileImport,
  previewLitigationFeeRule,
  validateElementTemplateFiles,
  publishLitigationFeeRule,
  saveLegalToolCapability,
  saveLegalToolDataSource,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem,
  saveLegalToolInteractionBlueprint,
  saveAnnualCommonData,
  saveLitigationFeeRule,
  saveLegalLprRate
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
      status: 'enabled',
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
        status: 'enabled',
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

  it('posts legal tool readiness inspection request to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            appCode: 'lawsuit-material-assistant',
            totalCapabilityCount: 26,
            publicExposureCount: 18,
            enabledCount: 12,
            pendingReleaseCount: 8,
            blockedStatusCount: 3,
            pausedCount: 2,
            retiredCount: 1,
            readyCount: 12,
            warningCount: 3,
            blockedCount: 11,
            items: [
              {
                toolKey: 'litigation_fee',
                title: '诉讼费用',
                status: 'enabled',
                readiness: 'live',
                capabilityEnabled: true,
                publicExposure: true,
                reviewedBlueprint: true,
                dataSourceReady: true,
                issues: []
              }
            ]
          }
        })
      } as Response);

    const result = await inspectLegalToolReadiness({ appCode: 'lawsuit-material-assistant' });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal-tool-center/readiness/inspect', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.enabledCount).toBe(12);
    expect(result.readyCount).toBe(12);
    expect(result.items[0].readiness).toBe('live');
  });

  it('posts legal tool capability status update to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            id: 1,
            appCode: 'lawsuit-material-assistant',
            toolKey: 'litigation_fee',
            title: '诉讼费用',
            description: '按标的额估算案件受理费参考值',
            category: 'calculator',
            status: 'paused',
            audience: 'general_user',
            sourceLevel: 'official',
            dataDependency: 'static_table',
            executionMode: 'local_static',
            riskLevel: 'medium',
            defaultIconKey: 'scale',
            defaultTargetPath: '/pages/litigation-fee/litigation-fee',
            defaultAction: 'navigate',
            sourceName: '本地工具口径',
            sourceUrl: '',
            sourceVersion: 'local-v1',
            sourceEffectiveDate: '',
            lastCheckedDate: '2026-05-30',
            ownerNote: '人工原因暂缓上线',
            sortOrder: 20,
            enabled: true,
            createdAt: '',
            updatedAt: ''
          }
        })
      } as Response);

    const result = await updateLegalToolCapabilityStatus(1, {
      status: 'paused',
      ownerNote: '人工原因暂缓上线'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal-tool-center/capabilities/1/status', {
      method: 'POST',
      body: JSON.stringify({
        status: 'paused',
        ownerNote: '人工原因暂缓上线'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.status).toBe('paused');
    expect(result.ownerNote).toBe('人工原因暂缓上线');
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

  it('posts data source and interaction blueprint requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { dataList: [{ id: 31, sourceKey: 'civil_case_cause_2026' }], totalCount: 1 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 31, sourceKey: 'civil_case_cause_2026' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { dataList: [{ id: 41, blueprintKey: 'litigation_fee_v1' }], totalCount: 1 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 41, blueprintKey: 'litigation_fee_v1' }
        })
      } as Response);

    await pageLegalToolDataSources({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 });
    await saveLegalToolDataSource({
      id: 31,
      appCode: 'lawsuit-material-assistant',
      sourceKey: 'civil_case_cause_2026',
      sourceName: '民事案件案由规定（第三次修正）',
      sourceType: 'official_rule',
      issuer: '最高人民法院',
      sourceUrl: 'https://www.court.gov.cn/zixun/xiangqing/484231.html',
      citation: '法〔2025〕166号',
      effectiveDate: '2026-01-01',
      sourceVersion: '2025-third-amendment',
      lastCheckedDate: '2026-05-30',
      status: 'verified',
      riskLevel: 'medium',
      linkedToolKeys: 'civil_cause_of_action',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });
    await pageLegalToolInteractionBlueprints({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 });
    await saveLegalToolInteractionBlueprint({
      id: 41,
      appCode: 'lawsuit-material-assistant',
      blueprintKey: 'litigation_fee_v1',
      toolKey: 'litigation_fee',
      blueprintName: '诉讼费用计算交互蓝图',
      referenceType: 'competitor_observation',
      referenceNote: '吸收表单分组和结果块结构。',
      formGroupsJson: '[{"key":"amount"}]',
      resultBlocksJson: '[{"key":"summary"}]',
      ctaRulesJson: '[]',
      validationNotes: '金额为非负数',
      status: 'draft',
      reviewedBy: '',
      lastReviewedDate: '',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/data-sources/page', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/data-sources/save', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal-tool-center/interaction-blueprints/page', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/legal-tool-center/interaction-blueprints/save', expect.objectContaining({ method: 'POST' }));
  });

  it('posts LPR rate page and save requests to backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ id: 51, quoteDate: '2025-05-20', oneYearRate: 3, fiveYearPlusRate: 3.5 }],
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
          data: { id: 51, quoteDate: '2025-05-20', oneYearRate: 3, fiveYearPlusRate: 3.5 }
        })
      } as Response);

    await pageLegalLprRates({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 });
    await saveLegalLprRate({
      id: 51,
      appCode: 'lawsuit-material-assistant',
      quoteDate: '2025-05-20',
      oneYearRate: 3,
      fiveYearPlusRate: 3.5,
      sourceKey: 'lpr_chinamoney',
      sourceName: '贷款市场报价利率 LPR',
      sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
      sourceVersion: 'pbc-2025-05-20',
      lastCheckedDate: '2026-05-31',
      status: 'verified',
      sortOrder: 10,
      enabled: true
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/lpr-rates/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/lpr-rates/save', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        id: 51,
        appCode: 'lawsuit-material-assistant',
        quoteDate: '2025-05-20',
        oneYearRate: 3,
        fiveYearPlusRate: 3.5,
        sourceKey: 'lpr_chinamoney',
        sourceName: '贷款市场报价利率 LPR',
        sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
        sourceVersion: 'pbc-2025-05-20',
        lastCheckedDate: '2026-05-31',
        status: 'verified',
        sortOrder: 10,
        enabled: true
      })
    }));
  });

  it('posts annual common data page and save requests to backend endpoints', async () => {
    const annualData = {
      id: 71,
      appCode: 'lawsuit-material-assistant',
      regionCode: '430000',
      regionName: '湖南省',
      year: 2024,
      metricKey: 'annual_employees_average_wage',
      metricName: '就业人员年平均工资',
      value: 100000,
      unit: '元/年',
      sourceKey: 'hunan_stats_2024_sample',
      sourceName: '公开统计数据样例',
      sourceUrl: 'https://example.com/hunan-stats-2024',
      sourceVersion: 'annual-common-data-sample-2024',
      lastCheckedDate: '2026-06-02',
      usageScope: '小额诉讼限额金额区间核对',
      notice: '样例数据需核对地区统计公报和最新发布口径。',
      status: 'verified',
      sortOrder: 10,
      enabled: true,
      createdAt: '2026-06-02T10:00:00',
      updatedAt: '2026-06-02T10:00:00'
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, code: '0', msg: '', data: { dataList: [annualData], totalCount: 1 } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, code: '0', msg: '', data: annualData })
      } as Response);

    await pageAnnualCommonData({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 });
    await saveAnnualCommonData(annualData);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/annual-common-data/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/annual-common-data/save', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(annualData)
    }));
  });

  it('posts litigation fee rule page, save, preview and publish requests to backend endpoints', async () => {
    const rule = {
      id: 1,
      appCode: 'lawsuit-material-assistant',
      toolKey: 'litigation_fee',
      ruleKey: 'property_case_acceptance_fee',
      ruleName: '财产案件受理费',
      ruleVersion: 'state-council-order-481-v1',
      sourceKey: 'litigation_fee_state_council_481',
      status: 'draft',
      effectiveDate: '2007-04-01',
      lastCheckedDate: '2026-05-31',
      bands: [],
      noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
      disclaimerText: '本工具仅供参考。',
      ownerNote: '',
      sortOrder: 10,
      enabled: true,
      createdAt: '2026-05-31T10:00:00',
      updatedAt: '2026-05-31T10:00:00'
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { dataList: [rule], totalCount: 1 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: rule
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { amount: 0, fee: 0, feeMin: 50, feeMax: 300, bandLabel: '每件50元至300元' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { ...rule, status: 'published' }
        })
      } as Response);

    await pageLitigationFeeRules({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 });
    await saveLitigationFeeRule({
      appCode: 'lawsuit-material-assistant',
      toolKey: 'litigation_fee',
      ruleKey: 'property_case_acceptance_fee',
      ruleName: '财产案件受理费',
      ruleVersion: 'state-council-order-481-v1',
      sourceKey: 'litigation_fee_state_council_481',
      status: 'draft',
      effectiveDate: '2007-04-01',
      lastCheckedDate: '2026-05-31',
      bands: [{
        minExclusive: 0,
        maxInclusive: null,
        fixedFee: 0,
        feeMin: 50,
        feeMax: 300,
        excessBase: 0,
        excessRate: 0,
        rate: 0,
        quickAdjustment: 0,
        bandLabel: '每件50元至300元'
      }],
      noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
      disclaimerText: '本工具仅供参考。',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });
    const preview = await previewLitigationFeeRule({
      appCode: 'lawsuit-material-assistant',
      ruleKey: 'divorce_case_acceptance_fee',
      amount: 0
    });
    await publishLitigationFeeRule(1);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/litigation-fee-rules/page', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant', pageNo: 1, pageSize: 50 })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/litigation-fee-rules/save', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        toolKey: 'litigation_fee',
        ruleKey: 'property_case_acceptance_fee',
        ruleName: '财产案件受理费',
        ruleVersion: 'state-council-order-481-v1',
        sourceKey: 'litigation_fee_state_council_481',
        status: 'draft',
        effectiveDate: '2007-04-01',
        lastCheckedDate: '2026-05-31',
        bands: [{
          minExclusive: 0,
          maxInclusive: null,
          fixedFee: 0,
          feeMin: 50,
          feeMax: 300,
          excessBase: 0,
          excessRate: 0,
          rate: 0,
          quickAdjustment: 0,
          bandLabel: '每件50元至300元'
        }],
        noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
        disclaimerText: '本工具仅供参考。',
        ownerNote: '',
        sortOrder: 10,
        enabled: true
      })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal-tool-center/litigation-fee-rules/preview', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        ruleKey: 'divorce_case_acceptance_fee',
        amount: 0
      })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/legal-tool-center/litigation-fee-rules/1/publish', expect.objectContaining({
      method: 'POST'
    }));
    expect(preview.feeMin).toBe(50);
    expect(preview.feeMax).toBe(300);
  });

  it('posts element template file manifest, validation and import requests to backend endpoints', async () => {
    const payload = {
      appCode: 'lawsuit-material-assistant',
      files: [{
        templateKey: 'private_lending_complaint',
        objectPath: 'element-templates/private_lending_complaint.docx',
        fileName: '民间借贷纠纷起诉状.docx',
        fileType: 'docx'
      }]
    };
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            appCode: 'lawsuit-material-assistant',
            staticBaseUrl: 'https://static.cekaitech.cn',
            totalCount: 67,
            missingFileMetadataCount: 0,
            files: payload.files.map((file) => ({ ...file, downloadUrl: `https://static.cekaitech.cn/${file.objectPath}`, enabled: true, status: 'published' }))
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            appCode: 'lawsuit-material-assistant',
            staticBaseUrl: 'https://static.cekaitech.cn',
            totalCount: 67,
            missingFileMetadataCount: 0,
            invalidObjectPathCount: 0,
            invalidFileNameCount: 0,
            invalidFileTypeCount: 0,
            invalidDownloadUrlCount: 0,
            readyToPublish: true,
            issues: []
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            appCode: 'lawsuit-material-assistant',
            totalCount: 1,
            acceptedCount: 1,
            issueCount: 0,
            readyToImport: true,
            issues: []
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            appCode: 'lawsuit-material-assistant',
            updatedCount: 1,
            readyToPublish: true
          }
        })
      } as Response);

    const manifest = await manifestElementTemplateFiles({ appCode: 'lawsuit-material-assistant' });
    const validation = await validateElementTemplateFiles({ appCode: 'lawsuit-material-assistant' });
    const preview = await previewElementTemplateFileImport(payload);
    const applied = await applyElementTemplateFileImport(payload);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal-tool-center/element-template-files/manifest', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal-tool-center/element-template-files/validate', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal-tool-center/element-template-files/import-preview', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/legal-tool-center/element-template-files/import-apply', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(manifest.totalCount).toBe(67);
    expect(validation.readyToPublish).toBe(true);
    expect(preview.acceptedCount).toBe(1);
    expect(applied.updatedCount).toBe(1);
  });
});
