<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue';
import {
  getAdminOrderRefundSyncAbnormal,
  pageAdminOrderRefundNotifies,
  pageAdminOrderRefunds,
  pageAdminOrders,
  summarizeAdminOrderRefundNotifies,
  summarizeAdminOrderRefunds,
  summarizeAdminOrders,
  syncAdminOrderPayment,
  type AdminOrder,
  type AdminOrderRefund,
  type AdminOrderRefundNotify,
  type AdminOrderRefundNotifySummary,
  type AdminOrderRefundSummary,
  type AdminOrderRefundSyncAbnormal,
  type AdminOrderSummary
} from '../../api/adminOrders';

const activeTab = ref('orders');
const loading = ref(false);
const loadError = ref('');
const orders = ref<AdminOrder[]>([]);
const totalCount = ref(0);
const orderSummary = ref<AdminOrderSummary | null>(null);
const refunds = ref<AdminOrderRefund[]>([]);
const refundTotalCount = ref(0);
const refundSummary = ref<AdminOrderRefundSummary | null>(null);
const refundNotifies = ref<AdminOrderRefundNotify[]>([]);
const refundNotifyTotalCount = ref(0);
const refundNotifySummary = ref<AdminOrderRefundNotifySummary | null>(null);
const syncAbnormal = ref<AdminOrderRefundSyncAbnormal | null>(null);
const paymentSyncingId = ref<number | null>(null);

const query = reactive({
  pageNo: 1,
  pageSize: 10,
  appCode: '',
  businessType: '',
  productCode: '',
  status: '',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const refundQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  status: '',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const refundNotifyQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  processStatus: '',
  keywords: '',
  orderBy: 'createdAt',
  order: 'desc' as const
});

const appOptions = [
  { label: '全部小程序', value: '' },
  { label: '阳律通', value: 'lawsuit-material-assistant' }
];

const businessTypeOptions = [
  { label: '全部业务', value: '' },
  { label: '法律服务请求', value: 'legal_service_request' }
];

const orderStatusOptions = [
  { label: '全部状态', value: '' },
  { label: '待支付', value: 'pending_pay' },
  { label: '已支付', value: 'paid' },
  { label: '部分退款', value: 'partial_refunded' },
  { label: '已退款', value: 'refunded' },
  { label: '已关闭', value: 'closed' }
];

const refundStatusOptions = [
  { label: '全部退款', value: '' },
  { label: '待审核', value: 'pending_review' },
  { label: '已通过', value: 'approved' },
  { label: '退款中', value: 'processing' },
  { label: '退款成功', value: 'success' },
  { label: '退款失败', value: 'failed' },
  { label: '已拒绝', value: 'rejected' }
];

const notifyStatusOptions = [
  { label: '全部通知', value: '' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '忽略', value: 'ignored' }
];

const summaryCards = computed(() => [
  { label: '已支付订单', value: orderSummary.value?.paidCount ?? 0 },
  { label: '已支付金额', value: formatMoney(orderSummary.value?.paidAmountTotal ?? 0) },
  { label: '待支付订单', value: orderSummary.value?.pendingCount ?? 0 },
  { label: '待支付金额', value: formatMoney(orderSummary.value?.pendingAmountTotal ?? 0) }
]);

const refundSummaryCards = computed(() => [
  { label: '退款申请', value: refundSummary.value?.totalCount ?? 0 },
  { label: '成功退款', value: refundSummary.value?.successCount ?? 0 },
  { label: '成功退款金额', value: formatMoney(refundSummary.value?.successAmount ?? 0) },
  { label: '同步异常', value: refundSummary.value?.syncAbnormalCount ?? 0 }
]);

const notifySummaryCards = computed(() => [
  { label: '通知总数', value: refundNotifySummary.value?.totalCount ?? 0 },
  { label: '成功通知', value: refundNotifySummary.value?.successCount ?? 0 },
  { label: '失败通知', value: refundNotifySummary.value?.failedCount ?? 0 },
  { label: '可重试失败', value: refundNotifySummary.value?.retryableFailedCount ?? 0 }
]);

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function formatMoney(value: number | null | undefined) {
  return ((value ?? 0) / 100).toFixed(2);
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').slice(0, 19);
}

function orderStatusText(status: string) {
  const map: Record<string, string> = {
    pending_pay: '待支付',
    paid: '已支付',
    partial_refunded: '部分退款',
    refunded: '已退款',
    closed: '已关闭'
  };
  return map[status] || status || '-';
}

function refundStatusText(status: string) {
  const map: Record<string, string> = {
    pending_review: '待审核',
    approved: '已通过',
    processing: '退款中',
    success: '退款成功',
    failed: '退款失败',
    rejected: '已拒绝'
  };
  return map[status] || status || '-';
}

function notifyStatusText(status: string) {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    ignored: '忽略'
  };
  return map[status] || status || '-';
}

function orderStatusTagType(status: string) {
  if (status === 'paid') {
    return 'success';
  }
  if (status === 'refunded') {
    return 'info';
  }
  if (status === 'partial_refunded') {
    return 'warning';
  }
  return '';
}

function refundStatusTagType(status: string) {
  if (status === 'success') {
    return 'success';
  }
  if (status === 'processing' || status === 'approved' || status === 'pending_review') {
    return 'warning';
  }
  if (status === 'failed' || status === 'rejected') {
    return 'danger';
  }
  return '';
}

function notifyStatusTagType(status: string) {
  if (status === 'success') {
    return 'success';
  }
  if (status === 'failed') {
    return 'danger';
  }
  return 'info';
}

async function loadOrders() {
  loading.value = true;
  loadError.value = '';
  try {
    const orderRequest = {
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      orderBy: query.orderBy,
      order: query.order,
      appCode: optional(query.appCode),
      businessType: optional(query.businessType),
      productCode: optional(query.productCode),
      status: optional(query.status),
      keywords: optional(query.keywords)
    };
    const summaryRequest = {
      appCode: optional(query.appCode),
      businessType: optional(query.businessType),
      productCode: optional(query.productCode)
    };
    const [page, summary] = await Promise.all([
      pageAdminOrders(orderRequest),
      summarizeAdminOrders(summaryRequest)
    ]);
    orders.value = page.dataList;
    totalCount.value = page.totalCount;
    orderSummary.value = summary;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '订单数据加载失败';
  } finally {
    loading.value = false;
  }
}

async function loadRefunds() {
  const page = await pageAdminOrderRefunds({
    pageNo: refundQuery.pageNo,
    pageSize: refundQuery.pageSize,
    orderBy: refundQuery.orderBy,
    order: refundQuery.order,
    appCode: optional(query.appCode),
    businessType: optional(query.businessType),
    productCode: optional(query.productCode),
    status: optional(refundQuery.status),
    keywords: optional(refundQuery.keywords)
  });
  refunds.value = page.dataList;
  refundTotalCount.value = page.totalCount;
  refundSummary.value = await summarizeAdminOrderRefunds({
    appCode: optional(query.appCode),
    businessType: optional(query.businessType),
    productCode: optional(query.productCode)
  });
}

async function loadRefundNotifies() {
  const page = await pageAdminOrderRefundNotifies({
    pageNo: refundNotifyQuery.pageNo,
    pageSize: refundNotifyQuery.pageSize,
    orderBy: refundNotifyQuery.orderBy,
    order: refundNotifyQuery.order,
    processStatus: optional(refundNotifyQuery.processStatus),
    keywords: optional(refundNotifyQuery.keywords)
  });
  refundNotifies.value = page.dataList;
  refundNotifyTotalCount.value = page.totalCount;
  refundNotifySummary.value = await summarizeAdminOrderRefundNotifies();
}

async function loadSyncAbnormal() {
  syncAbnormal.value = await getAdminOrderRefundSyncAbnormal({
    appCode: optional(query.appCode),
    businessType: optional(query.businessType),
    productCode: optional(query.productCode)
  });
}

async function loadCurrentTab() {
  loadError.value = '';
  try {
    if (activeTab.value === 'orders') {
      await loadOrders();
      return;
    }
    loading.value = true;
    if (activeTab.value === 'refunds') {
      await loadRefunds();
      return;
    }
    if (activeTab.value === 'notifies') {
      await loadRefundNotifies();
      return;
    }
    await loadSyncAbnormal();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '订单运营数据加载失败';
  } finally {
    loading.value = false;
  }
}

async function submitSearch() {
  query.pageNo = 1;
  refundQuery.pageNo = 1;
  refundNotifyQuery.pageNo = 1;
  await loadCurrentTab();
}

async function resetSearch() {
  query.pageNo = 1;
  query.appCode = '';
  query.businessType = '';
  query.productCode = '';
  query.status = '';
  query.keywords = '';
  refundQuery.status = '';
  refundQuery.keywords = '';
  refundNotifyQuery.processStatus = '';
  refundNotifyQuery.keywords = '';
  await loadCurrentTab();
}

async function syncPayment(row: AdminOrder) {
  paymentSyncingId.value = row.orderId;
  loadError.value = '';
  try {
    await syncAdminOrderPayment(row.orderId);
    await loadOrders();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '支付状态同步失败';
  } finally {
    paymentSyncingId.value = null;
  }
}

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1>订单与退款</h1>
        <p>跨小程序查看订单、退款、回调通知和补偿异常。</p>
      </div>
      <el-button :icon="Refresh" :loading="loading" @click="loadCurrentTab">刷新</el-button>
    </div>

    <el-alert v-if="loadError" class="page-alert" :title="loadError" type="error" show-icon />

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" label-position="top">
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="filter-select">
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="query.businessType" class="filter-select">
            <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品编码">
          <el-input v-model="query.productCode" class="filter-input" placeholder="contract_template" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="query.status" class="filter-select">
            <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="query.keywords" class="filter-input" placeholder="订单号 / 用户编号 / 标题" />
        </el-form-item>
        <el-form-item label="操作">
          <el-button type="primary" :icon="Search" @click="submitSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="summary-grid">
      <el-card v-for="item in summaryCards" :key="item.label" shadow="never">
        <div class="summary-label">{{ item.label }}</div>
        <div class="summary-value">{{ item.value }}</div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" @tab-change="loadCurrentTab">
      <el-tab-pane label="订单" name="orders">
        <el-table v-loading="loading" :data="orders" border>
          <el-table-column prop="orderNo" label="订单号" min-width="210" show-overflow-tooltip />
          <el-table-column prop="appCode" label="小程序" min-width="180" show-overflow-tooltip />
          <el-table-column prop="businessType" label="业务类型" min-width="150" show-overflow-tooltip />
          <el-table-column prop="productCode" label="产品" min-width="150" show-overflow-tooltip />
          <el-table-column prop="payerUserCode" label="用户编号" min-width="130" />
          <el-table-column label="订单金额" width="110">
            <template #default="{ row }">{{ formatMoney(row.amountTotal) }}</template>
          </el-table-column>
          <el-table-column label="已退" width="100">
            <template #default="{ row }">{{ formatMoney(row.refundedAmount) }}</template>
          </el-table-column>
          <el-table-column label="可退" width="100">
            <template #default="{ row }">{{ formatMoney(row.refundableAmount) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-tag :type="orderStatusTagType(row.status)">{{ orderStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="最新退款" width="110">
            <template #default="{ row }">{{ refundStatusText(row.latestRefundStatus) }}</template>
          </el-table-column>
          <el-table-column label="通知" width="100">
            <template #default="{ row }">{{ row.paymentNotifyCount }}/{{ row.refundNotifyCount }}</template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="160">
            <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 'pending_pay'"
                text
                type="primary"
                :loading="paymentSyncingId === row.orderId"
                @click="syncPayment(row)"
              >
                同步支付
              </el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">Total {{ totalCount }}</div>
      </el-tab-pane>

      <el-tab-pane label="退款" name="refunds">
        <template #label>
          <span data-test="refund-tab">退款</span>
        </template>
        <div class="summary-grid tab-summary">
          <el-card v-for="item in refundSummaryCards" :key="item.label" shadow="never">
            <div class="summary-label">{{ item.label }}</div>
            <div class="summary-value">{{ item.value }}</div>
          </el-card>
        </div>
        <el-table v-loading="loading" :data="refunds" border>
          <el-table-column prop="refundNo" label="退款单号" min-width="210" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="订单号" min-width="210" show-overflow-tooltip />
          <el-table-column prop="appCode" label="小程序" min-width="180" show-overflow-tooltip />
          <el-table-column label="退款金额" width="110">
            <template #default="{ row }">{{ formatMoney(row.refundAmount) }}</template>
          </el-table-column>
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-tag :type="refundStatusTagType(row.status)">{{ refundStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="wechatRefundStatus" label="微信状态" width="120" />
          <el-table-column prop="syncFailureCount" label="失败次数" width="100" />
          <el-table-column prop="lastSyncError" label="最近错误" min-width="180" show-overflow-tooltip />
          <el-table-column label="更新时间" min-width="160">
            <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
          </el-table-column>
        </el-table>
        <div class="table-footer">Total {{ refundTotalCount }}</div>
      </el-tab-pane>
      <el-tab-pane label="退款通知" name="notifies">
        <template #label>
          <span data-test="notify-tab">退款通知</span>
        </template>
        <div class="summary-grid tab-summary">
          <el-card v-for="item in notifySummaryCards" :key="item.label" shadow="never">
            <div class="summary-label">{{ item.label }}</div>
            <div class="summary-value">{{ item.value }}</div>
          </el-card>
        </div>
        <el-table v-loading="loading" :data="refundNotifies" border>
          <el-table-column prop="eventId" label="事件 ID" min-width="250" show-overflow-tooltip />
          <el-table-column prop="refundNo" label="退款单号" min-width="210" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="订单号" min-width="210" show-overflow-tooltip />
          <el-table-column label="处理状态" width="110">
            <template #default="{ row }">
              <el-tag :type="notifyStatusTagType(row.processStatus)">{{ notifyStatusText(row.processStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="refundStatus" label="微信状态" width="120" />
          <el-table-column prop="retryCount" label="重试" width="80" />
          <el-table-column prop="errorMessage" label="错误" min-width="180" show-overflow-tooltip />
          <el-table-column label="创建时间" min-width="160">
            <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
          </el-table-column>
        </el-table>
        <div class="table-footer">Total {{ refundNotifyTotalCount }}</div>
      </el-tab-pane>
      <el-tab-pane label="同步异常" name="abnormal">
        <template #label>
          <span data-test="abnormal-tab">同步异常</span>
        </template>
        <div class="summary-grid tab-summary">
          <el-card shadow="never">
            <div class="summary-label">同步异常</div>
            <div class="summary-value">{{ syncAbnormal?.abnormalCount ?? 0 }}</div>
          </el-card>
          <el-card shadow="never">
            <div class="summary-label">可重试</div>
            <div class="summary-value">{{ syncAbnormal?.readyToRetryCount ?? 0 }}</div>
          </el-card>
          <el-card shadow="never">
            <div class="summary-label">最早重试</div>
            <div class="summary-value small">{{ formatTime(syncAbnormal?.earliestNextSyncAt) }}</div>
          </el-card>
        </div>
        <el-table v-loading="loading" :data="syncAbnormal?.groups || []" border>
          <el-table-column prop="appCode" label="小程序" min-width="180" />
          <el-table-column prop="businessType" label="业务类型" min-width="160" />
          <el-table-column prop="abnormalCount" label="异常数" width="100" />
          <el-table-column prop="readyToRetryCount" label="可重试" width="100" />
          <el-table-column label="最早重试时间" min-width="160">
            <template #default="{ row }">{{ formatTime(row.earliestNextSyncAt) }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 6px 0 0;
  color: #667085;
}

.page-alert {
  margin-bottom: 0;
}

.filter-card :deep(.el-card__body) {
  padding-bottom: 2px;
}

.filter-select,
.filter-input {
  width: 180px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-label {
  color: #667085;
  font-size: 13px;
}

.summary-value {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.summary-value.small {
  font-size: 16px;
}

.tab-summary {
  margin-bottom: 12px;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0;
  color: #667085;
}
</style>
