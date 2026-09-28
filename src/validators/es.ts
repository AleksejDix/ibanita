import { mod11CheckDigit, weightedSum } from '../core/checksum';

/** Weights for the 8 digits of the bank and branch code. */
const BANK_BRANCH_WEIGHTS = [4, 8, 5, 10, 9, 7, 3, 6] as const;
/** Weights for the 10 digits of the account number. */
const ACCOUNT_WEIGHTS = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6] as const;

/**
 * Spain: 20-digit BBAN with two MOD 11 control digits at positions 9 and 10.
 * The first covers the bank and branch code (digits 1 to 8), the second the account number (digits 11 to 20).
 */
export function checkSpainBBAN(bban: string): boolean {
  const bankBranchControl = Number(bban.charAt(8));
  const accountControl = Number(bban.charAt(9));
  const bankBranchRemainder = weightedSum(bban.slice(0, 8), BANK_BRANCH_WEIGHTS) % 11;
  const accountRemainder = weightedSum(bban.slice(10, 20), ACCOUNT_WEIGHTS) % 11;
  return (
    bankBranchControl === mod11CheckDigit(bankBranchRemainder) && accountControl === mod11CheckDigit(accountRemainder)
  );
}
