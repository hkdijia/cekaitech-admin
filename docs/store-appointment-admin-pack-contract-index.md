# 门店预约 admin 可移植能力包契约索引

## 目标

本文档是 `cekaitech-admin` 内 Store Appointment Admin Pack 的入口索引，用于把当前已落地的门店预约 admin 前端、契约测试、商业化可移植规划和迁移验收口径串成一个可验证资产。

本索引只描述当前基础预约包的可移植边界，不新增后端接口，不改变页面能力，不实现真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。

## 核心资产

- 商业化可移植规划：`docs/store-appointment-admin-commercial-portability-guide.md`
- 配置审计记录列表后端契约设计：`docs/store-appointment-config-audit-contract-design.md`
- 前端契约守卫：`scripts/store-appointment-frontend-contract-guard.test.mjs`
- 本索引契约测试：`scripts/store-appointment-admin-pack-contract-index.test.mjs`
- API client：`src/api/storeAppointments.ts`
- 页面宿主：`src/pages/store-appointments/StoreAppointmentsPage.vue`
- 页面回归测试：`src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- 变更日志：`docs/变更日志.md`
- 当前任务：`tasks/current-task.md`
- 接力文档：`codex-handoff.md`

## 能力包分层

### 基础预约包

基础预约包是当前已落地并可继续收口的范围：

- 预约列表
- 预约详情
- 状态日志
- 受控状态流转
- 配置快照
- 门店资料配置
- 项目目录配置
- 员工名册配置
- 预约规则配置
- 配置回滚
- admin 配置契约

基础预约包只通过 `miniapp-backend` 受控 API 工作，不直连数据库，不依赖客户侧私有系统，不写入真实支付、会员、CRM 或客户档案能力。

### 商业闭环包

商业闭环包是未来商业化交付必须规划的方向，但当前不实现。

进入商业闭环包前，需要独立完成后端契约、权限、审计、安全、退款、对账、微信支付或服务商模式、异常补偿和验收设计。当前基础预约包不得出现半成品支付入口，也不得用 `priceText` 伪装真实金额。

### 增长运营包

增长运营包用于复购、权益和客户经营，当前不实现。

会员、次卡、优惠券、积分、复购提醒、CRM 跟进、客户分层、客户标签和客户账户策略都必须作为独立阶段设计，不能混入基础预约包。

## 宿主与迁移边界

`cekaitech-admin` 是 Store Appointment Admin Pack 的首个宿主，不是唯一宿主。

可移植交付时，客户侧后台可以复用以下边界：

- API 契约：沿用 `miniapp-backend` 受控 API，不绕过后端。
- 权限码：沿用模块语义权限，并映射到客户自身角色体系。
- 数据边界：至少保留 `appCode`、`storeCode` 和后端租户鉴权边界。
- 组件边界：门店预约页面、API client、组件和测试按门店预约域组织。
- 宿主能力：布局、登录、路由、主题和工作区可以由 `cekaitech-admin` 或客户后台提供。

迁移时不能把 `cekaitech-admin` 内部运营术语、演示门店、演示员工、销售样板话术、wx storage demo key 或诊断/病历类表达带入客户交付包。

## 禁区能力

基础预约包当前不实现以下能力：

- 支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略
- 商户号、真实支付金额、定金、会员卡、核销码、退款规则、通知模板、员工登录账号、私联信息、客户画像
- 配置审计记录列表入口；当前只支持按已知 `auditLogId` 做配置回滚预览和执行

这些能力可以成为后续商业闭环包或增长运营包，但必须有独立需求、后端契约、权限、审计、安全和验收设计。

## 验收命令

本索引相关的最小验收命令：

- `npm.cmd run test -- --run scripts/store-appointment-admin-pack-contract-index.test.mjs`
- `npm.cmd run test -- --run scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `git diff --check`

## 迁移验收口径

后续准备把 Store Appointment Admin Pack 迁移到客户后台或白标后台前，应至少确认：

- 页面无半成品支付、会员、核销、CRM 或客户画像入口。
- API client 只依赖 `miniapp-backend` 受控 API。
- 配置写请求携带 requestId，并具备后端审计基础。
- 配置回滚不会跨门店、跨租户执行。
- 权限码保持模块语义，不绑定内部角色名。
- 品牌、后台名称、主题、员工称谓、项目称谓和门店称谓具备替换空间。
- 构建产物不包含客户 secret、商户号、支付密钥或内部演示数据。
- 商业闭环包和增长运营包仍作为未来独立阶段，不混入当前基础预约包。

## 当前结论

当前阶段继续把 `cekaitech-admin` 作为 Store Appointment Admin Pack 的样板宿主，并把已落地的基础预约包沉淀为可验证、可迁移、可复核的契约资产。

下一阶段可以继续补强：

1. 配置审计记录列表后端契约设计已补充为 `docs/store-appointment-config-audit-contract-design.md`；后续仍需先实现后端接口和契约测试，不能虚构前端入口。
2. 支付商业闭环包的产品和后端契约规划，不能在当前页面落半成品支付入口。
3. 白标托管后台的品牌、权限和部署配置清单。
