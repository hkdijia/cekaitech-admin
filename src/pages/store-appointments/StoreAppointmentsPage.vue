<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh, Search, View } from '@element-plus/icons-vue';
import {
  getStoreAppointmentDetail,
  pageStoreAppointments,
  type StoreAppointmentDetail,
  type StoreAppointmentItem
} from '../../api/storeAppointments';

const loading = ref(false);
const detailLoading = ref(false);
const loadError = ref('');
const appointments = ref<StoreAppointmentItem[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detail = ref<StoreAppointmentDetail | null>(null);

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

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <section>
    <h1 class="page-title">门店预约</h1>
    <p class="page-subtitle">只读查看多行业门店预约列表、预约详情和状态日志。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="门店">
          <el-input v-model="query.storeCode" class="code-input" clearable placeholder="storeCode" @keyup.enter="searchAppointments" />
        </el-form-item>
        <el-form-item label="项目">
          <el-input v-model="query.projectCode" class="code-input" clearable placeholder="projectCode" @keyup.enter="searchAppointments" />
        </el-form-item>
        <el-form-item label="员工">
          <el-input v-model="query.staffCode" class="code-input" clearable placeholder="staffCode" @keyup.enter="searchAppointments" />
        </el-form-item>
        <el-form-item label="预约日">
          <el-input
            v-model="query.appointmentDate"
            class="date-input"
            clearable
            placeholder="YYYY-MM-DD"
            @keyup.enter="searchAppointments"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="status-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchAppointments">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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
            title="当前首片为只读查看；状态流转、核销、支付、会员和客户资料暂不在本页处理。"
            show-icon
          />
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
