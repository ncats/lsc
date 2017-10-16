'use strict';

import path = require('path')
import _ = require('lodash')
import {CliLoader} from "../../../../lib/cli/loader";

function allArgs(spy) {
    return _.flatten(_.map(spy.calls, (call: any) => {
        return call.args;
    }));
}

function toContainAllOf(actual: string[], expected: string[]): boolean {
    return _.every(expected, (value) => {
        return _.includes(actual, value);
    });
}

describe('CliLoader', () => {

    let cliLoader,
        packagePath,
        flatironAppMock,
        options;

    beforeEach(() => {
        packagePath = './test/fixtures/main-package';
        flatironAppMock = {
            commands: {},
            log: {
                warn: jasmine.createSpy('warn'),
                help: jasmine.createSpy('help'),
                error: jasmine.createSpy('error')
            },
            plugins: {
                cli: {}
            },
            cli: {}
        };
        options = {
            main: packagePath
        };

        cliLoader = new CliLoader(flatironAppMock, options);
    });

    it('throws an exception when invalid arguments and/or options are provided', () => {
        let original = _.cloneDeep(flatironAppMock);

        expect(function () {
            new CliLoader(flatironAppMock, {
                main: []
            } as any);
        }).toThrow();

        expect(function () {
            flatironAppMock.plugins = null;
            new CliLoader(flatironAppMock, {});
        } as any).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            flatironAppMock.commands = null;
            new CliLoader(flatironAppMock, {});
        } as any).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            flatironAppMock.log = null;
            new CliLoader(flatironAppMock, {});
        }).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            new CliLoader(flatironAppMock, {
                directories: 42
            } as any);
        }).toThrow();

        expect(function () {
            new CliLoader(flatironAppMock, {
                directories: ['a/path/to/a/directory']
            } as any);
        }).not.toThrow();
    });

    it('does not throw if options are not provided', () => {
        expect(function () {
            new CliLoader(flatironAppMock, {});
        }).not.toThrow();
    });

    describe('.load', function () {

        it('adds CLI commands to the app and caches command information', (done: DoneFn) => {
            expect(cliLoader._commands['cli-package1']).toBeUndefined();
            expect(cliLoader._commands['cli-package2']).toBeUndefined();
            expect(_.isEmpty(_.keys(flatironAppMock.commands))).toBeTruthy();

            cliLoader.load(error => {
                expect(error).toBeNull();

                let commandInfo1 = cliLoader._commands['cli-package1'],
                    commandInfo2 = cliLoader._commands['cli-package2'];

                expect(toContainAllOf(_.keys(commandInfo1).concat(_.keys(commandInfo2)), ['hello', 'add', 'subtract', 'goodbye']))
                    .toBeTruthy();
                expect(toContainAllOf(_.keys(flatironAppMock.commands), ['hello', 'add', 'subtract', 'goodbye']))
                    .toBeTruthy();
                done();
            });
        });

        it('attempts to load commands from each directory specified by the "directories" option', (done: DoneFn) => {
            let cliLoader = new CliLoader(flatironAppMock, {
                directories: [path.join(packagePath, 'node_modules', 'cli-package1')]
            });
            expect(cliLoader._commands['cli-package1']).toBeUndefined();
            expect(toContainAllOf(_.keys(flatironAppMock.commands), ['hello', 'goodbye'])).toBeFalsy();

            cliLoader.load(error => {
                expect(error).toBeNull();

                let commandInfo1 = cliLoader._commands['cli-package1'];
                expect(commandInfo1['goodbye']).toBeDefined();
                expect(commandInfo1['hello']).toBeDefined();

                // Make sure 'init' functions are not treated like regular commands!
                expect(commandInfo1['init']).toBeUndefined();

                expect(toContainAllOf(_.keys(flatironAppMock.commands), ['goodbye', 'hello'])).toBeTruthy();
                done();
            });
        });

        it('runs the functions defined by the init modules of LabShare packages', (done: DoneFn) => {
            let options = {
                main: packagePath,
                timeout: 25
            };
            cliLoader = new CliLoader(flatironAppMock, options);

            cliLoader.load(error => {
                expect(error.message).toContain('TIMEOUT ERROR');
                expect(error.message).toContain('cli-package1');
                expect(error.message).toContain('init');
                done();
            });
        });

        it('ignores duplicate commands from LabShare packages with the same name', (done: DoneFn) => {
            cliLoader = new CliLoader(flatironAppMock, {
                directories: [path.join(packagePath, 'node_modules', 'cli-package1'), path.join(packagePath, 'node_modules', 'cli-package1')]
            });
            cliLoader.load(() => {
                expect(flatironAppMock.log.error).not.toHaveBeenCalled();
                done();
            });
        });

        it('logs an error if two different LabShare packages try to load a command with the same name', (done: DoneFn) => {
            cliLoader.load(() => {
                expect(flatironAppMock.log.error.calls[0].args[0])
                    .toMatch(/A command with the same name has already been loaded/);
                done();
            });
        });

        it('logs an error if an exception is thrown', (done: DoneFn) => {
            cliLoader.options.main = 1337;
            cliLoader.load(error => {
                expect(error.message).toContain('Failed to load CLI commands');
                done();
            });
        });

        it('logs a warning if a loaded command does not contain help text', (done: DoneFn) => {
            let cliLoader = new CliLoader(flatironAppMock, {
                main: packagePath,
                directories: [path.join(packagePath, 'node_modules', 'cli-package2')]
            });

            cliLoader.load(() => {
                expect(flatironAppMock.log.warn).toHaveBeenCalled();
                done();
            });
        });

    });

    xdescribe('.init', () => {

        it('runs the functions defined by the init modules of LabShare packages', (done: DoneFn) => {
            let options = {
                main: packagePath,
                timeout: 25
            };
            cliLoader = new CliLoader(flatironAppMock, options);

            cliLoader.load();
            cliLoader.init(error => {
                expect(error.message).toContain('TIMEOUT ERROR');
                expect(error.message).toContain('cli-package1');
                expect(error.message).toContain('init');
                done();
            });
        });

    });

    describe('.unload', () => {

        it('deletes all the commands assigned to the app by .load', (done: DoneFn) => {
            cliLoader.load(() => {
                expect(toContainAllOf(_.keys(flatironAppMock.commands), ['hello', 'add', 'subtract', 'goodbye'])).toBeTruthy();
                expect(_.keys(cliLoader._commands).length).toBeGreaterThan(0);
                cliLoader.unload();
                expect(toContainAllOf(_.keys(flatironAppMock.commands), ['hello', 'add', 'subtract', 'goodbye'])).toBeFalsy();
                expect(_.keys(cliLoader._commands).length).toBe(0);
                done();
            });
        });

    });

    describe('.displayHelp', () => {

        it('logs messages for each command found by the cliLoader', (done: DoneFn) => {
            cliLoader.displayHelp();
            expect(flatironAppMock.log.help.calls[0].args).toMatch(/No commands found/);

            cliLoader.load(() => {
                cliLoader.displayHelp();
                expect(toContainAllOf(allArgs(flatironAppMock.log.help), [
                    'hello', 'goodbye', 'add', 'subtract', 'cli-package1', 'cli-package2'
                ]));
                done();
            });
        });

        it('logs messages for uncategorized commands too', () => {
            flatironAppMock.commands['uncategorizedCmd'] = function () {
            };
            cliLoader = new CliLoader(flatironAppMock, options);
            cliLoader.displayHelp();
            expect(allArgs(flatironAppMock.log.help)).toContain('uncategorizedCmd');
        });

    });

});