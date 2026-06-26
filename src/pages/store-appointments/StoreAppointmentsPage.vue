<script setup lang="ts">
import { computed } from 'vue';
import { onMounted, reactive, ref } from 'vue';
import { Check, Close, Finished, View } from '@element-plus/icons-vue';
import {
  getStoreAppointmentDetail,
  pageStoreAppointments,
  updateStoreAppointmentStatus,
  type StoreAppointmentDetail,
  type StoreAppointmentItem
} from '../../api/storeAppointments';
import { useAuthStore } from '../../stores/auth';
import StoreAppointmentAdminConfigContractPanel from './components/StoreAppointmentAdminConfigContractPanel.vue';
import StoreAppointmentBookingConfigSnapshotPanel from './components/StoreAppointmentBookingConfigSnapshotPanel.vue';
import StoreAppointmentConfigReadinessPanel from './components/StoreAppointmentConfigReadinessPanel.vue';
import StoreAppointmentConfigRollbackPanel from './components/StoreAppointmentConfigRollbackPanel.vue';
import StoreAppointmentFilterPanel from './components/StoreAppointmentFilterPanel.vue';
import StoreAppointmentRulesPanel from './components/StoreAppointmentRulesPanel.vue';
import StoreAppointmentServiceCatalogPanel from './components/StoreAppointmentServiceCatalogPanel.vue';
import StoreAppointmentStaffRosterPanel from './components/StoreAppointmentStaffRosterPanel.vue';
import StoreAppointmentStoreProfilePanel from './components/StoreAppointmentStoreProfilePanel.vue';

const auth = useAuthStore();
const loading = ref(false);
const detailLoading = ref(false);
const statusUpdating = ref(false);
const loadError = ref('');
const appointments = ref<StoreAppointmentItem[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detail = ref<StoreAppointmentDetail | null>(null);
const currentDetailId = ref<number | null>(null);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  storeCode: '',
  projectCode: '',
  staffCode: '',
  status: '',
  appointmentDate: ''
});

const statusOptions = [
  { label: '全部状态', value: '', tagType: 'info' },
  { label: '待确认', value: 'pending', tagType: 'warning' },
  { label: '已确认', value: 'confirmed', tagType: 'primary' },
  { label: '已到店', value: 'arrived', tagType: 'success' },
  { label: '已完成', value: 'completed', tagType: 'success' },
  { label: '已取消', value: 'cancelled', tagType: 'info' }
];

const canManageStatus = computed(() => auth.hasPermission('admin:store-appointment:manage'));
const canManageStoreAppointmentConfig = computed(() => auth.hasPermission('admin:store-appointment-config:manage'));

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function statusMeta(value: string) {
  const found = statusOptions.find((item) => item.value === value);
  return found ?? { label: value || '-', tagType: 'info' };
}

function statusText(value: string) {
  return statusMeta(value).label;
}

function formatStatusTransition(fromStatus: string, toStatus: string) {
  const fromText = fromStatus ? statusText(fromStatus) : '创建';
  return `${fromText} -> ${statusText(toStatus)}`;
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function formatSlots(slots: string[]) {
  return slots.length > 0 ? slots.join(' / ') : '-';
}

function statusActions(status: string) {
  if (!canManageStatus.value) {
    return [];
  }
  if (status === 'pending') {
    return [
      { label: '确认预约', status: 'confirmed', type: 'primary', icon: Check },
      { label: '取消预约', status: 'cancelled', type: 'danger', icon: Close }
    ];
  }
  if (status === 'confirmed') {
    return [
      { label: '标记到店', status: 'arrived', type: 'success', icon: Check },
      { label: '取消预约', status: 'cancelled', type: 'danger', icon: Close }
    ];
  }
  if (status === 'arrived') {
    return [
      { label: '完成', status: 'completed', type: 'success', icon: Finished }
    ];
  }
  return [];
}

async function loadAppointments() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageStoreAppointments({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      storeCode: normalizedText(query.storeCode),
      projectCode: normalizedText(query.projectCode),
      staffCode: normalizedText(query.staffCode),
      status: normalizedText(query.status),
      appointmentDate: normalizedText(query.appointmentDate)
    });
    appointments.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '门店预约加载失败';
    appointments.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchAppointments() {
  query.pageNo = 1;
  loadAppointments();
}

function resetFilters() {
  query.pageNo = 1;
  query.storeCode = '';
  query.projectCode = '';
  query.staffCode = '';
  query.status = '';
  query.appointmentDate = '';
  loadAppointments();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadAppointments();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadAppointments();
}

async function openDetail(row: StoreAppointmentItem) {
  currentDetailId.value = row.appointmentId;
  detailDrawerVisible.value = true;
  detailLoading.value = true;
  detail.value = null;
  loadError.value = '';
  try {
    detail.value = await getStoreAppointmentDetail(row.appointmentId);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '预约详情加载失败';
  } finally {
    detailLoading.value = false;
  }
}

async function refreshCurrentDetail() {
  if (!currentDetailId.value) {
    return;
  }
  detail.value = await getStoreAppointmentDetail(currentDetailId.value);
}

async function updateStatus(targetStatus: string) {
  if (!detail.value?.appointment.appointmentId || !canManageStatus.value) {
    return;
  }
  statusUpdating.value = true;
  loadError.value = '';
  try {
    await updateStoreAppointmentStatus(detail.value.appointment.appointmentId, { status: targetStatus });
    await refreshCurrentDetail();
    await loadAppointments();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '预约状态更新失败';
  } finally {
    statusUpdating.value = false;
  }
}

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <section>
    <h1 class="page-title">门店预约</h1>
    <p class="page-subtitle">查看预约、状态日志和后台流转结果；支付、会员、核销、客户资料暂不在本页处理。</p>

    <StoreAppointmentBookingConfigSnapshotPanel />

    <StoreAppointmentConfigReadinessPanel />

    <StoreAppointmentStoreProfilePanel :can-manage="canManageStoreAppointmentConfig" />

    <StoreAppointmentServiceCatalogPanel :can-manage="canManageStoreAppointmentConfig" />

    <StoreAppointmentStaffRosterPanel :can-manage="canManageStoreAppointmentConfig" />

    <StoreAppointmentRulesPanel :can-manage="canManageStoreAppointmentConfig" />

    <StoreAppointmentConfigRollbackPanel :can-manage="canManageStoreAppointmentConfig" />

    <StoreAppointmentAdminConfigContractPanel />

    <StoreAppointmentFilterPanel
      :query="query"
      :loading="loading"
      :status-options="statusOptions"
      @search="searchAppointments"
      @reset="resetFilters"
    />

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

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
            <el-button :icon="View" text type="primary" @click="openDetail(row)">查看详情</el-button>
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

    <el-drawer v-model="detailDrawerVisible" size="720px" title="预约详情">
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
              :icon="action.icon"
              :loading="statusUpdating"
              :type="action.type"
              @click="updateStatus(action.status)"
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
              <el-tag :type="statusMeta(detail.appointment.status).tagType" effect="plain">
                {{ statusMeta(detail.appointment.status).label }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="备注">{{ detail.appointment.remark || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatTime(detail.appointment.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ formatTime(detail.appointment.updatedAt) }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">状态日志</h2>
          <el-table :data="detail.statusLogs" row-key="createdAt" size="small">
            <el-table-column label="流转" min-width="150">
              <template #default="{ row }">{{ formatStatusTransition(row.fromStatus, row.toStatus) }}</template>
            </el-table-column>
            <el-table-column prop="operatorType" label="操作方" width="96" />
            <el-table-column prop="operatorId" label="操作人" min-width="140" show-overflow-tooltip />
            <el-table-column label="时间" width="172">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-drawer>
  </section>
</template>

<style scoped>
.config-panel,
.store-profile-panel,
.service-catalog-panel,
.staff-roster-panel,
.rollback-panel {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.config-input {
  width: 220px;
}

.error-alert,
.readonly-alert {
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

</style>
