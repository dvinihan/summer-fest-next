// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};

type Credentials = {
  username: string;
  password: string;
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command added by the cypress-nextjs-auth0 package
       */
      login(credentials: Credentials): Chainable<Element>;
      /**
       * Custom command added by the cypress-nextjs-auth0 package
       */
      logout(): Chainable<Element>;
    }
  }
}
