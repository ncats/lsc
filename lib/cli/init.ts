/**
 * @exports This module is used to initialize the global LabShare object
 */

'use strict';

import _ = require('lodash');
import path = require('path');
import yargs = require('yargs');
import {configLoaderSync} from '../config';
import {Logger} from '../log';
import labShare from '../labshare';
import * as fs from 'fs';
const lscRoot = path.join(__dirname, '..');

export function init(): void {
  const argv = yargs.options({
    configFile: {
      alias: ['config', 'conf'],
      describe: 'A path to a local configuration file',
      type: 'string',
      default: null,
    },
    configuration: {
      describe:
        'If is using config folder, this will allow to choose the different configurations',
      type: 'string',
      default: null,
    },
  }).argv;

  const config = initConfig({
    cwd: process.cwd(),
    directories: [lscRoot],
    configFilePath: argv.configFile,
    configuration: argv.configuration,
  });

  global.LabShare = global.LabShare || labShare;
  global.LabShare.Config = config;

  const logDirectory: string = _.get(
    config,
    'lsc.Log.Path',
    _.get(config, 'lsc.log.path'),
  );
  const fluentD = _.get(
    config,
    'lsc.Log.FluentD',
    _.get(config, 'lsc.log.fluentD', {}),
  );
  const format = _.get(
    config,
    'lsc.Log.Format',
    _.get(config, 'lsc.log.format', {}),
  );

  // default logger
  global.LabShare.Logger = Logger({
    logDirectory,
    fluentD,
    format,
  });
}
/**
 * Initializes UI configuration file
 * @param {opts}
 */
export function initConfig(opts: {
  cwd: string;
  directories?: any[];
  configuration?: string | undefined;
  configFilePath?: string | undefined;
}) {
  let baseConfig = {};
  const configFilePath =
    opts?.configFilePath || path.join(opts.cwd, 'config.json');
  const configFolderPath = path.join(opts.cwd, 'config');
  const envFilePath = path.join(opts.cwd, '.env');
  // checking the existances of the legacy config file
  if (fs.existsSync(configFilePath) && fs.lstatSync(configFilePath).isFile()) {
    baseConfig = configLoaderSync({
      cwd: opts.cwd,
      directories: opts.directories,
      configFilePath: opts.configFilePath,
    });
  } else if (
    fs.existsSync(configFolderPath) &&
    fs.lstatSync(configFolderPath).isDirectory()
  ) {
    if (!_.isNil(opts.configuration)) {
      process.env.NODE_CONFIG_ENV = opts.configuration;
    }
    if (fs.existsSync(envFilePath)) {
      require('dotenv').config({
        path: envFilePath,
      });
    }
    const config = require('config');
    baseConfig = config.util.loadFileConfigs(configFolderPath);
  }
  return baseConfig;
}
