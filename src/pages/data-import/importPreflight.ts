export type ImportPreflightStatus = 'empty' | 'invalid' | 'ready';

export interface FieldCompletenessStat {
  field: string;
  presentCount: number;
  missingCount: number;
  completeness: number;
}

export interface SensitiveFieldWarning {
  field: string;
  hitCount: number;
  reason: string;
}

export interface ImportPreflightResult {
  status: ImportPreflightStatus;
  recordCount: number;
  recordSource: string;
  fieldStats: FieldCompletenessStat[];
  sensitiveWarnings: SensitiveFieldWarning[];
  errorMessage: string;
}

type JsonObject = Record<string, unknown>;

const wrapperArrayFields = ['records', 'items', 'dataList', 'list', 'data'];

const sensitiveFieldReasons: Record<string, string> = {
  accesstoken: '访问令牌不应上传',
  authorization: '鉴权头不应上传',
  cookie: 'Cookie 不应上传',
  cookies: 'Cookie 不应上传',
  httpexchange: '原始 HTTP exchange 不应上传',
  rawexchange: '原始 HTTP exchange 不应上传',
  rawhttpexchange: '原始 HTTP exchange 不应上传',
  rawrequest: '原始 HTTP 请求不应上传',
  rawresponse: '原始 HTTP 响应不应上传',
  refreshtoken: '刷新令牌不应上传',
  requestheaders: '原始 HTTP 请求头不应上传',
  responseheaders: '原始 HTTP 响应头不应上传',
  sessionid: '会话标识不应上传',
  setcookie: 'Set-Cookie 不应上传'
};

export function analyzeImportJson(input: string): ImportPreflightResult {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return createEmptyResult('empty', '请粘贴或选择 JSON 文件后再预检');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmedInput);
  } catch (error) {
    const detail = error instanceof Error ? error.message : '未知解析错误';
    return createEmptyResult('invalid', `JSON 解析失败：${detail}`);
  }

  const { records, source } = extractRecords(parsed);
  if (!records.length) {
    return createEmptyResult('invalid', '未识别到可预检的记录数组或对象');
  }

  return {
    status: 'ready',
    recordCount: records.length,
    recordSource: source,
    fieldStats: buildFieldStats(records),
    sensitiveWarnings: findSensitiveWarnings(records),
    errorMessage: ''
  };
}

function createEmptyResult(status: ImportPreflightStatus, errorMessage: string): ImportPreflightResult {
  return {
    status,
    recordCount: 0,
    recordSource: '',
    fieldStats: [],
    sensitiveWarnings: [],
    errorMessage
  };
}

function extractRecords(value: unknown): { records: JsonObject[]; source: string } {
  if (Array.isArray(value)) {
    return { records: value.filter(isJsonObject), source: 'root[]' };
  }

  if (!isJsonObject(value)) {
    return { records: [], source: '' };
  }

  for (const field of wrapperArrayFields) {
    const candidate = value[field];
    if (Array.isArray(candidate)) {
      return { records: candidate.filter(isJsonObject), source: `${field}[]` };
    }
  }

  return { records: [value], source: 'root' };
}

function buildFieldStats(records: JsonObject[]): FieldCompletenessStat[] {
  const fields = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  return fields
    .map((field) => {
      const presentCount = records.filter((record) => hasCompleteValue(record[field])).length;
      const missingCount = records.length - presentCount;
      return {
        field,
        presentCount,
        missingCount,
        completeness: Math.round((presentCount / records.length) * 100)
      };
    })
    .sort((left, right) => right.completeness - left.completeness || left.field.localeCompare(right.field));
}

function findSensitiveWarnings(records: JsonObject[]): SensitiveFieldWarning[] {
  const hitMap = new Map<string, SensitiveFieldWarning>();
  for (const record of records) {
    scanSensitiveFields(record, '', hitMap);
  }
  return Array.from(hitMap.values()).sort((left, right) => left.field.localeCompare(right.field));
}

function scanSensitiveFields(value: unknown, path: string, hitMap: Map<string, SensitiveFieldWarning>) {
  if (Array.isArray(value)) {
    value.forEach((item) => scanSensitiveFields(item, path, hitMap));
    return;
  }

  if (!isJsonObject(value)) {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const fieldPath = path ? `${path}.${key}` : key;
    const reason = sensitiveFieldReasons[normalizeFieldName(key)];
    if (reason) {
      const current = hitMap.get(fieldPath);
      if (current) {
        current.hitCount += 1;
      }
      if (!current) {
        hitMap.set(fieldPath, { field: fieldPath, hitCount: 1, reason });
      }
    }
    scanSensitiveFields(nestedValue, fieldPath, hitMap);
  }
}

function hasCompleteValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (isJsonObject(value)) {
    return Object.keys(value).length > 0;
  }
  return true;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeFieldName(field: string): string {
  return field.toLowerCase().replace(/[\s_-]/g, '');
}
