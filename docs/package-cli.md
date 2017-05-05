### Creating a CLI project

 - `npm i -g lsc`
 - Create a new directory to store the CLI project
 - Run `lsc package create` inside the CLI project directory and select the `cli` type

### Creating new CLI commands

To define new CLI commands, add Node.js modules inside the 'cli' directory of your LabShare CLI project. Command help
text can be defined by exporting a `usage` array property containing lines of text. The file name of each CLI module
defines the main command name and function names exported by the module define sub-commands. Each main command name
must be unique.

Example:
```javascript
// example-cli-package/cli/greeting.js
// 'hello' is a sub-command of 'greeting'
// After the LabShare Shell loads the 'greeting' module, 'hello' can be invoked using `lsc greeting hello <name>`.
exports.hello = function (name, cb) {
    this.log.info('Hello ' + name + '!');
    cb(null);
};
exports.goodbye = function (name, cb) {
    this.log.info('Goodbye ' + name + '!');  // `this` stores a reference to the initialized CLI app which contains logging capabilities
    cb(null);
};
// The help text for the 'greeting' command.  The help text can be displayed with `lsc help greeting`.
exports.usage = [
    'lsc greeting hello <name> - Say hello to <name>',
    'lsc greeting goodbye <name> - Say goodbye to <name>'
];
```

To run the example commands, you would type `lsc greeting <sub-command>` (e.g. `lsc greeting hello`) with the `example-cli-package` as the current directory.