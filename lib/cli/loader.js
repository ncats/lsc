/**
 * This module loads the CLI command modules located in LabShare packages.
 *
 * How to use:
 *  - Construct a CliLoader with a valid Flatiron app.  An options object can be passed as a
 *  second argument to the constructor.  To locate commands, specify options.main
 *  and/or a list of package directories in options.directories.  View the constructor documentation
 *  for more details on the available options.
 *  - Call .load() to locate and load all the LabShare package cli commands specified by the options.
 *  - Call .unload() to remove all the commands assigned to the Flatiron app set by .load().
 *  - Call .displayHelp() to display the list of loaded commands to the terminal
 */

'use strict';

const path = require('path'),
    _ = require('lodash'),
    assert = require('assert'),
    cliUtils = require('./utils'),
    ADDITIONAL_COMMANDS_HEADER_TITLE = 'Additional commands',
    COMMAND_HEADER_TITLE = 'All commands',
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

function getCommands(directory, pattern) {
    var commands = {},
        commandFiles = cliUtils.getMatchingFilesSync(directory, pattern);
    _.each(commandFiles, commandFile => {
        commands[getBaseName(commandFile)] = require(commandFile);
    });
    return commands;
}

class CliLoader {

    /**
     * @throws Error if the given app is not an initialized Flatiron app.
     *
     * @param {String} app - An initialized Flatiron app with command storage and logging capabilities
     * @param {Object} options - Overrides default settings
     * @param {String} options.pattern - The pattern used to match files that contain cli commands (e.g. 'src/cli/*.js')
     * @param {String} options.main - A relative or absolute path to a directory containing a LabShare packages. Default: ''
     * @param {Array} options.directories - A list of paths to LabShare packages that should be searched for CLI commands. Each directory
     * must contain a package.json to be considered valid. Default: []
     *
     * @constructor
     */
    constructor(app, options={}) {
        assert.ok(app.commands && hasLogger(app), '`app` must be a Flatiron app with command storage and logging capabilities');
        assert.ok(app.plugins && app.plugins.cli, 'The Flatiron cli plugin must be loaded by the app');

        this.app = app;
        this._commands = {};  // stored command format: {packageName1: {cmd1Name: true, cmd2Name: true, ...}, packageName2: ...}

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
            directories: []
        });
    }

    /**
     * @description Synchronously loads and caches all the LabShare package CLI command modules
     * found in options.packageDirectory and/or options.directories.
     *
     * It stops and logs an error if it failed to load a command.
     */
    load() {
        try {
            _.each(this.options.directories, this._setCommands.bind(this));
            if (this.options.main) {
                cliUtils.applyToNodeModulesSync(this.options.main, this._setCommands.bind(this));
            }
        } catch (error) {
            this.app.log.error(`Failed to load package commands: ${error.message}`, error.stack);
        }
    };

    /**
     * @description Synchronously unloads all the commands stored by the CLiLoader.
     */
    unload() {
        var app = this.app;
        _.each(this._commands, pkg => {
            _.each(_.keys(pkg), name => {
                delete app.commands[name];
            });
        });
        this._commands = {};
    };

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
    };

    /**
     * @description Assigns the given command to the Flatiron app. Duplicate command names are ignored
     * if the command(s) originated from the same package.
     *
     * An error is logged if two different packages try to load a command with the same name and
     * a warning is logged if the given command module does not contain help text.
     *
     * @param {String} name The name of the command
     * @param {String} command A CLI command module
     * @param {String} packageName The name of the LabShare package that contains the command
     * @private
     */
    _setCommand(name, command, packageName) {
        var app = this.app;
        this._commands[packageName] = this._commands[packageName] || {};

        if (_.has(this._commands[packageName], name)) {
            return;
        }
        if (_.has(app.commands, name)) {
            let error = 'Unable to load command: "' + name + '" from package "' + packageName +
                '". A command with the same name has already been loaded by a different package.';
            return app.log.error(error);
        }
        if (!command.usage) {
            app.log.warn('The command "' + name + '" is missing help text');
        }

        app.commands[name] = command;
        this._commands[packageName][name] = true;
    };

    /**
     * @description Locates all the command modules starting from the given directory
     * then assigns them to the Flatiron app.
     * @param {String} directory An absolute path to a directory
     * @private
     */
    _setCommands(directory) {
        var manifest = cliUtils.getPackageManifest(directory);
        if (!manifest) {
            return;
        }
        let commands = getCommands(directory, this.options.pattern);
        _.each(commands, (command, name) => {
            this._setCommand(name, command, cliUtils.getPackageName(manifest));
        });
    };

    /**
     * @description Retrieves the names of all the stored commands and formats them.
     * @returns {Array} of command names categorized by package names
     * @private
     */
    _getStoredCommandNames() {
        var allCommands = [],
            commands = this._commands;
        _.each(commands, (pkgCommands, pkgName) => {
            var commandList = _.keys(pkgCommands);
            if (_.isEmpty(commandList)) {
                return;
            }
            allCommands = allCommands.concat(createCommandHeader(pkgName), commandList);
        });
        return allCommands;
    };

    /**
     * @description Retrieves all the command names stored in the Flatiron app that were not
     * stored by the CliLoader.
     * @returns {Array} A list of command names.
     * @private
     */
    _getUncategorizedCommands() {
        var appCommands = _.keys(this.app.commands),
            storedCommands = _.values(this._commands);
        return _.filter(appCommands, command => {
            return !_.some(storedCommands, storedCommand => {
                return _.has(storedCommand, command);
            });
        });
    };
}

module.exports = CliLoader;
