# cekaitech-admin MVP Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Vue 3 admin shell for cekaitech-admin with login placeholder, layout, navigation, app/workspace switcher, and placeholder business pages.

**Architecture:** Use a client-only Vue 3 SPA. Keep business data mocked locally, isolate routes, layout, navigation metadata, auth placeholder, and mock dashboard data into small files so later backend API integration can replace mocks without rewriting pages.

**Tech Stack:** Vue 3, Vite, TypeScript, Element Plus, Vue Router, Pinia, Vitest, Vue Test Utils.

---

## File Structure

Create the Vue app in the repository root.

```text
package.json                         Project scripts and dependencies
index.html                           Vite entry HTML
vite.config.ts                       Vite + Vue + Vitest config
tsconfig.json                        TypeScript project config
tsconfig.node.json                   TypeScript config for Vite config files
src/main.ts                          App bootstrap, Element Plus, Pinia, router
src/App.vue                          Root router outlet
src/router/index.ts                  Route definitions and simple auth guard
src/router/menu.ts                   Sidebar menu metadata
src/stores/auth.ts                   Mock login state and current operator
src/stores/workspace.ts              Current app/workspace selector
src/layouts/AdminLayout.vue          Shared admin shell layout
src/pages/login/LoginPage.vue        Placeholder login page
src/pages/dashboard/DashboardPage.vue Workbench overview
src/pages/users/UsersPage.vue        User management placeholder
src/pages/restrictions/RestrictionsPage.vue User restriction placeholder
src/pages/lawyer-audits/LawyerAuditsPage.vue Lawyer audit placeholder
src/pages/data-import/DataImportPage.vue Import placeholder
src/pages/settings/SettingsPage.vue  Settings placeholder
src/mocks/dashboard.ts               Dashboard card/table mock data
src/styles/global.css                Global admin styling
src/test/setup.ts                    Test setup for Vue Test Utils
src/router/router.test.ts            Route/menu coverage
src/stores/auth.test.ts              Auth store coverage
```

## Task 1: Scaffold Vue 3 Admin Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "cekaitech-admin",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run",
    "quality": "npm run test && npm run build"
  },
  "dependencies": {
    "@element-plus/icons-vue": "^2.3.1",
    "@vitejs/plugin-vue": "^5.2.4",
    "element-plus": "^2.10.0",
    "pinia": "^2.3.1",
    "vite": "^5.4.19",
    "vue": "^3.5.15",
    "vue-router": "^4.5.1"
  },
  "devDependencies": {
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^24.1.3",
    "typescript": "^5.8.3",
    "vitest": "^1.6.1",
    "vue-tsc": "^2.2.10"
  }
}
```

- [ ] **Step 2: Create Vite entry HTML**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>策凯科技管理后台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 3: Create Vite config**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/test/setup.ts'
  }
});
```

- [ ] **Step 4: Create TypeScript configs**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create app bootstrap**

Create `src/main.ts`:

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/global.css';
import App from './App.vue';
import { router } from './router';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ElementPlus)
  .mount('#app');
```

Create `src/App.vue`:

```vue
<template>
  <RouterView />
</template>
```

Create `src/styles/global.css`:

```css
:root {
  color: #1f2937;
  background: #f5f7fb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

#app {
  min-height: 100vh;
}

.page-title {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 650;
}

.page-subtitle {
  margin: 0 0 20px;
  color: #667085;
  font-size: 14px;
}
```

Create `src/test/setup.ts`:

```ts
import { config } from '@vue/test-utils';

config.global.stubs = {
  transition: false,
  'transition-group': false
};
```

- [ ] **Step 6: Update gitignore**

Append to `.gitignore` if missing:

```text
node_modules/
dist/
coverage/
```

- [ ] **Step 7: Install dependencies**

Run: `npm.cmd install`

Expected: `package-lock.json` is created and install exits with code 0.

- [ ] **Step 8: Commit scaffold**

```powershell
git add .gitignore package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src/main.ts src/App.vue src/styles/global.css src/test/setup.ts
git commit -m "chore: scaffold vue admin app"
```

## Task 2: Add Routing, Auth Placeholder, and Workspace Store

**Files:**
- Create: `src/stores/auth.ts`
- Create: `src/stores/workspace.ts`
- Create: `src/router/menu.ts`
- Create: `src/router/index.ts`
- Create: `src/stores/auth.test.ts`
- Create: `src/router/router.test.ts`

- [ ] **Step 1: Write auth store test**

Create `src/stores/auth.test.ts`:

```ts
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth';

describe('useAuthStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('logs in with a mock operator and logs out', () => {
    const auth = useAuthStore();

    expect(auth.isAuthenticated).toBe(false);
    auth.login('admin', '123456');

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.operator?.name).toBe('策凯管理员');

    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.operator).toBeNull();
  });
});
```

- [ ] **Step 2: Create auth store**

Create `src/stores/auth.ts`:

```ts
import { defineStore } from 'pinia';

interface Operator {
  id: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    operator: null as Operator | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.operator)
  },
  actions: {
    login(username: string, password: string) {
      if (!username.trim()) {
        throw new Error('请输入账号');
      }
      if (!password.trim()) {
        throw new Error('请输入密码');
      }
      this.operator = {
        id: 'mock-admin',
        name: '策凯管理员',
        role: '系统管理员'
      };
    },
    logout() {
      this.operator = null;
    }
  }
});
```

- [ ] **Step 3: Create workspace store**

Create `src/stores/workspace.ts`:

```ts
import { defineStore } from 'pinia';

export interface WorkspaceOption {
  code: string;
  name: string;
}

export const workspaceOptions: WorkspaceOption[] = [
  { code: 'global', name: '全局后台' },
  { code: 'legal', name: '阳光法律助手' },
  { code: 'scorekeeper', name: '聚会计分器' },
  { code: 'appointment', name: '预约服务' }
];

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    currentCode: 'global'
  }),
  getters: {
    currentWorkspace: (state) =>
      workspaceOptions.find((item) => item.code === state.currentCode) ?? workspaceOptions[0]
  },
  actions: {
    switchWorkspace(code: string) {
      if (!workspaceOptions.some((item) => item.code === code)) {
        return;
      }
      this.currentCode = code;
    }
  }
});
```

- [ ] **Step 4: Create menu metadata**

Create `src/router/menu.ts`:

```ts
export interface AdminMenuItem {
  path: string;
  title: string;
  description: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  { path: '/dashboard', title: '首页工作台', description: '待办、概览和系统状态' },
  { path: '/users', title: '用户管理', description: '用户查询和用户详情占位' },
  { path: '/restrictions', title: '限制与黑名单', description: '用户限制、封禁和恢复入口' },
  { path: '/lawyer-audits', title: '律师认证审核', description: '资质审核和审核意见占位' },
  { path: '/data-import', title: '数据导入', description: 'crawler 导出文件导入入口' },
  { path: '/settings', title: '系统设置', description: '应用、菜单和运行参数占位' }
];
```

- [ ] **Step 5: Write router test**

Create `src/router/router.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { adminMenuItems } from './menu';
import { routes } from './index';

describe('admin routes', () => {
  it('has one route for every sidebar menu item', () => {
    const routePaths = routes.map((route) => route.path);

    for (const item of adminMenuItems) {
      expect(routePaths).toContain(item.path);
    }
  });
});
```

- [ ] **Step 6: Create router**

Create `src/router/index.ts`:

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('../pages/login/LoginPage.vue'), meta: { public: true } },
  { path: '/dashboard', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/dashboard/DashboardPage.vue') }] },
  { path: '/users', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/users/UsersPage.vue') }] },
  { path: '/restrictions', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/restrictions/RestrictionsPage.vue') }] },
  { path: '/lawyer-audits', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/lawyer-audits/LawyerAuditsPage.vue') }] },
  { path: '/data-import', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/data-import/DataImportPage.vue') }] },
  { path: '/settings', component: () => import('../layouts/AdminLayout.vue'), children: [{ path: '', component: () => import('../pages/settings/SettingsPage.vue') }] }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.public || auth.isAuthenticated) {
    return true;
  }
  return '/login';
});
```

- [ ] **Step 7: Run tests**

Run: `npm.cmd test`

Expected: auth and router tests pass.

- [ ] **Step 8: Commit routing and stores**

```powershell
git add src/stores src/router
git commit -m "feat: add admin routing and stores"
```

## Task 3: Build Admin Layout and Login Page

**Files:**
- Create: `src/layouts/AdminLayout.vue`
- Create: `src/pages/login/LoginPage.vue`

- [ ] **Step 1: Create admin layout**

Create `src/layouts/AdminLayout.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
          <el-button text type="primary" @click="handleLogout">退出</el-button>
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
  background: #111827;
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

.brand span {
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
}

.sidebar-menu {
  border-right: 0;
  background: transparent;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #d1d5db;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #1f2937;
  color: #fff;
}

.admin-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
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
```

- [ ] **Step 2: Create login page**

Create `src/pages/login/LoginPage.vue`:

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  username: 'admin',
  password: '123456'
});

function submit() {
  auth.login(form.username, form.password);
  router.push('/dashboard');
}
</script>

<template>
  <main class="login-page">
    <section class="login-panel">
      <div>
        <h1>策凯科技管理后台</h1>
        <p>当前为开发占位登录，生产级鉴权后续接入 miniapp-backend。</p>
      </div>
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="账号">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" size="large" class="login-button" @click="submit">进入后台</el-button>
      </el-form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fb 0%, #e8eef8 100%);
  padding: 24px;
}

.login-panel {
  width: min(420px, 100%);
  padding: 32px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

p {
  margin: 0 0 24px;
  color: #667085;
  line-height: 1.6;
}

.login-button {
  width: 100%;
}
```

- [ ] **Step 3: Run build**

Run: `npm.cmd run build`

Expected: TypeScript and Vite build pass.

- [ ] **Step 4: Commit layout and login**

```powershell
git add src/layouts src/pages/login
git commit -m "feat: add admin layout and login"
```

## Task 4: Add Placeholder Pages and Mock Dashboard Data

**Files:**
- Create: `src/mocks/dashboard.ts`
- Create: `src/pages/dashboard/DashboardPage.vue`
- Create: `src/pages/users/UsersPage.vue`
- Create: `src/pages/restrictions/RestrictionsPage.vue`
- Create: `src/pages/lawyer-audits/LawyerAuditsPage.vue`
- Create: `src/pages/data-import/DataImportPage.vue`
- Create: `src/pages/settings/SettingsPage.vue`

- [ ] **Step 1: Create dashboard mock data**

Create `src/mocks/dashboard.ts`:

```ts
export const dashboardCards = [
  { label: '待处理认证', value: '8', hint: '律师认证审核占位' },
  { label: '今日新增用户', value: '23', hint: '来自所有小程序入口' },
  { label: '待处理服务请求', value: '5', hint: '后续接订单和人工服务' },
  { label: '导入任务', value: '2', hint: 'crawler 数据导入占位' }
];

export const pendingItems = [
  { type: '认证审核', title: '律师资质待审核', status: '待处理' },
  { type: '用户限制', title: '黑名单申诉占位', status: '待确认' },
  { type: '数据导入', title: 'crawler 导出文件校验', status: '待接入' }
];
```

- [ ] **Step 2: Create dashboard page**

Create `src/pages/dashboard/DashboardPage.vue`:

```vue
<script setup lang="ts">
import { dashboardCards, pendingItems } from '../../mocks/dashboard';
</script>

<template>
  <section>
    <h1 class="page-title">首页工作台</h1>
    <p class="page-subtitle">查看后台待办、核心指标和系统接入状态。</p>

    <el-row :gutter="16">
      <el-col v-for="card in dashboardCards" :key="card.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="metric-card">
          <div class="metric-label">{{ card.label }}</div>
          <div class="metric-value">{{ card.value }}</div>
          <div class="metric-hint">{{ card.hint }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-card">
      <template #header>近期待办</template>
      <el-table :data="pendingItems">
        <el-table-column prop="type" label="类型" width="140" />
        <el-table-column prop="title" label="事项" />
        <el-table-column prop="status" label="状态" width="140" />
      </el-table>
    </el-card>
  </section>
</template>

<style scoped>
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
</style>
```

- [ ] **Step 3: Create reusable placeholder page pattern manually for each page**

Create `src/pages/users/UsersPage.vue`:

```vue
<template>
  <section>
    <h1 class="page-title">用户管理</h1>
    <p class="page-subtitle">后续接入用户查询、详情、状态筛选和应用维度过滤。</p>
    <el-card shadow="never">
      <el-empty description="用户管理页面占位，真实数据后续通过 miniapp-backend API 获取" />
    </el-card>
  </section>
</template>
```

Create `src/pages/restrictions/RestrictionsPage.vue`:

```vue
<template>
  <section>
    <h1 class="page-title">限制与黑名单</h1>
    <p class="page-subtitle">后续管理登录限制、审核限制、表单提交限制和黑名单记录。</p>
    <el-card shadow="never">
      <el-empty description="用户限制页面占位，后续对接 miniapp-backend 用户限制能力" />
    </el-card>
  </section>
</template>
```

Create `src/pages/lawyer-audits/LawyerAuditsPage.vue`:

```vue
<template>
  <section>
    <h1 class="page-title">律师认证审核</h1>
    <p class="page-subtitle">后续支持查看材料、通过、驳回和记录审核意见。</p>
    <el-card shadow="never">
      <el-empty description="律师认证审核页面占位，真实审核流后续接入" />
    </el-card>
  </section>
</template>
```

Create `src/pages/data-import/DataImportPage.vue`:

```vue
<template>
  <section>
    <h1 class="page-title">数据导入</h1>
    <p class="page-subtitle">后续用于上传 crawler 导出的结构化文件，并通过后端受控 API 入库。</p>
    <el-card shadow="never">
      <el-empty description="数据导入页面占位，不直接控制 crawler 进程" />
    </el-card>
  </section>
</template>
```

Create `src/pages/settings/SettingsPage.vue`:

```vue
<template>
  <section>
    <h1 class="page-title">系统设置</h1>
    <p class="page-subtitle">后续配置小程序工作区、后台菜单和运行参数。</p>
    <el-card shadow="never">
      <el-empty description="系统设置页面占位，配置能力后续接入" />
    </el-card>
  </section>
</template>
```

- [ ] **Step 4: Run quality checks**

Run: `npm.cmd run quality`

Expected: tests and build pass.

- [ ] **Step 5: Commit pages**

```powershell
git add src/mocks src/pages
git commit -m "feat: add admin placeholder pages"
```

## Task 5: Update Documentation and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/变更日志.md`
- Modify: `codex-handoff.md`
- Modify: `tasks/current-task.md`

- [ ] **Step 1: Update README with run commands**

Add this section to `README.md`:

```md
## 本地开发

安装依赖：

```powershell
npm.cmd install
```

启动开发服务：

```powershell
npm.cmd run dev
```

构建：

```powershell
npm.cmd run build
```

测试：

```powershell
npm.cmd test
```
```

- [ ] **Step 2: Update change log**

Append to `docs/变更日志.md`:

```md
## 2026-05-21

- 初始化 Vue 3 + Vite + TypeScript + Element Plus 后台壳。
- 新增登录占位、后台主布局、左侧菜单、应用/租户切换和首页工作台。
- 新增用户管理、限制与黑名单、律师认证审核、数据导入、系统设置占位页面。
- 新增路由、mock 登录状态、工作区状态和基础测试。
```

- [ ] **Step 3: Update handoff and current task**

Set `codex-handoff.md` current state to:

```md
- 当前阶段：后台 MVP 壳已实现，待后续接入真实 API
- 最近完成：Vue 3 工程、后台布局、登录占位、菜单、工作区切换、占位页面、测试和构建验证
- 未完成：生产级鉴权、真实 API、权限模型、数据导入真实流程
```

Set `tasks/current-task.md` current status to:

```md
- 已完成未提交
```

Add recent verification:

```md
- `npm.cmd run quality`：通过
```

- [ ] **Step 4: Run final verification**

Run: `npm.cmd run quality`

Expected: tests and build pass.

- [ ] **Step 5: Commit documentation**

```powershell
git add README.md docs/变更日志.md codex-handoff.md tasks/current-task.md
git commit -m "docs: update admin mvp handoff"
```

- [ ] **Step 6: Push all commits**

Run: `git push`

Expected: `master -> master` pushed to `https://github.com/hkdijia/cekaitech-admin.git`.

## Self-Review

- Spec coverage: The plan covers the confirmed tech stack, shell-first scope, login placeholder, main layout, sidebar, app/workspace switcher, dashboard, all placeholder pages, mock-only data, and documentation updates.
- Placeholder scan: The implementation plan intentionally uses placeholder pages because the approved MVP scope is placeholder pages. No task contains unspecified `TODO` or `TBD` work.
- Type consistency: Store names, route paths, page filenames, and menu paths are consistent across tasks.
