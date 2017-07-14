const fetchModuleRegistryInfo = require('./fetch-module-registry-info');
const promptIfNewerVersion = require('./prompt-if-newer-version');

module.exports = (name) => {
  return fetchModuleRegistryInfo(name).then((data) => promptIfNewerVersion(name, data))
}
