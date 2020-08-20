import * as yargs from 'yargs';
import {getCLIAnswers} from './get-cli-answers';
import {invert} from 'lodash';

/** Mapping of CLI argument names to respective prompt names */
export const argsToPromptNames = {
  type: 'projectType',
  name: 'appName',
  description: 'appDescription',
  y: 'moveon',
} as const;

export const UI_PROJECT_TYPE = 'ui';
export const API_PROJECT_TYPE = 'api';
export const CLI_PROJECT_TYPE = 'cli';

export type answersObject = {
  projectType:
    | typeof UI_PROJECT_TYPE
    | typeof API_PROJECT_TYPE
    | typeof CLI_PROJECT_TYPE;
  appName: string;
  appDescription: string;
  moveon: boolean;
  appVersion: string;
  appNameSlug: string;
  appNamePascalCase: string;
  appNameCamelCase: string;
  appTitle: string;
  appYear: string;
};

/** Inverse mapping of argsToPromptNames */
const promptNamesToArgs = invert(argsToPromptNames);

/** Available CLI arguments for programmatic use. */
const defaultCLIArgs = yargs.options({
  type: {
    type: 'string',
    choices: [CLI_PROJECT_TYPE, API_PROJECT_TYPE, UI_PROJECT_TYPE],
  },
  name: {type: 'string'},
  y: {type: 'boolean'},
}).argv;

/** Default App Name based on CWD */
const defaultAppName = process
  .cwd()
  .split('/')
  .pop()
  .split('\\')
  .pop();

/** Prompt options */
export const defaultPrompts = [
  {
    name: 'projectType',
    message: 'Which type of LabShare package do you want to create?',
    type: 'list',
    default: CLI_PROJECT_TYPE,
    choices: [CLI_PROJECT_TYPE, API_PROJECT_TYPE, UI_PROJECT_TYPE],
  },
  {
    name: 'appName',
    message: 'What is the name of your project?',
    default: defaultAppName,
  },
  {
    name: 'appDescription',
    message: 'What is the description?',
  },
  {
    type: 'confirm',
    name: 'moveon',
    message: 'Continue?',
  },
] as const;

export const getPromptNameFor = (key: keyof typeof argsToPromptNames) => {
  return argsToPromptNames[key];
};

/** Decides if a prompt should be showed to the user.
 * Returns false in case the equivalent cli argument has been provided.
 */
const shouldPrompt = cliArgs => prompt => {
  const {name} = prompt;
  const arg = promptNamesToArgs[name];
  return typeof arg === 'string' ? !cliArgs[arg] : true;
};

/** Read arguments provided in the CLI and return remaining prompts to be used. */
export const readArguments = (prompts: typeof defaultPrompts) => {
  return {
    prompts: prompts.filter(shouldPrompt(defaultCLIArgs)),
    cliAnswers: getCLIAnswers(defaultCLIArgs),
  };
};
