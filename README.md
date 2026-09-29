# ibanita

![License](https://img.shields.io/badge/License-MIT-blue)

[![CI](https://github.com/AleksejDix/ibantools/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/AleksejDix/ibantools/actions/workflows/ci.yml)

![GitHub last commit](https://img.shields.io/github/last-commit/AleksejDix/ibantools)
![GitHub contributors](https://img.shields.io/github/contributors/AleksejDix/ibantools)
![GitHub issues](https://img.shields.io/github/issues/AleksejDix/ibantools)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/AleksejDix/ibantools)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AleksejDix/ibantools)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/AleksejDix/ibantools)

![No deps](https://img.shields.io/badge/dependencies-0-brightgreen)
![dev deps](https://img.shields.io/librariesio/github/AleksejDix/ibantools?label=devDependencies)

## About

IBANTools is TypeScript/JavaScript library for validation, creation and extraction of IBAN, BBAN and BIC/SWIFT numbers.

For more information about IBAN/BBAN see [wikipedia page](https://en.wikipedia.org/wiki/International_Bank_Account_Number) and
[IBAN registry](https://www.swift.com/resource/iban-registry-pdf).

For more information about BIC/SWIFT see [this wikipedia page](https://en.wikipedia.org/wiki/ISO_9362).

## Requirements

- Node.js `^20.19.0 || >=22.12.0`

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

## Usage

See the [full documentation](https://dix.consulting/ibantools) with examples on GitHub Pages.

### ES Modules (Recommended)

```js
import { isValidIBAN, validateIBAN, isValidBIC, electronicFormatIBAN } from '@aleksejdix/ibanita';

const iban = electronicFormatIBAN('NL91 ABNA 0417 1643 00'); // 'NL91ABNA0517164300'
isValidIBAN(iban); // true

// If you want to know reason why IBAN is invalid
validateIBAN('NL91ABNA0517164300');
// Returns { valid: false, errorCodes: [IBANValidationError.WrongIBANChecksum] }

// Validate BIC
isValidBIC('ABNANL2A'); // true
```

### Subpath imports

Each module is also exported on its own, so a bundle for BIC validation never includes the IBAN country data:

```js
import { isValidBIC } from '@aleksejdix/ibanita/bic';
import { friendlyFormatIBAN } from '@aleksejdix/ibanita/format';
```

Available: `/iban`, `/bic`, `/bban` and `/format`.

### TypeScript

Full TypeScript support with bundled type definitions:

```typescript
import { isValidIBAN, validateIBAN, IBANValidationError } from '@aleksejdix/ibanita';

const result = validateIBAN('NL91ABNA0417164300');
if (!result.valid) {
  console.log('Invalid IBAN:', result.errorCodes);
}
```

### Extension

National BBAN validation can be replaced per country by passing `bbanValidators` to `isValidIBAN`, `validateIBAN`, `isValidBBAN` or `composeIBAN`. The country data itself is frozen.

For example, to fully syntactically check German IBANs, you can install [IBANTools-Germany](https://github.com/baumerdev/ibantools-germany):

```js
import { isValidIBAN } from '@aleksejdix/ibanita';
import { isValidBBAN } from 'ibantools-germany';

const options = { bbanValidators: { DE: isValidBBAN } };
isValidIBAN(germanIban, options);
```

## Contributing

This project adheres to the Contributor Covenant [code of conduct](https://github.com/AleksejDix/ibantools/blob/master/.github/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

For contribution details, please read [this document](https://github.com/AleksejDix/ibantools/blob/master/CONTRIBUTING.md).

## License

This work is licensed under MIT.

`SPDX-License-Identifier: MIT`

## Migrating from ibantools

ibanita 5 changes some results and types compared to ibantools 4.x. See the [migration guide](MIGRATION.md).

## Credits

This project started as a fork of [ibantools](https://github.com/Simplify/ibantools), created and maintained by [Saša Jovanić](https://github.com/Simplify). Many thanks to Saša Jovanić and everyone who contributed to the original project.

