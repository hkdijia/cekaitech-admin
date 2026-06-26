import { mount, VueWrapper } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentStoreProfile,
  updateStoreAppointmentStoreProfile
} from '../../../api/storeAppointments';
import StoreAppointmentStoreProfilePanel from './StoreAppointmentStoreProfilePanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentStoreProfile: vi.fn(),
  updateStoreAppointmentStoreProfile: vi.fn()
}));

const getStoreAppointmentStoreProfileMock = vi.mocked(getStoreAppointmentStoreProfile);
const updateStoreAppointmentStoreProfileMock = vi.mocked(updateStoreAppointmentStoreProfile);

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
  updatedAt: '2026-06-26T09:00:00'
};

function mountPanel(canManage = true) {
  return mount(StoreAppointmentStoreProfilePanel, {
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

describe('StoreAppointmentStoreProfilePanel', () => {
  beforeEach(() => {
    getStoreAppointmentStoreProfileMock.mockReset();
    updateStoreAppointmentStoreProfileMock.mockReset();
    getStoreAppointmentStoreProfileMock.mockResolvedValue(storeProfile);
    updateStoreAppointmentStoreProfileMock.mockResolvedValue({
      ...storeProfile,
      name: '新门店名',
      phone: '0571-00000001'
    });
  });

  it('loads neutral store profile fields for config manager', async () => {
    const wrapper = mountPanel();

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

  it('saves neutral store profile draft with request id', async () => {
    const wrapper = mountPanel();

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
  });

  it('keeps draft input when save fails', async () => {
    updateStoreAppointmentStoreProfileMock.mockRejectedValueOnce(new Error('字段格式不符合要求，请检查后保存'));
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="配置 storeCode"]').setValue('store-config-001');
    await wrapper.findAll('button').find((button) => button.text().includes('读取门店资料'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.find('input[placeholder="门店名称"]').setValue('失败后仍保留');
    await wrapper.findAll('button').find((button) => button.text().includes('保存门店资料'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('字段格式不符合要求，请检查后保存');
    expect(inputValue(wrapper, 'input[placeholder="门店名称"]')).toBe('失败后仍保留');
  });

  it('hides store profile actions without config manage permission', () => {
    const wrapper = mountPanel(false);

    expect(wrapper.text()).toContain('门店资料配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取门店资料');
    expect(buttonText).not.toContain('保存门店资料');
  });
});
