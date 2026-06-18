import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { getAdminUserDetail } from '../../api/adminUsers';
import { pageGenerationRecords } from '../../api/generationRecords';
import GenerationRecordsPage from './GenerationRecordsPage.vue';

vi.mock('../../api/generationRecords', () => ({
  pageGenerationRecords: vi.fn()
}));

vi.mock('../../api/adminUsers', () => ({
  getAdminUserDetail: vi.fn()
}));

const pageGenerationRecordsMock = vi.mocked(pageGenerationRecords);
const getAdminUserDetailMock = vi.mocked(getAdminUserDetail);

const generationRecord = {
  id: 1001,
  userId: 11,
  identityId: 21,
  appCode: 'lawsuit-material-assistant',
  clientRecordId: 'record-001',
  recordType: 'private_lending',
  title: '民间借贷起诉状',
  status: 'generated',
  resultSummary: '已生成起诉状草稿',
  createdAt: '2026-05-23T10:20:00',
  updatedAt: '2026-05-23T10:21:00'
};

function mountPage() {
  return mount(GenerationRecordsPage, {
    global: {
      plugins: [ElementPlus]
    }
  });
}

function setPageQuery(wrapper: ReturnType<typeof mountPage>, values: Partial<Record<string, string | number>>) {
  Object.assign((wrapper.vm as unknown as { query: Record<string, string | number> }).query, values);
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 3; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('GenerationRecordsPage', () => {
  beforeEach(() => {
    pageGenerationRecordsMock.mockReset();
    getAdminUserDetailMock.mockReset();
    pageGenerationRecordsMock.mockResolvedValue({
      dataList: [generationRecord],
      totalCount: 1
    });
    getAdminUserDetailMock.mockResolvedValue({
      id: 11,
      primaryPhone: '13800000001',
      unionId: 'union-11',
      status: 'normal',
      provider: 'wechat',
      appCode: 'lawsuit-material-assistant',
      providerUserId: 'openid-11',
      phoneBindingStatus: 'bound',
      role: 'verified_lawyer',
      createdAt: '2026-05-23T08:10:00',
      updatedAt: '2026-05-23T08:10:00',
      identities: [
        {
          id: 21,
          provider: 'wechat',
          appCode: 'lawsuit-material-assistant',
          userCode: 'lma-4a378460',
          providerUserId: 'openid-11',
          unionId: 'union-11',
          phoneSnapshot: '13800000001',
          phoneBindingStatus: 'bound',
          role: 'verified_lawyer',
          identityKey: 'lma-4a378460'
        }
      ],
      phones: [
        {
          id: 31,
          phone: '13800000001',
          sourceProvider: 'wechat',
          sourceAppCode: 'lawsuit-material-assistant',
          verifiedAt: '2026-05-23T08:10:00',
          status: 'verified'
        }
      ]
    });
  });

  it('loads records on mount with normalized empty filters', async () => {
    mountPage();

    await flushAsyncUpdates();

    expect(pageGenerationRecordsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: undefined,
      userId: undefined,
      status: undefined,
      recordType: undefined,
      keywords: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('renders generation record fields from backend result', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('11');
    expect(wrapper.text()).toContain('21');
    expect(wrapper.text()).toContain('lawsuit-material-assistant');
    expect(wrapper.text()).toContain('record-001');
    expect(wrapper.text()).toContain('民间借贷起诉状');
    expect(wrapper.text()).toContain('民间借贷');
    expect(wrapper.text()).toContain('已生成');
    expect(wrapper.text()).toContain('已生成起诉状草稿');
    expect(wrapper.text()).toContain('2026-05-23 10:20:00');
    expect(wrapper.text()).toContain('2026-05-23 10:21:00');
  });

  it('sends expected query after keyword, user id, status, type and app filters change', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageGenerationRecordsMock.mockClear();

    await wrapper.find('.keyword-input input').setValue(' record-001 ');
    await wrapper.find('.user-id-input input').setValue('11');
    setPageQuery(wrapper, {
      status: 'generated',
      recordType: 'private_lending',
      appCode: 'lawsuit-material-assistant'
    });
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageGenerationRecordsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      userId: 11,
      status: 'generated',
      recordType: 'private_lending',
      keywords: 'record-001',
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('clears filters and reloads records when reset is clicked', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    setPageQuery(wrapper, {
      pageNo: 3,
      appCode: 'lawsuit-material-assistant',
      userId: '11',
      status: 'generated',
      recordType: 'private_lending',
      keywords: 'record-001'
    });
    pageGenerationRecordsMock.mockClear();

    const buttons = wrapper.findAll('button');
    await buttons.find((button) => button.text().includes('重置'))?.trigger('click');
    await flushAsyncUpdates();

    expect(pageGenerationRecordsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: undefined,
      userId: undefined,
      status: undefined,
      recordType: undefined,
      keywords: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('does not send non-numeric user id to backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageGenerationRecordsMock.mockClear();

    await wrapper.find('.user-id-input input').setValue('abc');
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageGenerationRecordsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined
      })
    );
  });

  it('opens user detail drawer from a record user id without leaving the page', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const userButton = wrapper.findAll('button').find((button) => button.text().includes('查看用户'));
    await userButton?.trigger('click');
    await flushAsyncUpdates();

    expect(getAdminUserDetailMock).toHaveBeenCalledWith(11);
    expect(wrapper.text()).toContain('用户详情');
    expect(wrapper.text()).toContain('13800000001');
    expect(wrapper.text()).toContain('lma-4a378460');
    const drawer = wrapper.findComponent({ name: 'ElDrawer' });
    expect(drawer.props('size')).toBe('720px');
  });
});
