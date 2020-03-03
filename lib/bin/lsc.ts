#!/usr/bin/env node

"use strict";

import semver = require("semver");
import fs = require("fs");
import path = require("path");
import { start, init } from "../cli";

const manifestPath = path.join(__dirname, "..", "..", "package.json");
const requiredNodeVersion = JSON.parse(fs.readFileSync(manifestPath).toString())
  .engines.node;

if (!semver.satisfies(process.versions.node, requiredNodeVersion)) {
  throw new Error("LSC requires Node 6 or higher installed!");
}

start({
  initFunctions: [init]
});
