import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import LoginPage from './LoginPage.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe('LoginPage', () => {
  it('does not prefill admin username or password', () => {
    setActivePinia(createPinia());

    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          ElForm: { template: '<form><slot /></form>' },
          ElFormItem: { template: '<label><slot /></label>' },
          ElInput: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
          },
          ElButton: { template: '<button><slot /></button>' }
        }
      }
    });

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(2);
    expect((inputs[0].element as HTMLInputElement).value).toBe('');
    expect((inputs[1].element as HTMLInputElement).value).toBe('');
  });
});
