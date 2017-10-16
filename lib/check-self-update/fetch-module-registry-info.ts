'use strict';

import tiny = require('tiny-json-http')
import Q = require('q')

const REGISTRY_URL = 'http://registry.npmjs.org';

/**
 * @description Fetches a json object with module info when given its name
 * @param {String} name
 */
export function fetchModuleRegistryInfo(name: string) {
    const url = [REGISTRY_URL, name, 'latest'].join('/');
    return Q.nfcall(tiny.get, {url}).then((result: {body: any}) => result.body);
}
