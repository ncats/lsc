/// <reference types="cypress" />

let config = require('../../fixtures/config');

context('<%= appNameSlug %>', () => {
    beforeEach(() => {
        Cypress.Cookies.defaults({
            preserve: cookie => true
        });
    });

    before(() => {
        cy.visit(config.url);
    });

    it('Finds search icon', () => {
        cy.get('.icon-lsi-search');
    });

    /* Stop testing in case one fails. 
    Credit: https://github.com/cypress-io/cypress/issues/518#issuecomment-373369129 */
    afterEach(function() {
        if (this.currentTest.state === 'failed') {
            Cypress.runner.stop();
        }
    });
});