'use strict';

const flatiron = require('flatiron'),
    path = require('path'),
    _ = require('lodash'),
    {app} = flatiron,
    cwd = process.cwd(),
    cliUtils = require('../cli/utils'),
    LabShare = require('../labshare'),
    lscRoot = path.join(__dirname, '..', '..');

/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {string} options.main
 * @param {Array} options.directories
 * @param {string} options.pattern
 */
module.exports = function start(options = {}) {
    options = _.defaults(options, {
        cwd,
        main: options.cwd || cwd,
        directories: [lscRoot],
        pattern: '{src/cli,cli}/*.js'
    });

    let pkg = null;

    if (cliUtils.isPackageSync(options.cwd)) {
        app.config.file({
            file: path.join(options.cwd, 'config.json')
        });
        pkg = require(path.join(options.cwd, 'package.json'));
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
            'lsc <command>       - run a command',
            'lsc help            - list all commands',
            'lsc help <command>  - display help for a specific command'
        ],
        version: true
    });
    app.use(require('flatiron-cli-config'));
    app.use(require('../cli').Plugin, options);

    global.LabShare = LabShare;

    app.start();
};
