import { flushPromises, mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { inspectLegalToolReadiness } from '../../api/legalToolCenter';
import { useWorkspaceStore } from '../../stores/workspace';
import MiniappWorkbenchPage from './MiniappWorkbenchPage.vue';

vi.mock('../../api/legalToolCenter', () => ({
  inspectLegalToolReadiness: vi.fn()
}));

const inspectLegalToolReadinessMock = vi.mocked(inspectLegalToolReadiness);

describe('MiniappWorkbenchPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows current miniapp overview and legal tool readiness summary', async () => {
    inspectLegalToolReadinessMock.mockResolvedValue({
      appCode: 'lawsuit-material-assistant',
      totalCapabilityCount: 26,
      publicExposureCount: 18,
      readyCount: 12,
      warningCount: 3,
      blockedCount: 11,
      items: [
        {
          toolKey: 'litigation_fee',
          title: '诉讼费用',
          status: 'public',
          readiness: 'pass',
          capabilityEnabled: true,
          publicExposure: true,
          reviewedBlueprint: true,
          dataSourceReady: true,
          issues: []
        },
        {
          toolKey: 'level_jurisdiction',
          title: '级别管辖核对',
          status: 'beta',
          readiness: 'blocked',
          capabilityEnabled: true,
          publicExposure: false,
          reviewedBlueprint: false,
          dataSourceReady: true,
          issues: [{ type: 'missing_public_exposure', severity: 'blocked', message: '缺少可公开展示的工具入口' }]
        }
      ]
    });
    const workspace = useWorkspaceStore();
    workspace.currentCode = 'legal-material-assistant';
    workspace.options = [
      { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
      { id: 1, code: 'legal-material-assistant', name: '阳律通', appCode: 'lawsuit-material-assistant', status: 'enabled' }
    ];

    const wrapper = mount(MiniappWorkbenchPage, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a><slot /></a>'
          }
        }
      }
    });
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(inspectLegalToolReadinessMock).toHaveBeenCalledWith({ appCode: 'lawsuit-material-assistant' });
    expect(wrapper.text()).toContain('阳律通工作台');
    expect(wrapper.text()).toContain('工具完整性');
    expect(wrapper.text()).toContain('26');
    expect(wrapper.text()).toContain('12');
    expect(wrapper.text()).toContain('级别管辖核对');
    expect(wrapper.text()).toContain('缺少可公开展示的工具入口');
  });

  it('keeps global workspace separated from miniapp workbench data', async () => {
    const workspace = useWorkspaceStore();
    workspace.currentCode = 'global';

    const wrapper = mount(MiniappWorkbenchPage, {
      global: {
        plugins: [ElementPlus]
      }
    });
    await nextTick();

    expect(inspectLegalToolReadinessMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请选择一个小程序工作区');
  });
});
