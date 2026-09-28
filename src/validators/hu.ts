import { weightedSum } from '../core/checksum';

/** Repeating weights 9, 7, 3, 1. */
const WEIGHTS = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3] as const;

function mod10CheckDigit(remainder: number): number {
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Hungary: 24-digit BBAN. The 8-digit bank and branch code ends with a MOD 10 control digit over
 * its first 7 digits. The account number is either 8 digits followed by 8 zeros, with the control digit
 * at position 16, or 16 digits with the control digit at position 24.
 */
export function checkHungarianBBAN(bban: string): boolean {
  const bankBranchControl = Number(bban.charAt(7));
  if (bankBranchControl !== mod10CheckDigit(weightedSum(bban.slice(0, 7), WEIGHTS) % 10)) {
    return false;
  }
  const accountEnd = bban.endsWith('00000000') ? 15 : 23;
  const accountControl = Number(bban.charAt(accountEnd));
  return accountControl === mod10CheckDigit(weightedSum(bban.slice(8, accountEnd), WEIGHTS) % 10);
}
