<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { EditPen, Plus, Refresh, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  applyElementTemplateFileImport,
  disableLegalToolExposureGroup,
  disableLegalToolExposureItem,
  manifestElementTemplateFiles,
  pageLegalToolCapabilities,
  pageLegalToolDataSources,
  pageLegalToolExposureGroups,
  pageLegalToolExposureItems,
  pageLegalToolInteractionBlueprints,
  pageAnnualCommonData,
  pageLitigationFeeRules,
  pageLegalLprRates,
  previewElementTemplateFileImport,
  previewLitigationFeeRule,
  publishLitigationFeeRule,
  saveLegalToolCapability,
  saveLegalToolDataSource,
  saveLegalToolExposureGroup,
  saveLegalToolExposureItem,
  saveLegalToolInteractionBlueprint,
  saveAnnualCommonData,
  saveLitigationFeeRule,
  saveLegalLprRate,
  validateElementTemplateFiles,
  type AnnualCommonDataItem,
  type AnnualCommonDataPayload,
  type ElementTemplateFileImportApplyResult,
  type ElementTemplateFileImportPayload,
  type ElementTemplateFileImportPreviewResult,
  type ElementTemplateFileManifestResult,
  type ElementTemplateFileValidationResult,
  type LitigationFeePreviewResult,
  type LitigationFeeRuleItem,
  type LitigationFeeRulePayload,
  type LegalLprRateItem,
  type LegalLprRatePayload,
  type LegalToolCapabilityItem,
  type LegalToolCapabilityPayload,
  type LegalToolDataSourceItem,
  type LegalToolDataSourcePayload,
  type LegalToolExposureGroupItem,
  type LegalToolExposureGroupPayload,
  type LegalToolExposureItem,
  type LegalToolExposureItemPayload,
  type LegalToolInteractionBlueprintItem,
  type LegalToolInteractionBlueprintPayload
} from '../../api/legalToolCenter';
import MiniappIconPicker from '../../components/miniapp-icon-picker/MiniappIconPicker.vue';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;

const auth = useAuthStore();
const activeTab = ref('capabilities');
const loading = ref(false);
const dataSourceLoading = ref(false);
const annualCommonDataLoading = ref(false);
const lprRateLoading = ref(false);
const litigationFeeRuleLoading = ref(false);
const elementTemplateFileLoading = ref(false);
const groupLoading = ref(false);
const exposureItemLoading = ref(false);
const blueprintLoading = ref(false);
const loadError = ref('');
const capabilities = ref<LegalToolCapabilityItem[]>([]);
const dataSources = ref<LegalToolDataSourceItem[]>([]);
const annualCommonData = ref<AnnualCommonDataItem[]>([]);
const lprRates = ref<LegalLprRateItem[]>([]);
const litigationFeeRules = ref<LitigationFeeRuleItem[]>([]);
const elementTemplateFileManifest = ref<ElementTemplateFileManifestResult | null>(null);
const elementTemplateFileValidation = ref<ElementTemplateFileValidationResult | null>(null);
const elementTemplateFilePreview = ref<ElementTemplateFileImportPreviewResult | null>(null);
const elementTemplateFileApplyResult = ref<ElementTemplateFileImportApplyResult | null>(null);
const elementTemplateFileImportJson = ref(JSON.stringify({
  appCode: APP_CODE,
  files: []
}, null, 2));
const groups = ref<LegalToolExposureGroupItem[]>([]);
const exposureItems = ref<LegalToolExposureItem[]>([]);
const blueprints = ref<LegalToolInteractionBlueprintItem[]>([]);
const selectedGroupId = ref<number | null>(null);
const capabilityDialogVisible = ref(false);
const dataSourceDialogVisible = ref(false);
const annualCommonDataDialogVisible = ref(false);
const lprRateDialogVisible = ref(false);
const litigationFeeRuleDialogVisible = ref(false);
const groupDialogVisible = ref(false);
const exposureItemDialogVisible = ref(false);
const blueprintDialogVisible = ref(false);
const submitting = ref(false);
const previewAmount = ref(100000);
const previewResult = ref<LitigationFeePreviewResult | null>(null);

const capabilityForm = reactive<LegalToolCapabilityPayload>({
  id: 0,
  appCode: APP_CODE,
  toolKey: '',
  title: '',
  description: '',
  category: 'calculator',
  status: 'pending_release',
  audience: 'general_user',
  sourceLevel: 'pending_verification',
  dataDependency: 'static_table',
  executionMode: 'backend_rule',
  riskLevel: 'medium',
  defaultIconKey: 'calculator',
  defaultTargetPath: '',
  defaultAction: 'coming_soon',
  sourceName: '',
  sourceUrl: '',
  sourceVersion: '',
  sourceEffectiveDate: '',
  lastCheckedDate: '',
  ownerNote: '',
  sortOrder: 10,
  enabled: true
});

const dataSourceForm = reactive<LegalToolDataSourcePayload>({
  id: 0,
  appCode: APP_CODE,
  sourceKey: '',
  sourceName: '',
  sourceType: 'official_rule',
  issuer: '',
  sourceUrl: '',
  citation: '',
  effectiveDate: '',
  sourceVersion: '',
  lastCheckedDate: '',
  status: 'verified',
  riskLevel: 'medium',
  linkedToolKeys: '',
  ownerNote: '',
  sortOrder: 10,
  enabled: true
});

const lprRateForm = reactive<LegalLprRatePayload>({
  id: 0,
  appCode: APP_CODE,
  quoteDate: '',
  oneYearRate: 0,
  fiveYearPlusRate: 0,
  sourceKey: 'lpr_chinamoney',
  sourceName: '贷款市场报价利率 LPR',
  sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
  sourceVersion: '',
  lastCheckedDate: '',
  status: 'verified',
  sortOrder: 10,
  enabled: true
});

const annualCommonDataForm = reactive<AnnualCommonDataPayload>({
  id: 0,
  appCode: APP_CODE,
  regionCode: '',
  regionName: '',
  year: 2024,
  metricKey: '',
  metricName: '',
  value: 0,
  unit: '元/年',
  sourceKey: '',
  sourceName: '',
  sourceUrl: '',
  sourceVersion: '',
  lastCheckedDate: '',
  usageScope: '',
  notice: '',
  status: 'verified',
  sortOrder: 10,
  enabled: true
});

const litigationFeeRuleForm = reactive<LitigationFeeRulePayload>({
  appCode: APP_CODE,
  toolKey: 'litigation_fee',
  ruleKey: 'property_case_acceptance_fee',
  ruleName: '财产案件受理费',
  ruleVersion: '',
  sourceKey: 'litigation_fee_state_council_481',
  status: 'draft',
  effectiveDate: '2007-04-01',
  lastCheckedDate: '',
  bands: [],
  noticeText: '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
  disclaimerText: '本工具仅供参考。',
  ownerNote: '',
  sortOrder: 10,
  enabled: true
});

const groupForm = reactive<LegalToolExposureGroupPayload>({
  id: 0,
  appCode: APP_CODE,
  groupKey: '',
  title: '',
  description: '',
  tone: 'teal',
  visibility: 'public',
  sortOrder: 10,
  enabled: true
});

const exposureItemForm = reactive<LegalToolExposureItemPayload>({
  id: 0,
  groupId: 0,
  capabilityId: 0,
  entryKey: '',
  titleOverride: '',
  descriptionOverride: '',
  iconKey: 'calculator',
  targetPath: '',
  action: 'coming_soon',
  status: 'coming_soon',
  statusText: '待开放',
  visibility: 'hidden',
  audience: 'general_user',
  releaseStage: 'internal',
  disclaimerProfile: 'legal_tool_reference',
  linkedServiceKey: '',
  sortOrder: 10,
  enabled: true
});

const blueprintForm = reactive<LegalToolInteractionBlueprintPayload>({
  id: 0,
  appCode: APP_CODE,
  blueprintKey: '',
  toolKey: '',
  blueprintName: '',
  referenceType: 'competitor_observation',
  referenceNote: '',
  formGroupsJson: '[]',
  resultBlocksJson: '[]',
  ctaRulesJson: '[]',
  validationNotes: '',
  status: 'draft',
  reviewedBy: '',
  lastReviewedDate: '',
  ownerNote: '',
  sortOrder: 10,
  enabled: true
});

const categoryOptions = [
  { label: '计算工具', value: 'calculator' },
  { label: '办事指引', value: 'guide' },
  { label: '赔偿测算', value: 'compensation' },
  { label: '文本模板', value: 'template' },
  { label: '查询核对', value: 'lookup' }
];

const audienceOptions = [
  { label: '通用用户', value: 'general_user' },
  { label: '诉讼用户', value: 'litigation_user' },
  { label: '劳动用户', value: 'labor_user' },
  { label: '交通事故用户', value: 'traffic_accident_user' }
];

const sourceLevelOptions = [
  { label: '官方', value: 'official' },
  { label: '本地口径', value: 'local' },
  { label: '待核验', value: 'pending_verification' }
];

const dataDependencyOptions = [
  { label: '静态表', value: 'static_table' },
  { label: '规则树', value: 'rule_tree' },
  { label: '利率序列', value: 'rate_series' },
  { label: '地区数据', value: 'regional_data' },
  { label: '年度数据', value: 'annual_data' }
];

const executionModeOptions = [
  { label: '本地静态', value: 'local_static' },
  { label: '后端规则', value: 'backend_rule' },
  { label: '后端数据', value: 'backend_data' },
  { label: '人工服务', value: 'service_link' }
];

const riskLevelOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
];

const sourceTypeOptions = [
  { label: '官方规则', value: 'official_rule' },
  { label: '官方通知', value: 'official_notice' },
  { label: '官方数据', value: 'official_data' },
  { label: '公开参考', value: 'public_reference' },
  { label: '内部模型', value: 'internal_model' }
];

const sourceStatusOptions = [
  { label: '待核验', value: 'pending' },
  { label: '已核验', value: 'verified' },
  { label: '待更新', value: 'stale' },
  { label: '已废弃', value: 'deprecated' }
];

const blueprintReferenceTypeOptions = [
  { label: '竞品观察', value: 'competitor_observation' },
  { label: '内部设计', value: 'internal_design' },
  { label: '律师审核', value: 'lawyer_review' },
  { label: '用户反馈', value: 'user_feedback' }
];

const blueprintStatusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '已审核', value: 'reviewed' },
  { label: '可进入 Schema', value: 'ready_for_schema' },
  { label: '已废弃', value: 'deprecated' }
];

const actionOptions = [
  { label: '页面跳转', value: 'navigate' },
  { label: '预约服务', value: 'service' },
  { label: '暂未开放', value: 'coming_soon' }
];

const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '灰度', value: 'pilot' },
  { label: '隐藏', value: 'hidden' }
];

const releaseStageOptions = [
  { label: '公开', value: 'public' },
  { label: '灰度', value: 'pilot' },
  { label: '内部', value: 'internal' }
];

const toneOptions = [
  { label: '青绿', value: 'teal' },
  { label: '蓝色', value: 'blue' },
  { label: '琥珀', value: 'amber' },
  { label: '灰色', value: 'slate' }
];

const entryStatusOptions = [
  { label: '开放', value: 'open' },
  { label: '暂未开放', value: 'coming_soon' },
  { label: '服务承接', value: 'service' },
  { label: '隐藏', value: 'hidden' }
];

const canManageLegalToolCenter = computed(() => auth.hasPermission('admin:legal-tool-center:manage'));
const selectedGroup = computed(() => groups.value.find((item) => item.id === selectedGroupId.value));
const litigationFeePreviewText = computed(() => {
  if (!previewResult.value) {
    return '';
  }
  const hasRange = previewResult.value.feeMin !== undefined && previewResult.value.feeMax !== undefined;
  const feeText = hasRange
    ? `${previewResult.value.feeMin}-${previewResult.value.feeMax}`
    : previewResult.value.fee;
  return `${previewResult.value.amount}：${feeText}，${previewResult.value.bandLabel}`;
});

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function statusTagType(enabled: boolean) {
  return enabled ? 'success' : 'info';
}

function firstLitigationFeeBandSummary(row: LitigationFeeRuleItem) {
  const band = row.bands[0];
  if (!band) {
    return '-';
  }
  const excessBand = row.bands.find((item) => item.excessBase || item.excessRate) ?? band;
  const parts = [`${row.bands.length}段`];
  if (band.feeMin != null && band.feeMax != null) {
    parts.push(`费用区间 ${band.feeMin}-${band.feeMax}`);
  }
  if (band.feeMin == null && band.feeMax != null) {
    parts.push(`费用上限 ${band.feeMax}`);
  }
  if (band.feeMin != null && band.feeMax == null) {
    parts.push(`费用下限 ${band.feeMin}`);
  }
  if (excessBand.excessBase !== undefined) {
    parts.push(`超额基数 ${excessBand.excessBase}`);
  }
  if (excessBand.excessRate !== undefined) {
    parts.push(`超额费率 ${excessBand.excessRate}`);
  }
  return parts.join(' / ');
}

function normalizePayloadId<T extends { id: number }>(payload: T) {
  return {
    ...payload,
    id: payload.id || undefined
  };
}

function capabilityPayload() {
  return normalizePayloadId({
    id: capabilityForm.id,
    appCode: capabilityForm.appCode,
    toolKey: capabilityForm.toolKey,
    title: capabilityForm.title,
    description: capabilityForm.description,
    category: capabilityForm.category,
    status: capabilityForm.status,
    audience: capabilityForm.audience,
    sourceLevel: capabilityForm.sourceLevel,
    dataDependency: capabilityForm.dataDependency,
    executionMode: capabilityForm.executionMode,
    riskLevel: capabilityForm.riskLevel,
    defaultIconKey: capabilityForm.defaultIconKey,
    defaultTargetPath: capabilityForm.defaultTargetPath,
    defaultAction: capabilityForm.defaultAction,
    sourceName: capabilityForm.sourceName,
    sourceUrl: capabilityForm.sourceUrl,
    sourceVersion: capabilityForm.sourceVersion,
    sourceEffectiveDate: capabilityForm.sourceEffectiveDate,
    lastCheckedDate: capabilityForm.lastCheckedDate,
    ownerNote: capabilityForm.ownerNote,
    sortOrder: capabilityForm.sortOrder,
    enabled: capabilityForm.enabled
  });
}

function dataSourcePayload() {
  return normalizePayloadId({
    id: dataSourceForm.id,
    appCode: dataSourceForm.appCode,
    sourceKey: dataSourceForm.sourceKey,
    sourceName: dataSourceForm.sourceName,
    sourceType: dataSourceForm.sourceType,
    issuer: dataSourceForm.issuer,
    sourceUrl: dataSourceForm.sourceUrl,
    citation: dataSourceForm.citation,
    effectiveDate: dataSourceForm.effectiveDate,
    sourceVersion: dataSourceForm.sourceVersion,
    lastCheckedDate: dataSourceForm.lastCheckedDate,
    status: dataSourceForm.status,
    riskLevel: dataSourceForm.riskLevel,
    linkedToolKeys: dataSourceForm.linkedToolKeys,
    ownerNote: dataSourceForm.ownerNote,
    sortOrder: dataSourceForm.sortOrder,
    enabled: dataSourceForm.enabled
  });
}

function lprRatePayload() {
  return normalizePayloadId({
    id: lprRateForm.id,
    appCode: lprRateForm.appCode,
    quoteDate: lprRateForm.quoteDate,
    oneYearRate: Number(lprRateForm.oneYearRate || 0),
    fiveYearPlusRate: Number(lprRateForm.fiveYearPlusRate || 0),
    sourceKey: lprRateForm.sourceKey,
    sourceName: lprRateForm.sourceName,
    sourceUrl: lprRateForm.sourceUrl,
    sourceVersion: lprRateForm.sourceVersion,
    lastCheckedDate: lprRateForm.lastCheckedDate,
    status: lprRateForm.status,
    sortOrder: lprRateForm.sortOrder,
    enabled: lprRateForm.enabled
  });
}

function annualCommonDataPayload() {
  return normalizePayloadId({
    id: annualCommonDataForm.id,
    appCode: annualCommonDataForm.appCode,
    regionCode: annualCommonDataForm.regionCode,
    regionName: annualCommonDataForm.regionName,
    year: Number(annualCommonDataForm.year || 0),
    metricKey: annualCommonDataForm.metricKey,
    metricName: annualCommonDataForm.metricName,
    value: Number(annualCommonDataForm.value || 0),
    unit: annualCommonDataForm.unit,
    sourceKey: annualCommonDataForm.sourceKey,
    sourceName: annualCommonDataForm.sourceName,
    sourceUrl: annualCommonDataForm.sourceUrl,
    sourceVersion: annualCommonDataForm.sourceVersion,
    lastCheckedDate: annualCommonDataForm.lastCheckedDate,
    usageScope: annualCommonDataForm.usageScope,
    notice: annualCommonDataForm.notice,
    status: annualCommonDataForm.status,
    sortOrder: annualCommonDataForm.sortOrder,
    enabled: annualCommonDataForm.enabled
  });
}

function litigationFeeRulePayload() {
  return normalizePayloadId({
    id: litigationFeeRuleForm.id ?? 0,
    appCode: litigationFeeRuleForm.appCode,
    toolKey: litigationFeeRuleForm.toolKey,
    ruleKey: litigationFeeRuleForm.ruleKey,
    ruleName: litigationFeeRuleForm.ruleName,
    ruleVersion: litigationFeeRuleForm.ruleVersion,
    sourceKey: litigationFeeRuleForm.sourceKey,
    status: litigationFeeRuleForm.status,
    effectiveDate: litigationFeeRuleForm.effectiveDate,
    lastCheckedDate: litigationFeeRuleForm.lastCheckedDate,
    bands: litigationFeeRuleForm.bands.map((band) => ({
      minExclusive: Number(band.minExclusive || 0),
      maxInclusive: band.maxInclusive === null ? null : Number(band.maxInclusive || 0),
      fixedFee: Number(band.fixedFee || 0),
      feeMin: Number(band.feeMin || 0),
      feeMax: Number(band.feeMax || 0),
      excessBase: Number(band.excessBase || 0),
      excessRate: Number(band.excessRate || 0),
      rate: Number(band.rate || 0),
      quickAdjustment: Number(band.quickAdjustment || 0),
      bandLabel: band.bandLabel
    })),
    noticeText: litigationFeeRuleForm.noticeText,
    disclaimerText: litigationFeeRuleForm.disclaimerText,
    ownerNote: litigationFeeRuleForm.ownerNote,
    sortOrder: litigationFeeRuleForm.sortOrder,
    enabled: litigationFeeRuleForm.enabled
  });
}

function groupPayload() {
  return normalizePayloadId({
    id: groupForm.id,
    appCode: groupForm.appCode,
    groupKey: groupForm.groupKey,
    title: groupForm.title,
    description: groupForm.description,
    tone: groupForm.tone,
    visibility: groupForm.visibility,
    sortOrder: groupForm.sortOrder,
    enabled: groupForm.enabled
  });
}

function exposureItemPayload() {
  return normalizePayloadId({
    id: exposureItemForm.id,
    groupId: exposureItemForm.groupId,
    capabilityId: exposureItemForm.capabilityId,
    entryKey: exposureItemForm.entryKey,
    titleOverride: exposureItemForm.titleOverride,
    descriptionOverride: exposureItemForm.descriptionOverride,
    iconKey: exposureItemForm.iconKey,
    targetPath: exposureItemForm.targetPath,
    action: exposureItemForm.action,
    status: exposureItemForm.status,
    statusText: exposureItemForm.statusText,
    visibility: exposureItemForm.visibility,
    audience: exposureItemForm.audience,
    releaseStage: exposureItemForm.releaseStage,
    disclaimerProfile: exposureItemForm.disclaimerProfile,
    linkedServiceKey: exposureItemForm.linkedServiceKey,
    sortOrder: exposureItemForm.sortOrder,
    enabled: exposureItemForm.enabled
  });
}

function blueprintPayload() {
  return normalizePayloadId({
    id: blueprintForm.id,
    appCode: blueprintForm.appCode,
    blueprintKey: blueprintForm.blueprintKey,
    toolKey: blueprintForm.toolKey,
    blueprintName: blueprintForm.blueprintName,
    referenceType: blueprintForm.referenceType,
    referenceNote: blueprintForm.referenceNote,
    formGroupsJson: blueprintForm.formGroupsJson,
    resultBlocksJson: blueprintForm.resultBlocksJson,
    ctaRulesJson: blueprintForm.ctaRulesJson,
    validationNotes: blueprintForm.validationNotes,
    status: blueprintForm.status,
    reviewedBy: blueprintForm.reviewedBy,
    lastReviewedDate: blueprintForm.lastReviewedDate,
    ownerNote: blueprintForm.ownerNote,
    sortOrder: blueprintForm.sortOrder,
    enabled: blueprintForm.enabled
  });
}

function capabilityTitle(capabilityId: number) {
  const item = capabilities.value.find((capability) => capability.id === capabilityId);
  if (!item) {
    return `能力 #${capabilityId}`;
  }
  return `${item.title}（${item.toolKey}）`;
}

async function loadCapabilities() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolCapabilities({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    capabilities.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '能力库加载失败';
    capabilities.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadDataSources() {
  dataSourceLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolDataSources({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    dataSources.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '数据来源加载失败';
    dataSources.value = [];
  } finally {
    dataSourceLoading.value = false;
  }
}

async function loadLprRates() {
  lprRateLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalLprRates({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    lprRates.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'LPR 利率加载失败';
    lprRates.value = [];
  } finally {
    lprRateLoading.value = false;
  }
}

async function loadAnnualCommonData() {
  annualCommonDataLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageAnnualCommonData({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    annualCommonData.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '常用年度数据加载失败';
    annualCommonData.value = [];
  } finally {
    annualCommonDataLoading.value = false;
  }
}

async function loadLitigationFeeRules() {
  litigationFeeRuleLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLitigationFeeRules({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    litigationFeeRules.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '诉讼费用规则加载失败';
    litigationFeeRules.value = [];
  } finally {
    litigationFeeRuleLoading.value = false;
  }
}

async function loadElementTemplateFileManifest() {
  elementTemplateFileLoading.value = true;
  loadError.value = '';
  try {
    elementTemplateFileManifest.value = await manifestElementTemplateFiles({ appCode: APP_CODE });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '示范文本文件清单加载失败';
    elementTemplateFileManifest.value = null;
  } finally {
    elementTemplateFileLoading.value = false;
  }
}

async function validateElementTemplateFileMetadata() {
  elementTemplateFileLoading.value = true;
  loadError.value = '';
  try {
    elementTemplateFileValidation.value = await validateElementTemplateFiles({ appCode: APP_CODE });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '示范文本文件校验失败';
    elementTemplateFileValidation.value = null;
  } finally {
    elementTemplateFileLoading.value = false;
  }
}

function parseElementTemplateFileImportPayload(): ElementTemplateFileImportPayload | null {
  try {
    return JSON.parse(elementTemplateFileImportJson.value) as ElementTemplateFileImportPayload;
  } catch {
    ElMessage.error('导入清单 JSON 格式不正确');
    return null;
  }
}

async function previewElementTemplateFileImportJson() {
  const payload = parseElementTemplateFileImportPayload();
  if (!payload) {
    return;
  }
  elementTemplateFileLoading.value = true;
  loadError.value = '';
  try {
    elementTemplateFilePreview.value = await previewElementTemplateFileImport(payload);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '示范文本文件导入预检失败';
    elementTemplateFilePreview.value = null;
  } finally {
    elementTemplateFileLoading.value = false;
  }
}

async function applyElementTemplateFileImportJson() {
  if (!canManageLegalToolCenter.value) {
    return;
  }
  const payload = parseElementTemplateFileImportPayload();
  if (!payload) {
    return;
  }
  await ElMessageBox.confirm(
    '确认写入示范文本文件元数据？写入后小程序会按静态文件地址提供下载。',
    '确认导入示范文本文件',
    { type: 'warning' }
  );
  elementTemplateFileLoading.value = true;
  loadError.value = '';
  try {
    elementTemplateFileApplyResult.value = await applyElementTemplateFileImport(payload);
    ElMessage.success('示范文本文件元数据已导入');
    await Promise.all([
      loadElementTemplateFileManifest(),
      validateElementTemplateFileMetadata()
    ]);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '示范文本文件导入失败';
    elementTemplateFileApplyResult.value = null;
  } finally {
    elementTemplateFileLoading.value = false;
  }
}

async function loadGroups() {
  groupLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolExposureGroups({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    groups.value = result.dataList;
    if (!selectedGroupId.value || !groups.value.some((item) => item.id === selectedGroupId.value)) {
      selectedGroupId.value = groups.value[0]?.id ?? null;
    }
    await loadExposureItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '展示分组加载失败';
    groups.value = [];
    exposureItems.value = [];
  } finally {
    groupLoading.value = false;
  }
}

async function loadExposureItems() {
  if (!selectedGroupId.value) {
    exposureItems.value = [];
    return;
  }
  exposureItemLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolExposureItems({
      groupId: selectedGroupId.value,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    exposureItems.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '曝光入口加载失败';
    exposureItems.value = [];
  } finally {
    exposureItemLoading.value = false;
  }
}

async function loadBlueprints() {
  blueprintLoading.value = true;
  loadError.value = '';
  try {
    const result = await pageLegalToolInteractionBlueprints({
      appCode: APP_CODE,
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    blueprints.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '交互蓝图加载失败';
    blueprints.value = [];
  } finally {
    blueprintLoading.value = false;
  }
}

function openCapabilityDialog(row?: LegalToolCapabilityItem) {
  Object.assign(capabilityForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    toolKey: row?.toolKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    category: row?.category ?? 'calculator',
    status: row?.status ?? 'planned',
    audience: row?.audience ?? 'general_user',
    sourceLevel: row?.sourceLevel ?? 'pending_verification',
    dataDependency: row?.dataDependency ?? 'static_table',
    executionMode: row?.executionMode ?? 'backend_rule',
    riskLevel: row?.riskLevel ?? 'medium',
    defaultIconKey: row?.defaultIconKey ?? 'calculator',
    defaultTargetPath: row?.defaultTargetPath ?? '',
    defaultAction: row?.defaultAction ?? 'coming_soon',
    sourceName: row?.sourceName ?? '',
    sourceUrl: row?.sourceUrl ?? '',
    sourceVersion: row?.sourceVersion ?? '',
    sourceEffectiveDate: row?.sourceEffectiveDate ?? '',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    ownerNote: row?.ownerNote ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  capabilityDialogVisible.value = true;
}

async function submitCapability() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolCapability(capabilityPayload());
    capabilityDialogVisible.value = false;
    ElMessage.success('法律工具能力已保存');
    await loadCapabilities();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '法律工具能力保存失败';
  } finally {
    submitting.value = false;
  }
}

function openDataSourceDialog(row?: LegalToolDataSourceItem) {
  Object.assign(dataSourceForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    sourceKey: row?.sourceKey ?? '',
    sourceName: row?.sourceName ?? '',
    sourceType: row?.sourceType ?? 'official_rule',
    issuer: row?.issuer ?? '',
    sourceUrl: row?.sourceUrl ?? '',
    citation: row?.citation ?? '',
    effectiveDate: row?.effectiveDate ?? '',
    sourceVersion: row?.sourceVersion ?? '',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    status: row?.status ?? 'verified',
    riskLevel: row?.riskLevel ?? 'medium',
    linkedToolKeys: row?.linkedToolKeys ?? '',
    ownerNote: row?.ownerNote ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  dataSourceDialogVisible.value = true;
}

async function submitDataSource() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolDataSource(dataSourcePayload());
    dataSourceDialogVisible.value = false;
    ElMessage.success('数据来源已保存');
    await loadDataSources();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '数据来源保存失败';
  } finally {
    submitting.value = false;
  }
}

function openLprRateDialog(row?: LegalLprRateItem) {
  Object.assign(lprRateForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    quoteDate: row?.quoteDate ?? '',
    oneYearRate: row?.oneYearRate ?? 0,
    fiveYearPlusRate: row?.fiveYearPlusRate ?? 0,
    sourceKey: row?.sourceKey ?? 'lpr_chinamoney',
    sourceName: row?.sourceName ?? '贷款市场报价利率 LPR',
    sourceUrl: row?.sourceUrl ?? 'https://www.chinamoney.com.cn/chinese/bklpr/',
    sourceVersion: row?.sourceVersion ?? '',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    status: row?.status ?? 'verified',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  lprRateDialogVisible.value = true;
}

async function submitLprRate() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalLprRate(lprRatePayload());
    lprRateDialogVisible.value = false;
    ElMessage.success('LPR 利率已保存');
    await loadLprRates();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'LPR 利率保存失败';
  } finally {
    submitting.value = false;
  }
}

function openAnnualCommonDataDialog(row?: AnnualCommonDataItem) {
  Object.assign(annualCommonDataForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    regionCode: row?.regionCode ?? '',
    regionName: row?.regionName ?? '',
    year: row?.year ?? 2024,
    metricKey: row?.metricKey ?? '',
    metricName: row?.metricName ?? '',
    value: row?.value ?? 0,
    unit: row?.unit ?? '元/年',
    sourceKey: row?.sourceKey ?? '',
    sourceName: row?.sourceName ?? '',
    sourceUrl: row?.sourceUrl ?? '',
    sourceVersion: row?.sourceVersion ?? '',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    usageScope: row?.usageScope ?? '',
    notice: row?.notice ?? '',
    status: row?.status ?? 'verified',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  annualCommonDataDialogVisible.value = true;
}

async function submitAnnualCommonData() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveAnnualCommonData(annualCommonDataPayload());
    annualCommonDataDialogVisible.value = false;
    ElMessage.success('常用年度数据已保存');
    await loadAnnualCommonData();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '常用年度数据保存失败';
  } finally {
    submitting.value = false;
  }
}

function openLitigationFeeRuleDialog(row?: LitigationFeeRuleItem) {
  Object.assign(litigationFeeRuleForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    toolKey: row?.toolKey ?? 'litigation_fee',
    ruleKey: row?.ruleKey ?? 'property_case_acceptance_fee',
    ruleName: row?.ruleName ?? '财产案件受理费',
    ruleVersion: row?.ruleVersion ?? '',
    sourceKey: row?.sourceKey ?? 'litigation_fee_state_council_481',
    status: row?.status ?? 'draft',
    effectiveDate: row?.effectiveDate ?? '2007-04-01',
    lastCheckedDate: row?.lastCheckedDate ?? '',
    bands: row?.bands ? row.bands.map((band) => ({ ...band })) : [],
    noticeText: row?.noticeText ?? '本结果为财产案件受理费参考估算，最终金额以法院通知为准。',
    disclaimerText: row?.disclaimerText ?? '本工具仅供参考。',
    ownerNote: row?.ownerNote ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  previewResult.value = null;
  litigationFeeRuleDialogVisible.value = true;
}

function addLitigationFeeBand() {
  litigationFeeRuleForm.bands.push({
    minExclusive: 0,
    maxInclusive: null,
    fixedFee: 0,
    feeMin: 0,
    feeMax: 0,
    excessBase: 0,
    excessRate: 0,
    rate: 0,
    quickAdjustment: 0,
    bandLabel: ''
  });
}

function removeLitigationFeeBand(index: number) {
  litigationFeeRuleForm.bands.splice(index, 1);
}

async function previewLitigationFee() {
  loadError.value = '';
  try {
    previewResult.value = await previewLitigationFeeRule({
      appCode: APP_CODE,
      ruleKey: litigationFeeRuleForm.ruleKey,
      amount: Number(previewAmount.value || 0)
    });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '诉讼费用规则预览失败';
    previewResult.value = null;
  }
}

async function submitLitigationFeeRule() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLitigationFeeRule(litigationFeeRulePayload());
    litigationFeeRuleDialogVisible.value = false;
    ElMessage.success('诉讼费用规则已保存');
    await loadLitigationFeeRules();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '诉讼费用规则保存失败';
  } finally {
    submitting.value = false;
  }
}

async function publishLitigationFeeRuleRow(row: LitigationFeeRuleItem) {
  await ElMessageBox.confirm(
    '发布后小程序会读取该诉讼费用规则，请确认分段、来源和核验日期已复核。',
    '发布诉讼费用规则',
    { type: 'warning' }
  );
  await publishLitigationFeeRule(row.id);
  await loadLitigationFeeRules();
}

function openGroupDialog(row?: LegalToolExposureGroupItem) {
  Object.assign(groupForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    groupKey: row?.groupKey ?? '',
    title: row?.title ?? '',
    description: row?.description ?? '',
    tone: row?.tone ?? 'teal',
    visibility: row?.visibility ?? 'public',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  groupDialogVisible.value = true;
}

async function submitGroup() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolExposureGroup(groupPayload());
    groupDialogVisible.value = false;
    ElMessage.success('展示分组已保存');
    await loadGroups();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '展示分组保存失败';
  } finally {
    submitting.value = false;
  }
}

function openExposureItemDialog(row?: LegalToolExposureItem) {
  Object.assign(exposureItemForm, {
    id: row?.id ?? 0,
    groupId: row?.groupId ?? selectedGroupId.value ?? 0,
    capabilityId: row?.capabilityId ?? capabilities.value[0]?.id ?? 0,
    entryKey: row?.entryKey ?? '',
    titleOverride: row?.titleOverride ?? '',
    descriptionOverride: row?.descriptionOverride ?? '',
    iconKey: row?.iconKey ?? 'calculator',
    targetPath: row?.targetPath ?? '',
    action: row?.action ?? 'coming_soon',
    status: row?.status ?? 'coming_soon',
    statusText: row?.statusText ?? '待开放',
    visibility: row?.visibility ?? 'hidden',
    audience: row?.audience ?? 'general_user',
    releaseStage: row?.releaseStage ?? 'internal',
    disclaimerProfile: row?.disclaimerProfile ?? 'legal_tool_reference',
    linkedServiceKey: row?.linkedServiceKey ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  exposureItemDialogVisible.value = true;
}

async function submitExposureItem() {
  if (!exposureItemForm.groupId) {
    loadError.value = '请先选择展示分组';
    return;
  }
  if (!exposureItemForm.capabilityId) {
    loadError.value = '请先选择能力项';
    return;
  }
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolExposureItem(exposureItemPayload());
    exposureItemDialogVisible.value = false;
    ElMessage.success('曝光入口已保存');
    await loadExposureItems();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '曝光入口保存失败';
  } finally {
    submitting.value = false;
  }
}

function openBlueprintDialog(row?: LegalToolInteractionBlueprintItem) {
  Object.assign(blueprintForm, {
    id: row?.id ?? 0,
    appCode: APP_CODE,
    blueprintKey: row?.blueprintKey ?? '',
    toolKey: row?.toolKey ?? '',
    blueprintName: row?.blueprintName ?? '',
    referenceType: row?.referenceType ?? 'competitor_observation',
    referenceNote: row?.referenceNote ?? '',
    formGroupsJson: row?.formGroupsJson ?? '[]',
    resultBlocksJson: row?.resultBlocksJson ?? '[]',
    ctaRulesJson: row?.ctaRulesJson ?? '[]',
    validationNotes: row?.validationNotes ?? '',
    status: row?.status ?? 'draft',
    reviewedBy: row?.reviewedBy ?? '',
    lastReviewedDate: row?.lastReviewedDate ?? '',
    ownerNote: row?.ownerNote ?? '',
    sortOrder: row?.sortOrder ?? 10,
    enabled: row?.enabled ?? true
  });
  blueprintDialogVisible.value = true;
}

async function submitBlueprint() {
  submitting.value = true;
  loadError.value = '';
  try {
    await saveLegalToolInteractionBlueprint(blueprintPayload());
    blueprintDialogVisible.value = false;
    ElMessage.success('交互蓝图已保存');
    await loadBlueprints();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '交互蓝图保存失败';
  } finally {
    submitting.value = false;
  }
}

async function disableGroup(row: LegalToolExposureGroupItem) {
  await ElMessageBox.confirm(`确认禁用分组「${row.title}」？`, '禁用展示分组', { type: 'warning' });
  await disableLegalToolExposureGroup(row.id);
  await loadGroups();
}

async function disableExposureItem(row: LegalToolExposureItem) {
  await ElMessageBox.confirm(`确认禁用入口「${row.entryKey}」？`, '禁用曝光入口', { type: 'warning' });
  await disableLegalToolExposureItem(row.id);
  await loadExposureItems();
}

function handleGroupSelection(groupId: number) {
  selectedGroupId.value = groupId;
  loadExposureItems();
}

onMounted(async () => {
  await Promise.all([
    loadCapabilities(),
    loadDataSources(),
    loadAnnualCommonData(),
    loadLprRates(),
    loadLitigationFeeRules(),
    loadElementTemplateFileManifest(),
    validateElementTemplateFileMetadata(),
    loadGroups(),
    loadBlueprints()
  ]);
});
</script>

<template>
  <section>
    <h1 class="page-title">法律工具中心</h1>
    <p class="page-subtitle">维护从竞品吸收的法律工具能力、展示分组和小程序曝光入口。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="config-panel">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="能力库" name="capabilities">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">工具能力库</div>
              <div class="toolbar-subtitle">沉淀竞品工具项、来源、风险和执行方式，是否曝光由入口配置决定。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadCapabilities">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openCapabilityDialog()">
                新增能力
              </el-button>
            </div>
          </div>

          <el-table v-loading="loading" :data="capabilities" row-key="id">
            <el-table-column prop="toolKey" label="能力标识" width="160" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="description" label="说明" min-width="220" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="110" />
            <el-table-column prop="sourceLevel" label="来源等级" width="120" />
            <el-table-column prop="riskLevel" label="风险" width="90" />
            <el-table-column prop="executionMode" label="执行方式" width="130" />
            <el-table-column prop="defaultIconKey" label="默认图标" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="更新时间" width="180">
              <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openCapabilityDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="数据来源" name="data-sources">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">官方与公开来源</div>
              <div class="toolbar-subtitle">登记法律工具依据的发布机构、版本、生效日期、核验日期和风险等级。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadDataSources">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openDataSourceDialog()">
                新增来源
              </el-button>
            </div>
          </div>

          <el-table v-loading="dataSourceLoading" :data="dataSources" row-key="id">
            <el-table-column prop="sourceKey" label="来源标识" width="190" />
            <el-table-column prop="sourceName" label="来源名称" min-width="220" show-overflow-tooltip />
            <el-table-column prop="sourceType" label="类型" width="130" />
            <el-table-column prop="issuer" label="发布机构" width="170" />
            <el-table-column prop="citation" label="文号" width="130" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="版本" width="170" show-overflow-tooltip />
            <el-table-column prop="effectiveDate" label="生效日期" width="120" />
            <el-table-column prop="lastCheckedDate" label="核验日期" width="120" />
            <el-table-column prop="status" label="状态" width="110" />
            <el-table-column prop="riskLevel" label="风险" width="90" />
            <el-table-column prop="linkedToolKeys" label="关联工具" min-width="170" show-overflow-tooltip />
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openDataSourceDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="常用年度数据" name="annual-common-data">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">常用年度数据</div>
              <div class="toolbar-subtitle">维护地区、年度、指标、数值、来源版本和核验状态，供小程序只读查询。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadAnnualCommonData">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openAnnualCommonDataDialog()">
                新增年度数据
              </el-button>
            </div>
          </div>

          <el-table v-loading="annualCommonDataLoading" :data="annualCommonData" row-key="id">
            <el-table-column prop="regionName" label="地区" width="120" />
            <el-table-column prop="year" label="年度" width="90" />
            <el-table-column prop="metricName" label="指标" min-width="180" show-overflow-tooltip />
            <el-table-column prop="value" label="数值" width="120" />
            <el-table-column prop="unit" label="单位" width="90" />
            <el-table-column prop="sourceKey" label="来源标识" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="210" show-overflow-tooltip />
            <el-table-column prop="lastCheckedDate" label="核验日期" width="120" />
            <el-table-column prop="status" label="状态" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openAnnualCommonDataDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="LPR利率" name="lpr-rates">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">LPR 利率序列</div>
              <div class="toolbar-subtitle">维护贷款市场报价利率的报价日期、一年期、五年期以上和官方来源版本。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadLprRates">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openLprRateDialog()">
                新增利率
              </el-button>
            </div>
          </div>

          <el-table v-loading="lprRateLoading" :data="lprRates" row-key="id">
            <el-table-column prop="quoteDate" label="报价日期" width="130" />
            <el-table-column prop="oneYearRate" label="一年期 LPR" width="130" />
            <el-table-column prop="fiveYearPlusRate" label="五年期以上" width="130" />
            <el-table-column prop="sourceKey" label="来源标识" width="150" />
            <el-table-column prop="sourceName" label="来源名称" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" width="170" show-overflow-tooltip />
            <el-table-column prop="lastCheckedDate" label="核验日期" width="120" />
            <el-table-column prop="status" label="状态" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openLprRateDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="诉讼费用规则" name="litigation-fee-rules">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">诉讼费用规则</div>
              <div class="toolbar-subtitle">维护财产案件受理费分段、来源标识、核验日期和发布状态。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadLitigationFeeRules">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openLitigationFeeRuleDialog()">
                新增规则
              </el-button>
            </div>
          </div>

          <el-table v-loading="litigationFeeRuleLoading" :data="litigationFeeRules" row-key="id">
            <el-table-column prop="ruleName" label="规则名称" width="150" />
            <el-table-column prop="ruleVersion" label="版本" min-width="220" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="110" />
            <el-table-column prop="sourceKey" label="来源标识" min-width="210" show-overflow-tooltip />
            <el-table-column prop="lastCheckedDate" label="核验日期" width="120" />
            <el-table-column label="分段" min-width="240" show-overflow-tooltip>
              <template #default="{ row }">{{ firstLitigationFeeBandSummary(row) }}</template>
            </el-table-column>
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openLitigationFeeRuleDialog(row)">编辑</el-button>
                <el-button text type="primary" :disabled="!row.enabled" @click="publishLitigationFeeRuleRow(row)">发布</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="示范文本文件" name="element-template-files">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">要素式示范文本静态文件</div>
              <div class="toolbar-subtitle">维护模板文件路径、文件名和发布前校验结果，小程序只读取受控下载地址。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadElementTemplateFileManifest">刷新清单</el-button>
              <el-button :icon="Refresh" @click="validateElementTemplateFileMetadata">发布前校验</el-button>
            </div>
          </div>

          <div class="stat-row">
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">静态域名</div>
              <div class="stat-value small">{{ elementTemplateFileManifest?.staticBaseUrl || '-' }}</div>
            </el-card>
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">文件总数</div>
              <div class="stat-value">{{ elementTemplateFileManifest?.totalCount ?? 0 }}</div>
            </el-card>
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">缺失元数据</div>
              <div class="stat-value">{{ elementTemplateFileManifest?.missingFileMetadataCount ?? 0 }}</div>
            </el-card>
            <el-card shadow="never" class="stat-card">
              <div class="stat-label">发布状态</div>
              <el-tag :type="elementTemplateFileValidation?.readyToPublish ? 'success' : 'warning'" effect="plain">
                {{ elementTemplateFileValidation?.readyToPublish ? '可发布' : '需处理' }}
              </el-tag>
            </el-card>
          </div>

          <el-table
            v-loading="elementTemplateFileLoading"
            :data="elementTemplateFileManifest?.files || []"
            row-key="templateKey"
          >
            <el-table-column prop="templateKey" label="模板标识" width="220" show-overflow-tooltip />
            <el-table-column prop="templateName" label="模板名称" min-width="190" show-overflow-tooltip />
            <el-table-column prop="objectPath" label="对象路径" min-width="280" show-overflow-tooltip />
            <el-table-column prop="fileName" label="文件名" min-width="210" show-overflow-tooltip />
            <el-table-column prop="fileType" label="类型" width="90" />
            <el-table-column prop="status" label="状态" width="110" />
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="import-panel">
            <div class="toolbar">
              <div>
                <div class="toolbar-title">批量导入清单</div>
                <div class="toolbar-subtitle">粘贴后端约定 JSON，先预检再确认导入。</div>
              </div>
              <div class="toolbar-actions">
                <el-button @click="previewElementTemplateFileImportJson">导入预检</el-button>
                <el-button
                  v-if="canManageLegalToolCenter"
                  type="primary"
                  @click="applyElementTemplateFileImportJson"
                >
                  确认导入
                </el-button>
              </div>
            </div>
            <el-input v-model="elementTemplateFileImportJson" type="textarea" :rows="8" />
          </div>

          <div class="result-row">
            <el-alert
              v-if="elementTemplateFilePreview"
              type="info"
              :title="`预检：${elementTemplateFilePreview.acceptedCount}/${elementTemplateFilePreview.totalCount} 可导入，问题 ${elementTemplateFilePreview.issueCount} 个`"
              show-icon
            />
            <el-alert
              v-if="elementTemplateFileApplyResult"
              type="success"
              :title="`已更新 ${elementTemplateFileApplyResult.updatedCount} 条，${elementTemplateFileApplyResult.readyToPublish ? '可发布' : '仍需校验'}`"
              show-icon
            />
            <el-table
              v-if="elementTemplateFileValidation?.issues.length"
              :data="elementTemplateFileValidation.issues"
              row-key="templateKey"
            >
              <el-table-column prop="templateKey" label="模板标识" width="240" />
              <el-table-column prop="type" label="问题类型" width="170" />
              <el-table-column prop="message" label="说明" min-width="260" show-overflow-tooltip />
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="展示分组" name="groups">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">小程序展示分组</div>
              <div class="toolbar-subtitle">控制工具中心页面里的分区名称、视觉色调、公开/灰度/隐藏状态。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadGroups">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openGroupDialog()">
                新增分组
              </el-button>
            </div>
          </div>

          <el-table v-loading="groupLoading" :data="groups" row-key="id">
            <el-table-column prop="groupKey" label="分组标识" width="160" />
            <el-table-column prop="title" label="名称" width="150" />
            <el-table-column prop="description" label="说明" min-width="260" show-overflow-tooltip />
            <el-table-column prop="tone" label="色调" width="100" />
            <el-table-column prop="visibility" label="可见性" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="180">
              <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openGroupDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableGroup(row)">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="曝光入口" name="exposure-items">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">工具曝光入口</div>
              <div class="toolbar-subtitle">{{ selectedGroup ? selectedGroup.title : '请先选择展示分组' }}</div>
            </div>
            <div class="toolbar-actions">
              <el-select
                v-model="selectedGroupId"
                class="group-select"
                placeholder="选择分组"
                @change="handleGroupSelection"
              >
                <el-option v-for="item in groups" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
              <el-button :icon="Refresh" @click="loadExposureItems">刷新</el-button>
              <el-button
                v-if="canManageLegalToolCenter"
                type="primary"
                :icon="Plus"
                :disabled="!selectedGroupId"
                @click="openExposureItemDialog()"
              >
                新增入口
              </el-button>
            </div>
          </div>

          <el-table v-loading="exposureItemLoading" :data="exposureItems" row-key="id">
            <el-table-column prop="entryKey" label="入口标识" width="160" />
            <el-table-column label="绑定能力" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">{{ capabilityTitle(row.capabilityId) }}</template>
            </el-table-column>
            <el-table-column prop="targetPath" label="页面路径" min-width="240" show-overflow-tooltip />
            <el-table-column prop="action" label="动作" width="110" />
            <el-table-column prop="status" label="业务状态" width="110" />
            <el-table-column prop="visibility" label="可见性" width="110" />
            <el-table-column prop="releaseStage" label="发布阶段" width="110" />
            <el-table-column prop="iconKey" label="图标" width="110" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column label="状态" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openExposureItemDialog(row)">编辑</el-button>
                <el-button v-if="row.enabled" :icon="SwitchButton" text type="danger" @click="disableExposureItem(row)">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="交互蓝图" name="blueprints">
          <div class="toolbar">
            <div>
              <div class="toolbar-title">工具交互蓝图</div>
              <div class="toolbar-subtitle">沉淀竞品观察后的表单分组、结果区块、提示和服务转化结构，不复制竞品文案。</div>
            </div>
            <div class="toolbar-actions">
              <el-button :icon="Refresh" @click="loadBlueprints">刷新</el-button>
              <el-button v-if="canManageLegalToolCenter" type="primary" :icon="Plus" @click="openBlueprintDialog()">
                新增蓝图
              </el-button>
            </div>
          </div>

          <el-table v-loading="blueprintLoading" :data="blueprints" row-key="id">
            <el-table-column prop="blueprintKey" label="蓝图标识" width="190" />
            <el-table-column prop="toolKey" label="工具标识" width="160" />
            <el-table-column prop="blueprintName" label="名称" min-width="210" show-overflow-tooltip />
            <el-table-column prop="referenceType" label="参考类型" width="170" />
            <el-table-column prop="status" label="状态" width="120" />
            <el-table-column prop="validationNotes" label="校验说明" min-width="210" show-overflow-tooltip />
            <el-table-column prop="lastReviewedDate" label="审核日期" width="120" />
            <el-table-column prop="reviewedBy" label="审核人" width="120" />
            <el-table-column label="启用" width="104">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.enabled)" effect="plain">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="canManageLegalToolCenter" label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button :icon="EditPen" text type="primary" @click="openBlueprintDialog(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="capabilityDialogVisible" title="法律工具能力" width="760px">
      <el-form label-width="108px">
        <el-form-item label="能力标识"><el-input v-model="capabilityForm.toolKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="capabilityForm.title" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="capabilityForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="capabilityForm.category" class="full-input">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户">
          <el-select v-model="capabilityForm.audience" class="full-input">
            <el-option v-for="item in audienceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源等级">
          <el-select v-model="capabilityForm.sourceLevel" class="full-input">
            <el-option v-for="item in sourceLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据依赖">
          <el-select v-model="capabilityForm.dataDependency" class="full-input">
            <el-option v-for="item in dataDependencyOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行方式">
          <el-select v-model="capabilityForm.executionMode" class="full-input">
            <el-option v-for="item in executionModeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="capabilityForm.riskLevel" class="full-input">
            <el-option v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认图标"><MiniappIconPicker v-model="capabilityForm.defaultIconKey" /></el-form-item>
        <el-form-item label="默认路径"><el-input v-model="capabilityForm.defaultTargetPath" /></el-form-item>
        <el-form-item label="默认动作">
          <el-select v-model="capabilityForm.defaultAction" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源名称"><el-input v-model="capabilityForm.sourceName" /></el-form-item>
        <el-form-item label="来源链接"><el-input v-model="capabilityForm.sourceUrl" /></el-form-item>
        <el-form-item label="来源版本"><el-input v-model="capabilityForm.sourceVersion" /></el-form-item>
        <el-form-item label="生效日期"><el-input v-model="capabilityForm.sourceEffectiveDate" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="capabilityForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="运营备注"><el-input v-model="capabilityForm.ownerNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="capabilityForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="capabilityForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="capabilityDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitCapability">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dataSourceDialogVisible" title="数据来源" width="720px">
      <el-form label-width="108px">
        <el-form-item label="来源标识"><el-input v-model="dataSourceForm.sourceKey" /></el-form-item>
        <el-form-item label="来源名称"><el-input v-model="dataSourceForm.sourceName" /></el-form-item>
        <el-form-item label="来源类型">
          <el-select v-model="dataSourceForm.sourceType" class="full-input">
            <el-option v-for="item in sourceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布机构"><el-input v-model="dataSourceForm.issuer" /></el-form-item>
        <el-form-item label="来源链接"><el-input v-model="dataSourceForm.sourceUrl" /></el-form-item>
        <el-form-item label="引用文号"><el-input v-model="dataSourceForm.citation" /></el-form-item>
        <el-form-item label="生效日期"><el-input v-model="dataSourceForm.effectiveDate" /></el-form-item>
        <el-form-item label="来源版本"><el-input v-model="dataSourceForm.sourceVersion" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="dataSourceForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dataSourceForm.status" class="full-input">
            <el-option v-for="item in sourceStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="dataSourceForm.riskLevel" class="full-input">
            <el-option v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联工具"><el-input v-model="dataSourceForm.linkedToolKeys" /></el-form-item>
        <el-form-item label="运营备注"><el-input v-model="dataSourceForm.ownerNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="dataSourceForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="dataSourceForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataSourceDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitDataSource">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="annualCommonDataDialogVisible" title="常用年度数据" width="760px">
      <el-form label-width="116px">
        <el-form-item label="地区编码"><el-input v-model="annualCommonDataForm.regionCode" /></el-form-item>
        <el-form-item label="地区名称"><el-input v-model="annualCommonDataForm.regionName" /></el-form-item>
        <el-form-item label="年度"><el-input-number v-model="annualCommonDataForm.year" :min="2000" :max="2100" /></el-form-item>
        <el-form-item label="指标标识"><el-input v-model="annualCommonDataForm.metricKey" /></el-form-item>
        <el-form-item label="指标名称"><el-input v-model="annualCommonDataForm.metricName" /></el-form-item>
        <el-form-item label="数值">
          <el-input-number v-model="annualCommonDataForm.value" :min="0" :precision="2" controls-position="right" />
        </el-form-item>
        <el-form-item label="单位"><el-input v-model="annualCommonDataForm.unit" /></el-form-item>
        <el-form-item label="来源标识"><el-input v-model="annualCommonDataForm.sourceKey" /></el-form-item>
        <el-form-item label="来源名称"><el-input v-model="annualCommonDataForm.sourceName" /></el-form-item>
        <el-form-item label="来源链接"><el-input v-model="annualCommonDataForm.sourceUrl" /></el-form-item>
        <el-form-item label="来源版本"><el-input v-model="annualCommonDataForm.sourceVersion" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="annualCommonDataForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="使用范围"><el-input v-model="annualCommonDataForm.usageScope" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="提示文案"><el-input v-model="annualCommonDataForm.notice" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="annualCommonDataForm.status" class="full-input">
            <el-option v-for="item in sourceStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="annualCommonDataForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="annualCommonDataForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="annualCommonDataDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitAnnualCommonData">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="lprRateDialogVisible" title="LPR 利率" width="680px">
      <el-form label-width="116px">
        <el-form-item label="报价日期"><el-input v-model="lprRateForm.quoteDate" placeholder="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="一年期 LPR">
          <el-input-number v-model="lprRateForm.oneYearRate" :min="0" :max="30" :precision="2" :step="0.05" />
        </el-form-item>
        <el-form-item label="五年期以上">
          <el-input-number v-model="lprRateForm.fiveYearPlusRate" :min="0" :max="30" :precision="2" :step="0.05" />
        </el-form-item>
        <el-form-item label="来源标识"><el-input v-model="lprRateForm.sourceKey" /></el-form-item>
        <el-form-item label="来源名称"><el-input v-model="lprRateForm.sourceName" /></el-form-item>
        <el-form-item label="来源链接"><el-input v-model="lprRateForm.sourceUrl" /></el-form-item>
        <el-form-item label="来源版本"><el-input v-model="lprRateForm.sourceVersion" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="lprRateForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="lprRateForm.status" class="full-input">
            <el-option v-for="item in sourceStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="lprRateForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="lprRateForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="lprRateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitLprRate">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="litigationFeeRuleDialogVisible" title="诉讼费用规则" width="960px">
      <el-form label-width="112px">
        <el-form-item label="规则名称"><el-input v-model="litigationFeeRuleForm.ruleName" /></el-form-item>
        <el-form-item label="规则版本"><el-input v-model="litigationFeeRuleForm.ruleVersion" /></el-form-item>
        <el-form-item label="来源标识"><el-input v-model="litigationFeeRuleForm.sourceKey" /></el-form-item>
        <el-form-item label="规则标识"><el-input v-model="litigationFeeRuleForm.ruleKey" /></el-form-item>
        <el-form-item label="状态"><el-input v-model="litigationFeeRuleForm.status" /></el-form-item>
        <el-form-item label="生效日期"><el-input v-model="litigationFeeRuleForm.effectiveDate" /></el-form-item>
        <el-form-item label="核验日期"><el-input v-model="litigationFeeRuleForm.lastCheckedDate" /></el-form-item>
        <el-form-item label="分段规则">
          <div class="band-editor">
            <div v-for="(band, index) in litigationFeeRuleForm.bands" :key="index" class="band-row">
              <span class="band-field-label">下限</span>
              <el-input-number v-model="band.minExclusive" :min="0" controls-position="right" placeholder="下限" />
              <span class="band-field-label">上限</span>
              <el-input-number v-model="band.maxInclusive" :min="0" controls-position="right" placeholder="上限" />
              <span class="band-field-label">固定费用</span>
              <el-input-number v-model="band.fixedFee" :min="0" controls-position="right" placeholder="固定费用" />
              <span class="band-field-label">费用下限</span>
              <el-input-number v-model="band.feeMin" :min="0" controls-position="right" placeholder="费用下限" />
              <span class="band-field-label">费用上限</span>
              <el-input-number v-model="band.feeMax" :min="0" controls-position="right" placeholder="费用上限" />
              <span class="band-field-label">超额基数</span>
              <el-input-number v-model="band.excessBase" :min="0" controls-position="right" placeholder="超额基数" />
              <span class="band-field-label">超额费率</span>
              <el-input-number v-model="band.excessRate" :min="0" :precision="4" :step="0.001" controls-position="right" placeholder="超额费率" />
              <span class="band-field-label">费率</span>
              <el-input-number v-model="band.rate" :min="0" :precision="4" :step="0.001" controls-position="right" placeholder="费率" />
              <span class="band-field-label">速算调整</span>
              <el-input-number v-model="band.quickAdjustment" :precision="2" controls-position="right" placeholder="速算调整" />
              <el-input v-model="band.bandLabel" placeholder="分段说明" />
              <el-button text type="danger" @click="removeLitigationFeeBand(index)">删除</el-button>
            </div>
            <el-button :icon="Plus" @click="addLitigationFeeBand">新增分段</el-button>
          </div>
        </el-form-item>
        <el-form-item label="预览金额">
          <div class="preview-row">
            <el-input-number v-model="previewAmount" :min="0" :precision="2" controls-position="right" />
            <el-button @click="previewLitigationFee">预览</el-button>
            <span v-if="previewResult" class="preview-result">
              {{ litigationFeePreviewText }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="结果提示"><el-input v-model="litigationFeeRuleForm.noticeText" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="免责声明"><el-input v-model="litigationFeeRuleForm.disclaimerText" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="运营备注"><el-input v-model="litigationFeeRuleForm.ownerNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="litigationFeeRuleForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="litigationFeeRuleForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="litigationFeeRuleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitLitigationFeeRule">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="groupDialogVisible" title="展示分组" width="600px">
      <el-form label-width="96px">
        <el-form-item label="分组标识"><el-input v-model="groupForm.groupKey" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="groupForm.title" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="groupForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="色调">
          <el-select v-model="groupForm.tone" class="full-input">
            <el-option v-for="item in toneOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="可见性">
          <el-select v-model="groupForm.visibility" class="full-input">
            <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序"><el-input-number v-model="groupForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="groupForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitGroup">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exposureItemDialogVisible" title="曝光入口" width="720px">
      <el-form label-width="112px">
        <el-form-item label="所属分组">
          <el-select v-model="exposureItemForm.groupId" class="full-input">
            <el-option v-for="item in groups" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定能力">
          <el-select v-model="exposureItemForm.capabilityId" class="full-input" filterable>
            <el-option
              v-for="item in capabilities"
              :key="item.id"
              :label="`${item.title}（${item.toolKey}）`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入口标识"><el-input v-model="exposureItemForm.entryKey" /></el-form-item>
        <el-form-item label="标题覆盖"><el-input v-model="exposureItemForm.titleOverride" /></el-form-item>
        <el-form-item label="描述覆盖">
          <el-input v-model="exposureItemForm.descriptionOverride" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="图标"><MiniappIconPicker v-model="exposureItemForm.iconKey" /></el-form-item>
        <el-form-item label="页面路径"><el-input v-model="exposureItemForm.targetPath" /></el-form-item>
        <el-form-item label="动作">
          <el-select v-model="exposureItemForm.action" class="full-input">
            <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态">
          <el-select v-model="exposureItemForm.status" class="full-input">
            <el-option v-for="item in entryStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态文案"><el-input v-model="exposureItemForm.statusText" /></el-form-item>
        <el-form-item label="可见性">
          <el-select v-model="exposureItemForm.visibility" class="full-input">
            <el-option v-for="item in visibilityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户">
          <el-select v-model="exposureItemForm.audience" class="full-input">
            <el-option v-for="item in audienceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布阶段">
          <el-select v-model="exposureItemForm.releaseStage" class="full-input">
            <el-option v-for="item in releaseStageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="免责声明"><el-input v-model="exposureItemForm.disclaimerProfile" /></el-form-item>
        <el-form-item label="服务标识"><el-input v-model="exposureItemForm.linkedServiceKey" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="exposureItemForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="exposureItemForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exposureItemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitExposureItem">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="blueprintDialogVisible" title="交互蓝图" width="780px">
      <el-form label-width="112px">
        <el-form-item label="蓝图标识"><el-input v-model="blueprintForm.blueprintKey" /></el-form-item>
        <el-form-item label="工具标识"><el-input v-model="blueprintForm.toolKey" /></el-form-item>
        <el-form-item label="蓝图名称"><el-input v-model="blueprintForm.blueprintName" /></el-form-item>
        <el-form-item label="参考类型">
          <el-select v-model="blueprintForm.referenceType" class="full-input">
            <el-option
              v-for="item in blueprintReferenceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参考说明"><el-input v-model="blueprintForm.referenceNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="表单分组 JSON"><el-input v-model="blueprintForm.formGroupsJson" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="结果区块 JSON"><el-input v-model="blueprintForm.resultBlocksJson" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="CTA 规则 JSON"><el-input v-model="blueprintForm.ctaRulesJson" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="校验说明"><el-input v-model="blueprintForm.validationNotes" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="blueprintForm.status" class="full-input">
            <el-option v-for="item in blueprintStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人"><el-input v-model="blueprintForm.reviewedBy" /></el-form-item>
        <el-form-item label="审核日期"><el-input v-model="blueprintForm.lastReviewedDate" /></el-form-item>
        <el-form-item label="运营备注"><el-input v-model="blueprintForm.ownerNote" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="blueprintForm.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="blueprintForm.enabled" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="blueprintDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitBlueprint">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.config-panel {
  min-height: 560px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.toolbar-title {
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-select {
  width: 200px;
}

.full-input {
  width: 100%;
}

.stat-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 12px;
}

.stat-card :deep(.el-card__body) {
  padding: 12px;
}

.stat-label {
  color: #667085;
  font-size: 12px;
}

.stat-value {
  color: #344054;
  font-size: 20px;
  font-weight: 600;
  margin-top: 6px;
}

.stat-value.small {
  font-size: 13px;
  overflow-wrap: anywhere;
}

.import-panel,
.result-row {
  margin-top: 16px;
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.band-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.band-row,
.preview-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.band-row .el-input {
  min-width: 160px;
}

.band-field-label {
  color: #667085;
  flex: 0 0 auto;
  font-size: 12px;
  white-space: nowrap;
}

.preview-result {
  color: #344054;
  font-size: 13px;
}
</style>
