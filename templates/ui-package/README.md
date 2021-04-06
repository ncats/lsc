# <%= appTitle %>

This project was generated with [lsc](https://github.com/labshare/lsc).

## Development server

Run `lsc start site` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you
change any of the source files.

## Electron app

Run `lsc start electron` to create an electron app. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## Build

Run `lsc build site` to build the project. The build artifacts will be stored in the `dist/` directory. For more
information check [Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## Build Electron Package

Run `lsc build electron --platform={mac|windows|linux}` to build the project. The build artifacts will be stored in the
`dist/` directory. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## SharePoint app

Run `lsc build sharepoint --platform={mac|windows|linux}` to create a sharepoint app. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## Cordova app

Run `lsc build cordova --platform={ios|android|browser}` to create a cordova app. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## Start Cordova app

Run `lsc start cordova --platform={ios|android|browser}` to start the generated cordova app. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).

## Angular Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Env Vars

For adding env vars , you can use the .env file. For more information check
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md)..

## Further help

To get more help on the shell-ui and lsc CLI go check out the
[Shell CLI README](https://github.com/angular/shell-ui/blob/master/README.md).
[LSC CLI README](https://github.com/angular/lsc/blob/master/README.md).

## Cypress Configuration
- `NPM_TOKEN`: An npm install token with access to the organization private repos.
- `AWS_ACCESS_TOKEN`: An access token to AWS S3 Buckets service
- `PROJECT_ID`: Your project's name in **slug-case**
- `AWS_BUCKET_NAME`: Bucket to which Cypress videos will be uploaded to
- `SLACK_WEBHOOK`: Webhook id to send messages to Slack in case Cypress Testing fails
