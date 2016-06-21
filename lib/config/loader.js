/**
 * This module defines async and sync functions that can load LabShare package config file data.  The returned
 * config object's properties are read-only.
 *
 * Example:
 * // packages/package-name/config.json
 * {
 *     "value": 3,
 *     "string": "a-string"
 * }
 * 
 * let configLoader = require('config-loader');
 *
 * // Synchronous version (throws exceptions)
 * configLoader.sync({ packageDirectory: './path/to/packages' });
 * //>>> { 'package-name': { value: 3, string: 'a-string' } }
 */

'use strict';

const _ = require('lodash'),
    path = require('path'),
    assert = require('assert'),
    override = require('json-override'),
    cliUtils = require('../cli/utils');

/**
 * Assigns the package configuration object to the given config object.
 *
 * @throws Error if cliUtils.readJSON fails.
 *
 * @param {String} directory A LabShare package directory
 * @param {Object} config Contains configuration data
 */
function loadConfig(directory, config) {
    var pkgConfigPath = cliUtils.getPackageConfigPath(directory),
        manifest = cliUtils.getPackageManifest(directory);

    if (!manifest) {
        return;
    }

    var name = cliUtils.getPackageName(manifest),
        pkgConfig = config[name] || cliUtils.readJSON(pkgConfigPath);

    config[name] = pkgConfig || {};
}

/**
 * @throws an exception if invalid options are provided.
 *
 * @param {Object} options
 * @param {string} [options.packageDirectory] - A relative or absolute path to a directory containing LabShare
 * packages as subdirectories. Default: ''
 * @param {string} options.main - The current, top-level project directory
 * @param {Array} [directories] - A list of paths to LabShare packages that should be searched for CLI commands. Each directory
 * must contain a package.json to be considered valid. Default: []
 * @constructor
 */
class ConfigLoader {
    constructor(options={}) {
        if (options.main) {
            assert.ok(_.isString(options.main), '`options.main` must be a string');
            options.main = path.resolve(options.main);
        }

        if (options.packageDirectory) {
            assert.ok(_.isString(options.packageDirectory), '`options.packageDirectory` must be a string');
            options.packageDirectory = path.resolve(options.packageDirectory);
        }
        if (options.directories) {
            options.directories = _.isArray(options.directories) ? options.directories : [options.directories];
            options.directories = _.map(options.directories, directory => {
                assert.ok(_.isString(directory), '`options.directories` must contain non-empty strings');
                return path.resolve(directory);
            });
        }

        this.options = options;
    }

    /**
     * @throws Error if a JSON config file could not be parsed.  Missing config.json files are silently ignored.
     * @returns {Object} containing read-only access to config data organized by LabShare package names.
     */
    sync() {
        let config = {};

        try {
            if (this.options.main) {
                cliUtils.applyToNodeModulesSync(this.options.main, directory => {
                    loadConfig(directory, config);
                });
            }
            _.each(this.options.directories, (directory) => {
                loadConfig(directory, config);
            });
        } catch (error) {
            throw new Error('Failed to load config file: ' + error.message || error);
        }

        this._overrideValues(config);
        return config;
    };

    /**
     * @description Overrides configuration values of each package when they are
     * After overriding configuration values, the override objects are purged from the config object.
     *
     * Example:
     * var config = {
     *  pack1: { val: 'original' },
     *  pack2: { pack1: { val: 'new' } }
     *
     * _overrideValues(config)
     * >>> { pack1: { val: 'new' }, pack2: {} }
     *
     * @param {Object} config - it contains package configuration data
     * @private
     */
    _overrideValues(config) {
        // Remove all the 'config overrides' to ensure the resulting config object is tidy
        _.each(config, (packageConfig, packageName) => {
            _.each(packageConfig, (value, key) => {
                if (_.has(config, key)) {
                    config[key] = override(config[key], value);
                    delete config[packageName][key];
                }
            });
        });
    };
}

// Expose the sync version and the constructor
module.exports.sync = function configLoaderSync(options) {
    var configLoader = new ConfigLoader(options);
    return configLoader.sync();
};

module.exports.ConfigLoader = ConfigLoader;
