/**
 * @exports This module is used to initialize the global LabShare object
 */

'use strict';

import _ = require('lodash')
import path = require('path')
import yargs = require('yargs')
import {configLoaderSync} from '../lib/config'
import {Logger} from "../lib/log/logger";

const lscRoot = path.join(__dirname, '..');

export = function init() {
    let argv = yargs.options({
            configFile: {
                alias: ['config', 'conf'],
                describe: 'A path to a local configuration file',
                type: 'string',
                'default': null
            }
        }).argv,
        config = configLoaderSync({
            main: process.cwd(),
            directories: [lscRoot],
            configFilePath: argv.configFile
        });

    global.LabShare.Config = config;

    let logDirectory: string = _.get(config, 'lsc.Log.Path'),
        fluentD = _.get(config, 'lsc.Log.FluentD', {});

    global.LabShare.Logger = new Logger({
        logDirectory,
        fluentD
    });
};
