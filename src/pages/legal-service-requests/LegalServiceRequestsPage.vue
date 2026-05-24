<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { EditPen, Refresh, Search, View } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import {
  getLegalServiceRequestDetail,
  pageLegalServiceRequests,
  updateLegalServiceRequestStatus,
  viewLegalServiceRequestContact,
  type LegalServiceRequestDetail,
  type LegalServiceRequestItem
} from '../../api/legalServiceRequests';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const loadError = ref('');
const requests = ref<LegalServiceRequestItem[]>([]);
const totalCount = ref(0);
const detailDrawerVisible = ref(false);
const detailLoading = ref(false);
const detail = ref<LegalServiceRequestDetail | null>(null);
const contactViewLoading = ref(false);
const contactViewError = ref('');
const contactRevealed = ref(false);
const statusUpdating = ref(false);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: '',
  userId: '',
  serviceType: '',
  status: '',
  contactPhone: '',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const statusForm = reactive({
  status: '',
  adminRemark: ''
});

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳光法律助手', value: 'lawsuit-material-assistant' }
];

const serviceTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '立案指导', value: 'filing_guidance' },
  { label: '合同审查', value: 'contract_review' },
  { label: '人工材料整理', value: 'manual_material_sorting' },
  { label: '律师审核', value: 'lawyer_review' }
];

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '待处理', value: 'submitted' },
  { label: '联系中', value: 'contacting' },
  { label: '待用户补充', value: 'waiting_user' },
  { label: '已处理', value: 'handled' },
  { label: '已关闭', value: 'closed' },
  { label: '已取消', value: 'cancelled' }
];

const canManageRequests = () => auth.hasPermission('admin:legal-service-request:manage');
const currentRequestId = computed(() => detail.value?.requestId);

function normalizedText(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return undefined;
  }
  return trimmedValue;
}

function isPositiveSafeIntegerText(value: string) {
  if (!/^[1-9]\d*$/.test(value)) {
    return false;
  }
  return Number.isSafeInteger(Number(value));
}

function normalizedUserId() {
  const trimmedValue = query.userId.trim();
  if (!isPositiveSafeIntegerText(trimmedValue)) {
    return undefined;
  }
  return Number(trimmedValue);
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function optionText(options: Array<{ label: string; value: string }>, value: string) {
  const found = options.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

function serviceTypeText(value: string) {
  return optionText(serviceTypeOptions, value);
}

function statusText(value: string) {
  return optionText(statusOptions, value);
}

function statusTagType(value: string) {
  if (value === 'handled') {
    return 'success';
  }
  if (value === 'closed' || value === 'cancelled') {
    return 'info';
  }
  if (value === 'waiting_user') {
    return 'warning';
  }
  return 'primary';
}

async function loadRequests() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalServiceRequests({
      pageNo: query.pageNo,
      pageSize: Math.min(query.pageSize, 100),
      appCode: normalizedText(query.appCode),
      userId: normalizedUserId(),
      serviceType: normalizedText(query.serviceType),
      status: normalizedText(query.status),
      contactPhone: normalizedText(query.contactPhone),
      keywords: normalizedText(query.keywords),
      orderBy: query.orderBy,
      order: query.order
    });
    requests.value = result.dataList;
    totalCount.value = result.totalCount;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '服务请求加载失败';
    requests.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
}

function searchRequests() {
  query.pageNo = 1;
  loadRequests();
}

function resetFilters() {
  query.pageNo = 1;
  query.appCode = '';
  query.userId = '';
  query.serviceType = '';
  query.status = '';
  query.contactPhone = '';
  query.keywords = '';
  loadRequests();
}

function handlePageChange(pageNo: number) {
  query.pageNo = pageNo;
  loadRequests();
}

function handleSizeChange(pageSize: number) {
  query.pageNo = 1;
  query.pageSize = pageSize;
  loadRequests();
}

async function openDetail(row: LegalServiceRequestItem) {
  detailDrawerVisible.value = true;
  detailLoading.value = true;
  detail.value = null;
  contactViewError.value = '';
  contactRevealed.value = false;
  loadError.value = '';
  try {
    const result = await getLegalServiceRequestDetail(row.requestId);
    detail.value = result;
    statusForm.status = result.status;
    statusForm.adminRemark = result.adminRemark || '';
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '服务请求详情加载失败';
  } finally {
    detailLoading.value = false;
  }
}

async function viewContactPhone() {
  if (!currentRequestId.value) {
    return;
  }
  contactViewLoading.value = true;
  contactViewError.value = '';
  try {
    const result = await viewLegalServiceRequestContact(currentRequestId.value);
    detail.value = result;
    contactRevealed.value = true;
  } catch (error) {
    contactViewError.value = error instanceof Error ? error.message : '完整手机号查看失败';
  } finally {
    contactViewLoading.value = false;
  }
}

function openUserInvestigation(userId: number) {
  if (!userId) {
    return;
  }
  router.push({
    path: '/users',
    query: { userId: String(userId) }
  });
}

function openGenerationRecords(userId: number) {
  if (!userId) {
    return;
  }
  router.push({
    path: '/generation-records',
    query: { userId: String(userId) }
  });
}

async function submitStatusUpdate() {
  if (!currentRequestId.value || !canManageRequests()) {
    return;
  }
  if (!statusForm.status) {
    loadError.value = '请选择处理状态';
    return;
  }
  statusUpdating.value = true;
  loadError.value = '';
  try {
    const updated = await updateLegalServiceRequestStatus(currentRequestId.value, {
      status: statusForm.status,
      adminRemark: statusForm.adminRemark.trim()
    });
    detail.value = {
      ...updated,
      contactPhone: contactRevealed.value ? detail.value?.contactPhone : undefined
    };
    statusForm.status = updated.status;
    statusForm.adminRemark = updated.adminRemark || '';
    await loadRequests();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '服务请求状态更新失败';
  } finally {
    statusUpdating.value = false;
  }
}

onMounted(() => {
  loadRequests();
});
</script>

<template>
  <section>
    <h1 class="page-title">服务请求</h1>
    <p class="page-subtitle">查看法律服务请求，跟进人工处理状态和内部备注。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="query.keywords"
            class="keyword-input"
            clearable
            placeholder="联系人 / 备注 / 记录ID"
            @keyup.enter="searchRequests"
          />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="query.userId" class="user-id-input" clearable placeholder="用户ID" @keyup.enter="searchRequests" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="query.contactPhone"
            class="phone-input"
            clearable
            placeholder="联系手机号"
            @keyup.enter="searchRequests"
          />
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="query.serviceType" class="service-type-select" filterable>
            <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" class="status-select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" filterable>
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" :loading="loading" @click="searchRequests">查询</el-button>
          <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="table-panel">
      <el-table v-loading="loading" :data="requests" row-key="requestId">
        <el-table-column prop="requestId" label="请求ID" width="104" />
        <el-table-column prop="userId" label="用户ID" width="96" />
        <el-table-column prop="appCode" label="小程序" min-width="190" show-overflow-tooltip />
        <el-table-column label="服务类型" width="136">
          <template #default="{ row }">{{ serviceTypeText(row.serviceType) }}</template>
        </el-table-column>
        <el-table-column prop="contactName" label="联系人" width="110" show-overflow-tooltip />
        <el-table-column prop="contactPhoneMasked" label="手机号脱敏" width="136" />
        <el-table-column label="状态" width="116">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="plain">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人" width="120">
          <template #default="{ row }">{{ row.handler || '-' }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
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

    <el-drawer v-model="detailDrawerVisible" title="服务请求详情" size="640px">
      <div v-loading="detailLoading">
        <el-empty v-if="!detail && !detailLoading" description="暂无详情" />
        <template v-if="detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="请求ID">{{ detail.requestId }}</el-descriptions-item>
            <el-descriptions-item label="小程序">{{ detail.appCode }}</el-descriptions-item>
            <el-descriptions-item label="服务类型">{{ serviceTypeText(detail.serviceType) }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ detail.contactName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="手机号">
              <span>{{ contactRevealed ? detail.contactPhone || '-' : detail.contactPhoneMasked || '-' }}</span>
              <el-button
                v-if="!contactRevealed"
                class="inline-action"
                :loading="contactViewLoading"
                text
                type="primary"
                @click="viewContactPhone"
              >
                查看完整手机号
              </el-button>
              <div v-if="contactViewError" class="inline-error">{{ contactViewError }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="处理状态">
              <el-tag :type="statusTagType(detail.status)" effect="plain">{{ statusText(detail.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="处理人">{{ detail.handler || '-' }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatTime(detail.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ formatTime(detail.updatedAt) }}</el-descriptions-item>
            <el-descriptions-item label="处理时间">{{ formatTime(detail.handledAt) }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">用户与来源</h2>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户ID">
              <span>{{ detail.userId }}</span>
              <el-button class="inline-action" :icon="View" text type="primary" @click="openUserInvestigation(detail.userId)">
                查看用户
              </el-button>
              <el-button class="inline-action" text type="primary" @click="openGenerationRecords(detail.userId)">查看生成记录</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="身份ID">{{ detail.identityId }}</el-descriptions-item>
            <el-descriptions-item label="来源记录ID">{{ detail.sourceRecordId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="客户端记录ID">{{ detail.clientRecordId || '-' }}</el-descriptions-item>
          </el-descriptions>

          <h2 class="drawer-section-title">备注</h2>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户备注">{{ detail.memo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="内部备注">{{ detail.adminRemark || '-' }}</el-descriptions-item>
          </el-descriptions>

          <div v-if="canManageRequests()" class="status-update-panel">
            <h2 class="drawer-section-title">处理状态</h2>
            <el-form label-width="88px">
              <el-form-item label="目标状态">
                <el-select v-model="statusForm.status" class="dialog-input">
                  <el-option v-for="item in statusOptions.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="内部备注">
                <el-input v-model="statusForm.adminRemark" type="textarea" :rows="3" maxlength="200" show-word-limit />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="EditPen" :loading="statusUpdating" @click="submitStatusUpdate">保存状态</el-button>
              </el-form-item>
            </el-form>
          </div>
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

.keyword-input {
  width: 220px;
}

.user-id-input {
  width: 120px;
}

.phone-input {
  width: 150px;
}

.service-type-select {
  width: 160px;
}

.status-select {
  width: 132px;
}

.app-select {
  width: 190px;
}

.error-alert {
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

.inline-action {
  margin-left: 8px;
}

.inline-error {
  margin-top: 4px;
  color: #f56c6c;
  font-size: 13px;
}

.status-update-panel {
  margin-top: 4px;
}

.dialog-input {
  width: 100%;
}
</style>
