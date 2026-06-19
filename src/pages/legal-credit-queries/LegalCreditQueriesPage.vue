<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh, Search, View } from '@element-plus/icons-vue';
import {
  cancelLegalCreditQueryTask,
  approveLegalCreditQueryTask,
  getLegalCreditQueryTask,
  pageLegalCreditQueryTasks,
  publishLegalCreditQueryTask,
  requeueLegalCreditQueryTask,
  rejectLegalCreditQueryTask,
  viewLegalCreditQuerySensitive,
  type LegalCreditQuerySensitiveViewResult,
  type LegalCreditQueryTaskDetail,
  type LegalCreditQueryTaskSummary
} from '../../api/legalCreditQueries';
import { createMiniappAccessListEntry } from '../../api/miniappAccessList';
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
  { label: '待审核', value: 'pending_review' },
  { label: '待处理', value: 'queued' },
  { label: '已领取', value: 'claimed' },
  { label: '查询中', value: 'running' },
  { label: '待复核', value: 'result_ready' },
  { label: '已发布', value: 'published' },
  { label: '查询失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
  { label: '已拒绝', value: 'rejected' }
];

const canManage = computed(() => auth.hasPermission('admin:legal-credit-query:manage'));
const structuredResult = computed(() => buildStructuredResult(detail.value?.result?.resultJson));

interface ResultField {
  label: string;
  value: string;
}

interface ResultCase {
  key: string;
  title: string;
  fields: ResultField[];
}

interface ResultRecord {
  key: string;
  name: string;
  tags: string[];
  fields: ResultField[];
  cases: ResultCase[];
}

interface ResultGroup {
  key: string;
  title: string;
  records: ResultRecord[];
}

interface StructuredResult {
  metrics: ResultField[];
  groups: ResultGroup[];
}

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

function resultSummaryText(row: LegalCreditQueryTaskDetail) {
  return row.result?.resultSummary || row.resultSummary || '-';
}

function requesterText(row: LegalCreditQueryTaskSummary) {
  if (row.userCode) {
    return row.userCode;
  }
  if (row.userId) {
    return `用户 ${row.userId}`;
  }
  return '-';
}

function formatJsonPreview(value: unknown | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '暂无结构化结果';
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

function toRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function toArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
}

function valueText(value: unknown) {
  if (value === undefined || value === null) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean).join('、');
  }
  return `${value}`.trim();
}

function createResultField(label: string, value: unknown): ResultField | null {
  const text = valueText(value);
  if (!text) {
    return null;
  }
  return { label, value: text };
}

function compactResultFields(fields: Array<ResultField | null>) {
  return fields.filter((field): field is ResultField => Boolean(field));
}

function tagList(values: unknown, fallback: unknown) {
  if (Array.isArray(values) && values.length) {
    return values.map(valueText).filter(Boolean);
  }
  return valueText(fallback)
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function countCases(groups: ResultGroup[]) {
  return groups.reduce((sum, group) => sum + group.records.reduce((caseSum, record) => caseSum + record.cases.length, 0), 0);
}

function buildResultCase(item: Record<string, unknown>, index: string): ResultCase {
  const detailRecord = toRecord(item.detail);
  const judicial = toRecord(item.judicialDetail);
  return {
    key: `case-${index}`,
    title: valueText(judicial.title) || valueText(item.title) || valueText(item.caseNo) || `案件 ${index}`,
    fields: compactResultFields([
      createResultField('案号', item.caseNo),
      createResultField('执行法院', item.courtName || detailRecord.executionCourtName || item.court),
      createResultField('执行标的', detailRecord.executionAmount || item.amountInvolved),
      createResultField('未执行金额', detailRecord.totalNoExecAmount || detailRecord.executionNoAmount),
      createResultField('当前阶段', judicial.caseStage),
      createResultField('最新日期', judicial.lastDate || item.caseCreateTime || detailRecord.executionCaseCreateTime)
    ])
  };
}

function buildResultRecord(item: Record<string, unknown>, groupIndex: number, recordIndex: number): ResultRecord {
  const detailRecord = toRecord(item.detail);
  const cases = toArray(item.cases).slice(0, 5);
  return {
    key: `record-${groupIndex}-${recordIndex}`,
    name: valueText(item.name) || valueText(item.title) || `记录 ${recordIndex + 1}`,
    tags: tagList(item.labels, item.status),
    fields: compactResultFields([
      createResultField('证件号码', item.cardNum),
      createResultField('风险数', item.riskNum),
      createResultField('累计执行金额', detailRecord.totalExecAmount),
      createResultField('累计未执行金额', detailRecord.totalNoExecAmount),
      createResultField('简介', item.resume || item.summary)
    ]),
    cases: cases.map((caseItem, caseIndex) => buildResultCase(caseItem, `${groupIndex}-${recordIndex}-${caseIndex}`))
  };
}

function buildStructuredResult(value: unknown | string | null | undefined): StructuredResult {
  const parsed = typeof value === 'string' ? tryParseJson(value) : value;
  const root = toRecord(parsed);
  const sourceGroups = toArray(root.groups);
  const groups = sourceGroups.length
    ? sourceGroups.map((group, groupIndex) => {
        const records = toArray(group.records);
        return {
          key: `group-${groupIndex}`,
          title: `${valueText(group.label) || `分组 ${groupIndex + 1}`}记录`,
          records: records.map((record, recordIndex) => buildResultRecord(record, groupIndex, recordIndex))
        };
      }).filter((group) => group.records.length)
    : [];
  const legacyRecords = groups.length ? [] : toArray(root.records);
  const normalizedGroups = groups.length
    ? groups
    : legacyRecords.length
      ? [{
          key: 'group-legacy',
          title: '查询记录',
          records: legacyRecords.map((record, recordIndex) => buildResultRecord(record, 0, recordIndex))
        }]
      : [];
  const summary = toRecord(root.summary);
  const recordCount = normalizedGroups.reduce((sum, group) => sum + group.records.length, 0);
  return {
    metrics: compactResultFields([
      createResultField('总数', summary.totalCount || root.totalCount || recordCount),
      createResultField('主体记录', recordCount),
      createResultField('案件', countCases(normalizedGroups))
    ]),
    groups: normalizedGroups
  };
}

function firstResultRecordText(value: unknown | string | null | undefined) {
  if (!value) {
    return '';
  }
  const parsed = typeof value === 'string' ? tryParseJson(value) : value;
  if (!parsed || typeof parsed !== 'object') {
    return '';
  }
  const records = findFirstArrayValue(parsed, ['records', 'items', 'list', 'results', 'data']);
  if (!records.length) {
    return '';
  }
  return JSON.stringify(records[0], null, 2);
}

function findFirstArrayValue(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== 'object') {
    return [];
  }
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const found = record[key];
    if (Array.isArray(found)) {
      return found;
    }
  }
  for (const key of keys) {
    const nested = findFirstArrayValue(record[key], keys);
    if (nested.length) {
      return nested;
    }
  }
  return [];
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

async function approveTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value || row.status !== 'pending_review') {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await approveLegalCreditQueryTask(row.taskId, { reason: '后台审核通过并进入查询队列' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '审核通过失败';
  } finally {
    actionLoading.value = false;
  }
}

async function trustAndApproveTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value || row.status !== 'pending_review' || !row.userId || !row.identityId) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await createMiniappAccessListEntry({
      appCode: row.appCode,
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      userId: row.userId,
      identityId: row.identityId,
      reason: '失信限高查询审核通过后加入可信名单'
    });
    await approveLegalCreditQueryTask(row.taskId, { reason: '加入可信名单后审核通过并进入查询队列' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '加入可信名单并入队失败';
  } finally {
    actionLoading.value = false;
  }
}

async function rejectTask(row: LegalCreditQueryTaskSummary) {
  if (!canManage.value || row.status !== 'pending_review') {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await rejectLegalCreditQueryTask(row.taskId, { reason: '后台驳回本次查询' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '审核拒绝失败';
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
  if (!canManage.value || !canRequery(row.status)) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await requeueLegalCreditQueryTask(row.taskId, { reason: '后台重新查询' });
    await loadTasks();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '重新查询失败';
  } finally {
    actionLoading.value = false;
  }
}

function canRequery(status: string) {
  return ['failed', 'expired', 'cancelled', 'result_ready', 'published'].includes(status);
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
    <el-alert
      class="operation-hint"
      type="info"
      title="认证律师不等于可信名单；未进入可信名单的查询需后台审核。重新查询用于失败、取消、待复核或已发布任务再次进入查询队列。"
      show-icon
      :closable="false"
    />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="tasks" row-key="taskId">
        <el-table-column prop="requestNo" label="请求号" min-width="168" show-overflow-tooltip />
        <el-table-column label="发起用户" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">{{ requesterText(row) }}</template>
        </el-table-column>
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
            <el-button v-if="canManage && row.status === 'pending_review'" text type="success" :loading="actionLoading" @click="approveTask(row)">
              通过并入队
            </el-button>
            <el-button
              v-if="canManage && row.status === 'pending_review' && row.userId && row.identityId"
              text
              type="success"
              :loading="actionLoading"
              @click="trustAndApproveTask(row)"
            >
              加入可信并入队
            </el-button>
            <el-button v-if="canManage && row.status === 'pending_review'" text type="danger" :loading="actionLoading" @click="rejectTask(row)">
              驳回查询
            </el-button>
            <el-button v-if="canManage && canRequery(row.status)" text type="warning" :loading="actionLoading" @click="requeueTask(row)">重新查询</el-button>
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
            <el-descriptions-item label="发起用户">{{ requesterText(detail) }}</el-descriptions-item>
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
            <el-descriptions-item label="结果摘要">{{ resultSummaryText(detail) }}</el-descriptions-item>
            <el-descriptions-item label="来源系统">{{ detail.result?.sourceSystem || '-' }}</el-descriptions-item>
            <el-descriptions-item label="查询时间">{{ formatTime(detail.result?.queriedAt) }}</el-descriptions-item>
          </el-descriptions>

          <template v-if="structuredResult.groups.length">
            <h2 class="drawer-section-title">结果总览</h2>
            <div v-if="structuredResult.metrics.length" class="result-metrics">
              <div v-for="metric in structuredResult.metrics" :key="metric.label" class="result-metric">
                <span class="metric-label">{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </div>
            </div>
            <div v-for="group in structuredResult.groups" :key="group.key" class="result-group">
              <div class="result-group-title">{{ group.title }}</div>
              <div v-for="record in group.records" :key="record.key" class="result-record">
                <div class="result-record-header">
                  <strong>{{ record.name }}</strong>
                  <span v-if="record.cases.length" class="case-count">案件 {{ record.cases.length }}</span>
                </div>
                <div v-if="record.tags.length" class="tag-row">
                  <el-tag v-for="tag in record.tags" :key="tag" size="small" type="danger" effect="plain">{{ tag }}</el-tag>
                </div>
                <div v-if="record.fields.length" class="field-grid">
                  <div v-for="field in record.fields" :key="field.label" class="field-item">
                    <span>{{ field.label }}</span>
                    <strong>{{ field.value }}</strong>
                  </div>
                </div>
                <div v-if="record.cases.length" class="case-list">
                  <div v-for="caseItem in record.cases" :key="caseItem.key" class="case-item">
                    <div class="case-title">{{ caseItem.title }}</div>
                    <div class="field-grid compact">
                      <div v-for="field in caseItem.fields" :key="field.label" class="field-item">
                        <span>{{ field.label }}</span>
                        <strong>{{ field.value }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <h2 class="drawer-section-title">原始结果</h2>
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

.operation-hint {
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

.result-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.result-metric,
.result-record,
.case-item {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #ffffff;
}

.result-metric {
  padding: 10px;
}

.metric-label,
.field-item span {
  display: block;
  color: #667085;
  font-size: 12px;
  line-height: 1.4;
}

.result-metric strong,
.field-item strong {
  display: block;
  margin-top: 4px;
  color: #101828;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.result-group {
  margin-top: 14px;
}

.result-group-title {
  margin-bottom: 8px;
  color: #344054;
  font-size: 14px;
  font-weight: 700;
}

.result-record {
  padding: 12px;
}

.result-record + .result-record {
  margin-top: 10px;
}

.result-record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #101828;
}

.case-count {
  flex: 0 0 auto;
  color: #c2410c;
  font-size: 12px;
  font-weight: 700;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 14px;
  margin-top: 10px;
}

.field-grid.compact {
  grid-template-columns: 1fr;
}

.case-list {
  margin-top: 12px;
}

.case-item {
  padding: 10px;
  background: #f8fafc;
}

.case-item + .case-item {
  margin-top: 8px;
}

.case-title {
  color: #101828;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  word-break: break-word;
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
