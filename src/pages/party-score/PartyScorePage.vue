<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
  getPartyScoreOverview,
  pagePartyScoreRooms,
  type PartyScoreOverview,
  type PartyScoreRoomListItem
} from '../../api/partyScore';

const loading = ref(false);
const loadError = ref('');
const overview = ref<PartyScoreOverview | null>(null);
const rooms = ref<PartyScoreRoomListItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  status: '',
  pageNo: 1,
  pageSize: 20
});

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '进行中', value: 'playing' },
  { label: '结算中', value: 'settling' },
  { label: '已完结', value: 'settled' },
  { label: '已归档', value: 'expired' }
];

async function loadData() {
  loading.value = true;
  loadError.value = '';
  try {
    const [overviewResult, pageResult] = await Promise.all([
      getPartyScoreOverview(),
      pagePartyScoreRooms({
        pageNo: query.pageNo,
        pageSize: query.pageSize,
        status: query.status || undefined
      })
    ]);
    overview.value = overviewResult;
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

function statusText(status: string) {
  if (status === 'playing') {
    return '进行中';
  }
  if (status === 'settling') {
    return '结算中';
  }
  if (status === 'settled') {
    return '已完结';
  }
  if (status === 'expired') {
    return '已归档';
  }
  return status || '-';
}

function statusTagType(status: string) {
  if (status === 'playing') {
    return 'success';
  }
  if (status === 'settling') {
    return 'warning';
  }
  if (status === 'settled') {
    return 'info';
  }
  if (status === 'expired') {
    return 'danger';
  }
  return 'info';
}

function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').slice(0, 16);
}

onMounted(() => {
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
            <el-button :loading="loading" @click="searchRooms">查询</el-button>
            <el-button type="primary" plain :loading="loading" @click="loadData">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table :data="rooms" v-loading="loading">
        <el-table-column prop="roomCode" label="房间码" width="110" />
        <el-table-column label="状态" width="110">
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

.pagination-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
