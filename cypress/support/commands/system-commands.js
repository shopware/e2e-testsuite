const path = require('path');
const fs = require('fs');

/**
 * Activates Shopware theme for Cypress test runner
 * @memberOf Cypress.Chainable#
 * @name activateShopwareTheme
 * @function
 */
Cypress.Commands.add('activateShopwareTheme', () => {
    // Cypress includes jQuery
    const $head = Cypress.$(parent.window.document.head); // eslint-disable-line no-restricted-globals
    $head.append(
        `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/brands.css" integrity="sha384-i2PyM6FMpVnxjRPi0KW/xIS7hkeSznkllv+Hx/MtYDaHA5VcF0yL3KVlvzp8bWjQ" crossorigin="anonymous">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/fontawesome.css" integrity="sha384-sri+NftO+0hcisDKgr287Y/1LVnInHJ1l+XC7+FOabmTTIK0HnE2ID+xxvJ21c5J" crossorigin="anonymous">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/shopware/e2e-testsuite/master/theme/shopware.css" crossorigin="anonymous">`
    );
});

/**
 * Cleans up any previous state by restoring database and clearing caches
 * @memberOf Cypress.Chainable#
 * @name cleanUpPreviousState
 * @function
 */
Cypress.Commands.add('cleanUpPreviousState', () => {
    if (Cypress.env('localUsage')) {
        return cy.exec(`${Cypress.env('projectRoot')}/psh.phar e2e:restore-db`)
            .its('stdout').should('contain', 'All commands successfully executed!');
    }

    return cy.request(`http://${new URL(Cypress.config('baseUrl')).hostname}:8005/cleanup`)
        // ToDo: Remove when cypress issue #5150 is released:
        //  https://github.com/cypress-io/cypress/pull/5150/files
        .its('body').should('eq', 'success');
});

/**
 * Cleans up any previous state by restoring database and clearing caches
 * @memberOf Cypress.Chainable#
 * @name openInitialPage
 * @function
 */
Cypress.Commands.add('openInitialPage', (url) => {
    // Request we want to wait for later
    cy.intercept(`${Cypress.env('apiPath')}/_info/me`).as('meCall');


    cy.visit(url);
    cy.wait('@meCall')
        .its('response.statusCode').should('equal', 200);
    cy.get('.sw-desktop').should('be.visible');
});

/**
 * Switches administration UI locale
 * @memberOf Cypress.Chainable#
 * @name setLocale
 * @function
 */
Cypress.Commands.add('setLocale', (locale = Cypress.env('locale')) => {
    return cy.window().then((win) => {
        win.localStorage.setItem('sw-admin-locale', locale)
    });
});

/**
 * Switches administration UI locale to EN_GB
 * @memberOf Cypress.Chainable#
 * @name setLocaleToEnGb
 * @function
 */
Cypress.Commands.add('setLocaleToEnGb', () => {
    return cy.window().then((win) => cy.setLocale('en-GB'));
});

