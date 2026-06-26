import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import StoreAppointmentFilterPanel from './StoreAppointmentFilterPanel.vue';

const statusOptions = [
  { label: '全部状态', value: '', tagType: 'info' },
  { label: '待确认', value: 'pending', tagType: 'warning' },
  { label: '已确认', value: 'confirmed', tagType: 'primary' }
];

function mountPanel() {
  const query = reactive({
    pageNo: 1,
    pageSize: 10,
    storeCode: '',
    projectCode: '',
    staffCode: '',
    status: '',
    appointmentDate: ''
  });

  return mount(StoreAppointmentFilterPanel, {
    props: {
      query,
      loading: false,
      statusOptions
    },
    global: {
      plugins: [ElementPlus]
    }
  });
}

describe('StoreAppointmentFilterPanel', () => {
  it('edits appointment filters and emits search/reset without calling backend directly', async () => {
    const wrapper = mountPanel();

    await wrapper.find('input[placeholder="storeCode"]').setValue(' luyu-nail ');
    await wrapper.find('input[placeholder="projectCode"]').setValue(' basic-nail ');
    await wrapper.find('input[placeholder="staffCode"]').setValue(' staff-amy ');
    await wrapper.find('input[placeholder="YYYY-MM-DD"]').setValue('2026-06-20');
    wrapper.findComponent({ name: 'ElSelect' }).vm.$emit('update:modelValue', 'pending');
    await wrapper.findAll('button').find((button) => button.text().includes('查询'))?.trigger('click');

    expect(wrapper.props('query')).toMatchObject({
      storeCode: ' luyu-nail ',
      projectCode: ' basic-nail ',
      staffCode: ' staff-amy ',
      status: 'pending',
      appointmentDate: '2026-06-20'
    });
    expect(wrapper.emitted('search')).toHaveLength(1);

    await wrapper.findAll('button').find((button) => button.text().includes('重置'))?.trigger('click');

    expect(wrapper.emitted('reset')).toHaveLength(1);
    expect(wrapper.text()).not.toContain('支付');
    expect(wrapper.text()).not.toContain('会员');
    expect(wrapper.text()).not.toContain('核销');
    expect(wrapper.text()).not.toContain('客户资料');
  });
});
