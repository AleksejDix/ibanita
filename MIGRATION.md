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
| `composeIBAN` | Took `{ countryCode, bban }` | Takes `composeIBAN(countryCode, bban, options?)` | Pass the two arguments. `ComposeIBANParams` is gone |
| `isValidIBAN`, `validateIBAN` | Accepted Czech and Slovak IBANs whose check digit was 1 for weighted-sum remainder 1 | Rejects them, following the official mod-11 rule | Nothing. These IBANs were invalid |
| `validateIBAN` | Added `WrongAccountBankBranchChecksum` (6) when the length or format was already wrong | Only reports length, format and checksum errors | Don't rely on code 6 for malformed input |
| `validateBIC` | Reported `NoBICCountry` for malformed input such as `AB` | Reports `WrongBICFormat` | Check for code 2 for malformed input |
| All validation and extraction functions | IBAN functions rejected spaces, dashes and lowercase; BIC functions rejected spaces; BBAN functions rejected spaces | One input rule: whitespace, dashes and periods are removed and letters uppercased first (`electronicFormat`) | Nothing, unless you relied on the rejection. Call `electronicFormat` yourself and compare, if you must reject formatted input |

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
- **`IBANValidationError` and `BICValidationError`** are `as const` objects with string values instead of numeric TypeScript enums. `IBANValidationError.WrongIBANChecksum` still works, but its value is now `'WRONG_IBAN_CHECKSUM'` instead of `5`. Two codes are renamed: `WrongAccountBankBranchChecksum` is `WrongBBANChecksum` (`WRONG_BBAN_CHECKSUM`) and `ChecksumNotNumber` is `CheckDigitsNotNumeric` (`CHECK_DIGITS_NOT_NUMERIC`). The BBAN codes are shared with the new `validateBBAN` through `BBANValidationError`. Code that compared against the numbers must use the constants or the strings. Code that used the enums as types uses the union types with the same names.
- **`countrySpecs` is frozen and `setCountryBBANValidation` is gone.** Pass custom national validators per call instead: `isValidIBAN(iban, { bbanValidators: { DE: isValidBBAN } })`. `validateIBAN`, `isValidBBAN` and `composeIBAN` accept the same option. Adding or changing countries by hand is no longer possible.
- **`IBANExtractionResult` and `BICExtractionResult` are unions on `valid`.** A valid result (`IBANParts`, `BICParts`) has every field set and required. An invalid result has only `valid: false`, plus `iban` for IBANs. Check `valid` before reading the other fields; TypeScript narrows the type for you.
- **`countrySpecs` fields are camelCase:** `chars` is `ibanLength`, `bban_regexp` is `bbanRegExp` and holds a compiled `RegExp` (use `.source` for the string), `bban_validation_func` is `bbanValidator`, `IBANRegistry` is `ibanRegistry`, `SEPA` is `sepa`, and the positions `bank_identifier`, `branch_indentifier` and `account_indentifier` are `bankPosition`, `branchPosition` and `accountPosition`, as `[start, end]` tuples (type `IdentifierPosition`) instead of `"start-end"` strings. The types `CountrySpecInternal` and `CountryMapInternal` are gone. `CountrySpec` and `CountryMap` now describe this full shape.
- **`getCountrySpecifications()` is gone.** Read `countrySpecs` instead; it is the same frozen object. Countries without IBAN have an empty specification, so `ibanLength` and `bbanRegExp` are `undefined` instead of `null`, and `sepa` and `ibanRegistry` can be `undefined` instead of `false`.
- **Type names are noun-first.** `ValidationErrorsIBAN` is `IBANValidationError`, `ValidateIBANResult` is `IBANValidationResult`, `ValidateIBANOptions` is `IBANValidationOptions`, `ExtractIBANResult` is `IBANExtractionResult` with `IBANParts | InvalidIBANParts`, and the same pattern for BIC (`BICValidationError`, `BICValidationResult`, `BICExtractionResult`, `BICParts`) and BBAN (`BBANValidationError`, `BBANValidationResult`, `BBANValidationOptions`).
- **More permissive types:** `isQRIBAN`, `isSEPACountry`, `extractIBAN`, `extractBIC` and `electronicFormatIBAN` accept `null` and `undefined`.
