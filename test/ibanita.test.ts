import * as iban from '../src/index';
import { describe, expect, it } from 'vitest';
import { COUNTRY_CODES } from '../src/countries/codes';
import { ibanSpecs } from '../src/countries/specs';
import { mod9710 } from '../src/core/checksum';

describe('IBANTools', () => {
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
          iban.ValidationErrorsIBAN.WrongBBANLength,
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
          iban.ValidationErrorsIBAN.WrongBBANLength,
          iban.ValidationErrorsIBAN.WrongBBANFormat,
          iban.ValidationErrorsIBAN.ChecksumNotNumber,
          iban.ValidationErrorsIBAN.WrongIBANChecksum,
        ],
      });
    });

    it('with invalid IBAN should return multiple error codes', () => {
      expect(iban.validateIBAN('NL9ZA8NA057164300')).toEqual({
        valid: false,
        errorCodes: [
          iban.ValidationErrorsIBAN.WrongBBANLength,
          iban.ValidationErrorsIBAN.WrongBBANFormat,
          iban.ValidationErrorsIBAN.ChecksumNotNumber,
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

  describe('When calling mod9710() with non-numeric input', () => {
    it('should return NaN', () => {
      expect(mod9710('AB1234')).toBeNaN();
    });
  });

  describe('When calling isValidBIC()', () => {
    it('with valid BIC ABNANL2A should return true', () => {
      expect(iban.isValidBIC('ABNANL2A')).toBe(true);
    });
    it('with valid BIC ABNANL2A000 should return true', () => {
      expect(iban.isValidBIC('ABNANL2A000')).toBe(true);
    });
    it('with valid BIC ABNANL2AXXX should return true', () => {
      expect(iban.isValidBIC('ABNANL2AXXX')).toBe(true);
    });
    it('with valid BIC ABNAAA2AXXX should return true', () => {
      expect(iban.isValidBIC('ABNAAA2AXXX')).toBe(false);
    });
    it('with valid BIC NOLADE21KI should return true', () => {
      expect(iban.isValidBIC('NOLADE21KIE')).toBe(true);
    });
    it('with valid BIC INGDDEFFXXX should return true', () => {
      expect(iban.isValidBIC('INGDDEFFXXX')).toBe(true);
    });
    it('with invalid BIC INGDEFFXXX should return false', () => {
      expect(iban.isValidBIC('INGDEFFXXX')).toBe(false);
    });
    it('with invalid BIC ABN4NL2A should return false', () => {
      expect(iban.isValidBIC('ABN4NL2A')).toBe(false);
    });
    it('with invalid BIC ABNANL2A01F should return true', () => {
      expect(iban.isValidBIC('ABNANL2A01F')).toBe(true);
    });
    it('with invalid BIC `null` should return false', () => {
      expect(iban.isValidBIC(null)).toBe(false);
    });
    it('with invalid BIC `undefined` should return false', () => {
      expect(iban.isValidBIC(undefined)).toBe(false);
    });
    it('with invalid BIC ABNAXX2A should return false', () => {
      expect(iban.isValidBIC('ABNAXX2A')).toBe(false);
    });
  });

  describe('When calling validateBIC()', () => {
    it('with null BIC should return false', () => {
      expect(iban.validateBIC(null)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with empty BIC should return false', () => {
      expect(iban.validateBIC('')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with undefined BIC should return false', () => {
      expect(iban.validateBIC(undefined)).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICProvided],
      });
    });

    it('with invalid BIC should return false with correct code', () => {
      expect(iban.validateBIC('ABN4NL2A')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.WrongBICFormat],
      });
    });

    it('with invalid BIC country should return false with correct code', () => {
      expect(iban.validateBIC('ABNAXX2A')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.NoBICCountry],
      });
    });

    it('with too short BIC should return false with format code', () => {
      expect(iban.validateBIC('AB')).toEqual({
        valid: false,
        errorCodes: [iban.ValidationErrorsBIC.WrongBICFormat],
      });
    });

    it('with valid BIC should return true', () => {
      expect(iban.validateBIC('ABNANL2A')).toEqual({ valid: true, errorCodes: [] });
    });
  });

  describe('When calling getCountrySpecifications()', () => {
    const specs = iban.getCountrySpecifications();
    it.each(['BI', 'DJ', 'FK'])('%s should be in IBAN registry', (code) => {
      expect(specs[code]?.IBANRegistry).toBe(true);
    });
    it.each(['EG', 'VA'])('%s BBAN regexp should reject extra characters', (code) => {
      expect(new RegExp(specs[code]?.bban_regexp ?? '', 'u').test('0'.repeat(30))).toBe(false);
    });
  });

  describe('When calling isSEPACountry()', () => {
    it('with valid country code NL should return true', () => {
      expect(iban.isSEPACountry('NL')).toBe(true);
    });
    it('with undefined country code should return false', () => {
      expect(iban.isSEPACountry(undefined)).toBe(false);
    });
    it('with valid country code PK return false', () => {
      expect(iban.isSEPACountry('PK')).toBe(false);
    });
    it('with non valid country code XX return false', () => {
      expect(iban.isSEPACountry('XX')).toBe(false);
    });
  });

  describe('When calling extractBIC() with valid BIC ABNANL2A', () => {
    const ext = iban.extractBIC('ABNANL2A');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('bankCode should be ABNA', () => {
      expect(ext.bankCode).toBe('ABNA');
    });
    it('countryCode should be NL', () => {
      expect(ext.countryCode).toBe('NL');
    });
    it('locationCode should be 2A', () => {
      expect(ext.locationCode).toBe('2A');
    });
    it('testBIC should be false', () => {
      expect(ext.testBIC).toBe(false);
    });
    it('branchCode should be null', () => {
      expect(ext.branchCode).toBe(null);
    });
  });

  describe('When calling extractBIC() with lowercase BIC dnbanokk', () => {
    const ext = iban.extractBIC('dnbanokk');
    it('countryCode should be NO', () => {
      expect(ext.countryCode).toBe('NO');
    });
  });

  describe('When calling extractBIC() with invalid BIC ABN7NL2A', () => {
    const ext = iban.extractBIC('ABN7NL2A');
    it('valid should be false', () => {
      expect(ext.valid).toBe(false);
    });
    it('bankCode should be undefined', () => {
      expect(ext.bankCode).toBeUndefined();
    });
    it('countryCode should be undefined', () => {
      expect(ext.countryCode).toBeUndefined();
    });
    it('locationCode should be undefined', () => {
      expect(ext.locationCode).toBeUndefined();
    });
    it('testBIC should be undefined', () => {
      expect(ext.testBIC).toBeUndefined();
    });
    it('branchCode should be undefined', () => {
      expect(ext.branchCode).toBeUndefined();
    });
  });

  describe('When calling extractBIC() with valid BIC NEDSZAJ0XXX', () => {
    const ext = iban.extractBIC('NEDSZAJ0XXX');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('bankCode should be NEDS', () => {
      expect(ext.bankCode).toBe('NEDS');
    });
    it('countryCode should be ZA', () => {
      expect(ext.countryCode).toBe('ZA');
    });
    it('locationCode should be J0', () => {
      expect(ext.locationCode).toBe('J0');
    });
    it('testBIC should be true', () => {
      expect(ext.testBIC).toBe(true);
    });
    it('branchCode should be XXX', () => {
      expect(ext.branchCode).toBe('XXX');
    });
  });

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

  describe('When calling composeIBAN()', () => {
    it('with valid country code and valid BBAN should return NL91ABNA0417164300', () => {
      expect(iban.composeIBAN({ countryCode: 'NL', bban: 'ABNA0417164300' })).toBe('NL91ABNA0417164300');
    });
    it('with invalid country code and valid BBAN should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'ZZ', bban: 'ABNA0417164300' })).toBeNull();
    });
    it('with valid country code and invalid BBAN (non-alpha character) should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'NL', bban: 'A7NA0417164300' })).toBeNull();
    });
    it('with valid country code and invalid BBAN (non-numeric character) should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'NL', bban: 'ABNA04171Z4300' })).toBeNull();
    });
    it('with valid country code and invalid BBAN (character count wrong) should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'NL', bban: 'ABNA04171643000' })).toBeNull();
    });
    it('without country codeshould return null', () => {
      expect(iban.composeIBAN({ bban: 'ABNA04171643000' })).toBeNull();
    });
    it('with BBAN failing country checksum should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'NO', bban: '86011117948' })).toBeNull();
    });
    it('with BBAN passing country checksum should return IBAN', () => {
      expect(iban.composeIBAN({ countryCode: 'NO', bban: '86011117947' })).toBe('NO9386011117947');
    });
    it('with BY BBAN with digit in bank code should return IBAN', () => {
      expect(iban.composeIBAN({ countryCode: 'BY', bban: '1BRB3600900000002Z00AB00' })).not.toBeNull();
    });
    it('with IE BBAN with digit in bank code should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'IE', bban: 'AIB193115212345678' })).toBeNull();
    });
    it('with valid country code and no BBAN should return null', () => {
      expect(iban.composeIBAN({ countryCode: 'NL', bban: null })).toBeNull();
    });
  });

  describe('When calling extractIBAN() with valid Brazilian IBAN', () => {
    const ext = iban.extractIBAN('BR9700360305000010009795493P1');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be BR9700360305000010009795493P1', () => {
      expect(ext.iban).toBe('BR9700360305000010009795493P1');
    });
    it('BBAN should be 00360305000010009795493P1', () => {
      expect(ext.bban).toBe('00360305000010009795493P1');
    });
    it('countryCode should be BR', () => {
      expect(ext.countryCode).toBe('BR');
    });
    it('accountNumber should be 0009795493P1', () => {
      expect(ext.accountNumber).toBe('0009795493P1');
    });
    it('bankIdentifier should be 00360305', () => {
      expect(ext.bankIdentifier).toBe('00360305');
    });
    it('branchIdentifier should be 00001', () => {
      expect(ext.branchIdentifier).toBe('00001');
    });
  });

  describe('When calling extractIBAN() with valid French IBAN', () => {
    const ext = iban.extractIBAN('FR3330002005500000157841Z25');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be FR3330002005500000157841Z25', () => {
      expect(ext.iban).toBe('FR3330002005500000157841Z25');
    });
    it('BBAN should be 30002005500000157841Z25', () => {
      expect(ext.bban).toBe('30002005500000157841Z25');
    });
    it('countryCode should be FR', () => {
      expect(ext.countryCode).toBe('FR');
    });
    it('accountNumber should be 0000157841Z', () => {
      expect(ext.accountNumber).toBe('0000157841Z');
    });
    it('bankIdentifier should be 30002', () => {
      expect(ext.bankIdentifier).toBe('30002');
    });
    it('branchIdentifier should be 00550', () => {
      expect(ext.branchIdentifier).toBe('00550');
    });
  });

  describe('When calling extractIBAN() with valid Slovenian IBAN', () => {
    const ext = iban.extractIBAN('SI56263300012039086');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be SI56263300012039086', () => {
      expect(ext.iban).toBe('SI56263300012039086');
    });
    it('BBAN should be 263300012039086', () => {
      expect(ext.bban).toBe('263300012039086');
    });
    it('countryCode should be SI', () => {
      expect(ext.countryCode).toBe('SI');
    });
    it('accountNumber should be 00120390', () => {
      expect(ext.accountNumber).toBe('00120390');
    });
    it('bankIdentifier should be 26', () => {
      expect(ext.bankIdentifier).toBe('26');
    });
    it('branchIdentifier should be 330', () => {
      expect(ext.branchIdentifier).toBe('330');
    });
  });

  describe('When calling extractIBAN() with invalid IBAN', () => {
    const ext = iban.extractIBAN('BR970036030510009795493P1');
    it('valid should be false', () => {
      expect(ext.valid).toBe(false);
    });
    it('IBAN should be BR9700360305100019795493P1', () => {
      expect(ext.iban).toBe('BR970036030510009795493P1');
    });
    it('BBAN should be undefined', () => {
      expect(ext.bban).toBeUndefined();
    });
    it('countryCode should be undefined', () => {
      expect(ext.countryCode).toBeUndefined();
    });
  });

  describe('When calling extractIBAN() with space separated IBAN', () => {
    const ext = iban.extractIBAN('NL91 ABNA 0417 1643 00');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });

    it('IBAN should be NL91ABNA0417164300', () => {
      expect(ext.iban).toBe('NL91ABNA0417164300');
    });

    it('BBAN should be ABNA0417164300', () => {
      expect(ext.bban).toBe('ABNA0417164300');
    });
    it('countryCode should be NL', () => {
      expect(ext.countryCode).toBe('NL');
    });
    it('accountNumber should be 0417164300', () => {
      expect(ext.accountNumber).toBe('0417164300');
    });
  });

  describe('When calling extractIBAN() with valid Spanish IBAN', () => {
    const ext = iban.extractIBAN('ES6000491500051234567892');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be ES6000491500051234567892', () => {
      expect(ext.iban).toBe('ES6000491500051234567892');
    });
    it('BBAN should be 00491500051234567892', () => {
      expect(ext.bban).toBe('00491500051234567892');
    });
    it('countryCode should be ES', () => {
      expect(ext.countryCode).toBe('ES');
    });
    it('accountNumber should be 1234567892', () => {
      expect(ext.accountNumber).toBe('1234567892');
    });
    it('bankIdentifier should be 0049', () => {
      expect(ext.bankIdentifier).toBe('0049');
    });
    it('branchIdentifier should be 1500', () => {
      expect(ext.branchIdentifier).toBe('1500');
    });
  });

  describe('When calling extractIBAN() with valid Yemen IBAN', () => {
    const ext = iban.extractIBAN('YE15CBYE0001018861234567891234');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be YE15CBYE0001018861234567891234', () => {
      expect(ext.iban).toBe('YE15CBYE0001018861234567891234');
    });
    it('BBAN should be CBYE0001018861234567891234', () => {
      expect(ext.bban).toBe('CBYE0001018861234567891234');
    });
    it('countryCode should be YE', () => {
      expect(ext.countryCode).toBe('YE');
    });
    it('accountNumber should be 018861234567891234', () => {
      expect(ext.accountNumber).toBe('018861234567891234');
    });
    it('bankIdentifier should be CBYE', () => {
      expect(ext.bankIdentifier).toBe('CBYE');
    });
    it('branchIdentifier should be 0001', () => {
      expect(ext.branchIdentifier).toBe('0001');
    });
  });

  describe('When calling extractIBAN() with valid Honduras IBAN', () => {
    const ext = iban.extractIBAN('HN54PISA00000000000000123124');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be HN54PISA00000000000000123124', () => {
      expect(ext.iban).toBe('HN54PISA00000000000000123124');
    });
    it('BBAN should be PISA00000000000000123124', () => {
      expect(ext.bban).toBe('PISA00000000000000123124');
    });
    it('countryCode should be HN', () => {
      expect(ext.countryCode).toBe('HN');
    });
    it('accountNumber should be 00000000000000123124', () => {
      expect(ext.accountNumber).toBe('00000000000000123124');
    });
    it('bankIdentifier should be PISA', () => {
      expect(ext.bankIdentifier).toBe('PISA');
    });
  });

  describe('When calling extractIBAN() with valid Jordan IBAN', () => {
    const ext = iban.extractIBAN('JO94CBJO0010000000000131000302');
    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });
    it('IBAN should be JO94CBJO0010000000000131000302', () => {
      expect(ext.iban).toBe('JO94CBJO0010000000000131000302');
    });
    it('BBAN should be CBJO0010000000000131000302', () => {
      expect(ext.bban).toBe('CBJO0010000000000131000302');
    });
    it('countryCode should be JO', () => {
      expect(ext.countryCode).toBe('JO');
    });
    it('bankIdentifier should be CBJO', () => {
      expect(ext.bankIdentifier).toBe('CBJO');
    });
    it('branchIdentifier should be 0010', () => {
      expect(ext.branchIdentifier).toBe('0010');
    });
  });

  describe('When calling extractIBAN() with Icelandic IBAN', () => {
    it('should extract bank, branch and account', () => {
      const ext = iban.extractIBAN(iban.composeIBAN({ countryCode: 'IS', bban: '0159260076545510730339' }) ?? '');
      expect(ext.bankIdentifier).toBe('01');
      expect(ext.branchIdentifier).toBe('59');
      expect(ext.accountNumber).toBe('260076545510730339');
    });
  });

  describe('Country code list', () => {
    it.each(Object.keys(ibanSpecs))('should contain IBAN country %s', (code) => {
      expect(COUNTRY_CODES.has(code)).toBe(true);
    });
  });

  describe('Country spec account positions', () => {
    // RU is excluded: its registry "branch" is the first part of the 20-digit account number.
    const codes = Object.keys(iban.countrySpecs).filter(
      (code) => code !== 'RU' && iban.countrySpecs[code]?.account_indentifier !== undefined,
    );
    it.each(codes)('%s account range should follow bank and branch and fit the IBAN', (code) => {
      const spec = iban.countrySpecs[code] ?? {};
      const [start, end] = spec.account_indentifier ?? [0, 0];
      const identifierEnds = [spec.bank_identifier, spec.branch_indentifier].map((range) =>
        range === undefined ? 3 : range[1] + 4,
      );
      expect(start).toBeGreaterThan(Math.max(...identifierEnds));
      expect(end).toBeLessThanOrEqual(spec.chars ?? 0);
    });
  });

  describe('When calling extractIBAN() with dash separated IBAN', () => {
    const ext = iban.extractIBAN('NL91-ABNA-0417-1643-00');

    it('valid should be true', () => {
      expect(ext.valid).toBe(true);
    });

    it('IBAN should be NL91ABNA0417164300', () => {
      expect(ext.iban).toBe('NL91ABNA0417164300');
    });

    it('BBAN should be ABNA0417164300', () => {
      expect(ext.bban).toBe('ABNA0417164300');
    });
    it('countryCode should be NL', () => {
      expect(ext.countryCode).toBe('NL');
    });
  });

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
    it('returns null when undefined is provided', () => {
      expect(iban.friendlyFormatIBAN(undefined)).toBeNull();
    });
    it('returns null when null is provided', () => {
      expect(iban.friendlyFormatIBAN(null)).toBeNull();
    });
    it('returns empty string when empty string is provided', () => {
      expect(iban.friendlyFormatIBAN('')).toBe('');
    });
  });

  describe('Adding country specification allows us to use it', () => {
    it('Adds and uses country code XX', () => {
      iban.countrySpecs['XX'] = { chars: 24, bban_regexp: '^[0-9]{8}[A-Z0-9]{12}$', IBANRegistry: true };
      const ext = iban.getCountrySpecifications();
      expect(ext['XX']?.chars).toBe(24);
      expect(ext['XX']?.bban_regexp).toBe('^[0-9]{8}[A-Z0-9]{12}$');
      expect(ext['XX']?.IBANRegistry).toBe(true);
      expect(ext['XX']?.SEPA).toBe(false);
    });
  });

  describe('When calling getCountrySpecifications()', () => {
    const ext = iban.getCountrySpecifications();
    it('Country with code BE should return chars 16', () => {
      expect(ext['BE']?.chars).toBe(16);
    });
    it('Country with code AF should return chars null', () => {
      expect(ext['AF']?.chars).toBeNull();
    });
    it('Country with code AL should return bban_regexp ^[0-9]{8}[A-Z0-9]{16}$', () => {
      expect(ext['AL']?.bban_regexp).toBe('^[0-9]{8}[A-Z0-9]{16}$');
    });
    it('Country with code AF should return bban_regexp null', () => {
      expect(ext['AF']?.bban_regexp).toBeNull();
    });
    it('Country with code BA should return IBANRegistry true', () => {
      expect(ext['BA']?.IBANRegistry).toBe(true);
    });
    it('Country with code AO should return IBANRegistry false', () => {
      expect(ext['AO']?.IBANRegistry).toBe(false);
    });
    it('Country with code NL should return SEPA true', () => {
      expect(ext['NL']?.SEPA).toBe(true);
    });
    it('Country with code PK should return SEPA false', () => {
      expect(ext['PK']?.SEPA).toBe(false);
    });
    it('Country with code NO should have extra BBAN valication function', () => {
      expect(iban.countrySpecs['NO']?.bban_validation_func).not.toBeNull();
    });
  });

  describe('Adding custom BBAN validation function', () => {
    it('with valid DE IBAN should return true', () => {
      iban.setCountryBBANValidation('DE', () => false);

      // This IBAN has been tested valid (see above).
      // After we changed the method, it should now be false
      expect(iban.isValidIBAN('DE89370400440532013000')).toBe(false);
    });
    it('Unknown country returns false', () => {
      expect(iban.setCountryBBANValidation('XY', () => true)).toBe(false);
    });
    it('Unknown country cannot be modified', () => {
      iban.setCountryBBANValidation('XY', () => true);
      const ext = iban.getCountrySpecifications();
      expect(ext['XY']).toBeUndefined();
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
    it('should return false', () => {
      expect(iban.isQRIBAN('NL50PSTB0000054322')).toBe(false);
    });
  });
});
