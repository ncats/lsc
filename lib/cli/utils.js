'use strict';

const fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    assert = require('assert'),
    glob = require('glob');

/**
 * @param {Object} manifest - A parsed package.json manifest
 * @returns {Array} A list of dependencies or an empty array
 * @private
 */
function getDependencies(manifest) {
    return Object.keys((manifest || {}).dependencies || {});
}

/**
 * @description Retrieves the LabShare package's name
 * @param {Object} manifest - A package.json parsed into a JS object
 */
exports.getPackageName = function (manifest) {
    if (!manifest || !(manifest.namespace || manifest.name)) {
        return null;
    }
    return (manifest.namespace || manifest.name).toLowerCase();
};

/**
 * @description Helper function for reading JSON files. It returns undefined if the JSON file does not
 * exist.
 * @throws Error if the JSON file could not be parsed
 * @param {string} filePath - The path to a JSON file
 * @returns {Object|undefined}
 */
exports.readJSON = function (filePath) {
    assert.ok(_.isString(filePath) && !_.isEmpty(filePath), 'readJSON: `filePath` must be a non-empty string');

    filePath = path.resolve(filePath);

    try {
        return JSON.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));
    } catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
            if (error.name === 'SyntaxError') {
                error.message = `Failed to parse: "${filePath}". ${error.message}`;
            }
            throw error;
        }
    }
};

/**
 * @description Checks if the directory contains a LabShare package.
 * @param {string} directory
 * @returns {Boolean}
 */
exports.isPackageSync = function isPackageSync(directory) {
    try {
        let manifest = exports.getPackageManifest(directory);
        return !!manifest;
    } catch (e) {
        return false;
    }
};

/**
 * @throws {Error} when the parsed manifest does not contain a 'name' property.
 *
 * @param {String} directory - A path to a directory
 * @returns {Object} containing parsed package.json data, otherwise null/undefined
 */
exports.getPackageManifest = function (directory) {
    assert.ok(_.isString(directory), 'getPackageManifest: `directory` must be a non-empty string');

    let manifestPath = path.resolve(directory, 'package.json'),
        manifest = exports.readJSON(manifestPath);

    if (!manifest) {
        return null;
    } else if (!exports.getPackageName(manifest)) {
        throw new Error(manifestPath + ' is missing a `name` property');
    }

    return manifest;
};

/**
 * @param {String} directory A LabShare package directory
 * @returns {String} The absolute path to the package's local config file
 */
exports.getPackageConfigPath = function (directory) {
    return path.resolve(directory, 'config.json');
};

/**
 * @description Synchronously applies the given function to each Node Module dependency referenced in the given directory.
 * @param {String} directory - A path to a directory containing LabShare project
 * @param {Function} func - A function that accepts a path to a LabShare project
 * @param {context} thisArg The context of `func`
 */
exports.applyToNodeModulesSync = function applyToNodeModulesSync(directory, func, thisArg) {
    assert.ok(_.isString(directory), 'applyToNodeModulesSync: `root` must be a non-empty string');
    assert.ok(_.isFunction(func), 'applyToNodeModulesSync: `func` must be a function');

    let loadedDependencies = {};

    function getDependenciesRecursively(nodeDependency) {
        let manifest = exports.getPackageManifest(nodeDependency),
            dependencies = getDependencies(manifest),
            dependencyPaths = [],
            id = path.basename(nodeDependency);

        func.call(thisArg, nodeDependency);
        loadedDependencies[id] = true;

        _.each(dependencies, dependency => {
            let dependencyPath = path.join(directory, 'node_modules', dependency);
            dependencyPaths.push(dependencyPath);
        });

        // Recursively search for any other dependencies
        _.map(dependencyPaths, dependencyPath => {
            let id = path.basename(dependencyPath);
            if (!_.has(loadedDependencies, id)) {
                return getDependenciesRecursively(dependencyPath);
            }
        });
    }

    getDependenciesRecursively(directory);
};

/**
 * Throws an exception if the pattern is empty or glob.sync has an error.
 *
 * @param {String} directory
 * @param {String} pattern A glob pattern
 * @returns {Array} of absolute file paths
 */
exports.getMatchingFilesSync = function (directory, pattern) {
    return glob.sync(pattern, {cwd: directory}).map((file) => {
        return path.resolve(directory, file);
    });
};
