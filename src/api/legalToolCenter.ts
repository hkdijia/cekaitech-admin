import { request } from './http';

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export interface LegalToolCapabilityPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolExposureGroupPageQuery {
  appCode?: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolExposureItemPageQuery {
  groupId: number;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolDataSourcePageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolInteractionBlueprintPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalLprRatePageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface AnnualCommonDataPageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LitigationFeeRulePageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LegalToolCapabilityItem {
  id: number;
  appCode: string;
  toolKey: string;
  title: string;
  description: string;
  category: string;
  status: string;
  audience: string;
  sourceLevel: string;
  dataDependency: string;
  executionMode: string;
  riskLevel: string;
  defaultIconKey: string;
  defaultTargetPath: string;
  defaultAction: string;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
  sourceEffectiveDate: string;
  lastCheckedDate: string;
  ownerNote: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolExposureGroupItem {
  id: number;
  appCode: string;
  groupKey: string;
  title: string;
  description: string;
  tone: string;
  visibility: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolExposureItem {
  id: number;
  groupId: number;
  capabilityId: number;
  entryKey: string;
  titleOverride: string;
  descriptionOverride: string;
  iconKey: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  visibility: string;
  audience: string;
  releaseStage: string;
  disclaimerProfile: string;
  linkedServiceKey: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolDataSourceItem {
  id: number;
  appCode: string;
  sourceKey: string;
  sourceName: string;
  sourceType: string;
  issuer: string;
  sourceUrl: string;
  citation: string;
  effectiveDate: string;
  sourceVersion: string;
  lastCheckedDate: string;
  status: string;
  riskLevel: string;
  linkedToolKeys: string;
  ownerNote: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalToolInteractionBlueprintItem {
  id: number;
  appCode: string;
  blueprintKey: string;
  toolKey: string;
  blueprintName: string;
  referenceType: string;
  referenceNote: string;
  formGroupsJson: string;
  resultBlocksJson: string;
  ctaRulesJson: string;
  validationNotes: string;
  status: string;
  reviewedBy: string;
  lastReviewedDate: string;
  ownerNote: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalLprRateItem {
  id: number;
  appCode: string;
  quoteDate: string;
  oneYearRate: number;
  fiveYearPlusRate: number;
  sourceKey: string;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
  lastCheckedDate: string;
  status: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnualCommonDataItem {
  id: number;
  appCode: string;
  regionCode: string;
  regionName: string;
  year: number;
  metricKey: string;
  metricName: string;
  value: number;
  unit: string;
  sourceKey: string;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
  lastCheckedDate: string;
  usageScope: string;
  notice: string;
  status: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LitigationFeeBand {
  minExclusive: number;
  maxInclusive: number | null;
  fixedFee: number;
  feeMin?: number | null;
  feeMax?: number | null;
  excessBase?: number | null;
  excessRate?: number | null;
  rate: number;
  quickAdjustment: number;
  bandLabel: string;
}

export interface LitigationFeeRuleItem {
  id: number;
  appCode: string;
  toolKey: string;
  ruleKey: string;
  ruleName: string;
  ruleVersion: string;
  sourceKey: string;
  status: string;
  effectiveDate: string;
  lastCheckedDate: string;
  bands: LitigationFeeBand[];
  noticeText: string;
  disclaimerText: string;
  ownerNote: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LitigationFeePreviewQuery {
  appCode: string;
  ruleKey: string;
  amount: number;
}

export interface LitigationFeePreviewResult {
  amount: number;
  fee?: number;
  feeMin?: number;
  feeMax?: number;
  bandLabel: string;
}

export interface ElementTemplateFileManifestQuery {
  appCode: string;
}

export interface ElementTemplateFileItem {
  templateKey: string;
  templateName?: string;
  objectPath: string;
  downloadUrl?: string;
  fileName: string;
  fileType: string;
  enabled?: boolean;
  status?: string;
}

export interface ElementTemplateFileManifestResult {
  appCode: string;
  staticBaseUrl: string;
  totalCount: number;
  missingFileMetadataCount: number;
  files: ElementTemplateFileItem[];
}

export interface ElementTemplateFileValidationIssue {
  templateKey: string;
  type: string;
  message: string;
}

export interface ElementTemplateFileValidationResult {
  appCode: string;
  staticBaseUrl: string;
  totalCount: number;
  missingFileMetadataCount: number;
  invalidObjectPathCount: number;
  invalidFileNameCount: number;
  invalidFileTypeCount: number;
  invalidDownloadUrlCount: number;
  readyToPublish: boolean;
  issues: ElementTemplateFileValidationIssue[];
}

export interface ElementTemplateFileImportPayload {
  appCode: string;
  files: Array<{
    templateKey: string;
    objectPath: string;
    fileName: string;
    fileType: string;
  }>;
}

export interface ElementTemplateFileImportPreviewResult {
  appCode: string;
  totalCount: number;
  acceptedCount: number;
  issueCount: number;
  readyToImport: boolean;
  issues: ElementTemplateFileValidationIssue[];
}

export interface ElementTemplateFileImportApplyResult {
  appCode: string;
  updatedCount: number;
  readyToPublish: boolean;
}

export interface LegalToolReadinessInspectQuery {
  appCode: string;
}

export interface LegalToolCapabilityStatusUpdatePayload {
  status: string;
  ownerNote?: string;
}

export interface LegalToolReadinessIssue {
  type: string;
  severity: string;
  message: string;
}

export interface LegalToolReadinessItem {
  toolKey: string;
  title: string;
  status: string;
  readiness: 'pass' | 'warning' | 'blocked' | 'live' | 'deferred' | string;
  capabilityEnabled: boolean;
  publicExposure: boolean;
  reviewedBlueprint: boolean;
  dataSourceReady: boolean;
  issues: LegalToolReadinessIssue[];
}

export interface LegalToolReadinessInspectResult {
  appCode: string;
  totalCapabilityCount: number;
  publicExposureCount: number;
  enabledCount: number;
  pendingReleaseCount: number;
  blockedStatusCount: number;
  pausedCount: number;
  retiredCount: number;
  readyCount: number;
  warningCount: number;
  blockedCount: number;
  items: LegalToolReadinessItem[];
}

export type LegalToolCapabilityPayload = Omit<LegalToolCapabilityItem, 'createdAt' | 'updatedAt'>;
export type LegalToolExposureGroupPayload = Omit<LegalToolExposureGroupItem, 'createdAt' | 'updatedAt'>;
export type LegalToolExposureItemPayload = Omit<LegalToolExposureItem, 'createdAt' | 'updatedAt'>;
export type LegalToolDataSourcePayload = Omit<LegalToolDataSourceItem, 'createdAt' | 'updatedAt'>;
export type LegalToolInteractionBlueprintPayload = Omit<LegalToolInteractionBlueprintItem, 'createdAt' | 'updatedAt'>;
export type LegalLprRatePayload = Omit<LegalLprRateItem, 'createdAt' | 'updatedAt'>;
export type AnnualCommonDataPayload = Omit<AnnualCommonDataItem, 'createdAt' | 'updatedAt'>;
export type LitigationFeeRulePayload = Omit<LitigationFeeRuleItem, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: number;
};

export function pageLegalToolCapabilities(
  query: LegalToolCapabilityPageQuery
): Promise<PageResult<LegalToolCapabilityItem>> {
  return request<PageResult<LegalToolCapabilityItem>>('/api/admin/legal-tool-center/capabilities/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolCapability(
  payload: LegalToolCapabilityPayload
): Promise<LegalToolCapabilityItem> {
  return request<LegalToolCapabilityItem>('/api/admin/legal-tool-center/capabilities/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateLegalToolCapabilityStatus(
  capabilityId: number,
  payload: LegalToolCapabilityStatusUpdatePayload
): Promise<LegalToolCapabilityItem> {
  return request<LegalToolCapabilityItem>(`/api/admin/legal-tool-center/capabilities/${capabilityId}/status`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function inspectLegalToolReadiness(
  query: LegalToolReadinessInspectQuery
): Promise<LegalToolReadinessInspectResult> {
  return request<LegalToolReadinessInspectResult>('/api/admin/legal-tool-center/readiness/inspect', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function pageLegalToolDataSources(
  query: LegalToolDataSourcePageQuery
): Promise<PageResult<LegalToolDataSourceItem>> {
  return request<PageResult<LegalToolDataSourceItem>>('/api/admin/legal-tool-center/data-sources/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolDataSource(
  payload: LegalToolDataSourcePayload
): Promise<LegalToolDataSourceItem> {
  return request<LegalToolDataSourceItem>('/api/admin/legal-tool-center/data-sources/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageLegalLprRates(
  query: LegalLprRatePageQuery
): Promise<PageResult<LegalLprRateItem>> {
  return request<PageResult<LegalLprRateItem>>('/api/admin/legal-tool-center/lpr-rates/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalLprRate(
  payload: LegalLprRatePayload
): Promise<LegalLprRateItem> {
  return request<LegalLprRateItem>('/api/admin/legal-tool-center/lpr-rates/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageAnnualCommonData(
  query: AnnualCommonDataPageQuery
): Promise<PageResult<AnnualCommonDataItem>> {
  return request<PageResult<AnnualCommonDataItem>>('/api/admin/legal-tool-center/annual-common-data/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveAnnualCommonData(
  payload: AnnualCommonDataPayload
): Promise<AnnualCommonDataItem> {
  return request<AnnualCommonDataItem>('/api/admin/legal-tool-center/annual-common-data/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageLitigationFeeRules(
  query: LitigationFeeRulePageQuery
): Promise<PageResult<LitigationFeeRuleItem>> {
  return request<PageResult<LitigationFeeRuleItem>>('/api/admin/legal-tool-center/litigation-fee-rules/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLitigationFeeRule(
  payload: LitigationFeeRulePayload
): Promise<LitigationFeeRuleItem> {
  return request<LitigationFeeRuleItem>('/api/admin/legal-tool-center/litigation-fee-rules/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function previewLitigationFeeRule(
  payload: LitigationFeePreviewQuery
): Promise<LitigationFeePreviewResult> {
  return request<LitigationFeePreviewResult>('/api/admin/legal-tool-center/litigation-fee-rules/preview', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function publishLitigationFeeRule(ruleId: number): Promise<LitigationFeeRuleItem> {
  return request<LitigationFeeRuleItem>(`/api/admin/legal-tool-center/litigation-fee-rules/${ruleId}/publish`, {
    method: 'POST'
  });
}

export function manifestElementTemplateFiles(
  query: ElementTemplateFileManifestQuery
): Promise<ElementTemplateFileManifestResult> {
  return request<ElementTemplateFileManifestResult>('/api/admin/legal-tool-center/element-template-files/manifest', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function validateElementTemplateFiles(
  query: ElementTemplateFileManifestQuery
): Promise<ElementTemplateFileValidationResult> {
  return request<ElementTemplateFileValidationResult>('/api/admin/legal-tool-center/element-template-files/validate', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function previewElementTemplateFileImport(
  payload: ElementTemplateFileImportPayload
): Promise<ElementTemplateFileImportPreviewResult> {
  return request<ElementTemplateFileImportPreviewResult>('/api/admin/legal-tool-center/element-template-files/import-preview', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function applyElementTemplateFileImport(
  payload: ElementTemplateFileImportPayload
): Promise<ElementTemplateFileImportApplyResult> {
  return request<ElementTemplateFileImportApplyResult>('/api/admin/legal-tool-center/element-template-files/import-apply', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageLegalToolInteractionBlueprints(
  query: LegalToolInteractionBlueprintPageQuery
): Promise<PageResult<LegalToolInteractionBlueprintItem>> {
  return request<PageResult<LegalToolInteractionBlueprintItem>>('/api/admin/legal-tool-center/interaction-blueprints/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolInteractionBlueprint(
  payload: LegalToolInteractionBlueprintPayload
): Promise<LegalToolInteractionBlueprintItem> {
  return request<LegalToolInteractionBlueprintItem>('/api/admin/legal-tool-center/interaction-blueprints/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageLegalToolExposureGroups(
  query: LegalToolExposureGroupPageQuery
): Promise<PageResult<LegalToolExposureGroupItem>> {
  return request<PageResult<LegalToolExposureGroupItem>>('/api/admin/legal-tool-center/groups/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolExposureGroup(
  payload: LegalToolExposureGroupPayload
): Promise<LegalToolExposureGroupItem> {
  return request<LegalToolExposureGroupItem>('/api/admin/legal-tool-center/groups/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableLegalToolExposureGroup(groupId: number): Promise<LegalToolExposureGroupItem> {
  return request<LegalToolExposureGroupItem>(`/api/admin/legal-tool-center/groups/${groupId}/disable`, {
    method: 'POST'
  });
}

export function pageLegalToolExposureItems(
  query: LegalToolExposureItemPageQuery
): Promise<PageResult<LegalToolExposureItem>> {
  return request<PageResult<LegalToolExposureItem>>('/api/admin/legal-tool-center/exposure-items/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function saveLegalToolExposureItem(
  payload: LegalToolExposureItemPayload
): Promise<LegalToolExposureItem> {
  return request<LegalToolExposureItem>('/api/admin/legal-tool-center/exposure-items/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableLegalToolExposureItem(itemId: number): Promise<LegalToolExposureItem> {
  return request<LegalToolExposureItem>(`/api/admin/legal-tool-center/exposure-items/${itemId}/disable`, {
    method: 'POST'
  });
}
