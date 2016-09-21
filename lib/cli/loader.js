/**
 * This module loads the CLI command modules located in LabShare packages.
 *
 * How to use:
 *  - Construct a CliLoader with a valid Flatiron app. An options object can be passed as a
 *  second argument to the constructor. To locate commands, specify options.main
 *  and/or a list of package directories in options.directories. View the constructor documentation below
 *  for more details on the available options.
 *  - Call .load() to locate and load all the cli commands and run the 'init' modules defined by LabShare CLI packages.
 *  - Call .unload() to remove all the commands assigned to the Flatiron app set by .load().
 *  - Call .displayHelp() to display the list of loaded commands to the terminal
 */

'use strict';

const path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    assert = require('assert'),
    cliUtils = require('./utils'),
    ADDITIONAL_COMMANDS_HEADER_TITLE = 'Additional commands',
    COMMAND_HEADER_TITLE = 'All commands',
    INIT_TIMEOUT = 5000,
    MISSING_COMMANDS_ERROR_MESSAGE = 'No commands found!';

function hasLogger(app) {
    return app.log && app.log.warn && app.log.error && app.log.help;
}

function getBaseName(commandFile) {
    return path.basename(commandFile, path.extname(commandFile));
}

function createCommandHeader(name) {
    return ['', name, _.repeat('-', name.length)];
}

class CliLoader {

    /**
     * @throws Error if the given app is not an initialized Flatiron app.
     *
     * @param {Object} app - An initialized Flatiron app with command storage and logging capabilities
     * @param {Object} options - Overrides default settings
     * @param {String} [options.pattern] - The pattern used to match files that contain cli commands. Default: 'cli/*.js'
     * @param {String} [options.main] - A relative or absolute path to a directory containing a LabShare packages. Default: ''
     * @param {Array} [options.directories] - A list of paths to LabShare packages that should be searched for CLI commands. Each directory
     * must contain a package.json to be considered valid. Default: []
     * @param {Number} [options.timeout] - How long to wait for the optional callback to be called in CLI package init functions
     *
     * @constructor
     */
    constructor(app, options = {}) {
        assert.ok(app.commands && hasLogger(app), '`app` must be a Flatiron app with command storage and logging capabilities');
        assert.ok(app.plugins && app.plugins.cli, 'The Flatiron cli plugin must be loaded by the app');

        this.app = app;
        this._commands = {};        // format: {packageName1: {cmd1Name: 'path/to/cmd1Name', cmd2Name: 'path/to/cmd2Name', ...}, packageName2: ...}
        this._initModules = [];     // format: ['path/to/init.js', ...]

        if (options.main) {
            assert.ok(_.isString(options.main), '`options.main` must be a string');
            options.main = path.resolve(options.main);
        }
        if (options.directories) {
            options.directories = _.isArray(options.directories) ? options.directories : [options.directories];
            options.directories = _.map(options.directories, directory => {
                assert.ok(_.isString(directory), '`options.directories` must contain non-empty strings');
                return path.resolve(directory);
            });
        }

        this.options = _.defaults(options, {
            main: '',
            pattern: 'cli/*.js',
            directories: [],
            timeout: INIT_TIMEOUT
        });
    }

    /**
     * @description Synchronously loads and caches all the LabShare package CLI command modules
     * found in the dependencies of options.main and/or options.directories. It also caches the
     * CLI 'init' functions defined by the modules.
     *
     * An error is logged if two different packages try to load a command with the same name, a command could not be loaded, or
     * if a command module does not contain help text.
     */
    load(callback) {
        let app = this.app;

        // Cache all init and command modules
        try {
            if (this.options.main) {
                cliUtils.applyToNodeModulesSync(this.options.main, this._storeCommands.bind(this));
            }
            _.each(this.options.directories, directory => {
                if (directory === this.options.main) {
                    return;
                }
                this._storeCommands(directory);
            });
        } catch (error) {
            return Q.reject(new Error(`Failed to load CLI commands: ${error.message}`, error.stack)).nodeify(callback);
        }

        // Run all the init functions
        return this._init().then(() => {

            // Load the commands into the app
            _.each(this._commands, pkg => {
                _.each(pkg, (modulePath, name) => {
                    if (_.has(app.commands, name)) {
                        return app.log.error(`Unable to load command "${name}" from "${modulePath}". A command with the same name has already been loaded by a different package.`);
                    }

                    let command = require(modulePath);
                    if (!command.usage) {
                        app.log.warn(`The command module "${modulePath}" is missing a "usage" property that defines help text`);
                    }

                    app.commands[name] = command;
                });
            });
        }).nodeify(callback);
    }

    /**
     * @description Synchronously unloads all the commands stored by the CLiLoader.
     */
    unload() {
        _.each(this._commands, pkg => {
            _.each(_.keys(pkg), name => {
                delete this.app.commands[name];
            });
        });
        this._commands = {};
    }

    /**
     * @description Displays a list of available commands.
     */
    displayHelp() {
        let app = this.app,
            help = [],
            commands = this._getStoredCommandNames(),
            additionalCommands = this._getUncategorizedCommands();

        if (_.isEmpty(commands) && _.isEmpty(additionalCommands)) {
            return app.log.help(MISSING_COMMANDS_ERROR_MESSAGE);
        }

        help = help.concat([COMMAND_HEADER_TITLE], commands);

        if (!_.isEmpty(additionalCommands)) {
            help = help.concat(createCommandHeader(ADDITIONAL_COMMANDS_HEADER_TITLE), additionalCommands);
        }

        _.each(help, function (message) {
            app.log.help(message);
        });
    }

    /**
     * @description Runs the stored LabShare CLI package init functions
     * @param {Function} [callback]
     * @returns {Promise}
     * @private
     */
    _init(callback) {
        let promises = [];

        _.each(this._initModules, initModulePath => {
            promises.push(Q.Promise((resolve, reject) => {
                let init = null;
                try {
                    init = require(initModulePath);
                } catch (error) {
                    return reject(new Error(`LSC LOAD ERROR: failed to load init module at ${initModulePath}: ${error.stack}`));
                }

                // if it has a callback parameter
                if (init.length) {
                    init(error => {
                        if (error) {
                            reject(error);
                        }
                        resolve();
                    });

                    setTimeout(() => {
                        reject(new Error(`LSC TIMEOUT ERROR: init function in "${initModulePath}" failed to callback within ${this.options.timeout / 1000} seconds`));
                    }, this.options.timeout);
                } else {
                    init();
                    resolve();
                }
            }));
        });

        return Q.all(promises).nodeify(callback);
    }

    /**
     * @description Locates all the command modules starting from the given directory
     * and then stores them in this._commands.
     * @param {String} directory - An absolute path to a directory
     * @private
     */
    _storeCommands(directory) {
        let manifest = cliUtils.getPackageManifest(directory);
        if (!manifest) {
            return;
        }

        let packageName = cliUtils.getPackageName(manifest),
            commands = this._getCommands(directory, this.options.pattern);

        _.each(commands, (command, name) => {
            this._commands[packageName] = this._commands[packageName] || {};

            if (_.has(this._commands[packageName], name)) {
                return;
            }

            this._commands[packageName][name] = command;
        });
    }

    /**
     * @description Retrieves and organizes the names of all the stored commands.
     * @returns {Array} of command names categorized by package names
     * @private
     */
    _getStoredCommandNames() {
        let allCommands = [],
            commands = this._commands;

        _.each(commands, (pkgCommands, pkgName) => {
            var commandList = _.keys(pkgCommands);
            if (_.isEmpty(commandList)) {
                return;
            }
            allCommands = allCommands.concat(createCommandHeader(pkgName), commandList);
        });

        return allCommands;
    }

    _getCommands(directory, pattern) {
        let commands = {},
            commandFilePaths = cliUtils.getMatchingFilesSync(directory, pattern);

        _.each(commandFilePaths, commandFilePath => {
            let baseName = getBaseName(commandFilePath);

            // Store 'init' modules separately
            if (/^init$/i.test(baseName)) {
                this._initModules.push(commandFilePath);
            } else {
                commands[baseName] = commandFilePath;
            }
        });

        return commands;
    }

    /**
     * @description Retrieves all the command names stored in the Flatiron app that were not
     * stored by the CliLoader.
     * @returns {Array} A list of command names.
     * @private
     */
    _getUncategorizedCommands() {
        let appCommands = _.keys(this.app.commands),
            storedCommands = _.values(this._commands);

        return _.filter(appCommands, command => {
            return !_.some(storedCommands, storedCommand => {
                return _.has(storedCommand, command);
            });
        });
    }
}

module.exports = CliLoader;
