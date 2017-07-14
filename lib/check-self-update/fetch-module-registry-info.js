const parseJson = require('./parse-json');
const requestPromise = require('./request-promise');
const getModuleRegistryUrl = require('./get-module-registry-url');

/* Fetches a json object with module info when given its name */

const fetchModuleRegistryInfo = (name) => {
  return new Promise((resolve, reject) => {

    const url = getModuleRegistryUrl(name);
    requestPromise(url).then(parseJson).then(resolve).catch(reject);

  })
}

module.exports = fetchModuleRegistryInfo;
