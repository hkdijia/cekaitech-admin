# 门店预约配置审计记录列表后端接口契约测试规划

## 目标

本文档定义门店预约配置审计记录列表后端接口进入实现前必须先补齐的契约测试规划，用于把既有设计态接口推进到可验证的后端测试资产。

当前状态为规划态。本轮只规划后端契约测试，不实现后端接口，不新增 API client，不新增页面入口，不改变当前门店预约 admin 页面。

## 当前边界

既有设计文档 `docs/store-appointment-config-audit-contract-design.md` 已定义未来接口方向：

- `GET /api/admin/store-appointment-config/stores/{storeCode}/audit-logs`

本轮承接该设计，只明确 `miniapp-backend` 后续应先补后端契约测试，再进入接口实现。`cekaitech-admin` 当前仍不能调用该路径，也不能在页面中暴露审计记录列表入口。

## 契约测试目标

后端接口实现前，至少需要先补后端契约测试覆盖：

- 正常分页查询指定门店的配置审计记录。
- 查询参数归一化和非法参数拒绝。
- 四个中性配置面 surface 白名单。
- storeCode 范围校验。
- 权限 403。
- 空列表。
- 回滚可用性字段 `rollbackAvailable`。
- 禁止暴露 raw payload 和内部租户字段。
- 跨门店查询拒绝。
- 跨租户查询拒绝。

这些测试必须先于接口实现落地，避免后端接口上线后才补契约导致字段、权限和数据隔离漂移。

## 必测请求参数

路径参数：

- `storeCode`：必填，只能查询当前管理员被授权的门店范围。

分页参数：

- `pageNo`：必填，正整数。
- `pageSize`：必填，正整数，最大 100。

筛选参数：

- `surface`：可选，只允许 `store-profile`、`service-catalog`、`staff-roster`、`appointment-rules`。
- `targetCode`：可选，用于项目、员工、门店或规则目标筛选。
- `operatorId`：可选，只能按后端允许的管理员范围筛选。
- `operationType`：可选，例如 `create`、`update`、`rollback`。
- `dateFrom` / `dateTo`：可选，按审计创建时间筛选。

参数契约测试应覆盖空值、非法页码、超大 `pageSize`、非法 `surface`、非法日期范围和不属于当前范围的 `storeCode`。

## 必测响应字段

分页响应沿用 admin 分页结构：

- `dataList`
- `totalCount`

单条审计记录至少验证：

- `auditLogId`
- `storeCode`
- `surface`
- `targetCode`
- `operationType`
- `operatorId`
- `operatorName`
- `summary`
- `changedFields`
- `createdAt`
- `rollbackAvailable`

契约测试必须确认响应字段保持白名单输出，不能因为实现方便直接透传数据库审计实体。

## 权限和隔离测试

权限测试至少覆盖：

- 缺少 `admin:store-appointment-config:manage` 时返回权限 403。
- 具备查看预约但不具备配置管理权限时不能查询审计记录。
- 具备配置管理权限但不属于目标门店范围时不能查询。

隔离测试至少覆盖：

- 当前门店只能查询自己的审计记录。
- 跨门店查询必须拒绝。
- 跨租户查询必须拒绝。
- 前端传入的 `storeCode` 不能覆盖后端租户和门店鉴权结果。

## 禁止数据暴露

契约测试必须确认响应不包含：

- raw payload
- 内部租户字段
- 数据库主键之外的内部关联字段
- 商户号、真实支付金额、支付单号、退款单号
- 会员卡号、客户画像、私联信息、通知模板
- 员工登录账号、客户资料、CRM、服务记录、真实排班数据

配置审计列表只服务基础预约包的四个中性配置面，不能成为支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略的数据出口。

## 错误码和空状态

后端契约测试至少覆盖：

- 无权限：403。
- 门店不存在或无权访问：404 或后端正式错误码，以实现前契约为准。
- 非法参数：400。
- 非法 `surface`：400。
- 合法查询但没有审计记录：返回空列表，`dataList` 为空数组，`totalCount` 为 0。

错误响应不得泄露租户存在性、内部表名、SQL 信息或 raw payload。

## 回滚链路联动测试

审计记录列表只提供候选 `auditLogId`，不能直接执行回滚。

后续契约测试应联动验证：

- 列表返回的 `auditLogId` 可以进入既有回滚预览接口。
- `rollbackAvailable=false` 的记录不能执行回滚。
- 回滚执行仍必须调用既有受控接口，并携带写请求 requestId。
- 回滚执行后后端写入新的 rollback 审计记录。

既有回滚接口：

- `GET /api/admin/store-appointment-config/stores/{storeCode}/rollback-preview/{auditLogId}`
- `POST /api/admin/store-appointment-config/stores/{storeCode}/rollback/{auditLogId}`

## Admin 接入前置条件

在 `cekaitech-admin` 增加 API client 或页面入口前，必须先完成：

- 后端契约测试。
- 后端接口实现。
- 权限、租户和门店隔离测试。
- 字段白名单和脱敏测试。
- 空列表和错误码测试。
- 回滚链路联动测试。
- 前端契约测试更新。

本轮不新增 API client，不新增页面入口，不在现有回滚区域添加审计列表按钮，不实现后端接口。

## 禁止能力

当前规划不实现：

- 后端审计列表接口
- 前端 API client
- 页面入口
- 配置审计列表组件
- 自动回滚
- 支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略

这些能力需要独立后端契约、权限、审计、安全和验收设计后再进入实现。

## 验收命令

本规划资产的最小验收命令：

- `npm.cmd run test -- --run scripts/store-appointment-config-audit-api-contract-plan.test.mjs`
- `npm.cmd run test -- --run scripts/store-appointment-config-audit-api-contract-plan.test.mjs scripts/store-appointment-config-audit-contract-index.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `git diff --check`
