import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getCaseResultTemplateOptions,
  getPrivateLendingResultTemplate,
  previewPrivateLendingResultTemplate,
  savePrivateLendingResultTemplate
} from '../../api/privateLendingResultTemplate';
import { useAuthStore } from '../../stores/auth';
import PrivateLendingResultTemplatePage from './PrivateLendingResultTemplatePage.vue';

vi.mock('../../api/privateLendingResultTemplate', () => ({
  getCaseResultTemplateOptions: vi.fn(),
  getPrivateLendingResultTemplate: vi.fn(),
  savePrivateLendingResultTemplate: vi.fn(),
  previewPrivateLendingResultTemplate: vi.fn()
}));

const getOptionsMock = vi.mocked(getCaseResultTemplateOptions);
const getTemplateMock = vi.mocked(getPrivateLendingResultTemplate);
const saveTemplateMock = vi.mocked(savePrivateLendingResultTemplate);
const previewTemplateMock = vi.mocked(previewPrivateLendingResultTemplate);

const template = {
  draftTitle: '借贷纠纷起诉材料草稿',
  riskNotice: '仅作为材料整理辅助。',
  filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
  filingGuideLabel: '查看立案指导服务',
  evidenceChecklist: ['付款凭证', '借条或聊天记录'],
  filingTips: ['核对管辖法院'],
  draftLines: ['民事起诉状', '{{lenderName}}向{{borrowerName}}出借{{principalAmount}}元。']
};

const divorceTemplate = {
  draftTitle: '离婚纠纷起诉材料草稿',
  riskNotice: '仅作为材料整理辅助。',
  filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
  filingGuideLabel: '查看立案指导服务',
  evidenceChecklist: ['结婚证、婚姻登记记录或能够证明婚姻关系的材料'],
  filingTips: ['核对被告住所地或经常居住地'],
  draftLines: ['民事起诉状', '原告{{plaintiffName}}与被告{{defendantName}}离婚纠纷。']
};

const laborTemplate = {
  draftTitle: '劳动争议起诉材料草稿',
  riskNotice: '仅作为材料整理辅助。',
  filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
  filingGuideLabel: '查看立案指导服务',
  evidenceChecklist: ['{{contractEvidence}}', '{{wageEvidence}}'],
  filingTips: ['核对劳动仲裁程序'],
  draftLines: ['民事起诉状', '原告{{employeeName}}与被告{{employerName}}劳动争议。']
};

function mountPage(permissions: string[] = [
  'admin:private-lending-result-template:view',
  'admin:private-lending-result-template:manage'
]) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions
  };
  return mount(PrivateLendingResultTemplatePage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 4; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('PrivateLendingResultTemplatePage', () => {
  beforeEach(() => {
    localStorage.clear();
    getOptionsMock.mockReset();
    getTemplateMock.mockReset();
    saveTemplateMock.mockReset();
    previewTemplateMock.mockReset();
    getOptionsMock.mockResolvedValue([
      {
        appCode: 'lawsuit-material-assistant',
        caseType: 'private_lending',
        title: '民间借贷纠纷',
        catalogStatus: 'open',
        catalogEnabled: true,
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
        catalogStatus: 'coming_soon',
        catalogEnabled: true,
        configured: true,
        generationEnabled: true,
        templateSupported: true,
        schemaVersion: 1,
        statusText: '可编辑'
      },
      {
        appCode: 'lawsuit-material-assistant',
        caseType: 'labor',
        title: '劳动争议',
        catalogStatus: 'open',
        catalogEnabled: true,
        configured: true,
        generationEnabled: true,
        templateSupported: true,
        schemaVersion: 1,
        statusText: '可编辑'
      }
    ]);
    getTemplateMock.mockImplementation(async (_appCode: string, caseType: string) => ({
      appCode: 'lawsuit-material-assistant',
      caseType,
      schemaVersion: 1,
      template: caseType === 'divorce' ? divorceTemplate : caseType === 'labor' ? laborTemplate : template
    }));
    saveTemplateMock.mockResolvedValue({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      schemaVersion: 1,
      template
    });
    previewTemplateMock.mockImplementation(async (payload) => ({
      appCode: 'lawsuit-material-assistant',
      caseType: payload.caseType,
      schemaVersion: 1,
      docPackage: {
        status: 'generated',
        draftTitle: payload.caseType === 'divorce'
          ? '离婚纠纷起诉材料草稿'
          : payload.caseType === 'labor'
            ? '劳动争议起诉材料草稿'
            : '借贷纠纷起诉材料草稿',
        draftContent: payload.caseType === 'divorce'
          ? '民事起诉状\n原告王五与被告赵六离婚纠纷。\n此致\n有管辖权的人民法院\n具状人：王五\n日期：未填写'
          : payload.caseType === 'labor'
            ? '民事起诉状\n原告孙七与被告杭州某科技有限公司劳动争议。\n此致\n有管辖权的人民法院\n具状人：孙七\n日期：未填写'
            : '民事起诉状\n李四向张三出借50000元。\n诉讼请求：\n1. 请求返还借款。\n此致\n有管辖权的人民法院\n具状人：李四\n日期：未填写',
        draftBlocks: payload.caseType === 'divorce'
          ? [
            { type: 'title', text: '民事起诉状', align: 'center', indent: 0 },
            { type: 'paragraph', text: '原告王五与被告赵六离婚纠纷。', align: 'left', indent: 2 },
            { type: 'salutation', text: '此致', align: 'left', indent: 0 },
            { type: 'court', text: '有管辖权的人民法院', align: 'left', indent: 2 },
            { type: 'signature', text: '具状人：王五', align: 'right', indent: 0 },
            { type: 'signature', text: '日期：未填写', align: 'right', indent: 0 }
          ]
          : payload.caseType === 'labor'
            ? [
              { type: 'title', text: '民事起诉状', align: 'center', indent: 0 },
              { type: 'paragraph', text: '原告孙七与被告杭州某科技有限公司劳动争议。', align: 'left', indent: 2 },
              { type: 'salutation', text: '此致', align: 'left', indent: 0 },
              { type: 'court', text: '有管辖权的人民法院', align: 'left', indent: 2 },
              { type: 'signature', text: '具状人：孙七', align: 'right', indent: 0 },
              { type: 'signature', text: '日期：未填写', align: 'right', indent: 0 }
            ]
          : [
            { type: 'title', text: '民事起诉状', align: 'center', indent: 0 },
            { type: 'paragraph', text: '李四向张三出借50000元。', align: 'left', indent: 2 },
            { type: 'section_heading', text: '诉讼请求：', align: 'left', indent: 0 },
            { type: 'paragraph', text: '1. 请求返还借款。', align: 'left', indent: 2 },
            { type: 'salutation', text: '此致', align: 'left', indent: 0 },
            { type: 'court', text: '有管辖权的人民法院', align: 'left', indent: 2 },
            { type: 'signature', text: '具状人：李四', align: 'right', indent: 0 },
            { type: 'signature', text: '日期：未填写', align: 'right', indent: 0 }
          ],
        riskNotice: '仅作为材料整理辅助。',
        evidenceChecklist: payload.caseType === 'divorce' ? ['结婚证'] : payload.caseType === 'labor' ? ['劳动合同'] : ['付款凭证'],
        filingTips: payload.caseType === 'divorce' ? ['核对被告住所地'] : payload.caseType === 'labor' ? ['核对劳动仲裁程序'] : ['核对管辖法院'],
        filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
        filingGuideLabel: '查看立案指导服务',
        generatedBy: 'backend_deterministic'
      }
    }));
  });

  it('loads template and renders structured editor', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(getOptionsMock).toHaveBeenCalledWith('lawsuit-material-assistant');
    expect(getTemplateMock).toHaveBeenCalledWith('lawsuit-material-assistant', 'private_lending');
    expect(wrapper.text()).toContain('结果模板配置');
    expect(wrapper.text()).toContain('民间借贷纠纷');
    expect(wrapper.text()).toContain('离婚纠纷');
    expect(wrapper.text()).toContain('可编辑');
    const vm = wrapper.vm as unknown as { templateForm: typeof template };
    expect(vm.templateForm.draftTitle).toBe('借贷纠纷起诉材料草稿');
    expect(vm.templateForm.evidenceChecklist).toContain('付款凭证');
    expect(vm.templateForm.draftLines).toContain('{{lenderName}}向{{borrowerName}}出借{{principalAmount}}元。');
  });

  it('loads divorce editor and previews with divorce sample data', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      selectedCaseType: string;
      selectCaseType: (caseType: string) => Promise<void>;
      templateForm: typeof template;
      previewTemplate: () => Promise<void>;
    };
    await vm.selectCaseType('divorce');
    await flushAsyncUpdates();
    await vm.previewTemplate();
    await flushAsyncUpdates();

    expect(vm.selectedCaseType).toBe('divorce');
    expect(getTemplateMock).toHaveBeenCalledWith('lawsuit-material-assistant', 'divorce');
    expect(vm.templateForm.draftTitle).toBe('离婚纠纷起诉材料草稿');
    expect(previewTemplateMock).toHaveBeenLastCalledWith({
      appCode: 'lawsuit-material-assistant',
      caseType: 'divorce',
      sampleFormData: expect.objectContaining({
        plaintiffName: '王五',
        defendantName: '赵六',
        marriageDate: '2018-05-20'
      })
    });
    expect(wrapper.text()).toContain('离婚纠纷');
    expect(wrapper.text()).toContain('原告王五与被告赵六离婚纠纷');
  });

  it('loads labor editor and previews with labor sample data', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      selectedCaseType: string;
      selectCaseType: (caseType: string) => Promise<void>;
      templateForm: typeof template;
      previewTemplate: () => Promise<void>;
    };
    await vm.selectCaseType('labor');
    await flushAsyncUpdates();
    await vm.previewTemplate();
    await flushAsyncUpdates();

    expect(vm.selectedCaseType).toBe('labor');
    expect(getTemplateMock).toHaveBeenCalledWith('lawsuit-material-assistant', 'labor');
    expect(vm.templateForm.draftTitle).toBe('劳动争议起诉材料草稿');
    expect(previewTemplateMock).toHaveBeenLastCalledWith({
      appCode: 'lawsuit-material-assistant',
      caseType: 'labor',
      sampleFormData: expect.objectContaining({
        employeeName: '孙七',
        employerName: '杭州某科技有限公司',
        laborClaim: 'wage_and_compensation'
      })
    });
    expect(wrapper.text()).toContain('劳动争议');
    expect(wrapper.text()).toContain('原告孙七与被告杭州某科技有限公司劳动争议');
  });

  it('saves template through backend when operator can manage', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      templateForm: typeof template;
      saveTemplate: () => Promise<void>;
    };
    vm.templateForm.draftTitle = '后台配置借贷材料草稿';
    await vm.saveTemplate();
    await flushAsyncUpdates();

    expect(saveTemplateMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      template: expect.objectContaining({ draftTitle: '后台配置借贷材料草稿' })
    });
  });

  it('previews generated doc package from backend', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      previewTemplate: () => Promise<void>;
    };
    await vm.previewTemplate();
    await flushAsyncUpdates();

    expect(previewTemplateMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      sampleFormData: expect.objectContaining({ borrowerName: '张三' })
    });
    expect(wrapper.text()).toContain('李四向张三出借50000元');
    expect(wrapper.text()).toContain('核对管辖法院');
  });

  it('renders generated complaint preview with legal document layout classes', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      previewTemplate: () => Promise<void>;
    };
    await vm.previewTemplate();
    await flushAsyncUpdates();

    expect(wrapper.find('.document-paper').exists()).toBe(true);
    expect(wrapper.find('pre').exists()).toBe(false);
    expect(wrapper.find('.document-line-title').text()).toBe('民事起诉状');
    expect(wrapper.find('.document-line-heading').text()).toBe('诉讼请求：');
    expect(wrapper.find('.document-line-court').text()).toBe('有管辖权的人民法院');
    expect(wrapper.findAll('.document-line-signature').map((item) => item.text())).toEqual([
      '具状人：李四',
      '日期：未填写'
    ]);
  });

  it('prefers backend draft blocks when rendering generated complaint preview', async () => {
    previewTemplateMock.mockResolvedValueOnce({
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      schemaVersion: 1,
      docPackage: {
        status: 'generated',
        draftTitle: '借贷纠纷起诉材料草稿',
        draftContent: '民事起诉状\n诉讼请求：\n这行正文不应被解析为签名。',
        draftBlocks: [
          { type: 'title', text: '民事起诉状', align: 'center', indent: 0 },
          { type: 'section_heading', text: '诉讼请求：', align: 'left', indent: 0 },
          { type: 'signature', text: '具状人：李四', align: 'right', indent: 0 }
        ],
        riskNotice: '仅作为材料整理辅助。',
        evidenceChecklist: ['付款凭证'],
        filingTips: ['核对管辖法院'],
        filingGuideUrl: '/pages/value-added-detail/value-added-detail?serviceKey=filing_guidance',
        filingGuideLabel: '查看立案指导服务',
        generatedBy: 'backend_deterministic'
      }
    });
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      previewTemplate: () => Promise<void>;
    };
    await vm.previewTemplate();
    await flushAsyncUpdates();

    expect(wrapper.find('.document-line-heading').text()).toBe('诉讼请求：');
    expect(wrapper.find('.document-line-signature').text()).toBe('具状人：李四');
    expect(wrapper.text()).not.toContain('这行正文不应被解析为签名');
  });

  it('hides save action when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:private-lending-result-template:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('结果模板配置');
    expect(wrapper.text()).not.toContain('保存模板');
  });
});
