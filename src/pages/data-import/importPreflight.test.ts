import { describe, expect, it } from 'vitest';
import { analyzeImportJson } from './importPreflight';

describe('analyzeImportJson', () => {
  it('counts records and top-level field completeness from an array export', () => {
    const result = analyzeImportJson(
      JSON.stringify([
        { id: 1, title: 'first', phone: '13800000000' },
        { id: 2, title: '', phone: '13900000000' },
        { id: 3, phone: null }
      ])
    );

    expect(result.status).toBe('ready');
    expect(result.recordCount).toBe(3);
    expect(result.recordSource).toBe('root[]');
    expect(result.fieldStats).toEqual([
      { field: 'id', presentCount: 3, missingCount: 0, completeness: 100 },
      { field: 'phone', presentCount: 2, missingCount: 1, completeness: 67 },
      { field: 'title', presentCount: 1, missingCount: 2, completeness: 33 }
    ]);
  });

  it('uses common wrapper arrays and reports sensitive nested fields', () => {
    const result = analyzeImportJson(
      JSON.stringify({
        exportedAt: '2026-05-23T12:00:00+08:00',
        records: [
          {
            userId: 10,
            payload: {
              sessionId: 'abc',
              rawHttpExchange: { request: 'GET /secret', response: '200 OK' }
            }
          },
          { userId: 11, payload: { note: 'safe' } }
        ]
      })
    );

    expect(result.status).toBe('ready');
    expect(result.recordCount).toBe(2);
    expect(result.recordSource).toBe('records[]');
    expect(result.sensitiveWarnings).toEqual([
      {
        field: 'payload.rawHttpExchange',
        hitCount: 1,
        reason: '原始 HTTP exchange 不应上传'
      },
      {
        field: 'payload.sessionId',
        hitCount: 1,
        reason: '会话标识不应上传'
      }
    ]);
  });

  it('returns an invalid status for malformed JSON', () => {
    const result = analyzeImportJson('{ "records": [');

    expect(result.status).toBe('invalid');
    expect(result.recordCount).toBe(0);
    expect(result.errorMessage).toContain('JSON 解析失败');
  });
});
