/**
 * This module is used to initialize the global LabShare object
 */

'use strict';

const _ = require('lodash'),
    path = require('path'),
    configLoader = require('../lib/config').Loader,
    {Logger} = require('../lib/log'),
    lscRoot = path.join(__dirname, '..');

module.exports = function init() {
    let config = configLoader.sync({
        main: process.cwd(),
        directories: [lscRoot]
    });

    try {
        global.LabShare.Config = config;
    } catch (error) {
        error.message = `Failed to load global.LabShare.Config: ${error.message}`;
        throw error;
    }

    let logDirectory = _.get(global.LabShare, 'Config.lsc.Log.Path');

    global.LabShare.Logger = new Logger(logDirectory);
};
