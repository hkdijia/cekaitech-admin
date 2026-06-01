import { request } from './http';

export interface MiniappOrchestrationNode {
  nodeType: string;
  sourceType: string;
  sourceId: number | null;
  key: string;
  title: string;
  description: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  visibility: string;
  releaseStage: string;
  iconKey: string;
  sortOrder: number;
  enabled: boolean;
  capabilityKey: string;
  children: MiniappOrchestrationNode[];
}

export interface MiniappOrchestrationEntryPayload {
  sourceType: string;
  sourceId: number;
  title: string;
  description: string;
  targetPath: string;
  action: string;
  status: string;
  statusText: string;
  iconKey: string;
  visibility: string;
  releaseStage: string;
  sortOrder: number;
  enabled: boolean;
}

export function loadMiniappOrchestrationTree(
  appCode: string,
  includeDisabled = false
): Promise<MiniappOrchestrationNode> {
  return request<MiniappOrchestrationNode>('/api/admin/miniapp-orchestration/tree', {
    method: 'POST',
    body: JSON.stringify({ appCode, includeDisabled })
  });
}

export function saveMiniappOrchestrationEntry(
  payload: MiniappOrchestrationEntryPayload
): Promise<MiniappOrchestrationNode> {
  return request<MiniappOrchestrationNode>('/api/admin/miniapp-orchestration/entries/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
