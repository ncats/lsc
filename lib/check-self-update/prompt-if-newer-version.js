'use strict';

const correctVersion = require('./correct-version');

function hasNewerVersion(currentVersion, latestVersion) {
    return currentVersion !== latestVersion;
}

/**
 *
 * @param {Object} json
 * @private
 */
function getLatestVersion(json) {
    return correctVersion(json['dist-tags'].latest);
}

function getModuleCurrentVersion() {
    return correctVersion(require('../../package.json').version)
}

/**
 *
 * @param name
 * @param currentVersion
 * @param latestVersion
 * @returns {string}
 * @private
 */
function message({name, currentVersion, latestVersion}) {
    return [
        `${name.toUpperCase()} has a new version available: ${latestVersion} (yours is ${currentVersion}).`,
        '      You can update it using `npm install -g lsc`'
    ].join('\n');
}

/**
 *
 * @param {String} name
 * @param {Object} jsonData
 * @api public
 */
const promptIfNewerVersion = (name, jsonData) => {
    const latestVersion = getLatestVersion(jsonData);
    const currentVersion = getModuleCurrentVersion();

    if (hasNewerVersion(currentVersion, latestVersion)) {
        global.LabShare.Logger.info(message({name, currentVersion, latestVersion}));
    }
};

module.exports = promptIfNewerVersion;
