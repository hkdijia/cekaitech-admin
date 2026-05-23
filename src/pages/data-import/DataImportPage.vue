<script setup lang="ts">
import { computed, ref } from 'vue';
import { Delete, Upload } from '@element-plus/icons-vue';
import { analyzeImportJson } from './importPreflight';

const jsonText = ref('');
const sourceName = ref('手动粘贴');
const fileInputRef = ref<HTMLInputElement | null>(null);

const preflight = computed(() => analyzeImportJson(jsonText.value));
const hasInput = computed(() => jsonText.value.trim().length > 0);
const visibleFieldStats = computed(() => preflight.value.fieldStats.slice(0, 12));

const statusTagType = computed(() => {
  if (preflight.value.status === 'ready') {
    return 'success';
  }
  if (preflight.value.status === 'invalid') {
    return 'danger';
  }
  return 'info';
});

const statusText = computed(() => {
  if (preflight.value.status === 'ready') {
    return '预检完成';
  }
  if (preflight.value.status === 'invalid') {
    return '需修正';
  }
  return '等待输入';
});

function openFilePicker() {
  fileInputRef.value?.click();
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  sourceName.value = file.name;
  jsonText.value = await file.text();
  input.value = '';
}

function clearInput() {
  jsonText.value = '';
  sourceName.value = '手动粘贴';
}

function completenessType(completeness: number) {
  if (completeness === 100) {
    return 'success';
  }
  if (completeness >= 80) {
    return 'warning';
  }
  return 'danger';
}
</script>

<template>
  <section>
    <h1 class="page-title">数据导入</h1>
    <p class="page-subtitle">本地预检 crawler 导出 JSON，确认结构、字段完整度和敏感字段后，再规划受控后端接入。</p>

    <el-alert
      class="local-only-alert"
      type="info"
      title="仅本地预检，暂不上传"
      description="当前页面不会调用后端 API，不直连数据库，也不控制 crawler；后续导入会通过 miniapp-backend 受控 API 接入。"
      show-icon
      :closable="false"
    />

    <div class="workbench-grid">
      <el-card shadow="never" class="input-panel">
        <template #header>
          <div class="panel-header">
            <span>JSON 来源</span>
            <el-tag :type="statusTagType" effect="plain">{{ statusText }}</el-tag>
          </div>
        </template>

        <div class="toolbar">
          <input ref="fileInputRef" class="file-input" type="file" accept=".json,application/json" @change="handleFileSelect" />
          <el-button :icon="Upload" @click="openFilePicker">选择 JSON</el-button>
          <el-button :icon="Delete" :disabled="!hasInput" @click="clearInput">清空</el-button>
          <span class="source-name">{{ sourceName }}</span>
        </div>

        <el-input
          v-model="jsonText"
          class="json-editor"
          type="textarea"
          :rows="18"
          resize="vertical"
          spellcheck="false"
          placeholder='粘贴 crawler 导出的 JSON，例如 [{"id":1,"title":"示例"}] 或 {"records":[...]}'
        />
      </el-card>

      <div class="result-column">
        <el-row :gutter="12">
          <el-col :xs="12" :sm="6" :lg="12">
            <el-card shadow="never" class="metric-card">
              <div class="metric-label">记录数</div>
              <div class="metric-value">{{ preflight.recordCount }}</div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="12">
            <el-card shadow="never" class="metric-card">
              <div class="metric-label">字段数</div>
              <div class="metric-value">{{ preflight.fieldStats.length }}</div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="12">
            <el-card shadow="never" class="metric-card">
              <div class="metric-label">敏感提醒</div>
              <div class="metric-value danger">{{ preflight.sensitiveWarnings.length }}</div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="12">
            <el-card shadow="never" class="metric-card">
              <div class="metric-label">记录来源</div>
              <div class="metric-value small">{{ preflight.recordSource || '-' }}</div>
            </el-card>
          </el-col>
        </el-row>

        <el-alert v-if="preflight.status === 'invalid'" class="result-alert" type="error" :title="preflight.errorMessage" show-icon />
        <el-alert
          v-if="preflight.status === 'ready' && !preflight.sensitiveWarnings.length"
          class="result-alert"
          type="success"
          title="未发现已知敏感字段"
          show-icon
        />

        <el-card shadow="never" class="table-panel">
          <template #header>
            <div class="panel-header">
              <span>字段完整度</span>
              <span class="header-hint">顶层字段，最多显示 12 项</span>
            </div>
          </template>
          <el-table :data="visibleFieldStats" size="small" empty-text="暂无字段">
            <el-table-column prop="field" label="字段" min-width="140" show-overflow-tooltip />
            <el-table-column label="完整度" width="110">
              <template #default="{ row }">
                <el-tag :type="completenessType(row.completeness)" effect="plain">{{ row.completeness }}%</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="presentCount" label="有值" width="76" />
            <el-table-column prop="missingCount" label="缺失" width="76" />
          </el-table>
        </el-card>

        <el-card shadow="never" class="table-panel">
          <template #header>
            <div class="panel-header">
              <span>敏感字段提醒</span>
              <span class="header-hint">命中项不应进入上传流程</span>
            </div>
          </template>
          <el-table :data="preflight.sensitiveWarnings" size="small" empty-text="暂无提醒">
            <el-table-column prop="field" label="字段路径" min-width="170" show-overflow-tooltip />
            <el-table-column prop="hitCount" label="次数" width="70" />
            <el-table-column prop="reason" label="原因" min-width="160" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.local-only-alert {
  margin-bottom: 16px;
}

.workbench-grid {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(360px, 520px);
  gap: 16px;
  align-items: start;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-hint,
.source-name,
.metric-label {
  color: #667085;
  font-size: 13px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.file-input {
  display: none;
}

.source-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.json-editor {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

.result-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-card {
  margin-bottom: 12px;
}

.metric-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}

.metric-value.small {
  overflow: hidden;
  color: #344054;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-value.danger {
  color: #b42318;
}

.result-alert {
  margin-bottom: 0;
}

@media (max-width: 1080px) {
  .workbench-grid {
    grid-template-columns: 1fr;
  }
}
</style>
