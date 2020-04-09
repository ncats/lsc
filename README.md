[![Coverage Status](https://coveralls.io/repos/github/LabShare/lsc/badge.svg?branch=master)](https://coveralls.io/github/LabShare/lsc?branch=master)
[![Build Status](https://travis-ci.org/LabShare/lsc.svg?branch=master)](https://travis-ci.org/LabShare/lsc)
[![codecov](https://codecov.io/gh/LabShare/lsc/branch/master/graph/badge.svg)](https://codecov.io/gh/LabShare/lsc)

# LSC

## Install

`npm i -g @labshare/lsc`

## Usage

Run `lsc help` to display a list of available commands.

## App Templates

Run `lsc create app` to display a list of available templates.

- api: API template powered by LoopBack and LabShare Services
- ui: UI template powered by Angular and LabShare Services
- cli: CLI template LabShare Services

## lsc Settings

To define the cliPattern and packageDependencies, you can use the `lsc` property at package.json

```json
  "lsc": {
    "cliPattern": "dist/cli/*.js",
    "packageDependencies":[]
  },
```

In the example , lsc is reading the package's cli commands from the `cliPattern` directory, also
is checking the packageDependencies from the same section.

## Package Dependencies

The add commands from other cli's labShare packages, you will need to specify the `packageDependencies`property at
the package.json file. This property can be defined inside the `lsc` property or as a root property at the `package.json` file.

This is an array of all the projects which contains cli commands, for example:

```json
   "packageDependencies": [
    "@labshare/services",
    "@labshare/lsc"
  ],
```

In the example , lsc is reading the package's cli commands from each module declared at `packageDependencies`,

## Documentation

### [How to define new CLI commands for LSC](docs/package-cli.md)

### [Working with package configuration files](docs/package-configuration-files.md) [Optional]

### Tests

`npm test`
