/* Cypress.env('key') calls can be used here 
Export a config object for testing */
module.exports = {
    url: Cypress.env('TEST_URL') || 'https://a-ci.labshare.org'
};
