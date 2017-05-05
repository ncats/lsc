'use strict';

const path = require('path');

describe('configLoader', () => {

    let configLoaderSync,
        packagePath,
        config,
        options,
        cliPackage1ConfigExpectation,
        cliPackage3ConfigExpectation,
        cliPackage2ConfigExpectation;

    beforeEach(() => {
        packagePath = './test/fixtures/main-package';
        options = {
            main: packagePath
        };

        configLoaderSync = require('../../../../lib/config/loader').sync;
    });

    beforeEach(() => {
        cliPackage1ConfigExpectation = {
            'Hello': 'World!',
            'Values': [1, 2, 3]
        };
        cliPackage2ConfigExpectation = {
            'aKey': 'aValue',
            'Data': {
                'Data1': 1,
                'Data2': 2,
                'Data3': 3
            },
            'Listen': {
                'Port': 9999,
                'Url': 'Some/url'
            }
        };
        cliPackage3ConfigExpectation = {
            'Hi': 'there!'
        };
    });

    it('throws an exception when invalid arguments and/or options are provided', () => {
        expect(() => {
            configLoaderSync({
                main: 123
            });
        }).toThrow();
        expect(() => {
            configLoaderSync({
                directories: ['a/directory', 5]
            });
        }).toThrow();
        expect(() => {
            configLoaderSync();
        }).not.toThrow();
    });

    describe('after loading package config files synchronously', () => {

        beforeEach(() => {
            config = configLoaderSync(options);
        });

        it('returns an object containing package config data and overrides values', () => {
            expect(config['cli-package1']).toEqual(cliPackage1ConfigExpectation);
            expect(config['cli-package2']).toEqual(cliPackage2ConfigExpectation);

            // it overrides properties of other config objects
            expect(config['cli-package2'].Listen.Port).toBe(9999);
        });

        it('allows config data to be modified after initialization', () => {
            config = configLoaderSync(options);
            expect(config['cli-package1'].Hello).toBe('World!');

            config['cli-package1'].Hello = '?';
            expect(config['cli-package1'].Hello).toBe('?');

            config['cli-package1'] = null;
            expect(config['cli-package1']).toBeNull();
        });

        it('works with scoped NPM modules', () => {
            expect(config['cli-package3']).toEqual(cliPackage3ConfigExpectation);
        });

    });

    describe('after loading configuration from a file path', () => {

        beforeEach(() => {
            config = configLoaderSync({
                main: packagePath,
                configFilePath: path.join('test', 'fixtures', 'local-config.json')
            });
        });

        it('applies normalization and overrides package configuration by name', () => {
            expect(config['pack1']).toEqual({
                a: 'b'
            });

            // It still loaded the cli-package1 and cli-package2 configurations since the 'main' option was provided
            expect(config['cli-package1']).toEqual(cliPackage1ConfigExpectation);

            // The 'configFilePath' config file data replaced cli-package2's configuration
            expect(config['cli-package2']).toEqual({
                value: 'asdef',
                Listen: {
                    Port: 9999
                }
            });
        });

    });

});
