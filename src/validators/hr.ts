import { checkMod1110 } from '../core/checksum';

/**
 * Croatia: 17-digit BBAN made of a 7-digit bank code and a 10-digit account number,
 * each ending with an ISO 7064 MOD 11-10 control digit.
 */
export function checkCroatianBBAN(bban: string): boolean {
  const bankControl = Number(bban.charAt(6));
  const accountControl = Number(bban.charAt(16));
  return checkMod1110(bban.slice(0, 6), bankControl) && checkMod1110(bban.slice(7, 16), accountControl);
}
