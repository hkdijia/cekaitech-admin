<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentStaffRoster,
  updateStoreAppointmentStaffRoster,
  type StoreAppointmentStaffRosterItem,
  type StoreAppointmentStaffRosterUpdateRequest
} from '../../../api/storeAppointments';

defineProps<{
  canManage: boolean;
}>();

const staffRosterLoading = ref(false);
const staffRosterSaving = ref(false);
const staffRosterError = ref('');
const staffRosterSavedMessage = ref('');
const staffRosterItems = ref<StoreAppointmentStaffRosterItem[]>([]);
const selectedStaffCode = ref('');
const staffTrustHighlightsText = ref('');
const staffProjectCodesText = ref('');

const staffRosterQuery = reactive({
  storeCode: ''
});

const staffRosterDraft = reactive<StoreAppointmentStaffRosterUpdateRequest>({
  storeCode: '',
  name: '',
  role: '',
  bio: '',
  avatarUrl: '',
  trustHighlights: [],
  enabled: true,
  projectCodes: []
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

function formatSlots(slots: string[]) {
  return slots.length > 0 ? slots.join(' / ') : '-';
}

function assignStaffRosterDraft(payload: StoreAppointmentStaffRosterItem) {
  selectedStaffCode.value = payload.staffCode;
  staffRosterDraft.storeCode = payload.storeCode;
  staffRosterDraft.name = payload.name;
  staffRosterDraft.role = payload.role;
  staffRosterDraft.bio = payload.bio;
  staffRosterDraft.avatarUrl = payload.avatarUrl;
  staffRosterDraft.trustHighlights = [...payload.trustHighlights];
  staffRosterDraft.enabled = payload.enabled;
  staffRosterDraft.projectCodes = [...payload.projectCodes];
  staffTrustHighlightsText.value = payload.trustHighlights.join('\n');
  staffProjectCodesText.value = payload.projectCodes.join('\n');
}

function createStoreConfigRequestId() {
  const randomPart = Math.random().toString(16).slice(2);
  return `store-config-${Date.now()}-${randomPart}`;
}

async function loadStaffRoster() {
  const storeCode = normalizedText(staffRosterQuery.storeCode);
  if (!storeCode) {
    staffRosterError.value = '请先填写 storeCode';
    return;
  }
  staffRosterLoading.value = true;
  staffRosterError.value = '';
  staffRosterSavedMessage.value = '';
  try {
    staffRosterItems.value = await getStoreAppointmentStaffRoster(storeCode);
  } catch (error) {
    staffRosterError.value = error instanceof Error ? error.message : '员工名册加载失败';
    staffRosterItems.value = [];
  } finally {
    staffRosterLoading.value = false;
  }
}

function editStaffRoster(row: StoreAppointmentStaffRosterItem) {
  staffRosterError.value = '';
  staffRosterSavedMessage.value = '';
  assignStaffRosterDraft(row);
}

async function saveStaffRoster() {
  if (!selectedStaffCode.value) {
    staffRosterError.value = '请先选择员工';
    return;
  }
  staffRosterSaving.value = true;
  staffRosterError.value = '';
  staffRosterSavedMessage.value = '';
  try {
    const payload = {
      ...staffRosterDraft,
      trustHighlights: splitListText(staffTrustHighlightsText.value),
      projectCodes: splitListText(staffProjectCodesText.value)
    };
    const result = await updateStoreAppointmentStaffRoster(selectedStaffCode.value, payload, createStoreConfigRequestId());
    assignStaffRosterDraft(result);
    staffRosterItems.value = staffRosterItems.value.map((item) => (item.staffCode === result.staffCode ? result : item));
    staffRosterSavedMessage.value = '员工已保存';
  } catch (error) {
    staffRosterError.value = error instanceof Error ? error.message : '员工保存失败';
  } finally {
    staffRosterSaving.value = false;
  }
}
</script>

<template>
  <el-card shadow="never" class="staff-roster-panel">
    <template #header>
      <div class="card-header">
        <span>员工名册配置</span>
        <el-tag type="success" effect="plain">仅保存中性员工展示字段</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="本区只编辑员工展示资料和可服务项目 code，不包含员工账号、权限、私联信息或真实排班。"
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
          <el-input v-model="staffRosterQuery.storeCode" class="config-input" clearable placeholder="员工名册 storeCode" @keyup.enter="loadStaffRoster" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="staffRosterLoading" @click="loadStaffRoster">读取员工名册</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="staffRosterItems" row-key="staffCode" size="small">
        <el-table-column prop="name" label="员工" min-width="120" show-overflow-tooltip />
        <el-table-column prop="staffCode" label="code" min-width="130" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" min-width="120" show-overflow-tooltip />
        <el-table-column label="可服务项目" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ formatSlots(row.projectCodes) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="112">
          <template #default="{ row }">
            <el-button text type="primary" @click="editStaffRoster(row)">编辑员工</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form class="staff-roster-form" label-width="96px" @submit.prevent>
        <el-form-item label="员工姓名">
          <el-input v-model="staffRosterDraft.name" placeholder="员工姓名" />
        </el-form-item>
        <el-form-item label="员工角色">
          <el-input v-model="staffRosterDraft.role" placeholder="员工角色" />
        </el-form-item>
        <el-form-item label="员工简介">
          <el-input v-model="staffRosterDraft.bio" placeholder="员工简介" />
        </el-form-item>
        <el-form-item label="头像 URL">
          <el-input v-model="staffRosterDraft.avatarUrl" placeholder="头像 URL" />
        </el-form-item>
        <el-form-item label="员工亮点">
          <el-input v-model="staffTrustHighlightsText" type="textarea" placeholder="员工亮点，每行一条" />
        </el-form-item>
        <el-form-item label="项目 code">
          <el-input v-model="staffProjectCodesText" type="textarea" placeholder="可服务项目 code，每行一条" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="staffRosterDraft.enabled" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="staffRosterSaving" @click="saveStaffRoster">保存员工</el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="staffRosterError" class="error-alert" type="error" :title="staffRosterError" show-icon />
      <el-alert v-if="staffRosterSavedMessage" class="readonly-alert" type="success" :title="staffRosterSavedMessage" show-icon />
    </template>
  </el-card>
</template>

<style scoped>
.staff-roster-panel {
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

.staff-roster-form {
  max-width: 760px;
}
</style>
