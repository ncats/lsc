'use strict';
const request = require('request');
const REGISTRY_URL = 'http://registry.npmjs.org';
/**
 * @description Fetches a json object with module info when given its name
 * @param {String} name
 */
export function fetchModuleRegistryInfo(name: string) {
    const url = [REGISTRY_URL, name, 'latest'].join('/');

    return new Promise((resolve, reject) => {
        request({ url, method: 'GET' }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            if (body)
                resolve(JSON.parse(body));
            else
                resolve();
        });
    });
}
