'use strict';

import tiny = require('tiny-json-http');

const REGISTRY_URL = 'http://registry.npmjs.org';

/**
 * @description Fetches a json object with module info when given its name
 * @param {String} name
 */
export function fetchModuleRegistryInfo(name: string) {
    const url = [REGISTRY_URL, name, 'latest'].join('/');

    return new Promise((resolve, reject) => {
        tiny.get({url}, (error, result: { body: any }) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result.body);
        });
    });
}
