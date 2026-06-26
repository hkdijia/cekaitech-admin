<script setup lang="ts">
import { computed } from 'vue';
import { onMounted, reactive, ref } from 'vue';
import { Check, Close, Finished, Refresh, Search, View } from '@element-plus/icons-vue';
import {
  getStoreAppointmentBookingConfig,
  getStoreAppointmentDetail,
  pageStoreAppointments,
  updateStoreAppointmentStatus,
  type StoreAppointmentBookingConfig,
  type StoreAppointmentDetail,
  type StoreAppointmentItem
} from '../../api/storeAppointments';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const loading = ref(false);
const detailLoading = ref(false);
const statusUpdating = ref(false);
const loadError = ref('');
const configError = ref('');
const appointments = ref<StoreAppointmentItem[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detail = ref<StoreAppointmentDetail | null>(null);
const currentDetailId = ref<number | null>(null);
const configLoading = ref(false);
const bookingConfig = ref<StoreAppointmentBookingConfig | null>(null);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  storeCode: '',
  projectCode: '',
  staffCode: '',
  status: '',
  appointmentDate: ''
});

const configQuery = reactive({
  appCode: 'store-appointment-template',
  storeCode: ''
});

const statusOptions = [
  { label: '全部状态', value: '', tagType: 'info' },
  { label: '待确认', value: 'pending', tagType: 'warning' },
  { label: '已确认', value: 'confirmed', tagType: 'primary' },
  { label: '已到店', value: 'arrived', tagType: 'success' },
  { label: '已完成', value: 'completed', tagType: 'success' },
  { label: '已取消', value: 'cancelled', tagType: 'info' }
];

const configSurfaceReadiness = [
  {
    key: 'store-profile',
    name: '门店资料',
    status: 'candidate',
    tagType: 'success',
    note: '营业时间、电话、员工称谓和项目称谓可作为中性配置候选；不得带虚拟门店名或真实租户字段。'
  },
  {
    key: 'service-catalog',
    name: '项目目录',
    status: 'candidate',
    tagType: 'success',
    note: '分类、项目、时长和 priceText 可作为预约骨架；priceText 仅为展示文案，不代表支付能力。'
  },
  {
    key: 'staff-roster',
    name: '员工名册',
    status: 'candidate',
    tagType: 'success',
    note: '员工展示资料、角色和启用状态可作为候选；不包含员工账号、权限和真实排班后台。'
  },
  {
    key: 'appointment-rules',
    name: '预约规则',
    status: 'candidate-with-caution',
    tagType: 'warning',
    note: '仅保留可约窗口、默认时长和默认时段；真实排班、通知和取消策略需另行生产设计。'
  },
  {
    key: 'operation-summary',
    name: '经营摘要',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '涉及租户、权限、统计口径和经营数据可见范围，当前不能直接进入模板结构。'
  },
  {
    key: 'feedback-follow-up',
    name: '反馈跟进',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '涉及客户表达、隐私授权和跟进状态，未来必须先做隐私和权限设计。'
  },
  {
    key: 'service-record',
    name: '服务记录',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '只作为本机演示备注候选；康复理疗场景不能演变为病历、诊断或客户档案。'
  }
];

const demoOnlyExcluded = [
  'demo-only-excluded',
  '虚拟门店/员工',
  '销售样板话术',
  '模拟支付/核销/会员',
  'wx storage 演示 key',
  '病历/诊断类表达'
];

const adminConfigContract = [
  {
    surfaceKey: 'store-profile',
    surfaceName: '门店资料',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/PUT /api/admin/store-appointment-config/stores/{storeCode}',
    writableFields: 'name, industry, phone, address, businessHours, staffLabel, projectLabel, showPrice',
    excludedFields: 'tenantId, appId, merchantId, realAdminUserId'
  },
  {
    surfaceKey: 'service-catalog',
    surfaceName: '项目目录',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/POST /api/admin/store-appointment-config/stores/{storeCode}/projects；PUT /api/admin/store-appointment-config/projects/{projectCode}',
    writableFields: 'categoryId, name, summary, durationMinutes, priceText, showPrice, enabled',
    excludedFields: 'paymentAmount, depositAmount, paymentRuleId, memberCardId'
  },
  {
    surfaceKey: 'staff-roster',
    surfaceName: '员工名册',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/POST /api/admin/store-appointment-config/stores/{storeCode}/staff；PUT /api/admin/store-appointment-config/staff/{staffCode}',
    writableFields: 'name, role, bio, avatarUrl, trustHighlights, enabled, projectCodes',
    excludedFields: 'loginAccountId, rolePermissionId, shiftScheduleId, privateContact'
  },
  {
    surfaceKey: 'appointment-rules',
    surfaceName: '预约规则',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/PUT /api/admin/store-appointment-config/rules/{storeCode}',
    writableFields: 'bookingWindowDays, defaultDurationMinutes, defaultSlots, confirmationHint, cancelHint',
    excludedFields: 'notificationTemplateId, refundRuleId, realSchedulePolicyId, customerAccountPolicy'
  }
];

const canManageStatus = computed(() => auth.hasPermission('admin:store-appointment:manage'));

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

function formatStaffProjects(config: StoreAppointmentBookingConfig) {
  const staffNameByCode = new Map(config.staffMembers.map((staff) => [staff.staffCode, staff.name]));
  const projectNameByCode = new Map(config.serviceProjects.map((project) => [project.projectCode, project.name]));
  return config.staffProjects.map((item) => ({
    ...item,
    staffName: staffNameByCode.get(item.staffCode) ?? item.staffCode,
    projectName: projectNameByCode.get(item.projectCode) ?? item.projectCode
  }));
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

async function loadBookingConfig() {
  const appCode = normalizedText(configQuery.appCode);
  const storeCode = normalizedText(configQuery.storeCode);
  if (!appCode || !storeCode) {
    configError.value = '请先填写 appCode 和 storeCode';
    bookingConfig.value = null;
    return;
  }
  configLoading.value = true;
  configError.value = '';
  try {
    bookingConfig.value = await getStoreAppointmentBookingConfig(appCode, storeCode);
  } catch (error) {
    configError.value = error instanceof Error ? error.message : '门店配置加载失败';
    bookingConfig.value = null;
  } finally {
    configLoading.value = false;
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

    <el-card shadow="never" class="config-panel">
      <template #header>
        <div class="card-header">
          <span>配置快照</span>
          <el-tag type="info" effect="plain">只读展示，不保存配置</el-tag>
        </div>
      </template>
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="小程序">
          <el-input v-model="configQuery.appCode" class="config-input" clearable placeholder="appCode" />
        </el-form-item>
        <el-form-item label="门店">
          <el-input v-model="configQuery.storeCode" class="config-input" clearable placeholder="storeCode" @keyup.enter="loadBookingConfig" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="configLoading" @click="loadBookingConfig">读取配置</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        class="readonly-alert"
        type="info"
        title="本区读取后端公开预约配置快照，用于核对门店资料、项目、员工和基础预约规则；不包含支付、会员、核销和客户资料。"
        show-icon
      />
      <el-alert v-if="configError" class="error-alert" type="error" :title="configError" show-icon />

      <div v-if="bookingConfig" class="config-grid">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="门店">
            {{ bookingConfig.store.name }} / {{ bookingConfig.store.storeCode }}
          </el-descriptions-item>
          <el-descriptions-item label="行业">{{ bookingConfig.store.industry || '-' }}</el-descriptions-item>
          <el-descriptions-item label="营业时间">{{ bookingConfig.store.businessHours || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ bookingConfig.store.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ bookingConfig.store.address || '-' }}</el-descriptions-item>
          <el-descriptions-item label="展示价格">{{ bookingConfig.store.showPrice ? '展示 priceText' : '不展示' }}</el-descriptions-item>
        </el-descriptions>

        <div>
          <h2 class="panel-section-title">服务项目</h2>
          <el-table :data="bookingConfig.serviceProjects" row-key="projectCode" size="small">
            <el-table-column prop="name" label="项目" min-width="120" show-overflow-tooltip />
            <el-table-column prop="projectCode" label="code" min-width="120" show-overflow-tooltip />
            <el-table-column prop="durationMinutes" label="时长" width="72" />
            <el-table-column prop="priceText" label="展示价" min-width="100" show-overflow-tooltip />
          </el-table>
        </div>

        <div>
          <h2 class="panel-section-title">员工名册</h2>
          <el-table :data="bookingConfig.staffMembers" row-key="staffCode" size="small">
            <el-table-column prop="name" label="员工" min-width="110" show-overflow-tooltip />
            <el-table-column prop="staffCode" label="code" min-width="120" show-overflow-tooltip />
            <el-table-column prop="role" label="角色" min-width="110" show-overflow-tooltip />
            <el-table-column prop="trustHighlights" label="亮点" min-width="120" show-overflow-tooltip />
          </el-table>
        </div>

        <div>
          <h2 class="panel-section-title">预约规则</h2>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="可约天数">{{ bookingConfig.appointmentRule.bookingWindowDays }} 天</el-descriptions-item>
            <el-descriptions-item label="默认时长">{{ bookingConfig.appointmentRule.defaultDurationMinutes }} 分钟</el-descriptions-item>
            <el-descriptions-item label="默认时段">{{ formatSlots(bookingConfig.appointmentRule.defaultSlots) }}</el-descriptions-item>
            <el-descriptions-item label="确认提示">{{ bookingConfig.appointmentRule.confirmationHint || '-' }}</el-descriptions-item>
            <el-descriptions-item label="取消提示">{{ bookingConfig.appointmentRule.cancelHint || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div>
          <h2 class="panel-section-title">员工项目关系</h2>
          <el-table :data="formatStaffProjects(bookingConfig)" row-key="projectCode" size="small">
            <el-table-column prop="staffName" label="员工" min-width="110" show-overflow-tooltip />
            <el-table-column prop="projectName" label="项目" min-width="120" show-overflow-tooltip />
            <el-table-column prop="staffCode" label="员工 code" min-width="120" show-overflow-tooltip />
            <el-table-column prop="projectCode" label="项目 code" min-width="120" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="readiness-panel">
      <template #header>
        <div class="card-header">
          <span>配置面 readiness</span>
          <el-tag type="warning" effect="plain">编辑入口未开放</el-tag>
        </div>
      </template>
      <el-alert
        class="readonly-alert"
        type="warning"
        title="本区只标注后续 admin/模板设计边界；当前不写入配置，不创建真实门店、项目、员工、排班、会员或支付能力。"
        show-icon
      />
      <el-table :data="configSurfaceReadiness" row-key="key" size="small">
        <el-table-column prop="name" label="配置面" width="116" />
        <el-table-column prop="key" label="key" width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="210">
          <template #default="{ row }">
            <el-tag :type="row.tagType" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="边界说明" min-width="320" show-overflow-tooltip />
      </el-table>
      <div class="excluded-row">
        <span v-for="item in demoOnlyExcluded" :key="item" class="excluded-chip">{{ item }}</span>
      </div>
    </el-card>

    <el-card shadow="never" class="api-gap-panel">
      <template #header>
        <div class="card-header">
          <span>admin 配置契约</span>
          <el-tag type="info" effect="plain">后端 ready，前端待接入</el-tag>
        </div>
      </template>
      <el-alert
        class="readonly-alert"
        type="info"
        title="以下后端配置接口已具备契约；当前页面仍不提供编辑表单、保存配置或绕过后端写数据。"
        show-icon
      />
      <el-table :data="adminConfigContract" row-key="surfaceKey" size="small">
        <el-table-column prop="surfaceName" label="配置面" width="108" />
        <el-table-column label="状态" width="152">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requiredPermission" label="权限码" min-width="230" show-overflow-tooltip />
        <el-table-column prop="endpoints" label="后端接口" min-width="360" show-overflow-tooltip />
        <el-table-column prop="writableFields" label="候选可写字段" min-width="260" show-overflow-tooltip />
        <el-table-column prop="excludedFields" label="排除字段" min-width="260" show-overflow-tooltip />
      </el-table>
    </el-card>

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
.readiness-panel,
.api-gap-panel,
.filter-panel {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
}

.code-input {
  width: 140px;
}

.config-input {
  width: 220px;
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

.config-grid {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr);
  gap: 16px;
}

.excluded-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
}

.excluded-chip {
  border: 1px solid #f3d19e;
  border-radius: 4px;
  background: #fdf6ec;
  color: #9a5b13;
  font-size: 12px;
  line-height: 24px;
  padding: 0 8px;
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

.panel-section-title {
  margin: 0 0 10px;
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 960px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
}
</style>
