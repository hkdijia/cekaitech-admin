import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import StoreAppointmentDetailDrawer from './StoreAppointmentDetailDrawer.vue';

const detail = {
  appointment: {
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

function mountDrawer(canManageStatus = true) {
  return mount(StoreAppointmentDetailDrawer, {
    props: {
      visible: true,
      detail,
      detailLoading: false,
      statusUpdating: false,
      canManageStatus
    },
    global: {
      plugins: [ElementPlus],
      stubs: {
        ElDrawer: {
          props: ['modelValue', 'title'],
          emits: ['update:modelValue'],
          template: '<section v-if="modelValue"><h2>{{ title }}</h2><slot /></section>'
        }
      }
    }
  });
}

describe('StoreAppointmentDetailDrawer', () => {
  it('shows appointment detail and emits controlled status updates without forbidden operations', async () => {
    const wrapper = mountDrawer();

    expect(wrapper.text()).toContain('预约详情');
    expect(wrapper.text()).toContain('鹿屿美甲工作室 / luyu-nail');
    expect(wrapper.text()).toContain('基础美甲 / basic-nail');
    expect(wrapper.text()).toContain('Amy / staff-amy');
    expect(wrapper.text()).toContain('王女士');
    expect(wrapper.text()).toContain('13800001111');
    expect(wrapper.text()).toContain('2026-06-20 10:00');
    expect(wrapper.text()).toContain('想做玫瑰色');
    expect(wrapper.text()).toContain('待确认');
    expect(wrapper.text()).toContain('状态日志');
    const statusLogTable = wrapper.findComponent({ name: 'ElTable' });
    expect(statusLogTable.props('data')).toEqual(detail.statusLogs);

    await wrapper.findAll('button').find((button) => button.text().includes('确认预约'))?.trigger('click');
    expect(wrapper.emitted('update-status')?.[0]).toEqual(['confirmed']);

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).toContain('取消预约');
    expect(buttonText).not.toContain('支付');
    expect(buttonText).not.toContain('会员');
    expect(buttonText).not.toContain('核销');
    expect(buttonText).not.toContain('客户资料');
  });

  it('hides status actions when the operator cannot manage appointment status', () => {
    const wrapper = mountDrawer(false);
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');

    expect(buttonText).not.toContain('确认预约');
    expect(buttonText).not.toContain('取消预约');
    expect(buttonText).not.toContain('标记到店');
    expect(buttonText).not.toContain('完成');
  });
});
