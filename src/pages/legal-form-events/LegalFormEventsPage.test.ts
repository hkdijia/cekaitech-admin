import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { pageLegalFormEvents } from '../../api/legalFormEvents';
import { getAdminUserDetail } from '../../api/adminUsers';
import LegalFormEventsPage from './LegalFormEventsPage.vue';

const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock('../../api/legalFormEvents', () => ({
  pageLegalFormEvents: vi.fn()
}));

vi.mock('../../api/adminUsers', () => ({
  getAdminUserDetail: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}));

const pageLegalFormEventsMock = vi.mocked(pageLegalFormEvents);
const getAdminUserDetailMock = vi.mocked(getAdminUserDetail);

const legalFormEvent = {
  id: 1001,
  userId: 11,
  identityId: 21,
  appCode: 'lawsuit-material-assistant',
  clientEventId: 'evt-001',
  eventType: 'form_submit',
  formType: 'private_lending',
  qualityStatus: 'valid',
  filledFieldCount: 18,
  payloadPreview: '{"caseReason":"民间借贷"}',
  createdAt: '2026-05-23T09:20:00'
};

function mountPage() {
  return mount(LegalFormEventsPage, {
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

describe('LegalFormEventsPage', () => {
  beforeEach(() => {
    pageLegalFormEventsMock.mockReset();
    getAdminUserDetailMock.mockReset();
    routerPushMock.mockReset();
    pageLegalFormEventsMock.mockResolvedValue({
      dataList: [legalFormEvent],
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

  it('loads events on mount with normalized empty filters', async () => {
    mountPage();

    await flushAsyncUpdates();

    expect(pageLegalFormEventsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      appCode: undefined,
      userId: undefined,
      formType: undefined,
      qualityStatus: undefined,
      eventType: undefined,
      keywords: undefined
    });
  });

  it('sends expected query after keyword, user id, status, event type and app filters change', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalFormEventsMock.mockClear();

    await wrapper.find('.keyword-input input').setValue(' evt-001 ');
    await wrapper.find('.user-id-input input').setValue('11');
    setPageQuery(wrapper, {
      appCode: 'lawsuit-material-assistant',
      formType: 'private_lending',
      qualityStatus: 'valid',
      eventType: 'form_submit'
    });
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalFormEventsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      appCode: 'lawsuit-material-assistant',
      userId: 11,
      formType: 'private_lending',
      qualityStatus: 'valid',
      eventType: 'form_submit',
      keywords: 'evt-001'
    });
  });

  it('does not send non-positive or non-numeric user id to backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalFormEventsMock.mockClear();

    await wrapper.find('.user-id-input input').setValue('0');
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalFormEventsMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        userId: undefined
      })
    );

    pageLegalFormEventsMock.mockClear();

    await wrapper.find('.user-id-input input').setValue('abc');
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalFormEventsMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        userId: undefined
      })
    );
  });

  it('opens user detail drawer from an event user id without leaving the page', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const userButton = wrapper.findAll('button').find((button) => button.text().includes('查看用户'));
    await userButton?.trigger('click');
    await flushAsyncUpdates();

    expect(getAdminUserDetailMock).toHaveBeenCalledWith(11);
    expect(routerPushMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('用户详情');
    expect(wrapper.text()).toContain('13800000001');
    expect(wrapper.text()).toContain('lma-4a378460');
    const drawer = wrapper.findComponent({ name: 'ElDrawer' });
    expect(drawer.props('size')).toBe('720px');
  });
});
