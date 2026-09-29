import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('format', () => {
  describe('When calling electronicFormat()', () => {
    it('with valid Brazilian IBAN should return BR6699999A03000010009795493C1', () => {
      expect(iban.electronicFormat('BR66 9999 9A03 0000 1000 9795 493C 1')).toBe('BR6699999A03000010009795493C1');
    });
  });

  describe('When calling friendlyFormatIBAN()', () => {
    it('with valid badly formated Brazilian IBAN should return BR66 9999 9A03 0000 1000 9795 493C 1', () => {
      expect(iban.friendlyFormatIBAN('BR66 9999 9A03 0000 1000 9795 493C 1')).toBe(
        'BR66 9999 9A03 0000 1000 9795 493C 1',
      );
    });
  });

  describe('When calling friendlyFormatIBAN() with - as separator', () => {
    it('with valid badly formated Brazilian IBAN should return BR66-9999-9A03-0000-1000-9795-493C-1', () => {
      expect(iban.friendlyFormatIBAN('BR66 9999 9A03 0000 1000 9795 493C 1', '-')).toBe(
        'BR66-9999-9A03-0000-1000-9795-493C-1',
      );
    });
  });

  describe('When calling friendlyFormatIBAN() with replacement pattern as separator', () => {
    it('should insert the separator literally', () => {
      expect(iban.friendlyFormatIBAN('NL06KNNF4736942347', '$&')).toBe('NL06$&KNNF$&4736$&9423$&47');
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

describe('electronicFormat input rule', () => {
  it.each<[string | null | undefined, string]>([
    [null, ''],
    [undefined, ''],
    ['', ''],
    [' ab-cd.ef\t12 ', 'ABCDEF12'],
  ])('electronicFormat(%s)', (input, expected) => {
    expect(iban.electronicFormat(input)).toBe(expected);
  });
});
