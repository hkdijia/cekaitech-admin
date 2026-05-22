<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CircleClose, Plus, Refresh, Search } from '@element-plus/icons-vue';
import {
  cancelUserRestriction,
  createUserRestriction,
  pageUserRestrictions,
  type UserRestrictionItem
} from '../../api/adminUserRestrictions';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const loading = ref(false);
const loadError = ref('');
const restrictions = ref<UserRestrictionItem[]>([]);
const totalCount = ref(0);
const createDialogVisible = ref(false);
const creating = ref(false);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  order: 'desc' as const,
  userId: undefined as number | undefined,
  appCode: '',
  restrictionType: '',
  status: 'active'
});

const createForm = reactive({
  userId: undefined as number | undefined,
  appCode: '',
  restrictionType: 'all_disabled',
  reason: ''
});
const canManageRestrictions = () => auth.hasPermission('admin:user-restriction:manage');

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '生效中', value: 'active' },
  { label: '已取消', value: 'cancelled' }
];

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳光法律助手', value: 'lawsuit-material-assistant' },
  { label: '康复预约助手', value: 'rehab-appointment-miniapp' },
  { label: '每日打卡', value: 'wechat-checkin-miniapp' },
  { label: '聚会计分器', value: 'party-scorekeeper-miniapp' }
];

const createAppOptions = [{ label: '全局', value: '' }, ...appOptions.slice(1)];

const restrictionTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '禁止所有敏感动作', value: 'all_disabled' },
  { label: '禁止登录', value: 'login_disabled' },
  { label: '禁止提交审核', value: 'audit_disabled' },
  { label: '禁止表单事件采集', value: 'form_event_disabled' },
  { label: '禁止文书生成', value: 'document_generation_disabled' },
  { label: '禁止创建订单', value: 'order_creation_disabled' },
  { label: '禁止提交认证', value: 'verification_submission_disabled' },
  { label: '禁止上传文件', value: 'file_upload_disabled' },
  { label: '禁止专业查询', value: 'professional_query_disabled' }
];

function restrictionTypeText(value: string) {
  const found = restrictionTypeOptions.find((item) => item.value === value);
  return found?.label ?? value;
}

function statusType(status: string) {
  return status === 'active' ? 'danger' : 'info';
}

function statusText(status: string) {
  if (status === 'active') {
    return '生效中';
  }
  if (status === 'cancelled') {
    return '已取消';
  }
  return status;
}

function appText(appCode: string) {
  if (!appCode) {
    return '全局';
  }
  const found = appOptions.find((item) => item.value === appCode);
  return found?.label ?? appCode;
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

async function loadRestrictions() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageUserRestrictions({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      userId: query.userId,
      appCode: query.appCode,
      restrictionType: query.restrictionType,
      status: query.status
    });
    restrictions.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '限制记录加载失败';
    restrictions.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchRestrictions() {
  query.pageNo = 1;
  loadRestrictions();
}

function resetFilters() {
  query.pageNo = 1;
  query.userId = undefined;
  query.appCode = '';
  query.restrictionType = '';
  query.status = 'active';
  loadRestrictions();
}

function openCreateDialog() {
  if (!canManageRestrictions()) {
    return;
  }
  createForm.userId = undefined;
  createForm.appCode = '';
  createForm.restrictionType = 'all_disabled';
  createForm.reason = '';
  createDialogVisible.value = true;
}

async function submitCreate() {
  if (!createForm.userId || !createForm.reason.trim()) {
    loadError.value = '请填写用户ID和限制原因';
    return;
  }
  creating.value = true;
  loadError.value = '';
  try {
    await createUserRestriction({
      userId: createForm.userId,
      appCode: createForm.appCode,
      restrictionType: createForm.restrictionType,
      reason: createForm.reason.trim()
    });
    createDialogVisible.value = false;
    query.pageNo = 1;
    query.status = 'active';
    await loadRestrictions();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '限制创建失败';
  } finally {
    creating.value = false;
  }
}

async function cancelRestriction(row: UserRestrictionItem) {
  if (!canManageRestrictions()) {
    return;
  }
  loading.value = true;
  loadError.value = '';
  try {
    await cancelUserRestriction(row.id);
    await loadRestrictions();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '限制取消失败';
  } finally {
    loading.value = false;
  }
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadRestrictions();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadRestrictions();
}

onMounted(() => {
  loadRestrictions();
});
</script>

<template>
  <section>
    <h1 class="page-title">限制与黑名单</h1>
    <p class="page-subtitle">管理用户限制记录，第一阶段只维护限制，不直接修改用户主状态。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="用户ID">
          <el-input-number v-model="query.userId" class="user-id-input" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" filterable>
            <el-option v-for="item in appOptions" :key="item.label + item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.restrictionType" class="type-select">
            <el-option v-for="item in restrictionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="status-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchRestrictions">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
          <el-button v-if="canManageRestrictions()" :icon="Plus" type="success" @click="openCreateDialog">新增限制</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="restrictions" row-key="id">
        <el-table-column prop="id" label="记录ID" width="96" />
        <el-table-column prop="userId" label="用户ID" width="96" />
        <el-table-column label="小程序" min-width="150">
          <template #default="{ row }">{{ appText(row.appCode) }}</template>
        </el-table-column>
        <el-table-column label="限制类型" min-width="180">
          <template #default="{ row }">{{ restrictionTypeText(row.restrictionType) }}</template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="plain">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template #default="{ row }">{{ formatTime(row.endAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'active' && canManageRestrictions()"
              :icon="CircleClose"
              text
              type="danger"
              @click="cancelRestriction(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="query.pageNo"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalCount"
          background
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="createDialogVisible" title="新增用户限制" width="520px">
      <el-form label-width="88px">
        <el-form-item label="用户ID">
          <el-input-number v-model="createForm.userId" class="dialog-input" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="createForm.appCode" class="dialog-input" filterable>
            <el-option v-for="item in createAppOptions" :key="item.label + item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="限制类型">
          <el-select v-model="createForm.restrictionType" class="dialog-input">
            <el-option v-for="item in restrictionTypeOptions.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="createForm.reason" type="textarea" :rows="3" maxlength="120" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="submitCreate">保存</el-button>
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

.user-id-input,
.status-select {
  width: 132px;
}

.app-select {
  width: 176px;
}

.type-select {
  width: 190px;
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
</style>
