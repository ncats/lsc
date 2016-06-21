'use strict';

const gulp = require('gulp'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

function padLeft(dateValue) {
    return (dateValue < 10) ? '0' + dateValue : dateValue.toString();
}

let defaultAppName = process.cwd().split('/').pop().split('\\').pop();

module.exports = {
    usage: [
        'lsc package create - creates a LabShare package inside the current directory',
        ''
    ],
    create() {
        let prompts = [
            {
                name: 'projectType',
                message: 'Which type of LabShare package do you want to create?',
                type: 'list',
                default: 'cli',
                choices: ['cli', 'ui', 'api']
            },
            {
                name: 'appName',
                message: 'What is the name of your project?',
                default: defaultAppName
            },
            {
                name: 'appDescription',
                message: 'What is the description?'
            },
            {
                type: 'confirm',
                name: 'moveon',
                message: 'Continue?'
            }
        ];

        inquirer.prompt(prompts).then(answers => {
            if (!answers.moveon) {
                return;
            }

            let today = new Date(),
                year = today.getFullYear().toString();

            answers.appVersion = [
                'v0',
                year.slice(2),
                (today.getMonth() + 1) + padLeft(today.getDate())
            ].join('.');
            answers.appNameSlug = _.slugify(answers.appName);
            answers.appYear = year;

            gulp.src([
                    `${__dirname}/../.eslintrc.json`,
                    `${__dirname}/../.eslintignore`,
                    `${__dirname}/../templates/common/**`,
                    `${__dirname}/../templates/${answers.projectType}-package/**`
                ])
                .pipe(template(answers))
                .pipe(rename(file => {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .on('end', () => {
                    this.log.info(`Successfully created LabShare ${answers.projectType} package...`);
                });
        });
    }
};
