import { mount, VueWrapper } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentServiceCatalog,
  updateStoreAppointmentServiceCatalog
} from '../../../api/storeAppointments';
import StoreAppointmentServiceCatalogPanel from './StoreAppointmentServiceCatalogPanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentServiceCatalog: vi.fn(),
  updateStoreAppointmentServiceCatalog: vi.fn()
}));

const getStoreAppointmentServiceCatalogMock = vi.mocked(getStoreAppointmentServiceCatalog);
const updateStoreAppointmentServiceCatalogMock = vi.mocked(updateStoreAppointmentServiceCatalog);

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

function mountPanel(canManage = true) {
  return mount(StoreAppointmentServiceCatalogPanel, {
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

describe('StoreAppointmentServiceCatalogPanel', () => {
  beforeEach(() => {
    getStoreAppointmentServiceCatalogMock.mockReset();
    updateStoreAppointmentServiceCatalogMock.mockReset();
    getStoreAppointmentServiceCatalogMock.mockResolvedValue(serviceCatalog);
    updateStoreAppointmentServiceCatalogMock.mockResolvedValue({
      ...serviceCatalog[0],
      name: '基础护理',
      durationMinutes: 75
    });
  });

  it('loads service catalog and selects a neutral project draft', async () => {
    const wrapper = mountPanel();

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

  it('saves selected project draft with store scope and request id', async () => {
    const wrapper = mountPanel();

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

  it('keeps selected project draft when save fails', async () => {
    updateStoreAppointmentServiceCatalogMock.mockRejectedValueOnce(new Error('该项目存在未完结预约，暂不能停用'));
    const wrapper = mountPanel();

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

  it('hides service catalog actions without config manage permission', () => {
    const wrapper = mountPanel(false);

    expect(wrapper.text()).toContain('项目目录配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取项目目录');
    expect(buttonText).not.toContain('保存项目');
  });
});
