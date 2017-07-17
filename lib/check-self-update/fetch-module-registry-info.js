'use strict';

const tiny = require('tiny-json-http'),
    REGISTRY_URL = 'http://registry.npmjs.org',
    Q = require('q');

/**
 * @description Fetches a json object with module info when given its name
 * @param {String} name
 */
const fetchModuleRegistryInfo = (name) => {
    const url = [REGISTRY_URL, name].join('/');
    return Q.nfcall(tiny.get, {url}).then(result => result.body);
};

module.exports = fetchModuleRegistryInfo;
