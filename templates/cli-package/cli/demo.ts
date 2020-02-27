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
  `   e.g  lsc demo hello --world=world`,
  `lsc demo world - Executes world command`,
  `   e.g  lsc demo world`,
  `lsc demo example - Executes world example`,
  `   e.g  lsc demo example`,
  `lsc demo configuration - Executes configuration command`,
  `   e.g  lsc demo configuration`,
];
export function hello() {
  const {world}: any = yargs.options({
    world: {
      desc: 'This is an optional value',
      default: 'world',
    },
  });
  // using built-in logging
  logger.info('Hello: ' + world);
}

export function world() {
  // using inquirer
  const prompts = [
    {
      name: 'firstTime',
      message: 'It is your first time using lsc?',
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
