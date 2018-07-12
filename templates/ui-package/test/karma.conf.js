'use strict';

const {join} = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = function (config) {

    let configuration = {
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'test/main-index.ts'
        ],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        reporters: ['progress', 'coverage-istanbul'],
        coverageIstanbulReporter: {
            // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ['html', 'lcovonly', 'text-summary'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: join('test', 'ui', 'coverage'),

            // Combines coverage information from multiple browsers into one report rather than outputting a report
            // for each browser.
            combineBrowserReports: true,

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,

            // stop istanbul outputting messages like `File [filename] ignored, nothing could be mapped`
            skipFilesWithNoCoverage: false,

            verbose: false // output config used by istanbul for debugging
        },
        preprocessors: {
            'test/main-index.ts': ['webpack']
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        exclude: [],
        port: 8080,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true
        },
        // Workaround for test timeout issue: https://github.com/jasmine/jasmine/issues/1327#issuecomment-332939551
        browserNoActivityTimeout: 150000,
        mime: {  // Chrome version 55+ has a bug with TS. See: https://stackoverflow.com/a/41054760
            'text/x-typescript': ['ts', 'tsx']
        },
        colors: true,
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,
        webpack: {
            mode: 'development',
            resolve: {
                // Add '.ts' and '.tsx' as a resolvable extension.
                extensions: [".ts", ".tsx", ".js"]
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {}
                        },
                        exclude: '/node_modules'
                    },
                    {
                        test: /ui\/.+(\.ts|\.js)$/,
                        exclude: /(node_modules|spec\.ts$|spec.js$)/,
                        loader: 'istanbul-instrumenter-loader',
                        enforce: 'post',
                        options: {
                            esModules: true
                        }
                    },
                    {
                        test: /\.html$/,
                        use: ['html-loader']
                    },
                    {
                        test: /\.css$/,
                        use: ['null-loader']
                    },
                    {
                        test: /\.scss$/,
                        use: ['null-loader']
                    },
                    {
                        test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                        loader: 'null-loader'
                    }
                ]
            },
            plugins: [
                new HardSourceWebpackPlugin()
            ],
            cache: true,
            devtool: 'inline-source-map'
        }
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
};
