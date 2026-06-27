import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { getPartyScoreOverview, pagePartyScoreRooms } from '../../api/partyScore';
import PartyScorePage from './PartyScorePage.vue';

vi.mock('../../api/partyScore', () => ({
  getPartyScoreOverview: vi.fn(),
  pagePartyScoreRooms: vi.fn()
}));

const getPartyScoreOverviewMock = vi.mocked(getPartyScoreOverview);
const pagePartyScoreRoomsMock = vi.mocked(pagePartyScoreRooms);

async function flushAsyncUpdates() {
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

function mountPage() {
  return mount(PartyScorePage, {
    global: {
      plugins: [ElementPlus]
    }
  });
}

describe('PartyScorePage', () => {
  beforeEach(() => {
    getPartyScoreOverviewMock.mockReset();
    pagePartyScoreRoomsMock.mockReset();
    getPartyScoreOverviewMock.mockResolvedValue({
      todayCreatedRooms: 8,
      activeRooms: 3,
      settledRoomsToday: 4,
      expiredRoomsToday: 1,
      averageMemberCountToday: 4.5,
      longRunningActiveRooms: 1
    });
    pagePartyScoreRoomsMock.mockResolvedValue({
      dataList: [
        {
          roomId: 101,
          roomCode: 'ABCD12',
          status: 'playing',
          memberCount: 6,
          version: 12,
          createdAt: '2026-06-28T08:00:00',
          updatedAt: '2026-06-28T08:20:00',
          lastEventAt: '2026-06-28T08:20:00',
          ownerMemberId: 501,
          longRunning: false
        }
      ],
      totalCount: 1
    });
  });

  it('loads overview and readonly room list on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(getPartyScoreOverviewMock).toHaveBeenCalledTimes(1);
    expect(pagePartyScoreRoomsMock).toHaveBeenCalledWith({ pageNo: 1, pageSize: 20, status: undefined });
    expect(wrapper.text()).toContain('朋友局计分');
    expect(wrapper.text()).toContain('今日开局');
    expect(wrapper.text()).toContain('活跃房间');
    expect(wrapper.text()).toContain('房间列表');
    expect(wrapper.text()).toContain('ABCD12');
    expect(wrapper.text()).toContain('进行中');
    expect(wrapper.text()).not.toContain('强制归档');
    expect(wrapper.text()).not.toContain('删除房间');
    expect(wrapper.text()).not.toContain('改分');
  });

  it('filters rooms by status and resets to first page', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const statusSelect = wrapper.findComponent({ name: 'ElSelect' });
    statusSelect.vm.$emit('update:modelValue', 'settled');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('查询'))?.trigger('click');
    await flushAsyncUpdates();

    expect(pagePartyScoreRoomsMock).toHaveBeenLastCalledWith({ pageNo: 1, pageSize: 20, status: 'settled' });
  });

  it('requests long running rooms from readonly backend filter', async () => {
    const longRunningResult = {
      dataList: [
        {
          roomId: 201,
          roomCode: 'LONG01',
          status: 'playing',
          memberCount: 3,
          version: 5,
          createdAt: '2026-06-27T01:00:00',
          updatedAt: '2026-06-27T01:10:00',
          lastEventAt: '2026-06-27T01:10:00',
          ownerMemberId: 601,
          longRunning: true
        },
        {
          roomId: 202,
          roomCode: 'FRESH1',
          status: 'playing',
          memberCount: 4,
          version: 8,
          createdAt: '2026-06-28T08:00:00',
          updatedAt: '2026-06-28T08:20:00',
          lastEventAt: '2026-06-28T08:20:00',
          ownerMemberId: 602,
          longRunning: false
        }
      ],
      totalCount: 2
    };
    pagePartyScoreRoomsMock.mockResolvedValueOnce(longRunningResult).mockResolvedValueOnce(longRunningResult);
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.find('[data-test="long-running-only"] input[type="checkbox"]').setValue(true);
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('查询'))?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('LONG01');
    expect(wrapper.text()).toContain('仅看长时间活跃');
    expect(pagePartyScoreRoomsMock).toHaveBeenLastCalledWith({
      pageNo: 1,
      pageSize: 20,
      status: undefined,
      longRunningOnly: true
    });
  });

  it('shows empty state when readonly room list has no records', async () => {
    pagePartyScoreRoomsMock.mockResolvedValueOnce({
      dataList: [],
      totalCount: 0
    });

    const wrapper = mountPage();
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('暂无匹配房间');
    expect(wrapper.text()).toContain('可以调整状态筛选或稍后刷新');
  });

  it('shows error state and keeps readonly controls when loading fails', async () => {
    getPartyScoreOverviewMock.mockRejectedValueOnce(new Error('只读观测加载失败'));

    const wrapper = mountPage();
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('只读观测加载失败');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).toContain('刷新');
    expect(buttonText).not.toContain('归档');
    expect(buttonText).not.toContain('删除');
  });

  it('shows readonly boundary copy without write controls', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('只读观测');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).toContain('刷新');
    expect(buttonText).toContain('查询');
    expect(buttonText).not.toContain('归档');
    expect(buttonText).not.toContain('删除');
    expect(buttonText).not.toContain('踢人');
    expect(buttonText).not.toContain('查看完整流水');
  });
});
