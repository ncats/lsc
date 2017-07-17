'use strict';

const fetchModuleRegistryInfo = require('./fetch-module-registry-info'),
    promptIfNewerVersion = require('./prompt-if-newer-version');

/**
 *
 * @param {String} name - package.json name
 * @returns {Promise.<T>}
 */
module.exports = (name) => {
    return fetchModuleRegistryInfo(name)
        .then(data => promptIfNewerVersion(name, data))
        .catch(error => {
            console.log(error);
            /* silently fail if user has no internet connection */
        })
};
