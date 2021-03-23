/// <reference types="cypress" />

const path = require('path');
/* Configure Chrome to bypass x-frame-headers with extension
https://medium.com/@you54f/configuring-cypress-to-work-with-iframes-cross-origin-sites-afff5efcf61f */
module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, options) => {
        let args = options.args;
        if (browser.name === 'chrome') {
            const ignoreXFrameHeadersExtension = path.join(
                __dirname,
                '../extensions/ignore-x-frame-headers'
            );
            args.push(
                args.push(`--load-extension=${ignoreXFrameHeadersExtension}`)
            );
            args.push(
                '--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process'
            );
        }
        return options;
    });
};
