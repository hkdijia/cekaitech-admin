<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkspaceStore } from '../../stores/workspace';

const route = useRoute();
const workspace = useWorkspaceStore();

const workspaceCode = computed(() => String(route.params.workspaceCode ?? ''));
const menuCode = computed(() => String(route.params.menuCode ?? ''));
const currentMenu = computed(() => workspace.currentMenus.find((item) => item.menuCode === menuCode.value));
const currentWorkspace = computed(() =>
  workspace.options.find((item) => item.code === workspaceCode.value) ?? workspace.currentWorkspace
);
</script>

<template>
  <section>
    <h1 class="page-title">{{ currentMenu?.menuName ?? '工作区功能' }}</h1>
    <p class="page-subtitle">
      {{ currentWorkspace?.name ?? '当前工作区' }} 的功能入口，后续接入真实业务页面。
    </p>

    <el-card shadow="never" class="workspace-feature-card">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="工作区编码">{{ workspaceCode }}</el-descriptions-item>
        <el-descriptions-item label="菜单编码">{{ menuCode }}</el-descriptions-item>
        <el-descriptions-item label="后端路由">{{ currentMenu?.route ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="权限码">{{ currentMenu?.permissionCode ?? '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </section>
</template>

<style scoped>
.workspace-feature-card {
  max-width: 720px;
}
</style>
