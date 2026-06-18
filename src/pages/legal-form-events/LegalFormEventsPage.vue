<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search, View } from '@element-plus/icons-vue';
import { pageLegalFormEvents, type LegalFormEventItem } from '../../api/legalFormEvents';
import { getAdminUserDetail, type AdminUserDetail } from '../../api/adminUsers';

const loading = ref(false);
const loadError = ref('');
const events = ref<LegalFormEventItem[]>([]);
const totalCount = ref(0);
const userDetailDrawerVisible = ref(false);
const userDetailLoading = ref(false);
const userDetail = ref<AdminUserDetail | null>(null);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  order: 'desc' as const,
  appCode: '',
  userId: '',
  formType: '',
  qualityStatus: '',
  eventType: '',
  keywords: ''
});

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳光法律助手', value: 'lawsuit-material-assistant' }
];

const formTypeOptions = [
  { label: '全部表单', value: '' },
  { label: '民间借贷', value: 'private_lending' },
  { label: '离婚协议', value: 'divorce_agreement' },
  { label: '通用模板', value: 'generic_template' }
];

const eventTypeOptions = [
  { label: '全部事件', value: '' },
  { label: '表单提交', value: 'form_submit' }
];

const qualityStatusOptions = [
  { label: '全部质量', value: '' },
  { label: '有效', value: 'valid' },
  { label: '低价值', value: 'low_value' }
];

function formTypeText(value: string) {
  const found = formTypeOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

function qualityStatusText(value: string) {
  const found = qualityStatusOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

function qualityStatusType(value: string) {
  if (value === 'valid') {
    return 'success';
  }
  if (value === 'incomplete') {
    return 'warning';
  }
  if (value === 'invalid') {
    return 'danger';
  }
  return 'info';
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function normalizedText(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return undefined;
  }
  return trimmedValue;
}

function normalizedUserId() {
  const trimmedValue = query.userId.trim();
  if (!trimmedValue) {
    return undefined;
  }
  if (!/^[1-9]\d*$/.test(trimmedValue)) {
    return undefined;
  }
  return Number(trimmedValue);
}

async function loadEvents() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalFormEvents({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      appCode: normalizedText(query.appCode),
      userId: normalizedUserId(),
      formType: normalizedText(query.formType),
      qualityStatus: normalizedText(query.qualityStatus),
      eventType: normalizedText(query.eventType),
      keywords: normalizedText(query.keywords)
    });
    events.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '法律表单事件加载失败';
    events.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchEvents() {
  query.pageNo = 1;
  loadEvents();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = '';
  query.userId = '';
  query.formType = '';
  query.qualityStatus = '';
  query.eventType = '';
  query.keywords = '';
  loadEvents();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadEvents();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadEvents();
}

function openUserInvestigation(userId: number) {
  if (!userId) {
    return;
  }
  userDetailDrawerVisible.value = true;
  userDetailLoading.value = true;
  userDetail.value = null;
  loadError.value = '';
  getAdminUserDetail(userId)
    .then((result) => {
      userDetail.value = result;
    })
    .catch((error) => {
      loadError.value = error instanceof Error ? error.message : '用户详情加载失败';
    })
    .finally(() => {
      userDetailLoading.value = false;
    });
}

onMounted(() => {
  loadEvents();
});
</script>

<template>
  <section>
    <h1 class="page-title">法律表单事件</h1>
    <p class="page-subtitle">查看法律表单填写事件、质量状态和 payload 预览。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            class="keyword-input"
            clearable
            placeholder="事件ID / 事件类型 / payload"
            @keyup.enter="searchEvents"
          />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="query.userId" class="user-id-input" clearable placeholder="用户ID" @keyup.enter="searchEvents" />
        </el-form-item>
        <el-form-item label="表单类型">
          <el-select v-model="query.formType" class="filter-select" filterable>
            <el-option v-for="item in formTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="query.eventType" class="filter-select" filterable>
            <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="质量状态">
          <el-select v-model="query.qualityStatus" class="filter-select">
            <el-option v-for="item in qualityStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" filterable>
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchEvents">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="events" row-key="id">
        <el-table-column prop="id" label="事件ID" width="96" />
        <el-table-column label="用户ID" width="150">
          <template #default="{ row }">
            <div class="user-id-cell">
              <span>{{ row.userId }}</span>
              <el-button :icon="View" text type="primary" @click="openUserInvestigation(row.userId)">查看用户</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="identityId" label="身份ID" width="96" />
        <el-table-column prop="appCode" label="小程序" min-width="190" show-overflow-tooltip />
        <el-table-column prop="clientEventId" label="客户端事件ID" min-width="180" show-overflow-tooltip />
        <el-table-column prop="eventType" label="事件类型" width="130" show-overflow-tooltip />
        <el-table-column label="表单类型" min-width="140">
          <template #default="{ row }">
            {{ formTypeText(row.formType) }}
          </template>
        </el-table-column>
        <el-table-column label="质量状态" width="112">
          <template #default="{ row }">
            <el-tag :type="qualityStatusType(row.qualityStatus)" effect="plain">
              {{ qualityStatusText(row.qualityStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="filledFieldCount" label="字段数" width="88" />
        <el-table-column prop="payloadPreview" label="Payload 预览" min-width="260" show-overflow-tooltip />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
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

    <el-drawer v-model="userDetailDrawerVisible" title="用户详情" size="720px">
      <div v-loading="userDetailLoading">
        <el-empty v-if="!userDetail && !userDetailLoading" description="暂无用户详情" />
        <template v-if="userDetail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户ID">{{ userDetail.id }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userDetail.primaryPhone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="UnionID">{{ userDetail.unionId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ userDetail.status || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatTime(userDetail.createdAt) }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">小程序身份</h2>
          <el-table :data="userDetail.identities" size="small">
            <el-table-column prop="appCode" label="小程序" min-width="170" show-overflow-tooltip />
            <el-table-column prop="providerUserId" label="OpenID" min-width="170" show-overflow-tooltip />
            <el-table-column prop="phoneBindingStatus" label="授权" width="88" />
            <el-table-column prop="role" label="角色" width="120" />
          </el-table>

          <h2 class="drawer-section-title">手机号记录</h2>
          <el-table :data="userDetail.phones" size="small">
            <el-table-column prop="phone" label="手机号" min-width="140" />
            <el-table-column prop="sourceAppCode" label="来源" min-width="170" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100" />
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
  width: 240px;
}

.user-id-input {
  width: 120px;
}

.filter-select {
  width: 150px;
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

.user-id-cell {
  display: flex;
  align-items: center;
  gap: 4px;
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
</style>
