# cekaitech-admin

策凯科技公司级运营和管理后台。

## 定位

`cekaitech-admin` 不属于某一个小程序。它面向公司运营和管理，后续用于承载用户管理、应用/租户切换、认证审核、订单与服务请求、黑名单、用户等级、内容配置和数据导入等能力。

## 边界

- 通过 `miniapp-backend` 的受控 API 读写云端业务数据。
- 不直接操作各小程序本地缓存。
- 不直接写生产数据库。
- 不直接控制本地 `crawler` 进程。
- 若后续需要同步 crawler 数据，应通过本地导出文件、导入页面或后端受控 API 完成。

## 当前状态

当前已初始化 Vue 3 + Vite + TypeScript + Element Plus 后台 MVP 壳，包含开发占位登录、后台布局、菜单、工作区切换、首页工作台和首批业务占位页面。
登录已接入 `miniapp-backend` 的开发态后台认证接口，本地默认账号为 `admin/123456`。

## 本地开发

安装依赖：

```powershell
npm.cmd install
```

启动开发服务：

```powershell
npm.cmd run dev
```

开发服务会通过 Vite 将 `/api` 代理到 `http://127.0.0.1:8080`，联调登录前需要先启动 `miniapp-backend`。

生产构建 API 地址模板：

```text
.env.production.example
```

生产部署说明：

```text
docs/production-runbook.md
```

前端环境变量会写入构建产物，不要在 `.env.production` 中放任何 secret。

构建：

```powershell
npm.cmd run build
```

测试：

```powershell
npm.cmd test
```

完整质量检查：

```powershell
npm.cmd run quality
```

## 事实来源

- `codex-handoff.md`
- `codex-decisions.md`
- `tasks/current-task.md`
- `docs/变更日志.md`
