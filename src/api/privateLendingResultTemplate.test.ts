import { describe, expect, it, vi } from 'vitest';
import {
  getCaseResultTemplateOptions,
  getPrivateLendingResultTemplate,
  previewPrivateLendingResultTemplate,
  savePrivateLendingResultTemplate
} from './privateLendingResultTemplate';

const template = {
  draftTitle: '借贷纠纷起诉材料草稿',
  riskNotice: '仅作为材料整理辅助。',
  filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
  filingGuideLabel: '查看立案指导服务',
  evidenceChecklist: ['付款凭证'],
  filingTips: ['核对管辖法院'],
  draftLines: ['民事起诉状', '{{lenderName}}向{{borrowerName}}出借{{principalAmount}}元。']
};

describe('private lending result template api', () => {
  it('calls case result template option, get, save and preview backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: [
            {
              appCode: 'lawsuit-material-assistant',
              caseType: 'private_lending',
              title: '民间借贷纠纷',
              configured: true,
              generationEnabled: true,
              templateSupported: true,
              schemaVersion: 1,
              statusText: '可编辑'
            },
            {
              appCode: 'lawsuit-material-assistant',
              caseType: 'divorce',
              title: '离婚纠纷',
              configured: false,
              generationEnabled: false,
              templateSupported: false,
              schemaVersion: null,
              statusText: '暂无生成配置'
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
          data: { appCode: 'lawsuit-material-assistant', caseType: 'private_lending', schemaVersion: 1, template }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { appCode: 'lawsuit-material-assistant', caseType: 'private_lending', schemaVersion: 1, template }
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
            caseType: 'private_lending',
            schemaVersion: 1,
            docPackage: {
              status: 'generated',
              draftTitle: '借贷纠纷起诉材料草稿',
              draftContent: '民事起诉状\n李四向张三出借50000元。',
              riskNotice: '仅作为材料整理辅助。',
              evidenceChecklist: ['付款凭证'],
              filingTips: ['核对管辖法院'],
              filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
              filingGuideLabel: '查看立案指导服务',
              generatedBy: 'backend_deterministic'
            }
          }
        })
      } as Response);

    const options = await getCaseResultTemplateOptions('lawsuit-material-assistant');
    await getPrivateLendingResultTemplate('lawsuit-material-assistant', 'private_lending');
    await savePrivateLendingResultTemplate({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      template
    });
    const preview = await previewPrivateLendingResultTemplate({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      sampleFormData: { borrowerName: '张三' }
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/admin/case-result-template/options?appCode=lawsuit-material-assistant',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/admin/case-result-template?appCode=lawsuit-material-assistant&caseType=private_lending',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/case-result-template/save', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        template
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/case-result-template/preview', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        sampleFormData: { borrowerName: '张三' }
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(options[1].statusText).toBe('暂无生成配置');
    expect(preview.docPackage.draftContent).toContain('李四向张三出借50000元');
  });
});
