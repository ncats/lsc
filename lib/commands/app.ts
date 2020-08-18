'use strict';

import * as gulp from 'gulp';
import * as template from 'gulp-template';
import * as rename from 'gulp-rename';
import * as changeCase from 'change-case';
import {PackageUpdate} from '../../lib/package/update';
import {camelCaseTransformMerge, pascalCaseTransformMerge} from 'change-case';
import {padLeft} from '../utils/pad-left';
import {bootstrapUIPackage} from '../utils/bootstrap-ui-package';
import {readArguments, defaultPrompts} from '../utils/create-utils';

const _ = require('underscore.string');
const inquirer = require('inquirer');

export const create = function() {
  /* Skip prompts if cli arguments were provided */
  const {prompts: remainingPrompts, cliAnswers} = readArguments(defaultPrompts);
  inquirer.prompt(remainingPrompts).then(answers => {
    /* Extend with answers from CLI arguments */
    answers = {...answers, ...cliAnswers};

    if (!answers.moveon) {
      return;
    }
    const today = new Date(),
      year = today.getFullYear().toString();

    answers.appVersion = [
      'v0',
      year.slice(2),
      today.getMonth() + 1 + padLeft(today.getDate()),
    ].join('.');
    answers.appNameSlug = _.slugify(answers.appName);
    answers.appNamePascalCase = changeCase.pascalCase(answers.appName, {
      transform: pascalCaseTransformMerge,
    });
    answers.appNameCamelCase = changeCase.camelCase(answers.appName, {
      transform: camelCaseTransformMerge,
    });
    answers.appTitle = changeCase
      .capitalCase(answers.appName)
      .split(' ')
      .join('');
    answers.appYear = year;
    gulp
      .src([
        `${__dirname}/../../templates/common/**`,
        `${__dirname}/../../templates/${answers.projectType}-package/**`,
      ])
      //  the following regex is for ignoring ${} and only use <%= %> for the templates
      .pipe(template(answers, {interpolate: /<%=([\s\S]+?)%>/g}))
      .pipe(
        rename(file => {
          /* Generate dynamic folder and file names with provided app name */
          const slugRegex = /__app-name-slug__/g;
          file.basename = file.basename.replace(slugRegex, answers.appNameSlug);
          file.dirname = file.dirname.replace(slugRegex, answers.appNameSlug);

          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
          // package.json was causing issues with the Files property in the template
          // the only solution is to
          if (file.basename === 'tmp-package') {
            file.basename = 'package';
          }
        }),
      )
      .pipe(gulp.dest('./'))
      .on('end', () => {
        this.log.info(
          `Successfully created LabShare ${answers.projectType} package...`,
        );

        /* Apply instructions only for ui projects meanwhile.
        In the future, we could extend the features to other package types. */
        if (answers.projectType === 'ui') {
          bootstrapUIPackage(answers, this);
        }
      });
  });
};

export const update = function() {
  const packageUpdate = new PackageUpdate();

  this.log.info('Updating current project...');

  packageUpdate.on('status', message => {
    this.log.info(message);
  });

  packageUpdate.updateSync();
};
