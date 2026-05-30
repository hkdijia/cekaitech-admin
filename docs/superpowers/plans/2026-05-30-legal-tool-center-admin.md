# Legal Tool Center Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `cekaitech-admin` management page for LMA-FB-018 so legal tool capabilities, display groups, and exposure entries can be configured through `miniapp-backend` APIs.

**Architecture:** The admin frontend adds a focused API module for `/api/admin/legal-tool-center`, a Vue page with three controlled tabs, and route/menu entries protected by `admin:legal-tool-center:view`. Write actions are hidden unless the operator has `admin:legal-tool-center:manage`. Icon selection reuses the shared `MiniappIconPicker` catalog.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Pinia auth permissions, Vitest, `@vue/test-utils`.

---

### Task 1: API Contract

**Files:**
- Create: `src/api/legalToolCenter.ts`
- Create: `src/api/legalToolCenter.test.ts`

- [ ] **Step 1: Write the failing API test**

Cover `capabilities/page`, `capabilities/save`, `groups/page`, `groups/save`, `groups/{id}/disable`, `exposure-items/page`, `exposure-items/save`, and `exposure-items/{id}/disable`.

- [ ] **Step 2: Run the API test to verify RED**

Run: `npm.cmd run test -- --run src/api/legalToolCenter.test.ts`

Expected: fails because `src/api/legalToolCenter.ts` does not exist.

- [ ] **Step 3: Implement the API module**

Define typed page queries, response items, save payloads, and request functions. Use only `request()` and backend-controlled JSON payloads.

- [ ] **Step 4: Run the API test to verify GREEN**

Run: `npm.cmd run test -- --run src/api/legalToolCenter.test.ts`

Expected: passes.

### Task 2: Admin Page

**Files:**
- Create: `src/pages/legal-tool-center/LegalToolCenterPage.vue`
- Create: `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`

- [ ] **Step 1: Write the failing page test**

Cover initial loading, write-permission hiding, saving each form, disabling groups/items, selecting a shared icon for exposure items, and rendering source/risk/status metadata.

- [ ] **Step 2: Run the page test to verify RED**

Run: `npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts`

Expected: fails because the page component does not exist.

- [ ] **Step 3: Implement the page**

Create tabs for `能力库`, `展示分组`, and `曝光入口`. Keep all fields structured; do not allow arbitrary page code.

- [ ] **Step 4: Run the page test to verify GREEN**

Run: `npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts`

Expected: passes.

### Task 3: Route And Menu

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/router/menu.ts`
- Modify: `src/router/router.test.ts`

- [ ] **Step 1: Add the failing route assertion**

Assert `/legal-tool-center` exists in the sidebar and routes, with title `法律工具中心` and permission `admin:legal-tool-center:view`.

- [ ] **Step 2: Run router test to verify RED**

Run: `npm.cmd run test -- --run src/router/router.test.ts`

Expected: fails because the route/menu entry is absent.

- [ ] **Step 3: Add route and menu entries**

Route the page under `AdminLayout`, matching existing page patterns.

- [ ] **Step 4: Run router test to verify GREEN**

Run: `npm.cmd run test -- --run src/router/router.test.ts`

Expected: passes.

### Task 4: Docs And Traceability

**Files:**
- Modify: `docs/变更日志.md`
- Modify: `codex-decisions.md`
- Modify: `tasks/current-task.md`
- Modify: `codex-handoff.md`

- [ ] **Step 1: Update docs**

Record `反馈编号：LMA-FB-018`, the admin-side impact, verification commands, and remaining follow-up.

- [ ] **Step 2: Verify docs mention the feedback ID**

Run: `rg -n "LMA-FB-018|legal-tool-center|法律工具中心" docs tasks codex-decisions.md codex-handoff.md`

Expected: entries exist in task, changelog, decisions, and handoff docs.

### Task 5: Final Verification And Commit

**Files:**
- All files touched above.

- [ ] **Step 1: Run targeted verification**

Run: `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/router/router.test.ts`

Expected: passes.

- [ ] **Step 2: Run full quality gate**

Run: `npm.cmd run quality`

Expected: passes, allowing existing build warnings only.

- [ ] **Step 3: Run diff check**

Run: `git diff --check`

Expected: no whitespace errors beyond repository-existing Windows line-ending notices if any.

- [ ] **Step 4: Commit and push**

Commit: `feat: add legal tool center admin page`

Footer: `Refs: LMA-FB-018`
