import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentBookingConfig,
  getStoreAppointmentDetail,
  pageStoreAppointments,
  updateStoreAppointmentStatus
} from '../../api/storeAppointments';
import { useAuthStore } from '../../stores/auth';
import StoreAppointmentsPage from './StoreAppointmentsPage.vue';

vi.mock('../../api/storeAppointments', () => ({
  pageStoreAppointments: vi.fn(),
  getStoreAppointmentDetail: vi.fn(),
  updateStoreAppointmentStatus: vi.fn(),
  getStoreAppointmentBookingConfig: vi.fn()
}));

const pageStoreAppointmentsMock = vi.mocked(pageStoreAppointments);
const getStoreAppointmentDetailMock = vi.mocked(getStoreAppointmentDetail);
const updateStoreAppointmentStatusMock = vi.mocked(updateStoreAppointmentStatus);
const getStoreAppointmentBookingConfigMock = vi.mocked(getStoreAppointmentBookingConfig);

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

describe('StoreAppointmentsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageStoreAppointmentsMock.mockReset();
    getStoreAppointmentDetailMock.mockReset();
    updateStoreAppointmentStatusMock.mockReset();
    getStoreAppointmentBookingConfigMock.mockReset();
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
});
