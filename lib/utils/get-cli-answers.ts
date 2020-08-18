import { argsToPromptNames, getPromptNameFor } from "./create-utils";

/** Return CLI answers mapped to prompt names */
export const getCLIAnswers = (cliArgs) => {
  return Object.keys(cliArgs).filter(
    k => k in argsToPromptNames
  ).reduce((obj, key: keyof typeof argsToPromptNames) => {
    obj[getPromptNameFor(key)] = cliArgs[key];
    return obj;
  }, {});
};
