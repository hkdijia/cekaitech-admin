import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import StoreAppointmentConfigReadinessPanel from './StoreAppointmentConfigReadinessPanel.vue';

function mountPanel() {
  return mount(StoreAppointmentConfigReadinessPanel, {
    global: {
      plugins: [ElementPlus]
    }
  });
}

describe('StoreAppointmentConfigReadinessPanel', () => {
  it('shows config surface readiness without enabling edit controls', () => {
    const wrapper = mountPanel();
    const readinessTable = wrapper.findComponent({ name: 'ElTable' });
    const readinessRows = readinessTable.props('data') as Array<{ name: string; status: string }>;

    expect(wrapper.text()).toContain('配置面 readiness');
    expect(readinessRows.map((row) => row.name)).toEqual(['门店资料', '项目目录', '员工名册', '预约规则', '经营摘要', '反馈跟进', '服务记录']);
    expect(readinessRows.map((row) => row.status)).toContain('candidate');
    expect(readinessRows.map((row) => row.status)).toContain('blocked-by-production-design');
    expect(wrapper.text()).toContain('demo-only-excluded');
    expect(wrapper.text()).toContain('模拟支付/核销/会员');

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('新建门店');
    expect(buttonText).not.toContain('编辑项目');
    expect(buttonText).not.toContain('保存规则');
    expect(buttonText).not.toContain('写入配置');
  });
});
