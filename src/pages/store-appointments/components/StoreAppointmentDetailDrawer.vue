<script setup lang="ts">
import { Check, Close, Finished } from '@element-plus/icons-vue';
import type { StoreAppointmentDetail } from '../../../api/storeAppointments';
import {
  formatStoreAppointmentStatusTransition,
  formatStoreAppointmentTime,
  storeAppointmentStatusMeta
} from './storeAppointmentDisplayUtils';
import { getStoreAppointmentStatusActions } from './storeAppointmentStatusActionUtils';

const props = defineProps<{
  visible: boolean;
  detail: StoreAppointmentDetail | null;
  detailLoading: boolean;
  statusUpdating: boolean;
  canManageStatus: boolean;
}>();

defineEmits<{
  'update:visible': [visible: boolean];
  'update-status': [status: string];
}>();

function statusActions(status: string) {
  return getStoreAppointmentStatusActions(status, props.canManageStatus);
}

function statusActionIcon(iconKey: string) {
  if (iconKey === 'close') {
    return Close;
  }
  if (iconKey === 'finished') {
    return Finished;
  }
  return Check;
}
</script>

<template>
  <el-drawer :model-value="visible" size="720px" title="预约详情" @update:model-value="$emit('update:visible', $event)">
    <div v-loading="detailLoading">
      <el-empty v-if="!detail && !detailLoading" description="暂无详情" />
      <template v-if="detail">
        <el-alert
          class="readonly-alert"
          type="info"
          title="本页只处理预约状态流转；核销、支付、会员和客户资料暂不在本页处理。"
          show-icon
        />
        <div v-if="statusActions(detail.appointment.status).length > 0" class="status-action-bar">
          <el-button
            v-for="action in statusActions(detail.appointment.status)"
            :key="action.status"
            :icon="statusActionIcon(action.iconKey)"
            :loading="statusUpdating"
            :type="action.type"
            @click="$emit('update-status', action.status)"
          >
            {{ action.label }}
          </el-button>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="预约ID">{{ detail.appointment.appointmentId }}</el-descriptions-item>
          <el-descriptions-item label="门店">{{ detail.appointment.storeName }} / {{ detail.appointment.storeCode }}</el-descriptions-item>
          <el-descriptions-item label="项目">{{ detail.appointment.projectName }} / {{ detail.appointment.projectCode }}</el-descriptions-item>
          <el-descriptions-item label="员工">{{ detail.appointment.staffName }} / {{ detail.appointment.staffCode }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ detail.appointment.customerDisplayName }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ detail.appointment.customerContact }}</el-descriptions-item>
          <el-descriptions-item label="预约时间">
            {{ detail.appointment.appointmentDate }} {{ detail.appointment.timeSlot }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="storeAppointmentStatusMeta(detail.appointment.status).tagType" effect="plain">
              {{ storeAppointmentStatusMeta(detail.appointment.status).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{ detail.appointment.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatStoreAppointmentTime(detail.appointment.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatStoreAppointmentTime(detail.appointment.updatedAt) }}</el-descriptions-item>
        </el-descriptions>

        <h2 class="drawer-section-title">状态日志</h2>
        <el-table :data="detail.statusLogs" row-key="createdAt" size="small">
          <el-table-column label="流转" min-width="150">
            <template #default="{ row }">{{ formatStoreAppointmentStatusTransition(row.fromStatus, row.toStatus) }}</template>
          </el-table-column>
          <el-table-column prop="operatorType" label="操作方" width="96" />
          <el-table-column prop="operatorId" label="操作人" min-width="140" show-overflow-tooltip />
          <el-table-column label="时间" width="172">
            <template #default="{ row }">{{ formatStoreAppointmentTime(row.createdAt) }}</template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </el-drawer>
</template>

<style scoped>
.readonly-alert {
  margin-bottom: 16px;
}

.drawer-section-title {
  margin: 20px 0 10px;
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}
</style>
