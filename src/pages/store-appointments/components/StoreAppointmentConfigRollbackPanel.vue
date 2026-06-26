<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentRollbackPreview,
  rollbackStoreAppointmentConfig,
  type StoreAppointmentRollbackPreview
} from '../../../api/storeAppointments';
import { createStoreConfigRequestId, normalizeOptionalText } from './storeAppointmentConfigPanelUtils';

defineProps<{
  canManage: boolean;
}>();

const rollbackPreviewLoading = ref(false);
const rollbackExecuting = ref(false);
const rollbackError = ref('');
const rollbackSavedMessage = ref('');
const rollbackPreview = ref<StoreAppointmentRollbackPreview | null>(null);
const rollbackConfirmed = ref(false);

const rollbackQuery = reactive({
  storeCode: '',
  auditLogId: ''
});

function formatSlots(slots: string[]) {
  return slots.length > 0 ? slots.join(' / ') : '-';
}

function formatRollbackValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(' / ');
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

function rollbackValueEntries(preview: StoreAppointmentRollbackPreview) {
  return Object.entries(preview.values).map(([key, value]) => ({
    key,
    value: formatRollbackValue(value)
  }));
}

async function previewConfigRollback() {
  const storeCode = normalizeOptionalText(rollbackQuery.storeCode);
  const auditLogId = Number(rollbackQuery.auditLogId);
  if (!storeCode || !Number.isFinite(auditLogId) || auditLogId <= 0) {
    rollbackError.value = storeCode ? '请填写有效审计记录 ID' : '请先填写 storeCode';
    rollbackPreview.value = null;
    return;
  }
  rollbackPreviewLoading.value = true;
  rollbackError.value = '';
  rollbackSavedMessage.value = '';
  rollbackConfirmed.value = false;
  try {
    rollbackPreview.value = await getStoreAppointmentRollbackPreview(storeCode, auditLogId);
  } catch (error) {
    rollbackError.value = error instanceof Error ? error.message : '配置回滚预览失败';
    rollbackPreview.value = null;
  } finally {
    rollbackPreviewLoading.value = false;
  }
}

async function executeConfigRollback() {
  const storeCode = normalizeOptionalText(rollbackQuery.storeCode);
  const auditLogId = Number(rollbackQuery.auditLogId);
  if (!storeCode || !Number.isFinite(auditLogId) || auditLogId <= 0) {
    rollbackError.value = storeCode ? '请填写有效审计记录 ID' : '请先填写 storeCode';
    return;
  }
  if (!rollbackPreview.value) {
    rollbackError.value = '请先预览回滚';
    return;
  }
  if (!rollbackConfirmed.value) {
    rollbackError.value = '请先勾选确认';
    return;
  }
  rollbackExecuting.value = true;
  rollbackError.value = '';
  rollbackSavedMessage.value = '';
  try {
    await rollbackStoreAppointmentConfig(storeCode, auditLogId, createStoreConfigRequestId());
    rollbackSavedMessage.value = '配置回滚已执行';
    rollbackConfirmed.value = false;
  } catch (error) {
    rollbackError.value = error instanceof Error ? error.message : '配置回滚执行失败';
  } finally {
    rollbackExecuting.value = false;
  }
}
</script>

<template>
  <el-card shadow="never" class="rollback-panel">
    <template #header>
      <div class="card-header">
        <span>配置回滚</span>
        <el-tag type="warning" effect="plain">预览后确认执行</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="回滚只恢复四个中性配置面；预览不写库，执行会写入新的 rollback 审计，不恢复支付、会员、核销、客户资料、CRM、服务记录或真实排班。"
      show-icon
    />
    <el-alert
      v-if="!canManage"
      class="error-alert"
      type="warning"
      title="需要 admin:store-appointment-config:manage 权限"
      show-icon
    />
    <template v-else>
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="门店">
          <el-input v-model="rollbackQuery.storeCode" class="config-input" clearable placeholder="回滚 storeCode" @keyup.enter="previewConfigRollback" />
        </el-form-item>
        <el-form-item label="审计记录">
          <el-input v-model="rollbackQuery.auditLogId" class="code-input" clearable placeholder="审计记录 ID" @keyup.enter="previewConfigRollback" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="rollbackPreviewLoading" @click="previewConfigRollback">预览回滚</el-button>
        </el-form-item>
      </el-form>
      <div v-if="rollbackPreview" class="rollback-preview">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="配置面">{{ rollbackPreview.configSurface }}</el-descriptions-item>
          <el-descriptions-item label="门店">{{ rollbackPreview.storeCode }}</el-descriptions-item>
          <el-descriptions-item label="目标 code">{{ rollbackPreview.targetCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="关联项目">{{ formatSlots(rollbackPreview.projectCodes) }}</el-descriptions-item>
        </el-descriptions>
        <el-table :data="rollbackValueEntries(rollbackPreview)" row-key="key" size="small">
          <el-table-column prop="key" label="字段" width="180" show-overflow-tooltip />
          <el-table-column prop="value" label="将恢复为" min-width="260" show-overflow-tooltip />
        </el-table>
        <el-checkbox v-model="rollbackConfirmed" data-test="rollback-confirm">已核对预览内容，确认执行本次受控配置回滚</el-checkbox>
        <div class="rollback-actions">
          <el-button type="danger" :loading="rollbackExecuting" @click="executeConfigRollback">执行回滚</el-button>
        </div>
      </div>
      <el-alert v-if="rollbackError" class="error-alert" type="error" :title="rollbackError" show-icon />
      <el-alert v-if="rollbackSavedMessage" class="readonly-alert" type="success" :title="rollbackSavedMessage" show-icon />
    </template>
  </el-card>
</template>

<style scoped>
.rollback-panel {
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

.code-input {
  width: 140px;
}

.error-alert,
.readonly-alert {
  margin-bottom: 16px;
}

.rollback-preview {
  display: grid;
  gap: 12px;
}

.rollback-actions {
  display: flex;
  justify-content: flex-start;
}
</style>
