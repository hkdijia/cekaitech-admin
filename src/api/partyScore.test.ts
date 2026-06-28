import { describe, expect, it, vi } from 'vitest';
import { getPartyScoreOverview, getPartyScoreRoomDetail, pagePartyScoreRooms } from './partyScore';

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
