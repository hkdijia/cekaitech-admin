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
        catalogStatus: 'coming_soon',
        catalogEnabled: true,
        configured: false,
        generationEnabled: false,
        templateSupported: false,
        schemaVersion: null,
        statusText: '暂无生成配置'
      }
    ]);
    getTemplateMock.mockImplementation(async (_appCode: string, caseType: string) => ({
      appCode: 'lawsuit-material-assistant',
      caseType,
      schemaVersion: 1,
      template: caseType === 'divorce' ? divorceTemplate : template
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
        draftTitle: payload.caseType === 'divorce' ? '离婚纠纷起诉材料草稿' : '借贷纠纷起诉材料草稿',
        draftContent: payload.caseType === 'divorce'
          ? '民事起诉状\n原告王五与被告赵六离婚纠纷。'
          : '民事起诉状\n李四向张三出借50000元。',
        riskNotice: '仅作为材料整理辅助。',
        evidenceChecklist: payload.caseType === 'divorce' ? ['结婚证'] : ['付款凭证'],
        filingTips: payload.caseType === 'divorce' ? ['核对被告住所地'] : ['核对管辖法院'],
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

  it('hides save action when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:private-lending-result-template:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('结果模板配置');
    expect(wrapper.text()).not.toContain('保存模板');
  });
});
