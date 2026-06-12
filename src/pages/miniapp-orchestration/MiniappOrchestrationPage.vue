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
const includeDisabled = ref(false);
const tree = ref<MiniappOrchestrationNode | null>(null);
const selectedNode = ref<MiniappOrchestrationNode | null>(null);
const collapsedKeys = ref<Set<string>>(new Set());
const searchKeyword = ref('');

const entryForm = reactive<MiniappOrchestrationEntryPayload>({
  sourceType: '',
  sourceId: 0,
  title: '',
  description: '',
  targetPath: '',
  action: 'navigate',
  status: 'published',
  statusText: '已上线',
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
  { label: '已上线', value: 'published' },
  { label: '待发布', value: 'pending_release' },
  { label: '人工暂缓', value: 'paused' },
  { label: '已下架', value: 'retired' }
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

const selectedIsFeature = computed(() => selectedNode.value?.nodeType === 'feature');
const selectedCanManage = computed(() => {
  if (!selectedNode.value || selectedNode.value.nodeType !== 'feature') {
    return false;
  }
  if (selectedNode.value.sourceType === 'legal_tool_exposure_item') {
    return auth.hasPermission('admin:legal-tool-center:manage');
  }
  if (selectedNode.value.sourceType === 'home_menu_item') {
    return auth.hasPermission('admin:miniapp-home-config:manage');
  }
  return false;
});

const selectedIsReadonlyFeature = computed(() => {
  return selectedNode.value?.nodeType === 'feature' && !selectedCanManage.value;
});

interface FlatNode {
  node: MiniappOrchestrationNode;
  level: number;
}

function treeNodeKey(node: MiniappOrchestrationNode) {
  return `${node.sourceType}-${node.key}-${node.sourceId || 0}`;
}

function hasSearchKeyword() {
  return searchKeyword.value.trim().length > 0;
}

function flattenNode(node: MiniappOrchestrationNode, level = 0): FlatNode[] {
  const children = node.children || [];
  if (!hasSearchKeyword() && collapsedKeys.value.has(treeNodeKey(node))) {
    return [{ node, level }];
  }
  return [
    { node, level },
    ...children.flatMap((child) => flattenNode(child, level + 1))
  ];
}

function nodeMatchesKeyword(node: MiniappOrchestrationNode, keyword: string) {
  const fields = [
    node.title,
    node.key,
    node.description,
    node.targetPath,
    node.sourceType,
    node.capabilityKey
  ];
  return fields.some((value) => (value || '').toLowerCase().includes(keyword));
}

function filterTree(node: MiniappOrchestrationNode, keyword: string): MiniappOrchestrationNode | null {
  const children = node.children || [];
  const matchedChildren = children
    .map((child) => filterTree(child, keyword))
    .filter((child): child is MiniappOrchestrationNode => Boolean(child));
  if (nodeMatchesKeyword(node, keyword) || matchedChildren.length > 0) {
    return {
      ...node,
      children: matchedChildren
    };
  }
  return null;
}

const visibleTree = computed(() => {
  if (!tree.value) {
    return null;
  }
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return tree.value;
  }
  return filterTree(tree.value, keyword);
});

const flatNodes = computed(() => (visibleTree.value ? flattenNode(visibleTree.value) : []));

function nodeTypeLabel(nodeType: string) {
  if (nodeType === 'app') {
    return '小程序';
  }
  if (nodeType === 'tab') {
    return 'Tab';
  }
  if (nodeType === 'module') {
    return '模块';
  }
  return '功能';
}

function sourceTypeLabel(sourceType: string) {
  if (sourceType === 'home_menu_item') {
    return '首页功能';
  }
  if (sourceType === 'legal_tool_exposure_item') {
    return '法律工具功能';
  }
  if (sourceType === 'profile_local_feature') {
    return '账号页本地功能';
  }
  if (sourceType === 'home_module') {
    return '首页配置模块';
  }
  if (sourceType === 'legal_tool_group' || sourceType === 'legal_tool_exposure_group') {
    return '法律工具分组';
  }
  if (sourceType === 'miniapp_tab') {
    return '底部 Tab';
  }
  return sourceType || '-';
}

function nodeDisplayTitle(node: MiniappOrchestrationNode) {
  return node.title || node.key;
}

function nodeBadgeLabel(node: MiniappOrchestrationNode) {
  if (node.nodeType === 'module' || node.nodeType === 'entry') {
    return sourceTypeLabel(node.sourceType);
  }
  return nodeTypeLabel(node.nodeType);
}

function statusTagType(enabled: boolean) {
  return enabled ? 'success' : 'info';
}

function childCountLabel(node: MiniappOrchestrationNode) {
  const count = node.children?.length || 0;
  if (count <= 0) {
    return '';
  }
  return `${count} 项`;
}

function readonlyNoteText() {
  if (selectedNode.value?.sourceType === 'profile_local_feature') {
    return '当前功能来自小程序本地页面，首片只展示位置和跳转关系；后续迁移为数据库配置后再开放编辑。';
  }
  return '当前账号只有查看权限。';
}

function statusOptionLabel(value?: string) {
  return statusOptions.find((item) => item.value === value)?.label ?? value ?? '-';
}

function normalizeMenuLifecycleStatus(status?: string) {
  if (status === 'open' || status === 'consultation') {
    return 'published';
  }
  if (status === 'coming_soon') {
    return 'pending_release';
  }
  if (status === 'locked' || status === 'disabled') {
    return 'paused';
  }
  return status || 'published';
}

function normalizeMenuLifecycleStatusText(status: string, statusText?: string) {
  if (statusText === '可用' || !statusText) {
    return status === 'published' ? '已上线' : statusOptionLabel(status);
  }
  return statusText;
}

function hasChildren(node: MiniappOrchestrationNode) {
  return Boolean(node.children && node.children.length > 0);
}

function isLeafListParent(node: MiniappOrchestrationNode) {
  const children = node.children || [];
  return children.length > 0 && children.every((child) => !hasChildren(child));
}

function collectDefaultCollapsedKeys(node: MiniappOrchestrationNode): string[] {
  const children = node.children || [];
  return [
    ...(isLeafListParent(node) ? [treeNodeKey(node)] : []),
    ...children.flatMap((child) => collectDefaultCollapsedKeys(child))
  ];
}

function findNodeByIdentity(
  node: MiniappOrchestrationNode,
  target: MiniappOrchestrationNode
): MiniappOrchestrationNode | null {
  if (node.key === target.key && node.sourceType === target.sourceType) {
    return node;
  }
  const children = node.children || [];
  for (const child of children) {
    const matched = findNodeByIdentity(child, target);
    if (matched) {
      return matched;
    }
  }
  return null;
}

function isCollapsed(node: MiniappOrchestrationNode) {
  return collapsedKeys.value.has(treeNodeKey(node));
}

function toggleNode(node: MiniappOrchestrationNode) {
  const next = new Set(collapsedKeys.value);
  const key = treeNodeKey(node);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  collapsedKeys.value = next;
}

function selectNode(node: MiniappOrchestrationNode) {
  selectedNode.value = node;
  if (node.nodeType !== 'feature') {
    return;
  }
  const normalizedStatus = normalizeMenuLifecycleStatus(node.status);
  Object.assign(entryForm, {
    sourceType: node.sourceType,
    sourceId: node.sourceId || 0,
    title: node.title || '',
    description: node.description || '',
    targetPath: node.targetPath || '',
    action: node.action || 'navigate',
    status: normalizedStatus,
    statusText: normalizeMenuLifecycleStatusText(normalizedStatus, node.statusText),
    iconKey: node.iconKey || '',
    visibility: node.visibility || 'public',
    releaseStage: node.releaseStage || 'public',
    sortOrder: node.sortOrder ?? 10,
    enabled: node.enabled ?? true
  });
  if (!node.sourceId) {
    return;
  }
}

async function loadTree() {
  loading.value = true;
  loadError.value = '';
  try {
    const loadedTree = await loadMiniappOrchestrationTree(APP_CODE, includeDisabled.value);
    tree.value = loadedTree;
    collapsedKeys.value = new Set(collectDefaultCollapsedKeys(loadedTree));
    selectedNode.value = selectedNode.value
      ? findNodeByIdentity(loadedTree, selectedNode.value) ?? loadedTree
      : loadedTree;
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
    ElMessage.success('功能已保存');
    await loadTree();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '功能保存失败';
  } finally {
    submitting.value = false;
  }
}

onMounted(loadTree);
</script>

<template>
  <section>
    <h1 class="page-title">页面菜单管理</h1>
    <p class="page-subtitle">按 Tab、模块和功能维护小程序对客菜单，底层能力仍在各业务中心治理。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <div class="toolbar">
        <div>
          <div class="toolbar-title">菜单结构</div>
          <div class="toolbar-subtitle">第一层是底部 Tab，第二层是页面模块，第三层是用户可点击功能。</div>
        </div>
        <div class="toolbar-actions">
          <el-switch
            v-model="includeDisabled"
            data-test="include-disabled-toggle"
            active-text="显示停用项"
            @change="loadTree"
          />
          <el-button :icon="Refresh" :loading="loading" @click="loadTree">刷新</el-button>
        </div>
      </div>
      <div class="tree-search-row">
        <el-input
          v-model="searchKeyword"
          data-test="tree-search"
          clearable
          placeholder="搜索功能名称、路径或 key，例如：诉讼费计算"
        />
      </div>

      <div class="orchestration-layout">
        <aside class="tree-panel menu-tree-shell" v-loading="loading">
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
            <span class="tree-node-accent"></span>
            <span class="tree-node-main">
              <span
                v-if="hasChildren(item.node)"
                class="tree-toggle"
                :data-test="`toggle-${item.node.nodeType}-${item.node.key}`"
                role="button"
                tabindex="0"
                @click.stop="toggleNode(item.node)"
                @keydown.enter.stop.prevent="toggleNode(item.node)"
              >
                {{ isCollapsed(item.node) ? '>' : 'v' }}
              </span>
              <span v-else class="tree-toggle-placeholder"></span>
              <span class="tree-node-title">{{ nodeDisplayTitle(item.node) }}</span>
            </span>
            <span class="tree-node-status">
              <span v-if="!item.node.enabled" class="disabled-badge">已停用</span>
              <span v-if="childCountLabel(item.node)" class="child-count">{{ childCountLabel(item.node) }}</span>
              <span class="tree-node-type">{{ nodeBadgeLabel(item.node) }}</span>
            </span>
          </button>
        </aside>

        <main class="detail-panel">
          <template v-if="selectedNode">
            <div class="detail-hero">
              <div>
                <div class="detail-eyebrow">当前选择</div>
                <div class="detail-title">{{ selectedIsFeature ? (entryForm.title || nodeDisplayTitle(selectedNode)) : nodeDisplayTitle(selectedNode) }}</div>
                <div class="detail-meta">{{ sourceTypeLabel(selectedNode.sourceType) }} / {{ selectedNode.key }}</div>
              </div>
              <el-tag :type="statusTagType(selectedNode.enabled)" effect="plain">
                {{ selectedNode.enabled ? '已启用' : '已停用' }}
              </el-tag>
            </div>

            <div class="detail-summary">
              <div class="summary-item">
                <span>菜单层级</span>
                <strong>{{ nodeTypeLabel(selectedNode.nodeType) }}</strong>
              </div>
              <div class="summary-item">
                <span>生命周期</span>
                <strong>{{ selectedIsFeature ? statusOptionLabel(entryForm.status) : '-' }}</strong>
              </div>
              <div class="summary-item">
                <span>目标页面</span>
                <strong>{{ selectedNode.targetPath || '-' }}</strong>
              </div>
            </div>
          </template>

          <template v-if="selectedNode && !selectedIsFeature">
            <p class="detail-description">
              {{ selectedNode.description || selectedNode.targetPath || '当前节点用于理解菜单骨架，首片只开放功能编辑。' }}
            </p>
          </template>

          <el-form v-else-if="selectedNode" class="entry-form" label-width="96px">
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
            <el-form-item label="生命周期">
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
                保存功能
              </el-button>
              <span v-else class="readonly-note">{{ readonlyNoteText() }}</span>
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

.toolbar-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
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

.tree-search-row {
  margin-bottom: 14px;
}

.orchestration-layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: 16px;
}

.tree-panel {
  min-height: 520px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: linear-gradient(180deg, #f9fafb 0%, #ffffff 80px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tree-node {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 42px;
  margin-bottom: 4px;
  padding: 8px 10px 8px calc(12px + var(--node-indent));
  border: 1px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.68);
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}

.tree-node:hover,
.tree-node.active {
  border-color: #b7e4da;
  background: #ecfdf8;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.08);
  color: #0f766e;
}

.tree-node-accent {
  position: absolute;
  top: 9px;
  bottom: 9px;
  left: 5px;
  width: 3px;
  border-radius: 999px;
  background: transparent;
}

.node-tab .tree-node-accent {
  background: #0f766e;
}

.node-module .tree-node-accent {
  background: #2563eb;
}

.node-feature .tree-node-accent {
  background: #94a3b8;
}

.node-app .tree-node-accent {
  background: #111827;
}

.node-tab .tree-node-title,
.node-module .tree-node-title {
  font-weight: 700;
}

.tree-node-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-node-main {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
}

.tree-toggle,
.tree-toggle-placeholder {
  flex: 0 0 auto;
  width: 16px;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
}

.tree-toggle {
  border-radius: 4px;
  cursor: pointer;
}

.tree-toggle:hover {
  background: rgba(15, 118, 110, 0.12);
  color: #0f766e;
}

.tree-node-type {
  flex: 0 0 auto;
  color: #6b7280;
  font-size: 12px;
}

.tree-node-status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
}

.disabled-badge {
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  line-height: 20px;
  padding: 0 7px;
}

.child-count {
  flex: 0 0 auto;
  border-radius: 999px;
  background: #eef2ff;
  color: #475569;
  font-size: 12px;
  line-height: 20px;
  padding: 0 7px;
}

.detail-panel {
  min-height: 520px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.detail-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fbff 0%, #effaf7 100%);
}

.detail-eyebrow {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 12px;
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

.detail-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.summary-item {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.summary-item span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.summary-item strong {
  display: block;
  min-width: 0;
  margin-top: 4px;
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .orchestration-layout {
    grid-template-columns: 1fr;
  }

  .detail-summary {
    grid-template-columns: 1fr;
  }

  .form-actions {
    padding-left: 0;
  }
}
</style>
