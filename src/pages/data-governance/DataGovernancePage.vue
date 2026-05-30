<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Refresh, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  pageLprRateRevisions,
  pageLprSyncBatches,
  syncLprRates,
  type LprRateRevisionItem,
  type LprRateSyncItem,
  type LprSyncBatchItem
} from '../../api/dataGovernance';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const activeTab = ref('batches');
const appCode = ref(APP_CODE);
const loadingBatches = ref(false);
const loadingRevisions = ref(false);
const publishing = ref(false);
const loadError = ref('');
const batches = ref<LprSyncBatchItem[]>([]);
const revisions = ref<LprRateRevisionItem[]>([]);
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

function parseLprSyncJson(value: string): LprRateSyncItem[] {
  const parsed = JSON.parse(value) as { items?: unknown };
  if (!Array.isArray(parsed.items)) {
    throw new Error('LPR JSON 必须包含 items 数组');
  }
  return parsed.items as LprRateSyncItem[];
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

async function refreshAll() {
  await Promise.all([loadBatches(), loadRevisions()]);
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

onMounted(refreshAll);
</script>

<template>
  <section>
    <h1 class="page-title">数据同步/发布</h1>
    <p class="page-subtitle">通过 miniapp-backend 受控 API 管理法律助手业务数据同步批次、修订记录和 LPR JSON 发布。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

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

  .app-form,
  .app-code-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
