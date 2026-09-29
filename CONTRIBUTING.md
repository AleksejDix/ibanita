# How to contribute

:+1: First off, thanks for taking the time to contribute!

This project adheres to the Contributor Covenant [code of conduct](.github/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

* Clone this repo and run `npm install`.
* Write tests for your changes in the matching `test/<module>.test.ts` file.
* Before making pull requests run `npm run all`.
* Give every new rule a test that fails when the rule is broken, such as a rejected input. There is no coverage target.
* Try not to make pull requests with changes in `dist`, `jsnext` or `build` directories.

## Releasing

There is no hand-written changelog. Release notes are generated from the commit subjects, so write them as [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.

Releases are published to GitHub Packages (`@aleksejdix/ibanita`) automatically by the Release workflow when a version tag is pushed.

1. Update the version in `package.json` and `package-lock.json`, for example with `npm version 5.0.0 --no-git-tag-version`.
2. Commit the change: `git commit -am "chore: release 5.0.0"`.
3. Tag and push: `git tag v5.0.0 && git push origin master v5.0.0`.

The workflow checks that the tag matches the `package.json` version, runs all checks, publishes the package and creates a GitHub release. Versions with a hyphen, like `5.0.0-beta.1`, are published under the `next` dist-tag and marked as pre-releases.
