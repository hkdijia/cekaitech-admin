<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Monitor, Setting, SwitchButton, UserFilled, Warning } from '@element-plus/icons-vue';
import { filterAdminMenuItems } from '../router/menu';
import { useAuthStore } from '../stores/auth';
import { useWorkspaceStore } from '../stores/workspace';
import type { BackendWorkspaceMenu } from '../api/adminWorkspace';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const workspace = useWorkspaceStore();

const activeMenu = computed(() => route.path);
const visibleAdminMenuItems = computed(() => filterAdminMenuItems(auth.hasPermission, workspace.currentCode));

onMounted(() => {
  workspace.loadWorkspaces();
});

function handleLogout() {
  auth.logout();
  router.push('/login');
}

async function handleWorkspaceChange(code: string) {
  await workspace.switchWorkspace(code);
  if (code === 'global') {
    router.push('/dashboard');
    return;
  }
  router.push('/miniapp-workbench');
}

function openWorkspaceMenu(item: BackendWorkspaceMenu) {
  const resolvedRoute = resolveWorkspaceMenuRoute(item);
  if (resolvedRoute) {
    router.push(resolvedRoute);
    return;
  }
  router.push({
    name: 'workspace-menu',
    params: {
      workspaceCode: workspace.currentCode,
      menuCode: item.menuCode
    }
  });
}

function resolveWorkspaceMenuRoute(item: BackendWorkspaceMenu) {
  const routeMap: Record<string, string> = {
    'lawyer-verifications': '/lawyer-audits',
    'credit-restriction-queries': '/legal-credit-query-tasks'
  };
  if (routeMap[item.menuCode]) {
    return routeMap[item.menuCode];
  }
  const matchedRoute = router.resolve(item.route);
  if (matchedRoute.matched.length > 0 && matchedRoute.name !== 'workspace-menu') {
    return item.route;
  }
  return '';
}
</script>

<template>
  <el-container class="admin-shell">
    <el-aside width="236px" class="admin-sidebar">
      <div class="brand">
        <strong>策凯科技</strong>
        <span>平台管理后台</span>
      </div>
      <el-menu :default-active="activeMenu" router class="sidebar-menu">
        <el-menu-item v-for="item in visibleAdminMenuItems" :key="item.path" :index="item.path">
          <el-icon>
            <Monitor v-if="item.path === '/dashboard'" />
            <UserFilled v-else-if="item.path === '/users'" />
            <Warning v-else-if="item.path === '/restrictions'" />
            <Setting v-else />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
      <div v-if="workspace.currentMenus.length > 0" class="workspace-menu">
        <div class="workspace-menu-title">当前工作区菜单</div>
        <button
          v-for="item in workspace.currentMenus"
          :key="item.menuCode"
          class="workspace-menu-item"
          type="button"
          @click="openWorkspaceMenu(item)"
        >
          {{ item.menuName }}
        </button>
      </div>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div>
          <div class="workspace-label">当前工作区</div>
          <el-select
            v-model="workspace.currentCode"
            class="workspace-select"
            :loading="workspace.loading"
            @change="handleWorkspaceChange"
          >
            <el-option v-for="item in workspace.options" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="operator">
          <span>{{ auth.operator?.name ?? '未登录' }}</span>
          <el-button :icon="SwitchButton" text type="primary" @click="handleLogout">退出</el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
}

.admin-sidebar {
  background: #101828;
  color: #fff;
}

.brand {
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand strong {
  font-size: 18px;
}

.brand span {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 12px;
}

.sidebar-menu {
  border-right: 0;
  background: transparent;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #d0d5dd;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #1d2939;
  color: #fff;
}

.workspace-menu {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.workspace-menu-title {
  padding: 8px 8px 10px;
  color: #98a2b3;
  font-size: 12px;
}

.workspace-menu-item {
  width: 100%;
  min-height: 34px;
  display: block;
  margin-bottom: 4px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #d0d5dd;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.workspace-menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.admin-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e4e7ec;
}

.workspace-label {
  margin-bottom: 4px;
  color: #667085;
  font-size: 12px;
}

.workspace-select {
  width: 180px;
}

.operator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475467;
}

.admin-main {
  background: #f5f7fb;
  padding: 24px;
}
</style>
