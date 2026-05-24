# AGENTS.md

## 项目边界

- 本项目是策凯科技公司级管理后台，不属于某一个小程序前端。
- 本项目后续通过 `miniapp-backend` 的受控 API 管理云端业务数据。
- 本项目不直接连接生产数据库，不绕过后端写业务数据。
- 本项目不直接控制本地 `crawler` 进程；如需导入数据，应通过文件导入或受控同步 API。

## 开发流程

- 所有已落地变更同步维护 `docs/变更日志.md`。
- 重大功能先更新 `codex-decisions.md` 和 `tasks/current-task.md`。
- 后续选择前端/后端技术栈前，先补充方案并确认。
- 来自企业微信文档或产品反馈台账的需求、问题和建议，必须保留反馈编号并贯穿任务文档、变更日志、验证记录、提交信息和阶段回写；统一规范参考外层总账仓库 `..\..\miniapp\docs\feedback-traceability.md`。
- 若一次反馈涉及 `cekaitech-admin`、`miniapp-backend` 和小程序前端等多个仓库，本仓库 `docs/变更日志.md` 必须记录同一反馈编号和管理后台侧影响范围。
- 若改动不对应任何反馈编号，记录为 `反馈编号：无`，不要为普通工程维护伪造产品反馈编号。

## 提交规范

- 建议使用 Conventional Commits：`feat:`、`fix:`、`refactor:`、`docs:`、`chore:`。
- 涉及反馈编号的提交，提交正文或 footer 必须包含 `Refs: LMA-FB-001`；多个编号用英文逗号分隔。
- 无反馈编号时写 `Refs: none`。

## 当前项目

- 项目名称：cekaitech-admin
- 项目定位：策凯科技公司级运营和管理后台
- 当前阶段：占位仓库初始化
- 关键边界：只通过 `miniapp-backend` API 管理业务数据
