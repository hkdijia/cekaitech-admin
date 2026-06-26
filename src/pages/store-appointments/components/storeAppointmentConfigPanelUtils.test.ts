import { describe, expect, it } from 'vitest';
import {
  createStoreConfigRequestId,
  normalizeOptionalText,
  splitListText
} from './storeAppointmentConfigPanelUtils';

describe('storeAppointmentConfigPanelUtils', () => {
  it('normalizes blank text to undefined', () => {
    expect(normalizeOptionalText('  store-config-001  ')).toBe('store-config-001');
    expect(normalizeOptionalText('   ')).toBeUndefined();
  });

  it('splits newline and comma separated values', () => {
    expect(splitListText('项目A\n 项目B,项目C \n\n')).toEqual(['项目A', '项目B', '项目C']);
  });

  it('creates traceable store config request id', () => {
    expect(createStoreConfigRequestId()).toMatch(/^store-config-\d+-[a-f0-9]+$/);
  });
});
