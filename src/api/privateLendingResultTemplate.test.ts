import { describe, expect, it, vi } from 'vitest';
import {
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
  it('calls get, save and preview backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
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
      '/api/admin/private-lending-result-template?appCode=lawsuit-material-assistant&caseType=private_lending',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/private-lending-result-template/save', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        template
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/private-lending-result-template/preview', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        sampleFormData: { borrowerName: '张三' }
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(preview.docPackage.draftContent).toContain('李四向张三出借50000元');
  });
});
