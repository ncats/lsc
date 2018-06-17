'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const assert = require('assert');
const glob = require('glob');
const resolve = require('resolve-pkg');

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
export function readJSON(filePath: string) {
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
 * @param {String} packagePath - A path to a directory containing LabShare package.
 * @param {Function} func - A function that accepts a path to a LabShare project
 */
export function applyToNodeModulesSync(packagePath: string, func: (packagePath: string) => void): void {
    assert.ok(_.isString(packagePath), 'applyToNodeModulesSync: `packagePath` must be a non-empty string');
    assert.ok(_.isFunction(func), 'applyToNodeModulesSync: `func` must be a function');

    if (!isPackageSync(packagePath)) {
        return;
    }

    const manifest = getPackageManifest(packagePath);
    const dependencies = getPackageDependencies(manifest);

    func(packagePath);

    for (const dependency of dependencies) {
        const dependencyPath = resolve(dependency, {cwd: packagePath});

        if (!dependencyPath) {
            throw new Error(`Dependency: "${dependency}" required by "${packagePath}" could not be found. Is it installed?`);
        }

        func(dependencyPath);
    }
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
