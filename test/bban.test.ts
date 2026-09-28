import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('bban', () => {
  describe('When calling isValidBBAN()', () => {
    it('with HU BBAN with wrong bank-branch check digit should return false', () => {
      expect(iban.isValidBBAN('117730171111101800000000', 'HU')).toBe(false);
    });
    it('with CZ BBAN whose prefix check digit is 1 for remainder 1 should return false', () => {
      expect(iban.isValidBBAN('08000000610000000000', 'CZ')).toBe(false);
    });
    it('with CZ BBAN whose account check digit is 1 for remainder 1 should return false', () => {
      expect(iban.isValidBBAN('08000000000000000601', 'CZ')).toBe(false);
    });
    it('with SK BBAN whose prefix check digit is 1 for remainder 1 should return false', () => {
      expect(iban.isValidBBAN('12000000610000000000', 'SK')).toBe(false);
    });
    it('with valid BBAN and valid country code should return true', () => {
      expect(iban.isValidBBAN('ABNA0417164300', 'NL')).toBe(true);
    });
    it('with valid BBAN and valid country code should return true', () => {
      expect(iban.isValidBBAN('PSTB0000054322', 'NL')).toBe(true);
    });
    it('with invalid BBAN and valid country code should return false', () => {
      expect(iban.isValidBBAN('A7NA0417164300', 'NL')).toBe(false);
    });
    it('with valid BBAN and invalid country code should return false', () => {
      expect(iban.isValidBBAN('ABNA0417164300', 'ZZ')).toBe(false);
    });
    it('with valid BBAN and no country code should return false', () => {
      expect(iban.isValidBBAN('ABNA0417164300', null)).toBe(false);
    });
    it('with invalid BBAN for country code NO should return false', () => {
      expect(iban.isValidBBAN('12043175441', 'NO')).toBe(false);
    });
    it('with valid BBAN for country code NO should return true', () => {
      expect(iban.isValidBBAN('12043175449', 'NO')).toBe(true);
    });
    it('with too short BBAN for country code NO should return false', () => {
      expect(iban.isValidBBAN('1204317544', 'NO')).toBe(false);
    });
  });
});
