import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface PartyScoreOverview {
  todayCreatedRooms: number;
  activeRooms: number;
  settledRoomsToday: number;
  expiredRoomsToday: number;
  averageMemberCountToday: number;
  longRunningActiveRooms: number;
}

export interface PartyScoreRoomListItem {
  roomId: number;
  roomCode: string;
  status: string;
  memberCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
  lastEventAt?: string;
  ownerMemberId?: number;
  longRunning: boolean;
}

export interface PartyScoreRoomPageRequest {
  status?: string;
  pageNo: number;
  pageSize: number;
}

export function getPartyScoreOverview(): Promise<PartyScoreOverview> {
  return request<PartyScoreOverview>('/api/admin/party-score/overview', {
    method: 'GET'
  });
}

export function pagePartyScoreRooms(
  payload: PartyScoreRoomPageRequest
): Promise<PageResult<PartyScoreRoomListItem>> {
  return request<PageResult<PartyScoreRoomListItem>>('/api/admin/party-score/rooms/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
