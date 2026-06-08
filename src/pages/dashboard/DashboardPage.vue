<script setup lang="ts">
import { dashboardCards, pendingItems } from '../../mocks/dashboard';
</script>

<template>
  <section>
    <h1 class="page-title">平台工作台</h1>
    <p class="page-subtitle">统一查看公司级后台待办、工作区接入和系统运行状态。</p>

    <el-alert
      class="trial-alert"
      title="试运行上线前，请确认 admin.cekaitech.cn 已启用 Basic Auth，生产管理员默认密码已修改，接口域名指向 https://api.cekaitech.cn。"
      type="warning"
      :closable="false"
      show-icon
    />

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

.trial-alert {
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
