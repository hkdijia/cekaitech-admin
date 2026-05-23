# Current Task

## 当前任务

- 名称：后台 session/operator 刷新恢复与法律表单事件页筛选参数归一化
- OpenSpec 变更：无
- 当前 HEAD：`765f41d test: cover generation records page filters`

## 当前状态

- 已完成；提交和推送状态以当前 Git log 与远程分支为准。

## 已完成

- 完成代码分析：刷新后 Pinia `operator` 缺失会导致路由守卫直接判未登录；项目已有 `getCurrentOperator` 封装和 `/api/admin/auth/current-operator` 接口可复用，无需引入 JWT/Redis/RBAC 大改。
- `src/router/index.ts` 在访问受保护路由时，如果本地 token 存在但 `operator` 缺失，会先调用 `auth.refreshCurrentOperator()` 恢复 operator/permissions，再执行权限码判断。
- current-operator 恢复失败时清理本地 token 并跳转 `/login`。
- 新增 `src/pages/legal-form-events/LegalFormEventsPage.test.ts`，覆盖法律表单事件页初始加载、筛选查询和非法用户 ID。
- `src/pages/legal-form-events/LegalFormEventsPage.vue` 对齐生成记录页查询参数归一化：空关键词、小程序、表单类型、质量状态、事件类型传 `undefined`；用户 ID 仅正整数下发。
- 法律表单事件页新增用户 ID 和事件类型筛选控件。
- `src/api/legalFormEvents.ts` 查询类型补充可选 `userId` 与 `eventType` 字段，不改变接口路径和后端返回契约。
- 更新 `docs/变更日志.md` 和 `codex-handoff.md`。

## 未完成

- 仍需与 `miniapp-backend` 联调确认 `/api/admin/legal/form-events/page` 的 `userId` 和 `eventType` 查询字段命中后端筛选。

## 最近验证

- TDD 红灯：`npm.cmd run test -- --run src/router/router.test.ts` 失败，新增用例证明刷新后仅有本地 token 时不会调用 `/api/admin/auth/current-operator`，过期 token 也未被清理。
- TDD 红灯：`npm.cmd run test -- --run src/pages/legal-form-events/LegalFormEventsPage.test.ts` 失败，新增用例证明初始加载仍下发空字符串，且缺少用户 ID 筛选输入。
- TDD 绿灯：`npm.cmd run test -- --run src/router/router.test.ts` 通过，1 个测试文件、8 个 Vitest 测试通过。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/legal-form-events/LegalFormEventsPage.test.ts` 通过，1 个测试文件、3 个 Vitest 测试通过。
- 相关定向验证：`npm.cmd run test -- --run src/stores/auth.test.ts src/api/adminAuth.test.ts src/api/http.test.ts src/api/legalFormEvents.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/router/router.test.ts` 通过，6 个测试文件、18 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，14 个测试文件、41 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 下一步

1. 用具备 `admin:legal-form-event:view` 权限的账号联调 `/legal-form-events`。
2. 联调后如后端筛选字段命名不同，保持接口契约不变前提下再调整前端字段映射。
