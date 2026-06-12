import { request } from './http';

export interface PrivateLendingResultTemplate {
  draftTitle: string;
  riskNotice: string;
  filingGuideUrl: string;
  filingGuideLabel: string;
  evidenceChecklist: string[];
  filingTips: string[];
  draftLines: string[];
}

export interface PrivateLendingResultTemplateResponse {
  appCode: string;
  caseType: string;
  schemaVersion: number;
  template: PrivateLendingResultTemplate;
}

export interface PrivateLendingResultTemplateSaveRequest {
  appCode: string;
  caseType: string;
  template: PrivateLendingResultTemplate;
}

export interface PrivateLendingResultTemplatePreviewRequest {
  appCode: string;
  caseType: string;
  sampleFormData: Record<string, string>;
}

export interface PrivateLendingDocPackage {
  status: string;
  draftTitle: string;
  draftContent: string;
  riskNotice: string;
  evidenceChecklist: string[];
  filingTips: string[];
  filingGuideUrl: string;
  filingGuideLabel: string;
  generatedBy: string;
}

export interface PrivateLendingResultTemplatePreviewResponse {
  appCode: string;
  caseType: string;
  schemaVersion: number;
  docPackage: PrivateLendingDocPackage;
}

export interface CaseResultTemplateOption {
  appCode: string;
  caseType: string;
  title: string;
  catalogStatus: string;
  catalogEnabled: boolean;
  configured: boolean;
  generationEnabled: boolean;
  templateSupported: boolean;
  schemaVersion: number | null;
  statusText: string;
}

export function getCaseResultTemplateOptions(appCode: string): Promise<CaseResultTemplateOption[]> {
  const query = new URLSearchParams({ appCode }).toString();
  return request<CaseResultTemplateOption[]>(`/api/admin/case-result-template/options?${query}`, {
    method: 'GET'
  });
}

export function getPrivateLendingResultTemplate(
  appCode: string,
  caseType: string
): Promise<PrivateLendingResultTemplateResponse> {
  const query = new URLSearchParams({ appCode, caseType }).toString();
  return request<PrivateLendingResultTemplateResponse>(`/api/admin/case-result-template?${query}`, {
    method: 'GET'
  });
}

export function savePrivateLendingResultTemplate(
  payload: PrivateLendingResultTemplateSaveRequest
): Promise<PrivateLendingResultTemplateResponse> {
  return request<PrivateLendingResultTemplateResponse>('/api/admin/case-result-template/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function previewPrivateLendingResultTemplate(
  payload: PrivateLendingResultTemplatePreviewRequest
): Promise<PrivateLendingResultTemplatePreviewResponse> {
  return request<PrivateLendingResultTemplatePreviewResponse>('/api/admin/case-result-template/preview', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
