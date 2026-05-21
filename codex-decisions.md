# Codex Decisions

## 1. 管理后台独立于小程序目录

**决定了什么：**

`cekaitech-admin` 放在 `C:\Users\p15-gen2\Documents\work_space\myself\java\cekaitech-admin`，不放在 `miniapp` 目录下。

**为什么这么决定：**

管理后台是公司级运营系统，不属于某一个小程序前端。放在 `java` 工作区可以和本地 `crawler`、后端管理能力保持更清晰的工程边界。

**已否决方案：**

- 放在 `miniapp/cekaitech-admin` 作为小程序矩阵子目录。

## 2. 管理后台只通过后端 API 管理业务数据

**决定了什么：**

后台不直接写生产数据库，不直接操作小程序本地缓存，不直接控制本地 crawler。

**为什么这么决定：**

所有生产业务事实需要经过 `miniapp-backend` 的权限、校验、审计和风控边界，避免后台和数据采集能力绕过统一后端。

**已否决方案：**

- 后台直连数据库修改业务表。
- 后台直接调用本地 crawler 进程写云端数据。
