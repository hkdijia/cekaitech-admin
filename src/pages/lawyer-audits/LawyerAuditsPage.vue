<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Check, Close, Refresh, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  approveLawyerAudit,
  pageLawyerAudits,
  rejectLawyerAudit,
  type LawyerAuditItem
} from '../../api/lawyerAudits';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const loading = ref(false);
const actionLoading = ref(false);
const loadError = ref('');
const audits = ref<LawyerAuditItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: 'lawsuit-material-assistant',
  auditType: 'lawyer_professional',
  status: 'pending',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const appOptions = [
  { label: '阳律通', value: 'lawsuit-material-assistant' },
  { label: '全部小程序', value: '' }
];

const auditTypeOptions = [
  { label: '律师认证', value: 'lawyer_professional' },
  { label: '全部类型', value: '' }
];

const statusOptions = [
  { label: '待审核', value: 'pending', tagType: 'warning' },
  { label: '已通过', value: 'approved', tagType: 'success' },
  { label: '已驳回', value: 'rejected', tagType: 'danger' },
  { label: '全部状态', value: '', tagType: 'info' }
];

const canManage = computed(() => auth.hasPermission('admin:lawyer-audit:manage'));

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function auditTypeText(value: string) {
  const found = auditTypeOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

function statusMeta(value: string) {
  const found = statusOptions.find((item) => item.value === value);
  return found ?? { label: value || '-', tagType: 'info' };
}

function payloadText(row: LawyerAuditItem, fieldName: string) {
  const value = row.payload?.[fieldName];
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

async function loadAudits() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLawyerAudits({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      appCode: normalizedText(query.appCode),
      auditType: normalizedText(query.auditType),
      status: normalizedText(query.status),
      keywords: normalizedText(query.keywords),
      orderBy: query.orderBy,
      order: query.order
    });
    audits.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '律师认证审核记录加载失败';
    audits.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchAudits() {
  query.pageNo = 1;
  loadAudits();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = 'lawsuit-material-assistant';
  query.auditType = 'lawyer_professional';
  query.status = 'pending';
  query.keywords = '';
  loadAudits();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadAudits();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadAudits();
}

async function approve(row: LawyerAuditItem) {
  if (!canManage.value || row.status !== 'pending') {
    return;
  }
  const reviewNote = await promptReviewNote('通过律师认证', '材料核验通过');
  if (reviewNote === null) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await approveLawyerAudit(row.auditId, { reviewNote });
    ElMessage.success('已通过认证');
    await loadAudits();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '通过认证失败';
  } finally {
    actionLoading.value = false;
  }
}

async function reject(row: LawyerAuditItem) {
  if (!canManage.value || row.status !== 'pending') {
    return;
  }
  const reviewNote = await promptReviewNote('驳回律师认证', '材料不完整');
  if (reviewNote === null) {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await rejectLawyerAudit(row.auditId, { reviewNote });
    ElMessage.success('已驳回认证');
    await loadAudits();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '驳回认证失败';
  } finally {
    actionLoading.value = false;
  }
}

async function promptReviewNote(title: string, defaultValue: string) {
  try {
    const result = await ElMessageBox.prompt('请输入审核意见', title, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputValue: defaultValue,
      inputPattern: /^.{0,512}$/,
      inputErrorMessage: '审核意见不能超过 512 字'
    });
    return String(result.value || '').trim();
  } catch {
    return null;
  }
}

onMounted(() => {
  loadAudits();
});
</script>

<template>
  <section>
    <h1 class="page-title">律师认证审核</h1>
    <p class="page-subtitle">处理小程序用户提交的律师资质认证，认证通过后解锁专业能力。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.keywords" class="keyword-input" clearable placeholder="姓名 / 手机号 / 用户编号" @keyup.enter="searchAudits" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="status-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.auditType" class="audit-type-select">
            <el-option v-for="item in auditTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select">
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchAudits">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="audits" row-key="auditId">
        <el-table-column prop="auditId" label="ID" width="80" />
        <el-table-column prop="userCode" label="用户编号" min-width="132" show-overflow-tooltip />
        <el-table-column label="姓名" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">{{ payloadText(row, 'name') }}</template>
        </el-table-column>
        <el-table-column label="手机号" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">{{ payloadText(row, 'phone') }}</template>
        </el-table-column>
        <el-table-column label="证号/说明" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ payloadText(row, 'licenseNo') }}</template>
        </el-table-column>
        <el-table-column label="类型" width="118">
          <template #default="{ row }">{{ auditTypeText(row.auditType) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="104">
          <template #default="{ row }">
            <el-tag :type="statusMeta(row.status).tagType" effect="plain">
              {{ statusMeta(row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewNote" label="审核意见" min-width="150" show-overflow-tooltip />
        <el-table-column label="提交时间" width="172">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="审核时间" width="172">
          <template #default="{ row }">{{ formatTime(row.reviewedAt) }}</template>
        </el-table-column>
        <el-table-column v-if="canManage" label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" :icon="Check" text type="success" :loading="actionLoading" @click="approve(row)">
              通过
            </el-button>
            <el-button v-if="row.status === 'pending'" :icon="Close" text type="danger" :loading="actionLoading" @click="reject(row)">
              驳回
            </el-button>
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
  width: 230px;
}

.status-select,
.audit-type-select {
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
</style>
