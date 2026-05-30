<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { EditPen, Plus, Refresh, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  pageLegalToolCapabilities,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  saveLegalToolCapability,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem,
  type LegalToolCapabilityItem,
  type LegalToolCapabilityPayload,
  type LegalToolExposureGroupItem,
  type LegalToolExposureGroupPayload,
  type LegalToolExposureItem,
  type LegalToolExposureItemPayload
} from '../../api/legalToolCenter';
import MiniappIconPicker from '../../components/miniapp-icon-picker/MiniappIconPicker.vue';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const auth = useAuthStore();
const activeTab = ref('capabilities');
const loading = ref(false);
const groupLoading = ref(false);
const exposureItemLoading = ref(false);
const loadError = ref('');
const capabilities = ref<LegalToolCapabilityItem[]>([]);
const groups = ref<LegalToolExposureGroupItem[]>([]);
const exposureItems = ref<LegalToolExposureItem[]>([]);
const selectedGroupId = ref<number | null>(null);
const capabilityDialogVisible = ref(false);
const groupDialogVisible = ref(false);
const exposureItemDialogVisible = ref(false);
const submitting = ref(false);

const capabilityForm = reactive<LegalToolCapabilityPayload>({
  id: 0,
  appCode: APP_CODE,
  toolKey: '',
  title: '',
  description: '',
  category: 'calculator',
  status: 'planned',
  audience: 'general_user',
  sourceLevel: 'pending_verification',
  dataDependency: 'static_table',
  executionMode: 'backend_rule',
  riskLevel: 'medium',
  defaultIconKey: 'calculator',
  defaultTargetPath: '',
  defaultAction: 'coming_soon',
  sourceName: '',
  sourceUrl: '',
  sourceVersion: '',
  sourceEffectiveDate: '',
  lastCheckedDate: '',
  ownerNote: '',
  sortOrder: 10,
  enabled: true
});

const groupForm = reactive<LegalToolExposureGroupPayload>({
  id: 0,
  appCode: APP_CODE,
  groupKey: '',
  title: '',
  description: '',
  tone: 'teal',
  visibility: 'public',
  sortOrder: 10,
  enabled: true
});

const exposureItemForm = reactive<LegalToolExposureItemPayload>({
  id: 0,
  groupId: 0,
  capabilityId: 0,
  entryKey: '',
  titleOverride: '',
  descriptionOverride: '',
  iconKey: 'calculator',
  targetPath: '',
  action: 'coming_soon',
  status: 'coming_soon',
  statusText: '待开放',
  visibility: 'hidden',
  audience: 'general_user',
  releaseStage: 'internal',
  disclaimerProfile: 'legal_tool_reference',
  linkedServiceKey: '',
  sortOrder: 10,
  enabled: true
});

const categoryOptions = [
  { label: '计算工具', value: 'calculator' },
  { label: '办事指引', value: 'guide' },
  { label: '赔偿测算', value: 'compensation' },
  { label: '文本模板', value: 'template' },
  { label: '查询核对', value: 'lookup' }
];

const capabilityStatusOptions = [
  { label: '公开', value: 'public' },
  { label: '计划中', value: 'planned' },
  { label: '灰度', value: 'pilot' },
  { label: '隐藏', value: 'hidden' }
];

const audienceOptions = [
  { label: '通用用户', value: 'general_user' },
  { label: '诉讼用户', value: 'litigation_user' },
  { label: '劳动用户', value: 'labor_user' },
  { label: '交通事故用户', value: 'traffic_accident_user' }
];

const sourceLevelOptions = [
  { label: '官方', value: 'official' },
  { label: '本地口径', value: 'local' },
  { label: '待核验', value: 'pending_verification' }
];

const dataDependencyOptions = [
  { label: '静态表', value: 'static_table' },
  { label: '规则树', value: 'rule_tree' },
  { label: '利率序列', value: 'rate_series' },
  { label: '地区数据', value: 'regional_data' },
  { label: '年度数据', value: 'annual_data' }
];

const executionModeOptions = [
  { label: '本地静态', value: 'local_static' },
  { label: '后端规则', value: 'backend_rule' },
  { label: '后端数据', value: 'backend_data' },
  { label: '人工服务', value: 'service_link' }
];

const riskLevelOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
];

const actionOptions = [
  { label: '页面跳转', value: 'navigate' },
  { label: '预约服务', value: 'service' },
  { label: '暂未开放', value: 'coming_soon' }
];

const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '灰度', value: 'pilot' },
  { label: '隐藏', value: 'hidden' }
];

const releaseStageOptions = [
  { label: '公开', value: 'public' },
  { label: '灰度', value: 'pilot' },
  { label: '内部', value: 'internal' }
];

const toneOptions = [
  { label: '青绿', value: 'teal' },
  { label: '蓝色', value: 'blue' },
  { label: '琥珀', value: 'amber' },
  { label: '灰色', value: 'slate' }
];

const entryStatusOptions = [
  { label: '开放', value: 'open' },
  { label: '暂未开放', value: 'coming_soon' },
  { label: '服务承接', value: 'service' },
  { label: '隐藏', value: 'hidden' }
];

const canManageLegalToolCenter = computed(() => auth.hasPermission('admin:legal-tool-center:manage'));
const selectedGroup = computed(() => groups.value.find((item) => item.id === selectedGroupId.value));

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

function capabilityPayload() {
  return normalizePayloadId({
    id: capabilityForm.id,
    appCode: capabilityForm.appCode,
    toolKey: capabilityForm.toolKey,
    title: capabilityForm.title,
    description: capabilityForm.description,
    category: capabilityForm.category,
    status: capabilityForm.status,
    audience: capabilityForm.audience,
    sourceLevel: capabilityForm.sourceLevel,
    dataDependency: capabilityForm.dataDependency,
    executionMode: capabilityForm.executionMode,
    riskLevel: capabilityForm.riskLevel,
    defaultIconKey: capabilityForm.defaultIconKey,
    defaultTargetPath: capabilityForm.defaultTargetPath,
    defaultAction: capabilityForm.defaultAction,
    sourceName: capabilityForm.sourceName,
    sourceUrl: capabilityForm.sourceUrl,
    sourceVersion: capabilityForm.sourceVersion,
    sourceEffectiveDate: capabilityForm.sourceEffectiveDate,
    lastCheckedDate: capabilityForm.lastCheckedDate,
    ownerNote: capabilityForm.ownerNote,
    sortOrder: capabilityForm.sortOrder,
    enabled: capabilityForm.enabled
  });
}

function groupPayload() {
  return normalizePayloadId({
    id: groupForm.id,
    appCode: groupForm.appCode,
    groupKey: groupForm.groupKey,
    title: groupForm.title,
    description: groupForm.description,
    tone: groupForm.tone,
    visibility: groupForm.visibility,
    sortOrder: groupForm.sortOrder,
    enabled: groupForm.enabled
  });
}

function exposureItemPayload() {
  return normalizePayloadId({
    id: exposureItemForm.id,
    groupId: exposureItemForm.groupId,
    capabilityId: exposureItemForm.capabilityId,
    entryKey: exposureItemForm.entryKey,
    titleOverride: exposureItemForm.titleOverride,
    descriptionOverride: exposureItemForm.descriptionOverride,
    iconKey: exposureItemForm.iconKey,
    targetPath: exposureItemForm.targetPath,
    action: exposureItemForm.action,
    status: exposureItemForm.status,
    statusText: exposureItemForm.statusText,
    visibility: exposureItemForm.visibility,
    audience: exposureItemForm.audience,
    releaseStage: exposureItemForm.releaseStage,
    disclaimerProfile: exposureItemForm.disclaimerProfile,
    linkedServiceKey: exposureItemForm.linkedServiceKey,
    sortOrder: exposureItemForm.sortOrder,
    enabled: exposureItemForm.enabled
  });
}

function capabilityTitle(capabilityId: number) {
  const item = capabilities.value.find((capability) => capability.id === capabilityId);
  if (!item) {
    return `能力 #${capabilityId}`;
  }
  return `${item.title}（${item.toolKey}）`;
}

async function loadCapabilities() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolCapabilities({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    capabilities.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '能力库加载失败';
    capabilities.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadGroups() {
  groupLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolExposureGroups({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    groups.value = result.dataList;
    if (!selectedGroupId.value || !groups.value.some((item) => item.id === selectedGroupId.value)) {
      selectedGroupId.value = groups.value[0]?.id ?? null;
    }
    await loadExposureItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '展示分组加载失败';
    groups.value = [];
    exposureItems.value = [];
  } finally {
    groupLoading.value = false;
  }
}

async function loadExposureItems() {
  if (!selectedGroupId.value) {
    exposureItems.value = [];
    return;
  }
  exposureItemLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolExposureItems({
      groupId: selectedGroupId.value,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    exposureItems.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '曝光入口加载失败';
    exposureItems.value = [];
  } finally {
    exposureItemLoading.value = false;
  }
}

function openCapabilityDialog(row?: LegalToolCapabilityItem) {
  Object.assign(capabilityForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    toolKey: row?.toolKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    category: row?.category ?? 'calculator',
    status: row?.status ?? 'planned',
    audience: row?.audience ?? 'general_user',
    sourceLevel: row?.sourceLevel ?? 'pending_verification',
    dataDependency: row?.dataDependency ?? 'static_table',
    executionMode: row?.executionMode ?? 'backend_rule',
    riskLevel: row?.riskLevel ?? 'medium',
    defaultIconKey: row?.defaultIconKey ?? 'calculator',
    defaultTargetPath: row?.defaultTargetPath ?? '',
    defaultAction: row?.defaultAction ?? 'coming_soon',
    sourceName: row?.sourceName ?? '',
    sourceUrl: row?.sourceUrl ?? '',
    sourceVersion: row?.sourceVersion ?? '',
    sourceEffectiveDate: row?.sourceEffectiveDate ?? '',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    ownerNote: row?.ownerNote ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  capabilityDialogVisible.value = true;
}

async function submitCapability() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolCapability(capabilityPayload());
    capabilityDialogVisible.value = false;
    ElMessage.success('法律工具能力已保存');
    await loadCapabilities();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '法律工具能力保存失败';
  } finally {
    submitting.value = false;
  }
}

function openGroupDialog(row?: LegalToolExposureGroupItem) {
  Object.assign(groupForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    groupKey: row?.groupKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    tone: row?.tone ?? 'teal',
    visibility: row?.visibility ?? 'public',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  groupDialogVisible.value = true;
}

async function submitGroup() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolExposureGroup(groupPayload());
    groupDialogVisible.value = false;
    ElMessage.success('展示分组已保存');
    await loadGroups();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '展示分组保存失败';
  } finally {
    submitting.value = false;
  }
}

function openExposureItemDialog(row?: LegalToolExposureItem) {
  Object.assign(exposureItemForm, {
    id: row?.id ?? 0,
    groupId: row?.groupId ?? selectedGroupId.value ?? 0,
    capabilityId: row?.capabilityId ?? capabilities.value[0]?.id ?? 0,
    entryKey: row?.entryKey ?? '',
    titleOverride: row?.titleOverride ?? '',
    descriptionOverride: row?.descriptionOverride ?? '',
    iconKey: row?.iconKey ?? 'calculator',
    targetPath: row?.targetPath ?? '',
    action: row?.action ?? 'coming_soon',
    status: row?.status ?? 'coming_soon',
    statusText: row?.statusText ?? '待开放',
    visibility: row?.visibility ?? 'hidden',
    audience: row?.audience ?? 'general_user',
    releaseStage: row?.releaseStage ?? 'internal',
    disclaimerProfile: row?.disclaimerProfile ?? 'legal_tool_reference',
    linkedServiceKey: row?.linkedServiceKey ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  exposureItemDialogVisible.value = true;
}

async function submitExposureItem() {
  if (!exposureItemForm.groupId) {
    loadError.value = '请先选择展示分组';
    return;
  }
  if (!exposureItemForm.capabilityId) {
    loadError.value = '请先选择能力项';
    return;
  }
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolExposureItem(exposureItemPayload());
    exposureItemDialogVisible.value = false;
    ElMessage.success('曝光入口已保存');
    await loadExposureItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '曝光入口保存失败';
  } finally {
    submitting.value = false;
  }
}

async function disableGroup(row: LegalToolExposureGroupItem) {
  await ElMessageBox.confirm(`确认禁用分组「${row.title}」？`, '禁用展示分组', { type: 'warning' });
  await disableLegalToolExposureGroup(row.id);
  await loadGroups();
}

async function disableExposureItem(row: LegalToolExposureItem) {
  await ElMessageBox.confirm(`确认禁用入口「${row.entryKey}」？`, '禁用曝光入口', { type: 'warning' });
  await disableLegalToolExposureItem(row.id);
  await loadExposureItems();
}

function handleGroupSelection(groupId: number) {
  selectedGroupId.value = groupId;
  loadExposureItems();
}

onMounted(async () => {
  await loadCapabilities();
  await loadGroups();
});
</script>

<template>
  <section>
    <h1 class="page-title">法律工具中心</h1>
    <p class="page-subtitle">维护从竞品吸收的法律工具能力、展示分组和小程序曝光入口。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="能力库" name="capabilities">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">工具能力库</div>
              <div class="toolbar-subtitle">沉淀竞品工具项、来源、风险和执行方式，是否曝光由入口配置决定。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadCapabilities">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openCapabilityDialog()">
                新增能力
              </el-button>
            </div>
          </div>

          <el-table v-loading="loading" :data="capabilities" row-key="id">
            <el-table-column prop="toolKey" label="能力标识" width="160" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="description" label="说明" min-width="220" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="110" />
            <el-table-column prop="status" label="能力状态" width="110" />
            <el-table-column prop="sourceLevel" label="来源等级" width="120" />
            <el-table-column prop="riskLevel" label="风险" width="90" />
            <el-table-column prop="executionMode" label="执行方式" width="130" />
            <el-table-column prop="defaultIconKey" label="默认图标" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
              <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openCapabilityDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="展示分组" name="groups">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">小程序展示分组</div>
              <div class="toolbar-subtitle">控制工具中心页面里的分区名称、视觉色调、公开/灰度/隐藏状态。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadGroups">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openGroupDialog()">
                新增分组
              </el-button>
            </div>
          </div>

          <el-table v-loading="groupLoading" :data="groups" row-key="id">
            <el-table-column prop="groupKey" label="分组标识" width="160" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="description" label="说明" min-width="260" show-overflow-tooltip />
            <el-table-column prop="tone" label="色调" width="100" />
            <el-table-column prop="visibility" label="可见性" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
              <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openGroupDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableGroup(row)">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="曝光入口" name="exposure-items">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">工具曝光入口</div>
              <div class="toolbar-subtitle">{{ selectedGroup ? selectedGroup.title : '请先选择展示分组' }}</div>
            </div>
            <div class="toolbar-actions">
              <el-select
                v-model="selectedGroupId"
                class="group-select"
                placeholder="选择分组"
                @change="handleGroupSelection"
              >
                <el-option v-for="item in groups" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
              <el-button :icon="Refresh" @click="loadExposureItems">刷新</el-button>
              <el-button
                v-if="canManageLegalToolCenter"
                type="primary"
                :icon="Plus"
                :disabled="!selectedGroupId"
                @click="openExposureItemDialog()"
              >
                新增入口
              </el-button>
            </div>
          </div>

          <el-table v-loading="exposureItemLoading" :data="exposureItems" row-key="id">
            <el-table-column prop="entryKey" label="入口标识" width="160" />
            <el-table-column label="绑定能力" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">{{ capabilityTitle(row.capabilityId) }}</template>
            </el-table-column>
            <el-table-column prop="targetPath" label="页面路径" min-width="240" show-overflow-tooltip />
            <el-table-column prop="action" label="动作" width="110" />
            <el-table-column prop="status" label="业务状态" width="110" />
            <el-table-column prop="visibility" label="可见性" width="110" />
            <el-table-column prop="releaseStage" label="发布阶段" width="110" />
            <el-table-column prop="iconKey" label="图标" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openExposureItemDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableExposureItem(row)">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="capabilityDialogVisible" title="法律工具能力" width="760px">
      <el-form label-width="108px">
        <el-form-item label="能力标识"><el-input v-model="capabilityForm.toolKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="capabilityForm.title" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="capabilityForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="capabilityForm.category" class="full-input">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="能力状态">
          <el-select v-model="capabilityForm.status" class="full-input">
            <el-option v-for="item in capabilityStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户">
          <el-select v-model="capabilityForm.audience" class="full-input">
            <el-option v-for="item in audienceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源等级">
          <el-select v-model="capabilityForm.sourceLevel" class="full-input">
            <el-option v-for="item in sourceLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据依赖">
          <el-select v-model="capabilityForm.dataDependency" class="full-input">
            <el-option v-for="item in dataDependencyOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行方式">
          <el-select v-model="capabilityForm.executionMode" class="full-input">
            <el-option v-for="item in executionModeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="capabilityForm.riskLevel" class="full-input">
            <el-option v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认图标"><MiniappIconPicker v-model="capabilityForm.defaultIconKey" /></el-form-item>
        <el-form-item label="默认路径"><el-input v-model="capabilityForm.defaultTargetPath" /></el-form-item>
        <el-form-item label="默认动作">
          <el-select v-model="capabilityForm.defaultAction" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源名称"><el-input v-model="capabilityForm.sourceName" /></el-form-item>
        <el-form-item label="来源链接"><el-input v-model="capabilityForm.sourceUrl" /></el-form-item>
        <el-form-item label="来源版本"><el-input v-model="capabilityForm.sourceVersion" /></el-form-item>
        <el-form-item label="生效日期"><el-input v-model="capabilityForm.sourceEffectiveDate" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="capabilityForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="运营备注"><el-input v-model="capabilityForm.ownerNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="capabilityForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="capabilityForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="capabilityDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitCapability">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="groupDialogVisible" title="展示分组" width="600px">
      <el-form label-width="96px">
        <el-form-item label="分组标识"><el-input v-model="groupForm.groupKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="groupForm.title" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="groupForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="色调">
          <el-select v-model="groupForm.tone" class="full-input">
            <el-option v-for="item in toneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="可见性">
          <el-select v-model="groupForm.visibility" class="full-input">
            <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="groupForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="groupForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitGroup">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exposureItemDialogVisible" title="曝光入口" width="720px">
      <el-form label-width="112px">
        <el-form-item label="所属分组">
          <el-select v-model="exposureItemForm.groupId" class="full-input">
            <el-option v-for="item in groups" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定能力">
          <el-select v-model="exposureItemForm.capabilityId" class="full-input" filterable>
            <el-option
              v-for="item in capabilities"
              :key="item.id"
              :label="`${item.title}（${item.toolKey}）`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入口标识"><el-input v-model="exposureItemForm.entryKey" /></el-form-item>
        <el-form-item label="标题覆盖"><el-input v-model="exposureItemForm.titleOverride" /></el-form-item>
        <el-form-item label="描述覆盖">
          <el-input v-model="exposureItemForm.descriptionOverride" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="图标"><MiniappIconPicker v-model="exposureItemForm.iconKey" /></el-form-item>
        <el-form-item label="页面路径"><el-input v-model="exposureItemForm.targetPath" /></el-form-item>
        <el-form-item label="动作">
          <el-select v-model="exposureItemForm.action" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态">
          <el-select v-model="exposureItemForm.status" class="full-input">
            <el-option v-for="item in entryStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态文案"><el-input v-model="exposureItemForm.statusText" /></el-form-item>
        <el-form-item label="可见性">
          <el-select v-model="exposureItemForm.visibility" class="full-input">
            <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户">
          <el-select v-model="exposureItemForm.audience" class="full-input">
            <el-option v-for="item in audienceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布阶段">
          <el-select v-model="exposureItemForm.releaseStage" class="full-input">
            <el-option v-for="item in releaseStageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="免责声明"><el-input v-model="exposureItemForm.disclaimerProfile" /></el-form-item>
        <el-form-item label="服务标识"><el-input v-model="exposureItemForm.linkedServiceKey" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="exposureItemForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="exposureItemForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exposureItemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitExposureItem">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.config-panel {
  min-height: 560px;
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

.group-select {
  width: 200px;
}

.full-input {
  width: 100%;
}
</style>
