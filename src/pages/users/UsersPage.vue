<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import { pageAdminUsers, type AdminUserItem } from '../../api/adminUsers';

const loading = ref(false);
const loadError = ref('');
const users = ref<AdminUserItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  order: 'desc' as const,
  keywords: '',
  status: '',
  appCode: ''
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

async function loadUsers() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageAdminUsers({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      keywords: query.keywords.trim(),
      status: query.status,
      appCode: query.appCode
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

function searchUsers() {
  query.pageNo = 1;
  loadUsers();
}

function resetFilters() {
  query.pageNo = 1;
  query.keywords = '';
  query.status = '';
  query.appCode = '';
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

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <section>
    <h1 class="page-title">用户管理</h1>
    <p class="page-subtitle">查看统一用户、小程序身份和手机号绑定状态。</p>

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
</style>
