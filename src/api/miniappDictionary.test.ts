import { describe, expect, it, vi } from 'vitest';
import { pageMiniappDictionaryGroups, pageMiniappDictionaryItems } from './miniappDictionary';

describe('miniapp dictionary api', () => {
  it('posts dictionary group page query', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          groupId: 1,
          appCode: 'party-scorekeeper-miniapp',
          groupCode: 'party_score_room_status',
          groupName: '朋友局计分房间状态',
          scopeType: 'admin_display',
          description: '后台房间状态说明',
          enabled: true,
          sortOrder: 10
        }
      ],
      totalCount: 1
    });

    const result = await pageMiniappDictionaryGroups({
      appCode: 'party-scorekeeper-miniapp',
      enabled: 'enabled',
      pageNo: 1,
      pageSize: 20
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/miniapp-dictionaries/groups/page', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'party-scorekeeper-miniapp',
        enabled: 'enabled',
        pageNo: 1,
        pageSize: 20
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].groupCode).toBe('party_score_room_status');
  });

  it('posts dictionary item page query', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          itemId: 1,
          appCode: 'party-scorekeeper-miniapp',
          groupCode: 'party_score_room_status',
          itemCode: 'playing',
          itemLabel: '进行中',
          itemValue: 'playing',
          description: '房间仍在计分。',
          tagType: 'success',
          colorToken: 'success',
          sortOrder: 10,
          enabled: true,
          systemBuiltin: true
        }
      ],
      totalCount: 1
    });

    const result = await pageMiniappDictionaryItems({
      appCode: 'party-scorekeeper-miniapp',
      groupCode: 'party_score_room_status',
      pageNo: 1,
      pageSize: 50
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/miniapp-dictionaries/items/page', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'party-scorekeeper-miniapp',
        groupCode: 'party_score_room_status',
        pageNo: 1,
        pageSize: 50
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.dataList[0].itemLabel).toBe('进行中');
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
