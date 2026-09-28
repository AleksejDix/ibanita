import { describe, expect, it } from 'vitest';
import { mod9710 } from '../src/core/checksum';

describe('checksum', () => {
  describe('When calling mod9710() with non-numeric input', () => {
    it('should return NaN', () => {
      expect(mod9710('AB1234')).toBeNaN();
    });
  });
});
