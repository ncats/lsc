/// <reference types="cypress" />

let config = require('../../fixtures/config');

context('Actions', () => {
    beforeEach(() => {
        Cypress.Cookies.defaults({
            preserve: cookie => true
        });
    });

    before(() => {
        cy.visit(config.url);
    });

    it('finds text', () => {
        cy.contains(' Register a tenant Manage tenants ');
    });

    /* Stop testing in case one fails. 
    Credit: https://github.com/cypress-io/cypress/issues/518#issuecomment-373369129 */
    afterEach(function() {
        if (this.currentTest.state === 'failed') {
            Cypress.runner.stop();
        }
    });
});