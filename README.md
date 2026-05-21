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

当前仅初始化占位仓库和项目接力文档，暂不选择前端框架，暂不实现业务页面。

## 事实来源

- `codex-handoff.md`
- `codex-decisions.md`
- `tasks/current-task.md`
- `docs/变更日志.md`
