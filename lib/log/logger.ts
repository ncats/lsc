'use strict';

import {createLogger, format, transports} from 'winston';
import {getPackageManifest, getPackageName} from '../cli';
import path = require('path');
import fs = require('fs');
import _ = require('lodash');

/*
 * LSC's logging configuration module.
 *
 * Usage:
 * var logger = new require('./logger')('/log/directory');
 * logger.info('information');
 * logger.error('an error');
 * logger.warn('a warning');
 */
const FluentTransport = require('fluent-logger').support.winstonTransport();

function mkdirSync(dir: string): void {
  try {
    fs.mkdirSync(dir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}
interface LoggerOptions {
  fluentD?: {
    host?: string;
    port?: number;
    timeout?: number;
    tag?: string;
  };
  format?: {
    json?: boolean;
    colorize?: boolean;
  };
  cwd?: string;
  logDirectory?: string;
}
// default format for Console, error at winston: if not json is specified is not logging in console
const loggerFormat = format.printf(({timestamp, level, message}) => {
  return `${timestamp} ${level}: ${message}`;
});
export const Logger = (options: LoggerOptions) => {
  options = _.defaultsDeep(options || {}, {
    fluentD: {},
    logDirectory: null,
    format: {
      json: false,
      colorize: false,
    },
    cwd: process.cwd(),
  });

  // Defining custom formats
  const styleFormats = [
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
  ];

  // special case: if json is not defined , use by default the custom format
  // Example: https://github.com/winstonjs/winston/blob/master/examples/custom-timestamp.js
  if (!options.format.json) {
    styleFormats.push(loggerFormat);
  } else {
    styleFormats.push(format.json());
  }
  // TODO: enable dynamic formats and parameters , for now it is only using basic types with no parameters
  for (const key of Object.keys(options.format)) {
    if (options.format[key]) {
      styleFormats.push(format[key]());
    }
  }
  const logger = createLogger({
    format: format.combine(...styleFormats),
  });

  // Adding a new Console transport
  logger.add(new transports.Console());
  if (options.logDirectory) {
    // Create the log directory if it doesn't exist
    mkdirSync(options.logDirectory);

    logger.add(
      new transports.File({
        filename: path.resolve(options.logDirectory, 'app.log'),
        maxFiles: 5,
        maxsize: 10485760,
        level: 'info',
      }),
    );
  }
  // Adding fluentD transport
  if (!_.isEmpty(options.fluentD)) {
    const name: string = getPackageName(getPackageManifest(options.cwd));

    options = _.defaultsDeep(options, {
      fluentD: {
        host: 'localhost',
        port: 24224,
        timeout: 3.0,
        tag: name || 'labshare',
      },
    });

    logger.add(new FluentTransport(options.fluentD.tag, options.fluentD));
  }
  // Workaround to support the Morgan request logging middleware
  return _.assign(logger, {
    stream: () => {
      const self: any = this;
      return {
        write(writeOptions?: any): void {
          self.info(writeOptions);
        },
      };
    },
  });
};
