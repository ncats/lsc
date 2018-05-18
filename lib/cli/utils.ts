'use strict';

const fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    assert = require('assert'),
    glob = require('glob'),
    resolve = require('resolve-pkg');

/**
 * @param manifest - A parsed LabShare package package.json file
 * @returns {Array} A list of LabShare package dependencies or an empty array
 * @private
 */
function getPackageDependencies(manifest): string[] {
    return (_.isObject(manifest) && _.isObject(manifest.packageDependencies))
        ? (_.isArray(manifest.packageDependencies) ? manifest.packageDependencies : Object.keys(manifest.packageDependencies))
        : [];
}

/**
 * @description Retrieves the LabShare package's name
 * @param {Object} manifest - A package.json parsed into a JS object
 */
export function getPackageName(manifest): string {
    if (!manifest || !(manifest.namespace || manifest.name)) {
        return null;
    }
    return (manifest.namespace || manifest.name).toLowerCase();
}

/**
 * @description Helper function for reading JSON files. It returns undefined if the JSON file does not
 * exist.
 * @throws Error if the JSON file could not be parsed
 * @param {string} filePath - The path to a JSON file
 * @returns {Object|undefined}
 */
export function readJSON(filePath) {
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
}

/**
 * @description Checks if the directory contains a LabShare package.
 * @param {string} directory
 * @returns {Boolean}
 */
export function isPackageSync(directory): boolean {
    try {
        let manifest = getPackageManifest(directory);
        return !!manifest;
    } catch (e) {
        return false;
    }
}

/**
 * @Throws Error when the parsed manifest does not contain a 'name' property.
 *
 * @param {String} directory - A path to a directory
 * @returns {Object} containing parsed package.json data, otherwise null/undefined
 */
export function getPackageManifest(directory) {
    assert.ok(_.isString(directory), 'getPackageManifest: `directory` must be a non-empty string');

    let manifestPath = path.resolve(directory, 'package.json'),
        manifest = readJSON(manifestPath);

    if (!manifest) {
        return null;
    } else if (!getPackageName(manifest)) {
        throw new Error(manifestPath + ' is missing a `name` property');
    }

    return manifest;
}

/**
 * @param {String} directory A LabShare package directory
 * @returns {String} The absolute path to the package's local config file
 */
export function getPackageConfigPath(directory: string): string {
    return path.resolve(directory, 'config.json');
}

/**
 * @description Synchronously applies the given function to each LabShare package inside the given directory.
 * If one of the packages is a symlink, it will locate the original symlink source directory
 * and call the function on it instead.
 * @throws Error if a package dependency could not be found
 * @param {String} directory - A path to a directory containing LabShare package.
 * @param {Function} func - A function that accepts a path to a LabShare project
 * @param thisArg The context of `func`
 */
export function applyToNodeModulesSync(directory: string, func: (packagePath: string) => void, thisArg?: any): void {
    assert.ok(_.isString(directory), 'applyToNodeModulesSync: `root` must be a non-empty string');
    assert.ok(_.isFunction(func), 'applyToNodeModulesSync: `func` must be a function');

    let loadedDependencies = {};

    if (!isPackageSync(directory)) {
        return;
    }

    function getDependenciesRecursively(packagePath) {
        let manifest = getPackageManifest(packagePath),
            dependencies = getPackageDependencies(manifest),
            dependencyPaths = [],
            id = path.basename(packagePath);

        func.call(thisArg, packagePath);
        loadedDependencies[id] = true;

        _.each(dependencies, dependency => {
            const dependencyPath = resolve(dependency, {cwd: packagePath});

            if (!dependencyPath) {
                throw new Error(`"${id}" depends on "${dependency}" but it does not exist in "${dependencyPath}". Make sure it is installed!`);
            }

            dependencyPaths.push(dependencyPath);
        });

        // Recursively search for any other dependencies
        _.map(dependencyPaths, (dependencyPath: string) => {
            let id = path.basename(dependencyPath);

            if (!_.has(loadedDependencies, id)) {
                return getDependenciesRecursively(dependencyPath);
            }
        });
    }

    getDependenciesRecursively(directory);
}

/**
 * Throws an exception if the pattern is empty or glob.sync has an error.
 *
 * @param {String} directory
 * @param {String} pattern A glob pattern
 * @returns {Array} of absolute file paths
 */
export function getMatchingFilesSync(directory, pattern): string[] {
    return glob.sync(pattern, {cwd: directory}).map((file) => {
        return path.resolve(directory, file);
    });
}
