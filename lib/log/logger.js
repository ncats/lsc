'use strict';

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
    winston = require('winston'),
    FluentTransport = require('fluent-logger').support.winstonTransport();

function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

class Logger extends winston.Logger {
    constructor(options = {}) {
        options = _.defaultsDeep(options, {
            fluentD: {
                host: 'localhost',
                port: 24224,
                timeout: 3.0,
                tag: 'labshare'
            },
            logDirectory: null
        });

        let winstonTransports = [
            new winston.transports.Console({
                colorize: true
            })
        ];

        if (options.logDirectory) {
            // Create the log directory if it doesn't exist
            mkdirSync(options.logDirectory);

            winstonTransports.push(new winston.transports.File({
                filename: path.resolve(options.logDirectory, 'lsc.log'),
                "timestamp": true,
                "json": false,
                "maxfiles": 5,
                "maxsize": 10485760,
                "level": "info"
            }));
        }

        winstonTransports.push(new FluentTransport(options.fluentD.tag, options.fluentD));

        super({
            transports: winstonTransports
        });

        // This is used to support the Morgan request logging middleware
        let self = this;
        this.stream = {
            write(message) {
                self.info(message);
            }
        }
    }
}

module.exports = Logger;
