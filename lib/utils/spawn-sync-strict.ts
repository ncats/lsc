import {spawnSync} from 'child_process';
type onErrorFn = (
  spawnObj: ReturnType<typeof spawnSync>,
  ...args: spawnSyncParameters
) => number;
type spawnSyncParameters = Parameters<typeof spawnSync>;

/** Wraps spawnSync to abort main process in case sub process fails */
export const SpawnSyncStrict = (onError: onErrorFn = () => 1) => (
  ...args: spawnSyncParameters
) => {
  const wrappedCall = spawnSync(...args);
  if (wrappedCall.status !== 0) {
    process.exit(onError(wrappedCall, ...args));
  }
  return wrappedCall;
};
