import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import StoreAppointmentListPanel from './StoreAppointmentListPanel.vue';

const appointment = {
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
  updatedAt: '2026-06-19T09:00:00.000'
};

function mountPanel() {
  return mount(StoreAppointmentListPanel, {
    props: {
      appointments: [appointment],
      loading: false,
      pageNo: 1,
      pageSize: 10,
      totalCount: 1
    },
    global: {
      plugins: [ElementPlus]
    }
  });
}

describe('StoreAppointmentListPanel', () => {
  it('renders appointment rows and emits pagination events without forbidden operations', () => {
    const wrapper = mountPanel();
    const appointmentTable = wrapper.findComponent({ name: 'ElTable' });
    const rows = appointmentTable.props('data') as Array<typeof appointment>;

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      appointmentId: 101,
      storeName: '鹿屿美甲工作室',
      projectName: '基础美甲',
      staffName: 'Amy',
      customerDisplayName: '王女士',
      appointmentDate: '2026-06-20',
      timeSlot: '10:00',
      status: 'pending',
      remark: '想做玫瑰色',
      updatedAt: '2026-06-19T09:00:00.000'
    });
    const pagination = wrapper.findComponent({ name: 'ElPagination' });
    pagination.vm.$emit('current-change', 2);
    pagination.vm.$emit('size-change', 20);

    expect(wrapper.emitted('page-change')?.[0]).toEqual([2]);
    expect(wrapper.emitted('size-change')?.[0]).toEqual([20]);

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('支付');
    expect(buttonText).not.toContain('会员');
    expect(buttonText).not.toContain('核销');
    expect(buttonText).not.toContain('客户资料');
  });
});
