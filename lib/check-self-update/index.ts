'use strict';

import {fetchModuleRegistryInfo} from "./fetch-module-registry-info";
import {promptIfNewerVersion} from "./prompt-if-newer-version";

/**
 *
 * @param {String} name - package.json name
 * @returns {Promise.<T>}
 */
export function checkSelfUpdate(name: string) {
    return fetchModuleRegistryInfo(name)
        .then(data => promptIfNewerVersion(name, data))
        .catch(() => {
            /* silently fail if user has no internet connection */
        })
}
