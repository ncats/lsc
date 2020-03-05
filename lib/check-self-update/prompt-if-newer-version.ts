'use strict';

/*
 * @description Npm can modify latest-version to be different than what's in package.json
 * This function "corrects" a version and can be used both with local version and
 * latest version
 */
function correctVersion(version: string) {
  return version
    .replace(/[a-zA-Z]/g, '')
    .split('.')
    .map(n => parseInt(n, 10))
    .join('.');
}

function hasNewerVersion(currentVersion, latestVersion) {
  return currentVersion !== latestVersion;
}

/**
 *
 * @param {Object} json
 * @private
 */
function getLatestVersion(json) {
  return correctVersion(json['version']);
}

function getModuleCurrentVersion() {
  return correctVersion(require('../../package.json').version);
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
    '      You can update it using `npm install -g lsc`',
  ].join('\n');
}

/**
 *
 * @param {String} name
 * @param {Object} jsonData
 * @param logger
 * @api public
 */
export function promptIfNewerVersion(
  name: string,
  jsonData,
  logger: {info: (message: string) => void},
): void {
  const latestVersion = getLatestVersion(jsonData);
  const currentVersion = getModuleCurrentVersion();

  if (hasNewerVersion(currentVersion, latestVersion)) {
    logger.info(message({name, currentVersion, latestVersion}));
  }
}
