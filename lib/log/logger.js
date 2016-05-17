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
    winston = require('winston');

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
    constructor(logDirectory) {
        let winstonTransports = [
            new winston.transports.Console({
                colorize: true
            })
        ];

        if (logDirectory) {
            // Create the log directory if it doesn't exist
            mkdirSync(logDirectory);

            winstonTransports.push(new winston.transports.File({
                filename: path.resolve(logDirectory, 'shell.log'),
                "timestamp": true,
                "json": false,
                "maxfiles": 5,
                "maxsize": 10485760,
                "level": "info"
            }));
        }

        super({
            transports: winstonTransports
        });
    }
}

module.exports = Logger;
