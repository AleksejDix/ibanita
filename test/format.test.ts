import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('format', () => {
  describe('When calling electronicFormatIBAN()', () => {
    it('with valid Brazilian IBAN should return BR9700360305000010009795493P1', () => {
      expect(iban.electronicFormatIBAN('BR97 0036 0305 0000 1000 9795 493P 1')).toBe('BR9700360305000010009795493P1');
    });
  });

  describe('When calling friendlyFormatIBAN()', () => {
    it('with valid badly formated Brazilian IBAN should return BR97 0036 0305 0000 1000 9795 493P 1', () => {
      expect(iban.friendlyFormatIBAN('BR97 0036-030500001000-9795493-P1')).toBe('BR97 0036 0305 0000 1000 9795 493P 1');
    });
  });

  describe('When calling friendlyFormatIBAN() with - as separator', () => {
    it('with valid badly formated Brazilian IBAN should return BR97-0036-0305-0000-1000-9795-493P-1', () => {
      expect(iban.friendlyFormatIBAN('BR97 0036-030500001000-9795493-P1', '-')).toBe(
        'BR97-0036-0305-0000-1000-9795-493P-1',
      );
    });
  });

  describe('When calling friendlyFormatIBAN() with replacement pattern as separator', () => {
    it('should insert the separator literally', () => {
      expect(iban.friendlyFormatIBAN('NL91ABNA0417164300', '$&')).toBe('NL91$&ABNA$&0417$&1643$&00');
    });
  });

  describe('When calling friendlyFormatIBAN() with invalid argument', () => {
    it.each<[string | null | undefined, string | null]>([
      [undefined, null],
      [null, null],
      ['', ''],
    ])('friendlyFormatIBAN(%s)', (input, expected) => {
      expect(iban.friendlyFormatIBAN(input)).toBe(expected);
    });
  });
});
