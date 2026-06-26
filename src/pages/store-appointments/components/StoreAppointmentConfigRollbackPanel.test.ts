import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentRollbackPreview,
  rollbackStoreAppointmentConfig
} from '../../../api/storeAppointments';
import StoreAppointmentConfigRollbackPanel from './StoreAppointmentConfigRollbackPanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentRollbackPreview: vi.fn(),
  rollbackStoreAppointmentConfig: vi.fn()
}));

const getStoreAppointmentRollbackPreviewMock = vi.mocked(getStoreAppointmentRollbackPreview);
const rollbackStoreAppointmentConfigMock = vi.mocked(rollbackStoreAppointmentConfig);

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

function mountPanel(canManage = true) {
  return mount(StoreAppointmentConfigRollbackPanel, {
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

describe('StoreAppointmentConfigRollbackPanel', () => {
  beforeEach(() => {
    getStoreAppointmentRollbackPreviewMock.mockReset();
    rollbackStoreAppointmentConfigMock.mockReset();
    getStoreAppointmentRollbackPreviewMock.mockResolvedValue(rollbackPreview);
    rollbackStoreAppointmentConfigMock.mockResolvedValue({
      storeCode: 'store-config-001',
      projectCode: 'basic-service',
      categoryId: 'general',
      name: '基础服务',
      summary: '适合首次体验',
      durationMinutes: 60,
      priceText: '到店咨询',
      showPrice: true,
      enabled: true,
      updatedAt: '2026-06-26T09:00:00'
    });
  });

  it('previews rollback without executing it', async () => {
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="回滚 storeCode"]').setValue('store-config-001');
    await wrapper.find('input[placeholder="审计记录 ID"]').setValue('9001');
    await wrapper.findAll('button').find((button) => button.text().includes('预览回滚'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getStoreAppointmentRollbackPreviewMock).toHaveBeenCalledWith('store-config-001', 9001);
    expect(rollbackStoreAppointmentConfigMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('配置回滚');
    expect(wrapper.text()).toContain('service-catalog');
    expect(wrapper.text()).toContain('basic-service');
    expect(wrapper.text()).toContain('基础服务');
    expect(wrapper.text()).toContain('预览不写库');
  });

  it('requires explicit confirmation before executing rollback', async () => {
    const wrapper = mountPanel();

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

  it('hides rollback actions without config manage permission', () => {
    const wrapper = mountPanel(false);

    expect(wrapper.text()).toContain('配置回滚');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('预览回滚');
    expect(buttonText).not.toContain('执行回滚');
  });
});
