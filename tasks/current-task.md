# Current Task

## 当前任务

- 名称：年度数据治理覆盖矩阵 admin 接入
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 年度数据治理主线
- 本地台账：无
- 当前状态：admin 已接入 backend 年度数据覆盖矩阵只读接口，源码、测试和文档已完成，待随 backend 发布后进行生产静态站部署与线上验收。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 读取数据治理结果，不直连数据库。
- 数据同步/发布页新增“年度覆盖矩阵”页签，按年份展示省级地区覆盖、指标覆盖、缺失指标、缺失地区数量和最近同步批次。
- 本轮 admin 依赖 backend 新接口 `POST /api/admin/data-governance/annual-common-data/coverage-matrix`；backend 已完成本地提交，生产部署后 admin 静态页面才可线上联调该页签。

## 已完成

- [反馈编号：无] `src/api/dataGovernance.ts` 新增 `AnnualCommonDataCoverageMatrix`、`AnnualCommonDataYearCoverage` 类型和 `getAnnualCommonDataCoverageMatrix` API 封装。
- [反馈编号：无] `DataGovernancePage.vue` 刷新数据时同步加载年度覆盖矩阵，并新增“年度覆盖矩阵”页签展示覆盖状态、数据条数、地区/指标覆盖和最近批次。
- [反馈编号：无] `dataGovernance.test.ts` 和 `DataGovernancePage.test.ts` 补充 API 封装和页面加载断言，覆盖 2025 缺口与 2024 完整两类展示。

## 最近验证

- RED/GREEN：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 先失败于缺少 `getAnnualCommonDataCoverageMatrix` API 和页面未加载覆盖矩阵；实现后 2 个测试文件、15 项通过。
- `npm.cmd run quality` 通过：Vitest 35 个测试文件、184 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 `@vueuse/core` PURE 注释 warning 和 chunk size warning。

## 未完成

- 本轮 admin 源码、测试和文档已完成；尚未部署 admin 静态资源。

## 下一步

1. 等 backend 年度覆盖矩阵接口发布到生产测试环境后，部署 admin 静态资源并在线上验证“数据同步/发布 -> 年度覆盖矩阵”。
2. 继续年度数据治理主线：基于覆盖矩阵确认最新有效年度数据范围，清理或归档重复批次，推进缺口数据补齐。
