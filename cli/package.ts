'use strict';

import { create, update } from '../lib/commands'

module.exports = {
    usage: [
        'lsc package create - creates a LabShare package inside the current directory',
        'lsc package update - performs a clean update of the project in the current working directory',
        ''
    ], create, update
};
