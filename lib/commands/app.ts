"use strict";

import * as gulp from "gulp";
import * as template from "gulp-template";
import * as rename from "gulp-rename";
import { startCase } from "lodash";
import { PackageUpdate } from "../../lib/package/update";
const _ = require("underscore.string");
const inquirer = require("inquirer");

function padLeft(dateValue: number) {
  return dateValue < 10 ? "0" + dateValue : dateValue.toString();
}

let defaultAppName = process
  .cwd()
  .split("/")
  .pop()
  .split("\\")
  .pop();

export const create = function() {
  let prompts = [
    {
      name: "projectType",
      message: "Which type of LabShare package do you want to create?",
      type: "list",
      default: "cli",
      choices: ["cli", "api", "ui"]
    },
    {
      name: "appName",
      message: "What is the name of your project?",
      default: defaultAppName
    },
    {
      name: "appDescription",
      message: "What is the description?"
    },
    {
      type: "confirm",
      name: "moveon",
      message: "Continue?"
    }
  ];

  inquirer.prompt(prompts).then(answers => {
    if (!answers.moveon) {
      return;
    }
    let today = new Date(),
      year = today.getFullYear().toString();

    answers.appVersion = [
      "v0",
      year.slice(2),
      today.getMonth() + 1 + padLeft(today.getDate())
    ].join(".");
    answers.appNameSlug = _.slugify(answers.appName);
    answers.appTitle = startCase(answers.appName)
      .split(" ")
      .join("");
    answers.appYear = year;

    gulp
      .src([
        `${__dirname}/../../templates/common/**`,
        `${__dirname}/../../templates/${answers.projectType}-package/**`
      ])
      //  the following regex is for ignoring ${} and only use <%= %> for the templates
      .pipe(template(answers, { interpolate: /<%=([\s\S]+?)%>/g }))
      .pipe(
        rename(file => {
          if (file.basename[0] === "_") {
            file.basename = "." + file.basename.slice(1);
          }
        })
      )
      .pipe(gulp.dest("./"))
      .on("end", () => {
        this.log.info(
          `Successfully created LabShare ${answers.projectType} package...`
        );
      });
  });
};

export const update = function() {
  let packageUpdate = new PackageUpdate();

  this.log.info("Updating current project...");

  packageUpdate.on("status", message => {
    this.log.info(message);
  });

  packageUpdate.updateSync();
};
