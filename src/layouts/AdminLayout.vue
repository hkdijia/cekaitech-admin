<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Monitor, Setting, SwitchButton, UserFilled, Warning } from '@element-plus/icons-vue';
import { adminMenuItems } from '../router/menu';
import { useAuthStore } from '../stores/auth';
import { useWorkspaceStore, workspaceOptions } from '../stores/workspace';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const workspace = useWorkspaceStore();

const activeMenu = computed(() => route.path);

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <el-container class="admin-shell">
    <el-aside width="236px" class="admin-sidebar">
      <div class="brand">
        <strong>策凯科技</strong>
        <span>管理后台</span>
      </div>
      <el-menu :default-active="activeMenu" router class="sidebar-menu">
        <el-menu-item v-for="item in adminMenuItems" :key="item.path" :index="item.path">
          <el-icon>
            <Monitor v-if="item.path === '/dashboard'" />
            <UserFilled v-else-if="item.path === '/users'" />
            <Warning v-else-if="item.path === '/restrictions'" />
            <Setting v-else />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div>
          <div class="workspace-label">当前工作区</div>
          <el-select v-model="workspace.currentCode" class="workspace-select" @change="workspace.switchWorkspace">
            <el-option v-for="item in workspaceOptions" :key="item.code" :label="item.name" :value="item.code" />
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
