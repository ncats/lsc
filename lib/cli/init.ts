/**
 * @exports This module is used to initialize the global LabShare object
 */

"use strict";

import _ = require("lodash");
import path = require("path");
import yargs = require("yargs");
import { configLoaderSync } from "../config";
import { Logger } from "../log";
import labShare from "../labshare";

const lscRoot = path.join(__dirname, "..");

export function init(): void {
  const argv = yargs.options({
    configFile: {
      alias: ["config", "conf"],
      describe: "A path to a local configuration file",
      type: "string",
      default: null
    }
  }).argv;
  const config = configLoaderSync({
    cwd: process.cwd(),
    directories: [lscRoot],
    configFilePath: argv.configFile
  });

  global.LabShare = global.LabShare || labShare;
  global.LabShare.Config = config;

  let logDirectory: string = _.get(
    config,
    "lsc.Log.Path",
    _.get(config, "lsc.log.path")
  );
  let fluentD = _.get(
    config,
    "lsc.Log.FluentD",
    _.get(config, "lsc.log.fluentD", {})
  );
  let format = _.get(
    config,
    "lsc.Log.Format",
    _.get(config, "lsc.log.format", {})
  );

  // default logger
  global.LabShare.Logger = Logger({
    logDirectory,
    fluentD,
    format
  });
}
