# 门店预约 admin 接入前置预检

## 目标

- 为 `store-demo-miniapp` 后续进入真实后台前，确认 `cekaitech-admin` 可承接的首片 admin 能力。
- 只对接 `miniapp-backend` 已暴露的受控 API，不直连数据库，不复用 Demo 本机 `wx storage`。
- 先收口读路径和信息展示，不在首片引入真实支付、会员、核销、客户资料、CRM 跟进或服务记录。

## 现有 admin 模式

- API client 放在 `src/api/*.ts`，通过 `src/api/http.ts` 的 `request()` 统一注入后台 token。
- 路由在 `src/router/index.ts` 声明，页面使用 `AdminLayout`，权限码写在 `meta.permissionCode`。
- 侧边栏入口在 `src/router/menu.ts` 声明，按 `filterAdminMenuItems()` 和当前工作区过滤。
- 页面常用结构是：筛选区、分页表格、详情抽屉、按权限展示的管理操作。
- 联调预检脚本是 `scripts/check-admin-integration-ready.mjs`，用于在真实页面开发前确认后端、代理、关键路由和关键模块状态。

## 后端契约

当前可作为 admin 接入输入的 `miniapp-backend` 接口：

- `POST /api/admin/store-appointments/page`
- `GET /api/admin/store-appointments/{appointmentId}`
- `POST /api/admin/store-appointments/{appointmentId}/status`

可用筛选字段：

- `storeCode`
- `projectCode`
- `staffCode`
- `status`
- `appointmentDate`

预约状态：

- `pending`
- `confirmed`
- `arrived`
- `completed`
- `cancelled`

权限码：

- `admin:store-appointment:view`
- `admin:store-appointment:manage`

允许的状态流转：

- `pending -> confirmed`
- `confirmed -> arrived`
- `arrived -> completed`
- `pending -> cancelled`
- `confirmed -> cancelled`

## 首片建议

首片建议实现为只读列表 + 详情抽屉：

- 新增 `src/api/storeAppointments.ts`，只封装分页和详情接口。
- 新增 `/store-appointments` 路由，权限码先使用 `admin:store-appointment:view`。
- 页面展示筛选、分页表格、预约基础信息、门店/项目/员工展示字段、状态日志。
- 暂不展示状态变更按钮，等生产权限、通知、审计和销售场景确认后再接 `status` 接口。

## 暂不做

- 不接真实支付、模拟定金或支付金额模型。
- 不接会员、次卡、积分或复购权益。
- 不接核销码、到店核销或真实履约核销。
- 不沉淀正式客户资料、CRM 跟进或服务记录。
- 康复理疗场景不出现病历、诊断、治疗承诺、疗效暗示。
- 不把 Demo 虚拟门店、虚拟员工、销售话术或样板大厅作为 admin 默认配置。

## 下一轮判断

进入页面实现前，应先确认两件事：

1. 后端分页和详情字段已经与本预检契约一致。
2. `cekaitech-admin` 是否需要新增门店预约工作区，还是先作为全局运营入口承接。

若仍以 Demo 销售演示为主，继续保持只读。只有当真实门店后台闭环进入设计阶段后，再评估 `manage` 权限下的状态流转。
