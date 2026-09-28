# Migrating from ibantools 4.x to ibanita 5

ibanita started as a fork of [ibantools](https://github.com/Simplify/ibantools) 4.5. This guide lists every change that can affect existing code.

## Installation and imports

- **New package name.** Install `@aleksejdix/ibanita` from GitHub Packages (see the README) and change imports from `'ibantools'` to `'@aleksejdix/ibanita'`. The function names are unchanged.
- **ES modules only.** There is no separate CommonJS build. On the supported Node versions, `require('@aleksejdix/ibanita')` still works, because Node can load ES modules with `require`.
- **Node.js `^20.19.0 || >=22.12.0`.**
- **MIT license only.** The MPL-2.0 option was dropped.

## Validation results that change

| Function | Before | Now | What to do |
|---|---|---|---|
| `composeIBAN` | Returned an IBAN even when the BBAN failed its national checksum, for example in Norway or Belgium | Returns `null` | Handle `null` as "invalid BBAN" |
| `isValidIBAN`, `validateIBAN` | Accepted Czech and Slovak IBANs whose check digit was 1 for weighted-sum remainder 1 | Rejects them, following the official mod-11 rule | Nothing. These IBANs were invalid |
| `validateIBAN` | Added `WrongAccountBankBranchChecksum` (6) when the length or format was already wrong | Only reports length, format and checksum errors | Don't rely on code 6 for malformed input |
| `validateBIC` | Reported `NoBICCountry` for malformed input such as `AB` | Reports `WrongBICFormat` | Check for code 2 for malformed input |
| `isValidIBAN`, `validateIBAN` | Rejected IBANs with spaces, dashes or lowercase letters | Removes spaces and dashes and uppercases letters first, like `extractIBAN` | Nothing, unless you relied on the rejection. Call `electronicFormatIBAN` yourself and compare, if you must reject formatted input |

## Country formats follow the SWIFT IBAN Registry

Formats now match SWIFT IBAN Registry release 103 for all 89 registry countries. A test checks this for every release.

- **Accepted now, rejected before:** Brazilian IBANs with letters in the bank code (release 103), and registry-valid IBANs for Belarus, the Dominican Republic, Pakistan and Palestine.
- **Rejected now, accepted before:** non-conforming IBANs for Georgia, Ireland, Turkey, the British Virgin Islands, Pakistan and Palestine.
- **Registry flag:** Burundi, Djibouti and the Falkland Islands now have `IBANRegistry: true`.

## `extractIBAN` returns different identifiers

- **`accountNumber`** is corrected for 30 countries. Before, it could include the bank or branch code or the country prefix, or cut off leading digits. For example, Andorra returned `2030200359100100` and now returns `200359100100`. Iceland now returns an account number.
- **`bankIdentifier`** is now set for 12 more countries: SK, SM, SO, ST, SV, TL, TN, TR, UA, VA, VG and XK.
- **Poland** returns its 8-digit code as `bankIdentifier`, no longer as `branchIdentifier`.
- **`null` or `undefined` input** returns `{ iban: '', valid: false }`. Before, `iban` could be `null` or missing.

## Other changes

- **`extractBIC(null)`** returns an invalid result instead of throwing a TypeError.
- **`friendlyFormatIBAN`** inserts the separator literally. Separators like `$&` were expanded as regex replacement patterns before.
- **`ValidationErrorsIBAN` and `ValidationErrorsBIC`** are `as const` objects instead of TypeScript enums. The values are unchanged, and `ValidationErrorsIBAN.WrongIBANChecksum` still works. Code that used the enums as types uses the union types with the same names.
- **`countrySpecs`:** changing an existing country, or calling `setCountryBBANValidation`, works as before. Adding a brand-new country key to `countrySpecs` by hand no longer affects IBAN validation.
- **`ExtractBICResult`:** `branchCode` and `testBIC` are optional, because they are not set for an invalid BIC. Check `valid` before reading them.
- **More permissive types:** `isQRIBAN`, `isSEPACountry`, `extractIBAN`, `extractBIC` and `electronicFormatIBAN` accept `null` and `undefined`.
