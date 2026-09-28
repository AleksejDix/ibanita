import { mod9710 } from '../core/checksum';

/**
 * ISO 7064 MOD 97-10 over the whole BBAN, used by Bosnia and Herzegovina, Montenegro,
 * North Macedonia, Portugal, Serbia and Slovenia. The BBAN is valid when the remainder is 1.
 */
export function checkMod9710BBAN(bban: string): boolean {
  return mod9710(bban) === 1;
}
