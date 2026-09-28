# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ibanita is a TypeScript library (zero runtime dependencies) for validation, creation, and extraction of IBAN, BBAN, and BIC/SWIFT numbers. The library is published as an ES module with full TypeScript support and is licensed under MIT.

## Development Commands

```bash
# Build the library (required before publishing)
npm run build

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report (must maintain 100% coverage)
npm run coverage

# Type-check source and tests (strict settings in tsconfig.json)
npm run typecheck

# Lint code
npm run lint

# Generate API documentation
npm run docs

# Check that every public export has a doc comment
npm run docs:lint

# Run full validation suite (typecheck + tests + lint + format + docs lint + docs)
npm run all
```

## Testing

One test file per source module in `test/`:

- `test/iban.test.ts`, `test/bic.test.ts`, `test/bban.test.ts`, `test/format.test.ts`, `test/countries.test.ts`, `test/checksum.test.ts`: unit tests for the public API of that module
- `test/registry.test.ts`: checks every country against the latest `registry/iban-registry-vXXX.txt` (formats, lengths, flags, example IBANs, identifier positions)
- **Coverage requirement: 100%** - All pull requests must maintain 100% test coverage
- Run `npm run coverage` to verify coverage before committing

## Code Architecture

### Modular Structure

One module per concern. Functions take their input and options and return a result; nothing is mutated.

```
src/
├── index.ts                 # Main barrel (re-exports all public API)
├── iban.ts                  # IBAN functions (isValidIBAN, validateIBAN, composeIBAN, extractIBAN, isQRIBAN)
├── bic.ts                   # BIC functions (isValidBIC, validateBIC, extractBIC)
├── bban.ts                  # BBAN functions (isValidBBAN, bbanValidatorFor)
├── format.ts                # Format utilities (electronicFormatIBAN, friendlyFormatIBAN)
├── core/
│   ├── constants.ts         # MOD_97, MOD_97_REMAINDER
│   ├── types.ts             # All public types, options, results and error codes
│   └── checksum.ts          # Shared arithmetic (mod9710, weightedSum, mod11CheckDigit, checkMod1110)
├── validators/              # One national BBAN checksum per file, named by country code
│   ├── be.ts, no.ts, pl.ts, es.ts, hr.ts, ee.ts, hu.ts, fr.ts (FR and MC), cz-sk.ts (CZ and SK)
│   └── mod97-10.ts          # BA, ME, MK, PT, RS, SI
└── countries/
    ├── codes.ts             # COUNTRY_CODES: all 250 country codes (used by BIC functions)
    ├── specs.ts             # ibanSpecs: GENERATED from registry/ (do not edit), one frozen entry per IBAN country
    ├── all.ts               # countrySpecs: all countries, built from codes.ts and specs.ts
    └── sepa.ts              # Country utilities (isSEPACountry, getCountrySpecifications)
```

### Public API

All public functions are re-exported from `src/index.ts`:

1. **Validation Functions**: `isValidIBAN()`, `isValidBBAN()`, `isValidBIC()` - thin wrappers that return `validateX().valid`
2. **Detailed Validation**: `validateIBAN()`, `validateBIC()` - return string error codes such as `WRONG_BBAN_FORMAT`
3. **Creation**: `composeIBAN()` - generates valid IBANs from country code + BBAN
4. **Extraction**: `extractIBAN()`, `extractBIC()` - parse and extract components
5. **Formatting**: `electronicFormatIBAN()`, `friendlyFormatIBAN()`
6. **Utilities**: `isSEPACountry()`, `isQRIBAN()`, `getCountrySpecifications()`
7. **Data**: `countrySpecs` - frozen country specification object

`isValidIBAN` and `validateIBAN` normalise their input first (spaces and dashes removed, uppercased), like `extractIBAN`.

### Options

- `ValidateIBANOptions` for `isValidIBAN` and `validateIBAN`: `allowQRIBAN` (default true) and `bbanValidators`.
- `BBANValidationOptions` for `isValidBBAN` and `composeIBAN`: `bbanValidators`.
- `bbanValidators` maps a country code to a `BBANValidator` that replaces the built-in national checksum for that country. `bbanValidatorFor` in `src/bban.ts` resolves the validator. This is the only extension point; the data is frozen.

### Country Specifications (`countrySpecs`)

The data is split so bundlers only include what a function needs:

- `ibanSpecs` (`src/countries/specs.ts`) holds the countries that use IBAN. IBAN, BBAN and SEPA functions read it.
- `COUNTRY_CODES` (`src/countries/codes.ts`) lists all country codes. BIC functions read it. Every `ibanSpecs` country must be listed here, and a test checks this.
- `countrySpecs` (`src/countries/all.ts`), the public export, has every country, with a shared empty spec for countries without IBAN. `getCountrySpecifications()` returns it.

Each `CountrySpec` (all fields camelCase, all optional, all `readonly`):

- `ibanLength`: IBAN length
- `bbanRegExp`: Compiled regular expression the BBAN must match (emitted by the builder)
- `bbanValidator`: Built-in national checksum function
- `ibanRegistry`: Whether country is in official SWIFT IBAN Registry
- `sepa`: Whether country participates in SEPA
- `bankPosition`, `branchPosition`: `[start, end]` positions within the BBAN, 0-based and inclusive (from the registry)
- `accountPosition`: `[start, end]` position within the full IBAN (from the overrides; the registry has no account position)

### IBAN Validation Algorithm

IBAN validation uses MOD-97-10 checksum (ISO 7064):
1. Extract BBAN (characters after first 4)
2. Move country code to end, append "00"
3. Replace letters with numbers (A=10, B=11, etc.)
4. Calculate MOD 97 on the numeric string in chunks (handles >30 digit integers)
5. Compare `98 - remainder` with provided checksum

### National BBAN Validation

Each file in `src/validators/` holds one algorithm with a doc comment that describes it. The generated `specs.ts` wires them to countries. Shared arithmetic lives in `src/core/checksum.ts`.

## IBAN Registry Updates

`src/countries/specs.ts` is generated by `npm run registry` from the newest SWIFT IBAN Registry file in `registry/` merged with `registry/overrides.mjs`; never edit it by hand. The builder fails when an override contradicts the registry unless the deviation is allow-listed. CI fails if the generated file is out of date. See `registry/README.md` for the update steps.

## Build Configuration

- **Build tool**: Vite 8, minified with Vite's built-in minifier
- **Output**: ES modules only (no CommonJS), with `sideEffects: false`
- **Features**:
  - `preserveModules: true` for tree-shaking support
  - Source maps enabled
  - TypeScript declarations generated per module by `tsc -p tsconfig.build.json` (TypeScript 7)

## TypeScript

- `tsconfig.json` enables the strictest options, including `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` and `isolatedDeclarations`
- `tsconfig.test.json` extends it to type-check the tests; `npm run typecheck` uses it

## Documentation

`npm run docs` generates the API documentation with `deno doc` (Deno is a dev dependency) into `docs/`. The Docs workflow deploys it to https://dix.consulting/ibantools on every push to master.

## Node Version

Requires Node.js `^20.19.0 || >=22.12.0` (aligned with Vite 8 and Vitest 4 requirements).

Project includes `.node-version` and `.nvmrc` files set to Node 22 for consistency.

## Pull Request Guidelines

Before submitting PRs:

1. Run `npm run all` to ensure tests, linting, and docs generation pass
2. Verify 100% test coverage maintained (`npm run coverage`)
3. Do not include changes to `dist/` directory (generated during publish)
4. Update the tests in `test/` for any functionality changes

## Lockfile

CI installs with `npm ci` from the public registry. Locally, npm may use a private mirror: with npm's default `replace-registry-host=npmjs`, lockfile URLs for `registry.npmjs.org` are fetched through the configured registry. `package-lock.json` must therefore only contain `https://registry.npmjs.org/` URLs, and CI fails otherwise. If a local install writes mirror URLs into the lockfile, replace them with `https://registry.npmjs.org/` before committing.

## Releasing

Publishing is automated by `.github/workflows/release.yml`, triggered by pushing a `v*` tag that matches the `package.json` version. See `CONTRIBUTING.md` for the steps. Never run `npm publish` manually.

## Git Commit Guidelines

- **Keep commits concise** - Single line subject, no multi-paragraph explanations
- **Never add attribution footers** - Do NOT include "Generated with Claude Code", "Co-Authored-By: Claude", or similar attribution lines
- Follow standard commit message format: `<type>: <description>` (e.g., "fix: IBAN validation for QR-IBANs")

## Linting

Uses `oxlint` (Rust-based fast linter) with TypeScript awareness:
```bash
oxlint --type-aware --tsconfig tsconfig.test.json src/ test/
```

Rules are configured in `.oxlintrc.json`. Formatting uses `oxfmt` (`npm run format`).
