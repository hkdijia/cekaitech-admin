<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import { pageGenerationRecords, type GenerationRecordItem } from '../../api/generationRecords';
import {
  generationRecordTypeOptions,
  generationRecordTypeText,
  generationStatusOptions,
  generationStatusTagType,
  generationStatusText
} from './generationRecordOptions';

const loading = ref(false);
const loadError = ref('');
const records = ref<GenerationRecordItem[]>([]);
const totalCount = ref(0);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: '',
  userId: '',
  status: '',
  recordType: '',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳光法律助手', value: 'lawsuit-material-assistant' }
];

const statusOptions = generationStatusOptions;
const recordTypeOptions = generationRecordTypeOptions;

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function normalizedUserId() {
  if (!query.userId.trim()) {
    return undefined;
  }
  return Number(query.userId);
}

async function loadRecords() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageGenerationRecords({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      appCode: query.appCode,
      userId: normalizedUserId(),
      status: query.status,
      recordType: query.recordType,
      keywords: query.keywords.trim(),
      orderBy: query.orderBy,
      order: query.order
    });
    records.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '生成记录加载失败';
    records.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchRecords() {
  query.pageNo = 1;
  loadRecords();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = '';
  query.userId = '';
  query.status = '';
  query.recordType = '';
  query.keywords = '';
  loadRecords();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadRecords();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadRecords();
}

onMounted(() => {
  loadRecords();
});
</script>

<template>
  <section>
    <h1 class="page-title">生成记录</h1>
    <p class="page-subtitle">查看法律助手小程序云端生成记录。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            class="keyword-input"
            clearable
            placeholder="客户端记录ID / 标题 / 摘要"
            @keyup.enter="searchRecords"
          />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="query.userId" class="user-id-input" clearable placeholder="用户ID" @keyup.enter="searchRecords" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="filter-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录类型">
          <el-select v-model="query.recordType" class="filter-select" filterable>
            <el-option v-for="item in recordTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" filterable>
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchRecords">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="records" row-key="id">
        <el-table-column prop="userId" label="用户ID" width="96" />
        <el-table-column prop="identityId" label="身份ID" width="96" />
        <el-table-column prop="appCode" label="小程序" min-width="190" show-overflow-tooltip />
        <el-table-column prop="clientRecordId" label="客户端记录ID" min-width="180" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            {{ generationRecordTypeText(row.recordType) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="generationStatusTagType(row.status)" effect="plain">{{ generationStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resultSummary" label="摘要" min-width="260" show-overflow-tooltip />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.updatedAt) }}
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
  width: 240px;
}

.user-id-input {
  width: 120px;
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
