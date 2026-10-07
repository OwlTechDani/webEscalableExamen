import { describe, expect, it } from 'vitest';

import { routes } from './app.routes';

describe('routes', () => {
  it('should be defined', () => {
    expect(routes).toBeDefined();
  });
});
