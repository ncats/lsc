const correctVersion = require('./correct-version');

/* Responsible for checking the local version, that is,
  what's inside package.json */

const getModuleCurrentVersion = () => {
  return correctVersion(require('../../package.json').version)
}

module.exports = getModuleCurrentVersion;
