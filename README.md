<div align="center">

# ibanita

**Validate, parse and compose IBAN, BBAN and BIC/SWIFT numbers.**

Typed, tree-shakeable and dependency-free, with country data generated from the official SWIFT IBAN Registry.

[![CI](https://github.com/AleksejDix/ibanita/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/AleksejDix/ibanita/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
![TypeScript](https://img.shields.io/badge/types-TypeScript-3178c6)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Size](https://img.shields.io/badge/gzipped-6%20kB-informational)

[Documentation](https://dix.consulting/ibanita) · [Installation](#installation) · [Usage](#usage) · [API](#api-reference) · [Countries](#supported-countries) · [Migration](MIGRATION.md)

</div>

---

## Features

- **Complete coverage.** 124 countries and territories, including every entry of the SWIFT IBAN Registry and the national checksums of 17 countries.
- **Verified against the source.** Country data is generated from the SWIFT IBAN Registry and checked against it and the EPC list of SEPA countries on every CI run. A scheduled workflow picks up new registry releases.
- **Actionable results.** Validation returns string error codes such as `WRONG_IBAN_CHECKSUM` rather than a bare `false`, and extraction results are narrowed on `valid`.
- **Forgiving input.** Every function normalises its input first: whitespace, dashes and periods are removed and letters are uppercased.
- **Pay only for what you use.** About 6 kB gzipped for all countries, 1.5 kB for the rules plus a single country.
- **Strictly typed.** Written in TypeScript with the strictest compiler settings. Country codes are a literal union type, so typos fail at compile time.
- **Zero runtime dependencies.** ES modules only, `sideEffects: false`, frozen data.

## Installation

The package is published to GitHub Packages. Add the scope to your `.npmrc`:

```ini
@aleksejdix:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install:

```bash
npm install @aleksejdix/ibanita
```

> [!NOTE]
> GitHub Packages requires a token with the `read:packages` scope, even for public packages. See [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

**Requirements:** Node.js `^20.19.0 || >=22.12.0`, or any bundler or runtime that supports ES modules.

## Usage

### Validate an IBAN

```ts
import { isValidIBAN, validateIBAN, IBANValidationError } from '@aleksejdix/ibanita';

isValidIBAN(input); // true or false; spaces, dashes and lowercase letters are accepted

const result = validateIBAN(input);
if (!result.valid) {
  result.errorCodes; // for example ['WRONG_IBAN_CHECKSUM']
  result.errorCodes.includes(IBANValidationError.WrongIBANChecksum);
}
```

### Extract its components

```ts
import { extractIBAN } from '@aleksejdix/ibanita';

const parts = extractIBAN(input);
if (parts.valid) {
  parts.countryCode; // 'NL'
  parts.bban; // the domestic account number
  parts.bankIdentifier; // when the country defines one
}
```

### Compose and format

```ts
import { composeIBAN, friendlyFormatIBAN, electronicFormat } from '@aleksejdix/ibanita';

const iban = composeIBAN('NL', bban); // check digits computed, or null when the BBAN is invalid
friendlyFormatIBAN(iban); // groups of four characters, separated by spaces
electronicFormat(userInput); // whitespace, dashes and periods removed, uppercased
```

### Validate a BIC

```ts
import { isValidBIC, extractBIC } from '@aleksejdix/ibanita';

isValidBIC('ABNA NL 2A'); // true
extractBIC('ABNANL2A'); // bank code, country code, location code and branch code
```

### Bundle only the countries you need

Rules and data are separate. Pair the core with the countries you accept, and nothing else ends up in your bundle:

```ts
import { withCountries } from '@aleksejdix/ibanita/core';
import { CH } from '@aleksejdix/ibanita/countries/CH';
import { LI } from '@aleksejdix/ibanita/countries/LI';

const ibanita = withCountries({ CH, LI });
ibanita.isValidIBAN(input);
```

The returned object has the same IBAN, BBAN and country functions as the default entry, bound to those countries. An IBAN from any other country is reported as `NO_IBAN_COUNTRY`. Keys are typed as `IBANCountryCode`, so a misspelled country such as `{ ch: CH }` fails to compile.

### Custom national validation

`bbanValidators` replaces the built-in national checksum for a country, per call. The country data itself stays frozen.

```ts
import { isValidIBAN } from '@aleksejdix/ibanita';

const options = { bbanValidators: { DE: (bban) => myGermanBankCodeCheck(bban) } };
isValidIBAN(input, options);
```

### Swiss QR-IBANs

QR-IBANs are accepted by default. Pass `allowQRIBAN: false` where a QR-IBAN is not permitted, such as for a regular credit transfer:

```ts
import { isQRIBAN, validateIBAN } from '@aleksejdix/ibanita';

isQRIBAN(input); // true for CH and LI IBANs with a bank clearing number from 30000 to 31999
validateIBAN(input, { allowQRIBAN: false }); // reports QR_IBAN_NOT_ALLOWED for a QR-IBAN
```

## API reference

The complete reference with examples is at **[dix.consulting/ibanita](https://dix.consulting/ibanita)**.

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

### Options

| Option | Accepted by | Default | Description |
|---|---|---|---|
| `allowQRIBAN` | `isValidIBAN`, `validateIBAN` | `true` | Accept Swiss and Liechtenstein QR-IBANs |
| `bbanValidators` | IBAN and BBAN functions, `composeIBAN` | none | Map of country code to a `BBANValidator` that replaces the built-in national checksum |

The IBAN functions take `IBANValidationOptions`; the BBAN functions and `composeIBAN` take `BBANValidationOptions`.

### Error codes

`IBANValidationError`, `BBANValidationError` and `BICValidationError` are constant objects whose values are the strings found in `errorCodes`.

| Object | Codes |
|---|---|
| `IBANValidationError` | `NO_IBAN_PROVIDED`, `NO_IBAN_COUNTRY`, `WRONG_BBAN_LENGTH`, `WRONG_BBAN_FORMAT`, `WRONG_BBAN_CHECKSUM`, `CHECK_DIGITS_NOT_NUMERIC`, `WRONG_IBAN_CHECKSUM`, `QR_IBAN_NOT_ALLOWED` |
| `BBANValidationError` | `NO_BBAN_PROVIDED`, `NO_IBAN_COUNTRY`, `WRONG_BBAN_LENGTH`, `WRONG_BBAN_FORMAT`, `WRONG_BBAN_CHECKSUM` |
| `BICValidationError` | `NO_BIC_PROVIDED`, `NO_BIC_COUNTRY`, `WRONG_BIC_FORMAT` |

### Country data

`countrySpecs` maps every ISO 3166-1 alpha-2 code to a frozen `CountrySpec`. Countries without IBAN have an empty specification. An IBAN country has:

| Field | Meaning |
|---|---|
| `ibanLength` | Length of the IBAN |
| `bbanRegExp` | Regular expression the BBAN must match |
| `ibanRegistry` | Listed in the SWIFT IBAN Registry |
| `sepa` | In the SEPA schemes' geographical scope, per the EPC list (EPC409-09) |
| `bbanValidator` | Built-in national checksum, when the country has one |
| `bankPosition`, `branchPosition` | `[start, end]` within the BBAN, 0-based and inclusive |
| `accountPosition` | `[start, end]` within the IBAN |

### Types

`IBANValidationOptions`, `BBANValidationOptions`, `BBANValidator`, `IBANValidationResult`, `BBANValidationResult`, `BICValidationResult`, `IBANExtractionResult`, `IBANParts`, `InvalidIBANParts`, `BICExtractionResult`, `BICParts`, `InvalidBICParts`, `IBANCountryCode` (the union of the 124 IBAN country codes, generated), `IBANCountrySpec`, `IBANCountrySpecs`, `CountrySpec`, `CountryMap`, `IdentifierPosition`, `Ibanita`.

## Supported countries

<details>
<summary><strong>124 countries and territories</strong>, each checked against the SWIFT IBAN Registry and the EPC list of SEPA countries</summary>

<!-- country-table:start -->

124 countries and territories. 89 have their own entry in SWIFT IBAN Registry release 103, 13 are territories the registry lists under the `FI` and `FR` entries, and 22 use IBAN outside the registry. SEPA membership is checked against the EPC list of SEPA scheme countries (EPC409-09 v8.0, 24 December 2025).

The first six columns are the library data. The last five are checked by `test/readme.test.ts` against the official documents on every CI run, so this table cannot drift from them:

- **Length**, **Structure**: the IBAN length and BBAN structure match the registry entry.
- **Example**: the registry example IBAN validates. For a territory, the parent entry example BBAN composes into a valid IBAN for the territory.
- **Bank / branch**: the bank and branch identifiers extracted from the example are the ones at the registry positions.
- **SEPA**: the library flag matches the EPC list.

✓ checked and matching, – no official source for this check.

| Country | Code | Length | BBAN | SEPA | Registry | Length ✓ | Structure ✓ | Example ✓ | Bank / branch ✓ | SEPA ✓ |
|---|---|--:|---|---|---|:-:|:-:|:-:|:-:|:-:|
| Åland Islands | `AX` | 18 | `14!n` | yes | in FI | ✓ | ✓ | ✓ | – | ✓ |
| Albania | `AL` | 28 | `8!n16!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ ² |
| Algeria | `DZ` | 26 | `22!n` | no | no ³ | – | – | – | – | ✓ |
| Andorra | `AD` | 24 | `8!n12!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Angola | `AO` | 25 | `21!n` | no | no ³ | – | – | – | – | ✓ |
| Austria | `AT` | 20 | `16!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Azerbaijan | `AZ` | 28 | `4!a20!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bahrain | `BH` | 22 | `4!a14!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Belarus | `BY` | 28 | `4!c4!n16!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Belgium | `BE` | 16 | `12!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Benin | `BJ` | 28 | `2!c22!n` | no | no ³ | – | – | – | – | ✓ |
| Bosnia & Herzegovina | `BA` | 20 | `16!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Brazil | `BR` | 29 | `8!c15!n2!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| British Virgin Islands | `VG` | 24 | `4!a16!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bulgaria | `BG` | 22 | `4!a6!n8!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Burkina Faso | `BF` | 28 | `2!c22!n` | no | no ³ | – | – | – | – | ✓ |
| Burundi | `BI` | 27 | `23!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cameroon | `CM` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Cape Verde | `CV` | 25 | `21!n` | no | no ³ | – | – | – | – | ✓ |
| Central African Republic | `CF` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Chad | `TD` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Comoros | `KM` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Congo - Brazzaville | `CG` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Costa Rica | `CR` | 22 | `18!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Côte d’Ivoire | `CI` | 28 | `1!a23!n` | no | no ³ | – | – | – | – | ✓ |
| Croatia | `HR` | 21 | `17!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cyprus | `CY` | 28 | `8!n16!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Czechia | `CZ` | 24 | `20!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Denmark | `DK` | 18 | `14!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Djibouti | `DJ` | 27 | `23!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dominican Republic | `DO` | 28 | `4!c20!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Egypt | `EG` | 29 | `25!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| El Salvador | `SV` | 28 | `4!a20!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Equatorial Guinea | `GQ` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Estonia | `EE` | 20 | `16!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Falkland Islands | `FK` | 18 | `2!a12!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Faroe Islands | `FO` | 18 | `14!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Finland | `FI` | 18 | `14!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| France | `FR` | 27 | `10!n11!c2!n` | yes | yes | ✓ | ✓ | ✓ | ✓ ¹ | ✓ |
| French Guiana | `GF` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| French Polynesia | `PF` | 27 | `10!n11!c2!n` | no | in FR | ✓ | ✓ | ✓ | – | ✓ |
| French Southern Territories | `TF` | 27 | `10!n11!c2!n` | no | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Gabon | `GA` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Georgia | `GE` | 22 | `2!a16!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Germany | `DE` | 22 | `18!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gibraltar | `GI` | 23 | `4!a15!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Greece | `GR` | 27 | `7!n16!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Greenland | `GL` | 18 | `14!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Guadeloupe | `GP` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Guatemala | `GT` | 28 | `24!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Guinea-Bissau | `GW` | 25 | `2!a19!n` | no | no ³ | – | – | – | – | ✓ |
| Honduras | `HN` | 28 | `4!a20!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hungary | `HU` | 28 | `24!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Iceland | `IS` | 26 | `22!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Iran | `IR` | 26 | `22!n` | no | no ³ | – | – | – | – | ✓ |
| Iraq | `IQ` | 23 | `4!a15!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ireland | `IE` | 22 | `4!a14!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Israel | `IL` | 23 | `19!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Italy | `IT` | 27 | `1!a10!n12!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Jordan | `JO` | 30 | `4!a4!n18!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kazakhstan | `KZ` | 20 | `3!n13!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kosovo | `XK` | 20 | `16!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kuwait | `KW` | 30 | `4!a22!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Latvia | `LV` | 21 | `4!a13!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Lebanon | `LB` | 28 | `4!n20!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Libya | `LY` | 25 | `21!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Liechtenstein | `LI` | 21 | `5!n12!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Lithuania | `LT` | 20 | `16!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Luxembourg | `LU` | 20 | `3!n13!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Madagascar | `MG` | 27 | `23!n` | no | no ³ | – | – | – | – | ✓ |
| Mali | `ML` | 28 | `2!c22!n` | no | no ³ | – | – | – | – | ✓ |
| Malta | `MT` | 31 | `4!a5!n18!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Martinique | `MQ` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Mauritania | `MR` | 27 | `23!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mauritius | `MU` | 30 | `4!a19!n3!a` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mayotte | `YT` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Moldova | `MD` | 24 | `20!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ ² |
| Monaco | `MC` | 27 | `10!n11!c2!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mongolia | `MN` | 20 | `16!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Montenegro | `ME` | 22 | `18!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ ² |
| Morocco | `MA` | 28 | `24!n` | no | no ³ | – | – | – | – | ✓ |
| Mozambique | `MZ` | 25 | `21!n` | no | no ³ | – | – | – | – | ✓ |
| Netherlands | `NL` | 18 | `4!a10!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| New Caledonia | `NC` | 27 | `10!n11!c2!n` | no | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Nicaragua | `NI` | 28 | `4!a20!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Niger | `NE` | 28 | `2!a22!n` | no | no ³ | – | – | – | – | ✓ |
| North Macedonia | `MK` | 19 | `3!n10!c2!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ ² |
| Norway | `NO` | 15 | `11!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Oman | `OM` | 23 | `3!n16!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pakistan | `PK` | 24 | `4!a16!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Palestinian Territories | `PS` | 29 | `4!a21!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Poland | `PL` | 28 | `24!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Portugal | `PT` | 25 | `21!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Qatar | `QA` | 29 | `4!a21!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Réunion | `RE` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Romania | `RO` | 24 | `4!a16!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Russia | `RU` | 33 | `14!n15!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| San Marino | `SM` | 27 | `1!a10!n12!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| São Tomé & Príncipe | `ST` | 25 | `21!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Saudi Arabia | `SA` | 24 | `2!n18!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Senegal | `SN` | 28 | `2!a22!n` | no | no ³ | – | – | – | – | ✓ |
| Serbia | `RS` | 22 | `18!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ ² |
| Seychelles | `SC` | 31 | `4!a20!n3!a` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Slovakia | `SK` | 24 | `20!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Slovenia | `SI` | 19 | `15!n` | yes | yes | ✓ | ✓ | ✓ | ✓ ¹ | ✓ |
| Somalia | `SO` | 23 | `19!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Spain | `ES` | 24 | `20!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| St. Barthélemy | `BL` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| St. Lucia | `LC` | 32 | `4!a24!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| St. Martin | `MF` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| St. Pierre & Miquelon | `PM` | 27 | `10!n11!c2!n` | yes | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Sudan | `SD` | 18 | `14!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sweden | `SE` | 24 | `20!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Switzerland | `CH` | 21 | `5!n12!c` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Timor-Leste | `TL` | 23 | `19!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Togo | `TG` | 28 | `2!a22!n` | no | no ³ | – | – | – | – | ✓ |
| Tunisia | `TN` | 24 | `20!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Türkiye | `TR` | 26 | `6!n16!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ukraine | `UA` | 29 | `6!n19!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| United Arab Emirates | `AE` | 23 | `19!n` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| United Kingdom | `GB` | 22 | `4!a14!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Vatican City | `VA` | 22 | `18!n` | yes | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Wallis & Futuna | `WF` | 27 | `10!n11!c2!n` | no | in FR | ✓ | ✓ | ✓ | – | ✓ |
| Yemen | `YE` | 30 | `4!a4!n18!c` | no | yes | ✓ | ✓ | ✓ | ✓ | ✓ |

¹ Deliberate deviation: France also has a branch identifier, and Slovenia splits its five-digit bank code into bank and branch. Both identifiers are checked against the national layout instead.
² In the SEPA scope per the EPC list of SEPA scheme countries (EPC409-09 v8.0, 24 December 2025), while SWIFT IBAN Registry release 103 still lists the country as not SEPA.
³ Not in the SWIFT IBAN Registry. The format follows the national IBAN standard and is not checked against an official document.

<!-- country-table:end -->

</details>

## Data sources

| Source | Used for |
|---|---|
| [SWIFT IBAN Registry](https://www.swift.com/resource/iban-registry-pdf) | IBAN lengths, BBAN structures, bank and branch positions, example IBANs |
| [EPC list of SEPA scheme countries](https://www.europeanpaymentscouncil.eu/document-library/other/epc-list-sepa-scheme-countries) (EPC409-09) | SEPA membership |
| National standards | National BBAN checksums and countries outside the registry |

The country modules in `src/countries/` are generated from the newest registry file in `registry/` and never edited by hand. A scheduled workflow checks for a new registry release every quarter and opens a pull request. See [registry/README.md](registry/README.md).

## Migrating from ibantools 4.x

ibanita 5 is a rewrite with a different API surface. [MIGRATION.md](MIGRATION.md) lists every change that can affect existing code.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and release steps. This project follows the Contributor Covenant [code of conduct](.github/CODE_OF_CONDUCT.md).

To report a vulnerability, follow the [security policy](SECURITY.md).

## License

[MIT](LICENSE)

ibanita started in 2025 as a fork of [ibantools](https://github.com/Simplify/ibantools). It has since been rewritten from the ground up, and no code or test data from the original remains.
