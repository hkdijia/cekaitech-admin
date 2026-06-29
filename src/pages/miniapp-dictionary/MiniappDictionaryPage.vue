<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import {
  pageMiniappDictionaryGroups,
  pageMiniappDictionaryItems,
  type MiniappDictionaryGroup,
  type MiniappDictionaryItem
} from '../../api/miniappDictionary';
import { useWorkspaceStore } from '../../stores/workspace';
import { isWorkspaceAppLocked, resolveCurrentAppCode } from '../../utils/miniappAppContext';

const PAGE_SIZE = 50;

const workspace = useWorkspaceStore();
const currentAppCode = computed(() => resolveCurrentAppCode(undefined, workspace.currentWorkspace.appCode));
const appCodeLocked = computed(() => isWorkspaceAppLocked(workspace.currentWorkspace.appCode));
const loading = ref(false);
const itemLoading = ref(false);
const loadError = ref('');
const groups = ref<MiniappDictionaryGroup[]>([]);
const items = ref<MiniappDictionaryItem[]>([]);
const selectedGroupCode = ref('');

const query = reactive({
  appCode: currentAppCode.value,
  enabled: 'enabled'
});

const appOptions = [
  { label: '阳律通', value: 'lawsuit-material-assistant' },
  { label: '朋友局计分', value: 'party-scorekeeper-miniapp' }
];

const enabledOptions = [
  { label: '启用', value: 'enabled' },
  { label: '停用', value: 'disabled' },
  { label: '全部', value: '' }
];

const selectedGroup = computed(() => groups.value.find((item) => item.groupCode === selectedGroupCode.value));

function statusTagType(enabled: boolean) {
  return enabled ? 'success' : 'info';
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

async function loadGroups() {
  if (appCodeLocked.value) {
    query.appCode = currentAppCode.value;
  }
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappDictionaryGroups({
      appCode: query.appCode,
      enabled: query.enabled || undefined,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    groups.value = result.dataList;
    if (!selectedGroupCode.value || !groups.value.some((item) => item.groupCode === selectedGroupCode.value)) {
      selectedGroupCode.value = groups.value[0]?.groupCode ?? '';
    }
    await loadItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '字典分组加载失败';
    groups.value = [];
    items.value = [];
    selectedGroupCode.value = '';
  } finally {
    loading.value = false;
  }
}

async function loadItems() {
  if (!selectedGroupCode.value) {
    items.value = [];
    return;
  }
  itemLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappDictionaryItems({
      appCode: query.appCode,
      groupCode: selectedGroupCode.value,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    items.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '字典项加载失败';
    items.value = [];
  } finally {
    itemLoading.value = false;
  }
}

function handleGroupChange(groupCode: string) {
  selectedGroupCode.value = groupCode;
  loadItems();
}

function refreshAll() {
  loadGroups();
}

onMounted(loadGroups);
</script>

<template>
  <section>
    <h1 class="page-title">字典管理</h1>
    <p class="page-subtitle">按小程序查看平台字典分组和字典项；当前阶段为只读治理入口。</p>

    <el-card shadow="never" class="filter-panel">
      <el-form class="filter-form" :inline="true" @submit.prevent>
        <el-form-item label="小程序">
          <el-select v-model="query.appCode" class="app-select" :disabled="appCodeLocked" @change="refreshAll">
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组状态">
          <el-select v-model="query.enabled" class="status-select" @change="refreshAll">
            <el-option v-for="item in enabledOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :icon="Refresh" :loading="loading" @click="refreshAll">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <div class="dictionary-layout">
      <el-card shadow="never" class="group-panel">
        <template #header>
          <div class="panel-title">字典分组</div>
        </template>
        <el-table v-loading="loading" :data="groups" row-key="groupId" highlight-current-row @row-click="(row: MiniappDictionaryGroup) => handleGroupChange(row.groupCode)">
          <el-table-column prop="groupCode" label="分组编码" min-width="170" show-overflow-tooltip />
          <el-table-column prop="groupName" label="名称" min-width="150" show-overflow-tooltip />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '停用' }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="item-panel">
        <template #header>
          <div class="panel-title">
            字典项
            <span v-if="selectedGroup" class="panel-subtitle">{{ selectedGroup.groupName }}</span>
          </div>
        </template>
        <el-table v-loading="itemLoading" :data="items" row-key="itemId">
          <el-table-column prop="itemCode" label="编码" width="150" show-overflow-tooltip />
          <el-table-column prop="itemLabel" label="名称" width="130" />
          <el-table-column prop="itemValue" label="值" width="130" show-overflow-tooltip />
          <el-table-column prop="description" label="说明" min-width="240" show-overflow-tooltip />
          <el-table-column prop="tagType" label="标签" width="100" />
          <el-table-column prop="sortOrder" label="排序" width="80" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="170">
            <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
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

.app-select {
  width: 180px;
}

.status-select {
  width: 120px;
}

.error-alert {
  margin-bottom: 16px;
}

.dictionary-layout {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 16px;
}

.panel-title {
  color: #344054;
  font-size: 15px;
  font-weight: 700;
}

.panel-subtitle {
  margin-left: 8px;
  color: #667085;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 900px) {
  .dictionary-layout {
    grid-template-columns: 1fr;
  }
}
</style>
