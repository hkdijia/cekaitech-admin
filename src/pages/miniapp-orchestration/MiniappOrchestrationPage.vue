<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  loadMiniappOrchestrationTree,
  saveMiniappOrchestrationEntry,
  type MiniappOrchestrationEntryPayload,
  type MiniappOrchestrationNode
} from '../../api/miniappOrchestration';
import MiniappIconPicker from '../../components/miniapp-icon-picker/MiniappIconPicker.vue';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';

const auth = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const loadError = ref('');
const tree = ref<MiniappOrchestrationNode | null>(null);
const selectedNode = ref<MiniappOrchestrationNode | null>(null);

const entryForm = reactive<MiniappOrchestrationEntryPayload>({
  sourceType: '',
  sourceId: 0,
  title: '',
  description: '',
  targetPath: '',
  action: 'navigate',
  status: 'open',
  statusText: '可用',
  iconKey: '',
  visibility: 'public',
  releaseStage: 'public',
  sortOrder: 10,
  enabled: true
});

const actionOptions = [
  { label: '页面跳转', value: 'navigate' },
  { label: '切换 Tab', value: 'switch_tab' },
  { label: '免费文书', value: 'free_document' },
  { label: '预约咨询', value: 'consultation' },
  { label: '模块更多', value: 'module_more' },
  { label: '暂未开放', value: 'coming_soon' }
];

const statusOptions = [
  { label: '开放', value: 'open' },
  { label: '暂未开放', value: 'coming_soon' },
  { label: '预约咨询', value: 'consultation' },
  { label: '锁定', value: 'locked' }
];

const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '隐藏', value: 'hidden' },
  { label: '内测', value: 'beta' }
];

const releaseStageOptions = [
  { label: '公开', value: 'public' },
  { label: '试运行', value: 'pilot' },
  { label: '草稿', value: 'draft' }
];

const selectedIsEntry = computed(() => selectedNode.value?.nodeType === 'entry');
const selectedCanManage = computed(() => {
  if (!selectedNode.value || selectedNode.value.nodeType !== 'entry') {
    return false;
  }
  if (selectedNode.value.sourceType === 'legal_tool_exposure_item') {
    return auth.hasPermission('admin:legal-tool-center:manage');
  }
  return auth.hasPermission('admin:miniapp-home-config:manage');
});

interface FlatNode {
  node: MiniappOrchestrationNode;
  level: number;
}

function flattenNode(node: MiniappOrchestrationNode, level = 0): FlatNode[] {
  const children = node.children || [];
  return [
    { node, level },
    ...children.flatMap((child) => flattenNode(child, level + 1))
  ];
}

const flatNodes = computed(() => (tree.value ? flattenNode(tree.value) : []));

function nodeTypeLabel(nodeType: string) {
  if (nodeType === 'app') {
    return '小程序';
  }
  if (nodeType === 'page') {
    return '页面';
  }
  if (nodeType === 'module') {
    return '模块';
  }
  return '入口';
}

function sourceTypeLabel(sourceType: string) {
  if (sourceType === 'home_menu_item') {
    return '首页功能入口';
  }
  if (sourceType === 'legal_tool_exposure_item') {
    return '法律工具曝光入口';
  }
  if (sourceType === 'home_module') {
    return '首页模块';
  }
  if (sourceType === 'legal_tool_exposure_group') {
    return '工具页分组';
  }
  return sourceType || '-';
}

function statusTagType(enabled: boolean) {
  return enabled ? 'success' : 'info';
}

function selectNode(node: MiniappOrchestrationNode) {
  selectedNode.value = node;
  if (node.nodeType !== 'entry' || !node.sourceId) {
    return;
  }
  Object.assign(entryForm, {
    sourceType: node.sourceType,
    sourceId: node.sourceId,
    title: node.title || '',
    description: node.description || '',
    targetPath: node.targetPath || '',
    action: node.action || 'navigate',
    status: node.status || 'open',
    statusText: node.statusText || '可用',
    iconKey: node.iconKey || '',
    visibility: node.visibility || 'public',
    releaseStage: node.releaseStage || 'public',
    sortOrder: node.sortOrder ?? 10,
    enabled: node.enabled ?? true
  });
}

async function loadTree() {
  loading.value = true;
  loadError.value = '';
  try {
    tree.value = await loadMiniappOrchestrationTree(APP_CODE);
    selectedNode.value = selectedNode.value
      ? flatNodes.value.find((item) => item.node.key === selectedNode.value?.key && item.node.sourceType === selectedNode.value?.sourceType)?.node ?? tree.value
      : tree.value;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '小程序配置加载失败';
    tree.value = null;
    selectedNode.value = null;
  } finally {
    loading.value = false;
  }
}

async function submitEntry() {
  if (!selectedCanManage.value || submitting.value) {
    return;
  }
  submitting.value = true;
  loadError.value = '';
  try {
    await saveMiniappOrchestrationEntry({ ...entryForm });
    ElMessage.success('功能入口已保存');
    await loadTree();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '功能入口保存失败';
  } finally {
    submitting.value = false;
  }
}

onMounted(loadTree);
</script>

<template>
  <section>
    <h1 class="page-title">小程序配置中心</h1>
    <p class="page-subtitle">按页面、模块和功能入口查看并配置对客展示。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <div class="toolbar">
        <div>
          <div class="toolbar-title">页面编排树</div>
          <div class="toolbar-subtitle">首片聚合首页配置和法律工具曝光入口，底层能力仍在法律工具中心维护。</div>
        </div>
        <el-button :icon="Refresh" :loading="loading" @click="loadTree">刷新</el-button>
      </div>

      <div class="orchestration-layout">
        <aside class="tree-panel" v-loading="loading">
          <button
            v-for="item in flatNodes"
            :key="`${item.node.sourceType}-${item.node.key}-${item.node.sourceId || 0}`"
            class="tree-node"
            :class="[{ active: selectedNode === item.node }, `node-${item.node.nodeType}`]"
            :style="{ '--node-indent': `${item.level * 18}px` }"
            :data-test="`node-${item.node.nodeType}-${item.node.key}`"
            type="button"
            @click="selectNode(item.node)"
          >
            <span class="tree-node-title">{{ item.node.title || item.node.key }}</span>
            <span class="tree-node-type">{{ nodeTypeLabel(item.node.nodeType) }}</span>
          </button>
        </aside>

        <main class="detail-panel">
          <template v-if="selectedNode && !selectedIsEntry">
            <div class="detail-title">{{ selectedNode.title || selectedNode.key }}</div>
            <div class="detail-meta">{{ nodeTypeLabel(selectedNode.nodeType) }} / {{ sourceTypeLabel(selectedNode.sourceType) }}</div>
            <p class="detail-description">
              {{ selectedNode.description || selectedNode.targetPath || '当前节点用于理解页面结构，首片只开放功能入口编辑。' }}
            </p>
            <el-tag :type="statusTagType(selectedNode.enabled)" effect="plain">
              {{ selectedNode.enabled ? '已启用' : '已停用' }}
            </el-tag>
          </template>

          <el-form v-else-if="selectedNode" class="entry-form" label-width="96px">
            <div class="detail-title">{{ entryForm.title || selectedNode.key }}</div>
            <div class="detail-meta">{{ sourceTypeLabel(entryForm.sourceType) }} / {{ selectedNode.key }}</div>

            <el-form-item label="标题">
              <el-input v-model="entryForm.title" data-test="entry-title" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="说明">
              <el-input v-model="entryForm.description" type="textarea" :rows="2" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="页面路径">
              <el-input v-model="entryForm.targetPath" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="动作">
              <el-select v-model="entryForm.action" class="full-input" :disabled="!selectedCanManage">
                <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务状态">
              <el-select v-model="entryForm.status" class="full-input" :disabled="!selectedCanManage">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态文案">
              <el-input v-model="entryForm.statusText" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="图标">
              <MiniappIconPicker v-model="entryForm.iconKey" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="可见性">
              <el-select v-model="entryForm.visibility" class="full-input" :disabled="!selectedCanManage">
                <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布阶段">
              <el-select v-model="entryForm.releaseStage" class="full-input" :disabled="!selectedCanManage">
                <el-option v-for="item in releaseStageOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="entryForm.sortOrder" :min="0" :disabled="!selectedCanManage" />
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="entryForm.enabled" :disabled="!selectedCanManage" />
            </el-form-item>

            <div class="form-actions">
              <el-button
                v-if="selectedCanManage"
                type="primary"
                data-test="save-entry"
                :loading="submitting"
                @click="submitEntry"
              >
                保存入口
              </el-button>
              <span v-else class="readonly-note">当前账号只有查看权限。</span>
            </div>
          </el-form>

          <el-empty v-else description="暂无页面配置数据" />
        </main>
      </div>
    </el-card>
  </section>
</template>

<style scoped>
.config-panel {
  margin-top: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar-title {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.orchestration-layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: 16px;
}

.tree-panel {
  min-height: 520px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.tree-node {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px 9px calc(10px + var(--node-indent));
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  text-align: left;
}

.tree-node:hover,
.tree-node.active {
  background: #e6f4f1;
  color: #0f766e;
}

.tree-node-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-node-type {
  flex: 0 0 auto;
  color: #6b7280;
  font-size: 12px;
}

.node-entry .tree-node-title {
  font-weight: 600;
}

.detail-panel {
  min-height: 520px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.detail-title {
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.detail-meta {
  margin: 6px 0 16px;
  color: #6b7280;
  font-size: 13px;
}

.detail-description {
  margin: 0 0 16px;
  color: #374151;
  line-height: 1.7;
}

.entry-form {
  max-width: 760px;
}

.full-input {
  width: 100%;
}

.form-actions {
  padding-left: 96px;
}

.readonly-note {
  color: #6b7280;
  font-size: 13px;
}

.error-alert {
  margin-top: 12px;
}

@media (max-width: 900px) {
  .orchestration-layout {
    grid-template-columns: 1fr;
  }

  .form-actions {
    padding-left: 0;
  }
}
</style>
