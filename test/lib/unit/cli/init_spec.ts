import {initConfig} from '../../../../lib/cli';
import * as path from 'path';

describe('.start()', () => {
  afterEach(() => {
    delete global.LabShare;
  });

  it('tests the init command with configuration file', async () => {
    const configFilePath = path.join(
      process.cwd(),
      'test',
      'fixtures',
      'local-config.json',
    );
    const config = initConfig({
      cwd: process.cwd(),
      configFilePath,
    });
    expect(config).toBeDefined();
  });
  it('tests the init command with a configuration folder', async () => {
    const cwd = path.join(process.cwd(), 'test', 'configuration-folder');
    const config: any = initConfig({
      cwd,
    });
    expect(config).toBeDefined();
    expect(config.test).toEqual('test from folder');
  });
  it('tests the init command with a configuration folder and test settings', async () => {
    const cwd = path.join(process.cwd(), 'test', 'configuration-folder');
    const config: any = initConfig({
      cwd,
      configuration: 'test',
    });
    expect(config).toBeDefined();
    expect(config.test).toEqual('test from folder with test config');
  });
});
