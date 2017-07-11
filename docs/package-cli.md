### Defining CLI commands

#### Preparation

`npm i -g lsc`

#### Project scaffolding

Create a directory for your CLI project. Then run `lsc package create` inside the new directory and select the `cli` package type.

#### Adding commands

To define new CLI commands, create Node.js modules inside the `cli` directory of your project. Command help
text can be defined by adding a `usage` array property to the module exports object. The file name of each CLI module
defines the main command name and function names exported by the module define sub-commands. Each main command name
must be unique.

Example:
```javascript
// example-cli-package/cli/greeting.js

// The help text for the 'greeting' command. The help text can be displayed with `lsc help greeting`.
exports.usage = [
    'lsc greeting hello <name> - Say hello to <name>',
    'lsc greeting goodbye <name> - Say goodbye to <name>'
];

// In this case, the property 'hello' is a sub-command of 'greeting'.
// It can be invoked using `lsc greeting hello <name>`.
exports.hello = function (name, callback) {
    this.log.info('Hello ' + name + '!');
    
    // Note: each command receives an optional callback function as the last argument. It can be used to signal the success or
    // failure of a command using the Node.js callback convention of passing null on success or an Error object on failure.
    callback(null);
};

exports.goodbye = function (name) {
    this.log.info('Goodbye ' + name + '!');  // Note: `this` stores a reference to the initialized CLI app which contains logging capabilities
};
```

To run the example commands, you would type `lsc greeting <sub-command>` (e.g. `lsc greeting hello`) with the `example-cli-package` as the current directory.
