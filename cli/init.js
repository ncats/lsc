/**
 * This module is used to initialize the global LabShare object
 */

'use strict';

const _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    configLoader = require('../lib/config').Loader,
    cliUtils = require('../lib/cli/utils'),
    {Logger} = require('../lib/log'),
    lscRoot = path.join(__dirname, '..');

function unlinkSync(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

/**
 * @description Writes the given data to a JS file that defines an AMD module
 * @param {string} path - The full destination path including the file name and extension
 * @param {object} data
 * @private
 */
function writePackageDataToFile(path, data) {
    fs.writeFileSync(path, data);
    _.each(['SIGTERM', 'SIGINT', 'exit'], event => {
        process.once(event, () => {
            unlinkSync(path);
        });
    });
}

module.exports = function init() {
    let config = configLoader.sync({
        main: process.cwd(),
        directories: [lscRoot]
    });

    writePackageDataToFile(path.join(lscRoot, 'app.conf'), JSON.stringify(config, null, 2));

    try {
        global.LabShare.Config = cliUtils.readJSON(path.join(lscRoot, 'app.conf'));
    } catch (error) {
        error.message = `Failed to load global.LabShare.Config: ${error.message}`;
        throw error;
    }

    let logDirectory = _.get(global.LabShare, 'Config.lsc.Log.Path');

    global.LabShare.Logger = new Logger(logDirectory);
};
