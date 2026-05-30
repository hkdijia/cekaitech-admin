import { describe, expect, it } from 'vitest';
import { MINIAPP_ICON_OPTIONS, findMiniappIconOption } from './miniappIconCatalog';

describe('miniappIconCatalog', () => {
  it('exposes a shared open source icon catalog for miniapp config pages', () => {
    expect(MINIAPP_ICON_OPTIONS.map((item) => item.key)).toContain('file-text');
    expect(MINIAPP_ICON_OPTIONS.map((item) => item.key)).toContain('folder-check');
    expect(MINIAPP_ICON_OPTIONS.map((item) => item.key)).toContain('calculator');
    expect(findMiniappIconOption('file-text')?.label).toBe('文书');
  });
});
