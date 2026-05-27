<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { EditPen, Plus, Refresh, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  disableMiniappHomeBanner,
  disableMiniappHomeMenuItem,
  disableMiniappHomeModule,
  pageMiniappHomeBanners,
  pageMiniappHomeMenuItems,
  pageMiniappHomeModules,
  saveMiniappHomeBanner,
  saveMiniappHomeMenuItem,
  saveMiniappHomeModule,
  type MiniappHomeBannerItem,
  type MiniappHomeBannerPayload,
  type MiniappHomeMenuItem,
  type MiniappHomeMenuItemPayload,
  type MiniappHomeModuleItem,
  type MiniappHomeModulePayload
} from '../../api/miniappHomeConfig';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const auth = useAuthStore();
const activeTab = ref('modules');
const loading = ref(false);
const menuLoading = ref(false);
const bannerLoading = ref(false);
const loadError = ref('');
const modules = ref<MiniappHomeModuleItem[]>([]);
const menuItems = ref<MiniappHomeMenuItem[]>([]);
const banners = ref<MiniappHomeBannerItem[]>([]);
const selectedModuleId = ref<number | null>(null);
const moduleDialogVisible = ref(false);
const menuItemDialogVisible = ref(false);
const bannerDialogVisible = ref(false);
const submitting = ref(false);

const moduleForm = reactive<MiniappHomeModulePayload>({
  id: 0,
  appCode: APP_CODE,
  moduleKey: '',
  title: '',
  description: '',
  tone: 'teal',
  sortOrder: 10,
  enabled: true
});

const menuItemForm = reactive<MiniappHomeMenuItemPayload>({
  id: 0,
  moduleId: 0,
  itemKey: '',
  title: '',
  description: '',
  targetPath: '',
  action: 'navigate',
  status: 'open',
  statusText: '可用',
  iconKey: '',
  iconUrl: '',
  fontWeight: 'bold',
  sortOrder: 10,
  enabled: true
});

const bannerForm = reactive<MiniappHomeBannerPayload>({
  id: 0,
  appCode: APP_CODE,
  bannerKey: '',
  title: '',
  subtitle: '',
  announcementText: '',
  imageUrl: '',
  targetPath: '/pages/notice-detail/notice-detail?noticeKey=',
  detailTitle: '',
  detailContent: '',
  sortOrder: 10,
  enabled: true
});

const toneOptions = [
  { label: '青绿', value: 'teal' },
  { label: '蓝色', value: 'blue' },
  { label: '琥珀', value: 'amber' },
  { label: '灰色', value: 'slate' }
];

const actionOptions = [
  { label: '页面跳转', value: 'navigate' },
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

const fontWeightOptions = [
  { label: '常规', value: 'normal' },
  { label: '加粗', value: 'bold' }
];

const canManageHomeConfig = computed(() => auth.hasPermission('admin:miniapp-home-config:manage'));
const selectedModule = computed(() => modules.value.find((item) => item.id === selectedModuleId.value));

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

async function loadModules() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappHomeModules({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    modules.value = result.dataList;
    if (!selectedModuleId.value || !modules.value.some((item) => item.id === selectedModuleId.value)) {
      selectedModuleId.value = modules.value[0]?.id ?? null;
    }
    await loadMenuItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '首页模块加载失败';
    modules.value = [];
    menuItems.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadMenuItems() {
  if (!selectedModuleId.value) {
    menuItems.value = [];
    return;
  }
  menuLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappHomeMenuItems({
      moduleId: selectedModuleId.value,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    menuItems.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '功能入口加载失败';
    menuItems.value = [];
  } finally {
    menuLoading.value = false;
  }
}

async function loadBanners() {
  bannerLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageMiniappHomeBanners({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    banners.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Banner 公告加载失败';
    banners.value = [];
  } finally {
    bannerLoading.value = false;
  }
}

function openModuleDialog(row?: MiniappHomeModuleItem) {
  Object.assign(moduleForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    moduleKey: row?.moduleKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    tone: row?.tone ?? 'teal',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  moduleDialogVisible.value = true;
}

async function submitModule() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveMiniappHomeModule(normalizePayloadId(moduleForm));
    moduleDialogVisible.value = false;
    ElMessage.success('模块已保存');
    await loadModules();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '模块保存失败';
  } finally {
    submitting.value = false;
  }
}

function openMenuItemDialog(row?: MiniappHomeMenuItem) {
  Object.assign(menuItemForm, {
    id: row?.id ?? 0,
    moduleId: row?.moduleId ?? selectedModuleId.value ?? 0,
    itemKey: row?.itemKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    targetPath: row?.targetPath ?? '',
    action: row?.action ?? 'navigate',
    status: row?.status ?? 'open',
    statusText: row?.statusText ?? '可用',
    iconKey: row?.iconKey ?? '',
    iconUrl: row?.iconUrl ?? '',
    fontWeight: row?.fontWeight ?? 'bold',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  menuItemDialogVisible.value = true;
}

async function submitMenuItem() {
  if (!menuItemForm.moduleId) {
    loadError.value = '请先选择模块';
    return;
  }
  submitting.value = true;
  loadError.value = '';
  try {
    await saveMiniappHomeMenuItem(normalizePayloadId(menuItemForm));
    menuItemDialogVisible.value = false;
    ElMessage.success('功能入口已保存');
    await loadMenuItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '功能入口保存失败';
  } finally {
    submitting.value = false;
  }
}

function openBannerDialog(row?: MiniappHomeBannerItem) {
  Object.assign(bannerForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    bannerKey: row?.bannerKey ?? '',
    title: row?.title ?? '',
    subtitle: row?.subtitle ?? '',
    announcementText: row?.announcementText ?? '',
    imageUrl: row?.imageUrl ?? '',
    targetPath: row?.targetPath ?? '/pages/notice-detail/notice-detail?noticeKey=',
    detailTitle: row?.detailTitle ?? '',
    detailContent: row?.detailContent ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  bannerDialogVisible.value = true;
}

async function submitBanner() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveMiniappHomeBanner(normalizePayloadId(bannerForm));
    bannerDialogVisible.value = false;
    ElMessage.success('Banner 公告已保存');
    await loadBanners();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Banner 公告保存失败';
  } finally {
    submitting.value = false;
  }
}

async function disableModule(row: MiniappHomeModuleItem) {
  await ElMessageBox.confirm(`确认禁用模块「${row.title}」？`, '禁用模块', { type: 'warning' });
  await disableMiniappHomeModule(row.id);
  await loadModules();
}

async function disableMenuItem(row: MiniappHomeMenuItem) {
  await ElMessageBox.confirm(`确认禁用入口「${row.title}」？`, '禁用功能入口', { type: 'warning' });
  await disableMiniappHomeMenuItem(row.id);
  await loadMenuItems();
}

async function disableBanner(row: MiniappHomeBannerItem) {
  await ElMessageBox.confirm(`确认禁用 Banner「${row.title}」？`, '禁用 Banner', { type: 'warning' });
  await disableMiniappHomeBanner(row.id);
  await loadBanners();
}

function handleModuleSelection(moduleId: number) {
  selectedModuleId.value = moduleId;
  loadMenuItems();
}

onMounted(async () => {
  await Promise.all([loadModules(), loadBanners()]);
});
</script>

<template>
  <section>
    <h1 class="page-title">首页配置</h1>
    <p class="page-subtitle">维护法律助手首页模块、功能入口和 Banner 公告。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="模块配置" name="modules">
          <div class="toolbar">
            <div class="toolbar-title">阳光法律助手首页模块</div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadModules">刷新</el-button>
              <el-button v-if="canManageHomeConfig" type="primary" :icon="Plus" @click="openModuleDialog()">新增模块</el-button>
            </div>
          </div>
          <el-table v-loading="loading" :data="modules" row-key="id">
            <el-table-column prop="moduleKey" label="模块标识" width="140" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
            <el-table-column prop="tone" label="色调" width="96" />
            <el-table-column prop="sortOrder" label="排序" width="88" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
              <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
            </el-table-column>
            <el-table-column v-if="canManageHomeConfig" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openModuleDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableModule(row)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="功能入口" name="menu-items">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">功能入口</div>
              <div class="toolbar-subtitle">{{ selectedModule ? selectedModule.title : '请先选择模块' }}</div>
            </div>
            <div class="toolbar-actions">
              <el-select
                v-model="selectedModuleId"
                class="module-select"
                placeholder="选择模块"
                @change="handleModuleSelection"
              >
                <el-option v-for="item in modules" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
              <el-button :icon="Refresh" @click="loadMenuItems">刷新</el-button>
              <el-button
                v-if="canManageHomeConfig"
                type="primary"
                :icon="Plus"
                :disabled="!selectedModuleId"
                @click="openMenuItemDialog()"
              >
                新增入口
              </el-button>
            </div>
          </div>
          <el-table v-loading="menuLoading" :data="menuItems" row-key="id">
            <el-table-column prop="itemKey" label="入口标识" width="150" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="targetPath" label="页面路径" min-width="260" show-overflow-tooltip />
            <el-table-column prop="action" label="动作" width="130" />
            <el-table-column prop="status" label="业务状态" width="120" />
            <el-table-column prop="iconKey" label="图标" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageHomeConfig" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openMenuItemDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableMenuItem(row)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="Banner 公告" name="banners">
          <div class="toolbar">
            <div class="toolbar-title">Banner 公告</div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadBanners">刷新</el-button>
              <el-button v-if="canManageHomeConfig" type="primary" :icon="Plus" @click="openBannerDialog()">新增 Banner</el-button>
            </div>
          </div>
          <el-table v-loading="bannerLoading" :data="banners" row-key="id">
            <el-table-column prop="bannerKey" label="Banner 标识" width="150" />
            <el-table-column prop="title" label="标题" width="150" />
            <el-table-column prop="subtitle" label="副标题" min-width="220" show-overflow-tooltip />
            <el-table-column prop="targetPath" label="页面路径" min-width="260" show-overflow-tooltip />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageHomeConfig" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openBannerDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableBanner(row)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="moduleDialogVisible" title="模块配置" width="560px">
      <el-form label-width="92px">
        <el-form-item label="模块标识"><el-input v-model="moduleForm.moduleKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="moduleForm.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="moduleForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="色调">
          <el-select v-model="moduleForm.tone" class="full-input">
            <el-option v-for="item in toneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="moduleForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="moduleForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="moduleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitModule">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="menuItemDialogVisible" title="功能入口" width="640px">
      <el-form label-width="96px">
        <el-form-item label="所属模块">
          <el-select v-model="menuItemForm.moduleId" class="full-input">
            <el-option v-for="item in modules" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="入口标识"><el-input v-model="menuItemForm.itemKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="menuItemForm.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="menuItemForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="页面路径"><el-input v-model="menuItemForm.targetPath" /></el-form-item>
        <el-form-item label="动作">
          <el-select v-model="menuItemForm.action" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="menuItemForm.status" class="full-input">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态文案"><el-input v-model="menuItemForm.statusText" /></el-form-item>
        <el-form-item label="图标 Key"><el-input v-model="menuItemForm.iconKey" /></el-form-item>
        <el-form-item label="图标地址"><el-input v-model="menuItemForm.iconUrl" /></el-form-item>
        <el-form-item label="字体">
          <el-select v-model="menuItemForm.fontWeight" class="full-input">
            <el-option v-for="item in fontWeightOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="menuItemForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="menuItemForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="menuItemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitMenuItem">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="bannerDialogVisible" title="Banner 公告" width="640px">
      <el-form label-width="96px">
        <el-form-item label="Banner 标识"><el-input v-model="bannerForm.bannerKey" /></el-form-item>
        <el-form-item label="标题"><el-input v-model="bannerForm.title" /></el-form-item>
        <el-form-item label="副标题"><el-input v-model="bannerForm.subtitle" /></el-form-item>
        <el-form-item label="公告小字"><el-input v-model="bannerForm.announcementText" /></el-form-item>
        <el-form-item label="图片地址"><el-input v-model="bannerForm.imageUrl" /></el-form-item>
        <el-form-item label="页面路径"><el-input v-model="bannerForm.targetPath" /></el-form-item>
        <el-form-item label="详情标题"><el-input v-model="bannerForm.detailTitle" /></el-form-item>
        <el-form-item label="详情内容"><el-input v-model="bannerForm.detailContent" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="bannerForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="bannerForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bannerDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitBanner">保存</el-button>
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

.module-select {
  width: 180px;
}

.full-input {
  width: 100%;
}
</style>
