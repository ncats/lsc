const requestPromise = require('./request-promise');
const getModuleRegistryUrl = require('./get-module-registry-url');

/* Fetches a json object with module info when given its name */

const fetchModuleRegistryInfo = (name) => {

  const url = getModuleRegistryUrl(name);

  return requestPromise(url);

}

module.exports = fetchModuleRegistryInfo;
