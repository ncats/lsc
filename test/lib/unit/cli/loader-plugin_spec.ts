'use strict';

import path = require('path');
import _ = require('lodash');
import flatiron = require('flatiron');
import * as cliLoaderPlugin from '../../../../lib/cli/loader-plugin';

const packagePath = './test/fixtures/main-package';

function createFlatironApp(options) {
  const app = flatiron.app;
  app.name = 'cli-test.js';
  app.use(flatiron.plugins.cli);
  app.use(cliLoaderPlugin, options);
  return app;
}

describe('cliLoaderPlugin', () => {
  let flatironApp;

  beforeEach(() => {
    flatironApp = createFlatironApp({
      directories: path.join(packagePath, 'node_modules', 'cli-package1'),
    });
  });

  describe('After attaching the plugin', () => {
    it('extends the Flatiron app with new CLI commands', done => {
      expect(_.keys(flatironApp.commands).length).toBe(0);
      flatironApp.init(() => {
        const commandNames = _.keys(flatironApp.commands);
        expect(commandNames.length).toBe(3);
        _.each(['hello', 'help', 'goodbye'], (name: string) => {
          expect(commandNames).toContain(name);
        });

        done();
      });
    });
  });
});
