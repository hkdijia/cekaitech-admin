<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { CircleClose, Plus, Refresh, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  createMiniappAccessListEntry,
  disableMiniappAccessListEntry,
  importApprovedLawyersToAccessList,
  pageApprovedLawyerAccessListCandidates,
  pageMiniappAccessListEntries,
  type MiniappAccessListCandidate,
  type MiniappAccessListEntry
} from '../../api/miniappAccessList';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const loading = ref(false);
const actionLoading = ref(false);
const loadError = ref('');
const entries = ref<MiniappAccessListEntry[]>([]);
const totalCount = ref(0);
const createDialogVisible = ref(false);
const candidateDialogVisible = ref(false);
const candidateLoading = ref(false);
const candidates = ref<MiniappAccessListCandidate[]>([]);
const candidateTotalCount = ref(0);
const selectedCandidates = ref<MiniappAccessListCandidate[]>([]);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: 'lawsuit-material-assistant',
  capabilityCode: 'legal_credit_query',
  listType: '',
  status: 'active',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const createForm = reactive({
  listType: 'allow' as 'allow' | 'deny',
  userId: undefined as number | undefined,
  identityId: undefined as number | undefined,
  reason: ''
});

const candidateQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  keywords: ''
});

const appOptions = [
  { label: '阳律通', value: 'lawsuit-material-assistant' }
];

const capabilityOptions = [
  { label: '失信限高查询', value: 'legal_credit_query' }
];

const listTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '允许', value: 'allow' },
  { label: '拒绝', value: 'deny' }
];

const statusOptions = [
  { label: '生效中', value: 'active' },
  { label: '已停用', value: 'disabled' },
  { label: '全部状态', value: '' }
];

const canManage = computed(() => auth.hasPermission('admin:miniapp-access-list:manage'));

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function listTypeText(value: string) {
  if (value === 'allow') {
    return '允许';
  }
  if (value === 'deny') {
    return '拒绝';
  }
  return value || '-';
}

function listTypeTag(value: string) {
  return value === 'deny' ? 'danger' : 'success';
}

function statusText(value: string) {
  if (value === 'active') {
    return '生效中';
  }
  if (value === 'disabled') {
    return '已停用';
  }
  return value || '-';
}

function statusTag(value: string) {
  return value === 'active' ? 'success' : 'info';
}

function sourceTypeText(value: string) {
  if (value === 'manual') {
    return '手工加入';
  }
  if (value === 'approved_lawyer_import') {
    return '已通过律师导入';
  }
  return value || '-';
}

function appText(value: string) {
  return appOptions.find((item) => item.value === value)?.label ?? value;
}

function capabilityText(value: string) {
  return capabilityOptions.find((item) => item.value === value)?.label ?? value;
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

async function loadEntries() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappAccessListEntries({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      appCode: normalizedText(query.appCode),
      capabilityCode: normalizedText(query.capabilityCode),
      listType: normalizedText(query.listType),
      status: normalizedText(query.status),
      keywords: normalizedText(query.keywords),
      orderBy: query.orderBy,
      order: query.order
    });
    entries.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '名单记录加载失败';
    entries.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchEntries() {
  query.pageNo = 1;
  loadEntries();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = 'lawsuit-material-assistant';
  query.capabilityCode = 'legal_credit_query';
  query.listType = '';
  query.status = 'active';
  query.keywords = '';
  loadEntries();
}

function openCreateDialog() {
  if (!canManage.value) {
    return;
  }
  createForm.listType = 'allow';
  createForm.userId = undefined;
  createForm.identityId = undefined;
  createForm.reason = '';
  createDialogVisible.value = true;
}

async function submitCreate() {
  if (!createForm.userId || !createForm.identityId || !createForm.reason.trim()) {
    loadError.value = '请填写用户ID、身份ID和原因';
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await createMiniappAccessListEntry({
      appCode: query.appCode,
      capabilityCode: query.capabilityCode,
      listType: createForm.listType,
      userId: createForm.userId,
      identityId: createForm.identityId,
      reason: createForm.reason.trim()
    });
    createDialogVisible.value = false;
    query.pageNo = 1;
    query.status = 'active';
    await loadEntries();
    ElMessage.success('名单已保存');
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '名单保存失败';
  } finally {
    actionLoading.value = false;
  }
}

async function disableEntry(row: MiniappAccessListEntry) {
  if (!canManage.value || row.status !== 'active') {
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    await disableMiniappAccessListEntry(row.entryId, { reason: '后台停用名单记录' });
    await loadEntries();
    ElMessage.success('名单已停用');
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '名单停用失败';
  } finally {
    actionLoading.value = false;
  }
}

async function loadCandidates() {
  candidateLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageApprovedLawyerAccessListCandidates({
      pageNo: candidateQuery.pageNo,
      pageSize: candidateQuery.pageSize,
      appCode: query.appCode,
      capabilityCode: query.capabilityCode,
      keywords: normalizedText(candidateQuery.keywords)
    });
    candidates.value = result.dataList;
    candidateTotalCount.value = result.totalCount;
    selectedCandidates.value = [];
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '候选律师加载失败';
    candidates.value = [];
    candidateTotalCount.value = 0;
  } finally {
    candidateLoading.value = false;
  }
}

function openCandidateDialog() {
  if (!canManage.value) {
    return;
  }
  candidateQuery.pageNo = 1;
  candidateQuery.keywords = '';
  candidateDialogVisible.value = true;
  loadCandidates();
}

function handleCandidateSelectionChange(rows: MiniappAccessListCandidate[]) {
  selectedCandidates.value = rows;
}

async function importSelectedCandidates() {
  if (!canManage.value || selectedCandidates.value.length === 0) {
    loadError.value = '请先选择要导入的律师';
    return;
  }
  actionLoading.value = true;
  loadError.value = '';
  try {
    const result = await importApprovedLawyersToAccessList({
      appCode: query.appCode,
      capabilityCode: query.capabilityCode,
      reason: '从已通过律师认证导入失信限高可信名单',
      auditIds: selectedCandidates.value.map((item) => item.auditId)
    });
    candidateDialogVisible.value = false;
    await loadEntries();
    ElMessage.success(`导入 ${result.importedCount} 条，跳过 ${result.skippedCount} 条`);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '导入已通过律师失败';
  } finally {
    actionLoading.value = false;
  }
}

function handleCandidatePageChange(pageNo: number) {
  candidateQuery.pageNo = pageNo;
  loadCandidates();
}

function handleCandidateSizeChange(pageSize: number) {
  candidateQuery.pageNo = 1;
  candidateQuery.pageSize = pageSize;
  loadCandidates();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadEntries();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadEntries();
}

onMounted(() => {
  loadEntries();
});
</script>

<template>
  <section>
    <h1 class="page-title">小程序名单管理</h1>
    <p class="page-subtitle">维护小程序能力的可信名单和拒绝名单；失信限高查询的可信用户可免人工审核进入查询队列。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="query.keywords" class="keyword-input" clearable placeholder="用户编号 / 用户ID / 身份ID" @keyup.enter="searchEntries" />
        </el-form-item>
        <el-form-item label="名单类型">
          <el-select v-model="query.listType" class="list-type-select">
            <el-option v-for="item in listTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="能力">
          <el-select v-model="query.capabilityCode" class="capability-select">
            <el-option v-for="item in capabilityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchEntries">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
          <el-button v-if="canManage" :icon="Plus" type="success" @click="openCreateDialog">新增名单</el-button>
          <el-button v-if="canManage" :icon="Upload" :loading="actionLoading" @click="openCandidateDialog">选择导入律师</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="entries" row-key="entryId">
        <el-table-column prop="entryId" label="ID" width="80" />
        <el-table-column prop="userCode" label="用户编号" min-width="132" show-overflow-tooltip />
        <el-table-column prop="userId" label="用户ID" width="96" />
        <el-table-column prop="identityId" label="身份ID" width="96" />
        <el-table-column label="名单类型" width="104">
          <template #default="{ row }">
            <el-tag :type="listTypeTag(row.listType)" effect="plain">{{ listTypeText(row.listType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="104">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="plain">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="小程序" min-width="120">
          <template #default="{ row }">{{ appText(row.appCode) }}</template>
        </el-table-column>
        <el-table-column label="能力" min-width="130">
          <template #default="{ row }">{{ capabilityText(row.capabilityCode) }}</template>
        </el-table-column>
        <el-table-column label="来源" width="132">
          <template #default="{ row }">{{ sourceTypeText(row.sourceType) }}</template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="180" show-overflow-tooltip />
        <el-table-column label="创建时间" width="172">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="停用原因" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.disabledReason || '-' }}</template>
        </el-table-column>
        <el-table-column v-if="canManage" label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'active'"
              :icon="CircleClose"
              text
              type="danger"
              :loading="actionLoading"
              @click="disableEntry(row)"
            >
              停用
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

    <el-dialog v-model="createDialogVisible" title="新增名单记录" width="520px">
      <el-form label-width="88px">
        <el-form-item label="名单类型">
          <el-select v-model="createForm.listType" class="dialog-input">
            <el-option label="允许" value="allow" />
            <el-option label="拒绝" value="deny" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input-number v-model="createForm.userId" class="dialog-input" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="身份ID">
          <el-input-number v-model="createForm.identityId" class="dialog-input" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="createForm.reason" type="textarea" :rows="3" maxlength="512" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="submitCreate">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="candidateDialogVisible" title="选择已认证律师导入白名单" width="760px">
      <div class="candidate-toolbar">
        <el-input
          v-model="candidateQuery.keywords"
          class="candidate-keyword"
          clearable
          placeholder="姓名 / 手机号 / 执业证"
          @keyup.enter="loadCandidates"
        />
        <el-button :icon="Search" :loading="candidateLoading" @click="loadCandidates">查询</el-button>
      </div>
      <el-table
        v-loading="candidateLoading"
        :data="candidates"
        row-key="auditId"
        @selection-change="handleCandidateSelectionChange"
      >
        <el-table-column type="selection" width="48" />
        <el-table-column prop="userCode" label="用户编号" width="132" show-overflow-tooltip />
        <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="132" show-overflow-tooltip />
        <el-table-column prop="licenseNo" label="执业证号" min-width="160" show-overflow-tooltip />
        <el-table-column label="通过时间" width="172">
          <template #default="{ row }">{{ formatTime(row.reviewedAt) }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="candidateQuery.pageNo"
          v-model:page-size="candidateQuery.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="candidateTotalCount"
          background
          layout="total, sizes, prev, pager, next"
          @current-change="handleCandidatePageChange"
          @size-change="handleCandidateSizeChange"
        />
      </div>
      <template #footer>
        <el-button @click="candidateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="importSelectedCandidates">导入所选</el-button>
      </template>
    </el-dialog>
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

.list-type-select,
.status-select {
  width: 124px;
}

.app-select {
  width: 136px;
}

.capability-select {
  width: 150px;
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

.dialog-input {
  width: 100%;
}

.candidate-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.candidate-keyword {
  width: 260px;
}
</style>
