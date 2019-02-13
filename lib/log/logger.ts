'use strict';

const { createLogger, format, transports } = require('winston');
import { getPackageManifest, getPackageName } from "../cli";
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

function mkdirSync(path: string): void {
    try {
        fs.mkdirSync(path);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
interface LoggerOptions {
    fluentD?: {
        host?: string
        port?: number
        timeout?: number
        tag?: string
    },
    format?: {
        timestamp?: boolean,
        json?: boolean,
        colorize?: boolean
    },
    cwd?: string
    logDirectory?: string
}
// default format for Console, error at winston: if not json is specified is not logging in console
export const LoggerFormat = format.printf(({level, message }) => {
    return `${level}: ${message}`;
});
export const Logger = (options: LoggerOptions) => {

    options = _.defaultsDeep(options || {}, {
        fluentD: {},
        logDirectory: null,
        format: {
            timestamp: true,
            json: false,
            colorize: false
        },
        cwd: process.cwd()
    });

    // Defining custom formats 
    const styleFormats = [];

    // special case: if json is not defined , use by default the custom format 
    if (options.format.json === false) {
        // going to global
        styleFormats.push( global.LabShare.LoggerFormat);
    }
    else{
        styleFormats.push(format.json());
    }
    // TODO: enable dynamic formats and parameters , for  now it is only using basic types with no parameters    
    _.forEach(['colorize', 'timestamp'], (value) => {
        if (_.get(options.format, `${value}`) === true) {
            styleFormats.push(format[`${value}`]());
        }
    });
    const _logger = createLogger({
        format: format.combine(...styleFormats)
    });
    // Adding a new Console transport
    _logger.add(new transports.Console());
    if (options.logDirectory) {
        // Create the log directory if it doesn't exist
        mkdirSync(options.logDirectory);

        _logger.add(new transports.File({
            filename: path.resolve(options.logDirectory, 'app.log'),
            maxFiles: 5,
            maxsize: 10485760,
            level: 'info'
        }));
    }
    // Adding fluentD transport
    if (!_.isEmpty(options.fluentD)) {
        let name: string = getPackageName(getPackageManifest(options.cwd));

        options = _.defaultsDeep(options, {
            fluentD: {
                host: 'localhost',
                port: 24224,
                timeout: 3.0,
                tag: name || 'labshare'
            }
        });

        _logger.add(new FluentTransport(options.fluentD.tag, options.fluentD));
    }
    // Workaround to support the Morgan request logging middleware
    return _.assign(_logger, {
        stream: () => {
            let self: any = this;
            return {
                write(options?: any): void {
                    self.info(options);
                }
            }
        }
    });;

}
