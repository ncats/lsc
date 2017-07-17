const correctVersion = require('./correct-version')

const getModuleLatestVersion = (json) => {
  return correctVersion(json['dist-tags'].latest);
}

module.exports = getModuleLatestVersion;
