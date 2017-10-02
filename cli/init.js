/**
 * @exports This module is used to initialize the global LabShare object
 */

'use strict';

const _ = require('lodash'),
    path = require('path'),
    utils = require('../lib/cli/utils'),
    {Loader} = require('../lib/config'),
    {Logger} = require('../lib/log'),
    yargs = require('yargs'),
    lscRoot = path.join(__dirname, '..');

module.exports = function init() {
    let argv = yargs.options({
            configFile: {
                alias: ['config', 'conf'],
                describe: 'A path to a local configuration file',
                type: 'string',
                default: null
            }
        }).argv,
        config = Loader.sync({
            main: process.cwd(),
            directories: [lscRoot],
            configFilePath: argv.configFile
        }),
        name = utils.getPackageName(utils.getPackageManifest(process.cwd()));

    try {
        global.LabShare.Config = config;
    } catch (error) {
        error.message = `Failed to load global.LabShare.Config: ${error.message}`;
        throw error;
    }

    let logDirectory = _.get(config, 'lsc.Log.Path'),
        fluentD = _.defaults(_.get(config, 'lsc.Log.FluentD', {}), {
            tag: name || 'labshare'
        });

    global.LabShare.Logger = new Logger({
        logDirectory,
        fluentD
    });
};
