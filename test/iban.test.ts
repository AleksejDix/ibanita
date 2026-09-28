import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';

describe('iban', () => {
  describe('When calling isValidIBAN()', () => {
    it('with valid IBAN should return true', () => {
      expect(iban.isValidIBAN('NL91ABNA0417164300')).toBe(true);
    });
    it('with valid IBAN should return true', () => {
      expect(iban.isValidIBAN('NL91ABNA0417164300')).toBe(true);
    });
    it('with valid IBAN should return true', () => {
      expect(iban.isValidIBAN('NL50PSTB0000054322')).toBe(true);
    });
    it('with invalid IBAN should return false', () => {
      expect(iban.isValidIBAN('NL91ABNA0517164300')).toBe(false);
    });
    it('with no IBAN should return false', () => {
      expect(iban.isValidIBAN(null)).toBe(false);
    });
    it('with valid AT IBAN should return true', () => {
      expect(iban.isValidIBAN('AT611904300234573201')).toBe(true);
    });
    it('with valid BY IBAN should return true', () => {
      expect(iban.isValidIBAN('BY13NBRB3600900000002Z00AB00')).toBe(true);
    });
    it('with valid CR IBAN should return true', () => {
      expect(iban.isValidIBAN('CR25010200009074883572')).toBe(true);
    });
    it('with valid DE IBAN should return true', () => {
      expect(iban.isValidIBAN('DE89370400440532013000')).toBe(true);
    });
    it('with valid ES IBAN should return true', () => {
      expect(iban.isValidIBAN('ES9121000418450200051332')).toBe(true);
    });
    it('with valid ES IBAN should return true', () => {
      expect(iban.isValidIBAN('ES4901825500610201630983')).toBe(true);
    });
    it('with invalid ES IBAN should return false', () => {
      expect(iban.isValidIBAN('ES8350210036679521296135')).toBe(false);
    });
    it('with valid GT IBAN should return true', () => {
      expect(iban.isValidIBAN('GT82TRAJ01020000001210029690')).toBe(true);
    });
    it('with valid HR IBAN should return true', () => {
      expect(iban.isValidIBAN('HR1210010051863000160')).toBe(true);
    });
    it('with valid IQ IBAN should return true', () => {
      expect(iban.isValidIBAN('IQ98NBIQ850123456789012')).toBe(true);
    });
    it('with valid IQ IBAN with space it should return true', () => {
      expect(iban.isValidIBAN('IQ98 NBIQ 8501 2345 6789 012')).toBe(true);
    });
    it('with valid JO IBAN should return true', () => {
      expect(iban.isValidIBAN('JO94CBJO0010000000000131000302')).toBe(true);
    });
    it('with valid PA IBAN should return true', () => {
      expect(iban.isValidIBAN('PS92PALS000000000400123456702')).toBe(true);
    });
    it('with valid RS IBAN should return true', () => {
      expect(iban.isValidIBAN('RS35260005601001611379')).toBe(true);
    });
    it('with valid SV IBAN should return true', () => {
      expect(iban.isValidIBAN('SV62CENR00000000000000700025')).toBe(true);
    });
    it('with valid TL IBAN should return true', () => {
      expect(iban.isValidIBAN('TL380080012345678910157')).toBe(true);
    });
    it('with valid GL IBAN should return true', () => {
      expect(iban.isValidIBAN('GL8964710001000206')).toBe(true);
    });
    it('with valid UA IBAN should return true', () => {
      expect(iban.isValidIBAN('UA213996220000026007233566001')).toBe(true);
    });
    it('with valid VA IBAN should return true', () => {
      expect(iban.isValidIBAN('VA59001123000012345678')).toBe(true);
    });
    it('with valid SV IBAN should return true', () => {
      expect(iban.isValidIBAN('SV62CENR00000000000000700025')).toBe(true);
    });
    it('with invalid RS IBAN should return false', () => {
      expect(iban.isValidIBAN('RS36260005601001611379')).toBe(false);
    });
    it('with invalid TL IBAN should return false', () => {
      expect(iban.isValidIBAN('TL380080012345688910157')).toBe(false);
    });
    it('with invalid GL IBAN should return false', () => {
      expect(iban.isValidIBAN('GL89647100010002067')).toBe(false);
    });
    it('with valid GB IBAN should return true', () => {
      expect(iban.isValidIBAN('GB29NWBK60161331926819')).toBe(true);
    });
    it('with invalid GB IBAN should return false', () => {
      expect(iban.isValidIBAN('GB2LABBY09012857201707')).toBe(false);
    });
    it('with invalid GB IBAN should return false', () => {
      expect(iban.isValidIBAN('GB00HLFX11016111455365')).toBe(false);
    });
    it('with valid Egypt IBAN should return true', () => {
      expect(iban.isValidIBAN('EG380019000500000000263180002')).toBe(true);
    });
    it('with valid Algeria IBAN should return true', () => {
      expect(iban.isValidIBAN('DZ580002100001113000000570')).toBe(true);
    });
    it('with valid Angola IBAN should return true', () => {
      expect(iban.isValidIBAN('AO44123412341234123412341')).toBe(true);
    });
    it('with valid Benin IBAN should return true', () => {
      expect(iban.isValidIBAN('BJ83A12312341234123412341234')).toBe(true);
    });
    it('with valid Burkina Faso IBAN should return true', () => {
      expect(iban.isValidIBAN('BF42BF0840101300463574000390')).toBe(true);
    });
    it('with valid Burundi IBAN should return true', () => {
      expect(iban.isValidIBAN('BI4210000100010000332045181')).toBe(true);
    });
    it('with valid Cameroon IBAN should return true', () => {
      expect(iban.isValidIBAN('CM1512341234123412341234123')).toBe(true);
    });
    it('with valid Cape Verde IBAN should return true', () => {
      expect(iban.isValidIBAN('CV05123412341234123412341')).toBe(true);
    });
    it('with valid Cape Verde IBAN should return true (2)', () => {
      expect(iban.isValidIBAN('CV64000300008885500810176')).toBe(true);
    });
    it('with valid Iran IBAN should return true', () => {
      expect(iban.isValidIBAN('IR081234123412341234123412')).toBe(true);
    });
    it('with valid Ivory Coast IBAN should return true', () => {
      expect(iban.isValidIBAN('CI77A12312341234123412341234')).toBe(true);
    });
    it('with valid Madagaskar IBAN should return true', () => {
      expect(iban.isValidIBAN('MG4012341234123412341234123')).toBe(true);
    });
    it('with valid Mali IBAN should return true', () => {
      expect(iban.isValidIBAN('ML75A12312341234123412341234')).toBe(true);
    });
    it('with valid Mozambique IBAN should return true', () => {
      expect(iban.isValidIBAN('MZ97123412341234123412341')).toBe(true);
    });
    it('with valid Comoros IBAN should return true', () => {
      expect(iban.isValidIBAN('KM4600005000010010904400137')).toBe(true);
    });
    it('with valid Chad IBAN should return true', () => {
      expect(iban.isValidIBAN('TD8960002000010271091600153')).toBe(true);
    });
    it('with valid Congo IBAN should return true', () => {
      expect(iban.isValidIBAN('CG3930011000101013451300019')).toBe(true);
    });
    it('with valid Gabon IBAN should return true', () => {
      expect(iban.isValidIBAN('GA2140021010032001890020126')).toBe(true);
    });
    it('with valid Honduras IBAN should return true', () => {
      expect(iban.isValidIBAN('HN54PISA00000000000000123124')).toBe(true);
    });
    it('with valid Marocco IBAN should return true', () => {
      expect(iban.isValidIBAN('MA64011519000001205000534921')).toBe(true);
    });
    it('with valid Nicaragua IBAN should return true', () => {
      expect(iban.isValidIBAN('NI79BAMC00000000000003123123')).toBe(true);
    });
    it('with valid Niger IBAN should return true', () => {
      expect(iban.isValidIBAN('NE58NE0380100100130305000268')).toBe(true);
    });
    it('with valid Togo IBAN should return true', () => {
      expect(iban.isValidIBAN('TG53TG0090604310346500400070')).toBe(true);
    });
    it('with valid Central African Republic IBAN should return true', () => {
      expect(iban.isValidIBAN('CF4220001000010120069700160')).toBe(true);
    });
    it('with valid Djibouti IBAN should return true', () => {
      expect(iban.isValidIBAN('DJ2110002010010409943020008')).toBe(true);
    });
    it('with valid Equatorial Guinea IBAN should return true', () => {
      expect(iban.isValidIBAN('GQ7050002001003715228190196')).toBe(true);
    });
    it('with valid Guinea-Bissau IBAN should return true', () => {
      expect(iban.isValidIBAN('GW04GW1430010181800637601')).toBe(true);
    });
    it('with valid Seychelles IBAN should return true', () => {
      expect(iban.isValidIBAN('SC52BAHL01031234567890123456USD')).toBe(true);
    });
    it('with valid Libya IBAN should return true', () => {
      expect(iban.isValidIBAN('LY83002048000020100120361')).toBe(true);
    });
    it('with valid Senegal IBAN should return true', () => {
      expect(iban.isValidIBAN('SN08SN0100152000048500003035')).toBe(true);
    });
    it('with valid Sudan IBAN should return true', () => {
      expect(iban.isValidIBAN('SD8811123456789012')).toBe(true);
    });
    it('with valid Somalian IBAN should return true', () => {
      expect(iban.isValidIBAN('SO061000001123123456789')).toBe(true);
    });
    it('with valid Yemen IBAN should return true', () => {
      expect(iban.isValidIBAN('YE15CBYE0001018861234567891234')).toBe(true);
    });
    it('with valid Poland IBAN should return true', () => {
      expect(iban.isValidIBAN('PL10105000997603123456789123')).toBe(true);
    });
    it('with valid Belgian IBAN should return true', () => {
      expect(iban.isValidIBAN('BE68539007547034')).toBe(true);
    });
    it('with valid BA IBAN should return true', () => {
      expect(iban.isValidIBAN('BA391290079401028494')).toBe(true);
    });
    it('with valid BA IBAN should return true', () => {
      expect(iban.isValidIBAN('BA391990440001200279')).toBe(true);
    });
    it('with valid MK IBAN should return true', () => {
      expect(iban.isValidIBAN('MK07250120000058984')).toBe(true);
    });
    it('with valid MK IBAN should return true', () => {
      expect(iban.isValidIBAN('MK07500120050057453')).toBe(true);
    });
    it('with valid ME IBAN should return true', () => {
      expect(iban.isValidIBAN('ME25505000012345678951')).toBe(true);
    });
    it('with valid ME IBAN should return true', () => {
      expect(iban.isValidIBAN('ME25907000000005800138')).toBe(true);
    });
    it('with valid PT IBAN should return true', () => {
      expect(iban.isValidIBAN('PT50002600000524218600185')).toBe(true);
    });
    it('with valid PT IBAN should return true', () => {
      expect(iban.isValidIBAN('PT50000405010020500101441')).toBe(true);
    });
    it('with valid SI IBAN should return true', () => {
      expect(iban.isValidIBAN('SI56191000000123438')).toBe(true);
    });
    it('with valid SI IBAN should return true', () => {
      expect(iban.isValidIBAN('SI56051008000032875')).toBe(true);
    });
    it('with valid CZ IBAN should return true', () => {
      expect(iban.isValidIBAN('CZ6508000000192000145399')).toBe(true);
    });
    it('with invalid CZ IBAN should return false', () => {
      expect(iban.isValidIBAN('CZ6508000000182000145399')).toBe(false);
    });
    it('with valid EE IBAN should return true', () => {
      expect(iban.isValidIBAN('EE443300338400100007')).toBe(true);
    });
    it('with valid EE IBAN should return true', () => {
      expect(iban.isValidIBAN('EE382200221020145685')).toBe(true);
    });
    it('with valid EE IBAN should return true', () => {
      expect(iban.isValidIBAN('EE901700017000000006')).toBe(true);
    });
    it('with valid EE IBAN should return true', () => {
      expect(iban.isValidIBAN('EE975500000550008329')).toBe(true);
    });
    it('with valid FI IBAN should return true', () => {
      expect(iban.isValidIBAN('FI2112345600000785')).toBe(true);
    });
    it('with valid FI IBAN should return true', () => {
      expect(iban.isValidIBAN('FI5542345670000081')).toBe(true);
    });
    it('with valid FI IBAN should return true', () => {
      expect(iban.isValidIBAN('FI6879826661004681')).toBe(true);
    });
    it('with valid FI IBAN should return true', () => {
      expect(iban.isValidIBAN('FI0488000710574083')).toBe(true);
    });
    it('with valid FR IBAN should return true', () => {
      expect(iban.isValidIBAN('FR1420041010050500013M02606')).toBe(true);
    });
    it('with valid FR IBAN should return true', () => {
      expect(iban.isValidIBAN('FR22200410100505QZABCMGEF65')).toBe(true);
    });
    it('with valid MC IBAN should return true', () => {
      expect(iban.isValidIBAN('MC5811222000010123456789030')).toBe(true);
    });
    it('with valid MC IBAN should return true', () => {
      expect(iban.isValidIBAN('MC1112739000700011111000H79')).toBe(true);
    });
    it('with valid HU IBAN should return true', () => {
      expect(iban.isValidIBAN('HU42117730161111101800000000')).toBe(true);
    });
    it('with valid HU IBAN should return true', () => {
      expect(iban.isValidIBAN('HU51100320000122013950000249')).toBe(true);
    });
    it('with valid HU IBAN should return true', () => {
      expect(iban.isValidIBAN('HU43100320000122032850002447')).toBe(true);
    });
    it('with valid HU IBAN should return true', () => {
      expect(iban.isValidIBAN('HU90100320000160120200000000')).toBe(true);
    });
    it('with valid MN IBAN should return true', () => {
      expect(iban.isValidIBAN('MN121234123456789123')).toBe(true);
    });
    it('with valid SK IBAN should return true', () => {
      expect(iban.isValidIBAN('SK3112000000198742637541')).toBe(true);
    });
    it('with valid RU IBAN should return true', () => {
      expect(iban.isValidIBAN('RU0204452560040702810412345678901')).toBe(true);
    });
    it('with valid old Postbank Dutch IBAN should return true', () => {
      expect(iban.isValidIBAN('NL08INGB0000000555')).toBe(true);
    });
    it('with invalid Dutch IBAN should return false', () => {
      expect(iban.isValidIBAN('NL08INGB0012345555')).toBe(false);
    });
    it('with two dots should return false', () => {
      expect(iban.isValidIBAN('..')).toBe(false);
    });
    it('with too short IBAN should return false', () => {
      expect(iban.isValidIBAN('SI94BARC102')).toBe(false);
    });
    it('allows QR-IBAN by default', () => {
      expect(iban.isValidIBAN('CH4431999123000889012')).toBe(true);
    });
    it('does not allows QR-IBAN when requested to do so', () => {
      expect(iban.isValidIBAN('CH4431999123000889012', { allowQRIBAN: false })).toBe(false);
    });
    it('allows QR-IBAN with an empty options object', () => {
      expect(iban.isValidIBAN('CH4431999123000889012', {})).toBe(true);
    });
    it('with valid BR IBAN with alphanumeric bank code should return true', () => {
      expect(iban.isValidIBAN('BR6699999A03000010009795493C1')).toBe(true);
    });
    it('with valid FK IBAN should return true', () => {
      expect(iban.isValidIBAN('FK88SC123456789012')).toBe(true);
    });
    it('with valid OM IBAN should return true', () => {
      expect(iban.isValidIBAN('OM810180000001299123456')).toBe(true);
    });
  });

  describe('When calling validateIBAN()', () => {
    it('with null IBAN should return false', () => {
      expect(iban.validateIBAN(null)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.NoIBANProvided],
      });
    });

    it('with empty IBAN should return false', () => {
      expect(iban.validateIBAN('')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.NoIBANProvided],
      });
    });

    it('with two dots instead of IBAN should return false', () => {
      expect(iban.validateIBAN('..')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.NoIBANCountry],
      });
    });

    it('with valid IBAN separated with spaces returns true', () => {
      expect(iban.validateIBAN('NL91 ABNA 0417 1643 00')).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid IBAN separated with dashes returns true', () => {
      expect(iban.validateIBAN('NL91-ABNA-0417-1643-00')).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid lowercase IBAN returns true', () => {
      expect(iban.validateIBAN('NL91 ABNA 0417 1643 00'.toLowerCase())).toEqual({
        valid: true,
        errorCodes: [],
      });
    });

    it('with too short IBAN should return false', () => {
      expect(iban.validateIBAN('SI94BARC102')).toEqual({
        valid: false,
        errorCodes: [
          iban.ValidationErrorsIBAN.WrongIBANLength,
          iban.ValidationErrorsIBAN.WrongBBANFormat,
          iban.ValidationErrorsIBAN.WrongIBANChecksum,
        ],
      });
    });

    it('with undefined IBAN should return false', () => {
      expect(iban.validateIBAN(undefined)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.NoIBANProvided],
      });
    });

    it('with invalid IBAN checksum should return false with correct code', () => {
      expect(iban.validateIBAN('NL91ABNA0517164300')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.WrongIBANChecksum],
      });
    });

    it('with invalid IBAN country should return false with error codes', () => {
      expect(iban.validateIBAN('XX91ABNA0517164300')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.NoIBANCountry],
      });
    });

    it('with country code only should return false with wrong code', () => {
      expect(iban.validateIBAN('NL')).toEqual({
        valid: false,
        errorCodes: [
          iban.ValidationErrorsIBAN.WrongIBANLength,
          iban.ValidationErrorsIBAN.WrongBBANFormat,
          iban.ValidationErrorsIBAN.CheckDigitsNotNumeric,
          iban.ValidationErrorsIBAN.WrongIBANChecksum,
        ],
      });
    });

    it('with invalid IBAN should return multiple error codes', () => {
      expect(iban.validateIBAN('NL9ZA8NA057164300')).toEqual({
        valid: false,
        errorCodes: [
          iban.ValidationErrorsIBAN.WrongIBANLength,
          iban.ValidationErrorsIBAN.WrongBBANFormat,
          iban.ValidationErrorsIBAN.CheckDigitsNotNumeric,
          iban.ValidationErrorsIBAN.WrongIBANChecksum,
        ],
      });
    });

    it('allows QR-IBAN by default', () => {
      expect(iban.validateIBAN('CH4431999123000889012')).toEqual({
        valid: true,
        errorCodes: [],
      });
    });

    it('does not allows QR-IBAN when requested to do so', () => {
      expect(iban.validateIBAN('CH4431999123000889012', { allowQRIBAN: false })).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.QRIBANNotAllowed],
      });
    });

    it('allows QR-IBAN with an empty options object', () => {
      expect(iban.validateIBAN('CH4431999123000889012', {})).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid Libya IBAN should return true', () => {
      expect(iban.validateIBAN('LY83002048000020100120361')).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid Russian IBAN should return true', () => {
      expect(iban.validateIBAN('RU0204452560040702810412345678901')).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid Sudanese IBAN should return true', () => {
      expect(iban.validateIBAN('SD8811123456789012')).toEqual({ valid: true, errorCodes: [] });
    });

    it('with valid Somalian IBAN should return true', () => {
      expect(iban.validateIBAN('SO061000001123123456789')).toEqual({ valid: true, errorCodes: [] });
    });
  });

  describe('When calling validateIBAN() with CZ IBAN failing account checksum', () => {
    it('should return account checksum error', () => {
      expect(iban.validateIBAN('CZ6208000000610000000000')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsIBAN.WrongAccountBankBranchChecksum],
      });
    });
  });

  describe('When calling composeIBAN()', () => {
    it('with valid country code and valid BBAN should return NL91ABNA0417164300', () => {
      expect(iban.composeIBAN('NL', 'ABNA0417164300')).toBe('NL91ABNA0417164300');
    });
    it('with invalid country code and valid BBAN should return null', () => {
      expect(iban.composeIBAN('ZZ', 'ABNA0417164300')).toBeNull();
    });
    it('with valid country code and invalid BBAN (non-alpha character) should return null', () => {
      expect(iban.composeIBAN('NL', 'A7NA0417164300')).toBeNull();
    });
    it('with valid country code and invalid BBAN (non-numeric character) should return null', () => {
      expect(iban.composeIBAN('NL', 'ABNA04171Z4300')).toBeNull();
    });
    it('with valid country code and invalid BBAN (character count wrong) should return null', () => {
      expect(iban.composeIBAN('NL', 'ABNA04171643000')).toBeNull();
    });
    it('without country codeshould return null', () => {
      expect(iban.composeIBAN(undefined, 'ABNA04171643000')).toBeNull();
    });
    it('with BBAN failing country checksum should return null', () => {
      expect(iban.composeIBAN('NO', '86011117948')).toBeNull();
    });
    it('with BBAN passing country checksum should return IBAN', () => {
      expect(iban.composeIBAN('NO', '86011117947')).toBe('NO9386011117947');
    });
    it('with BY BBAN with digit in bank code should return IBAN', () => {
      expect(iban.composeIBAN('BY', '1BRB3600900000002Z00AB00')).not.toBeNull();
    });
    it('with IE BBAN with digit in bank code should return null', () => {
      expect(iban.composeIBAN('IE', 'AIB193115212345678')).toBeNull();
    });
    it('with valid country code and no BBAN should return null', () => {
      expect(iban.composeIBAN('NL', null)).toBeNull();
    });
  });

  describe('extractIBAN()', () => {
    it.each<[string, iban.ExtractIBANResult]>([
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
        errorCodes: [iban.ValidationErrorsIBAN.WrongAccountBankBranchChecksum],
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
    it('should return false for null', () => {
      expect(iban.isQRIBAN(null)).toBe(false);
    });
    it('should return true', () => {
      expect(iban.isQRIBAN('CH4431999123000889012')).toBe(true);
    });
    it('normalises spaces and case', () => {
      expect(iban.isQRIBAN(iban.friendlyFormatIBAN('CH4431999123000889012')?.toLowerCase())).toBe(true);
    });
    it('should return false', () => {
      expect(iban.isQRIBAN('NL50PSTB0000054322')).toBe(false);
    });
  });
});
