import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { approveLawyerAudit, pageLawyerAudits, rejectLawyerAudit } from '../../api/lawyerAudits';
import { useAuthStore } from '../../stores/auth';
import LawyerAuditsPage from './LawyerAuditsPage.vue';

vi.mock('../../api/lawyerAudits', () => ({
  pageLawyerAudits: vi.fn(),
  approveLawyerAudit: vi.fn(),
  rejectLawyerAudit: vi.fn()
}));

vi.mock('element-plus', async () => {
  const actual = await vi.importActual<typeof import('element-plus')>('element-plus');
  return {
    ...actual,
    ElMessage: { success: vi.fn(), error: vi.fn() },
    ElMessageBox: { prompt: vi.fn() }
  };
});

const pageLawyerAuditsMock = vi.mocked(pageLawyerAudits);
const approveLawyerAuditMock = vi.mocked(approveLawyerAudit);
const rejectLawyerAuditMock = vi.mocked(rejectLawyerAudit);

const auditItem = {
  auditId: 1,
  userId: 44,
  identityId: 44,
  userCode: 'lma-4a378460',
  appCode: 'lawsuit-material-assistant',
  auditType: 'lawyer_professional',
  status: 'pending',
  payload: {
    name: '黄凯',
    phone: '131****8494',
    licenseNo: 'A123456'
  },
  reviewNote: '',
  reviewedAt: '',
  createdAt: '2026-06-17T10:00:00',
  updatedAt: '2026-06-17T10:00:00'
};

function mountPage(permissions: string[] = ['admin:lawyer-audit:view', 'admin:lawyer-audit:manage']) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions
  };
  return mount(LawyerAuditsPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('LawyerAuditsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLawyerAuditsMock.mockReset();
    approveLawyerAuditMock.mockReset();
    rejectLawyerAuditMock.mockReset();
    vi.mocked(ElMessageBox.prompt).mockReset();
    pageLawyerAuditsMock.mockResolvedValue({
      dataList: [auditItem],
      totalCount: 1
    });
    approveLawyerAuditMock.mockResolvedValue({ ...auditItem, status: 'approved', reviewNote: '材料核验通过' });
    rejectLawyerAuditMock.mockResolvedValue({ ...auditItem, status: 'rejected', reviewNote: '材料不完整' });
    vi.mocked(ElMessageBox.prompt).mockResolvedValue({ value: '材料核验通过', action: 'confirm' } as never);
  });

  it('loads pending lawyer audits and renders submitted fields', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageLawyerAuditsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      auditType: 'lawyer_professional',
      status: 'pending',
      keywords: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
    expect(wrapper.text()).toContain('lma-4a378460');
    expect(wrapper.text()).toContain('黄凯');
    expect(wrapper.text()).toContain('131****8494');
    expect(wrapper.text()).toContain('待审核');
  });

  it('approves pending audit and reloads list', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const approveButton = wrapper.findAll('button').find((button) => button.text().includes('通过'));
    await approveButton?.trigger('click');
    await flushAsyncUpdates();

    expect(approveLawyerAuditMock).toHaveBeenCalledWith(1, { reviewNote: '材料核验通过' });
    expect(pageLawyerAuditsMock).toHaveBeenCalledTimes(2);
  });

  it('rejects pending audit with prompt note', async () => {
    vi.mocked(ElMessageBox.prompt).mockResolvedValueOnce({ value: '材料不完整', action: 'confirm' } as never);
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const rejectButton = wrapper.findAll('button').find((button) => button.text().includes('驳回'));
    await rejectButton?.trigger('click');
    await flushAsyncUpdates();

    expect(rejectLawyerAuditMock).toHaveBeenCalledWith(1, { reviewNote: '材料不完整' });
  });

  it('hides review actions without manage permission', async () => {
    const wrapper = mountPage(['admin:lawyer-audit:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('lma-4a378460');
    expect(wrapper.findAll('button').some((button) => button.text().includes('通过'))).toBe(false);
    expect(wrapper.findAll('button').some((button) => button.text().includes('驳回'))).toBe(false);
  });
});
