import {sync as commandExistsSync} from 'command-exists';
import {join} from 'path';
import {SpawnSyncStrict} from './spawn-sync-strict';

const defaultSpawnOptions = {stdio: 'inherit', encoding: 'utf-8'} as const;

export function bootstrapUIPackage(answers: any, context) {
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
    context.log.info(`OS does not contain chmod command.`);
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
