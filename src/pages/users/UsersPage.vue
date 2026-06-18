<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { DataLine, EditPen, Refresh, Search, View } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { pageUserOperationLogs, type UserOperationLogItem } from '../../api/adminUserOperationLogs';
import {
  getAdminUserDetail,
  pageAdminUsers,
  seedAdminUsers,
  updateAdminUserStatus,
  type AdminUserDetail,
  type AdminUserItem
} from '../../api/adminUsers';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const route = useRoute();
const loading = ref(false);
const loadError = ref('');
const users = ref<AdminUserItem[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detailLoading = ref(false);
const detail = ref<AdminUserDetail | null>(null);
const operationLogs = ref<UserOperationLogItem[]>([]);
const operationLogLoading = ref(false);
const statusDialogVisible = ref(false);
const statusUpdating = ref(false);
const statusTarget = ref<AdminUserItem | AdminUserDetail | null>(null);

function firstQueryText(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

function isPositiveSafeIntegerText(value: string) {
  if (!/^[1-9]\d*$/.test(value)) {
    return false;
  }
  return Number.isSafeInteger(Number(value));
}

function normalizedRouteUserId() {
  const value = firstQueryText(route.query.userId).trim();
  if (!isPositiveSafeIntegerText(value)) {
    return '';
  }
  return value;
}

const routeUserId = normalizedRouteUserId();
const investigationUserId = ref(routeUserId);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  order: 'desc' as const,
  userId: routeUserId,
  keywords: '',
  status: '',
  appCode: ''
});

const statusForm = reactive({
  status: '',
  reason: ''
});

const canUpdateUserStatus = () => auth.hasPermission('admin:user:status:update');
const canSeedUsers = () => auth.hasPermission('admin:dev:seed');
const canViewOperationLogs = () => auth.hasPermission('admin:user-operation-log:view');
const investigationMessage = computed(() => {
  if (!investigationUserId.value) {
    return '';
  }
  return `用户 ID ${investigationUserId.value} 精确筛选：当前列表已按用户 ID 精确查询。`;
});

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '正常', value: 'normal' },
  { label: '受限', value: 'restricted' },
  { label: '黑名单', value: 'blacklisted' }
];

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳光法律助手', value: 'lawsuit-material-assistant' },
  { label: '康复预约助手', value: 'rehab-appointment-miniapp' },
  { label: '每日打卡', value: 'wechat-checkin-miniapp' },
  { label: '聚会计分器', value: 'party-scorekeeper-miniapp' }
];

function statusType(status: string) {
  if (status === 'blacklisted') {
    return 'danger';
  }
  if (status === 'restricted') {
    return 'warning';
  }
  return 'success';
}

function statusText(status: string) {
  const found = statusOptions.find((item) => item.value === status);
  return found?.label ?? status;
}

function operationTypeText(value: string) {
  if (value === 'user_status_update') {
    return '用户状态调整';
  }
  return value;
}

function phoneBindingText(status: string) {
  if (status === 'bound') {
    return '已绑定';
  }
  if (status === 'unbound') {
    return '未绑定';
  }
  return status || '-';
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function identityUserCode(row: { userCode?: string; identityKey?: string }) {
  return row.userCode || row.identityKey || '-';
}

function normalizedQueryUserId() {
  const value = query.userId.trim();
  if (!isPositiveSafeIntegerText(value)) {
    return undefined;
  }
  return Number(value);
}

function normalizedText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed;
}

async function loadUsers() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageAdminUsers({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      userId: normalizedQueryUserId(),
      keywords: normalizedText(query.keywords),
      status: normalizedText(query.status),
      appCode: normalizedText(query.appCode)
    });
    users.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '用户列表加载失败';
    users.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function refreshInvestigationState() {
  if (!investigationUserId.value) {
    return;
  }
  if (query.userId.trim() === investigationUserId.value) {
    return;
  }
  investigationUserId.value = '';
}

function searchUsers() {
  query.pageNo = 1;
  refreshInvestigationState();
  loadUsers();
}

function resetFilters() {
  query.pageNo = 1;
  query.userId = '';
  query.keywords = '';
  query.status = '';
  query.appCode = '';
  investigationUserId.value = '';
  loadUsers();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadUsers();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadUsers();
}

async function openDetail(row: AdminUserItem) {
  detailDrawerVisible.value = true;
  detailLoading.value = true;
  detail.value = null;
  operationLogs.value = [];
  try {
    detail.value = await getAdminUserDetail(row.id);
    if (canViewOperationLogs()) {
      await loadOperationLogs(row.id);
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '用户详情加载失败';
  } finally {
    detailLoading.value = false;
  }
}

async function loadOperationLogs(userId: number) {
  operationLogLoading.value = true;
  try {
    const result = await pageUserOperationLogs({
      pageNo: 1,
      pageSize: 5,
      orderBy: 'createdAt',
      order: 'desc',
      userId,
      operationType: ''
    });
    operationLogs.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '操作记录加载失败';
    operationLogs.value = [];
  } finally {
    operationLogLoading.value = false;
  }
}

async function seedUsers() {
  if (!canSeedUsers()) {
    return;
  }
  loading.value = true;
  loadError.value = '';
  try {
    await seedAdminUsers();
    query.pageNo = 1;
    await loadUsers();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '演示数据生成失败';
  } finally {
    loading.value = false;
  }
}

function openStatusDialog(row: AdminUserItem | AdminUserDetail) {
  if (!canUpdateUserStatus()) {
    return;
  }
  statusTarget.value = row;
  statusForm.status = row.status;
  statusForm.reason = '';
  statusDialogVisible.value = true;
}

async function submitStatusUpdate() {
  if (!statusTarget.value || !statusForm.status || !statusForm.reason.trim()) {
    loadError.value = '请选择目标状态并填写调整原因';
    return;
  }
  statusUpdating.value = true;
  loadError.value = '';
  try {
    const updated = await updateAdminUserStatus({
      userId: statusTarget.value.id,
      status: statusForm.status,
      reason: statusForm.reason.trim()
    });
    statusDialogVisible.value = false;
    if (detail.value && detail.value.id === updated.id) {
      detail.value = updated;
      if (canViewOperationLogs()) {
        await loadOperationLogs(updated.id);
      }
    }
    await loadUsers();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '用户状态调整失败';
  } finally {
    statusUpdating.value = false;
  }
}

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <section>
    <h1 class="page-title">用户管理</h1>
    <p class="page-subtitle">查看统一用户、小程序身份和手机号绑定状态。</p>

    <el-alert
      v-if="investigationMessage"
      class="investigation-alert"
      type="info"
      :title="investigationMessage"
      :closable="false"
      show-icon
    />

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            class="keyword-input"
            clearable
            placeholder="手机号 / unionId / openid"
            @keyup.enter="searchUsers"
          />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="query.userId"
            class="user-id-input"
            clearable
            placeholder="精确用户ID"
            @keyup.enter="searchUsers"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="filter-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" filterable>
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchUsers">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
          <el-button v-if="canSeedUsers()" :icon="DataLine" @click="seedUsers">生成演示数据</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="users" row-key="id">
        <el-table-column prop="id" label="用户ID" width="96" />
        <el-table-column label="手机号" min-width="140">
          <template #default="{ row }">
            {{ row.primaryPhone || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="unionId" label="UnionID" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" effect="plain">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="appCode" label="来源小程序" min-width="190" show-overflow-tooltip />
        <el-table-column prop="providerUserId" label="OpenID" min-width="190" show-overflow-tooltip />
        <el-table-column label="手机号授权" width="120">
          <template #default="{ row }">
            {{ phoneBindingText(row.phoneBindingStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="130" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="176" fixed="right">
          <template #default="{ row }">
            <el-button :icon="View" text type="primary" @click="openDetail(row)">详情</el-button>
            <el-button v-if="canUpdateUserStatus()" :icon="EditPen" text type="warning" @click="openStatusDialog(row)">状态</el-button>
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

    <el-drawer v-model="detailDrawerVisible" title="用户详情" size="720px">
      <div v-loading="detailLoading">
        <el-empty v-if="!detail && !detailLoading" description="暂无详情" />
        <template v-if="detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户ID">{{ detail.id }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ detail.primaryPhone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="UnionID">{{ detail.unionId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="statusType(detail.status)" effect="plain">{{ statusText(detail.status) }}</el-tag>
              <el-button
                v-if="canUpdateUserStatus()"
                class="drawer-status-button"
                :icon="EditPen"
                text
                type="warning"
                @click="openStatusDialog(detail)"
              >
                调整
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatTime(detail.createdAt) }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">小程序身份</h2>
          <el-table :data="detail.identities" size="small">
            <el-table-column prop="appCode" label="小程序" min-width="170" show-overflow-tooltip />
            <el-table-column label="用户编号" min-width="140" show-overflow-tooltip>
              <template #default="{ row }">{{ identityUserCode(row) }}</template>
            </el-table-column>
            <el-table-column prop="providerUserId" label="OpenID" min-width="170" show-overflow-tooltip />
            <el-table-column prop="phoneBindingStatus" label="授权" width="88">
              <template #default="{ row }">{{ phoneBindingText(row.phoneBindingStatus) }}</template>
            </el-table-column>
            <el-table-column prop="role" label="角色" width="120" />
          </el-table>

          <h2 class="drawer-section-title">手机号记录</h2>
          <el-table :data="detail.phones" size="small">
            <el-table-column prop="phone" label="手机号" min-width="140" />
            <el-table-column prop="sourceAppCode" label="来源" min-width="170" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100" />
          </el-table>

          <h2 v-if="canViewOperationLogs()" class="drawer-section-title">操作记录</h2>
          <el-table v-if="canViewOperationLogs()" v-loading="operationLogLoading" :data="operationLogs" size="small">
            <el-table-column label="操作" width="116">
              <template #default="{ row }">{{ operationTypeText(row.operationType) }}</template>
            </el-table-column>
            <el-table-column label="变更" min-width="150">
              <template #default="{ row }">
                {{ statusText(row.beforeValue) }} -> {{ statusText(row.afterValue) }}
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" min-width="140" show-overflow-tooltip />
            <el-table-column prop="operatorName" label="操作人" width="110" />
            <el-table-column label="时间" width="160">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-drawer>

    <el-dialog v-model="statusDialogVisible" title="调整用户状态" width="520px">
      <el-form label-width="88px">
        <el-form-item label="用户ID">
          <span>{{ statusTarget?.id ?? '-' }}</span>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag v-if="statusTarget" :type="statusType(statusTarget.status)" effect="plain">
            {{ statusText(statusTarget.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="目标状态">
          <el-select v-model="statusForm.status" class="dialog-input">
            <el-option v-for="item in statusOptions.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="statusForm.reason" type="textarea" :rows="3" maxlength="120" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="statusUpdating" @click="submitStatusUpdate">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.filter-panel {
  margin-bottom: 16px;
}

.investigation-alert {
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
}

.keyword-input {
  width: 240px;
}

.user-id-input {
  width: 150px;
}

.filter-select {
  width: 132px;
}

.app-select {
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

.drawer-section-title {
  margin: 20px 0 10px;
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.drawer-status-button {
  margin-left: 8px;
}

.dialog-input {
  width: 100%;
}
</style>
