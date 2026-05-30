import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  pageLegalToolCapabilities,
  pageLegalToolDataSources,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  pageLegalToolInteractionBlueprints,
  saveLegalToolCapability,
  saveLegalToolDataSource,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem
  ,
  saveLegalToolInteractionBlueprint
} from '../../api/legalToolCenter';
import { useAuthStore } from '../../stores/auth';
import LegalToolCenterPage from './LegalToolCenterPage.vue';

vi.mock('../../api/legalToolCenter', () => ({
  pageLegalToolCapabilities: vi.fn(),
  saveLegalToolCapability: vi.fn(),
  pageLegalToolDataSources: vi.fn(),
  saveLegalToolDataSource: vi.fn(),
  pageLegalToolExposureGroups: vi.fn(),
  saveLegalToolExposureGroup: vi.fn(),
  disableLegalToolExposureGroup: vi.fn(),
  pageLegalToolExposureItems: vi.fn(),
  saveLegalToolExposureItem: vi.fn(),
  disableLegalToolExposureItem: vi.fn(),
  pageLegalToolInteractionBlueprints: vi.fn(),
  saveLegalToolInteractionBlueprint: vi.fn()
}));

const pageLegalToolCapabilitiesMock = vi.mocked(pageLegalToolCapabilities);
const saveLegalToolCapabilityMock = vi.mocked(saveLegalToolCapability);
const pageLegalToolDataSourcesMock = vi.mocked(pageLegalToolDataSources);
const saveLegalToolDataSourceMock = vi.mocked(saveLegalToolDataSource);
const pageLegalToolExposureGroupsMock = vi.mocked(pageLegalToolExposureGroups);
const saveLegalToolExposureGroupMock = vi.mocked(saveLegalToolExposureGroup);
const disableLegalToolExposureGroupMock = vi.mocked(disableLegalToolExposureGroup);
const pageLegalToolExposureItemsMock = vi.mocked(pageLegalToolExposureItems);
const saveLegalToolExposureItemMock = vi.mocked(saveLegalToolExposureItem);
const disableLegalToolExposureItemMock = vi.mocked(disableLegalToolExposureItem);
const pageLegalToolInteractionBlueprintsMock = vi.mocked(pageLegalToolInteractionBlueprints);
const saveLegalToolInteractionBlueprintMock = vi.mocked(saveLegalToolInteractionBlueprint);

const capability = {
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
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const group = {
  id: 11,
  appCode: 'lawsuit-material-assistant',
  groupKey: 'legal_calculators',
  title: '诉讼计算',
  description: '常用诉讼费用、利息和日期辅助计算',
  tone: 'teal',
  visibility: 'public',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const exposureItem = {
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
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const dataSource = {
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
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const blueprint = {
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
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

function mountPage(
  permissions: string[] = ['admin:legal-tool-center:view', 'admin:legal-tool-center:manage']
) {
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
  return mount(LegalToolCenterPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('LegalToolCenterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLegalToolCapabilitiesMock.mockReset();
    saveLegalToolCapabilityMock.mockReset();
    pageLegalToolDataSourcesMock.mockReset();
    saveLegalToolDataSourceMock.mockReset();
    pageLegalToolExposureGroupsMock.mockReset();
    saveLegalToolExposureGroupMock.mockReset();
    disableLegalToolExposureGroupMock.mockReset();
    pageLegalToolExposureItemsMock.mockReset();
    saveLegalToolExposureItemMock.mockReset();
    disableLegalToolExposureItemMock.mockReset();
    pageLegalToolInteractionBlueprintsMock.mockReset();
    saveLegalToolInteractionBlueprintMock.mockReset();

    pageLegalToolCapabilitiesMock.mockResolvedValue({ dataList: [capability], totalCount: 1 });
    pageLegalToolDataSourcesMock.mockResolvedValue({ dataList: [dataSource], totalCount: 1 });
    pageLegalToolExposureGroupsMock.mockResolvedValue({ dataList: [group], totalCount: 1 });
    pageLegalToolExposureItemsMock.mockResolvedValue({ dataList: [exposureItem], totalCount: 1 });
    pageLegalToolInteractionBlueprintsMock.mockResolvedValue({ dataList: [blueprint], totalCount: 1 });
    saveLegalToolCapabilityMock.mockResolvedValue(capability);
    saveLegalToolDataSourceMock.mockResolvedValue(dataSource);
    saveLegalToolExposureGroupMock.mockResolvedValue(group);
    saveLegalToolExposureItemMock.mockResolvedValue(exposureItem);
    saveLegalToolInteractionBlueprintMock.mockResolvedValue(blueprint);
    disableLegalToolExposureGroupMock.mockResolvedValue({ ...group, enabled: false });
    disableLegalToolExposureItemMock.mockResolvedValue({ ...exposureItem, enabled: false });
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue({ action: 'confirm' } as Awaited<ReturnType<typeof ElMessageBox.confirm>>);
  });

  it('loads capabilities, groups and first group exposure items on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageLegalToolCapabilitiesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolDataSourcesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolExposureGroupsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolExposureItemsMock).toHaveBeenCalledWith({
      groupId: 11,
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolInteractionBlueprintsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('法律工具中心');
    expect(wrapper.text()).toContain('能力库');
    expect(wrapper.text()).toContain('数据来源');
    expect(wrapper.text()).toContain('展示分组');
    expect(wrapper.text()).toContain('曝光入口');
    expect(wrapper.text()).toContain('交互蓝图');
    expect(wrapper.text()).toContain('诉讼费用');
    expect(wrapper.text()).toContain('official');
    expect(wrapper.text()).toContain('medium');
    expect(wrapper.text()).toContain('民事案件案由规定');
    expect(wrapper.text()).toContain('诉讼计算');
    expect(wrapper.text()).toContain('诉讼费用计算交互蓝图');
  });

  it('hides write actions when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:legal-tool-center:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('新增能力');
    expect(wrapper.text()).not.toContain('新增分组');
    expect(wrapper.text()).not.toContain('新增入口');
    expect(wrapper.text()).not.toContain('禁用');
  });

  it('saves a capability through backend and refreshes capability list', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolCapabilitiesMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openCapabilityDialog: (row?: typeof capability) => void;
      capabilityForm: typeof capability;
      submitCapability: () => Promise<void>;
    };
    vm.openCapabilityDialog(capability);
    Object.assign(vm.capabilityForm, capability);
    await vm.submitCapability();
    await flushAsyncUpdates();

    expect(saveLegalToolCapabilityMock).toHaveBeenCalledWith({
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
    expect(pageLegalToolCapabilitiesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('saves data sources and blueprints through backend without audit fields', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolDataSourcesMock.mockClear();
    pageLegalToolInteractionBlueprintsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openDataSourceDialog: (row?: typeof dataSource) => void;
      dataSourceForm: typeof dataSource;
      submitDataSource: () => Promise<void>;
      openBlueprintDialog: (row?: typeof blueprint) => void;
      blueprintForm: typeof blueprint;
      submitBlueprint: () => Promise<void>;
    };

    vm.openDataSourceDialog(dataSource);
    Object.assign(vm.dataSourceForm, dataSource);
    await vm.submitDataSource();

    vm.openBlueprintDialog(blueprint);
    Object.assign(vm.blueprintForm, blueprint);
    await vm.submitBlueprint();
    await flushAsyncUpdates();

    expect(saveLegalToolDataSourceMock).toHaveBeenCalledWith({
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
    expect(saveLegalToolInteractionBlueprintMock).toHaveBeenCalledWith({
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
    expect(pageLegalToolDataSourcesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolInteractionBlueprintsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('saves and disables exposure groups through backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolExposureGroupsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openGroupDialog: (row?: typeof group) => void;
      groupForm: typeof group;
      submitGroup: () => Promise<void>;
      disableGroup: (row: typeof group) => Promise<void>;
    };
    vm.openGroupDialog(group);
    Object.assign(vm.groupForm, group);
    await vm.submitGroup();
    await vm.disableGroup(group);
    await flushAsyncUpdates();

    expect(saveLegalToolExposureGroupMock).toHaveBeenCalledWith({
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
    expect(disableLegalToolExposureGroupMock).toHaveBeenCalledWith(11);
    expect(pageLegalToolExposureGroupsMock).toHaveBeenCalled();
  });

  it('saves and disables exposure items through backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolExposureItemsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openExposureItemDialog: (row?: typeof exposureItem) => void;
      exposureItemForm: typeof exposureItem;
      submitExposureItem: () => Promise<void>;
      disableExposureItem: (row: typeof exposureItem) => Promise<void>;
    };
    vm.openExposureItemDialog(exposureItem);
    Object.assign(vm.exposureItemForm, exposureItem);
    await vm.submitExposureItem();
    await vm.disableExposureItem(exposureItem);
    await flushAsyncUpdates();

    expect(saveLegalToolExposureItemMock).toHaveBeenCalledWith({
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
    expect(disableLegalToolExposureItemMock).toHaveBeenCalledWith(21);
    expect(pageLegalToolExposureItemsMock).toHaveBeenCalledWith({
      groupId: 11,
      pageNo: 1,
      pageSize: 50
    });
  });

  it('uses shared miniapp icon picker for exposure item icon keys', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      openExposureItemDialog: (row?: typeof exposureItem) => void;
      exposureItemForm: typeof exposureItem;
    };
    vm.openExposureItemDialog(exposureItem);
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.find('[data-test="miniapp-icon-scale"]').exists()).toBe(true);

    await wrapper.find('[data-test="miniapp-icon-calculator"]').trigger('click');
    await nextTick();

    expect(vm.exposureItemForm.iconKey).toBe('calculator');
    expect(wrapper.text()).toContain('当前图标：calculator');
  });
});
