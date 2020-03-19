# <%= appTitle %>

This project was generated with [lsc](https://github.com/labshare/lsc).

# Run Example
```sh
lsc demo
```

# Adding commands
For adding commands, inside your cli folder create a `file`. Inside the `file` create and export functions.
For example:
```sh
// inside file.ts
export function test() {
  logger.info('test');
}
```
or
```sh
// inside file.ts
// if async
export async function test() {
  logger.info('test');
}
```
Run:
`lsc file test`

## Build

Run `lsc build site` to build the project. The build artifacts will be stored in the `dist/` directory. For more
information check [Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## lsc Configuration

To change the lsc package configuration for using typescript you need to change the lsc property at `package.json`:

```json
 "lsc": {
    "cliPattern": "dist/cli/*.js"
  },
```

For adding package dependencies you can use the `packageDependencies` section  at the `lsc` property or the property `packageDependencies` at `package.json`:
```json
  // at package.json
 "lsc": {
    "cliPattern": "dist/cli/*.js",
    "packageDependencies": ["dependency-1"]
  },
```
or
```json
  // at package.json
    "packageDependencies": ["dependency-1"]
```

## Running tests

Run `npm test` to execute the unit tests via.

## Further help

To get more help on the lsc CLI go check out the
[LSC CLI README](https://github.com/angular/lsc/blob/master/README.md).
