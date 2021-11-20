import { getInputByLabel } from '../helpers';

describe('signup', () => {
  it('navigates to auth0 login', () => {
    cy.visit('/');
    cy.contains('Log In').click();
  });
  it('navigates to auth0 signup', () => {
    cy.contains('Sign up').click();
  });
  it('sign up user with email address', () => {
    getInputByLabel('Email address').type('daniel.vinitsky@gmail.com');
    getInputByLabel('Password').type('Test12345');
    cy.contains('Continue').click();
  });
});
