import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentRules,
  getStoreAppointmentRollbackPreview,
  getStoreAppointmentServiceCatalog,
  getStoreAppointmentStaffRoster,
  getStoreAppointmentStoreProfile,
  getStoreAppointmentBookingConfig,
  getStoreAppointmentDetail,
  pageStoreAppointments,
  rollbackStoreAppointmentConfig,
  updateStoreAppointmentRules,
  updateStoreAppointmentServiceCatalog,
  updateStoreAppointmentStaffRoster,
  updateStoreAppointmentStoreProfile,
  updateStoreAppointmentStatus
} from '../../api/storeAppointments';
import { useAuthStore } from '../../stores/auth';
import StoreAppointmentsPage from './StoreAppointmentsPage.vue';

vi.mock('../../api/storeAppointments', () => ({
  pageStoreAppointments: vi.fn(),
  getStoreAppointmentDetail: vi.fn(),
  updateStoreAppointmentStatus: vi.fn(),
  getStoreAppointmentBookingConfig: vi.fn(),
  getStoreAppointmentStoreProfile: vi.fn(),
  updateStoreAppointmentStoreProfile: vi.fn(),
  getStoreAppointmentServiceCatalog: vi.fn(),
  updateStoreAppointmentServiceCatalog: vi.fn(),
  getStoreAppointmentStaffRoster: vi.fn(),
  updateStoreAppointmentStaffRoster: vi.fn(),
  getStoreAppointmentRules: vi.fn(),
  updateStoreAppointmentRules: vi.fn(),
  getStoreAppointmentRollbackPreview: vi.fn(),
  rollbackStoreAppointmentConfig: vi.fn()
}));

const pageStoreAppointmentsMock = vi.mocked(pageStoreAppointments);
const getStoreAppointmentDetailMock = vi.mocked(getStoreAppointmentDetail);
const updateStoreAppointmentStatusMock = vi.mocked(updateStoreAppointmentStatus);
const getStoreAppointmentBookingConfigMock = vi.mocked(getStoreAppointmentBookingConfig);
const getStoreAppointmentStoreProfileMock = vi.mocked(getStoreAppointmentStoreProfile);
const updateStoreAppointmentStoreProfileMock = vi.mocked(updateStoreAppointmentStoreProfile);
const getStoreAppointmentServiceCatalogMock = vi.mocked(getStoreAppointmentServiceCatalog);
const updateStoreAppointmentServiceCatalogMock = vi.mocked(updateStoreAppointmentServiceCatalog);
const getStoreAppointmentStaffRosterMock = vi.mocked(getStoreAppointmentStaffRoster);
const updateStoreAppointmentStaffRosterMock = vi.mocked(updateStoreAppointmentStaffRoster);
const getStoreAppointmentRulesMock = vi.mocked(getStoreAppointmentRules);
const updateStoreAppointmentRulesMock = vi.mocked(updateStoreAppointmentRules);
const getStoreAppointmentRollbackPreviewMock = vi.mocked(getStoreAppointmentRollbackPreview);
const rollbackStoreAppointmentConfigMock = vi.mocked(rollbackStoreAppointmentConfig);

const appointmentItem = {
  appointmentId: 101,
  storeCode: 'luyu-nail',
  storeName: '鹿屿美甲工作室',
  projectCode: 'basic-nail',
  projectName: '基础美甲',
  staffCode: 'staff-amy',
  staffName: 'Amy',
  customerDisplayName: '王女士',
  customerContact: '13800001111',
  appointmentDate: '2026-06-20',
  timeSlot: '10:00',
  status: 'pending',
  remark: '想做玫瑰色',
  createdAt: '2026-06-19T09:00:00',
  updatedAt: '2026-06-19T09:00:00'
};

const appointmentDetail = {
  appointment: {
    ...appointmentItem,
    status: 'confirmed',
    updatedAt: '2026-06-19T09:30:00'
  },
  statusLogs: [
    {
      fromStatus: 'pending',
      toStatus: 'confirmed',
      operatorType: 'admin',
      operatorId: 'admin-1',
      createdAt: '2026-06-19T09:30:00'
    }
  ]
};

const bookingConfig = {
  store: {
    storeCode: 'store-config-001',
    name: '中性预约门店',
    industry: 'beauty',
    phone: '0571-00000000',
    address: '杭州市示例路 1 号',
    businessHours: '10:00-20:00',
    staffLabel: '员工',
    projectLabel: '项目',
    showPrice: true
  },
  serviceProjects: [
    {
      projectCode: 'basic-service',
      categoryId: 'general',
      name: '基础服务',
      summary: '适合首次体验',
      durationMinutes: 60,
      priceText: '到店咨询',
      showPrice: true
    }
  ],
  staffMembers: [
    {
      staffCode: 'staff-001',
      name: '员工 A',
      role: '服务顾问',
      bio: '擅长基础服务',
      avatarUrl: '',
      trustHighlights: '3 年经验'
    }
  ],
  staffProjects: [
    {
      staffCode: 'staff-001',
      projectCode: 'basic-service'
    }
  ],
  appointmentRule: {
    bookingWindowDays: 14,
    defaultDurationMinutes: 60,
    defaultSlots: ['10:00', '14:00'],
    confirmationHint: '到店前确认',
    cancelHint: '如需取消请提前联系'
  }
};

const storeProfile = {
  storeCode: 'store-config-001',
  name: '中性预约门店',
  industry: 'beauty',
  phone: '0571-00000000',
  address: '杭州市示例路 1 号',
  businessHours: '10:00-20:00',
  staffLabel: '员工',
  projectLabel: '项目',
  showPrice: true,
  enabled: true,
  updatedAt: '2026-06-26T08:00:00'
};

const serviceCatalog = [
  {
    storeCode: 'store-config-001',
    projectCode: 'basic-service',
    categoryId: 'general',
    name: '基础服务',
    summary: '适合首次体验',
    durationMinutes: 60,
    priceText: '到店咨询',
    showPrice: true,
    enabled: true,
    updatedAt: '2026-06-26T08:00:00'
  }
];

const staffRoster = [
  {
    storeCode: 'store-config-001',
    staffCode: 'staff-001',
    name: '员工 A',
    role: '服务顾问',
    bio: '擅长基础服务',
    avatarUrl: '',
    trustHighlights: ['3 年经验'],
    enabled: true,
    projectCodes: ['basic-service'],
    updatedAt: '2026-06-26T08:00:00'
  }
];

const appointmentRules = {
  storeCode: 'store-config-001',
  bookingWindowDays: 14,
  defaultDurationMinutes: 60,
  defaultSlots: ['10:00', '14:00'],
  confirmationHint: '到店前确认',
  cancelHint: '如需取消请提前联系',
  updatedAt: '2026-06-26T08:00:00'
};

const rollbackPreview = {
  storeCode: 'store-config-001',
  auditLogId: 9001,
  configSurface: 'service-catalog',
  targetCode: 'basic-service',
  values: {
    name: '基础服务',
    summary: '适合首次体验',
    priceText: '到店咨询'
  },
  projectCodes: []
};

function mountPage(permissions: string[] = ['admin:store-appointment:view', 'admin:store-appointment:manage']) {
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
  return mount(StoreAppointmentsPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

function inputValue(wrapper: ReturnType<typeof mount>, selector: string) {
  return (wrapper.find(selector).element as HTMLInputElement).value;
}

describe('StoreAppointmentsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageStoreAppointmentsMock.mockReset();
    getStoreAppointmentDetailMock.mockReset();
    updateStoreAppointmentStatusMock.mockReset();
    getStoreAppointmentBookingConfigMock.mockReset();
    getStoreAppointmentStoreProfileMock.mockReset();
    updateStoreAppointmentStoreProfileMock.mockReset();
    getStoreAppointmentServiceCatalogMock.mockReset();
    updateStoreAppointmentServiceCatalogMock.mockReset();
    getStoreAppointmentStaffRosterMock.mockReset();
    updateStoreAppointmentStaffRosterMock.mockReset();
    getStoreAppointmentRulesMock.mockReset();
    updateStoreAppointmentRulesMock.mockReset();
    getStoreAppointmentRollbackPreviewMock.mockReset();
    rollbackStoreAppointmentConfigMock.mockReset();
    pageStoreAppointmentsMock.mockResolvedValue({
      dataList: [appointmentItem],
      totalCount: 1
    });
    getStoreAppointmentDetailMock.mockResolvedValue(appointmentDetail);
    updateStoreAppointmentStatusMock.mockResolvedValue({
      ...appointmentItem,
      status: 'confirmed',
      updatedAt: '2026-06-19T09:30:00'
    });
    getStoreAppointmentBookingConfigMock.mockResolvedValue(bookingConfig);
    getStoreAppointmentStoreProfileMock.mockResolvedValue(storeProfile);
    updateStoreAppointmentStoreProfileMock.mockResolvedValue({
      ...storeProfile,
      name: '新门店名',
      phone: '0571-00000001',
      updatedAt: '2026-06-26T08:10:00'
    });
    getStoreAppointmentServiceCatalogMock.mockResolvedValue(serviceCatalog);
    updateStoreAppointmentServiceCatalogMock.mockResolvedValue({
      ...serviceCatalog[0],
      name: '基础护理',
      durationMinutes: 75,
      updatedAt: '2026-06-26T08:20:00'
    });
    getStoreAppointmentStaffRosterMock.mockResolvedValue(staffRoster);
    updateStoreAppointmentStaffRosterMock.mockResolvedValue({
      ...staffRoster[0],
      name: '员工 B',
      role: '资深顾问',
      updatedAt: '2026-06-26T08:30:00'
    });
    getStoreAppointmentRulesMock.mockResolvedValue(appointmentRules);
    updateStoreAppointmentRulesMock.mockResolvedValue({
      ...appointmentRules,
      bookingWindowDays: 21,
      defaultDurationMinutes: 75,
      defaultSlots: ['09:30', '15:00'],
      updatedAt: '2026-06-26T08:40:00'
    });
    getStoreAppointmentRollbackPreviewMock.mockResolvedValue(rollbackPreview);
    rollbackStoreAppointmentConfigMock.mockResolvedValue({
      ...serviceCatalog[0],
      updatedAt: '2026-06-26T09:00:00'
    });
  });

  it('loads store appointments on mount and renders rows', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageStoreAppointmentsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      storeCode: undefined,
      projectCode: undefined,
      staffCode: undefined,
      status: undefined,
      appointmentDate: undefined
    });
    expect(wrapper.text()).toContain('门店预约');
    expect(wrapper.text()).toContain('鹿屿美甲工作室');
    expect(wrapper.text()).toContain('基础美甲');
    expect(wrapper.text()).toContain('Amy');
    expect(wrapper.text()).toContain('王女士');
    expect(wrapper.text()).toContain('待确认');
  });

  it('normalizes filters and searches appointments', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const inputs = wrapper.findAll('input');
    await inputs[2].setValue(' luyu-nail ');
    await inputs[3].setValue(' basic-nail ');
    await inputs[4].setValue(' staff-amy ');
    await inputs[5].setValue('2026-06-20');
    const statusSelect = wrapper.findComponent({ name: 'ElSelect' });
    statusSelect.vm.$emit('update:modelValue', 'pending');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('查询'))?.trigger('click');
    await flushAsyncUpdates();

    expect(pageStoreAppointmentsMock).toHaveBeenLastCalledWith({
      pageNo: 1,
      pageSize: 10,
      storeCode: 'luyu-nail',
      projectCode: 'basic-nail',
      staffCode: 'staff-amy',
      status: 'pending',
      appointmentDate: '2026-06-20'
    });
  });

  it('opens detail drawer with appointment status logs', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('查看详情'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentDetailMock).toHaveBeenCalledWith(101);
    expect(wrapper.text()).toContain('预约详情');
    expect(wrapper.text()).toContain('13800001111');
    expect(wrapper.text()).toContain('想做玫瑰色');
    expect(wrapper.text()).toContain('状态日志');
    expect(wrapper.text()).toContain('待确认 -> 已确认');
    expect(wrapper.text()).toContain('admin-1');
  });

  it('hides status actions without manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('查看预约、状态日志和后台流转结果');
    expect(wrapper.findAll('button').some((button) => button.text().includes('确认预约'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('标记到店'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('完成'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('取消预约'))).toBe(false);
  });

  it('shows allowed status actions for manage operator and updates pending appointment', async () => {
    getStoreAppointmentDetailMock.mockResolvedValue({
      ...appointmentDetail,
      appointment: { ...appointmentItem, status: 'pending' },
      statusLogs: []
    });
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment:manage']);
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('查看详情'))?.trigger('click');
    await flushAsyncUpdates();

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).toContain('确认预约');
    expect(buttonText).toContain('取消预约');
    expect(buttonText).not.toContain('标记到店');
    expect(buttonText).not.toContain('完成');

    await wrapper.findAll('button').find((button) => button.text().includes('确认预约'))?.trigger('click');
    await flushAsyncUpdates();

    expect(updateStoreAppointmentStatusMock).toHaveBeenCalledWith(101, { status: 'confirmed' });
    expect(getStoreAppointmentDetailMock).toHaveBeenCalledTimes(2);
    expect(pageStoreAppointmentsMock).toHaveBeenCalledTimes(2);
  });

  it('shows arrived and completed actions only for matching statuses', async () => {
    getStoreAppointmentDetailMock.mockResolvedValueOnce({
      ...appointmentDetail,
      appointment: { ...appointmentItem, status: 'confirmed' }
    }).mockResolvedValueOnce({
      ...appointmentDetail,
      appointment: { ...appointmentItem, status: 'arrived' }
    });
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment:manage']);
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('查看详情'))?.trigger('click');
    await flushAsyncUpdates();
    let buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).toContain('标记到店');
    expect(buttonText).toContain('取消预约');
    expect(buttonText).not.toContain('确认预约');
    expect(buttonText).not.toContain('完成');

    await wrapper.findAll('button').find((button) => button.text().includes('标记到店'))?.trigger('click');
    await flushAsyncUpdates();
    buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(updateStoreAppointmentStatusMock).toHaveBeenCalledWith(101, { status: 'arrived' });
    expect(buttonText).toContain('完成');
    expect(buttonText).not.toContain('取消预约');
  });

  it('loads read-only booking config snapshot without production-only controls', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('store-appointment-template');
    await inputs[1].setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取配置'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentBookingConfigMock).toHaveBeenCalledWith('store-appointment-template', 'store-config-001');
    expect(wrapper.text()).toContain('配置快照');
    expect(wrapper.text()).toContain('中性预约门店');
    expect(wrapper.text()).toContain('基础服务');
    expect(wrapper.text()).toContain('员工 A');
    expect(wrapper.text()).toContain('10:00 / 14:00');
    expect(wrapper.text()).toContain('只读展示，不保存配置');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('保存配置');
    expect(buttonText).not.toContain('支付配置');
    expect(buttonText).not.toContain('会员配置');
    expect(buttonText).not.toContain('核销配置');
  });

  it('shows admin readiness states for config surfaces without enabling edit controls', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment:manage']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('配置面 readiness');
    expect(wrapper.text()).toContain('门店资料');
    expect(wrapper.text()).toContain('项目目录');
    expect(wrapper.text()).toContain('员工名册');
    expect(wrapper.text()).toContain('预约规则');
    expect(wrapper.text()).toContain('经营摘要');
    expect(wrapper.text()).toContain('反馈跟进');
    expect(wrapper.text()).toContain('服务记录');
    expect(wrapper.text()).toContain('candidate');
    expect(wrapper.text()).toContain('blocked-by-production-design');
    expect(wrapper.text()).toContain('demo-only-excluded');

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('新建门店');
    expect(buttonText).not.toContain('编辑项目');
    expect(buttonText).not.toContain('保存规则');
    expect(buttonText).not.toContain('写入配置');
  });

  it('shows backend-ready config admin contract without enabling edit controls', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment:manage']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('admin 配置契约');
    expect(wrapper.text()).toContain('/api/admin/store-appointment-config/stores');
    expect(wrapper.text()).toContain('/api/admin/store-appointment-config/projects');
    expect(wrapper.text()).toContain('/api/admin/store-appointment-config/staff');
    expect(wrapper.text()).toContain('/api/admin/store-appointment-config/rules/{storeCode}');
    expect(wrapper.text()).not.toContain('/api/admin/store-appointment-config/stores/{storeCode}/rules');
    expect(wrapper.text()).toContain('backend-ready-frontend-pending');
    expect(wrapper.text()).toContain('admin:store-appointment-config:manage');
    expect(wrapper.text()).toContain('tenantId');
    expect(wrapper.text()).toContain('paymentAmount');

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('创建接口');
    expect(buttonText).not.toContain('保存配置');
    expect(buttonText).not.toContain('立即接入');
  });

  it('loads editable store profile block for config manager', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="配置 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取门店资料'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentStoreProfileMock).toHaveBeenCalledWith('store-config-001');
    expect(wrapper.text()).toContain('门店资料配置');
    expect(wrapper.text()).toContain('仅保存中性展示字段');
    expect(inputValue(wrapper, 'input[placeholder="门店名称"]')).toBe('中性预约门店');
    expect(inputValue(wrapper, 'input[placeholder="展示电话"]')).toBe('0571-00000000');
    expect(wrapper.text()).not.toContain('商户号');
    expect(wrapper.text()).not.toContain('会员账户');
    expect(wrapper.text()).not.toContain('客户画像');
  });

  it('saves store profile draft with request id and keeps neutral fields only', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="配置 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取门店资料'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="门店名称"]').setValue('新门店名');
    await wrapper.find('input[placeholder="展示电话"]').setValue('0571-00000001');
    await wrapper.findAll('button').find((button) => button.text().includes('保存门店资料'))?.trigger('click');
    await flushAsyncUpdates();

    expect(updateStoreAppointmentStoreProfileMock).toHaveBeenCalledWith('store-config-001', {
      name: '新门店名',
      industry: 'beauty',
      phone: '0571-00000001',
      address: '杭州市示例路 1 号',
      businessHours: '10:00-20:00',
      staffLabel: '员工',
      projectLabel: '项目',
      showPrice: true
    }, expect.stringMatching(/^store-config-/));
    expect(wrapper.text()).toContain('门店资料已保存');
    expect(inputValue(wrapper, 'input[placeholder="门店名称"]')).toBe('新门店名');
  });

  it('keeps store profile draft input when save fails', async () => {
    updateStoreAppointmentStoreProfileMock.mockRejectedValueOnce(new Error('字段格式不符合要求，请检查后保存'));
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="配置 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取门店资料'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="门店名称"]').setValue('失败后仍保留');
    await wrapper.findAll('button').find((button) => button.text().includes('保存门店资料'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('字段格式不符合要求，请检查后保存');
    expect(inputValue(wrapper, 'input[placeholder="门店名称"]')).toBe('失败后仍保留');
  });

  it('hides store profile edit controls without config manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('门店资料配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取门店资料');
    expect(buttonText).not.toContain('保存门店资料');
  });

  it('loads service catalog block and selects a project draft for config manager', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="项目目录 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取项目目录'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑项目'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentServiceCatalogMock).toHaveBeenCalledWith('store-config-001');
    expect(wrapper.text()).toContain('项目目录配置');
    expect(wrapper.text()).toContain('基础服务');
    expect(inputValue(wrapper, 'input[placeholder="项目名称"]')).toBe('基础服务');
    expect(inputValue(wrapper, 'input[placeholder="展示价格文案"]')).toBe('到店咨询');
    expect(wrapper.find('input[placeholder="paymentAmount"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="depositAmount"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="memberCardId"]').exists()).toBe(false);
  });

  it('saves selected service project draft with request id and store scope', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="项目目录 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取项目目录'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑项目'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="项目名称"]').setValue('基础护理');
    await wrapper.find('input[placeholder="默认时长"]').setValue('75');
    await wrapper.findAll('button').find((button) => button.text().includes('保存项目'))?.trigger('click');
    await flushAsyncUpdates();

    expect(updateStoreAppointmentServiceCatalogMock).toHaveBeenCalledWith('basic-service', {
      storeCode: 'store-config-001',
      categoryId: 'general',
      name: '基础护理',
      summary: '适合首次体验',
      durationMinutes: 75,
      priceText: '到店咨询',
      showPrice: true,
      enabled: true
    }, expect.stringMatching(/^store-config-/));
    expect(wrapper.text()).toContain('项目已保存');
    expect(inputValue(wrapper, 'input[placeholder="项目名称"]')).toBe('基础护理');
  });

  it('keeps selected service project draft when save fails', async () => {
    updateStoreAppointmentServiceCatalogMock.mockRejectedValueOnce(new Error('该项目存在未完结预约，暂不能停用'));
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="项目目录 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取项目目录'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑项目'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="项目名称"]').setValue('失败后仍保留项目');
    await wrapper.findAll('button').find((button) => button.text().includes('保存项目'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('该项目存在未完结预约，暂不能停用');
    expect(inputValue(wrapper, 'input[placeholder="项目名称"]')).toBe('失败后仍保留项目');
  });

  it('hides service catalog edit controls without config manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('项目目录配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取项目目录');
    expect(buttonText).not.toContain('保存项目');
  });

  it('loads staff roster block and selects a staff draft for config manager', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="员工名册 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取员工名册'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑员工'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentStaffRosterMock).toHaveBeenCalledWith('store-config-001');
    expect(wrapper.text()).toContain('员工名册配置');
    expect(wrapper.text()).toContain('员工 A');
    expect(inputValue(wrapper, 'input[placeholder="员工姓名"]')).toBe('员工 A');
    expect(inputValue(wrapper, 'input[placeholder="员工角色"]')).toBe('服务顾问');
    expect(wrapper.find('input[placeholder="loginAccountId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="rolePermissionId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="shiftScheduleId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="privateContact"]').exists()).toBe(false);
  });

  it('saves selected staff draft with request id and store scope', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="员工名册 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取员工名册'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑员工'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="员工姓名"]').setValue('员工 B');
    await wrapper.find('input[placeholder="员工角色"]').setValue('资深顾问');
    await wrapper.find('textarea[placeholder="员工亮点，每行一条"]').setValue('5 年经验\n高复购服务');
    await wrapper.find('textarea[placeholder="可服务项目 code，每行一条"]').setValue('basic-service\nadvanced-service');
    await wrapper.findAll('button').find((button) => button.text().includes('保存员工'))?.trigger('click');
    await flushAsyncUpdates();

    expect(updateStoreAppointmentStaffRosterMock).toHaveBeenCalledWith('staff-001', {
      storeCode: 'store-config-001',
      name: '员工 B',
      role: '资深顾问',
      bio: '擅长基础服务',
      avatarUrl: '',
      trustHighlights: ['5 年经验', '高复购服务'],
      enabled: true,
      projectCodes: ['basic-service', 'advanced-service']
    }, expect.stringMatching(/^store-config-/));
    expect(wrapper.text()).toContain('员工已保存');
    expect(inputValue(wrapper, 'input[placeholder="员工姓名"]')).toBe('员工 B');
  });

  it('keeps selected staff draft when save fails', async () => {
    updateStoreAppointmentStaffRosterMock.mockRejectedValueOnce(new Error('该员工存在未完结预约，暂不能停用'));
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="员工名册 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取员工名册'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('编辑员工'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="员工姓名"]').setValue('失败后仍保留员工');
    await wrapper.findAll('button').find((button) => button.text().includes('保存员工'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('该员工存在未完结预约，暂不能停用');
    expect(inputValue(wrapper, 'input[placeholder="员工姓名"]')).toBe('失败后仍保留员工');
  });

  it('hides staff roster edit controls without config manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('员工名册配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取员工名册');
    expect(buttonText).not.toContain('保存员工');
  });

  it('loads appointment rules block for config manager', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="预约规则 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取预约规则'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentRulesMock).toHaveBeenCalledWith('store-config-001');
    expect(wrapper.text()).toContain('预约规则配置');
    expect(inputValue(wrapper, 'input[placeholder="可约窗口天数"]')).toBe('14');
    expect(inputValue(wrapper, 'input[placeholder="默认服务时长"]')).toBe('60');
    expect(wrapper.find('input[placeholder="notificationTemplateId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="refundRuleId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="realSchedulePolicyId"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="customerAccountPolicy"]').exists()).toBe(false);
  });

  it('saves appointment rules draft with request id and store scope', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="预约规则 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取预约规则'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="可约窗口天数"]').setValue('21');
    await wrapper.find('input[placeholder="默认服务时长"]').setValue('75');
    await wrapper.find('textarea[placeholder="默认时段，每行一条"]').setValue('09:30\n15:00');
    await wrapper.find('input[placeholder="确认提示"]').setValue('请提前确认到店时间');
    await wrapper.findAll('button').find((button) => button.text().includes('保存预约规则'))?.trigger('click');
    await flushAsyncUpdates();

    expect(updateStoreAppointmentRulesMock).toHaveBeenCalledWith('store-config-001', {
      bookingWindowDays: 21,
      defaultDurationMinutes: 75,
      defaultSlots: ['09:30', '15:00'],
      confirmationHint: '请提前确认到店时间',
      cancelHint: '如需取消请提前联系'
    }, expect.stringMatching(/^store-config-/));
    expect(wrapper.text()).toContain('预约规则已保存');
    expect(inputValue(wrapper, 'input[placeholder="可约窗口天数"]')).toBe('21');
  });

  it('keeps appointment rules draft when save fails', async () => {
    updateStoreAppointmentRulesMock.mockRejectedValueOnce(new Error('默认时段格式不符合要求'));
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="预约规则 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取预约规则'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="确认提示"]').setValue('失败后仍保留规则');
    await wrapper.findAll('button').find((button) => button.text().includes('保存预约规则'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('默认时段格式不符合要求');
    expect(inputValue(wrapper, 'input[placeholder="确认提示"]')).toBe('失败后仍保留规则');
  });

  it('hides appointment rules edit controls without config manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('预约规则配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取预约规则');
    expect(buttonText).not.toContain('保存预约规则');
  });

  it('previews config rollback by store and audit log for config manager', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="回滚 storeCode"]').setValue('store-config-001');
    await wrapper.find('input[placeholder="审计记录 ID"]').setValue('9001');
    await wrapper.findAll('button').find((button) => button.text().includes('预览回滚'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentRollbackPreviewMock).toHaveBeenCalledWith('store-config-001', 9001);
    expect(wrapper.text()).toContain('配置回滚');
    expect(wrapper.text()).toContain('service-catalog');
    expect(wrapper.text()).toContain('basic-service');
    expect(wrapper.text()).toContain('基础服务');
    expect(wrapper.text()).toContain('预览不写库');
    expect(wrapper.find('input[placeholder="paymentAmount"]').exists()).toBe(false);
    expect(wrapper.find('input[placeholder="customerProfile"]').exists()).toBe(false);
  });

  it('executes rollback only after explicit confirmation', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment-config:manage']);
    await flushAsyncUpdates();

    await wrapper.find('input[placeholder="回滚 storeCode"]').setValue('store-config-001');
    await wrapper.find('input[placeholder="审计记录 ID"]').setValue('9001');
    await wrapper.findAll('button').find((button) => button.text().includes('预览回滚'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('执行回滚'))?.trigger('click');
    await flushAsyncUpdates();

    expect(rollbackStoreAppointmentConfigMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请先勾选确认');

    await wrapper.find('[data-test="rollback-confirm"] input[type="checkbox"]').setValue(true);
    await wrapper.findAll('button').find((button) => button.text().includes('执行回滚'))?.trigger('click');
    await flushAsyncUpdates();

    expect(rollbackStoreAppointmentConfigMock).toHaveBeenCalledWith('store-config-001', 9001, expect.stringMatching(/^store-config-/));
    expect(wrapper.text()).toContain('配置回滚已执行');
  });

  it('hides config rollback controls without config manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('配置回滚');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('预览回滚');
    expect(buttonText).not.toContain('执行回滚');
  });
});
