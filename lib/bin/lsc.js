#!/usr/bin/env node

'use strict';

const flatiron = require('flatiron'),
    path = require('path'),
    {app} = flatiron,
    cwd = process.cwd(),
    cliUtils = require('../cli/utils'),
    LabShare = require('../labshare'),
    lscRoot = path.join(__dirname, '..', '..'),
    options = {
        main: cwd,
        directories: [lscRoot],
        pattern: '{src/cli,cli}/*.js'
    };

let pkg = null;

if (cliUtils.isPackageSync(cwd)) {
    app.config.file({
        file: path.join(cwd, 'config.json')
    });
    pkg = require(path.join(cwd, 'package.json'));
} else {
    pkg = require(path.join(lscRoot, 'package.json'));
    app.config.file({
        file: path.join(lscRoot, 'config.json')
    });
}

app.Title = pkg.description + "  " + pkg.version;
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
