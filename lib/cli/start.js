'use strict';

const flatiron = require('flatiron'),
    path = require('path'),
    _ = require('lodash'),
    {app} = flatiron,
    cwd = process.cwd(),
    cliUtils = require('../cli/utils'),
    lscRoot = path.join(__dirname, '..', '..');

const checkSelfUpdate = require('../check-self-update');

let labShare = require('../labshare');

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

    checkSelfUpdate('lsc');

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
            'lsc <command>            - run a command',
            'lsc help                 - list all commands',
            'lsc help <command>       - display help for a specific command',
            '',
            '   --config <file-path>  - load a JSON configuration file (optional)'
        ],
        version: true
    });
    app.use(require('flatiron-cli-config'));
    app.use(require('../cli').Plugin, options);

    global.LabShare = labShare;

    app.start(error => {
        if (_.isError(error)) {
            app.log.error(error.stack);
            process.exit(1);
        }
    });
};
