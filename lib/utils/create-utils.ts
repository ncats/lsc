import * as yargs from 'yargs';
import {flipObject} from './flip-object';
import {getCLIAnswers} from './get-cli-answers';

/** Mapping of CLI argument names to respective prompt names */
export const argsToPromptNames = {
  type: 'projectType',
  name: 'appName',
  description: 'appDescription',
  y: 'moveon',
} as const;

/** Inverse mapping of argsToPromptNames */
const promptNamesToArgs = flipObject(argsToPromptNames);

/** Available CLI arguments for programmatic use. */
const defaultCLIArgs = yargs.options({
  type: {type: 'string', choices: ['cli', 'api', 'ui']},
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
    default: 'cli',
    choices: ['cli', 'api', 'ui'],
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
