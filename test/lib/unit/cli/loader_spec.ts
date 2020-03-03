"use strict";

import path = require("path");
import _ = require("lodash");
import { CliLoader } from "../../../../lib/cli";

function allArgs(spy) {
  return _.flatten(
    _.map(spy.calls.all(), (call: any) => {
      return call.args;
    })
  );
}

function toContainAllOf(actual: string[], expected: string[]): boolean {
  return _.every(expected, value => {
    return _.includes(actual, value);
  });
}

describe("CliLoader", () => {
  const packagePath = "./test/fixtures/main-package";

  let cliLoader, flatironAppMock, options;

  beforeEach(() => {
    flatironAppMock = {
      commands: {},
      log: {
        warn: jasmine.createSpy("warn"),
        help: jasmine.createSpy("help"),
        error: jasmine.createSpy("error")
      },
      plugins: {
        cli: {}
      },
      cli: {}
    };
    options = {
      cwd: packagePath
    };

    cliLoader = new CliLoader(flatironAppMock, options);
  });

  afterEach(() => {
    delete global.LabShare;
  });

  it("throws an exception when invalid arguments and/or options are provided", () => {
    let original = _.cloneDeep(flatironAppMock);

    expect(function() {
      new CliLoader(flatironAppMock, {
        cwd: []
      } as any);
    }).toThrow();

    expect(function() {
      flatironAppMock.plugins = null;
      new CliLoader(flatironAppMock, {});
    } as any).toThrow();
    _.assign(flatironAppMock, original);

    expect(function() {
      flatironAppMock.commands = null;
      new CliLoader(flatironAppMock, {});
    } as any).toThrow();
    _.assign(flatironAppMock, original);

    expect(function() {
      flatironAppMock.log = null;
      new CliLoader(flatironAppMock, {});
    }).toThrow();
    _.assign(flatironAppMock, original);

    expect(function() {
      new CliLoader(flatironAppMock, {
        directories: 42
      } as any);
    }).toThrow();

    expect(function() {
      new CliLoader(flatironAppMock, {
        directories: ["a/path/to/a/directory"]
      } as any);
    }).not.toThrow();
  });

  it("does not throw if options are not provided", () => {
    expect(function() {
      new CliLoader(flatironAppMock, {});
    }).not.toThrow();
  });

  describe(".load", () => {
    it("adds CLI commands to the app and caches command information", async () => {
      expect(cliLoader._commands["cli-package1"]).toBeUndefined();
      expect(cliLoader._commands["cli-package2"]).toBeUndefined();
      expect(cliLoader._commands["cli-package4"]).toBeUndefined();
      expect(_.isEmpty(_.keys(flatironAppMock.commands))).toBeTruthy();

      await cliLoader.load();

      let commandInfo1 = cliLoader._commands["cli-package1"],
        commandInfo2 = cliLoader._commands["cli-package2"],
        commandInfo4 = cliLoader._commands["cli-package4"];

      expect(
        toContainAllOf(_.keys(commandInfo1).concat(_.keys(commandInfo2)), [
          "hello",
          "add",
          "subtract",
          "goodbye"
        ])
      ).toBeTruthy();
      expect(
        toContainAllOf(_.keys(commandInfo1).concat(_.keys(commandInfo4)), [
          "hello",
          "world",
          "goodbye"
        ])
      ).toBeTruthy();
      expect(
        toContainAllOf(_.keys(flatironAppMock.commands), [
          "hello",
          "add",
          "world",
          "subtract",
          "goodbye"
        ])
      ).toBeTruthy();
    });

    it('attempts to load commands from each directory specified by the "directories" option', async () => {
      const cliLoader = new CliLoader(flatironAppMock, {
        directories: [path.join(packagePath, "node_modules", "cli-package1")]
      });

      expect(cliLoader._commands["cli-package1"]).toBeUndefined();
      expect(
        toContainAllOf(_.keys(flatironAppMock.commands), ["hello", "goodbye"])
      ).toBeFalsy();

      await cliLoader.load();

      let commandInfo1 = cliLoader._commands["cli-package1"];
      expect(commandInfo1["goodbye"]).toBeDefined();
      expect(commandInfo1["hello"]).toBeDefined();

      expect(
        toContainAllOf(_.keys(flatironAppMock.commands), ["goodbye", "hello"])
      ).toBeTruthy();
    });

    it('times out if the functions passed to the "initFunctions" option exceed the timeout limit', async (done: DoneFn) => {
      let options = {
        cwd: packagePath,
        timeout: 25,
        initFunctions: [
          done => {
            setTimeout(() => {
              done();
            }, 50);
          }
        ]
      };

      cliLoader = new CliLoader(flatironAppMock, options);

      try {
        await cliLoader.load();

        done.fail("Should have failed!");
      } catch (error) {
        expect(error.message).toContain("TIMEOUT ERROR");

        done();
      }
    });

    it("ignores duplicate commands from LabShare packages with the same name", async () => {
      cliLoader = new CliLoader(flatironAppMock, {
        directories: [
          path.join(packagePath, "node_modules", "cli-package1"),
          path.join(packagePath, "node_modules", "cli-package1")
        ]
      });

      await cliLoader.load();

      expect(flatironAppMock.log.error).not.toHaveBeenCalled();
    });

    it("logs an error if two different LabShare packages try to load a command with the same name", async () => {
      await cliLoader.load();

      expect(flatironAppMock.log.error.calls.first().args[0]).toMatch(
        /A command with the same name has already been loaded/
      );
    });

    it("logs an error if an exception is thrown", async (done: DoneFn) => {
      cliLoader.options.cwd = 1337;

      try {
        await cliLoader.load();

        done.fail("Should have failed to load commmands");
      } catch (error) {
        expect(error.message).toContain("Failed to load CLI commands");
        done();
      }
    });

    it("logs a warning if a loaded command does not contain help text", async () => {
      const cliLoader = new CliLoader(flatironAppMock, {
        cwd: packagePath,
        directories: [path.join(packagePath, "node_modules", "cli-package2")]
      });

      await cliLoader.load();
      expect(flatironAppMock.log.warn).toHaveBeenCalled();
    });
  });

  describe(".unload", () => {
    it("deletes all the commands assigned to the app by .load", async () => {
      await cliLoader.load();

      expect(
        toContainAllOf(_.keys(flatironAppMock.commands), [
          "hello",
          "add",
          "subtract",
          "goodbye"
        ])
      ).toBeTruthy();
      expect(_.keys(cliLoader._commands).length).toBeGreaterThan(0);
      cliLoader.unload();
      expect(
        toContainAllOf(_.keys(flatironAppMock.commands), [
          "hello",
          "add",
          "subtract",
          "goodbye"
        ])
      ).toBeFalsy();
      expect(_.keys(cliLoader._commands).length).toBe(0);
    });
  });

  describe(".displayHelp", () => {
    it("logs messages for each command found by the cliLoader", async () => {
      cliLoader.displayHelp();

      expect(flatironAppMock.log.help.calls.first().args).toMatch(
        /No commands found/
      );

      await cliLoader.load();

      cliLoader.displayHelp();

      expect(
        toContainAllOf(allArgs(flatironAppMock.log.help), [
          "hello",
          "goodbye",
          "add",
          "subtract",
          "cli-package1",
          "cli-package2"
        ])
      );
    });

    it("logs messages for uncategorized commands too", () => {
      flatironAppMock.commands["uncategorizedCmd"] = function() {};

      cliLoader = new CliLoader(flatironAppMock, options);
      cliLoader.displayHelp();

      expect(flatironAppMock.log.help.calls.allArgs()).toContain([
        "uncategorizedCmd"
      ]);
    });
  });
});
