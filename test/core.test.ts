import { IBANValidationError, withCountries } from '../src/core/index';
import { composeIBAN, extractIBAN, isValidIBAN } from '../src/index';
import { describe, expect, it } from 'vitest';
import { CH } from '../src/countries/CH';
import { DE } from '../src/countries/DE';

// A syntactically valid Swiss BBAN: Switzerland has no national checksum.
const CH_BBAN = `00000${'A'.repeat(12)}`;
const CH_IBAN = composeIBAN('CH', CH_BBAN) ?? '';
const DE_IBAN = composeIBAN('DE', '0'.repeat(18)) ?? '';

describe('core', () => {
  const tools = withCountries({ CH });

  it('validates the countries it was given', () => {
    expect(CH_IBAN).not.toBe('');
    expect(tools.isValidIBAN(CH_IBAN)).toBe(true);
    expect(tools.validateIBAN(CH_IBAN)).toEqual({ valid: true, errorCodes: [] });
    expect(tools.extractIBAN(CH_IBAN)).toEqual(extractIBAN(CH_IBAN));
    expect(tools.composeIBAN('CH', CH_BBAN)).toBe(CH_IBAN);
    expect(tools.isValidBBAN(CH_BBAN, 'CH')).toBe(true);
    expect(tools.validateBBAN(CH_BBAN, 'CH')).toEqual({ valid: true, errorCodes: [] });
    expect(tools.isSEPACountry('CH')).toBe(true);
  });

  it('knows nothing about other countries', () => {
    expect(isValidIBAN(DE_IBAN)).toBe(true);
    expect(tools.isValidIBAN(DE_IBAN)).toBe(false);
    expect(tools.validateIBAN(DE_IBAN)).toEqual({ valid: false, errorCodes: [IBANValidationError.NoIBANCountry] });
    expect(tools.isSEPACountry('DE')).toBe(false);
    expect(withCountries({ CH, DE }).isValidIBAN(DE_IBAN)).toBe(true);
  });

  it('agrees with the default entry for every option', () => {
    const reject = { bbanValidators: { CH: () => false } };
    expect(tools.isValidIBAN(CH_IBAN, reject)).toBe(false);
    expect(isValidIBAN(CH_IBAN, reject)).toBe(false);
    expect(tools.isValidIBAN(CH_IBAN, { allowQRIBAN: false })).toBe(isValidIBAN(CH_IBAN, { allowQRIBAN: false }));
  });
});
