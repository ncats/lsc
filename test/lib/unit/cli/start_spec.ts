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
});
