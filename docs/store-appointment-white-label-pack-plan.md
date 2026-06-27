# 门店预约白标托管后台配置清单

## 目标

本文档定义 Store Appointment Admin Pack 迁移到白标托管后台时需要提前确认的品牌、权限和部署配置清单。

当前状态为规划态。本轮不新增运行时代码，不新增路由，不改布局，不改登录，不改主题实现，不创建客户后台，不写生产配置。

## 当前边界

`cekaitech-admin` 仍是当前样板宿主和自营后台。白标托管后台是后续商业化交付形态，不能直接把当前内部后台改造成客户后台。

本轮只沉淀配置清单和验收门禁：

- 品牌配置
- 术语配置
- 权限映射
- API base URL
- 客户域名
- 部署环境
- 客户 secret 和密钥边界
- 模块开关
- 验收门禁

## 品牌配置

白标托管后台至少需要支持以下配置项：

- 后台名称
- Logo
- favicon
- 主题色
- 登录页标题
- 页脚版权文案
- 客服联系方式
- 帮助文档入口

品牌配置应由部署环境或后端配置下发，不能把客户品牌写死到 Store Appointment Admin Pack 的业务组件中。

## 术语配置

门店预约模块需要保留中性术语，并允许客户侧映射：

- 门店称谓：门店、网点、校区、诊所、门诊
- 员工称谓：员工、技师、顾问、老师、医生
- 项目称谓：项目、服务、课程、套餐、咨询
- 预约称谓：预约、到店、咨询、服务单

术语替换不能改变后端字段语义。前端展示可以替换文案，但 API 契约仍以正式字段和权限码为准。

## 权限映射

白标托管后台不能绑定 `cekaitech-admin` 内部角色名。客户侧角色需要映射到模块语义权限：

- `admin:store-appointment:view`
- `admin:store-appointment:manage`
- `admin:store-appointment-config:manage`
- `admin:store-appointment-payment:view`
- `admin:store-appointment-payment:manage`
- `admin:store-appointment-refund:manage`
- `admin:store-appointment-writeoff:manage`
- `admin:store-appointment-reconciliation:view`

基础预约包只需要前三个权限。支付、退款、核销和对账权限属于商业闭环包，后端契约和验收完成前不得在白标后台启用。

## 部署配置

白标托管后台至少需要明确：

- API base URL
- 客户域名
- 静态资源 CDN 域名
- 登录认证方式
- 租户标识来源
- 应用标识来源
- 环境名称
- 灰度开关
- 回滚策略
- 错误监控入口

这些配置应由部署流水线、环境变量或后端配置服务管理。客户 secret、商户密钥、证书、支付回调密钥、内部演示数据不能写入前端构建产物。

## 模块开关

白标托管后台需要模块开关，避免客户看到未交付能力：

- 基础预约包：可启用。
- 配置审计记录列表：后端接口和契约测试完成后才可启用。
- 支付商业闭环包：支付、退款、核销、对账后端契约完成后才可启用。
- 增长运营包：会员、优惠券、CRM 和客户账户策略完成独立设计后才可启用。

模块开关不得绕过后端权限。前端隐藏入口只是用户体验控制，安全边界必须由后端鉴权保证。

## 数据隔离

白标托管后台必须明确租户和门店边界：

- 所有请求必须经过 `miniapp-backend`。
- 前端不得直连数据库。
- 前端不得以本地筛选作为租户隔离依据。
- `storeCode`、`appCode` 和租户上下文必须由后端校验。
- 配置回滚、支付、退款、核销和对账都不得跨租户或跨门店执行。

## 禁止携带内容

迁移到白标托管后台时，不能携带：

- `cekaitech-admin` 内部运营术语
- 演示门店
- 演示员工
- 销售样板话术
- wx storage demo key
- 诊断或病历类表达
- 客户 secret
- 商户密钥
- 支付证书
- 内部演示数据

这些内容不能写入前端构建产物，也不能作为客户交付默认配置。

## 接入前置条件

进入白标托管后台实现前，必须先完成：

- 品牌配置来源设计。
- 术语配置来源设计。
- 权限映射表。
- API base URL 和客户域名配置方案。
- 租户、应用和门店上下文来源设计。
- 模块开关设计。
- 构建产物 secret 扫描。
- 灰度、回滚和部署验收流程。
- 客户交付验收清单。

本轮不新增运行时代码，不新增路由，不新增白标配置页面，不改变当前 `cekaitech-admin` 页面。

## 验收门禁

白标托管后台实现前，至少需要以下门禁：

- 构建产物不包含客户 secret、商户密钥、证书或内部演示数据。
- 所有业务请求只通过 `miniapp-backend`。
- 权限映射不绑定内部角色名。
- 品牌、后台名称、主题色、员工称谓、项目称谓和门店称谓可替换。
- 模块开关不能暴露未交付的支付、会员、核销、CRM 或客户账户策略入口。
- 低权限账号不能访问隐藏模块对应后端接口。
- 生产、预发、演示和客户环境具备独立 API base URL 和客户域名。

## 验收命令

本规划资产的最小验收命令：

- `npm.cmd run test -- --run scripts/store-appointment-white-label-pack-plan.test.mjs`
- `npm.cmd run test -- --run scripts/store-appointment-white-label-pack-plan.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `git diff --check`
