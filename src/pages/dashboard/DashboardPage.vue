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
