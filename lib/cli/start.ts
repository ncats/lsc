'use strict';

import flatiron = require('flatiron');
import path = require('path');
import {isPackageSync} from './utils';
import labShare from '../labshare';
import loaderPlugin = require('./loader-plugin');
import updateNotifier = require('update-notifier');

const {app} = flatiron;
const lscRoot = path.join(__dirname, '..', '..', '..');
const lscPackageJson = require(path.join(lscRoot, 'package.json'));

export interface StartOptions {
  directories?: string[];
  pattern?: string;
  cwd?: string;
  initFunctions?: ((error?: Error) => any)[];
}

interface PackageJson {
  description: string;
  version: string;
}

/**
 * @description Bootstraps the CLI
 * @param {string} cwd - Root project location
 * @param {Array<string>} [directories] - Additional project directories to search for CLI commands
 * @param {string} pattern - The CLI module pattern to search for (glob syntax)
 * @param {Array<Function>} initModules - Array of custom initializer functions
 */
export async function start({
  cwd = process.cwd(),
  directories = [lscRoot],
  pattern = '{src/cli,cli}/*.js',
  initFunctions = [],
}: StartOptions) {
  let pkg: PackageJson;

  // Asynchronously checks if there is a newer version available.
  // See: https://github.com/yeoman/update-notifier#readme
  updateNotifier({pkg: lscPackageJson}).notify();

  if (isPackageSync(cwd)) {
    app.config.file({
      file: path.join(cwd, 'config.json'),
    });
    pkg = require(path.join(cwd, 'package.json'));
  } else {
    pkg = lscPackageJson;
    app.config.file({
      file: path.join(lscRoot, 'config.json'),
    });
  }

  app.title = `${pkg.description} ${pkg.version}`;
  app.use(flatiron.plugins.cli, {
    usage: [
      app.title,
      '',
      'Usage:',
      'lsc <command>            - run a command',
      'lsc help                 - list all commands',
      'lsc help <command>       - display help for a specific command',
      'lsc create app           - creates a LabShare application based on a template',
      'lsc package create       - creates a LabShare application based on a template (legacy)',
      'lsc help start           - will show all the commands for starting (if project)',
      'lsc help build           - will show all the commands for building (if project)',
      '',
      '   --config <file-path>  - load a JSON configuration file (optional)',
    ],
    version: true,
  });

  app.use(require('flatiron-cli-config'));
  app.use(loaderPlugin, {
    cwd,
    directories,
    pattern,
    initFunctions,
  });

  global.LabShare = labShare;

  app.start(error => {
    if (error) {
      app.log.error(error.stack || 'Command not found!');
      process.exit(1);
    }
  });
}
