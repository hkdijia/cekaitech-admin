<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import type { StoreAppointmentItem } from '../../../api/storeAppointments';
import { formatStoreAppointmentTime, storeAppointmentStatusMeta } from './storeAppointmentDisplayUtils';

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
          <el-tag :type="storeAppointmentStatusMeta(row.status).tagType" effect="plain">{{ storeAppointmentStatusMeta(row.status).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
      <el-table-column label="更新时间" width="172">
        <template #default="{ row }">{{ formatStoreAppointmentTime(row.updatedAt) }}</template>
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
