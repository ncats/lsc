import {checkVersion} from '../../../../lib/check-self-update';
import {start} from '../../../../lib/cli';

describe('.start()', () => {
  afterEach(() => {
    delete global.LabShare;
  });

  it('bootstraps the CLI', async () => {
    expect(global.LabShare).toBeUndefined();

    await start({});

    expect(global.LabShare).toBeDefined();
  });

  describe('.checkVersion()', () => {
    it('checks if the installed version of "package-name" needs to be updated', async () => {
      await checkVersion({name: 'lsc', logger: console.log});
    });
  });
});
