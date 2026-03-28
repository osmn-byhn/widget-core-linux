import { describe, it, expect } from 'vitest';
import { createShield } from './shield.js';

describe('SecurityShield', () => {
  it('should return safe globals', () => {
    const mockWindow = {
      console: { log: () => {} },
      setTimeout: () => {},
    };
    const safe = createShield(mockWindow);
    expect(safe.console).toBe(mockWindow.console);
  });

  it('should block access to dangerous properties', () => {
    const mockWindow: any = {};
    createShield(mockWindow);
    
    expect(() => mockWindow.process).toThrow(/Security Shield/);
    expect(() => mockWindow.require).toThrow(/Security Shield/);
    expect(() => mockWindow.global).toThrow(/Security Shield/);
  });
});
