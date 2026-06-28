<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import {
  getMiniappDictionaryItems,
  getPartyScoreCleanupStatus,
  getPartyScoreOverview,
  getPartyScoreRoomDetail,
  pagePartyScoreRoomEvents,
  pagePartyScoreRooms,
  type PartyScoreCleanupStatus,
  type PartyScoreOverview,
  type PartyScoreRoomDetail,
  type PartyScoreRoomEvent,
  type PartyScoreRoomListItem
} from '../../api/partyScore';

const loading = ref(false);
const loadError = ref('');
const overview = ref<PartyScoreOverview | null>(null);
const cleanupStatus = ref<PartyScoreCleanupStatus | null>(null);
const rooms = ref<PartyScoreRoomListItem[]>([]);
const totalCount = ref(0);
const longRunningOnly = ref(false);
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailError = ref('');
const roomDetail = ref<PartyScoreRoomDetail | null>(null);
const eventDialogVisible = ref(false);
const eventDialogLoading = ref(false);
const eventDialogError = ref('');
const eventRows = ref<PartyScoreRoomEvent[]>([]);
const eventTotalCount = ref(0);
const statusHelpVisible = ref(false);

const eventQuery = reactive({
  pageNo: 1,
  pageSize: 20
});

const query = reactive({
  status: '',
  pageNo: 1,
  pageSize: 20
});

const fallbackRoomStatusMetas = [
  {
    label: '进行中',
    value: 'playing',
    tagType: 'success',
    description: '房间仍在计分或等待结算，玩家可继续提交计分。'
  },
  {
    label: '结算中',
    value: 'settling',
    tagType: 'warning',
    description: '房主已发起结算流程，但尚未确认完结。'
  },
  {
    label: '已完结',
    value: 'settled',
    tagType: 'info',
    description: '房主已确认结算，房间结束，仅保留只读历史。'
  },
  {
    label: '已归档',
    value: 'expired',
    tagType: 'danger',
    description: '系统因长时间无活跃自动归档，用于释放活跃房间资源。'
  }
];

const roomStatusMetas = ref(fallbackRoomStatusMetas);

const statusOptions = computed(() => [
  { label: '全部状态', value: '' },
  ...roomStatusMetas.value.map((item) => ({ label: item.label, value: item.value }))
]);

async function loadDictionaryMetas() {
  try {
    const items = await getMiniappDictionaryItems('party-scorekeeper-miniapp', 'party_score_room_status');
    if (items.length === 0) {
      return;
    }
    roomStatusMetas.value = items.map((item) => ({
      label: item.itemLabel,
      value: item.itemValue || item.itemCode,
      tagType: item.tagType || 'info',
      description: item.description
    }));
  } catch (error) {
    roomStatusMetas.value = fallbackRoomStatusMetas;
  }
}

async function loadData() {
  loading.value = true;
  loadError.value = '';
  try {
    const [overviewResult, cleanupResult, pageResult] = await Promise.all([
      getPartyScoreOverview(),
      getPartyScoreCleanupStatus(),
      pagePartyScoreRooms({
        pageNo: query.pageNo,
        pageSize: query.pageSize,
        status: query.status || undefined,
        longRunningOnly: longRunningOnly.value || undefined
      })
    ]);
    overview.value = overviewResult;
    cleanupStatus.value = cleanupResult;
    rooms.value = pageResult.dataList;
    totalCount.value = pageResult.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '朋友局计分观测数据加载失败';
    rooms.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchRooms() {
  query.pageNo = 1;
  loadData();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadData();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadData();
}

async function openRoomDetail(row: PartyScoreRoomListItem) {
  detailVisible.value = true;
  detailLoading.value = true;
  detailError.value = '';
  roomDetail.value = null;
  try {
    roomDetail.value = await getPartyScoreRoomDetail(row.roomId);
  } catch (error) {
    detailError.value = error instanceof Error ? error.message : '房间详情加载失败';
  } finally {
    detailLoading.value = false;
  }
}

async function loadRoomEvents() {
  if (!roomDetail.value) {
    return;
  }
  eventDialogLoading.value = true;
  eventDialogError.value = '';
  try {
    const pageResult = await pagePartyScoreRoomEvents(roomDetail.value.room.roomId, {
      pageNo: eventQuery.pageNo,
      pageSize: eventQuery.pageSize
    });
    eventRows.value = pageResult.dataList;
    eventTotalCount.value = pageResult.totalCount;
  } catch (error) {
    eventDialogError.value = error instanceof Error ? error.message : '完整流水加载失败';
    eventRows.value = [];
    eventTotalCount.value = 0;
  } finally {
    eventDialogLoading.value = false;
  }
}

async function openEventDialog() {
  eventDialogVisible.value = true;
  eventQuery.pageNo = 1;
  await loadRoomEvents();
}

function handleEventPageChange(pageNo: number) {
  eventQuery.pageNo = pageNo;
  loadRoomEvents();
}

function handleEventSizeChange(pageSize: number) {
  eventQuery.pageNo = 1;
  eventQuery.pageSize = pageSize;
  loadRoomEvents();
}

function statusText(status: string) {
  const meta = roomStatusMetas.value.find((item) => item.value === status);
  if (meta) {
    return meta.label;
  }
  return status || '-';
}

function statusTagType(status: string) {
  const meta = roomStatusMetas.value.find((item) => item.value === status);
  if (meta) {
    return meta.tagType;
  }
  return 'info';
}

function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').slice(0, 16);
}

function roleText(role: string) {
  if (role === 'owner') {
    return '房主';
  }
  if (role === 'player') {
    return '玩家';
  }
  return role || '-';
}

function memberStatusText(status: string) {
  if (status === 'joined') {
    return '在局';
  }
  if (status === 'left') {
    return '暂离';
  }
  return status || '-';
}

function eventTypeText(type: string) {
  if (type === 'member_joined') {
    return '成员加入';
  }
  if (type === 'member_profile_updated') {
    return '成员改名';
  }
  if (type === 'score_transferred') {
    return '计分转移';
  }
  if (type === 'score_undone') {
    return '撤销计分';
  }
  if (type === 'member_left') {
    return '成员暂离';
  }
  if (type === 'member_rejoined') {
    return '回到本局';
  }
  if (type === 'settlement_started') {
    return '发起结算';
  }
  if (type === 'settlement_cancelled') {
    return '取消结算';
  }
  if (type === 'settlement_confirmed') {
    return '确认完结';
  }
  if (type === 'room_archived') {
    return '系统归档';
  }
  return type || '-';
}

function eventSummary(event: PartyScoreRoomEvent) {
  if (event.type === 'score_transferred') {
    return `${event.fromMemberNickname || event.fromMemberId || '-'} -> ${event.toMemberNickname || event.toMemberId || '-'}，${event.amount ?? 0} 分`;
  }
  if (event.type === 'score_undone') {
    return `${event.submittedByNickname || event.submittedByMemberId} 撤销事件 #${event.targetEventId || '-'}`;
  }
  return event.submittedByNickname || `成员 ${event.submittedByMemberId}`;
}

onMounted(() => {
  loadDictionaryMetas();
  loadData();
});
</script>

<template>
  <section>
    <h1 class="page-title">朋友局计分</h1>
    <p class="page-subtitle">联机房间只读观测，用于查看开局量、活跃房间和异常长时间未结束房间。</p>

    <el-alert
      class="readonly-alert"
      type="info"
      title="只读观测：本页仅展示运营指标和房间摘要，不提供房间控制、成员控制或分数调整。"
      :closable="false"
      show-icon
    />

    <el-alert v-if="loadError" class="readonly-alert" type="error" :title="loadError" :closable="false" show-icon />

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">今日开局</div>
          <div class="metric-value">{{ overview?.todayCreatedRooms ?? '-' }}</div>
          <div class="metric-hint">当天创建房间</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">活跃房间</div>
          <div class="metric-value">{{ overview?.activeRooms ?? '-' }}</div>
          <div class="metric-hint">进行中/结算中</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">今日完结</div>
          <div class="metric-value">{{ overview?.settledRoomsToday ?? '-' }}</div>
          <div class="metric-hint">房主确认结算</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">今日归档</div>
          <div class="metric-value">{{ overview?.expiredRoomsToday ?? '-' }}</div>
          <div class="metric-hint">系统自动归档</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">平均人数</div>
          <div class="metric-value">{{ overview ? overview.averageMemberCountToday.toFixed(1) : '-' }}</div>
          <div class="metric-hint">今日房间成员</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">长时间活跃</div>
          <div class="metric-value">{{ overview?.longRunningActiveRooms ?? '-' }}</div>
          <div class="metric-hint">超过 24 小时</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-card cleanup-card">
      <template #header>
        <div class="section-head">
          <span>自动清理策略</span>
          <el-tag :type="cleanupStatus?.enabled ? 'success' : 'info'">
            {{ cleanupStatus?.enabled ? '已启用' : '未启用' }}
          </el-tag>
        </div>
      </template>
      <div class="cleanup-grid">
        <div>
          <span class="detail-label">归档规则</span>
          <strong>{{ cleanupStatus?.activeRoomInactiveHours ?? '-' }} 小时无活跃自动归档</strong>
          <p>单人空房同样按 {{ cleanupStatus?.emptyRoomInactiveHours ?? '-' }} 小时无活跃归档。</p>
        </div>
        <div>
          <span class="detail-label">历史可见期</span>
          <strong>历史记录可查看 {{ cleanupStatus?.historyVisibleDays ?? '-' }} 天</strong>
          <p>超过可见期后，用户端不再开放房间详情和流水。</p>
        </div>
        <div>
          <span class="detail-label">当前待处理</span>
          <strong>待归档 {{ cleanupStatus?.archiveEligibleRooms ?? '-' }} 间</strong>
          <p>超过可见期 {{ cleanupStatus?.historyExpiredRooms ?? '-' }} 间</p>
        </div>
        <div>
          <span class="detail-label">调度状态</span>
          <strong>每 {{ cleanupStatus?.fixedDelay ?? '-' }} 扫描，批量 {{ cleanupStatus?.batchSize ?? '-' }}</strong>
          <p>今日归档 {{ cleanupStatus?.archivedRoomsToday ?? '-' }} 间，最近 {{ formatDateTime(cleanupStatus?.latestArchivedAt) }}</p>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="section-card">
      <template #header>
        <div class="section-head">
          <span>房间列表</span>
          <div class="toolbar">
            <el-select v-model="query.status" class="status-select" placeholder="全部状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-checkbox v-model="longRunningOnly" data-test="long-running-only">仅看长时间活跃</el-checkbox>
            <el-button :loading="loading" @click="searchRooms">查询</el-button>
            <el-button type="primary" plain :loading="loading" @click="loadData">刷新</el-button>
          </div>
        </div>
      </template>

      <el-empty
        v-if="!loading && rooms.length === 0"
        description="暂无匹配房间，可以调整状态筛选或稍后刷新"
      />

      <div v-if="statusHelpVisible" class="status-help-panel">
        <div class="status-help-title">状态说明</div>
        <div v-for="item in roomStatusMetas" :key="item.value" class="status-help-item">
          <el-tag :type="item.tagType" size="small">{{ item.label }}</el-tag>
          <span>{{ item.label }}：{{ item.description }}</span>
        </div>
      </div>

      <el-table v-if="rooms.length > 0" :data="rooms" v-loading="loading">
        <el-table-column prop="roomCode" label="房间码" width="110" />
        <el-table-column width="120">
          <template #header>
            <div class="status-column-head">
              <span>状态</span>
              <el-button
                class="status-help-button"
                text
                type="primary"
                :icon="InfoFilled"
                aria-label="状态说明"
                @click.stop="statusHelpVisible = !statusHelpVisible"
              />
            </div>
          </template>
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="90" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="ownerMemberId" label="房主成员 ID" width="130" />
        <el-table-column label="长时间活跃" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.longRunning" type="warning">需关注</el-tag>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="最近事件" min-width="150">
          <template #default="{ row }">{{ formatDateTime(row.lastEventAt) }}</template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="150">
          <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openRoomDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-row">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="totalCount"
          :current-page="query.pageNo"
          :page-size="query.pageSize"
          :page-sizes="[20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="房间详情" size="720px" destroy-on-close>
      <el-alert
        class="readonly-alert"
        type="info"
        title="只读详情：仅用于排查成员状态和现场流水，不提供归档、删除、改分或踢人。"
        :closable="false"
        show-icon
      />

      <el-alert v-if="detailError" class="readonly-alert" type="error" :title="detailError" :closable="false" show-icon />

      <div v-loading="detailLoading">
        <template v-if="roomDetail">
          <div class="detail-summary">
            <div>
              <span class="detail-label">房间码</span>
              <strong>{{ roomDetail.room.roomCode }}</strong>
            </div>
            <div>
              <span class="detail-label">状态</span>
              <el-tag :type="statusTagType(roomDetail.room.status)">{{ statusText(roomDetail.room.status) }}</el-tag>
            </div>
            <div>
              <span class="detail-label">版本</span>
              <strong>{{ roomDetail.room.version }}</strong>
            </div>
            <div>
              <span class="detail-label">最近事件</span>
              <strong>{{ formatDateTime(roomDetail.room.lastEventAt) }}</strong>
            </div>
          </div>

          <h2 class="detail-title">成员列表</h2>
          <el-table :data="roomDetail.members" size="small">
            <el-table-column prop="memberId" label="成员 ID" width="90" />
            <el-table-column label="昵称" min-width="120">
              <template #default="{ row }">
                <span class="avatar-chip">{{ row.avatarText }}</span>
                <span>{{ row.nickname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" width="90">
              <template #default="{ row }">{{ roleText(row.role) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">{{ memberStatusText(row.status) }}</template>
            </el-table-column>
            <el-table-column prop="score" label="分数" width="90" />
          </el-table>

          <div class="detail-title-row">
            <h2 class="detail-title">现场流水</h2>
            <div class="detail-title-actions">
              <span>最近 10 条</span>
              <el-button text type="primary" @click="openEventDialog">查看全部</el-button>
            </div>
          </div>
          <el-timeline class="event-timeline">
            <el-timeline-item
              v-for="event in roomDetail.events"
              :key="event.eventId"
              :timestamp="formatDateTime(event.createdAt)"
              placement="top"
            >
              <div class="event-card">
                <div class="event-head">
                  <span>{{ eventTypeText(event.type) }}</span>
                  <el-tag size="small" type="info">v{{ event.version }}</el-tag>
                </div>
                <div class="event-summary">{{ eventSummary(event) }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </template>
      </div>
    </el-drawer>

    <el-dialog v-model="eventDialogVisible" title="完整现场流水" width="860px" destroy-on-close>
      <el-alert
        v-if="eventDialogError"
        class="readonly-alert"
        type="error"
        :title="eventDialogError"
        :closable="false"
        show-icon
      />
      <div class="event-dialog-meta">共 {{ eventTotalCount }} 条</div>
      <el-table :data="eventRows" v-loading="eventDialogLoading" size="small">
        <el-table-column label="版本" width="80">
          <template #default="{ row }">v{{ row.version }}</template>
        </el-table-column>
        <el-table-column label="类型" width="120">
          <template #default="{ row }">{{ eventTypeText(row.type) }}</template>
        </el-table-column>
        <el-table-column label="摘要" min-width="260">
          <template #default="{ row }">{{ eventSummary(row) }}</template>
        </el-table-column>
        <el-table-column label="提交人" min-width="120">
          <template #default="{ row }">{{ row.submittedByNickname || row.submittedByMemberId || '-' }}</template>
        </el-table-column>
        <el-table-column label="时间" min-width="150">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-row">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="eventTotalCount"
          :current-page="eventQuery.pageNo"
          :page-size="eventQuery.pageSize"
          :page-sizes="[20, 50, 100]"
          @current-change="handleEventPageChange"
          @size-change="handleEventSizeChange"
        />
      </div>
    </el-dialog>
  </section>
</template>

<style scoped>
.readonly-alert,
.metric-card {
  margin-bottom: 16px;
}

.metric-label,
.metric-hint {
  color: #667085;
  font-size: 13px;
}

.metric-value {
  margin: 10px 0;
  font-size: 28px;
  font-weight: 700;
}

.section-card {
  margin-top: 8px;
}

.cleanup-card {
  margin-bottom: 16px;
}

.cleanup-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.cleanup-grid > div {
  min-height: 96px;
  padding: 12px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  background: #f9fafb;
}

.cleanup-grid p {
  margin: 8px 0 0;
  color: #667085;
  font-size: 13px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-select {
  width: 140px;
}

.status-column-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-help-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.status-help-title {
  margin-bottom: 10px;
  font-weight: 700;
}

.status-help-item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  margin-bottom: 8px;
  color: #475467;
  line-height: 1.5;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.detail-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.detail-summary > div {
  padding: 12px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  background: #f9fafb;
}

.detail-label {
  display: block;
  margin-bottom: 6px;
  color: #667085;
  font-size: 12px;
}

.detail-title {
  margin: 20px 0 12px;
  font-size: 16px;
}

.detail-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}

.detail-title-row .detail-title {
  margin: 0 0 12px;
}

.detail-title-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #667085;
  font-size: 13px;
}

.event-dialog-meta {
  margin-bottom: 12px;
  color: #667085;
  font-size: 13px;
}

.avatar-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 50%;
  background: #eef4ff;
  color: #3538cd;
  font-size: 12px;
  font-weight: 700;
}

.event-timeline {
  padding-left: 4px;
}

.event-card {
  padding: 10px 12px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  background: #ffffff;
}

.event-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
}

.event-summary {
  margin-top: 6px;
  color: #667085;
  font-size: 13px;
}
</style>
