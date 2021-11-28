/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

import { config } from 'dotenv';
const encrypt = require('cypress-nextjs-auth0/encrypt');

config({ path: '.env.local' });

const setConfig = (on, config) => {
  on('task', { encrypt });

  // cy.login only works without audience?
  // config.env.auth0Audience = process.env.AUTH0_AUDIENCE;

  config.env.auth0TestPassword = process.env.AUTH0_TEST_PASSWORD;
  config.env.auth0TestUsername = process.env.AUTH0_TEST_USERNAME;
  config.env.auth0TestAdminPassword = process.env.AUTH0_TEST_ADMIN_PASSWORD;
  config.env.auth0TestAdminUsername = process.env.AUTH0_TEST_ADMIN_USERNAME;

  config.env.auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  config.env.auth0ClientId = process.env.AUTH0_CLIENT_ID;
  config.env.auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  config.env.auth0CookieSecret = process.env.AUTH0_SECRET;
  config.env.auth0Scope = process.env.AUTH0_SCOPE;
  config.env.auth0SessionCookieName = 'appSession';

  return config;
};

export default setConfig;
