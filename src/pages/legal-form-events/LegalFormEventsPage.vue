<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import { pageLegalFormEvents, type LegalFormEventItem } from '../../api/legalFormEvents';

const loading = ref(false);
const loadError = ref('');
const events = ref<LegalFormEventItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  orderBy: 'createdAt',
  order: 'desc' as const,
  appCode: '',
  formType: '',
  qualityStatus: '',
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

async function loadEvents() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalFormEvents({
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      appCode: query.appCode,
      formType: query.formType,
      qualityStatus: query.qualityStatus,
      keywords: query.keywords.trim()
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
  query.formType = '';
  query.qualityStatus = '';
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
        <el-form-item label="表单类型">
          <el-select v-model="query.formType" class="filter-select" filterable>
            <el-option v-for="item in formTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column prop="userId" label="用户ID" width="96" />
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

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
