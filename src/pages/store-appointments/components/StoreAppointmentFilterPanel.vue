<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue';

interface StoreAppointmentFilterQuery {
  pageNo: number;
  pageSize: number;
  storeCode: string;
  projectCode: string;
  staffCode: string;
  status: string;
  appointmentDate: string;
}

interface StoreAppointmentStatusOption {
  label: string;
  value: string;
  tagType: string;
}

defineProps<{
  query: StoreAppointmentFilterQuery;
  loading: boolean;
  statusOptions: StoreAppointmentStatusOption[];
}>();

defineEmits<{
  search: [];
  reset: [];
}>();
</script>

<template>
  <el-card shadow="never" class="filter-panel">
    <el-form class="filter-form" :inline="true" @submit.prevent>
      <el-form-item label="门店">
        <el-input v-model="query.storeCode" class="code-input" clearable placeholder="storeCode" @keyup.enter="$emit('search')" />
      </el-form-item>
      <el-form-item label="项目">
        <el-input v-model="query.projectCode" class="code-input" clearable placeholder="projectCode" @keyup.enter="$emit('search')" />
      </el-form-item>
      <el-form-item label="员工">
        <el-input v-model="query.staffCode" class="code-input" clearable placeholder="staffCode" @keyup.enter="$emit('search')" />
      </el-form-item>
      <el-form-item label="预约日">
        <el-input
          v-model="query.appointmentDate"
          class="date-input"
          clearable
          placeholder="YYYY-MM-DD"
          @keyup.enter="$emit('search')"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" class="status-select">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="$emit('search')">查询</el-button>
        <el-button :icon="Refresh" @click="$emit('reset')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
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

.code-input {
  width: 140px;
}

.date-input {
  width: 140px;
}

.status-select {
  width: 120px;
}
</style>
