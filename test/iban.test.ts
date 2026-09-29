import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('iban', () => {
  describe('When calling isValidIBAN()', () => {
    it.each<[string | null | undefined, boolean]>([
      ['NL91ABNA0417164300', true],
      ['NL91ABNA0417164300', true],
      ['NL50PSTB0000054322', true],
      ['NL91ABNA0517164300', false],
      [null, false],
      ['AT611904300234573201', true],
      ['BY13NBRB3600900000002Z00AB00', true],
      ['CR25010200009074883572', true],
      ['DE89370400440532013000', true],
      ['ES9121000418450200051332', true],
      ['ES4901825500610201630983', true],
      ['ES8350210036679521296135', false],
      ['GT82TRAJ01020000001210029690', true],
      ['HR1210010051863000160', true],
      ['IQ98NBIQ850123456789012', true],
      ['IQ98 NBIQ 8501 2345 6789 012', true],
      ['JO94CBJO0010000000000131000302', true],
      ['PS92PALS000000000400123456702', true],
      ['RS35260005601001611379', true],
      ['SV62CENR00000000000000700025', true],
      ['TL380080012345678910157', true],
      ['GL8964710001000206', true],
      ['UA213996220000026007233566001', true],
      ['VA59001123000012345678', true],
      ['SV62CENR00000000000000700025', true],
      ['RS36260005601001611379', false],
      ['TL380080012345688910157', false],
      ['GL89647100010002067', false],
      ['GB29NWBK60161331926819', true],
      ['GB2LABBY09012857201707', false],
      ['GB00HLFX11016111455365', false],
      ['EG380019000500000000263180002', true],
      ['DZ580002100001113000000570', true],
      ['AO44123412341234123412341', true],
      ['BJ83A12312341234123412341234', true],
      ['BF42BF0840101300463574000390', true],
      ['BI4210000100010000332045181', true],
      ['CM1512341234123412341234123', true],
      ['CV05123412341234123412341', true],
      ['CV64000300008885500810176', true],
      ['IR081234123412341234123412', true],
      ['CI77A12312341234123412341234', true],
      ['MG4012341234123412341234123', true],
      ['ML75A12312341234123412341234', true],
      ['MZ97123412341234123412341', true],
      ['KM4600005000010010904400137', true],
      ['TD8960002000010271091600153', true],
      ['CG3930011000101013451300019', true],
      ['GA2140021010032001890020126', true],
      ['HN54PISA00000000000000123124', true],
      ['MA64011519000001205000534921', true],
      ['NI79BAMC00000000000003123123', true],
      ['NE58NE0380100100130305000268', true],
      ['TG53TG0090604310346500400070', true],
      ['CF4220001000010120069700160', true],
      ['DJ2110002010010409943020008', true],
      ['GQ7050002001003715228190196', true],
      ['GW04GW1430010181800637601', true],
      ['SC52BAHL01031234567890123456USD', true],
      ['LY83002048000020100120361', true],
      ['SN08SN0100152000048500003035', true],
      ['SD8811123456789012', true],
      ['SO061000001123123456789', true],
      ['YE15CBYE0001018861234567891234', true],
      ['PL10105000997603123456789123', true],
      ['BE68539007547034', true],
      ['BA391290079401028494', true],
      ['BA391990440001200279', true],
      ['MK07250120000058984', true],
      ['MK07500120050057453', true],
      ['ME25505000012345678951', true],
      ['ME25907000000005800138', true],
      ['PT50002600000524218600185', true],
      ['PT50000405010020500101441', true],
      ['SI56191000000123438', true],
      ['SI56051008000032875', true],
      ['CZ6508000000192000145399', true],
      ['CZ6508000000182000145399', false],
      ['EE443300338400100007', true],
      ['EE382200221020145685', true],
      ['EE901700017000000006', true],
      ['EE975500000550008329', true],
      ['FI2112345600000785', true],
      ['FI5542345670000081', true],
      ['FI6879826661004681', true],
      ['FI0488000710574083', true],
      ['FR1420041010050500013M02606', true],
      ['FR22200410100505QZABCMGEF65', true],
      ['MC5811222000010123456789030', true],
      ['MC1112739000700011111000H79', true],
      ['HU42117730161111101800000000', true],
      ['HU51100320000122013950000249', true],
      ['HU43100320000122032850002447', true],
      ['HU90100320000160120200000000', true],
      ['MN121234123456789123', true],
      ['SK3112000000198742637541', true],
      ['RU0204452560040702810412345678901', true],
      ['NL08INGB0000000555', true],
      ['NL08INGB0012345555', false],
      ['..', false],
      ['SI94BARC102', false],
      ['CH4431999123000889012', true],
    ])('isValidIBAN(%s)', (input, expected) => {
      expect(iban.isValidIBAN(input)).toBe(expected);
    });
    it.each<[string, Readonly<iban.IBANValidationOptions>, boolean]>([
      ['CH4431999123000889012', { allowQRIBAN: false }, false],
      ['CH4431999123000889012', {}, true],
    ])('isValidIBAN(%s, %j)', (input, options, expected) => {
      expect(iban.isValidIBAN(input, options)).toBe(expected);
    });
    it.each<[string | null | undefined, boolean]>([
      ['BR6699999A03000010009795493C1', true],
      ['FK88SC123456789012', true],
      ['OM810180000001299123456', true],
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
      ['NL91 ABNA 0417 1643 00', { valid: true, errorCodes: [] }],
      ['NL91-ABNA-0417-1643-00', { valid: true, errorCodes: [] }],
      [
        'NL91 ABNA 0417 1643 00'.toLowerCase(),
        {
          valid: true,
          errorCodes: [],
        },
      ],
      [
        'SI94BARC102',
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
        'NL91ABNA0517164300',
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.WrongIBANChecksum],
        },
      ],
      [
        'XX91ABNA0517164300',
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
        'NL9ZA8NA057164300',
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
        'CH4431999123000889012',
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
        'CH4431999123000889012',
        { allowQRIBAN: false },
        {
          valid: false,
          errorCodes: [iban.IBANValidationError.QRIBANNotAllowed],
        },
      ],
      ['CH4431999123000889012', {}, { valid: true, errorCodes: [] }],
    ])('validateIBAN(%s, %j)', (input, options, expected) => {
      expect(iban.validateIBAN(input, options)).toEqual(expected);
    });

    it.each<[string | null | undefined, iban.IBANValidationResult]>([
      ['LY83002048000020100120361', { valid: true, errorCodes: [] }],
      ['RU0204452560040702810412345678901', { valid: true, errorCodes: [] }],
      ['SD8811123456789012', { valid: true, errorCodes: [] }],
      ['SO061000001123123456789', { valid: true, errorCodes: [] }],
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
      ['NL', 'ABNA0417164300', 'NL91ABNA0417164300'],
      ['ZZ', 'ABNA0417164300', null],
      ['NL', 'A7NA0417164300', null],
      ['NL', 'ABNA04171Z4300', null],
      ['NL', 'ABNA04171643000', null],
      [undefined, 'ABNA04171643000', null],
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
        'BR9700360305000010009795493P1',
        {
          valid: true,
          iban: 'BR9700360305000010009795493P1',
          countryCode: 'BR',
          bban: '00360305000010009795493P1',
          accountNumber: '0009795493P1',
          bankIdentifier: '00360305',
          branchIdentifier: '00001',
        },
      ],
      [
        'FR3330002005500000157841Z25',
        {
          valid: true,
          iban: 'FR3330002005500000157841Z25',
          countryCode: 'FR',
          bban: '30002005500000157841Z25',
          accountNumber: '0000157841Z',
          bankIdentifier: '30002',
          branchIdentifier: '00550',
        },
      ],
      [
        'SI56263300012039086',
        {
          valid: true,
          iban: 'SI56263300012039086',
          countryCode: 'SI',
          bban: '263300012039086',
          accountNumber: '00120390',
          bankIdentifier: '26',
          branchIdentifier: '330',
        },
      ],
      ['BR970036030510009795493P1', { valid: false, iban: 'BR970036030510009795493P1' }],
      [
        'NL91 ABNA 0417 1643 00',
        {
          valid: true,
          iban: 'NL91ABNA0417164300',
          countryCode: 'NL',
          bban: 'ABNA0417164300',
          accountNumber: '0417164300',
          bankIdentifier: 'ABNA',
        },
      ],
      [
        'ES6000491500051234567892',
        {
          valid: true,
          iban: 'ES6000491500051234567892',
          countryCode: 'ES',
          bban: '00491500051234567892',
          accountNumber: '1234567892',
          bankIdentifier: '0049',
          branchIdentifier: '1500',
        },
      ],
      [
        'YE15CBYE0001018861234567891234',
        {
          valid: true,
          iban: 'YE15CBYE0001018861234567891234',
          countryCode: 'YE',
          bban: 'CBYE0001018861234567891234',
          accountNumber: '018861234567891234',
          bankIdentifier: 'CBYE',
          branchIdentifier: '0001',
        },
      ],
      [
        'HN54PISA00000000000000123124',
        {
          valid: true,
          iban: 'HN54PISA00000000000000123124',
          countryCode: 'HN',
          bban: 'PISA00000000000000123124',
          accountNumber: '00000000000000123124',
          bankIdentifier: 'PISA',
        },
      ],
      [
        'JO94CBJO0010000000000131000302',
        {
          valid: true,
          iban: 'JO94CBJO0010000000000131000302',
          countryCode: 'JO',
          bban: 'CBJO0010000000000131000302',
          bankIdentifier: 'CBJO',
          branchIdentifier: '0010',
        },
      ],
      [
        iban.composeIBAN('IS', '0159260076545510730339') ?? '',
        {
          valid: true,
          iban: 'IS140159260076545510730339',
          countryCode: 'IS',
          bban: '0159260076545510730339',
          accountNumber: '260076545510730339',
          bankIdentifier: '01',
          branchIdentifier: '59',
        },
      ],
      [
        'NL91-ABNA-0417-1643-00',
        {
          valid: true,
          iban: 'NL91ABNA0417164300',
          countryCode: 'NL',
          bban: 'ABNA0417164300',
          accountNumber: '0417164300',
          bankIdentifier: 'ABNA',
        },
      ],
    ])('%s', (input, expected) => {
      expect(iban.extractIBAN(input)).toEqual(expected);
    });
  });

  describe('Custom BBAN validators', () => {
    const valid = 'DE89370400440532013000';
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
      ['CH4431999123000889012', true],
      [iban.friendlyFormatIBAN('CH4431999123000889012')?.toLowerCase(), true],
      ['NL50PSTB0000054322', false],
    ])('isQRIBAN(%s)', (input, expected) => {
      expect(iban.isQRIBAN(input)).toBe(expected);
    });
  });
});
