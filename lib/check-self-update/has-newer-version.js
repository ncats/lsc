/* TODO: Avoid edge-case when currentVersion > latestVersion */

const hasNewerVersion = (currentVersion, latestVersion) => {
  return currentVersion !== latestVersion
}

module.exports = hasNewerVersion;
