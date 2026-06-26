import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { getStoreAppointmentBookingConfig } from '../../../api/storeAppointments';
import StoreAppointmentBookingConfigSnapshotPanel from './StoreAppointmentBookingConfigSnapshotPanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentBookingConfig: vi.fn()
}));

const getStoreAppointmentBookingConfigMock = vi.mocked(getStoreAppointmentBookingConfig);

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

function mountPanel() {
  return mount(StoreAppointmentBookingConfigSnapshotPanel, {
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

describe('StoreAppointmentBookingConfigSnapshotPanel', () => {
  beforeEach(() => {
    getStoreAppointmentBookingConfigMock.mockReset();
    getStoreAppointmentBookingConfigMock.mockResolvedValue(bookingConfig);
  });

  it('loads read-only booking config snapshot without production-only controls', async () => {
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="appCode"]').setValue('store-appointment-template');
    await wrapper.find('input[placeholder="storeCode"]').setValue('store-config-001');
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

  it('requires appCode and storeCode before loading snapshot', async () => {
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="appCode"]').setValue('');
    await wrapper.find('input[placeholder="storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取配置'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentBookingConfigMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请先填写 appCode 和 storeCode');
  });
});
