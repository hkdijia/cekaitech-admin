<script setup lang="ts">
const configSurfaceReadiness = [
  {
    key: 'store-profile',
    name: '门店资料',
    status: 'candidate',
    tagType: 'success',
    note: '营业时间、电话、员工称谓和项目称谓可作为中性配置候选；不得带虚拟门店名或真实租户字段。'
  },
  {
    key: 'service-catalog',
    name: '项目目录',
    status: 'candidate',
    tagType: 'success',
    note: '分类、项目、时长和 priceText 可作为预约骨架；priceText 仅为展示文案，不代表支付能力。'
  },
  {
    key: 'staff-roster',
    name: '员工名册',
    status: 'candidate',
    tagType: 'success',
    note: '员工展示资料、角色和启用状态可作为候选；不包含员工账号、权限和真实排班后台。'
  },
  {
    key: 'appointment-rules',
    name: '预约规则',
    status: 'candidate-with-caution',
    tagType: 'warning',
    note: '仅保留可约窗口、默认时长和默认时段；真实排班、通知和取消策略需另行生产设计。'
  },
  {
    key: 'operation-summary',
    name: '经营摘要',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '涉及租户、权限、统计口径和经营数据可见范围，当前不能直接进入模板结构。'
  },
  {
    key: 'feedback-follow-up',
    name: '反馈跟进',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '涉及客户表达、隐私授权和跟进状态，未来必须先做隐私和权限设计。'
  },
  {
    key: 'service-record',
    name: '服务记录',
    status: 'blocked-by-production-design',
    tagType: 'info',
    note: '只作为本机演示备注候选；康复理疗场景不能演变为病历、诊断或客户档案。'
  }
];

const demoOnlyExcluded = [
  'demo-only-excluded',
  '虚拟门店/员工',
  '销售样板话术',
  '模拟支付/核销/会员',
  'wx storage 演示 key',
  '病历/诊断类表达'
];
</script>

<template>
  <el-card shadow="never" class="readiness-panel">
    <template #header>
      <div class="card-header">
        <span>配置面 readiness</span>
        <el-tag type="warning" effect="plain">编辑入口未开放</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="warning"
      title="本区只标注后续 admin/模板设计边界；当前不写入配置，不创建真实门店、项目、员工、排班、会员或支付能力。"
      show-icon
    />
    <el-table :data="configSurfaceReadiness" row-key="key" size="small">
      <el-table-column prop="name" label="配置面" width="116" />
      <el-table-column prop="key" label="key" width="180" show-overflow-tooltip />
      <el-table-column label="状态" width="210">
        <template #default="{ row }">
          <el-tag :type="row.tagType" effect="plain">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="边界说明" min-width="320" show-overflow-tooltip />
    </el-table>
    <div class="excluded-row">
      <span v-for="item in demoOnlyExcluded" :key="item" class="excluded-chip">{{ item }}</span>
    </div>
  </el-card>
</template>

<style scoped>
.readiness-panel {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.readonly-alert {
  margin-bottom: 16px;
}

.excluded-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
}

.excluded-chip {
  border: 1px solid #f3d19e;
  border-radius: 4px;
  background: #fdf6ec;
  color: #9a5b13;
  font-size: 12px;
  line-height: 24px;
  padding: 0 8px;
}
</style>
