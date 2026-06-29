import { describe, expect, it } from 'vitest';
import { isWorkspaceAppLocked, resolveCurrentAppCode } from './miniappAppContext';

describe('miniapp app context', () => {
  it('uses route query appCode for platform pages', () => {
    expect(resolveCurrentAppCode('party-scorekeeper-miniapp', 'global')).toBe('party-scorekeeper-miniapp');
  });

  it('locks to current workspace appCode for business workspaces', () => {
    expect(resolveCurrentAppCode(undefined, 'party-scorekeeper-miniapp')).toBe('party-scorekeeper-miniapp');
    expect(isWorkspaceAppLocked('party-scorekeeper-miniapp')).toBe(true);
  });

  it('falls back to legal assistant in global pages without selected appCode', () => {
    expect(resolveCurrentAppCode(undefined, 'global')).toBe('lawsuit-material-assistant');
    expect(isWorkspaceAppLocked('global')).toBe(false);
  });
});
