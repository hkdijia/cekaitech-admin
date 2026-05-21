import { describe, expect, it } from 'vitest';
import { adminMenuItems } from './menu';
import { routes } from './index';

describe('admin routes', () => {
  it('has one route for every sidebar menu item', () => {
    const routePaths = routes.map((route) => route.path);

    for (const item of adminMenuItems) {
      expect(routePaths).toContain(item.path);
    }
  });
});
