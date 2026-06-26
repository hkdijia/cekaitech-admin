<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import {
  getStoreAppointmentServiceCatalog,
  updateStoreAppointmentServiceCatalog,
  type StoreAppointmentServiceProject,
  type StoreAppointmentServiceProjectUpdateRequest
} from '../../../api/storeAppointments';

defineProps<{
  canManage: boolean;
}>();

const serviceCatalogLoading = ref(false);
const serviceCatalogSaving = ref(false);
const serviceCatalogError = ref('');
const serviceCatalogSavedMessage = ref('');
const serviceCatalogItems = ref<StoreAppointmentServiceProject[]>([]);
const selectedServiceProjectCode = ref('');

const serviceCatalogQuery = reactive({
  storeCode: ''
});

const serviceProjectDraft = reactive<StoreAppointmentServiceProjectUpdateRequest>({
  storeCode: '',
  categoryId: '',
  name: '',
  summary: '',
  durationMinutes: 60,
  priceText: '',
  showPrice: true,
  enabled: true
});

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function assignServiceProjectDraft(payload: StoreAppointmentServiceProject) {
  selectedServiceProjectCode.value = payload.projectCode;
  serviceProjectDraft.storeCode = payload.storeCode;
  serviceProjectDraft.categoryId = payload.categoryId;
  serviceProjectDraft.name = payload.name;
  serviceProjectDraft.summary = payload.summary;
  serviceProjectDraft.durationMinutes = payload.durationMinutes;
  serviceProjectDraft.priceText = payload.priceText;
  serviceProjectDraft.showPrice = payload.showPrice;
  serviceProjectDraft.enabled = payload.enabled;
}

function createStoreConfigRequestId() {
  const randomPart = Math.random().toString(16).slice(2);
  return `store-config-${Date.now()}-${randomPart}`;
}

async function loadServiceCatalog() {
  const storeCode = normalizedText(serviceCatalogQuery.storeCode);
  if (!storeCode) {
    serviceCatalogError.value = '请先填写 storeCode';
    return;
  }
  serviceCatalogLoading.value = true;
  serviceCatalogError.value = '';
  serviceCatalogSavedMessage.value = '';
  try {
    serviceCatalogItems.value = await getStoreAppointmentServiceCatalog(storeCode);
  } catch (error) {
    serviceCatalogError.value = error instanceof Error ? error.message : '项目目录加载失败';
    serviceCatalogItems.value = [];
  } finally {
    serviceCatalogLoading.value = false;
  }
}

function editServiceProject(row: StoreAppointmentServiceProject) {
  serviceCatalogError.value = '';
  serviceCatalogSavedMessage.value = '';
  assignServiceProjectDraft(row);
}

async function saveServiceProject() {
  if (!selectedServiceProjectCode.value) {
    serviceCatalogError.value = '请先选择项目';
    return;
  }
  serviceCatalogSaving.value = true;
  serviceCatalogError.value = '';
  serviceCatalogSavedMessage.value = '';
  try {
    const result = await updateStoreAppointmentServiceCatalog(
      selectedServiceProjectCode.value,
      { ...serviceProjectDraft, durationMinutes: Number(serviceProjectDraft.durationMinutes) },
      createStoreConfigRequestId()
    );
    assignServiceProjectDraft(result);
    serviceCatalogItems.value = serviceCatalogItems.value.map((item) => (item.projectCode === result.projectCode ? result : item));
    serviceCatalogSavedMessage.value = '项目已保存';
  } catch (error) {
    serviceCatalogError.value = error instanceof Error ? error.message : '项目保存失败';
  } finally {
    serviceCatalogSaving.value = false;
  }
}
</script>

<template>
  <el-card shadow="never" class="service-catalog-panel">
    <template #header>
      <div class="card-header">
        <span>项目目录配置</span>
        <el-tag type="success" effect="plain">仅保存中性项目字段</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="本区只编辑预约项目展示字段，priceText 仅为展示文案，不代表支付金额、定金或会员权益。"
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
          <el-input v-model="serviceCatalogQuery.storeCode" class="config-input" clearable placeholder="项目目录 storeCode" @keyup.enter="loadServiceCatalog" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="serviceCatalogLoading" @click="loadServiceCatalog">读取项目目录</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="serviceCatalogItems" row-key="projectCode" size="small">
        <el-table-column prop="name" label="项目" min-width="120" show-overflow-tooltip />
        <el-table-column prop="projectCode" label="code" min-width="130" show-overflow-tooltip />
        <el-table-column prop="durationMinutes" label="时长" width="72" />
        <el-table-column prop="priceText" label="展示价" min-width="120" show-overflow-tooltip />
        <el-table-column label="操作" width="112">
          <template #default="{ row }">
            <el-button text type="primary" @click="editServiceProject(row)">编辑项目</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form class="service-project-form" label-width="96px" @submit.prevent>
        <el-form-item label="分类 code">
          <el-input v-model="serviceProjectDraft.categoryId" placeholder="分类 code" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="serviceProjectDraft.name" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目摘要">
          <el-input v-model="serviceProjectDraft.summary" placeholder="项目摘要" />
        </el-form-item>
        <el-form-item label="默认时长">
          <el-input v-model.number="serviceProjectDraft.durationMinutes" placeholder="默认时长" />
        </el-form-item>
        <el-form-item label="展示价格">
          <el-input v-model="serviceProjectDraft.priceText" placeholder="展示价格文案" />
        </el-form-item>
        <el-form-item label="展示价格">
          <el-switch v-model="serviceProjectDraft.showPrice" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="serviceProjectDraft.enabled" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="serviceCatalogSaving" @click="saveServiceProject">保存项目</el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="serviceCatalogError" class="error-alert" type="error" :title="serviceCatalogError" show-icon />
      <el-alert v-if="serviceCatalogSavedMessage" class="readonly-alert" type="success" :title="serviceCatalogSavedMessage" show-icon />
    </template>
  </el-card>
</template>

<style scoped>
.service-catalog-panel {
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

.service-project-form {
  max-width: 760px;
}
</style>
