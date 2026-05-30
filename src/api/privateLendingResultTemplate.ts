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

export function getPrivateLendingResultTemplate(
  appCode: string,
  caseType: string
): Promise<PrivateLendingResultTemplateResponse> {
  const query = new URLSearchParams({ appCode, caseType }).toString();
  return request<PrivateLendingResultTemplateResponse>(`/api/admin/private-lending-result-template?${query}`, {
    method: 'GET'
  });
}

export function savePrivateLendingResultTemplate(
  payload: PrivateLendingResultTemplateSaveRequest
): Promise<PrivateLendingResultTemplateResponse> {
  return request<PrivateLendingResultTemplateResponse>('/api/admin/private-lending-result-template/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function previewPrivateLendingResultTemplate(
  payload: PrivateLendingResultTemplatePreviewRequest
): Promise<PrivateLendingResultTemplatePreviewResponse> {
  return request<PrivateLendingResultTemplatePreviewResponse>('/api/admin/private-lending-result-template/preview', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
