<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { EditPen, Plus, Refresh, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  disableMiniappDocumentCatalogItem,
  pageMiniappDocumentCatalogItems,
  saveMiniappDocumentCatalogItem,
  type MiniappDocumentCatalogItem,
  type MiniappDocumentCatalogPayload
} from '../../api/miniappDocumentCatalog';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const auth = useAuthStore();
const loading = ref(false);
const loadError = ref('');
const items = ref<MiniappDocumentCatalogItem[]>([]);
const itemDialogVisible = ref(false);
const submitting = ref(false);

const itemForm = reactive<MiniappDocumentCatalogPayload>({
  id: 0,
  appCode: APP_CODE,
  caseType: '',
  title: '',
  description: '',
  targetPath: '',
  action: 'coming_soon',
  status: 'coming_soon',
  statusText: '文书骨架待补充',
  iconKey: 'file-text',
  sortOrder: 10,
  enabled: true
});

const actionOptions = [
  { label: '免费文书', value: 'free_document' },
  { label: '暂未开放', value: 'coming_soon' }
];

const statusOptions = [
  { label: '开放', value: 'open' },
  { label: '暂未开放', value: 'coming_soon' },
  { label: '隐藏', value: 'hidden' }
];

const canManageDocumentCatalog = computed(() => auth.hasPermission('admin:miniapp-document-catalog:manage'));

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function statusTagType(enabled: boolean) {
  return enabled ? 'success' : 'info';
}

function normalizePayloadId<T extends { id: number }>(payload: T) {
  return {
    ...payload,
    id: payload.id || undefined
  };
}

async function loadItems() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappDocumentCatalogItems({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    items.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '文书目录加载失败';
    items.value = [];
  } finally {
    loading.value = false;
  }
}

function openItemDialog(row?: MiniappDocumentCatalogItem) {
  Object.assign(itemForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    caseType: row?.caseType ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    targetPath: row?.targetPath ?? '',
    action: row?.action ?? 'coming_soon',
    status: row?.status ?? 'coming_soon',
    statusText: row?.statusText ?? '文书骨架待补充',
    iconKey: row?.iconKey ?? 'file-text',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  itemDialogVisible.value = true;
}

async function submitItem() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveMiniappDocumentCatalogItem(normalizePayloadId(itemForm));
    itemDialogVisible.value = false;
    ElMessage.success('文书目录已保存');
    await loadItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '文书目录保存失败';
  } finally {
    submitting.value = false;
  }
}

async function disableItem(row: MiniappDocumentCatalogItem) {
  await ElMessageBox.confirm(`确认禁用文书目录「${row.title}」？`, '禁用文书目录', { type: 'warning' });
  await disableMiniappDocumentCatalogItem(row.id, APP_CODE);
  await loadItems();
}

onMounted(loadItems);
</script>

<template>
  <section>
    <h1 class="page-title">文书目录配置</h1>
    <p class="page-subtitle">维护阳光法律助手起诉文书生成目录、开放状态和受控页面指向。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <div class="toolbar">
        <div>
          <div class="toolbar-title">起诉文书生成目录</div>
          <div class="toolbar-subtitle">简单法律工具仍由小程序页面生成，目录和页面指向优先后台配置。</div>
        </div>
        <div class="toolbar-actions">
          <el-button :icon="Refresh" @click="loadItems">刷新</el-button>
          <el-button v-if="canManageDocumentCatalog" type="primary" :icon="Plus" @click="openItemDialog()">
            新增目录
          </el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="items" row-key="id">
        <el-table-column prop="caseType" label="案件类型" width="150" />
        <el-table-column prop="title" label="名称" width="160" />
        <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
        <el-table-column prop="targetPath" label="页面路径" min-width="260" show-overflow-tooltip />
        <el-table-column prop="action" label="动作" width="120" />
        <el-table-column prop="statusText" label="状态文案" width="150" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="启用状态" width="104">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column v-if="canManageDocumentCatalog" label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button :icon="EditPen" text type="primary" @click="openItemDialog(row)">编辑</el-button>
            <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableItem(row)">
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="itemDialogVisible" title="文书目录" width="640px">
      <el-form label-width="96px">
        <el-form-item label="案件类型"><el-input v-model="itemForm.caseType" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="itemForm.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="itemForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="页面路径"><el-input v-model="itemForm.targetPath" /></el-form-item>
        <el-form-item label="动作">
          <el-select v-model="itemForm.action" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态">
          <el-select v-model="itemForm.status" class="full-input">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态文案"><el-input v-model="itemForm.statusText" /></el-form-item>
        <el-form-item label="图标 Key"><el-input v-model="itemForm.iconKey" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="itemForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="itemForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitItem">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.config-panel {
  min-height: 520px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.full-input {
  width: 100%;
}
</style>
