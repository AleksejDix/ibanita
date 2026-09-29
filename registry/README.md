# SWIFT IBAN Registry

This folder holds the SWIFT IBAN Registry, the hand-maintained overrides and country list, and the builder that turns them into `src/countries/`.

## Source

- **URL:** https://www.swift.com/swift-resource/11971/download
- **Current version:** v103 (September 2026)
- **Countries:** 89 in the registry, 124 after the overrides

## Files

- `iban-registry-vXXX.txt`: the registry release, as downloaded from SWIFT. The builder uses the newest one.
- `overrides.mjs`: what the registry does not define. National checksum validators (by export name in `src/validators`), account positions, countries and territories outside the registry with their names, and two deliberate deviations (FR branch, SI bank and branch).
- `country-codes.mjs`: every ISO 3166-1 alpha-2 code, with or without IBAN.
- `builder.mjs`: parses the TXT file, merges the overrides over it and writes `src/countries/`: one file per IBAN country (`CH.ts` exports the frozen `CH` spec and imports only its own validator), `specs.ts` (re-exports them and collects `ibanSpecs`), `codes.ts` (`COUNTRY_CODES`) and `all.ts` (`countrySpecs`). An override that changes a registry value is an error unless it is listed as a deliberate deviation.

Everything in `src/countries/` is generated. Never edit it by hand. CI regenerates the folder and fails if it differs from the committed files. `test/registry.test.ts` checks every country against the newest registry file.

## Updating to a new registry release

1. Download the TXT file from https://www.swift.com/swift-resource/11971/download.
2. Save it as `registry/iban-registry-vXXX.txt`, with the release number.
3. Run `npm run registry` to regenerate `src/countries/`. The builder picks the newest file and fails on conflicts with `overrides.mjs`.
4. Run `npm test`. The registry test reports remaining differences.
5. Update the version above.

## TXT file format

The SWIFT TXT file is tab-separated, with one row per data field and one column per country. The builder reads:

- `IBAN prefix country code (ISO 3166)`
- `SEPA country`
- `IBAN length`
- `BBAN structure`, converted to a pattern with adjacent fields of the same type merged
- `Bank identifier position within the BBAN` and `Branch identifier position within the BBAN`, converted to 0-based `[start, end]` positions

Some rows contain quoted values that span several lines. The builder joins continuation lines that start with `"\t`.
