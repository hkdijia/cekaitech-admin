<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentStoreProfile,
  updateStoreAppointmentStoreProfile,
  type StoreAppointmentStoreProfileUpdateRequest
} from '../../../api/storeAppointments';
import { createStoreConfigRequestId, normalizeOptionalText } from './storeAppointmentConfigPanelUtils';

defineProps<{
  canManage: boolean;
}>();

const storeProfileLoading = ref(false);
const storeProfileSaving = ref(false);
const storeProfileError = ref('');
const storeProfileSavedMessage = ref('');

const storeProfileQuery = reactive({
  storeCode: ''
});

const storeProfileDraft = reactive<StoreAppointmentStoreProfileUpdateRequest>({
  name: '',
  industry: '',
  phone: '',
  address: '',
  businessHours: '',
  staffLabel: '',
  projectLabel: '',
  showPrice: true
});

function assignStoreProfileDraft(payload: StoreAppointmentStoreProfileUpdateRequest) {
  storeProfileDraft.name = payload.name;
  storeProfileDraft.industry = payload.industry;
  storeProfileDraft.phone = payload.phone;
  storeProfileDraft.address = payload.address;
  storeProfileDraft.businessHours = payload.businessHours;
  storeProfileDraft.staffLabel = payload.staffLabel;
  storeProfileDraft.projectLabel = payload.projectLabel;
  storeProfileDraft.showPrice = payload.showPrice;
}

async function loadStoreProfile() {
  const storeCode = normalizeOptionalText(storeProfileQuery.storeCode);
  if (!storeCode) {
    storeProfileError.value = '请先填写 storeCode';
    return;
  }
  storeProfileLoading.value = true;
  storeProfileError.value = '';
  storeProfileSavedMessage.value = '';
  try {
    const result = await getStoreAppointmentStoreProfile(storeCode);
    assignStoreProfileDraft(result);
  } catch (error) {
    storeProfileError.value = error instanceof Error ? error.message : '门店资料加载失败';
  } finally {
    storeProfileLoading.value = false;
  }
}

async function saveStoreProfile() {
  const storeCode = normalizeOptionalText(storeProfileQuery.storeCode);
  if (!storeCode) {
    storeProfileError.value = '请先填写 storeCode';
    return;
  }
  storeProfileSaving.value = true;
  storeProfileError.value = '';
  storeProfileSavedMessage.value = '';
  try {
    const result = await updateStoreAppointmentStoreProfile(storeCode, { ...storeProfileDraft }, createStoreConfigRequestId());
    assignStoreProfileDraft(result);
    storeProfileSavedMessage.value = '门店资料已保存';
  } catch (error) {
    storeProfileError.value = error instanceof Error ? error.message : '门店资料保存失败';
  } finally {
    storeProfileSaving.value = false;
  }
}
</script>

<template>
  <el-card shadow="never" class="store-profile-panel">
    <template #header>
      <div class="card-header">
        <span>门店资料配置</span>
        <el-tag type="success" effect="plain">仅保存中性展示字段</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="本区只编辑门店展示资料，不包含支付、会员、核销、客户资料、员工账号或真实排班。"
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
          <el-input v-model="storeProfileQuery.storeCode" class="config-input" clearable placeholder="配置 storeCode" @keyup.enter="loadStoreProfile" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="storeProfileLoading" @click="loadStoreProfile">读取门店资料</el-button>
        </el-form-item>
      </el-form>
      <el-form class="store-profile-form" label-width="88px" @submit.prevent>
        <el-form-item label="门店名称">
          <el-input v-model="storeProfileDraft.name" placeholder="门店名称" />
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="storeProfileDraft.industry" placeholder="行业" />
        </el-form-item>
        <el-form-item label="展示电话">
          <el-input v-model="storeProfileDraft.phone" placeholder="展示电话" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="storeProfileDraft.address" placeholder="门店地址" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="storeProfileDraft.businessHours" placeholder="营业时间" />
        </el-form-item>
        <el-form-item label="员工称谓">
          <el-input v-model="storeProfileDraft.staffLabel" placeholder="员工称谓" />
        </el-form-item>
        <el-form-item label="项目称谓">
          <el-input v-model="storeProfileDraft.projectLabel" placeholder="项目称谓" />
        </el-form-item>
        <el-form-item label="展示价格">
          <el-switch v-model="storeProfileDraft.showPrice" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="storeProfileSaving" @click="saveStoreProfile">保存门店资料</el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="storeProfileError" class="error-alert" type="error" :title="storeProfileError" show-icon />
      <el-alert v-if="storeProfileSavedMessage" class="readonly-alert" type="success" :title="storeProfileSavedMessage" show-icon />
    </template>
  </el-card>
</template>

<style scoped>
.store-profile-panel {
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

.store-profile-form {
  max-width: 760px;
}
</style>
