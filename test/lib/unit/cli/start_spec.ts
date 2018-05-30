import {checkVersion} from "../../../../lib/check-self-update";
const {exec} = require('child_process');
import {start} from "../../../../lib/cli";

describe('.start()', () => {

    afterEach(() => {
        delete global.LabShare;
    });

    it('bootstraps the CLI', () => {
        expect(global.LabShare).toBeUndefined();

        start();

        expect(global.LabShare).toBeDefined();
    });

    describe('.checkVersion()', () => {

        it('checks if the installed version of <package-name> needs to be updated', async (done: DoneFn) => {
            try {
                await checkVersion({name: 'lsc', logger: console.log});

                done();
            } catch (error) {
                done.fail(error);
            }
        });

    });

});