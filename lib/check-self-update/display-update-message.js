const message = ({name, currentVersion, latestVersion}) => `${name.toUpperCase()} has a new version available: ${latestVersion} (yours is ${currentVersion}). \n      You can update it using \`npm install -g lsc\``;

const displayUpdateMessage = (...args) => global.LabShare.Logger.info(message(...args));

module.exports = displayUpdateMessage;
