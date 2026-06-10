<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  inspectLegalToolReadiness,
  type LegalToolReadinessInspectResult,
  type LegalToolReadinessIssue
} from '../../api/legalToolCenter';
import { useWorkspaceStore } from '../../stores/workspace';

const workspace = useWorkspaceStore();
const readiness = ref<LegalToolReadinessInspectResult | null>(null);
const loading = ref(false);
const loadError = ref('');

const currentWorkspace = computed(() => workspace.currentWorkspace);
const isMiniappWorkspace = computed(() => currentWorkspace.value && currentWorkspace.value.appCode !== 'global');
const pageTitle = computed(() => {
  if (!isMiniappWorkspace.value) {
    return '小程序工作台';
  }
  return `${currentWorkspace.value.name}工作台`;
});

const blockedItems = computed(() => readiness.value?.items.filter((item) => item.readiness === 'blocked') ?? []);
const warningItems = computed(() => readiness.value?.items.filter((item) => item.readiness === 'warning') ?? []);

onMounted(() => {
  loadReadiness();
});

watch(() => currentWorkspace.value.appCode, () => {
  loadReadiness();
});

async function loadReadiness() {
  readiness.value = null;
  loadError.value = '';
  if (!isMiniappWorkspace.value) {
    return;
  }
  loading.value = true;
  try {
    readiness.value = await inspectLegalToolReadiness({ appCode: currentWorkspace.value.appCode });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '工具完整性加载失败';
  } finally {
    loading.value = false;
  }
}

function readinessTagType(value: string) {
  if (value === 'pass') {
    return 'success';
  }
  if (value === 'warning') {
    return 'warning';
  }
  return 'danger';
}

function readinessText(value: string) {
  if (value === 'pass') {
    return '可启用';
  }
  if (value === 'warning') {
    return '需复核';
  }
  return '阻塞';
}

function issueMessages(issues: LegalToolReadinessIssue[]) {
  return issues.map((item) => item.message).join('；');
}
</script>

<template>
  <section>
    <h1 class="page-title">{{ pageTitle }}</h1>
    <p class="page-subtitle">当前工作区的配置入口、工具完整性和后续启用准备。</p>

    <el-empty v-if="!isMiniappWorkspace" description="请选择一个小程序工作区" />

    <template v-else>
      <el-alert
        v-if="loadError"
        class="section-alert"
        :title="loadError"
        type="error"
        :closable="false"
        show-icon
      />

      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="metric-card">
            <div class="metric-label">工具完整性</div>
            <div class="metric-value">{{ readiness?.totalCapabilityCount ?? '-' }}</div>
            <div class="metric-hint">工具能力总数</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="metric-card">
            <div class="metric-label">可启用候选</div>
            <div class="metric-value">{{ readiness?.readyCount ?? '-' }}</div>
            <div class="metric-hint">检查项全部通过</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="metric-card">
            <div class="metric-label">需复核</div>
            <div class="metric-value">{{ readiness?.warningCount ?? '-' }}</div>
            <div class="metric-hint">可继续评估</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="metric-card">
            <div class="metric-label">阻塞</div>
            <div class="metric-value">{{ readiness?.blockedCount ?? '-' }}</div>
            <div class="metric-hint">暂不建议启用</div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-head">
            <span>工具完整性检查</span>
            <el-button type="primary" plain :loading="loading" @click="loadReadiness">刷新</el-button>
          </div>
        </template>

        <el-table :data="readiness?.items ?? []" v-loading="loading">
          <el-table-column prop="title" label="工具" min-width="150" />
          <el-table-column prop="toolKey" label="标识" min-width="180" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="readinessTagType(row.readiness)">{{ readinessText(row.readiness) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="公开入口" width="100">
            <template #default="{ row }">{{ row.publicExposure ? '已配置' : '缺失' }}</template>
          </el-table-column>
          <el-table-column label="蓝图" width="100">
            <template #default="{ row }">{{ row.reviewedBlueprint ? '已评审' : '缺失' }}</template>
          </el-table-column>
          <el-table-column label="问题" min-width="260">
            <template #default="{ row }">
              <span v-if="row.issues.length === 0">无</span>
              <span v-else>{{ issueMessages(row.issues) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-if="blockedItems.length > 0 || warningItems.length > 0" shadow="never" class="section-card">
        <template #header>待处理摘要</template>
        <div class="summary-list">
          <div v-for="item in blockedItems" :key="`blocked-${item.toolKey}`" class="summary-item">
            <el-tag type="danger">阻塞</el-tag>
            <span>{{ item.title }}</span>
            <small>{{ item.issues[0]?.message }}</small>
          </div>
          <div v-for="item in warningItems" :key="`warning-${item.toolKey}`" class="summary-item">
            <el-tag type="warning">复核</el-tag>
            <span>{{ item.title }}</span>
            <small>{{ item.issues[0]?.message }}</small>
          </div>
        </div>
      </el-card>
    </template>
  </section>
</template>

<style scoped>
.section-alert,
.metric-card {
  margin-bottom: 16px;
}

.metric-label,
.metric-hint {
  color: #667085;
  font-size: 13px;
}

.metric-value {
  margin: 10px 0;
  font-size: 30px;
  font-weight: 700;
}

.section-card {
  margin-top: 8px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary-list {
  display: grid;
  gap: 10px;
}

.summary-item {
  display: grid;
  grid-template-columns: 64px minmax(120px, 220px) 1fr;
  align-items: center;
  gap: 12px;
}

.summary-item small {
  color: #667085;
}
</style>
