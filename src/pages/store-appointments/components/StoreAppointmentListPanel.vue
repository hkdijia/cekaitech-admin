<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import type { StoreAppointmentItem } from '../../../api/storeAppointments';

defineProps<{
  appointments: StoreAppointmentItem[];
  loading: boolean;
  pageNo: number;
  pageSize: number;
  totalCount: number;
}>();

defineEmits<{
  'open-detail': [row: StoreAppointmentItem];
  'page-change': [pageNo: number];
  'size-change': [pageSize: number];
}>();

const statusOptions = [
  { label: '全部状态', value: '', tagType: 'info' },
  { label: '待确认', value: 'pending', tagType: 'warning' },
  { label: '已确认', value: 'confirmed', tagType: 'primary' },
  { label: '已到店', value: 'arrived', tagType: 'success' },
  { label: '已完成', value: 'completed', tagType: 'success' },
  { label: '已取消', value: 'cancelled', tagType: 'info' }
];

function statusMeta(value: string) {
  const found = statusOptions.find((item) => item.value === value);
  return found ?? { label: value || '-', tagType: 'info' };
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}
</script>

<template>
  <el-card shadow="never" class="table-panel">
    <el-table v-loading="loading" :data="appointments" row-key="appointmentId">
      <el-table-column prop="appointmentId" label="预约ID" width="96" />
      <el-table-column prop="storeName" label="门店" min-width="150" show-overflow-tooltip />
      <el-table-column prop="projectName" label="项目" min-width="130" show-overflow-tooltip />
      <el-table-column prop="staffName" label="员工" width="110" show-overflow-tooltip />
      <el-table-column prop="customerDisplayName" label="客户" width="110" show-overflow-tooltip />
      <el-table-column label="预约时间" width="150">
        <template #default="{ row }">{{ row.appointmentDate }} {{ row.timeSlot }}</template>
      </el-table-column>
      <el-table-column label="状态" width="108">
        <template #default="{ row }">
          <el-tag :type="statusMeta(row.status).tagType" effect="plain">{{ statusMeta(row.status).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
      <el-table-column label="更新时间" width="172">
        <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="116" fixed="right">
        <template #default="{ row }">
          <el-button :icon="View" text type="primary" @click="$emit('open-detail', row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-bar">
      <el-pagination
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        background
        layout="total, sizes, prev, pager, next"
        @current-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
      />
    </div>
  </el-card>
</template>

<style scoped>
.table-panel {
  min-height: 420px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
