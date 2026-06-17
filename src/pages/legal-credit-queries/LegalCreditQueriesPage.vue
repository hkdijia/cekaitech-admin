<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh, Search, View } from '@element-plus/icons-vue';
import {
  cancelLegalCreditQueryTask,
  getLegalCreditQueryTask,
  pageLegalCreditQueryTasks,
  publishLegalCreditQueryTask,
  requeueLegalCreditQueryTask,
  viewLegalCreditQuerySensitive,
  type LegalCreditQuerySensitiveViewResult,
  type LegalCreditQueryTaskDetail,
  type LegalCreditQueryTaskSummary
} from '../../api/legalCreditQueries';
import { useAuthStore } from '../../stores/auth';
import { getLegalCreditQueryStatusMeta } from './legalCreditQueryStatus';

const auth = useAuthStore();
const loading = ref(false);
const detailLoading = ref(false);
const actionLoading = ref(false);
const sensitiveLoading = ref(false);
const loadError = ref('');
const tasks = ref<LegalCreditQueryTaskSummary[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detail = ref<LegalCreditQueryTaskDetail | null>(null);
const sensitiveFields = ref<LegalCreditQuerySensitiveViewResult | null>(null);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: '',
  keyword: '',
  subjectType: '',
  status: '',
  createdFrom: '',
  createdTo: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳律通', value: 'lawsuit-material-assistant' }
];

const subjectTypeOptions = [
  { label: '全部主体', value: '' },
  { label: '自然人', value: 'person' },
  { label: '企业', value: 'company' }
];

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'queued' },
  { label: '已领取', value: 'claimed' },
  { label: '查询中', value: 'running' },
  { label: '待复核', value: 'result_ready' },
  { label: '已发布', value: 'published' },
  { label: '查询失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' }
];

const canManage = computed(() => auth.hasPermission('admin:legal-credit-query:manage'));

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function subjectTypeText(value: string) {
  const found = subjectTypeOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function formatJsonPreview(value: unknown | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function firstResultRecordText(value: unknown | string | null | undefined) {
  if (!value) {
    return '';
  }
  const parsed = typeof value === 'string' ? tryParseJson(value) : value;
  if (!parsed || typeof parsed !== 'object' || !('records' in parsed)) {
    return '';
  }
  const records = (parsed as { records?: unknown }).records;
  if (!Array.isArray(records) || records.length === 0) {
    return '';
  }
  return JSON.stringify(records[0], null, 2);
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function loadTasks() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalCreditQueryTasks({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      appCode: normalizedText(query.appCode),
      keyword: normalizedText(query.keyword),
      subjectType: normalizedText(query.subjectType),
      status: normalizedText(query.status),
      createdFrom: normalizedText(query.createdFrom),
      createdTo: normalizedText(query.createdTo),
      orderBy: query.orderBy,
      order: query.order
    });
    tasks.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '失信限高查询任务加载失败';
    tasks.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchTasks() {
  query.pageNo = 1;
  loadTasks();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = '';
  query.keyword = '';
  query.subjectType = '';
  query.status = '';
  query.createdFrom = '';
  query.createdTo = '';
  loadTasks();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadTasks();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadTasks();
}

async function openDetail(row: LegalCreditQueryTaskSummary) {
  detailDrawerVisible.value = true;
  detailLoading.value = true;
  detail.value = null;
  sensitiveFields.value = null;
  loadError.value = '';
  try {
    detail.value = await getLegalCreditQueryTask(row.taskId);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '失信限高查询详情加载失败';
  } finally {
    detailLoading.value = false;
  }
}

async function refreshDetail() {
  if (!detail.value?.taskId) {
    return;
  }
  await openDetail(detail.value);
}

async function publishTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value || row.status !== 'result_ready') {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await publishLegalCreditQueryTask(row.taskId, { remark: '后台复核发布' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '发布失败';
  } finally {
    actionLoading.value = false;
  }
}

async function cancelTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await cancelLegalCreditQueryTask(row.taskId, { reason: '后台人工取消' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '取消失败';
  } finally {
    actionLoading.value = false;
  }
}

async function requeueTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await requeueLegalCreditQueryTask(row.taskId, { reason: '后台重新排队' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '重排队失败';
  } finally {
    actionLoading.value = false;
  }
}

async function viewSensitiveFields() {
  if (!detail.value?.taskId) {
    return;
  }
  sensitiveLoading.value = true;
  loadError.value = '';
  try {
    sensitiveFields.value = await viewLegalCreditQuerySensitive(detail.value.taskId, { reason: '后台人工复核' });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '敏感信息查看失败';
  } finally {
    sensitiveLoading.value = false;
  }
}

onMounted(() => {
  loadTasks();
});
</script>

<template>
  <section>
    <h1 class="page-title">失信限高查询</h1>
    <p class="page-subtitle">查询任务复核、发布和异常处理。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" class="keyword-input" clearable placeholder="请求号 / 主体名称" @keyup.enter="searchTasks" />
        </el-form-item>
        <el-form-item label="主体类型">
          <el-select v-model="query.subjectType" class="subject-type-select">
            <el-option v-for="item in subjectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="status-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select">
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchTasks">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="tasks" row-key="taskId">
        <el-table-column prop="requestNo" label="请求号" min-width="168" show-overflow-tooltip />
        <el-table-column prop="subjectName" label="主体名称" min-width="140" show-overflow-tooltip />
        <el-table-column label="主体类型" width="96">
          <template #default="{ row }">{{ subjectTypeText(row.subjectType) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="104">
          <template #default="{ row }">
            <el-tag :type="getLegalCreditQueryStatusMeta(row.status).tagType" effect="plain">
              {{ getLegalCreditQueryStatusMeta(row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resultSummary" label="结果摘要" min-width="180" show-overflow-tooltip />
        <el-table-column prop="createdBy" label="创建人" width="110" show-overflow-tooltip />
        <el-table-column label="创建时间" width="172">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="172">
          <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="290" fixed="right">
          <template #default="{ row }">
            <el-button :icon="View" text type="primary" @click="openDetail(row)">查看详情</el-button>
            <el-button v-if="canManage && row.status === 'result_ready'" text type="success" :loading="actionLoading" @click="publishTask(row)">
              发布结果
            </el-button>
            <el-button v-if="canManage" text type="warning" :loading="actionLoading" @click="requeueTask(row)">重排队</el-button>
            <el-button v-if="canManage" text type="danger" :loading="actionLoading" @click="cancelTask(row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="query.pageNo"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          background
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailDrawerVisible" size="680px">
      <template #header>
        <div class="drawer-header">
          <span>查询任务详情</span>
          <el-button :icon="Refresh" :loading="detailLoading" text type="primary" @click="refreshDetail">刷新</el-button>
        </div>
      </template>
      <div v-loading="detailLoading">
        <el-empty v-if="!detail && !detailLoading" description="暂无详情" />
        <template v-if="detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="请求号">{{ detail.requestNo }}</el-descriptions-item>
            <el-descriptions-item label="主体名称">{{ detail.subjectName }}</el-descriptions-item>
            <el-descriptions-item label="主体类型">{{ subjectTypeText(detail.subjectType) }}</el-descriptions-item>
            <el-descriptions-item label="证件/统一代码">
              <span>{{ sensitiveFields?.identityNumber || detail.identityNumberMasked || '-' }}</span>
              <el-button
                v-if="!sensitiveFields"
                class="inline-action"
                text
                type="primary"
                :loading="sensitiveLoading"
                @click="viewSensitiveFields"
              >
                查看敏感信息
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="查询原因">{{ sensitiveFields?.queryReason || detail.queryReason || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getLegalCreditQueryStatusMeta(detail.status).tagType" effect="plain">
                {{ getLegalCreditQueryStatusMeta(detail.status).label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="结果摘要">{{ detail.resultSummary || detail.result?.resultSummary || '-' }}</el-descriptions-item>
            <el-descriptions-item label="来源系统">{{ detail.result?.sourceSystem || '-' }}</el-descriptions-item>
            <el-descriptions-item label="查询时间">{{ formatTime(detail.result?.queriedAt) }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">结果预览</h2>
          <pre class="json-preview">{{ firstResultRecordText(detail.result?.resultJson) || formatJsonPreview(detail.result?.resultJson) }}</pre>

          <h2 class="drawer-section-title">操作记录</h2>
          <el-table :data="detail.operationLogs" row-key="logId" size="small">
            <el-table-column prop="operationType" label="操作" width="120" />
            <el-table-column prop="operatorName" label="操作人" width="150" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
            <el-table-column label="时间" width="170">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-drawer>
  </section>
</template>

<style scoped>
.filter-panel {
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
}

.keyword-input {
  width: 220px;
}

.subject-type-select,
.status-select {
  width: 132px;
}

.app-select {
  width: 180px;
}

.error-alert {
  margin-bottom: 16px;
}

.table-panel {
  min-height: 420px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.drawer-section-title {
  margin: 20px 0 10px;
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.inline-action {
  margin-left: 8px;
}

.json-preview {
  max-height: 280px;
  overflow: auto;
  margin: 0;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f8fafc;
  color: #344054;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
