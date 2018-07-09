import {exec} from 'child_process';
import * as path from "path";
import {getPackageManifest} from "../../../../lib/cli";

describe('LSC', () => {

    const cwd = path.join(__dirname, '..', '..', '..', '..');
    const binPath = getPackageManifest(cwd).bin.lsc;

    it('runs commands', (done: DoneFn) => {
        exec(`node ${binPath} --version`, {cwd}, (error: Error) => {
            if (error) {
                done.fail(error);
                return;
            }

            done();
        });
    });

    it('exits with an error if the command is not recognized', (done: DoneFn) => {
        exec(`node ${binPath}`, {cwd}, (error: any) => {
            expect(error.message).toContain('Command not found');
            expect(error.code).not.toBe(0);

            done();
        });
    });

});