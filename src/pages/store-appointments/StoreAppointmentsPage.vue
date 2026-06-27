<script setup lang="ts">
import { computed } from 'vue';
import { onMounted, reactive, ref } from 'vue';
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
import StoreAppointmentDetailDrawer from './components/StoreAppointmentDetailDrawer.vue';
import StoreAppointmentFilterPanel from './components/StoreAppointmentFilterPanel.vue';
import StoreAppointmentListPanel from './components/StoreAppointmentListPanel.vue';
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

    <StoreAppointmentListPanel
      :appointments="appointments"
      :loading="loading"
      :page-no="query.pageNo"
      :page-size="query.pageSize"
      :total-count="totalCount"
      @open-detail="openDetail"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <StoreAppointmentDetailDrawer
      v-model:visible="detailDrawerVisible"
      :detail="detail"
      :detail-loading="detailLoading"
      :status-updating="statusUpdating"
      :can-manage-status="canManageStatus"
      @update-status="updateStatus"
    />
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

</style>
