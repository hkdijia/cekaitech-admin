import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  pageLegalToolCapabilities,
  pageLegalToolDataSources,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  pageLegalToolInteractionBlueprints,
  pageLegalLprRates,
  pageLitigationFeeRules,
  previewLitigationFeeRule,
  publishLitigationFeeRule,
  saveLegalToolCapability,
  saveLegalToolDataSource,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem
  ,
  saveLegalToolInteractionBlueprint,
  saveLitigationFeeRule,
  saveLegalLprRate
} from '../../api/legalToolCenter';
import { useAuthStore } from '../../stores/auth';
import LegalToolCenterPage from './LegalToolCenterPage.vue';

vi.mock('../../api/legalToolCenter', () => ({
  pageLegalToolCapabilities: vi.fn(),
  saveLegalToolCapability: vi.fn(),
  pageLegalToolDataSources: vi.fn(),
  saveLegalToolDataSource: vi.fn(),
  pageLegalToolExposureGroups: vi.fn(),
  saveLegalToolExposureGroup: vi.fn(),
  disableLegalToolExposureGroup: vi.fn(),
  pageLegalToolExposureItems: vi.fn(),
  saveLegalToolExposureItem: vi.fn(),
  disableLegalToolExposureItem: vi.fn(),
  pageLegalToolInteractionBlueprints: vi.fn(),
  saveLegalToolInteractionBlueprint: vi.fn(),
  pageLegalLprRates: vi.fn(),
  saveLegalLprRate: vi.fn(),
  pageLitigationFeeRules: vi.fn(),
  saveLitigationFeeRule: vi.fn(),
  previewLitigationFeeRule: vi.fn(),
  publishLitigationFeeRule: vi.fn()
}));

const pageLegalToolCapabilitiesMock = vi.mocked(pageLegalToolCapabilities);
const saveLegalToolCapabilityMock = vi.mocked(saveLegalToolCapability);
const pageLegalToolDataSourcesMock = vi.mocked(pageLegalToolDataSources);
const saveLegalToolDataSourceMock = vi.mocked(saveLegalToolDataSource);
const pageLegalToolExposureGroupsMock = vi.mocked(pageLegalToolExposureGroups);
const saveLegalToolExposureGroupMock = vi.mocked(saveLegalToolExposureGroup);
const disableLegalToolExposureGroupMock = vi.mocked(disableLegalToolExposureGroup);
const pageLegalToolExposureItemsMock = vi.mocked(pageLegalToolExposureItems);
const saveLegalToolExposureItemMock = vi.mocked(saveLegalToolExposureItem);
const disableLegalToolExposureItemMock = vi.mocked(disableLegalToolExposureItem);
const pageLegalToolInteractionBlueprintsMock = vi.mocked(pageLegalToolInteractionBlueprints);
const saveLegalToolInteractionBlueprintMock = vi.mocked(saveLegalToolInteractionBlueprint);
const pageLegalLprRatesMock = vi.mocked(pageLegalLprRates);
const saveLegalLprRateMock = vi.mocked(saveLegalLprRate);
const pageLitigationFeeRulesMock = vi.mocked(pageLitigationFeeRules);
const saveLitigationFeeRuleMock = vi.mocked(saveLitigationFeeRule);
const previewLitigationFeeRuleMock = vi.mocked(previewLitigationFeeRule);
const publishLitigationFeeRuleMock = vi.mocked(publishLitigationFeeRule);

const capability = {
  id: 1,
  appCode: 'lawsuit-material-assistant',
  toolKey: 'litigation_fee',
  title: '诉讼费用',
  description: '按标的额估算案件受理费参考值',
  category: 'calculator',
  status: 'public',
  audience: 'general_user',
  sourceLevel: 'official',
  dataDependency: 'static_table',
  executionMode: 'local_static',
  riskLevel: 'medium',
  defaultIconKey: 'scale',
  defaultTargetPath: '/pages/litigation-fee/litigation-fee',
  defaultAction: 'navigate',
  sourceName: '阳光法律助手本地工具口径',
  sourceUrl: '',
  sourceVersion: 'local-v1',
  sourceEffectiveDate: '',
  lastCheckedDate: '2026-05-30',
  ownerNote: '后续补充官方收费依据版本。',
  sortOrder: 20,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const privateLendingInterestCapability = {
  ...capability,
  id: 2,
  toolKey: 'private_lending_interest',
  title: '新民间借贷利息',
  description: '按合同成立日 LPR 四倍保护上限估算民间借贷利息参考值',
  status: 'public',
  audience: 'litigation_user',
  sourceLevel: 'official',
  dataDependency: 'rate_series',
  executionMode: 'backend_rule',
  riskLevel: 'high',
  defaultIconKey: 'calculator',
  defaultTargetPath: '/pages/private-lending-interest/private-lending-interest',
  defaultAction: 'navigate',
  sourceName: '最高人民法院民间借贷司法解释 / 贷款市场报价利率 LPR',
  sourceUrl: 'https://cicc.court.gov.cn/html/1/218/62/84/12844.html',
  sourceVersion: 'private-lending-lpr-4x-v1',
  lastCheckedDate: '2026-05-31',
  ownerNote: '按合同成立日不晚于该日的最近一期一年期 LPR 计算四倍保护上限。',
  sortOrder: 40,
};

const dateCalculationCapability = {
  ...capability,
  id: 3,
  toolKey: 'date_calculation',
  title: '日期推算',
  description: '自然日差值与加减天数参考推算',
  status: 'public',
  audience: 'general_user',
  sourceLevel: 'self_modeled',
  dataDependency: 'none',
  executionMode: 'local_static',
  riskLevel: 'low',
  defaultIconKey: 'calendar-days',
  defaultTargetPath: '/pages/date-calculation/date-calculation',
  sourceName: '阳光法律助手本地工具口径',
  sourceVersion: 'natural-day-v1',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做自然日参考推算，不包含法定节假日顺延或诉讼期间规则判断。',
  sortOrder: 50,
};

const paidAnnualLeaveCapability = {
  ...capability,
  id: 4,
  toolKey: 'paid_annual_leave',
  title: '带薪年休假',
  description: '年休假天数和未休工资参考测算',
  status: 'public',
  audience: 'labor_user',
  sourceLevel: 'official',
  dataDependency: 'rule_tree',
  executionMode: 'local_static',
  riskLevel: 'medium',
  defaultIconKey: 'calendar-check',
  defaultTargetPath: '/pages/paid-annual-leave/paid-annual-leave',
  sourceName: '职工带薪年休假条例',
  sourceUrl: 'https://www.gov.cn/gongbao/content/content_859865.htm',
  sourceVersion: 'state-council-order-514',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做年休假天数和未休工资参考测算，不判断具体不享受情形。',
  sortOrder: 60,
};

const wageConversionCapability = {
  ...capability,
  id: 10,
  toolKey: 'wage_conversion',
  title: '工资折算',
  description: '按月工资折算日工资与小时工资参考值',
  status: 'public',
  audience: 'labor_user',
  sourceLevel: 'official',
  dataDependency: 'static_rule',
  executionMode: 'miniapp_local_calculation',
  riskLevel: 'low',
  defaultIconKey: 'badge-dollar-sign',
  defaultTargetPath: '/pages/wage-conversion/wage-conversion',
  sourceName: '人力资源社会保障部关于职工全年月平均工作时间和工资折算问题的通知',
  sourceUrl: 'https://www.gov.cn/zhengce/zhengceku/202501/content_6995777.htm',
  sourceVersion: 'mohrss-2025-2-wage-conversion',
  sourceEffectiveDate: '2025-01-01',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做日工资、小时工资和天数/小时金额折算，不处理加班费和扣款。',
  sortOrder: 65,
};

const statutoryRetirementAgeCapability = {
  ...capability,
  id: 11,
  toolKey: 'statutory_retirement_age',
  title: '延迟退休年龄',
  description: '按出生年月核对渐进式延迟后的法定退休年龄',
  category: 'compensation',
  status: 'public',
  audience: 'labor_user',
  sourceLevel: 'official',
  dataDependency: 'static_rule',
  executionMode: 'miniapp_local_calculation',
  riskLevel: 'medium',
  defaultIconKey: 'hourglass',
  defaultTargetPath: '/pages/statutory-retirement-age/statutory-retirement-age',
  sourceName: '全国人民代表大会常务委员会关于实施渐进式延迟法定退休年龄的决定',
  sourceUrl: 'https://www.npc.gov.cn/npc/c2/kgfb/202409/t20240913_439534.html',
  sourceVersion: 'npc-2024-statutory-retirement-age',
  sourceEffectiveDate: '2025-01-01',
  lastCheckedDate: '2026-06-01',
  ownerNote: '首片只按出生年月和原法定退休年龄类别推算，不处理缴费年限、弹性退休申请、特殊工种、地区政策和身份争议。',
  sortOrder: 66,
};

const civilCauseCapability = {
  ...capability,
  id: 5,
  toolKey: 'civil_cause_of_action',
  title: '民事案由',
  description: '民事案由检索与层级查询',
  category: 'rule_query',
  status: 'public',
  audience: 'litigation_user',
  sourceLevel: 'official',
  dataDependency: 'static_table',
  executionMode: 'backend_data',
  riskLevel: 'medium',
  defaultIconKey: 'search-check',
  defaultTargetPath: '/pages/civil-cause/civil-cause',
  sourceName: '民事案件案由规定（第三次修正）',
  sourceUrl: 'https://www.court.gov.cn/zixun/xiangqing/484231.html',
  sourceVersion: '2025-third-amendment',
  sourceEffectiveDate: '2026-01-01',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只开放少量官方案由样本检索，不做案件类型自动判断。',
  sortOrder: 70,
};

const delayedPerformanceInterestCapability = {
  ...capability,
  id: 6,
  toolKey: 'delayed_performance_interest',
  title: '延迟履行利息',
  description: '执行阶段加倍部分债务利息参考估算',
  status: 'public',
  audience: 'litigation_user',
  sourceLevel: 'official',
  dataDependency: 'static_rule',
  executionMode: 'miniapp_local_calculation',
  riskLevel: 'medium',
  defaultIconKey: 'timer-reset',
  defaultTargetPath: '/pages/delayed-performance-interest/delayed-performance-interest',
  sourceName: '最高人民法院关于执行程序中计算迟延履行期间的债务利息适用法律若干问题的解释',
  sourceUrl: 'https://gongbao.court.gov.cn/Details/a16755bf8fffacb6bf930153dd59a7.html',
  sourceVersion: 'spc-delayed-performance-interest-2014-v1',
  sourceEffectiveDate: '2014-08-01',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只估算加倍部分债务利息，不处理一般债务利息、分次履行和部分清偿。',
  sortOrder: 80,
};

const economicCompensationCapability = {
  ...capability,
  id: 7,
  toolKey: 'economic_compensation',
  title: '经济补偿金',
  description: '劳动合同解除经济补偿参考估算',
  status: 'public',
  audience: 'labor_user',
  sourceLevel: 'official',
  dataDependency: 'static_rule',
  executionMode: 'miniapp_local_calculation',
  riskLevel: 'medium',
  defaultIconKey: 'badge-dollar-sign',
  defaultTargetPath: '/pages/economic-compensation/economic-compensation',
  sourceName: '中华人民共和国劳动合同法',
  sourceUrl: 'https://www.gov.cn/gongbao/content/2007/content_711013.htm',
  sourceVersion: 'labor-contract-law-2007',
  sourceEffectiveDate: '2008-01-01',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做第四十七条基础估算，不判断是否应付经济补偿或违法解除二倍赔偿。',
  sortOrder: 90,
};

const elementTemplateCapability = {
  ...capability,
  id: 8,
  toolKey: 'element_template_library',
  title: '要素式示范文本',
  description: '按场景核对官方要素式示范文本',
  category: 'rule_query',
  status: 'public',
  audience: 'litigation_user',
  sourceLevel: 'official',
  dataDependency: 'static_table',
  executionMode: 'backend_data',
  riskLevel: 'medium',
  defaultIconKey: 'file-check-2',
  defaultTargetPath: '/pages/element-template/element-template',
  sourceName: '最高人民法院、司法部、中华全国律师协会要素式示范文本',
  sourceUrl: 'https://www.court.gov.cn/',
  sourceVersion: 'element-template-67-2025',
  sourceEffectiveDate: '2025-07-14',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做样例目录检索，不导入完整67类全文，不生成诉讼文书。',
  sortOrder: 100,
};

const levelJurisdictionCapability = {
  ...capability,
  id: 9,
  toolKey: 'level_jurisdiction',
  title: '级别管辖核对',
  description: '核对一审民事案件级别管辖线索',
  category: 'rule_query',
  status: 'public',
  audience: 'litigation_user',
  sourceLevel: 'official',
  dataDependency: 'static_rule',
  executionMode: 'miniapp_local_calculation',
  riskLevel: 'medium',
  defaultIconKey: 'landmark',
  defaultTargetPath: '/pages/level-jurisdiction/level-jurisdiction',
  sourceName: '中华人民共和国民事诉讼法 / 最高人民法院关于调整中级人民法院管辖第一审民事案件标准的通知',
  sourceUrl: 'https://www.court.gov.cn/fabu/xiangqing/324151.html',
  sourceVersion: 'civil-procedure-law-2023-level-jurisdiction-and-fafa-2021-27',
  sourceEffectiveDate: '2021-10-01',
  lastCheckedDate: '2026-05-31',
  ownerNote: '首片只做级别管辖线索核对，不判断地域管辖、专属管辖和具体受理法院。',
  sortOrder: 110,
};

const group = {
  id: 11,
  appCode: 'lawsuit-material-assistant',
  groupKey: 'legal_calculators',
  title: '诉讼计算',
  description: '常用诉讼费用、利息和日期辅助计算',
  tone: 'teal',
  visibility: 'public',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const exposureItem = {
  id: 21,
  groupId: 11,
  capabilityId: 1,
  entryKey: 'litigation_fee',
  titleOverride: '',
  descriptionOverride: '',
  iconKey: 'scale',
  targetPath: '/pages/litigation-fee/litigation-fee',
  action: 'navigate',
  status: 'open',
  statusText: '已开放',
  visibility: 'public',
  audience: 'general_user',
  releaseStage: 'public',
  disclaimerProfile: 'legal_tool_reference',
  linkedServiceKey: '',
  sortOrder: 20,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const privateLendingInterestExposureItem = {
  ...exposureItem,
  id: 22,
  capabilityId: 2,
  entryKey: 'private_lending_interest',
  iconKey: 'calculator',
  targetPath: '/pages/private-lending-interest/private-lending-interest',
  audience: 'litigation_user',
  sortOrder: 40,
};

const dateCalculationExposureItem = {
  ...exposureItem,
  id: 23,
  capabilityId: 3,
  entryKey: 'date_calculation',
  iconKey: 'calendar-days',
  targetPath: '/pages/date-calculation/date-calculation',
  audience: 'general_user',
  sortOrder: 50,
};

const paidAnnualLeaveExposureItem = {
  ...exposureItem,
  id: 24,
  capabilityId: 4,
  entryKey: 'paid_annual_leave',
  iconKey: 'calendar-check',
  targetPath: '/pages/paid-annual-leave/paid-annual-leave',
  audience: 'labor_user',
  sortOrder: 60,
};

const wageConversionExposureItem = {
  ...exposureItem,
  id: 30,
  capabilityId: 10,
  entryKey: 'wage_conversion',
  iconKey: 'badge-dollar-sign',
  targetPath: '/pages/wage-conversion/wage-conversion',
  audience: 'labor_user',
  sortOrder: 65,
};

const statutoryRetirementAgeExposureItem = {
  ...exposureItem,
  id: 31,
  capabilityId: 11,
  entryKey: 'statutory_retirement_age',
  iconKey: 'hourglass',
  targetPath: '/pages/statutory-retirement-age/statutory-retirement-age',
  audience: 'labor_user',
  sortOrder: 66,
};

const civilCauseExposureItem = {
  ...exposureItem,
  id: 25,
  capabilityId: 5,
  entryKey: 'civil_cause_of_action',
  iconKey: 'search-check',
  targetPath: '/pages/civil-cause/civil-cause',
  audience: 'litigation_user',
  sortOrder: 70,
};

const delayedPerformanceInterestExposureItem = {
  ...exposureItem,
  id: 26,
  capabilityId: 6,
  entryKey: 'delayed_performance_interest',
  iconKey: 'timer-reset',
  targetPath: '/pages/delayed-performance-interest/delayed-performance-interest',
  audience: 'litigation_user',
  sortOrder: 80,
};

const economicCompensationExposureItem = {
  ...exposureItem,
  id: 27,
  capabilityId: 7,
  entryKey: 'economic_compensation',
  iconKey: 'badge-dollar-sign',
  targetPath: '/pages/economic-compensation/economic-compensation',
  audience: 'labor_user',
  sortOrder: 90,
};

const elementTemplateExposureItem = {
  ...exposureItem,
  id: 28,
  capabilityId: 8,
  entryKey: 'element_template_library',
  iconKey: 'file-check-2',
  targetPath: '/pages/element-template/element-template',
  audience: 'litigation_user',
  sortOrder: 100,
};

const levelJurisdictionExposureItem = {
  ...exposureItem,
  id: 29,
  capabilityId: 9,
  entryKey: 'level_jurisdiction',
  iconKey: 'landmark',
  targetPath: '/pages/level-jurisdiction/level-jurisdiction',
  audience: 'litigation_user',
  sortOrder: 110,
};

const dataSource = {
  id: 31,
  appCode: 'lawsuit-material-assistant',
  sourceKey: 'civil_case_cause_2026',
  sourceName: '民事案件案由规定（第三次修正）',
  sourceType: 'official_rule',
  issuer: '最高人民法院',
  sourceUrl: 'https://www.court.gov.cn/zixun/xiangqing/484231.html',
  citation: '法〔2025〕166号',
  effectiveDate: '2026-01-01',
  sourceVersion: '2025-third-amendment',
  lastCheckedDate: '2026-05-30',
  status: 'verified',
  riskLevel: 'medium',
  linkedToolKeys: 'civil_cause_of_action',
  ownerNote: '',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const wageConversionDataSource = {
  ...dataSource,
  id: 32,
  sourceKey: 'mohrss_2025_2_wage_conversion',
  sourceName: '关于职工全年月平均工作时间和工资折算问题的通知',
  sourceType: 'official_notice',
  issuer: '人力资源社会保障部',
  sourceUrl: 'https://www.gov.cn/zhengce/zhengceku/202501/content_6995777.htm',
  citation: '人社部发〔2025〕2号',
  effectiveDate: '2025-01-01',
  sourceVersion: 'mohrss-2025-2-wage-conversion',
  lastCheckedDate: '2026-05-31',
  riskLevel: 'low',
  linkedToolKeys: 'wage_conversion',
  sortOrder: 20,
};

const statutoryRetirementAgeDataSource = {
  ...dataSource,
  id: 33,
  sourceKey: 'npc_2024_statutory_retirement_age',
  sourceName: '全国人民代表大会常务委员会关于实施渐进式延迟法定退休年龄的决定',
  sourceType: 'official_rule',
  issuer: '全国人民代表大会常务委员会',
  sourceUrl: 'https://www.npc.gov.cn/npc/c2/kgfb/202409/t20240913_439534.html',
  citation: '2024年9月13日第十四届全国人民代表大会常务委员会第十一次会议通过',
  effectiveDate: '2025-01-01',
  sourceVersion: 'npc-2024-statutory-retirement-age',
  lastCheckedDate: '2026-06-01',
  riskLevel: 'medium',
  linkedToolKeys: 'statutory_retirement_age',
  sortOrder: 30,
};

const blueprint = {
  id: 41,
  appCode: 'lawsuit-material-assistant',
  blueprintKey: 'litigation_fee_v1',
  toolKey: 'litigation_fee',
  blueprintName: '诉讼费用计算交互蓝图',
  referenceType: 'competitor_observation',
  referenceNote: '吸收表单分组和结果块结构。',
  formGroupsJson: '[{"key":"amount"}]',
  resultBlocksJson: '[{"key":"summary"}]',
  ctaRulesJson: '[]',
  validationNotes: '金额为非负数',
  status: 'draft',
  reviewedBy: '',
  lastReviewedDate: '',
  ownerNote: '',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-30T20:00:00',
  updatedAt: '2026-05-30T20:00:00'
};

const lprRate = {
  id: 51,
  appCode: 'lawsuit-material-assistant',
  quoteDate: '2025-05-20',
  oneYearRate: 3,
  fiveYearPlusRate: 3.5,
  sourceKey: 'lpr_chinamoney',
  sourceName: '贷款市场报价利率 LPR',
  sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
  sourceVersion: 'pbc-2025-05-20',
  lastCheckedDate: '2026-05-31',
  status: 'verified',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-31T01:00:00',
  updatedAt: '2026-05-31T01:00:00'
};

const litigationFeeRule = {
  id: 61,
  appCode: 'lawsuit-material-assistant',
  toolKey: 'litigation_fee',
  ruleKey: 'property_case_acceptance_fee',
  ruleName: '财产案件受理费',
  ruleVersion: 'state-council-order-481-v1',
  sourceKey: 'litigation_fee_state_council_481',
  status: 'draft',
  effectiveDate: '2007-04-01',
  lastCheckedDate: '2026-05-31',
  bands: [
    {
      minExclusive: 0,
      maxInclusive: 10000,
      fixedFee: 50,
      feeMin: 50,
      feeMax: 300,
      excessBase: 0,
      excessRate: 0,
      rate: 0,
      quickAdjustment: 0,
      bandLabel: '不超过1万元'
    },
    {
      minExclusive: 10000,
      maxInclusive: 100000,
      fixedFee: 0,
      feeMin: 300,
      feeMax: 3000,
      excessBase: 300,
      excessRate: 0.025,
      rate: 0.025,
      quickAdjustment: -200,
      bandLabel: '超过1万元至10万元'
    }
  ],
  noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
  disclaimerText: '本工具仅供参考。',
  ownerNote: '',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-31T10:00:00',
  updatedAt: '2026-05-31T10:00:00'
};

const litigationFeeRules = [
  litigationFeeRule,
  {
    ...litigationFeeRule,
    id: 62,
    ruleKey: 'divorce_case_acceptance_fee',
    ruleName: '离婚案件受理费',
    bands: [{
      minExclusive: 0,
      maxInclusive: null,
      fixedFee: 0,
      feeMin: 50,
      feeMax: 300,
      excessBase: 0,
      excessRate: 0,
      rate: 0,
      quickAdjustment: 0,
      bandLabel: '每件50元至300元'
    }]
  },
  { ...litigationFeeRule, id: 63, ruleKey: 'personality_right_case_acceptance_fee', ruleName: '人格权案件受理费' },
  { ...litigationFeeRule, id: 64, ruleKey: 'other_non_property_case_acceptance_fee', ruleName: '其他非财产案件受理费' },
  { ...litigationFeeRule, id: 65, ruleKey: 'intellectual_property_case_acceptance_fee', ruleName: '知识产权案件受理费' },
  { ...litigationFeeRule, id: 66, ruleKey: 'labor_dispute_case_acceptance_fee', ruleName: '劳动争议案件受理费' }
];

function mountPage(
  permissions: string[] = ['admin:legal-tool-center:view', 'admin:legal-tool-center:manage']
) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions
  };
  return mount(LegalToolCenterPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('LegalToolCenterPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLegalToolCapabilitiesMock.mockReset();
    saveLegalToolCapabilityMock.mockReset();
    pageLegalToolDataSourcesMock.mockReset();
    saveLegalToolDataSourceMock.mockReset();
    pageLegalToolExposureGroupsMock.mockReset();
    saveLegalToolExposureGroupMock.mockReset();
    disableLegalToolExposureGroupMock.mockReset();
    pageLegalToolExposureItemsMock.mockReset();
    saveLegalToolExposureItemMock.mockReset();
    disableLegalToolExposureItemMock.mockReset();
    pageLegalToolInteractionBlueprintsMock.mockReset();
    saveLegalToolInteractionBlueprintMock.mockReset();
    pageLegalLprRatesMock.mockReset();
    saveLegalLprRateMock.mockReset();
    pageLitigationFeeRulesMock.mockReset();
    saveLitigationFeeRuleMock.mockReset();
    previewLitigationFeeRuleMock.mockReset();
    publishLitigationFeeRuleMock.mockReset();

    pageLegalToolCapabilitiesMock.mockResolvedValue({
      dataList: [capability, privateLendingInterestCapability, dateCalculationCapability, paidAnnualLeaveCapability, wageConversionCapability, statutoryRetirementAgeCapability, civilCauseCapability, delayedPerformanceInterestCapability, economicCompensationCapability, elementTemplateCapability, levelJurisdictionCapability],
      totalCount: 11
    });
    pageLegalToolDataSourcesMock.mockResolvedValue({ dataList: [dataSource, wageConversionDataSource, statutoryRetirementAgeDataSource], totalCount: 3 });
    pageLegalToolExposureGroupsMock.mockResolvedValue({ dataList: [group], totalCount: 1 });
    pageLegalToolExposureItemsMock.mockResolvedValue({
      dataList: [exposureItem, privateLendingInterestExposureItem, dateCalculationExposureItem, paidAnnualLeaveExposureItem, wageConversionExposureItem, statutoryRetirementAgeExposureItem, civilCauseExposureItem, delayedPerformanceInterestExposureItem, economicCompensationExposureItem, elementTemplateExposureItem, levelJurisdictionExposureItem],
      totalCount: 11
    });
    pageLegalToolInteractionBlueprintsMock.mockResolvedValue({ dataList: [blueprint], totalCount: 1 });
    pageLegalLprRatesMock.mockResolvedValue({ dataList: [lprRate], totalCount: 1 });
    pageLitigationFeeRulesMock.mockResolvedValue({ dataList: litigationFeeRules, totalCount: 6 });
    saveLegalToolCapabilityMock.mockResolvedValue(capability);
    saveLegalToolDataSourceMock.mockResolvedValue(dataSource);
    saveLegalToolExposureGroupMock.mockResolvedValue(group);
    saveLegalToolExposureItemMock.mockResolvedValue(exposureItem);
    saveLegalToolInteractionBlueprintMock.mockResolvedValue(blueprint);
    saveLegalLprRateMock.mockResolvedValue(lprRate);
    saveLitigationFeeRuleMock.mockResolvedValue(litigationFeeRule);
    previewLitigationFeeRuleMock.mockResolvedValue({
      amount: 100000,
      fee: 2300,
      bandLabel: '超过1万元至10万元'
    });
    publishLitigationFeeRuleMock.mockResolvedValue({ ...litigationFeeRule, status: 'published' });
    disableLegalToolExposureGroupMock.mockResolvedValue({ ...group, enabled: false });
    disableLegalToolExposureItemMock.mockResolvedValue({ ...exposureItem, enabled: false });
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue({ action: 'confirm' } as Awaited<ReturnType<typeof ElMessageBox.confirm>>);
  });

  it('loads capabilities, groups and first group exposure items on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageLegalToolCapabilitiesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolDataSourcesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolExposureGroupsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolExposureItemsMock).toHaveBeenCalledWith({
      groupId: 11,
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolInteractionBlueprintsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalLprRatesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLitigationFeeRulesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('法律工具中心');
    expect(wrapper.text()).toContain('能力库');
    expect(wrapper.text()).toContain('数据来源');
    expect(wrapper.text()).toContain('展示分组');
    expect(wrapper.text()).toContain('曝光入口');
    expect(wrapper.text()).toContain('交互蓝图');
    expect(wrapper.text()).toContain('LPR利率');
    expect(wrapper.text()).toContain('诉讼费用规则');
    expect(wrapper.text()).toContain('诉讼费用');
    expect(wrapper.text()).toContain('新民间借贷利息');
    expect(wrapper.text()).toContain('/pages/private-lending-interest/private-lending-interest');
    expect(wrapper.text()).toContain('日期推算');
    expect(wrapper.text()).toContain('/pages/date-calculation/date-calculation');
    expect(wrapper.text()).toContain('calendar-days');
    expect(wrapper.text()).toContain('带薪年休假');
    expect(wrapper.text()).toContain('/pages/paid-annual-leave/paid-annual-leave');
    expect(wrapper.text()).toContain('calendar-check');
    expect(wrapper.text()).toContain('工资折算');
    expect(wrapper.text()).toContain('/pages/wage-conversion/wage-conversion');
    expect(wrapper.text()).toContain('mohrss-2025-2-wage-conversion');
    expect(wrapper.text()).toContain('延迟退休年龄');
    expect(wrapper.text()).toContain('/pages/statutory-retirement-age/statutory-retirement-age');
    expect(wrapper.text()).toContain('npc-2024-statutory-retirement-age');
    expect(wrapper.text()).toContain('hourglass');
    expect(wrapper.text()).toContain('民事案由');
    expect(wrapper.text()).toContain('/pages/civil-cause/civil-cause');
    expect(wrapper.text()).toContain('search-check');
    expect(wrapper.text()).toContain('backend_data');
    expect(wrapper.text()).toContain('延迟履行利息');
    expect(wrapper.text()).toContain('/pages/delayed-performance-interest/delayed-performance-interest');
    expect(wrapper.text()).toContain('timer-reset');
    expect(wrapper.text()).toContain('经济补偿金');
    expect(wrapper.text()).toContain('/pages/economic-compensation/economic-compensation');
    expect(wrapper.text()).toContain('badge-dollar-sign');
    expect(wrapper.text()).toContain('要素式示范文本');
    expect(wrapper.text()).toContain('/pages/element-template/element-template');
    expect(wrapper.text()).toContain('file-check-2');
    expect(wrapper.text()).toContain('级别管辖核对');
    expect(wrapper.text()).toContain('/pages/level-jurisdiction/level-jurisdiction');
    expect(wrapper.text()).toContain('landmark');
    expect(wrapper.text()).toContain('miniapp_local_calculation');
    expect(wrapper.text()).toContain('official');
    expect(wrapper.text()).toContain('medium');
    expect(wrapper.text()).toContain('民事案件案由规定');
    expect(wrapper.text()).toContain('诉讼计算');
    expect(wrapper.text()).toContain('诉讼费用计算交互蓝图');
    expect(wrapper.text()).toContain('2025-05-20');
    expect(wrapper.text()).toContain('3');
    expect(wrapper.text()).toContain('3.5');
    expect(wrapper.text()).toContain('财产案件受理费');
    expect(wrapper.text()).toContain('离婚案件受理费');
    expect(wrapper.text()).toContain('人格权案件受理费');
    expect(wrapper.text()).toContain('其他非财产案件受理费');
    expect(wrapper.text()).toContain('知识产权案件受理费');
    expect(wrapper.text()).toContain('劳动争议案件受理费');
    expect(wrapper.text()).toContain('费用区间 50-300');
    expect(wrapper.text()).toContain('超额基数 300');
    expect(wrapper.text()).toContain('state-council-order-481-v1');
  });

  it('hides write actions when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:legal-tool-center:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('新增能力');
    expect(wrapper.text()).not.toContain('新增分组');
    expect(wrapper.text()).not.toContain('新增入口');
    expect(wrapper.text()).not.toContain('禁用');
  });

  it('saves a capability through backend and refreshes capability list', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolCapabilitiesMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openCapabilityDialog: (row?: typeof capability) => void;
      capabilityForm: typeof capability;
      submitCapability: () => Promise<void>;
    };
    vm.openCapabilityDialog(capability);
    Object.assign(vm.capabilityForm, capability);
    await vm.submitCapability();
    await flushAsyncUpdates();

    expect(saveLegalToolCapabilityMock).toHaveBeenCalledWith({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      toolKey: 'litigation_fee',
      title: '诉讼费用',
      description: '按标的额估算案件受理费参考值',
      category: 'calculator',
      status: 'public',
      audience: 'general_user',
      sourceLevel: 'official',
      dataDependency: 'static_table',
      executionMode: 'local_static',
      riskLevel: 'medium',
      defaultIconKey: 'scale',
      defaultTargetPath: '/pages/litigation-fee/litigation-fee',
      defaultAction: 'navigate',
      sourceName: '阳光法律助手本地工具口径',
      sourceUrl: '',
      sourceVersion: 'local-v1',
      sourceEffectiveDate: '',
      lastCheckedDate: '2026-05-30',
      ownerNote: '后续补充官方收费依据版本。',
      sortOrder: 20,
      enabled: true
    });
    expect(pageLegalToolCapabilitiesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('saves data sources and blueprints through backend without audit fields', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolDataSourcesMock.mockClear();
    pageLegalToolInteractionBlueprintsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openDataSourceDialog: (row?: typeof dataSource) => void;
      dataSourceForm: typeof dataSource;
      submitDataSource: () => Promise<void>;
      openBlueprintDialog: (row?: typeof blueprint) => void;
      blueprintForm: typeof blueprint;
      submitBlueprint: () => Promise<void>;
    };

    vm.openDataSourceDialog(dataSource);
    Object.assign(vm.dataSourceForm, dataSource);
    await vm.submitDataSource();

    vm.openBlueprintDialog(blueprint);
    Object.assign(vm.blueprintForm, blueprint);
    await vm.submitBlueprint();
    await flushAsyncUpdates();

    expect(saveLegalToolDataSourceMock).toHaveBeenCalledWith({
      id: 31,
      appCode: 'lawsuit-material-assistant',
      sourceKey: 'civil_case_cause_2026',
      sourceName: '民事案件案由规定（第三次修正）',
      sourceType: 'official_rule',
      issuer: '最高人民法院',
      sourceUrl: 'https://www.court.gov.cn/zixun/xiangqing/484231.html',
      citation: '法〔2025〕166号',
      effectiveDate: '2026-01-01',
      sourceVersion: '2025-third-amendment',
      lastCheckedDate: '2026-05-30',
      status: 'verified',
      riskLevel: 'medium',
      linkedToolKeys: 'civil_cause_of_action',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });
    expect(saveLegalToolInteractionBlueprintMock).toHaveBeenCalledWith({
      id: 41,
      appCode: 'lawsuit-material-assistant',
      blueprintKey: 'litigation_fee_v1',
      toolKey: 'litigation_fee',
      blueprintName: '诉讼费用计算交互蓝图',
      referenceType: 'competitor_observation',
      referenceNote: '吸收表单分组和结果块结构。',
      formGroupsJson: '[{"key":"amount"}]',
      resultBlocksJson: '[{"key":"summary"}]',
      ctaRulesJson: '[]',
      validationNotes: '金额为非负数',
      status: 'draft',
      reviewedBy: '',
      lastReviewedDate: '',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });
    expect(pageLegalToolDataSourcesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLegalToolInteractionBlueprintsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('saves LPR rates through backend without audit fields', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalLprRatesMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openLprRateDialog: (row?: typeof lprRate) => void;
      lprRateForm: typeof lprRate;
      submitLprRate: () => Promise<void>;
    };

    vm.openLprRateDialog(lprRate);
    Object.assign(vm.lprRateForm, lprRate);
    await vm.submitLprRate();
    await flushAsyncUpdates();

    expect(saveLegalLprRateMock).toHaveBeenCalledWith({
      id: 51,
      appCode: 'lawsuit-material-assistant',
      quoteDate: '2025-05-20',
      oneYearRate: 3,
      fiveYearPlusRate: 3.5,
      sourceKey: 'lpr_chinamoney',
      sourceName: '贷款市场报价利率 LPR',
      sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
      sourceVersion: 'pbc-2025-05-20',
      lastCheckedDate: '2026-05-31',
      status: 'verified',
      sortOrder: 10,
      enabled: true
    });
    expect(pageLegalLprRatesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('previews, saves and publishes litigation fee rules through backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLitigationFeeRulesMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openLitigationFeeRuleDialog: (row?: typeof litigationFeeRule) => void;
      litigationFeeRuleForm: typeof litigationFeeRule;
      previewAmount: number;
      previewLitigationFee: () => Promise<void>;
      submitLitigationFeeRule: () => Promise<void>;
      publishLitigationFeeRuleRow: (row: typeof litigationFeeRule) => Promise<void>;
    };
    vm.openLitigationFeeRuleDialog(litigationFeeRule);
    Object.assign(vm.litigationFeeRuleForm, litigationFeeRule);
    vm.previewAmount = 100000;
    await vm.previewLitigationFee();
    await vm.submitLitigationFeeRule();
    await vm.publishLitigationFeeRuleRow(litigationFeeRule);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('2300');
    expect(wrapper.text()).toContain('超过1万元至10万元');
    expect(previewLitigationFeeRuleMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      ruleKey: 'property_case_acceptance_fee',
      amount: 100000
    });
    expect(saveLitigationFeeRuleMock).toHaveBeenCalledWith({
      id: 61,
      appCode: 'lawsuit-material-assistant',
      toolKey: 'litigation_fee',
      ruleKey: 'property_case_acceptance_fee',
      ruleName: '财产案件受理费',
      ruleVersion: 'state-council-order-481-v1',
      sourceKey: 'litigation_fee_state_council_481',
      status: 'draft',
      effectiveDate: '2007-04-01',
      lastCheckedDate: '2026-05-31',
      bands: litigationFeeRule.bands,
      noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
      disclaimerText: '本工具仅供参考。',
      ownerNote: '',
      sortOrder: 10,
      enabled: true
    });
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '发布后小程序会读取该诉讼费用规则，请确认分段、来源和核验日期已复核。',
      '发布诉讼费用规则',
      expect.any(Object)
    );
    expect(publishLitigationFeeRuleMock).toHaveBeenCalledWith(61);
    expect(pageLitigationFeeRulesMock).toHaveBeenCalled();
  });

  it('saves litigation fee interval fields and renders divorce preview ranges', async () => {
    previewLitigationFeeRuleMock.mockResolvedValueOnce({
      amount: 0,
      fee: 0,
      feeMin: 50,
      feeMax: 300,
      bandLabel: '每件50元至300元'
    });
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const divorceRule = litigationFeeRules[1];
    const vm = wrapper.vm as unknown as {
      openLitigationFeeRuleDialog: (row?: (typeof litigationFeeRules)[number]) => void;
      litigationFeeRuleForm: typeof litigationFeeRule;
      previewAmount: number;
      previewLitigationFee: () => Promise<void>;
      submitLitigationFeeRule: () => Promise<void>;
    };

    vm.openLitigationFeeRuleDialog(divorceRule);
    await nextTick();

    expect(wrapper.text()).toContain('费用下限');
    expect(wrapper.text()).toContain('费用上限');
    expect(wrapper.text()).toContain('超额基数');
    expect(wrapper.text()).toContain('超额费率');

    vm.previewAmount = 0;
    await vm.previewLitigationFee();
    await nextTick();
    await vm.submitLitigationFeeRule();
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('0：50-300，每件50元至300元');
    expect(saveLitigationFeeRuleMock).toHaveBeenCalledWith(expect.objectContaining({
      ruleKey: 'divorce_case_acceptance_fee',
      bands: [expect.objectContaining({
        feeMin: 50,
        feeMax: 300,
        excessBase: 0,
        excessRate: 0
      })]
    }));
  });

  it('saves and disables exposure groups through backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolExposureGroupsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openGroupDialog: (row?: typeof group) => void;
      groupForm: typeof group;
      submitGroup: () => Promise<void>;
      disableGroup: (row: typeof group) => Promise<void>;
    };
    vm.openGroupDialog(group);
    Object.assign(vm.groupForm, group);
    await vm.submitGroup();
    await vm.disableGroup(group);
    await flushAsyncUpdates();

    expect(saveLegalToolExposureGroupMock).toHaveBeenCalledWith({
      id: 11,
      appCode: 'lawsuit-material-assistant',
      groupKey: 'legal_calculators',
      title: '诉讼计算',
      description: '常用诉讼费用、利息和日期辅助计算',
      tone: 'teal',
      visibility: 'public',
      sortOrder: 10,
      enabled: true
    });
    expect(disableLegalToolExposureGroupMock).toHaveBeenCalledWith(11);
    expect(pageLegalToolExposureGroupsMock).toHaveBeenCalled();
  });

  it('saves and disables exposure items through backend', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalToolExposureItemsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openExposureItemDialog: (row?: typeof exposureItem) => void;
      exposureItemForm: typeof exposureItem;
      submitExposureItem: () => Promise<void>;
      disableExposureItem: (row: typeof exposureItem) => Promise<void>;
    };
    vm.openExposureItemDialog(exposureItem);
    Object.assign(vm.exposureItemForm, exposureItem);
    await vm.submitExposureItem();
    await vm.disableExposureItem(exposureItem);
    await flushAsyncUpdates();

    expect(saveLegalToolExposureItemMock).toHaveBeenCalledWith({
      id: 21,
      groupId: 11,
      capabilityId: 1,
      entryKey: 'litigation_fee',
      titleOverride: '',
      descriptionOverride: '',
      iconKey: 'scale',
      targetPath: '/pages/litigation-fee/litigation-fee',
      action: 'navigate',
      status: 'open',
      statusText: '已开放',
      visibility: 'public',
      audience: 'general_user',
      releaseStage: 'public',
      disclaimerProfile: 'legal_tool_reference',
      linkedServiceKey: '',
      sortOrder: 20,
      enabled: true
    });
    expect(disableLegalToolExposureItemMock).toHaveBeenCalledWith(21);
    expect(pageLegalToolExposureItemsMock).toHaveBeenCalledWith({
      groupId: 11,
      pageNo: 1,
      pageSize: 50
    });
  });

  it('uses shared miniapp icon picker for exposure item icon keys', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      openExposureItemDialog: (row?: typeof exposureItem) => void;
      exposureItemForm: typeof exposureItem;
    };
    vm.openExposureItemDialog(exposureItem);
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.text()).toContain('图标库 50+');
    expect(wrapper.find('[data-test="miniapp-icon-scale"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-gavel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-scroll-text"]').exists()).toBe(true);

    await wrapper.find('[data-test="miniapp-icon-calculator"]').trigger('click');
    await nextTick();

    expect(vm.exposureItemForm.iconKey).toBe('calculator');
    expect(wrapper.text()).toContain('当前图标：calculator');
  });
});
