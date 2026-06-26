import { mount, VueWrapper } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentRules,
  updateStoreAppointmentRules
} from '../../../api/storeAppointments';
import StoreAppointmentRulesPanel from './StoreAppointmentRulesPanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentRules: vi.fn(),
  updateStoreAppointmentRules: vi.fn()
}));

const getStoreAppointmentRulesMock = vi.mocked(getStoreAppointmentRules);
const updateStoreAppointmentRulesMock = vi.mocked(updateStoreAppointmentRules);

const appointmentRules = {
  storeCode: 'store-config-001',
  bookingWindowDays: 14,
  defaultDurationMinutes: 60,
  defaultSlots: ['10:00', '14:00'],
  confirmationHint: '到店前确认',
  cancelHint: '如需取消请提前联系',
  updatedAt: '2026-06-26T08:00:00'
};

function mountPanel(canManage = true) {
  return mount(StoreAppointmentRulesPanel, {
    props: {
      canManage
    },
    global: {
      plugins: [ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

function inputValue(wrapper: VueWrapper, selector: string) {
  const element = wrapper.find(selector).element as HTMLInputElement;
  return element.value;
}

describe('StoreAppointmentRulesPanel', () => {
  beforeEach(() => {
    getStoreAppointmentRulesMock.mockReset();
    updateStoreAppointmentRulesMock.mockReset();
    getStoreAppointmentRulesMock.mockResolvedValue(appointmentRules);
    updateStoreAppointmentRulesMock.mockResolvedValue({
      ...appointmentRules,
      bookingWindowDays: 21,
      defaultDurationMinutes: 75,
      defaultSlots: ['09:30', '15:00'],
      confirmationHint: '请提前确认到店时间'
    });
  });

  it('loads basic appointment rules for config manager', async () => {
    const wrapper = mountPanel();

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

  it('saves appointment rules draft with slots and request id', async () => {
    const wrapper = mountPanel();

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
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="预约规则 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取预约规则'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="确认提示"]').setValue('失败后仍保留规则');
    await wrapper.findAll('button').find((button) => button.text().includes('保存预约规则'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('默认时段格式不符合要求');
    expect(inputValue(wrapper, 'input[placeholder="确认提示"]')).toBe('失败后仍保留规则');
  });

  it('hides appointment rules actions without config manage permission', () => {
    const wrapper = mountPanel(false);

    expect(wrapper.text()).toContain('预约规则配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取预约规则');
    expect(buttonText).not.toContain('保存预约规则');
  });
});
