<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentBookingConfig,
  type StoreAppointmentBookingConfig
} from '../../../api/storeAppointments';
import { normalizeOptionalText } from './storeAppointmentConfigPanelUtils';

const configLoading = ref(false);
const configError = ref('');
const bookingConfig = ref<StoreAppointmentBookingConfig | null>(null);

const configQuery = reactive({
  appCode: 'store-appointment-template',
  storeCode: ''
});

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

async function loadBookingConfig() {
  const appCode = normalizeOptionalText(configQuery.appCode);
  const storeCode = normalizeOptionalText(configQuery.storeCode);
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
</script>

<template>
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
</template>

<style scoped>
.config-panel {
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

.config-input {
  width: 220px;
}

.error-alert,
.readonly-alert {
  margin-bottom: 16px;
}

.config-grid {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr);
  gap: 16px;
}

.panel-section-title {
  margin: 0 0 10px;
  color: #344054;
  font-size: 15px;
}

@media (max-width: 900px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
}
</style>
