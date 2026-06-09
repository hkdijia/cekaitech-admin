<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Refresh, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  getProductionStatus,
  pageAnnualCommonDataRevisions,
  pageAnnualCommonDataSyncBatches,
  pageLprRateRevisions,
  pageLprSyncBatches,
  syncAnnualCommonData,
  type AnnualCommonDataRevisionItem,
  type AnnualCommonDataSyncBatchItem,
  type AnnualCommonDataSyncItem,
  type AnnualCommonDataSyncPayload,
  type ProductionStatus,
  syncLprRates,
  type LprRateRevisionItem,
  type LprRateSyncItem,
  type LprSyncBatchItem
} from '../../api/dataGovernance';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const activeTab = ref('batches');
const appCode = ref(APP_CODE);
const loadingStatus = ref(false);
const loadingBatches = ref(false);
const loadingRevisions = ref(false);
const publishing = ref(false);
const loadError = ref('');
const batches = ref<LprSyncBatchItem[]>([]);
const revisions = ref<LprRateRevisionItem[]>([]);
const productionStatus = ref<ProductionStatus | null>(null);
const annualBatches = ref<AnnualCommonDataSyncBatchItem[]>([]);
const annualRevisions = ref<AnnualCommonDataRevisionItem[]>([]);
const lprSyncJson = ref(JSON.stringify({
  items: [
    {
      quoteDate: '2025-05-20',
      oneYearRate: 3,
      fiveYearPlusRate: 3.5,
      sourceVersion: 'pbc-2025-05-20'
    }
  ]
}, null, 2));
const annualCommonDataSyncJson = ref(JSON.stringify({
  requestId: 'crawler-annual-2024',
  sourceKey: 'annual_public_stats',
  sourceVersion: 'public-stats-2024',
  sourceClient: 'crawler-local',
  collectedAt: '2026-06-02T02:00:00+08:00',
  lastCheckedDate: '2026-06-02',
  mode: 'strict',
  payloadHash: 'hash-annual-2024',
  items: [
    {
      regionCode: 'cn-shanghai',
      regionName: '上海市',
      year: 2024,
      metricKey: 'average_salary',
      metricName: '平均工资',
      value: 120000,
      unit: '元/年',
      sourceName: '统计公报',
      sourceUrl: 'https://tjj.sh.gov.cn/'
    }
  ]
}, null, 2));

function currentAppCode() {
  const value = appCode.value.trim();
  if (value) {
    return value;
  }
  return APP_CODE;
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function statusTagType(status: string) {
  if (status === 'published' || status === 'success') {
    return 'success';
  }
  if (status === 'failed') {
    return 'danger';
  }
  return 'info';
}

function readinessTagType(ready: boolean) {
  if (ready) {
    return 'success';
  }
  return 'danger';
}

function parseLprSyncJson(value: string): LprRateSyncItem[] {
  const parsed = JSON.parse(value) as { items?: unknown };
  if (!Array.isArray(parsed.items)) {
    throw new Error('LPR JSON 必须包含 items 数组');
  }
  return parsed.items as LprRateSyncItem[];
}

function parseAnnualCommonDataSyncJson(value: string): Omit<AnnualCommonDataSyncPayload, 'appCode'> {
  const parsed = JSON.parse(value) as {
    requestId?: unknown;
    sourceKey?: unknown;
    sourceVersion?: unknown;
    sourceClient?: unknown;
    collectedAt?: unknown;
    lastCheckedDate?: unknown;
    mode?: unknown;
    payloadHash?: unknown;
    items?: unknown;
  };
  if (!Array.isArray(parsed.items)) {
    throw new Error('年度数据 JSON 必须包含 items 数组');
  }
  return {
    requestId: String(parsed.requestId ?? ''),
    sourceKey: String(parsed.sourceKey ?? ''),
    sourceVersion: typeof parsed.sourceVersion === 'string' ? parsed.sourceVersion : undefined,
    sourceClient: typeof parsed.sourceClient === 'string' ? parsed.sourceClient : undefined,
    collectedAt: typeof parsed.collectedAt === 'string' ? parsed.collectedAt : undefined,
    lastCheckedDate: typeof parsed.lastCheckedDate === 'string' ? parsed.lastCheckedDate : undefined,
    mode: typeof parsed.mode === 'string' ? parsed.mode : undefined,
    payloadHash: String(parsed.payloadHash ?? ''),
    items: parsed.items as AnnualCommonDataSyncItem[]
  };
}

async function loadBatches() {
  loadingBatches.value = true;
  loadError.value = '';
  try {
    const result = await pageLprSyncBatches({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    batches.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '同步批次加载失败';
    batches.value = [];
  } finally {
    loadingBatches.value = false;
  }
}

async function loadRevisions() {
  loadingRevisions.value = true;
  loadError.value = '';
  try {
    const result = await pageLprRateRevisions({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    revisions.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '修订记录加载失败';
    revisions.value = [];
  } finally {
    loadingRevisions.value = false;
  }
}

async function loadAnnualBatches() {
  loadingBatches.value = true;
  loadError.value = '';
  try {
    const result = await pageAnnualCommonDataSyncBatches({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    annualBatches.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据同步批次加载失败';
    annualBatches.value = [];
  } finally {
    loadingBatches.value = false;
  }
}

async function loadAnnualRevisions() {
  loadingRevisions.value = true;
  loadError.value = '';
  try {
    const result = await pageAnnualCommonDataRevisions({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    annualRevisions.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据修订记录加载失败';
    annualRevisions.value = [];
  } finally {
    loadingRevisions.value = false;
  }
}

async function loadProductionStatus() {
  loadingStatus.value = true;
  loadError.value = '';
  try {
    productionStatus.value = await getProductionStatus({
      appCode: currentAppCode()
    });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '生产巡检状态加载失败';
    productionStatus.value = null;
  } finally {
    loadingStatus.value = false;
  }
}

async function refreshAll() {
  await Promise.all([loadProductionStatus(), loadBatches(), loadRevisions(), loadAnnualBatches(), loadAnnualRevisions()]);
}

async function publishLprSync() {
  publishing.value = true;
  loadError.value = '';
  try {
    const items = parseLprSyncJson(lprSyncJson.value);
    const result = await syncLprRates({
      appCode: currentAppCode(),
      items
    });
    ElMessage.success(`LPR JSON 已发布：${result.batchNo}`);
    await refreshAll();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'LPR JSON 发布失败';
  } finally {
    publishing.value = false;
  }
}

async function publishAnnualCommonDataSync() {
  publishing.value = true;
  loadError.value = '';
  try {
    const parsed = parseAnnualCommonDataSyncJson(annualCommonDataSyncJson.value);
    const result = await syncAnnualCommonData({
      appCode: currentAppCode(),
      ...parsed
    });
    ElMessage.success(`年度数据 JSON 已导入：${result.requestId}`);
    await Promise.all([loadAnnualBatches(), loadAnnualRevisions()]);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据 JSON 导入失败';
  } finally {
    publishing.value = false;
  }
}

onMounted(refreshAll);
</script>

<template>
  <section>
    <h1 class="page-title">数据同步/发布</h1>
    <p class="page-subtitle">通过 miniapp-backend 受控 API 管理法律助手业务数据同步批次、修订记录、LPR JSON 发布和年度数据 JSON 导入。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="status-panel" v-loading="loadingStatus">
      <div class="status-header">
        <div>
          <div class="toolbar-title">生产巡检</div>
          <div class="toolbar-subtitle">只读汇总生产测试库关键数据状态，不触发采集或写入。</div>
        </div>
        <el-tag v-if="productionStatus" :type="readinessTagType(productionStatus.ready)" effect="plain">
          {{ productionStatus.ready ? '就绪' : '需处理' }}
        </el-tag>
      </div>
      <div v-if="productionStatus" class="status-grid">
        <div class="status-item">
          <div class="status-label">数据库迁移</div>
          <div class="status-value">Flyway V{{ productionStatus.flyway.version }}</div>
          <div class="status-note">{{ productionStatus.flyway.success ? '迁移成功' : '迁移异常' }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">品牌残留</div>
          <div class="status-value">
            {{ productionStatus.brand.oldBrandBannerCount + productionStatus.brand.oldBrandCapabilityCount }} 处
          </div>
          <div class="status-note">公告 / 工具来源旧文案</div>
        </div>
        <div class="status-item">
          <div class="status-label">LPR</div>
          <div class="status-value">LPR {{ productionStatus.lpr.count }} 条</div>
          <div class="status-note">{{ productionStatus.lpr.minQuoteDate }} 至 {{ productionStatus.lpr.maxQuoteDate }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">年度数据</div>
          <div class="status-value">年度数据 {{ productionStatus.annualCommonData.count }} 条</div>
          <div class="status-note">{{ productionStatus.annualCommonData.minYear }} 至 {{ productionStatus.annualCommonData.maxYear }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">示范文本</div>
          <div class="status-value">示范文本 {{ productionStatus.elementTemplate.count }} 份</div>
          <div class="status-note">缺失文件元数据 {{ productionStatus.elementTemplate.missingFileMetadataCount }} 份</div>
        </div>
        <div class="status-item">
          <div class="status-label">民事案由</div>
          <div class="status-value">民事案由 {{ productionStatus.civilCause.count }} 项</div>
          <div class="status-note">官方目录与业务别名合并口径</div>
        </div>
      </div>
      <el-empty v-else description="暂无生产巡检数据" />
    </el-card>

    <el-card shadow="never" class="governance-panel">
      <div class="toolbar">
        <el-form class="app-form" label-width="72px" inline>
          <el-form-item label="appCode">
            <el-input v-model="appCode" class="app-code-input" />
          </el-form-item>
        </el-form>
        <div class="toolbar-actions">
          <el-button :icon="Refresh" @click="refreshAll">刷新</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="同步批次" name="batches">
          <div class="section-heading">
            <div class="toolbar-title">LPR 同步批次</div>
            <div class="toolbar-subtitle">展示后端受控同步或发布动作形成的批次记录。</div>
          </div>
          <el-table v-loading="loadingBatches" :data="batches" row-key="id">
            <el-table-column prop="batchNo" label="批次号" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column prop="itemCount" label="条目数" width="90" />
            <el-table-column prop="importedCount" label="导入数" width="90" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="说明" min-width="180" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="修订记录" name="revisions">
          <div class="section-heading">
            <div class="toolbar-title">LPR 修订记录</div>
            <div class="toolbar-subtitle">按批次跟踪每个报价日期的新增、更新和复核结果。</div>
          </div>
          <el-table v-loading="loadingRevisions" :data="revisions" row-key="id">
            <el-table-column prop="batchNo" label="批次号" min-width="190" show-overflow-tooltip />
            <el-table-column prop="quoteDate" label="报价日期" width="130" />
            <el-table-column prop="oneYearRate" label="一年期 LPR" width="130" />
            <el-table-column prop="fiveYearPlusRate" label="五年期以上" width="130" />
            <el-table-column prop="revisionType" label="修订类型" width="120" />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="年度数据同步批次" name="annual-batches">
          <div class="section-heading">
            <div class="toolbar-title">年度数据同步批次</div>
            <div class="toolbar-subtitle">展示年度常用数据受控同步形成的批次、状态和冲突统计。</div>
          </div>
          <el-table v-loading="loadingBatches" :data="annualBatches" row-key="id">
            <el-table-column prop="requestId" label="请求标识" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceKey" label="来源标识" min-width="160" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column prop="itemCount" label="条目数" width="90" />
            <el-table-column prop="createdCount" label="新增" width="80" />
            <el-table-column prop="updatedCount" label="更新" width="80" />
            <el-table-column prop="conflictCount" label="冲突" width="80" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="年度数据修订记录" name="annual-revisions">
          <div class="section-heading">
            <div class="toolbar-title">年度数据修订记录</div>
            <div class="toolbar-subtitle">按地区、年度和指标跟踪新增、更新、跳过和冲突记录。</div>
          </div>
          <el-table v-loading="loadingRevisions" :data="annualRevisions" row-key="id">
            <el-table-column prop="batchId" label="批次 ID" width="100" />
            <el-table-column prop="regionCode" label="地区编码" min-width="140" show-overflow-tooltip />
            <el-table-column prop="year" label="年度" width="90" />
            <el-table-column prop="metricKey" label="指标标识" min-width="180" show-overflow-tooltip />
            <el-table-column prop="changeType" label="修订类型" width="120" />
            <el-table-column prop="message" label="说明" min-width="160" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="LPR JSON 发布" name="json">
          <div class="section-heading">
            <div class="toolbar-title">LPR JSON 发布</div>
            <div class="toolbar-subtitle">粘贴结构化 JSON，由后端校验、落库并形成同步批次。</div>
          </div>
          <textarea
            v-model="lprSyncJson"
            data-test="lpr-sync-json"
            class="json-editor"
            rows="14"
            spellcheck="false"
          />
          <div class="publish-actions">
            <el-button
              data-test="publish-lpr-sync"
              type="primary"
              :icon="Upload"
              :loading="publishing"
              @click="publishLprSync"
            >
              发布 LPR JSON
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="年度数据 JSON 导入" name="annual-json">
          <div class="section-heading">
            <div class="toolbar-title">年度数据 JSON 导入</div>
            <div class="toolbar-subtitle">粘贴 crawler 规范化年度数据快照，由后端校验、落库并形成同步批次。</div>
          </div>
          <textarea
            v-model="annualCommonDataSyncJson"
            data-test="annual-common-data-sync-json"
            class="json-editor"
            rows="14"
            spellcheck="false"
          />
          <div class="publish-actions">
            <el-button
              data-test="publish-annual-common-data-sync"
              type="primary"
              :icon="Upload"
              :loading="publishing"
              @click="publishAnnualCommonDataSync"
            >
              导入年度数据 JSON
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.governance-panel {
  min-height: 560px;
}

.status-panel {
  margin-bottom: 16px;
}

.status-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.status-item {
  border: 1px solid #eaecf0;
  border-radius: 6px;
  padding: 12px;
  background: #fcfcfd;
}

.status-label {
  color: #667085;
  font-size: 12px;
}

.status-value {
  margin-top: 6px;
  color: #101828;
  font-size: 17px;
  font-weight: 600;
}

.status-note {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.app-form {
  min-width: 360px;
}

.app-code-input {
  width: 300px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-heading {
  margin-bottom: 12px;
}

.toolbar-title {
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

.json-editor {
  width: 100%;
  min-height: 320px;
  resize: vertical;
  color: #1d2939;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px 12px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.6;
}

.json-editor:focus {
  border-color: #409eff;
  outline: none;
}

.publish-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

@media (max-width: 720px) {
  .toolbar {
    flex-direction: column;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .app-form,
  .app-code-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
