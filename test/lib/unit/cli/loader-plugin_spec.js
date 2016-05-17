'use strict';

const path = require('path'),
    _ = require('lodash'),
    flatiron = require('flatiron');

describe('cliLoaderPlugin', () => {

    let cliLoaderPlugin,
        packagePath,
        flatironApp,
        createFlatironApp;

    beforeEach(function () {
        packagePath = './test/fixtures/main-package';
        cliLoaderPlugin = require('../../../../lib/cli/loader-plugin');
        createFlatironApp = function (options) {
            var app = flatiron.app;
            app.name = 'cli-test.js';
            app.use(flatiron.plugins.cli);
            app.use(cliLoaderPlugin, options);
            return app;
        };
        flatironApp = createFlatironApp({
            directories: path.join(packagePath, 'node_modules', 'cli-package1')
        });
    });

    describe('After attaching the plugin', function () {

        it('extends the Flatiron app with new CLI commands', done => {
            expect(_.keys(flatironApp.commands).length).toBe(0);
            flatironApp.init(() => {
                let commandNames = _.keys(flatironApp.commands);
                expect(commandNames.length).toBe(3);
                _.each(['hello', 'help', 'goodbye'], name => {
                    expect(commandNames).toContain(name);
                });
                done();
            });
        });

    });

});