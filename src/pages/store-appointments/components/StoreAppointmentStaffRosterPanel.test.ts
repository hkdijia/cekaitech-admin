import { mount, VueWrapper } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import {
  getStoreAppointmentStaffRoster,
  updateStoreAppointmentStaffRoster
} from '../../../api/storeAppointments';
import StoreAppointmentStaffRosterPanel from './StoreAppointmentStaffRosterPanel.vue';

vi.mock('../../../api/storeAppointments', () => ({
  getStoreAppointmentStaffRoster: vi.fn(),
  updateStoreAppointmentStaffRoster: vi.fn()
}));

const getStoreAppointmentStaffRosterMock = vi.mocked(getStoreAppointmentStaffRoster);
const updateStoreAppointmentStaffRosterMock = vi.mocked(updateStoreAppointmentStaffRoster);

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

function mountPanel(canManage = true) {
  return mount(StoreAppointmentStaffRosterPanel, {
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

describe('StoreAppointmentStaffRosterPanel', () => {
  beforeEach(() => {
    getStoreAppointmentStaffRosterMock.mockReset();
    updateStoreAppointmentStaffRosterMock.mockReset();
    getStoreAppointmentStaffRosterMock.mockResolvedValue(staffRoster);
    updateStoreAppointmentStaffRosterMock.mockResolvedValue({
      ...staffRoster[0],
      name: '员工 B',
      role: '资深顾问',
      trustHighlights: ['5 年经验', '高复购服务'],
      projectCodes: ['basic-service', 'advanced-service']
    });
  });

  it('loads staff roster and selects a neutral staff draft', async () => {
    const wrapper = mountPanel();

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

  it('saves selected staff draft with list fields and request id', async () => {
    const wrapper = mountPanel();

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
    const wrapper = mountPanel();

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

  it('hides staff roster actions without config manage permission', () => {
    const wrapper = mountPanel(false);

    expect(wrapper.text()).toContain('员工名册配置');
    expect(wrapper.text()).toContain('需要 admin:store-appointment-config:manage 权限');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('读取员工名册');
    expect(buttonText).not.toContain('保存员工');
  });
});
