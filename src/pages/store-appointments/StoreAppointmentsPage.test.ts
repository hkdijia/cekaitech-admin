import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { getStoreAppointmentDetail, pageStoreAppointments } from '../../api/storeAppointments';
import { useAuthStore } from '../../stores/auth';
import StoreAppointmentsPage from './StoreAppointmentsPage.vue';

vi.mock('../../api/storeAppointments', () => ({
  pageStoreAppointments: vi.fn(),
  getStoreAppointmentDetail: vi.fn()
}));

const pageStoreAppointmentsMock = vi.mocked(pageStoreAppointments);
const getStoreAppointmentDetailMock = vi.mocked(getStoreAppointmentDetail);

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
    pageStoreAppointmentsMock.mockResolvedValue({
      dataList: [appointmentItem],
      totalCount: 1
    });
    getStoreAppointmentDetailMock.mockResolvedValue(appointmentDetail);
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
    await inputs[0].setValue(' luyu-nail ');
    await inputs[1].setValue(' basic-nail ');
    await inputs[2].setValue(' staff-amy ');
    await inputs[3].setValue('2026-06-20');
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

  it('keeps first slice read-only even with manage permission', async () => {
    const wrapper = mountPage(['admin:store-appointment:view', 'admin:store-appointment:manage']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('只读查看');
    expect(wrapper.findAll('button').some((button) => button.text().includes('确认预约'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('标记到店'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('完成'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('取消预约'))).toBe(false);
  });
});
