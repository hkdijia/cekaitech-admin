<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentRules,
  updateStoreAppointmentRules,
  type StoreAppointmentRules,
  type StoreAppointmentRulesUpdateRequest
} from '../../../api/storeAppointments';

defineProps<{
  canManage: boolean;
}>();

const appointmentRulesLoading = ref(false);
const appointmentRulesSaving = ref(false);
const appointmentRulesError = ref('');
const appointmentRulesSavedMessage = ref('');
const appointmentRuleSlotsText = ref('');

const appointmentRulesQuery = reactive({
  storeCode: ''
});

const appointmentRulesDraft = reactive<StoreAppointmentRulesUpdateRequest>({
  bookingWindowDays: 14,
  defaultDurationMinutes: 60,
  defaultSlots: [],
  confirmationHint: '',
  cancelHint: ''
});

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function splitListText(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assignAppointmentRulesDraft(payload: StoreAppointmentRules) {
  appointmentRulesDraft.bookingWindowDays = payload.bookingWindowDays;
  appointmentRulesDraft.defaultDurationMinutes = payload.defaultDurationMinutes;
  appointmentRulesDraft.defaultSlots = [...payload.defaultSlots];
  appointmentRulesDraft.confirmationHint = payload.confirmationHint;
  appointmentRulesDraft.cancelHint = payload.cancelHint;
  appointmentRuleSlotsText.value = payload.defaultSlots.join('\n');
}

function createStoreConfigRequestId() {
  const randomPart = Math.random().toString(16).slice(2);
  return `store-config-${Date.now()}-${randomPart}`;
}

async function loadAppointmentRules() {
  const storeCode = normalizedText(appointmentRulesQuery.storeCode);
  if (!storeCode) {
    appointmentRulesError.value = '请先填写 storeCode';
    return;
  }
  appointmentRulesLoading.value = true;
  appointmentRulesError.value = '';
  appointmentRulesSavedMessage.value = '';
  try {
    const result = await getStoreAppointmentRules(storeCode);
    assignAppointmentRulesDraft(result);
  } catch (error) {
    appointmentRulesError.value = error instanceof Error ? error.message : '预约规则加载失败';
  } finally {
    appointmentRulesLoading.value = false;
  }
}

async function saveAppointmentRules() {
  const storeCode = normalizedText(appointmentRulesQuery.storeCode);
  if (!storeCode) {
    appointmentRulesError.value = '请先填写 storeCode';
    return;
  }
  appointmentRulesSaving.value = true;
  appointmentRulesError.value = '';
  appointmentRulesSavedMessage.value = '';
  try {
    const payload = {
      bookingWindowDays: Number(appointmentRulesDraft.bookingWindowDays),
      defaultDurationMinutes: Number(appointmentRulesDraft.defaultDurationMinutes),
      defaultSlots: splitListText(appointmentRuleSlotsText.value),
      confirmationHint: appointmentRulesDraft.confirmationHint,
      cancelHint: appointmentRulesDraft.cancelHint
    };
    const result = await updateStoreAppointmentRules(storeCode, payload, createStoreConfigRequestId());
    assignAppointmentRulesDraft(result);
    appointmentRulesSavedMessage.value = '预约规则已保存';
  } catch (error) {
    appointmentRulesError.value = error instanceof Error ? error.message : '预约规则保存失败';
  } finally {
    appointmentRulesSaving.value = false;
  }
}
</script>

<template>
  <el-card shadow="never" class="appointment-rules-panel">
    <template #header>
      <div class="card-header">
        <span>预约规则配置</span>
        <el-tag type="warning" effect="plain">仅保存基础预约规则</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="本区只编辑可约窗口、默认时长、默认时段和提示文案，不包含真实排班、消息通知、退款或客户账户策略。"
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
          <el-input v-model="appointmentRulesQuery.storeCode" class="config-input" clearable placeholder="预约规则 storeCode" @keyup.enter="loadAppointmentRules" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="appointmentRulesLoading" @click="loadAppointmentRules">读取预约规则</el-button>
        </el-form-item>
      </el-form>
      <el-form class="appointment-rules-form" label-width="108px" @submit.prevent>
        <el-form-item label="可约窗口">
          <el-input v-model.number="appointmentRulesDraft.bookingWindowDays" placeholder="可约窗口天数" />
        </el-form-item>
        <el-form-item label="默认时长">
          <el-input v-model.number="appointmentRulesDraft.defaultDurationMinutes" placeholder="默认服务时长" />
        </el-form-item>
        <el-form-item label="默认时段">
          <el-input v-model="appointmentRuleSlotsText" type="textarea" placeholder="默认时段，每行一条" />
        </el-form-item>
        <el-form-item label="确认提示">
          <el-input v-model="appointmentRulesDraft.confirmationHint" placeholder="确认提示" />
        </el-form-item>
        <el-form-item label="取消提示">
          <el-input v-model="appointmentRulesDraft.cancelHint" placeholder="取消提示" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="appointmentRulesSaving" @click="saveAppointmentRules">保存预约规则</el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="appointmentRulesError" class="error-alert" type="error" :title="appointmentRulesError" show-icon />
      <el-alert v-if="appointmentRulesSavedMessage" class="readonly-alert" type="success" :title="appointmentRulesSavedMessage" show-icon />
    </template>
  </el-card>
</template>

<style scoped>
.appointment-rules-panel {
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

.appointment-rules-form {
  max-width: 760px;
}
</style>
