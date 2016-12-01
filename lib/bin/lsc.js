#!/usr/bin/env node

'use strict';

const semver = require('semver'),
    fs = require('fs'),
    path = require('path'),
    manifestPath = path.join(__dirname, '..', '..', 'package.json'),
    requiredNodeVersion = JSON.parse(fs.readFileSync(manifestPath)).engines.node;

if (!semver.satisfies(process.versions.node, requiredNodeVersion)) {
    throw new Error('LSC requires Node 6 or higher installed!');
}

require('../cli').Start();
