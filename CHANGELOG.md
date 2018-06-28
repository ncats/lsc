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
