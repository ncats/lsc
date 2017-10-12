'use strict';

import winston = require('winston');
import TransportInstance = winston.TransportInstance;
import ReadableStream = NodeJS.ReadableStream;

/*
 * LSC's logging configuration module.
 *
 * Usage:
 * var logger = new require('./logger')('/log/directory');
 * logger.info('information');
 * logger.error('an error');
 * logger.warn('a warning');
 */

const path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    FluentTransport = require('fluent-logger').support.winstonTransport();

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
    }
    logDirectory?: string
}

export class Logger extends winston.Logger {

    constructor(options: LoggerOptions) {
        options = _.defaultsDeep(options || {}, {
            fluentD: {},
            logDirectory: null
        });

        let winstonTransports: TransportInstance[] = [
            new winston.transports.Console({
                colorize: true
            })
        ];

        if (options.logDirectory) {
            // Create the log directory if it doesn't exist
            mkdirSync(options.logDirectory);

            winstonTransports.push(new winston.transports.File({
                filename: path.resolve(options.logDirectory, 'lsc.log'),
                'timestamp': true,
                'json': false,
                'maxfiles': 5,
                'maxsize': 10485760,
                'level': 'info'
            }));
        }

        if (!_.isEmpty(options.fluentD)) {
            options = _.defaultsDeep(options, {
                fluentD: {
                    host: 'localhost',
                    port: 24224,
                    timeout: 3.0,
                    tag: 'labshare'
                },
                logDirectory: null
            });

            winstonTransports.push(new FluentTransport(options.fluentD.tag, options.fluentD));
        }

        super({
            transports: winstonTransports
        });
    }

    // Workaround to support the Morgan request logging middleware
    stream(): any {
        let self = this;

        return {
            write(options?: any): void {
                self.info(options);
            }
        };
    }
}
