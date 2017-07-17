const message = ({name, currentVersion, latestVersion}) => [
  `${name.toUpperCase()} has a new version available: ${latestVersion} (yours is ${currentVersion}).`,
  '      You can update it using `npm install -g lsc`'
].join('\n');

const displayUpdateMessage = (...args) => global.LabShare.Logger.info(message(...args));

module.exports = displayUpdateMessage;
