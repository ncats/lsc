## [2.3.1](https://github.com/LabShare/lsc/compare/v2.3.0...v2.3.1) (2018-11-01)


### Bug Fixes

* **logs:** update log file name to "app.log" instead of "lsc.log" ([7f89f7a](https://github.com/LabShare/lsc/commit/7f89f7a))

# [2.3.0](https://github.com/LabShare/lsc/compare/v2.2.7...v2.3.0) (2018-10-25)


### Features

* **api:** export logger and config loader classes ([2f0e680](https://github.com/LabShare/lsc/commit/2f0e680))

## [2.2.7](https://github.com/LabShare/lsc/compare/v2.2.6...v2.2.7) (2018-10-24)


### Bug Fixes

* **docs:** update install command after renaming package to [@labshare](https://github.com/labshare)/lsc ([03c7d9d](https://github.com/LabShare/lsc/commit/03c7d9d))
* **pkg:** rename package to [@labshare](https://github.com/labshare)/lsc to fix publishing errors ([abe8e76](https://github.com/LabShare/lsc/commit/abe8e76))

## [2.2.6](https://github.com/LabShare/lsc/compare/v2.2.5...v2.2.6) (2018-10-01)


### Bug Fixes

* **pkg:** remove deprecated prepublish hook ([1ae0acf](https://github.com/LabShare/lsc/commit/1ae0acf))

## [2.2.5](https://github.com/LabShare/lsc/compare/v2.2.4...v2.2.5) (2018-09-20)


### Bug Fixes

* **loader:** resolves "callback already called" exception SHELL-1614 ([0c8a48e](https://github.com/LabShare/lsc/commit/0c8a48e))

## [2.2.4](https://github.com/LabShare/lsc/compare/v2.2.3...v2.2.4) (2018-09-20)


### Bug Fixes

* **package:** update [@types](https://github.com/types)/glob to version 7.1.0 ([9dbb3a1](https://github.com/LabShare/lsc/commit/9dbb3a1))
* **package:** update [@types](https://github.com/types)/yargs to version 12.0.0 ([de5322b](https://github.com/LabShare/lsc/commit/de5322b))

## [2.2.3](https://github.com/LabShare/lsc/compare/v2.2.2...v2.2.3) (2018-09-12)


### Bug Fixes

* package.json to reduce vulnerabilities ([d9ce207](https://github.com/LabShare/lsc/commit/d9ce207))

## [2.2.2](https://github.com/LabShare/lsc/compare/v2.2.1...v2.2.2) (2018-08-02)


### Bug Fixes

* **template:** fix API package template SHELL-1602 #time 15m ([0d33c0b](https://github.com/LabShare/lsc/commit/0d33c0b))

## [2.2.1](https://github.com/LabShare/lsc/compare/v2.2.0...v2.2.1) (2018-07-25)


### Bug Fixes

* **package:** update fluent-logger to version 3.0.0 ([dd9e166](https://github.com/LabShare/lsc/commit/dd9e166))

# [2.2.0](https://github.com/LabShare/lsc/compare/v2.1.0...v2.2.0) (2018-07-19)


### Bug Fixes

* add app.ts to main package json property ([0510459](https://github.com/LabShare/lsc/commit/0510459))
* add winston-transport to dependencies ([0ce97ea](https://github.com/LabShare/lsc/commit/0ce97ea))
* SHELL-1316 #done add commitlint config to ui-template ([c89f167](https://github.com/LabShare/lsc/commit/c89f167))


### Features

* update template for UI packages SHELL-1316 ([#84](https://github.com/LabShare/lsc/issues/84)) ([66b22fd](https://github.com/LabShare/lsc/commit/66b22fd))

# [2.1.0](https://github.com/LabShare/lsc/compare/v2.0.3...v2.1.0) (2018-07-10)


### Features

* **cli:** exit with error if command is not found SHELL-1570 ([872f0d8](https://github.com/LabShare/lsc/commit/872f0d8))

## [2.0.3](https://github.com/LabShare/lsc/compare/v2.0.2...v2.0.3) (2018-07-05)


### Bug Fixes

* .snyk & package.json to reduce vulnerabilities ([1473367](https://github.com/LabShare/lsc/commit/1473367))

## [2.0.2](https://github.com/LabShare/lsc/compare/v2.0.1...v2.0.2) (2018-07-04)


### Bug Fixes

* .snyk & package.json to reduce vulnerabilities ([16b3349](https://github.com/LabShare/lsc/commit/16b3349))

## [2.0.1](https://github.com/LabShare/lsc/compare/v2.0.0...v2.0.1) (2018-06-28)


### Bug Fixes

* **tests:** enable CodeCov integration ([d91fda3](https://github.com/LabShare/lsc/commit/d91fda3))

# [2.0.0](https://github.com/LabShare/lsc/compare/v1.0.0...v2.0.0) (2018-06-17)


### Bug Fixes

* **cli:** remove "init" module loading system SHELL-1402 ([cfea075](https://github.com/LabShare/lsc/commit/cfea075))
* **cli:** remove recursive CLI command/config search SHELL-1402 ([b1952c0](https://github.com/LabShare/lsc/commit/b1952c0))
* **release:** simplify semantic-release config ([b5aa75e](https://github.com/LabShare/lsc/commit/b5aa75e))


### BREAKING CHANGES

* **cli:** CLI commands and configuration are no longer loaded
and parsed recursively via the "packageDependencies" package.json configuration.
This change allows multiple versions of LabShare dependencies to be installed at the same time
without creating versioning conflicts.

Migration:
Projects relying on the recursive CLI/config search are now required to explicitly specify which CLI/config dependencies to load in their top-level package.json "packageDependencies" field.
* **cli:** The top level "init" function loading feature has been
moved to an internal constructor option of the CliLoader class: "initFunctions".
Custom "init.js" files located in the project's cli directory will no longer be loaded automatically as custom CLI initialization functions.

# 1.0.0 (2018-06-09)


### Bug Fixes

* package.json & .snyk to reduce vulnerabilities ([4f48d3d](https://github.com/LabShare/lsc/commit/4f48d3d))
* **package:** update [@types](https://github.com/types)/shelljs to version 0.8.0 ([c510380](https://github.com/LabShare/lsc/commit/c510380))


### Features

* **git:** enforce commit message structure ([1b330dd](https://github.com/LabShare/lsc/commit/1b330dd))
* **npm:** integrate with semantic-release SHELL-1528 ([632dcdc](https://github.com/LabShare/lsc/commit/632dcdc))
