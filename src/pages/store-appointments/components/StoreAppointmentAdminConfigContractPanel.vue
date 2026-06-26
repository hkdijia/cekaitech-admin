<script setup lang="ts">
const adminConfigContract = [
  {
    surfaceKey: 'store-profile',
    surfaceName: '门店资料',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/PUT /api/admin/store-appointment-config/stores/{storeCode}',
    writableFields: 'name, industry, phone, address, businessHours, staffLabel, projectLabel, showPrice',
    excludedFields: 'tenantId, appId, merchantId, realAdminUserId'
  },
  {
    surfaceKey: 'service-catalog',
    surfaceName: '项目目录',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/POST /api/admin/store-appointment-config/stores/{storeCode}/projects；PUT /api/admin/store-appointment-config/projects/{projectCode}',
    writableFields: 'categoryId, name, summary, durationMinutes, priceText, showPrice, enabled',
    excludedFields: 'paymentAmount, depositAmount, paymentRuleId, memberCardId'
  },
  {
    surfaceKey: 'staff-roster',
    surfaceName: '员工名册',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/POST /api/admin/store-appointment-config/stores/{storeCode}/staff；PUT /api/admin/store-appointment-config/staff/{staffCode}',
    writableFields: 'name, role, bio, avatarUrl, trustHighlights, enabled, projectCodes',
    excludedFields: 'loginAccountId, rolePermissionId, shiftScheduleId, privateContact'
  },
  {
    surfaceKey: 'appointment-rules',
    surfaceName: '预约规则',
    status: 'backend-ready-frontend-pending',
    requiredPermission: 'admin:store-appointment-config:manage',
    endpoints: 'GET/PUT /api/admin/store-appointment-config/rules/{storeCode}',
    writableFields: 'bookingWindowDays, defaultDurationMinutes, defaultSlots, confirmationHint, cancelHint',
    excludedFields: 'notificationTemplateId, refundRuleId, realSchedulePolicyId, customerAccountPolicy'
  }
];
</script>

<template>
  <el-card shadow="never" class="api-gap-panel">
    <template #header>
      <div class="card-header">
        <span>admin 配置契约</span>
        <el-tag type="info" effect="plain">后端 ready，前端待接入</el-tag>
      </div>
    </template>
    <el-alert
      class="readonly-alert"
      type="info"
      title="以下后端配置接口已具备契约；当前页面仍不提供编辑表单、保存配置或绕过后端写数据。"
      show-icon
    />
    <el-table :data="adminConfigContract" row-key="surfaceKey" size="small">
      <el-table-column prop="surfaceName" label="配置面" width="108" />
      <el-table-column label="状态" width="152">
        <template #default="{ row }">
          <el-tag type="info" effect="plain">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requiredPermission" label="权限码" min-width="230" show-overflow-tooltip />
      <el-table-column prop="endpoints" label="后端接口" min-width="360" show-overflow-tooltip />
      <el-table-column prop="writableFields" label="候选可写字段" min-width="260" show-overflow-tooltip />
      <el-table-column prop="excludedFields" label="排除字段" min-width="260" show-overflow-tooltip />
    </el-table>
  </el-card>
</template>

<style scoped>
.api-gap-panel {
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
</style>
