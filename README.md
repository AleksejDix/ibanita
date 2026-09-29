# ibanita

[![CI](https://github.com/AleksejDix/ibantools/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/AleksejDix/ibantools/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/License-MIT-blue)
![No deps](https://img.shields.io/badge/dependencies-0-brightgreen)

Validation, extraction and creation of IBAN, BBAN and BIC/SWIFT numbers. TypeScript, ES modules, zero runtime dependencies, frozen data generated from the [SWIFT IBAN Registry](https://www.swift.com/resource/iban-registry-pdf).

- Every function normalises its input first: whitespace, dashes and periods are removed and letters uppercased.
- Results tell you why: string error codes such as `WRONG_IBAN_CHECKSUM`, and extraction results narrowed on `valid`.
- Ship only what you use: about 6 kB gzipped for all 124 countries, 1.5 kB for the rules plus one country.

## Installation

The package is published to GitHub Packages. Add the scope to your `.npmrc` and install:

```ini
@aleksejdix:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @aleksejdix/ibanita
```

GitHub Packages requires a token with the `read:packages` scope even for public packages.
See [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

Requires Node.js `^20.19.0 || >=22.12.0`.

## Usage

```ts
import { isValidIBAN, validateIBAN, extractIBAN, isValidBIC, IBANValidationError } from '@aleksejdix/ibanita';

isValidIBAN(input); // true or false, input may contain spaces, dashes and lowercase letters

const result = validateIBAN(input);
if (!result.valid) {
  result.errorCodes; // for example ['WRONG_IBAN_CHECKSUM']
  result.errorCodes.includes(IBANValidationError.WrongIBANChecksum);
}

const parts = extractIBAN(input);
if (parts.valid) {
  parts.countryCode; // 'NL'
  parts.bban; // the domestic account number
  parts.bankIdentifier; // when the country defines one
}

isValidBIC('ABNA NL 2A'); // true
```

### Only the countries you need

The rules and the data are separate. Pair the core with the countries you validate, and nothing else is bundled:

```ts
import { withCountries } from '@aleksejdix/ibanita/core';
import { CH } from '@aleksejdix/ibanita/countries/CH';
import { LI } from '@aleksejdix/ibanita/countries/LI';

const ibanita = withCountries({ CH, LI });
ibanita.isValidIBAN(input);
```

The object has the same IBAN, BBAN and country functions as the default entry, bound to those countries. An IBAN from any other country is reported as `NO_IBAN_COUNTRY`.

### Custom national validation

`bbanValidators` replaces the built-in national checksum for a country, per call. The country data itself is frozen.

```ts
import { isValidIBAN } from '@aleksejdix/ibanita';

const options = { bbanValidators: { DE: (bban) => myGermanBankCodeCheck(bban) } };
isValidIBAN(input, options);
```

## Public API

### Entry points

| Import path | Contents |
|---|---|
| `@aleksejdix/ibanita` | Everything below, bound to all 124 IBAN countries |
| `@aleksejdix/ibanita/core` | `withCountries`, `isQRIBAN`, `electronicFormat`, the error codes and the types. No country data |
| `@aleksejdix/ibanita/countries/CH` | One frozen `IBANCountrySpec` per country. Any of the 124 ISO codes |
| `@aleksejdix/ibanita/iban`, `/bban`, `/bic`, `/format`, `/country` | The default functions, one module at a time |

### Functions

| Function | Returns |
|---|---|
| `isValidIBAN(input, options?)` | `boolean` |
| `validateIBAN(input, options?)` | `IBANValidationResult`: `{ valid, errorCodes }` |
| `extractIBAN(input)` | `IBANExtractionResult`: `IBANParts` when valid, `{ valid: false, iban }` otherwise |
| `composeIBAN(countryCode, bban, options?)` | The IBAN with computed check digits, or `null` when the BBAN is invalid |
| `isQRIBAN(input)` | `boolean`. Swiss and Liechtenstein IBANs whose bank clearing number is 30000 to 31999 |
| `isValidBBAN(bban, countryCode, options?)` | `boolean` |
| `validateBBAN(bban, countryCode, options?)` | `BBANValidationResult`: `{ valid, errorCodes }` |
| `isValidBIC(input)` | `boolean` |
| `validateBIC(input)` | `BICValidationResult`: `{ valid, errorCodes }` |
| `extractBIC(input)` | `BICExtractionResult`: `BICParts` when valid, `{ valid: false }` otherwise |
| `electronicFormat(value)` | The input with whitespace, dashes and periods removed and letters uppercased. `''` for `null` and `undefined` |
| `friendlyFormatIBAN(iban, separator?)` | Groups of four characters, separated by a space by default. `null` for `null` and `undefined` |
| `isSEPACountry(countryCode)` | `boolean` |
| `withCountries(specs)` | `Ibanita`: the IBAN, BBAN and country functions bound to `specs` |

`options` is `IBANValidationOptions` for the IBAN functions (`allowQRIBAN`, default `true`, and `bbanValidators`) and `BBANValidationOptions` for the BBAN functions and `composeIBAN` (`bbanValidators`).

### Data

`countrySpecs` maps every ISO 3166-1 alpha-2 code to a frozen `CountrySpec`. Countries without IBAN have an empty specification. An IBAN country has:

| Field | Meaning |
|---|---|
| `ibanLength` | Length of the IBAN |
| `bbanRegExp` | Regular expression the BBAN must match |
| `ibanRegistry` | Listed in the SWIFT IBAN Registry |
| `sepa` | Takes part in SEPA |
| `bbanValidator` | Built-in national checksum, when the country has one |
| `bankPosition`, `branchPosition` | `[start, end]` within the BBAN, 0-based and inclusive |
| `accountPosition` | `[start, end]` within the IBAN |

### Error codes

`IBANValidationError`, `BBANValidationError` and `BICValidationError` are constant objects whose values are the strings found in `errorCodes`.

| Object | Codes |
|---|---|
| `IBANValidationError` | `NO_IBAN_PROVIDED`, `NO_IBAN_COUNTRY`, `WRONG_BBAN_LENGTH`, `WRONG_BBAN_FORMAT`, `WRONG_BBAN_CHECKSUM`, `CHECK_DIGITS_NOT_NUMERIC`, `WRONG_IBAN_CHECKSUM`, `QR_IBAN_NOT_ALLOWED` |
| `BBANValidationError` | `NO_BBAN_PROVIDED`, `NO_IBAN_COUNTRY`, `WRONG_BBAN_LENGTH`, `WRONG_BBAN_FORMAT`, `WRONG_BBAN_CHECKSUM` |
| `BICValidationError` | `NO_BIC_PROVIDED`, `NO_BIC_COUNTRY`, `WRONG_BIC_FORMAT` |

### Types

`IBANValidationOptions`, `BBANValidationOptions`, `BBANValidator`, `IBANValidationResult`, `BBANValidationResult`, `BICValidationResult`, `IBANExtractionResult`, `IBANParts`, `InvalidIBANParts`, `BICExtractionResult`, `BICParts`, `InvalidBICParts`, `IBANCountrySpec`, `IBANCountrySpecs`, `CountrySpec`, `CountryMap`, `IdentifierPosition`, `Ibanita`.

The full reference with examples is at https://dix.consulting/ibantools.

## Contributing

This project adheres to the Contributor Covenant [code of conduct](.github/CODE_OF_CONDUCT.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and the release steps.

## Migrating from ibantools 4.x

ibanita 5 is a rewrite with a different API surface. [MIGRATION.md](MIGRATION.md) lists every change.

## License

MIT. `SPDX-License-Identifier: MIT`
