<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import { pageUserOperationLogs, type UserOperationLogItem } from '../../api/adminUserOperationLogs';

const loading = ref(false);
const loadError = ref('');
const logs = ref<UserOperationLogItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: '',
  operationType: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const operationTypeOptions = [
  { label: '全部', value: '' },
  { label: '用户状态变更', value: 'user_status_update' },
  { label: '服务请求状态变更', value: 'legal_service_request_status_update' },
  { label: '服务请求联系方式查看', value: 'legal_service_request_contact_view' }
];

function operationTypeText(value: string) {
  const found = operationTypeOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
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
  const userId = Number(trimmedValue);
  if (!Number.isSafeInteger(userId)) {
    return undefined;
  }
  return userId;
}

function redactPhoneText(value: string) {
  return value.replace(/\b(1[3-9]\d)\d{4}(\d{4})\b/g, '$1****$2');
}

function auditValueText(row: UserOperationLogItem, value: string) {
  if (!value) {
    return '-';
  }
  if (row.operationType !== 'legal_service_request_contact_view') {
    return value;
  }
  return redactPhoneText(value);
}

async function loadLogs() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageUserOperationLogs({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      userId: normalizedUserId(),
      operationType: normalizedText(query.operationType),
      orderBy: query.orderBy,
      order: query.order
    });
    logs.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '操作审计日志加载失败';
    logs.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchLogs() {
  query.pageNo = 1;
  loadLogs();
}

function resetFilters() {
  query.pageNo = 1;
  query.userId = '';
  query.operationType = '';
  loadLogs();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadLogs();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadLogs();
}

onMounted(() => {
  loadLogs();
});
</script>

<template>
  <section>
    <h1 class="page-title">操作审计</h1>
    <p class="page-subtitle">查询用户状态、服务请求处理和联系方式查看等后台操作日志。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="用户ID">
          <el-input v-model="query.userId" class="user-id-input" clearable placeholder="用户ID" @keyup.enter="searchLogs" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="query.operationType" class="operation-type-select" filterable>
            <el-option v-for="item in operationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchLogs">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="logs" row-key="id">
        <el-table-column prop="id" label="日志ID" width="96" />
        <el-table-column prop="userId" label="用户ID" width="110" />
        <el-table-column label="操作类型" min-width="180">
          <template #default="{ row }">
            {{ operationTypeText(row.operationType) }}
          </template>
        </el-table-column>
        <el-table-column label="Before" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ auditValueText(row, row.beforeValue) }}
          </template>
        </el-table-column>
        <el-table-column label="After" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ auditValueText(row, row.afterValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="220" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人" width="140" show-overflow-tooltip />
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

.user-id-input {
  width: 120px;
}

.operation-type-select {
  width: 230px;
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
