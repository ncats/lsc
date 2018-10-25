'use strict';

import winston = require('winston');
import TransportInstance = winston.TransportInstance;
import {getPackageManifest, getPackageName} from "../cli";
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
    cwd?: string
    logDirectory?: string
}

export class Logger extends winston.Logger {

    constructor(options: LoggerOptions) {
        options = _.defaultsDeep(options || {}, {
            fluentD: {},
            logDirectory: null,
            cwd: process.cwd()
        });

        let transports: TransportInstance[] = [
            new winston.transports.Console({
                colorize: true
            })
        ];

        if (options.logDirectory) {
            // Create the log directory if it doesn't exist
            mkdirSync(options.logDirectory);

            transports.push(new winston.transports.File({
                filename: path.resolve(options.logDirectory, 'lsc.log'),
                timestamp: true,
                json: false,
                maxfiles: 5,
                maxsize: 10485760,
                level: 'info'
            }));
        }

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

            transports.push(new FluentTransport(options.fluentD.tag, options.fluentD));
        }

        super({
            transports
        });
    }

    // Workaround to support the Morgan request logging middleware
    stream(): any {
        let self: any = this;

        return {
            write(options?: any): void {
                self.info(options);
            }
        };
    }
}
