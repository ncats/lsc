# <%= appTitle %>

## Overview

This is a template project that will create a base library.

## Tutorial

- Install all the packages: `npm i`

* To build this project as a production bundle, you need to use the command
  line: `lsc build lib`

* **Note** To build correctly you must update the public_api.ts file with all
  your publicly exported components.

* If you have to install a new dependency, prefer adding it to `devDependencies`
  and `peerDependencies` instead of `dependencies` field in package.json

* If there needs to be any `dependencies` that not peer or dev dependencies, add
  them to the whitelist located in `ng-package.json`

* If you need to load an image in your component:

* If you need to load an image in your component:

  1. Add a variable to your component as follows. E.g.:
     `myImg = require('@labshare/ngx-labshare-base/src/assets/my-image.png')`
  2. Inject into template: `<img [src]="myImg" />`

  - Please note that the require path above **must** be referenced from
    `@labshare/ngx-labshare-base/src/assets` to ensure consistent loading
    behavior.

* For more information, go to @labshare/shell-ui.

## Contents

- **scripts** - Any scripts needed for your library.
- **src** - Where the main bulk of your code will live.
- **assests**: Any public assests, such as images, go here.
- **base-lib**: Where you will add your libraries components.
- **shared**: Any shared services, pipes, or directives should go here.
- **test**: Test files will live in this directory.
- **App Module**: Main module.

## NPM Scripts

- **build**: Builds the site
- **test**: Run tests
- **coverage**: Run coverage
- **commitmsg**: Checks the commit messages
- **semantic-release**: Runs the semantic release
- **prettier**: Run prettier for fixing the code structure
- **lint**: Run lint for checking the code
- **lint:fix**: Fixes all lint and prettier issues
- **tslint**: Run tslint for checking ts code
- **tslint:fix**: Fixes any tslint issues
- **prettier:check**: Check the code with Prettier
- **prettier:cli**: Run the prettier cli
- **prettier:fix**:Fixes any prettier issue

## Docs

Section for the project's documentation.

## TravisCI

The [travisCI](https://travis-ci.com/) file configuration.

## Codecov

[Codecov](https://codecov.io) configuration File.

## License

MIT
