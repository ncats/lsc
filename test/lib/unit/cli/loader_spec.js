'use strict';

const path = require('path'),
    _ = require('lodash');

function allArgs(spy) {
    return _.flatten(_.map(spy.calls, call => {
        return call.args;
    }));
}

describe('CliLoader', () => {

    let CliLoader,
        cliLoader,
        packagePath,
        flatironAppMock,
        options;

    beforeEach(function () {
        this.addMatchers({
            toContainAllOf: function (expected) {
                return _.every(expected, (value) => {
                    return _.includes(this.actual, value);
                });
            }
        });

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
        CliLoader = require('../../../../lib/cli/loader');
        cliLoader = new CliLoader(flatironAppMock, options);
    });

    it('throws an exception when invalid arguments and/or options are provided', function () {
        let original = _.cloneDeep(flatironAppMock);

        expect(function () {
            new CliLoader(flatironAppMock, {
                main: []
            });
        }).toThrow();

        expect(function () {
            flatironAppMock.plugins = null;
            new CliLoader(flatironAppMock);
        }).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            flatironAppMock.commands = null;
            new CliLoader(flatironAppMock);
        }).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            flatironAppMock.log = null;
            new CliLoader(flatironAppMock);
        }).toThrow();
        _.assign(flatironAppMock, original);

        expect(function () {
            new CliLoader(flatironAppMock, {
                directories: 42
            });
        }).toThrow();

        expect(function () {
            new CliLoader(flatironAppMock, {
                directories: 'a/path/to/a/directory'
            });
        }).not.toThrow();
    });

    it('does not throw if options are not provided', () => {
        expect(function () {
            new CliLoader(flatironAppMock);
        }).not.toThrow();
    });

    describe('.load', function () {

        it('adds CLI commands to the app and caches command information', done => {
            expect(cliLoader._commands['cli-package1']).toBeUndefined();
            expect(cliLoader._commands['cli-package2']).toBeUndefined();
            expect(_.isEmpty(_.keys(flatironAppMock.commands))).toBeTruthy();

            cliLoader.load(error => {
                expect(error).toBeNull();

                let commandInfo1 = cliLoader._commands['cli-package1'],
                    commandInfo2 = cliLoader._commands['cli-package2'];

                expect(_.keys(commandInfo1).concat(_.keys(commandInfo2))).toContainAllOf(['hello', 'add', 'subtract', 'goodbye']);
                expect(_.keys(flatironAppMock.commands)).toContainAllOf(['hello', 'add', 'subtract', 'goodbye']);
                done();
            });
        });

        it('attempts to load commands from each directory specified by the "directories" option', done => {
            let cliLoader = new CliLoader(flatironAppMock, {
                directories: [path.join(packagePath, 'node_modules', 'cli-package1')]
            });
            expect(cliLoader._commands['cli-package1']).toBeUndefined();
            expect(_.keys(flatironAppMock.commands)).not.toContainAllOf(['hello', 'goodbye']);

            cliLoader.load(error => {
                expect(error).toBeNull();

                let commandInfo1 = cliLoader._commands['cli-package1'];
                expect(commandInfo1['goodbye']).toBeDefined();
                expect(commandInfo1['hello']).toBeDefined();

                // Make sure 'init' functions are not treated like regular commands!
                expect(commandInfo1['init']).toBeUndefined();

                expect(_.keys(flatironAppMock.commands)).toContainAllOf(['goodbye', 'hello']);
                done();
            });
        });

        it('runs the functions defined by the init modules of LabShare packages', done => {
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

        it('ignores duplicate commands from LabShare packages with the same name', done => {
            cliLoader = new CliLoader(flatironAppMock, {
                directories: [path.join(packagePath, 'node_modules', 'cli-package1'), path.join(packagePath, 'node_modules', 'cli-package1')]
            });
            cliLoader.load(() => {
                expect(flatironAppMock.log.error).not.toHaveBeenCalled();
                done();
            });
        });

        it('logs an error if two different LabShare packages try to load a command with the same name', done => {
            cliLoader.load(() => {
                expect(flatironAppMock.log.error.calls[0].args[0])
                    .toMatch(/A command with the same name has already been loaded/);
                done();
            });
        });

        it('logs an error if an exception is thrown', done => {
            cliLoader.options.main = 'INVALID';
            cliLoader.load(error => {
                expect(error.message).toContain('Failed to load CLI commands');
                done();
            });
        });

        it('logs a warning if a loaded command does not contain help text', done => {
            var cliLoader = new CliLoader(flatironAppMock, {
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

        it('runs the functions defined by the init modules of LabShare packages', done => {
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

        it('deletes all the commands assigned to the app by .load', (done) => {
            cliLoader.load(() => {
                expect(_.keys(flatironAppMock.commands)).toContainAllOf(['hello', 'add', 'subtract', 'goodbye']);
                expect(_.keys(cliLoader._commands).length).toBeGreaterThan(0);
                cliLoader.unload();
                expect(_.keys(flatironAppMock.commands)).not.toContainAllOf(['hello', 'add', 'subtract', 'goodbye']);
                expect(_.keys(cliLoader._commands).length).toBe(0);
                done();
            });
        });

    });

    describe('.displayHelp', () => {

        it('logs messages for each command found by the cliLoader', (done) => {
            cliLoader.displayHelp();
            expect(flatironAppMock.log.help.calls[0].args).toMatch(/No commands found/);

            cliLoader.load(() => {
                cliLoader.displayHelp();
                expect(allArgs(flatironAppMock.log.help)).toContainAllOf([
                    'hello', 'goodbye', 'add', 'subtract', 'cli-package1', 'cli-package2'
                ]);
                done();
            });
        });

        it('logs messages for uncategorized commands too', () => {
            flatironAppMock.commands['uncategorizedCmd'] = function () { };
            cliLoader = new CliLoader(flatironAppMock, options);
            cliLoader.displayHelp();
            expect(allArgs(flatironAppMock.log.help)).toContain('uncategorizedCmd');
        });

    });

});