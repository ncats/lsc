/**
 * @exports PackageUpdate
 */

'use strict';

import assert = require('assert');
import rimraf = require('rimraf');
import path = require('path');
import {EventEmitter} from 'events';
import {isPackageSync} from '../cli/utils';
import {execSync, exec, ChildProcess} from 'child_process';

function gitPull(directory: string): void {
  execSync(
    `git --git-dir=${path.join(
      directory,
      '.git',
    )} --work-tree=${directory} pull`,
  );
}

function npmInstall(directory: string): ChildProcess {
  return exec(`npm i --prefix ${directory}`) as ChildProcess;
}

function cleanModuleDirectories(directory: string): void {
  rimraf.sync(path.join(directory, 'node_modules'));
  rimraf.sync(path.join(directory, 'ui', 'bower_components'));
}

interface PackageUpdateOptions {
  cwd: string;
}

export class PackageUpdate extends EventEmitter {
  private cwd: string;

  /**
   * @description Package updater class
   * @param {object} options
   * @param {string} options.cwd
   * @constructor
   */
  constructor(options: PackageUpdateOptions = {cwd: null}) {
    super();
    this.cwd = options.cwd || process.cwd();
    assert.ok(
      isPackageSync(this.cwd),
      `PackageUpdater: ${this.cwd} does not contain a LabShare package!`,
    );
  }

  updateSync() {
    this.emit(
      'status',
      'Attempting to clean the global NPM and Bower caches...',
    );

    execSync('npm cache clean');
    execSync(`${path.join('node_modules', '.bin', 'bower')} cache clean`);

    this.emit(
      'status',
      `Pulling the latest code from ${this.cwd}\'s Git repository...`,
    );

    gitPull(this.cwd);

    this.emit(
      'status',
      `Removing ${this.cwd}\'s node_modules and bower_components...`,
    );

    cleanModuleDirectories(this.cwd);

    // install all the NPM and Bower modules
    this.emit(
      'status',
      `Installing ${this.cwd}\'s NPM and Bower dependencies...`,
    );

    const child = npmInstall(this.cwd);
    child.stdout.on('data', data => {
      this.emit('status', data);
    });
    child.stdout.on('end', () => {
      this.emit('status', 'Finished installing project dependencies...');
    });
  }
}
