const getModuleLatestVersion = require('./get-module-latest-version');
const getModuleCurrentVersion = require('./get-module-current-version');
const hasNewerVersion = require('./has-newer-version');
const displayUpdateMessage = require('./display-update-message');

const promptIfNewerVersion = (name, jsonData) => {

  const latestVersion = getModuleLatestVersion(jsonData);
  const currentVersion = getModuleCurrentVersion();

  if (hasNewerVersion(currentVersion, latestVersion)){
    displayUpdateMessage({name, currentVersion, latestVersion})
  }

}

module.exports = promptIfNewerVersion;
