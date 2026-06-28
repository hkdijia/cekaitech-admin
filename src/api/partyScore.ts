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

export interface PartyScoreCleanupStatus {
  enabled: boolean;
  fixedDelay: string;
  initialDelay: string;
  emptyRoomInactiveHours: number;
  activeRoomInactiveHours: number;
  batchSize: number;
  historyVisibleDays: number;
  maxActiveRooms: number;
  archiveEligibleRooms: number;
  historyExpiredRooms: number;
  archivedRoomsToday: number;
  latestArchivedAt?: string;
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

export interface PartyScoreRoomMember {
  memberId: number;
  nickname: string;
  avatarText: string;
  role: string;
  status: string;
  score: number;
  joinedAt: string;
  updatedAt: string;
}

export interface PartyScoreRoomEvent {
  eventId: number;
  version: number;
  type: string;
  submittedByMemberId: number;
  submittedByNickname: string;
  fromMemberId?: number;
  fromMemberNickname?: string;
  toMemberId?: number;
  toMemberNickname?: string;
  amount?: number;
  targetEventId?: number;
  status: string;
  createdAt: string;
}

export interface PartyScoreRoomDetail {
  room: PartyScoreRoomListItem;
  members: PartyScoreRoomMember[];
  events: PartyScoreRoomEvent[];
}

export interface PartyScoreRoomPageRequest {
  status?: string;
  longRunningOnly?: boolean;
  pageNo: number;
  pageSize: number;
}

export function getPartyScoreOverview(): Promise<PartyScoreOverview> {
  return request<PartyScoreOverview>('/api/admin/party-score/overview', {
    method: 'GET'
  });
}

export function getPartyScoreCleanupStatus(): Promise<PartyScoreCleanupStatus> {
  return request<PartyScoreCleanupStatus>('/api/admin/party-score/cleanup', {
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

export function getPartyScoreRoomDetail(roomId: number): Promise<PartyScoreRoomDetail> {
  return request<PartyScoreRoomDetail>(`/api/admin/party-score/rooms/${roomId}`, {
    method: 'GET'
  });
}

export function pagePartyScoreRoomEvents(
  roomId: number,
  payload: { pageNo: number; pageSize: number }
): Promise<PageResult<PartyScoreRoomEvent>> {
  return request<PageResult<PartyScoreRoomEvent>>(`/api/admin/party-score/rooms/${roomId}/events/page`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
