import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('iban', () => {
  describe('When calling isValidIBAN()', () => {
    it.each<[string | null | undefined, boolean]>([
      ['NL06KNNF4736942347', true],
      ['NL06KNNF4736942347', true],
      ['NL06KNNF4736942347', true],
      ['NL55BWUZ9768782157', false],
      [null, false],
      ['AT405221152498612243', true],
      ['BY22YUS48077UKOX2Z1XC4L7LHWF', true],
      ['CR05015202001026284066', true],
      ['DE29219157744565144212', true],
      ['ES1332324167111225619783', true],
      ['ES1332324167111225619783', true],
      ['ES0276088653913685464242', false],
      ['GT28UVZSKGLO0FP1HSHYGL640UPW', true],
      ['HR5082337270045901185', true],
      ['IQ03AUYV963876791701141', true],
      ['IQ03 AUYV 9638 7679 1701 141', true],
      ['JO41FOEG4372DWY6B5668WMK79WON7', true],
      ['PS28PNWSGNLPEZ1T5NT392YL0KTS1', true],
      ['RS35396569012612625887', true],
      ['SV39BCDQ29196844990361803561', true],
      ['TL289627956623136930300', true],
      ['GL1483304436549454', true],
      ['UA213223130000026007233566001', true],
      ['VA81878190788537005032', true],
      ['SV39BCDQ29196844990361803561', true],
      ['RS36396569012612625887', false],
      ['TL390080012345678910157', false],
      ['GL14833044365494541', false],
      ['GB65OBFT17659999787530', true],
      ['GB9ZOBFT17659999787530', false],
      ['GB30NWBK60161331926819', false],
      ['EG595566657745172859424689213', true],
      ['DZ464018756954470183084165', true],
      ['AO87031782803918807397936', true],
      ['BJ94BT9612164248132065309360', true],
      ['BF41IA8906069706969619440186', true],
      ['BI3771828465830793043267759', true],
      ['CM7383136705253456551681837', true],
      ['CV46122509147360541445980', true],
      ['CV97680653257238578298978', true],
      ['IR639155206050027722348781', true],
      ['CI57L80406175437939902153958', true],
      ['MG9655210795799573284563624', true],
      ['ML96YT0601006354348517581088', true],
      ['MZ72138225731042689358055', true],
      ['KM1220207078226041206762757', true],
      ['TD5066924119717475672124005', true],
      ['CG2421391404992171445526266', true],
      ['GA3129534937612075869912926', true],
      ['HN88CABF00000000000250005469', true],
      ['MA12032133503015568373964160', true],
      ['NI45BAPR00000013000003558124', true],
      ['NE31DO4061205985426226243165', true],
      ['TG97CY0077407368638361774403', true],
      ['CF9843398614940814348998349', true],
      ['DJ2100010000000154000100186', true],
      ['GQ0929991370175158797082132', true],
      ['GW65EZ9251275722825491783', true],
      ['SC18SSCB11010000000000001497USD', true],
      ['LY76696139055697332299432', true],
      ['SN87MO7181038697755958140875', true],
      ['SD2129010501234001', true],
      ['SO211000001001000100141', true],
      ['YE15JPIO6964GWR7NGIHGDL6Y3LJ3U', true],
      ['PL61109010140000071219812874', true],
      ['BE55840946150744', true],
      ['BA394620931170283620', true],
      ['BA394620931170283620', true],
      ['MK28941AG10T8CWUY98', true],
      ['MK28941AG10T8CWUY98', true],
      ['ME25663341374578388454', true],
      ['ME25663341374578388454', true],
      ['PT50000201231234567890154', true],
      ['PT50143875103232053138779', true],
      ['SI56191084285374787', true],
      ['SI56231229144606598', true],
      ['CZ6935976069262160503044', true],
      ['CZ6508001000192000145399', false],
      ['EE038078512990615902', true],
      ['EE038078512990615902', true],
      ['EE669266381292400867', true],
      ['EE244919626847854648', true],
      ['FI2113255717216364', true],
      ['FI2113255717216364', true],
      ['FI8831852106751232', true],
      ['FI3413752159759147', true],
      ['FR470839849279PL50FH2MKLY93', true],
      ['FR470839849279PL50FH2MKLY93', true],
      ['MC157517116393TRP6KOOPPW192', true],
      ['MC157517116393TRP6KOOPPW192', true],
      ['HU57282728236251742681753960', true],
      ['HU57282728236251742681753960', true],
      ['HU54542801822028095794801616', true],
      ['HU86294272228124630152500245', true],
      ['MN925052770519585209', true],
      ['SK9370138808619386613416', true],
      ['RU0304452522540817810538091310419', true],
      ['NL12FZWJ5526581795', true],
      ['NL81OJWO1448888602', false],
      ['..', false],
      ['SI072633000120390860', false],
      ['CH283109120L9PSR9BKOK', true],
    ])('isValidIBAN(%s)', (input, expected) => {
      expect(iban.isValidIBAN(input)).toBe(expected);
    });
    it.each<[string, Readonly<iban.IBANValidationOptions>, boolean]>([
      ['CH283109120L9PSR9BKOK', { allowQRIBAN: false }, false],
      ['CH283109120L9PSR9BKOK', {}, true],
    ])('isValidIBAN(%s, %j)', (input, options, expected) => {
      expect(iban.isValidIBAN(input, options)).toBe(expected);
    });
    it.each<[string | null | undefined, boolean]>([
      ['BR6699999A03000010009795493C1', true],
      ['FK06MD094753146336', true],
      ['OM69017KK5U4R3ZK9U2S5HL', true],
    ])('isValidIBAN(%s)', (input, expected) => {
      expect(iban.isValidIBAN(input)).toBe(expected);
    });
  });

  describe('When calling validateIBAN()', () => {
    it.each<[string | null | undefined, iban.IBANValidationResult]>([
      [
        null,
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.NoIBANProvided],
        },
      ],
      [
        '',
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.NoIBANProvided],
        },
      ],
      ['..', { valid: false, errorCodes: [iban.IBANValidationError.NoIBANProvided] }],
      ['NL06 KNNF 4736 9423 47', { valid: true, errorCodes: [] }],
      ['NL06-KNNF-4736-9423-47', { valid: true, errorCodes: [] }],
      [
        'NL06 KNNF 4736 9423 47'.toLowerCase(),
        {
          valid: true,
          errorCodes: [],
        },
      ],
      [
        'SI072633000120390860',
        {
          valid: false,
          errorCodes: [
            iban.IBANValidationError.WrongBBANLength,
            iban.IBANValidationError.WrongBBANFormat,
            iban.IBANValidationError.WrongIBANChecksum,
          ],
        },
      ],
      [
        undefined,
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.NoIBANProvided],
        },
      ],
      [
        'NL55BWUZ9768782157',
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.WrongIBANChecksum],
        },
      ],
      [
        'ZZ0741852963074185',
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.NoIBANCountry],
        },
      ],
      [
        'NL',
        {
          valid: false,
          errorCodes: [
            iban.IBANValidationError.WrongBBANLength,
            iban.IBANValidationError.WrongBBANFormat,
            iban.IBANValidationError.CheckDigitsNotNumeric,
            iban.IBANValidationError.WrongIBANChecksum,
          ],
        },
      ],
      [
        'NL9ZKNNF47369423470',
        {
          valid: false,
          errorCodes: [
            iban.IBANValidationError.WrongBBANLength,
            iban.IBANValidationError.WrongBBANFormat,
            iban.IBANValidationError.CheckDigitsNotNumeric,
            iban.IBANValidationError.WrongIBANChecksum,
          ],
        },
      ],
      [
        'CH283109120L9PSR9BKOK',
        {
          valid: true,
          errorCodes: [],
        },
      ],
    ])('validateIBAN(%s)', (input, expected) => {
      expect(iban.validateIBAN(input)).toEqual(expected);
    });

    it.each<[string, Readonly<iban.IBANValidationOptions>, iban.IBANValidationResult]>([
      [
        'CH283109120L9PSR9BKOK',
        { allowQRIBAN: false },
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.QRIBANNotAllowed],
        },
      ],
      ['CH283109120L9PSR9BKOK', {}, { valid: true, errorCodes: [] }],
    ])('validateIBAN(%s, %j)', (input, options, expected) => {
      expect(iban.validateIBAN(input, options)).toEqual(expected);
    });

    it.each<[string | null | undefined, iban.IBANValidationResult]>([
      ['LY76696139055697332299432', { valid: true, errorCodes: [] }],
      ['RU0304452522540817810538091310419', { valid: true, errorCodes: [] }],
      ['SD2129010501234001', { valid: true, errorCodes: [] }],
      ['SO211000001001000100141', { valid: true, errorCodes: [] }],
    ])('validateIBAN(%s)', (input, expected) => {
      expect(iban.validateIBAN(input)).toEqual(expected);
    });
  });

  describe('When calling validateIBAN() with CZ IBAN failing account checksum', () => {
    it('should return account checksum error', () => {
      expect(iban.validateIBAN('CZ6208000000610000000000')).toEqual({
        valid: false,
        errorCodes: [iban.IBANValidationError.WrongBBANChecksum],
      });
    });
  });

  describe('When calling composeIBAN()', () => {
    it.each<[string | null | undefined, string | null | undefined, string | null]>([
      ['NL', 'KNNF4736942347', 'NL06KNNF4736942347'],
      ['ZZ', 'KNNF4736942347', null],
      ['NL', '7NNF4736942347', null],
      ['NL', '7NNF4736942347', null],
      ['NL', 'NL07KNNF4736942347', null],
      [undefined, 'KNNF47369423470', null],
      ['NO', '86011117948', null],
      ['NO', '86011117947', 'NO9386011117947'],
    ])('composeIBAN(%s, %s)', (countryCode, bban, expected) => {
      expect(iban.composeIBAN(countryCode, bban)).toBe(expected);
    });
    it('with BY BBAN with digit in bank code should return IBAN', () => {
      expect(iban.composeIBAN('BY', '1BRB3600900000002Z00AB00')).not.toBeNull();
    });
    it.each<[string | null | undefined, string | null | undefined, string | null]>([
      ['IE', 'AIB193115212345678', null],
      ['NL', null, null],
    ])('composeIBAN(%s, %s)', (countryCode, bban, expected) => {
      expect(iban.composeIBAN(countryCode, bban)).toBe(expected);
    });
  });

  describe('extractIBAN()', () => {
    it.each<[string, iban.IBANExtractionResult]>([
      [
        'BR6699999A03000010009795493C1',
        {
          valid: true,
          iban: 'BR6699999A03000010009795493C1',
          countryCode: 'BR',
          bban: '99999A03000010009795493C1',
          accountNumber: '0009795493C1',
          bankIdentifier: '99999A03',
          branchIdentifier: '00001',
        },
      ],
      [
        'FR550747272728V397RU496OM26',
        {
          valid: true,
          iban: 'FR550747272728V397RU496OM26',
          countryCode: 'FR',
          bban: '0747272728V397RU496OM26',
          accountNumber: 'V397RU496OM',
          bankIdentifier: '07472',
          branchIdentifier: '72728',
        },
      ],
      [
        'SI56191084285374787',
        {
          valid: true,
          iban: 'SI56191084285374787',
          countryCode: 'SI',
          bban: '191084285374787',
          accountNumber: '42853747',
          bankIdentifier: '19',
          branchIdentifier: '108',
        },
      ],
      ['BR89JXBNIZ45580698650937071RD1', { valid: false, iban: 'BR89JXBNIZ45580698650937071RD1' }],
      [
        'NL06 KNNF 4736 9423 47',
        {
          valid: true,
          iban: 'NL06KNNF4736942347',
          countryCode: 'NL',
          bban: 'KNNF4736942347',
          accountNumber: '4736942347',
          bankIdentifier: 'KNNF',
        },
      ],
      [
        'ES6831834986439954824653',
        {
          valid: true,
          iban: 'ES6831834986439954824653',
          countryCode: 'ES',
          bban: '31834986439954824653',
          accountNumber: '9954824653',
          bankIdentifier: '3183',
          branchIdentifier: '4986',
        },
      ],
      [
        'YE15JPIO6964GWR7NGIHGDL6Y3LJ3U',
        {
          valid: true,
          iban: 'YE15JPIO6964GWR7NGIHGDL6Y3LJ3U',
          countryCode: 'YE',
          bban: 'JPIO6964GWR7NGIHGDL6Y3LJ3U',
          accountNumber: 'GWR7NGIHGDL6Y3LJ3U',
          bankIdentifier: 'JPIO',
          branchIdentifier: '6964',
        },
      ],
      [
        'HN88CABF00000000000250005469',
        {
          valid: true,
          iban: 'HN88CABF00000000000250005469',
          countryCode: 'HN',
          bban: 'CABF00000000000250005469',
          accountNumber: '00000000000250005469',
          bankIdentifier: 'CABF',
        },
      ],
      [
        'JO41FOEG4372DWY6B5668WMK79WON7',
        {
          valid: true,
          iban: 'JO41FOEG4372DWY6B5668WMK79WON7',
          countryCode: 'JO',
          bban: 'FOEG4372DWY6B5668WMK79WON7',
          bankIdentifier: 'FOEG',
          branchIdentifier: '4372',
        },
      ],
      [
        iban.composeIBAN('IS', '8056347571889205362285') ?? '',
        {
          valid: true,
          iban: 'IS928056347571889205362285',
          countryCode: 'IS',
          bban: '8056347571889205362285',
          accountNumber: '347571889205362285',
          bankIdentifier: '80',
          branchIdentifier: '56',
        },
      ],
      [
        'NL06-KNNF-4736-9423-47',
        {
          valid: true,
          iban: 'NL06KNNF4736942347',
          countryCode: 'NL',
          bban: 'KNNF4736942347',
          accountNumber: '4736942347',
          bankIdentifier: 'KNNF',
        },
      ],
    ])('%s', (input, expected) => {
      expect(iban.extractIBAN(input)).toEqual(expected);
    });
  });

  describe('Custom BBAN validators', () => {
    const valid = 'DE29219157744565144212';
    const rejectDE = { bbanValidators: { DE: () => false } };
    it('isValidIBAN uses the validator from the options', () => {
      expect(iban.isValidIBAN(valid)).toBe(true);
      expect(iban.isValidIBAN(valid, rejectDE)).toBe(false);
    });
    it('validateIBAN reports the national checksum error', () => {
      expect(iban.validateIBAN(valid, rejectDE)).toEqual({
        valid: false,
        errorCodes: [iban.IBANValidationError.WrongBBANChecksum],
      });
    });
    it('isValidBBAN uses the validator from the options', () => {
      expect(iban.isValidBBAN(valid.slice(4), 'DE')).toBe(true);
      expect(iban.isValidBBAN(valid.slice(4), 'DE', rejectDE)).toBe(false);
    });
    it('composeIBAN returns null when the validator rejects the BBAN', () => {
      expect(iban.composeIBAN('DE', valid.slice(4))).toBe(valid);
      expect(iban.composeIBAN('DE', valid.slice(4), rejectDE)).toBeNull();
    });
    it('a validator for another country has no effect', () => {
      expect(iban.isValidIBAN(valid, { bbanValidators: { AT: () => false } })).toBe(true);
    });
  });

  describe('When calling extraction functions with null or undefined', () => {
    it.each([null, undefined])('extractBIC(%s) should return an invalid result', (input) => {
      expect(iban.extractBIC(input).valid).toBe(false);
    });
    it.each([null, undefined])('extractIBAN(%s) should return an invalid result with an empty iban', (input) => {
      expect(iban.extractIBAN(input)).toEqual({ iban: '', valid: false });
    });
  });

  describe('isQRIBAN', () => {
    it.each<[string | null | undefined, boolean]>([
      [null, false],
      ['CH283109120L9PSR9BKOK', true],
      [iban.friendlyFormatIBAN('CH283109120L9PSR9BKOK')?.toLowerCase(), true],
      ['NL06KNNF4736942347', false],
    ])('isQRIBAN(%s)', (input, expected) => {
      expect(iban.isQRIBAN(input)).toBe(expected);
    });
  });
});

describe('isQRIBAN range', () => {
  // A Swiss IBAN whose bank clearing number (the first five BBAN digits) is the given value.
  const swiss = (clearing: string): string => iban.composeIBAN('CH', `${clearing}${'A'.repeat(12)}`) ?? '';
  it.each<[string, boolean]>([
    ['29999', false],
    ['30000', true],
    ['31999', true],
    ['32000', false],
  ])('clearing number %s', (clearing, expected) => {
    expect(iban.isQRIBAN(swiss(clearing))).toBe(expected);
  });
  it('applies to Liechtenstein but not to other countries', () => {
    expect(iban.isQRIBAN(iban.composeIBAN('LI', `30000${'A'.repeat(12)}`))).toBe(true);
    expect(iban.isQRIBAN(iban.composeIBAN('DE', `30000${'0'.repeat(13)}`))).toBe(false);
  });
});

describe('extractIBAN without identifier positions', () => {
  it('omits the fields a country does not define', () => {
    // Angola is outside the registry and has no bank, branch or account position.
    const angolan = iban.composeIBAN('AO', '1'.repeat(21)) ?? '';
    expect(iban.extractIBAN(angolan)).toEqual({ valid: true, iban: angolan, countryCode: 'AO', bban: '1'.repeat(21) });
  });
});
