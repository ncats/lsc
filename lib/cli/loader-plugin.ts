/**
 * Flatiron plugin that can load CLI command modules located in LabShare packages.
 *
 * How to use:
 * 1. Create a new Flatiron app:
 * const flatiron = require('flatiron'),
 *       app = flatiron.app;
 *
 * 2. Assign the app the Flatiron cli plugin:
 * app.use(flatiron.plugins.cli, {
 *      // options
 * });
 *
 * 3. Assign the `cli-loader-plugin` to the app:
 * app.use(require('path/to/cli-loader-plugin'), {
 *      // options
 * });
 *
 * 4. Start the app:
 * app.start();
 *
 * There are several options that can be passed to the plugin.
 *
 * {Object} options
 * {String} [options.pattern] - The pattern used to match files that contain cli commands (e.g. 'src/cli/*.js')
 * {String} [options.cwd] - A relative or absolute path to a directory containing a LabShare package with 0 or more dependencies to other LabShare packages. Default: ''
 * {Array} [options.directories] - A list of paths to LabShare packages that should be searched for CLI commands. Each directory
 * must contain a package.json to be considered valid. Default: []
 * @param {Number} [options.timeout] - How long to wait for the optional callback to be called in CLI package init functions
 */

'use strict';

import {CliLoader} from './loader'

exports.name = 'cli-loader-plugin';

exports.attach = function (options) {
    exports.options = options;
};

exports.init = async function init(done) {
    exports.loader = new CliLoader(this, exports.options);

    try {
        await exports.loader.load();

        this.commands['help'] = function () {
            exports.loader.displayHelp();
        };

        done();
    } catch (error) {
        // TODO: workaround for async/await incompatibility with callbacks in the Flatiron CLI library
        console.error(error);
    }
};

exports.detach = function () {
    delete this.commands['help'];
    exports.loader.unload();
    exports.loader = null;
};