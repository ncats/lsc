# <%= appTitle %>

## Overview

This is a template project with all the LabShare's features, such as Authentication, Usage, Configuration and more.

## Tutorial

- Install all the packages: `npm i`

- To run this project in development mode, you need to use the command line: `lsc start site`

* To run this project as a desktop app, you need to use the command line: `lsc start app`

* To build this project as a production bundle, you need to use the command line: `lsc build site`

* For more information, go to @labshare/shell-ui.

## Contents

- **UI** - Main UI folder.
- **App** - Main App Folder.
- **Core**: Main Functionality module, all the current's project logic should go here.
- **Shell**: Shell Module, all the default routes, and services initialization goes here.
- **Theme**: UI Module, all the settings for the main ui module goes here.
- **Ngx Forms Extension**: UI Module for creating dynamic forms based on json.
- **app-routing**: Main Routing module.
- **App Module**: Main module.

## Application Configuration

For adding configuration to the application, you have two options:

- Create a config.json file at the root folder (legacy version).
- Change the default values at default.json; With this approach, you can take advantage of
  [configjs](https://www.npmjs.com/package/config) and have several features like: Support for multiple configurations:
  Add a file with the name of the configuration you will like to use: `staging.json` For loading lsc with the new
  configuration, type:

```sh
lsc start site --config=staging
```

Adding the `--config={name of the environment}`, allows you to have multiple configurations.

If you desire to use environment variables, you can create a .env file and change the configuration to either
`default.ts` or `default.js` and export the process.env.VARIABLE_NAME:

```js
//default.js
module.exports ={
"configuration_value" : process.env.VALUE;
}
```

## Environment Configuration

If you want to change your environment configuration, you will need to the .labsharerc file, there are the options:

```json
{
  "tsConfig": "tsconfig.json", // path to you tsconfig file
  "build": {
    // build options
    "main": "ui/main", // main entry point
    "polyfills": "ui/polyfills", // polyfills path
    "assets": "ui/assets", // assets folder
    "app": "ui/app", // app path
    "index": "ui/index.ejs" // index file
  },
  "serve": {
    // development server
    "open": true, // open a new browser window
    "hot": true, // hot reload
    "port": 8080, // development port
    "historyApiFallback": true, // history api fallback
    "stats": "minimal" // stats
    // you can add more settings, check webpack dev server options for more // information
  }
}
```

## NPM Scripts

- **start**: Starts the site in dev mode
- **test:watch**: Tests and development with watch
- **test**: Run tests
- **coverage**: Run coverage
- **prettier**: Run prettier for fixing the code structure
- **lint**: Run lint for checking the code
- **lint:fix**: Fixes all lint and prettier issues
- **tslint**: Run tslint for checking ts code
- **tslint:fix**: Fixes any tslint issues
- **prettier:check**: Check the code with Prettier
- **prettier:cli**: Run the prettier cli
- **prettier:fix**:Fixes any prettier issue
- **build**: Builds the site
- **commitmsg**: Checks the commit messages
- **semantic-release**: Runs the semantic release

## Docs

Section for the project's documentation.

## TravisCI

The [travisCI](https://travis-ci.com/) file configuration.

## Codecov

[Codecov](https://codecov.io) configuration File.

## License

MIT
