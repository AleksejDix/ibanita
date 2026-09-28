# SWIFT IBAN Registry

This folder holds the SWIFT IBAN Registry, the hand-maintained overrides, and the builder that turns both into `src/countries/specs.ts`.

## Source

- **URL:** https://www.swift.com/swift-resource/11971/download
- **Current version:** v103 (September 2026)
- **Countries:** 89 in the registry, 124 after the overrides

## Files

- `iban-registry-vXXX.txt`: the registry release, as downloaded from SWIFT. The builder uses the newest one.
- `overrides.mjs`: what the registry does not define. National checksum validators (by export name in `src/validators`), account positions, countries and territories outside the registry, and two deliberate deviations (FR branch, SI bank and branch).
- `builder.mjs`: parses the TXT file, merges the overrides over it and writes `src/countries/specs.ts`, one frozen entry per country with every field written out. An override that changes a registry value is an error unless it is listed as a deliberate deviation.

`src/countries/specs.ts` is generated. Never edit it by hand. CI regenerates it and fails if it differs from the committed file. `test/registry.test.ts` checks every country against the newest registry file.

## Updating to a new registry release

1. Download the TXT file from https://www.swift.com/swift-resource/11971/download.
2. Save it as `registry/iban-registry-vXXX.txt`, with the release number.
3. Run `npm run registry` to regenerate `src/countries/specs.ts`. The builder picks the newest file and fails on conflicts with `overrides.mjs`.
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
