import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getMiniappDictionaryItems,
  getPartyScoreCleanupStatus,
  getPartyScoreOverview,
  getPartyScoreRoomDetail,
  pagePartyScoreRoomEvents,
  pagePartyScoreRooms
} from '../../api/partyScore';
import PartyScorePage from './PartyScorePage.vue';

vi.mock('../../api/partyScore', () => ({
  getMiniappDictionaryItems: vi.fn(),
  getPartyScoreOverview: vi.fn(),
  getPartyScoreCleanupStatus: vi.fn(),
  getPartyScoreRoomDetail: vi.fn(),
  pagePartyScoreRoomEvents: vi.fn(),
  pagePartyScoreRooms: vi.fn()
}));

const getMiniappDictionaryItemsMock = vi.mocked(getMiniappDictionaryItems);
const getPartyScoreOverviewMock = vi.mocked(getPartyScoreOverview);
const getPartyScoreCleanupStatusMock = vi.mocked(getPartyScoreCleanupStatus);
const getPartyScoreRoomDetailMock = vi.mocked(getPartyScoreRoomDetail);
const pagePartyScoreRoomEventsMock = vi.mocked(pagePartyScoreRoomEvents);
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
    getMiniappDictionaryItemsMock.mockReset();
    getPartyScoreOverviewMock.mockReset();
    getPartyScoreCleanupStatusMock.mockReset();
    getPartyScoreRoomDetailMock.mockReset();
    pagePartyScoreRoomEventsMock.mockReset();
    pagePartyScoreRoomsMock.mockReset();
    getMiniappDictionaryItemsMock.mockResolvedValue([
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'playing',
        itemLabel: '进行中',
        itemValue: 'playing',
        description: '房间仍在计分或等待结算，玩家可继续提交计分。',
        tagType: 'success'
      },
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'settling',
        itemLabel: '结算中',
        itemValue: 'settling',
        description: '房主已发起结算流程，但尚未确认完结。',
        tagType: 'warning'
      },
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'settled',
        itemLabel: '已完结',
        itemValue: 'settled',
        description: '房主已确认结算，房间结束，仅保留只读历史。',
        tagType: 'info'
      },
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'expired',
        itemLabel: '已归档',
        itemValue: 'expired',
        description: '系统因长时间无活跃自动归档，用于释放活跃房间资源。',
        tagType: 'danger'
      }
    ]);
    getPartyScoreOverviewMock.mockResolvedValue({
      todayCreatedRooms: 8,
      activeRooms: 3,
      settledRoomsToday: 4,
      expiredRoomsToday: 1,
      averageMemberCountToday: 4.5,
      longRunningActiveRooms: 1
    });
    getPartyScoreCleanupStatusMock.mockResolvedValue({
      enabled: true,
      fixedDelay: 'PT30M',
      initialDelay: 'PT2M',
      emptyRoomInactiveHours: 24,
      activeRoomInactiveHours: 24,
      batchSize: 100,
      historyVisibleDays: 7,
      maxActiveRooms: 500,
      archiveEligibleRooms: 2,
      historyExpiredRooms: 1,
      archivedRoomsToday: 3,
      latestArchivedAt: '2026-06-28T08:30:00'
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
    getPartyScoreRoomDetailMock.mockResolvedValue({
      room: {
        roomId: 101,
        roomCode: 'ABCD12',
        status: 'playing',
        memberCount: 2,
        version: 3,
        createdAt: '2026-06-28T08:00:00',
        updatedAt: '2026-06-28T08:20:00',
        lastEventAt: '2026-06-28T08:20:00',
        ownerMemberId: 501,
        longRunning: false
      },
      members: [
        { memberId: 501, nickname: '房主', avatarText: '房', role: 'owner', status: 'joined', score: -6, joinedAt: '2026-06-28T08:00:00', updatedAt: '2026-06-28T08:20:00' },
        { memberId: 502, nickname: '朋友2', avatarText: '朋', role: 'player', status: 'joined', score: 6, joinedAt: '2026-06-28T08:05:00', updatedAt: '2026-06-28T08:20:00' }
      ],
      events: [
        {
          eventId: 9001,
          version: 3,
          type: 'score_transferred',
          submittedByMemberId: 501,
          submittedByNickname: '房主',
          fromMemberId: 501,
          fromMemberNickname: '房主',
          toMemberId: 502,
          toMemberNickname: '朋友2',
          amount: 6,
          status: 'active',
          createdAt: '2026-06-28T08:20:00'
        }
      ]
    });
    pagePartyScoreRoomEventsMock.mockResolvedValue({
      dataList: [
        {
          eventId: 9101,
          version: 12,
          type: 'score_transferred',
          submittedByMemberId: 501,
          submittedByNickname: '房主',
          fromMemberId: 501,
          fromMemberNickname: '房主',
          toMemberId: 502,
          toMemberNickname: '朋友2',
          amount: 8,
          status: 'active',
          createdAt: '2026-06-28T08:25:00'
        }
      ],
      totalCount: 25
    });
  });

  it('loads overview and readonly room list on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(getPartyScoreOverviewMock).toHaveBeenCalledTimes(1);
    expect(getMiniappDictionaryItemsMock).toHaveBeenCalledWith(
      'party-scorekeeper-miniapp',
      'party_score_room_status'
    );
    expect(getPartyScoreCleanupStatusMock).toHaveBeenCalledTimes(1);
    expect(pagePartyScoreRoomsMock).toHaveBeenCalledWith({ pageNo: 1, pageSize: 20, status: undefined });
    expect(wrapper.text()).toContain('朋友局计分');
    expect(wrapper.text()).toContain('今日开局');
    expect(wrapper.text()).toContain('活跃房间');
    expect(wrapper.text()).toContain('房间列表');
    expect(wrapper.text()).toContain('自动清理策略');
    expect(wrapper.text()).toContain('24 小时无活跃自动归档');
    expect(wrapper.text()).toContain('历史记录可查看 7 天');
    expect(wrapper.text()).toContain('待归档 2 间');
    expect(wrapper.text()).toContain('超过可见期 1 间');
    expect(wrapper.text()).toContain('ABCD12');
    expect(wrapper.text()).toContain('进行中');
    expect(wrapper.text()).not.toContain('强制归档');
    expect(wrapper.text()).not.toContain('删除房间');
    expect(wrapper.text()).not.toContain('改分');
  });

  it('uses backend dictionary status metadata when available', async () => {
    getMiniappDictionaryItemsMock.mockResolvedValueOnce([
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'playing',
        itemLabel: '开局中',
        itemValue: 'playing',
        description: '来自后端字典的状态说明。',
        tagType: 'success'
      }
    ]);
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[aria-label="状态说明"]').trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('开局中');
    expect(wrapper.text()).toContain('开局中：来自后端字典的状态说明。');
  });

  it('matches room status by backend dictionary item value when code differs', async () => {
    getMiniappDictionaryItemsMock.mockResolvedValueOnce([
      {
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        itemCode: 'party_score_status_playing',
        itemLabel: '开局中',
        itemValue: 'playing',
        description: '使用 itemValue 匹配真实房间状态。',
        tagType: 'success'
      }
    ]);
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('开局中');
    expect(pagePartyScoreRoomsMock).toHaveBeenCalledWith({ pageNo: 1, pageSize: 20, status: undefined });
  });

  it('falls back to local status metadata when backend dictionary loading fails', async () => {
    getMiniappDictionaryItemsMock.mockRejectedValueOnce(new Error('字典不可用'));
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[aria-label="状态说明"]').trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('进行中：房间仍在计分或等待结算，玩家可继续提交计分。');
  });

  it('renders expandable room status explanations near status column', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    const statusHelpButton = wrapper.find('[aria-label="状态说明"]');
    expect(statusHelpButton.exists()).toBe(true);
    expect(wrapper.text()).not.toContain('进行中：房间仍在计分或等待结算，玩家可继续提交计分。');

    await statusHelpButton.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('状态说明');
    expect(wrapper.text()).toContain('进行中：房间仍在计分或等待结算，玩家可继续提交计分。');
    expect(wrapper.text()).toContain('结算中：房主已发起结算流程，但尚未确认完结。');
    expect(wrapper.text()).toContain('已完结：房主已确认结算，房间结束，仅保留只读历史。');
    expect(wrapper.text()).toContain('已归档：系统因长时间无活跃自动归档，用于释放活跃房间资源。');

    await statusHelpButton.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('进行中：房间仍在计分或等待结算，玩家可继续提交计分。');
  });

  it('opens readonly room detail drawer with members and event timeline', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('查看详情'))?.trigger('click');
    await flushAsyncUpdates();

    expect(getPartyScoreRoomDetailMock).toHaveBeenCalledWith(101);
    expect(wrapper.text()).toContain('房间详情');
    expect(wrapper.text()).toContain('成员列表');
    expect(wrapper.text()).toContain('现场流水');
    expect(wrapper.text()).toContain('最近 10 条');
    expect(wrapper.text()).toContain('查看全部');
    expect(wrapper.text()).toContain('房主');
    expect(wrapper.text()).toContain('朋友2');
    expect(wrapper.text()).toContain('计分转移');
    expect(wrapper.text()).toContain('房主 -> 朋友2');
    const buttonText = wrapper.findAll('button').map((button) => button.text()).join(' ');
    expect(buttonText).not.toContain('归档');
    expect(buttonText).not.toContain('删除');
    expect(buttonText).not.toContain('改分');
    expect(buttonText).not.toContain('踢人');
  });

  it('opens paged room event dialog from detail drawer', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('查看详情'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('查看全部'))?.trigger('click');
    await flushAsyncUpdates();

    expect(pagePartyScoreRoomEventsMock).toHaveBeenCalledWith(101, { pageNo: 1, pageSize: 20 });
    expect(wrapper.text()).toContain('完整现场流水');
    expect(wrapper.text()).toContain('共 25 条');
    expect(wrapper.text()).toContain('房主 -> 朋友2，8 分');
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
