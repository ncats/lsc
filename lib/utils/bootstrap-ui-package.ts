import {sync as commandExistsSync} from 'command-exists';
import {join} from 'path';
import {SpawnSyncStrict} from './spawn-sync-strict';
import {answersObject} from './create-utils';

const defaultSpawnOptions = {stdio: 'inherit', encoding: 'utf-8'} as const;

/* Context object is passed by flatiron during plugin registration.
Check /lib/cli/start.ts app.use(loaderPlugin, {...}) call for more information.
Flatiron inherits functionality from broadway npm module, and neither have
typings registered on npm.
This is a simplification suited for our current needs.
*/
type ContextType = {
  log: {
    info: (a: string) => void;
    error: (a: string) => void;
  };
};

/** Bootstraps UI Package template created in current working directory.
 * Installs npm packages, runs git commands to commit source code,
 * and builds angular library for local development.
 */
export function bootstrapUIPackage(
  answers: answersObject,
  context: ContextType,
) {
  const isGitInstalled = commandExistsSync('git');

  /** Helper to exit process in case one sub-process fails */
  const spawnSyncStrict = SpawnSyncStrict(({status}, a, b) => {
    context.log.error(
      `Bootstrapping process failed because sub-task "${a} ${b.join(
        ' ',
      )}" did not succeed (status ${status})`,
    );
    return 1;
  });

  /* Initialize before npm i because husky requires git for setup */
  if (isGitInstalled) {
    context.log.info(`Git is installed, initializing repo.`);
    spawnSyncStrict('git', ['init'], defaultSpawnOptions);
  }

  /* Some files should be automatically generated. Set them to read-only to avoid user manipulation */
  if (commandExistsSync('chmod')) {
    const uiModulesFolder = join(
      process.cwd(),
      'projects',
      `${answers.appNameSlug}-app`,
      'src',
      'app',
      'ui-modules',
    );
    context.log.info(`Setting files as read-only to avoid overwrite`);
    spawnSyncStrict('chmod', ['444', 'menu-items.ts', 'module-routes.ts'], {
      ...defaultSpawnOptions,
      cwd: uiModulesFolder,
    });
  } else {
    context.log.info(
      `OS does not contain chmod command. Skipping optional step (assign read-only permissions).`,
    );
  }

  /* Run NPM Install */
  context.log.info(`Installing npm dependencies.`);
  spawnSyncStrict('npm', ['i'], defaultSpawnOptions);

  /* Create initial commit */
  if (isGitInstalled) {
    context.log.info(`Committing initial work.`);
    spawnSyncStrict('git', ['add', '-A']);
    spawnSyncStrict(
      'git',
      ['commit', '-m', 'chore: create lsc ui app'],
      defaultSpawnOptions,
    );
  }

  /* Build library for first usage in development */
  context.log.info(`Building library for development`);
  spawnSyncStrict('npm', ['run', 'build:lib'], defaultSpawnOptions);

  context.log.info(`lsc create app done.`);
}
