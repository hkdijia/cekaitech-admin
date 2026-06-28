import { describe, expect, it, vi } from 'vitest';
import {
  getMiniappDictionaryItems,
  getPartyScoreCleanupStatus,
  getPartyScoreOverview,
  getPartyScoreRoomDetail,
  pagePartyScoreRoomEvents,
  pagePartyScoreRooms
} from './partyScore';

describe('party score api', () => {
  it('gets party score readonly overview', async () => {
    const fetchMock = mockSuccess({
      todayCreatedRooms: 8,
      activeRooms: 3,
      settledRoomsToday: 4,
      expiredRoomsToday: 1,
      averageMemberCountToday: 4.5,
      longRunningActiveRooms: 1
    });

    const result = await getPartyScoreOverview();

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.activeRooms).toBe(3);
  });

  it('gets party score cleanup readonly status', async () => {
    const fetchMock = mockSuccess({
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

    const result = await getPartyScoreCleanupStatus();

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/cleanup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.archiveEligibleRooms).toBe(2);
    expect(result.historyVisibleDays).toBe(7);
  });

  it('gets miniapp dictionary items for party score status metadata', async () => {
    const fetchMock = mockSuccess([
      {
        itemCode: 'playing',
        itemLabel: '进行中',
        itemValue: 'playing',
        description: '房间仍在计分或等待结算，玩家可继续提交计分。',
        tagType: 'success'
      }
    ]);

    const result = await getMiniappDictionaryItems('party-scorekeeper-miniapp', 'party_score_room_status');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/miniapp-dictionaries/party-scorekeeper-miniapp/party_score_room_status/items',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    expect(result[0].itemCode).toBe('playing');
    expect(result[0].itemLabel).toBe('进行中');
  });

  it('posts party score room page query to readonly page endpoint', async () => {
    const fetchMock = mockSuccess({
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

    const result = await pagePartyScoreRooms({ pageNo: 1, pageSize: 20, status: 'playing' });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/rooms/page', {
      method: 'POST',
      body: JSON.stringify({ pageNo: 1, pageSize: 20, status: 'playing' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].roomCode).toBe('ABCD12');
  });

  it('posts party score long running filter to readonly page endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [],
      totalCount: 0
    });

    await pagePartyScoreRooms({ pageNo: 1, pageSize: 20, longRunningOnly: true });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/rooms/page', {
      method: 'POST',
      body: JSON.stringify({ pageNo: 1, pageSize: 20, longRunningOnly: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('gets party score room detail from readonly detail endpoint', async () => {
    const fetchMock = mockSuccess({
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
      members: [{ memberId: 501, nickname: '房主', avatarText: '房', role: 'owner', status: 'joined', score: -6 }],
      events: [{ eventId: 9001, version: 3, type: 'score_transferred', submittedByMemberId: 501, submittedByNickname: '房主', amount: 6, status: 'active', createdAt: '2026-06-28T08:20:00' }]
    });

    const result = await getPartyScoreRoomDetail(101);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/rooms/101', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.members[0].nickname).toBe('房主');
    expect(result.events[0].type).toBe('score_transferred');
  });

  it('posts party score room event page query to readonly event endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          eventId: 9001,
          version: 12,
          type: 'score_transferred',
          submittedByMemberId: 501,
          submittedByNickname: '房主',
          amount: 6,
          status: 'active',
          createdAt: '2026-06-28T08:20:00'
        }
      ],
      totalCount: 25
    });

    const result = await pagePartyScoreRoomEvents(101, { pageNo: 2, pageSize: 20 });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/party-score/rooms/101/events/page', {
      method: 'POST',
      body: JSON.stringify({ pageNo: 2, pageSize: 20 }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(25);
    expect(result.dataList[0].version).toBe(12);
  });
});

function mockSuccess(data: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      code: '0',
      msg: '',
      data
    })
  } as Response);
}
