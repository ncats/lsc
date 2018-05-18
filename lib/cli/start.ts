'use strict';

import flatiron = require('flatiron')
import path = require('path')
import _ = require('lodash')
import {isPackageSync} from "./utils"
import {checkVersion} from "../check-self-update"
import labShare from '../labshare'
import loaderPlugin = require('./loader-plugin')

const {app} = flatiron,
    cwd = process.cwd(),
    lscRoot = path.join(__dirname, '..', '..');

export interface IStartOptions {
    directories: string[]
    pattern: string
    main: string
}

interface IPackageJson {
    description: string
    version: string
}

/**
 * @param {object} options
 * @param {string} options.main
 * @param {Array} options.directories
 * @param {string} options.pattern
 */
export function start(options: IStartOptions = {
    main: cwd,
    directories: [lscRoot],
    pattern: '{src/cli,cli}/*.js'
}) {
    let pkg: IPackageJson;

    checkVersion({name: 'lsc', logger: app.log});

    if (isPackageSync(options.main)) {
        app.config.file({
            file: path.join(options.main, 'config.json')
        });
        pkg = require(path.join(options.main, 'package.json'));
    } else {
        pkg = require(path.join(lscRoot, 'package.json'));
        app.config.file({
            file: path.join(lscRoot, 'config.json')
        });
    }

    app.Title = `${pkg.description}  ${pkg.version}`;
    app.use(flatiron.plugins.cli, {
        usage: [app.Title,
            '',
            'Usage:',
            'lsc <command>            - run a command',
            'lsc help                 - list all commands',
            'lsc help <command>       - display help for a specific command',
            '',
            '   --config <file-path>  - load a JSON configuration file (optional)'
        ],
        version: true
    });

    app.use(require('flatiron-cli-config'));
    app.use(loaderPlugin, options);

    global.LabShare = labShare;

    app.start(error => {
        if (_.isError(error)) {
            app.log.error(error.stack);
            process.exit(1);
        }
    });
}
