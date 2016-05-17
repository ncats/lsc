'use strict';

const proxyquire = require('proxyquire');

require('promise-matchers');

describe('configLoader', () => {

    let configLoaderSync,
        configLoader,
        packagePath,
        config,
        options,
        cliPackage1ConfigExpectation,
        cliPackage2ConfigExpectation;

    beforeEach(() => {
        packagePath = './test/fixtures/main-package';
        options = {
            main: packagePath
        };

        configLoaderSync = require('../../../../lib/config/loader').sync;
        configLoader = require('../../../../lib/config/loader');
    });

    beforeEach(() => {
        cliPackage1ConfigExpectation = {
            "Hello": "World!",
            "Values": [1, 2, 3]
        };
        cliPackage2ConfigExpectation = {
            "aKey": "aValue",
            "Data": {
                "Data1": 1,
                "Data2": 2,
                "Data3": 3
            },
            "Listen": {
                "Port": 9999,
                "Url": "Some/url"
            }
        };
    });

    it('throws an exception when invalid arguments and/or options are provided', () => {
        expect(() => {
            configLoaderSync({
                packageDirectory: [123]
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

    });

});
