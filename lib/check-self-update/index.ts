'use strict';

import {fetchModuleRegistryInfo} from "./fetch-module-registry-info";
import {promptIfNewerVersion} from "./prompt-if-newer-version";

/**
 * @param opts
 * @param {String} opts.name - package.json name
 * @returns {Promise.<T>}
 */
export async function checkVersion({name, logger}: {name: string, logger: any}): Promise<void> {
    try {
        const data = await fetchModuleRegistryInfo(name);
        promptIfNewerVersion(name, data, logger);
    } catch (error) {
        /* silently fail if user has no internet connection */
    }
}
