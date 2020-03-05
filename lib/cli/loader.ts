/**
 * This module loads the CLI command modules located in LabShare packages.
 *
 * How to use:
 *  - Construct a CliLoader with a valid Flatiron app. An options object can be passed as a
 *  second argument to the constructor. To locate commands, specify options.cwd
 *  and/or a list of package directories in options.directories. View the constructor documentation below
 *  for more details on the available options.
 *  - Call .load() to locate and load all the cli commands and run the list of "initFunctions" passed to
 *  options.initFunctions.
 *  - Call .unload() to remove all the commands assigned to the Flatiron app set by .load().
 *  - Call .displayHelp() to display the list of loaded commands to the terminal
 */

'use strict';

import {
  getMatchingFilesSync,
  getPackageManifest,
  getPackageName,
  applyToNodeModulesSync,
  getPackageLscSettings,
} from './utils';
import path = require('path');
import _ = require('lodash');
import assert = require('assert');

const ADDITIONAL_COMMANDS_HEADER_TITLE = 'Additional commands',
  COMMAND_HEADER_TITLE = 'All commands',
  INIT_TIMEOUT = 5000,
  MISSING_COMMANDS_ERROR_MESSAGE = 'No commands found!';

function hasLogger(app): boolean {
  return app.log && app.log.warn && app.log.error && app.log.help;
}

function getBaseName(commandFile: string) {
  return path.basename(commandFile, path.extname(commandFile));
}

function createCommandHeader(name) {
  return ['', name, _.repeat('-', name.length)];
}

interface CliLoaderOptions {
  configFilePath?: string;
  cwd?: string;
  packageDirectory?: string;
  directories?: string | string[];
  timeout?: number;
  pattern?: string;
  initFunctions?: ((error?: Error) => any)[];
}

export class CliLoader {
  public _commands;

  private initFunctions;
  private app;
  private options: CliLoaderOptions;

  /**
   * @throws Error if the given app is not an initialized Flatiron app.
   *
   * @param {Object} app - An initialized Flatiron app with command storage and logging capabilities
   * @param {Object} options - Overrides default settings
   * @param {String} [options.pattern] - The pattern used to match files that contain cli commands. Default: 'cli/*.js'
   * @param {String} [options.cwd] - A relative or absolute path to a directory containing a LabShare packages. Default: ''
   * @param {Array} [options.directories] - A list of paths to LabShare packages that should be searched for CLI commands. Each directory
   * must contain a package.json to be considered valid. Default: []
   * @param {Number} [options.timeout] - How long to wait for the optional callback to be called in CLI package init functions
   *
   * @constructor
   */
  public constructor(app, options: CliLoaderOptions) {
    assert.ok(
      app.commands && hasLogger(app),
      '`app` must be a Flatiron app with command storage and logging capabilities',
    );
    assert.ok(
      app.plugins && app.plugins.cli,
      'The Flatiron cli plugin must be loaded by the app',
    );

    this.app = app;
    this._commands = {}; // format: {packageName1: {cmd1Name: 'path/to/cmd1Name', cmd2Name: 'path/to/cmd2Name', ...}, packageName2: ...}
    this.initFunctions = options.initFunctions || [];

    if (_.get(options, 'cwd')) {
      assert.ok(_.isString(options.cwd), '`options.cwd` must be a string');
      options.cwd = path.resolve(options.cwd);
    }

    if (_.get(options, 'directories')) {
      options.directories = _.map(
        _.isArray(options.directories)
          ? options.directories
          : [options.directories],
        directory => {
          assert.ok(
            _.isString(directory),
            '`options.directories` must contain non-empty strings',
          );
          return path.resolve(directory);
        },
      );
    }

    this.options = _.defaults(options || {}, {
      cwd: '',
      pattern: 'cli/*.js',
      directories: [],
      timeout: INIT_TIMEOUT,
    });
  }

  /**
   * @description Synchronously loads and caches all the LabShare package CLI command modules
   * found in the dependencies of options.cwd and/or options.directories.
   *
   * An error is logged if two different packages try to load a command with the same name, a command could not be loaded, or
   * if a command module does not contain help text.
   */
  public async load(): Promise<void> {
    const app = this.app;

    // Cache all init and command modules
    try {
      _.each(this.options.directories, this.storeCommands.bind(this));

      if (this.options.cwd) {
        applyToNodeModulesSync(this.options.cwd, this.storeCommands.bind(this));
      }
    } catch (error) {
      throw new Error(
        `Failed to load CLI commands: ${error.message}: ${error.stack}`,
      );
    }

    // Run all the init functions
    await this.init();

    // Load the commands into the app
    _.each(this._commands, pkg => {
      _.each(pkg, (modulePath, name) => {
        if (_.has(app.commands, name)) {
          return app.log.error(
            `Unable to load command "${name}" from "${modulePath}". A command with the same name has already been loaded by a different package.`,
          );
        }

        const command = require(modulePath);

        if (!command.usage) {
          app.log.warn(
            `The command module "${modulePath}" is missing a "usage" property that defines help text`,
          );
        }

        app.commands[name] = command;
      });
    });
  }

  /**
   * @description Synchronously unloads all the commands stored by the CLiLoader.
   */
  public unload() {
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
  public displayHelp() {
    const app = this.app,
      commands = this.getStoredCommandNames(),
      additionalCommands = this.getUncategorizedCommands();

    let help = [];

    if (_.isEmpty(commands) && _.isEmpty(additionalCommands)) {
      return app.log.help(MISSING_COMMANDS_ERROR_MESSAGE);
    }

    help = help.concat([COMMAND_HEADER_TITLE], commands);

    if (!_.isEmpty(additionalCommands)) {
      help = help.concat(
        createCommandHeader(ADDITIONAL_COMMANDS_HEADER_TITLE),
        additionalCommands,
      );
    }

    _.each(help, (message: string) => {
      app.log.help(message);
    });
  }

  /**
   * @description Runs the stored initializer functions
   * @returns {Promise}
   * @private
   */
  private async init() {
    const promises = [];

    _.each(this.initFunctions, initFn => {
      promises.push(
        new Promise((resolve, reject) => {
          // if it has a callback parameter
          if (initFn.length) {
            initFn(error => {
              if (error) {
                reject(error);
              }

              resolve();
            });

            setTimeout(() => {
              reject(
                new Error(
                  'LSC TIMEOUT ERROR: init function timed out. The function' +
                    ` "${initFn.toString()}" failed to callback within ${this
                      .options.timeout / 1000}` +
                    ' seconds`))',
                ),
              );
            }, this.options.timeout);
          } else {
            initFn();
            resolve();
          }
        }),
      );
    });

    return Promise.all(promises);
  }

  /**
   * @description Locates all the command modules starting from the given directory
   * and then stores them in this._commands.
   * @param {String} directory - An absolute path to a directory
   * @private
   */
  private storeCommands(directory: string): void {
    const manifest = getPackageManifest(directory);
    if (!manifest) {
      return;
    }

    const packageName = getPackageName(manifest);
    const lscSettings = getPackageLscSettings(manifest);
    const pattern = lscSettings?.cliDir
      ? `${lscSettings.cliDir}/*.js`
      : this.options.pattern;
    const commands = this.getCommands(directory, pattern);
    _.each(commands, (command, name: string) => {
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
   */
  private getStoredCommandNames(): string[] {
    let allCommands = [];
    const commands = this._commands;

    _.each(commands, (pkgCommands, pkgName: string) => {
      const commandList = _.keys(pkgCommands);
      if (_.isEmpty(commandList)) {
        return;
      }
      allCommands = allCommands.concat(
        createCommandHeader(pkgName),
        commandList,
      );
    });

    return allCommands;
  }

  /**
   *
   * @param directory
   * @param pattern
   * @returns {{}}
   * @private
   */
  private getCommands(directory: string, pattern: string) {
    const commands = {},
      commandFilePaths = getMatchingFilesSync(directory, pattern);

    for (const commandFilePath of commandFilePaths) {
      const baseName = getBaseName(commandFilePath);
      commands[baseName] = commandFilePath;
    }

    return commands;
  }

  /**
   * @description Retrieves all the command names stored in the Flatiron app that were not
   * stored by the CliLoader.
   * @returns {Array} A list of command names.
   */
  private getUncategorizedCommands(): string[] {
    const appCommands = _.keys(this.app.commands),
      storedCommands = _.values(this._commands);

    return _.filter(appCommands, command => {
      return !_.some(storedCommands, storedCommand => {
        return _.has(storedCommand, command);
      });
    });
  }
}
