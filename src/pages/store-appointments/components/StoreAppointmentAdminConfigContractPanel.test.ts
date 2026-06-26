import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import StoreAppointmentAdminConfigContractPanel from './StoreAppointmentAdminConfigContractPanel.vue';

function mountPanel() {
  return mount(StoreAppointmentAdminConfigContractPanel, {
    global: {
      plugins: [ElementPlus]
    }
  });
}

describe('StoreAppointmentAdminConfigContractPanel', () => {
  it('shows backend-ready config admin contract without enabling edit controls', () => {
    const wrapper = mountPanel();
    const contractTable = wrapper.findComponent({ name: 'ElTable' });
    const contractRows = contractTable.props('data') as Array<{
      surfaceName: string;
      status: string;
      requiredPermission: string;
      endpoints: string;
      excludedFields: string;
    }>;

    expect(wrapper.text()).toContain('admin 配置契约');
    expect(contractRows.map((row) => row.surfaceName)).toEqual(['门店资料', '项目目录', '员工名册', '预约规则']);
    expect(contractRows.every((row) => row.status === 'backend-ready-frontend-pending')).toBe(true);
    expect(contractRows.every((row) => row.requiredPermission === 'admin:store-appointment-config:manage')).toBe(true);
    expect(contractRows.map((row) => row.endpoints).join(' ')).toContain('/api/admin/store-appointment-config/stores');
    expect(contractRows.map((row) => row.endpoints).join(' ')).toContain('/api/admin/store-appointment-config/projects');
    expect(contractRows.map((row) => row.endpoints).join(' ')).toContain('/api/admin/store-appointment-config/staff');
    expect(contractRows.map((row) => row.endpoints).join(' ')).toContain('/api/admin/store-appointment-config/rules/{storeCode}');
    expect(contractRows.map((row) => row.endpoints).join(' ')).not.toContain('/api/admin/store-appointment-config/stores/{storeCode}/rules');
    expect(contractRows.map((row) => row.excludedFields).join(' ')).toContain('tenantId');
    expect(contractRows.map((row) => row.excludedFields).join(' ')).toContain('paymentAmount');

    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('创建接口');
    expect(buttonText).not.toContain('保存配置');
    expect(buttonText).not.toContain('立即接入');
  });
});
