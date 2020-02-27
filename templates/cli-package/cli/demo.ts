import * as yargs from 'yargs';
import inquirer = require('inquirer');
import {sum} from '../lib';
const logger = global.LabShare.Logger;
const config = global.LabShare.Config;
// Important for adding help
export const usage = [
  `demo`,
  ``,
  `lsc demo hello - Executes hello command`,
  `   e.g  lsc demo hello --name=world`,
  `lsc demo question - Executes question command`,
  `   e.g  lsc demo question`,
  `lsc demo example - Executes lib example`,
  `   e.g  lsc demo example`,
  `lsc demo configuration - Executes configuration command`,
  `   e.g  lsc demo configuration`,
];
export function hello() {
  const {name}: any = yargs.options({
    name: {
      desc: 'This is an optional value',
      default: 'name',
    },
  });
  // using built-in logging
  logger.info('Hello: ' + name);
}

export function question() {
  // using inquirer
  const prompts = [
    {
      name: 'firstTime',
      message: 'Is this your first time using lsc?',
      type: 'confirm',
      default: 'yes',
    },
  ];
  inquirer.prompt(prompts).then(answers => {
    logger.info(answers.firstTime);
  });
}
export function configuration() {
  // reading from global
  logger.info(JSON.stringify(config));
}

export function example() {
  // using a library with tests
  logger.info(sum(10, 10));
}
