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

dotenv.config();

const setConfig = (on, config) => {
  config.env.auth0_username = process.env.AUTH0_TEST_USERNAME;
  config.env.auth0_password = process.env.AUTH0_TEST_PASSWORD;
  config.env.auth0_domain = process.env.AUTH0_ISSUER_BASE_URL;
  config.env.auth0_audience = process.env.AUTH0_AUDIENCE;
  config.env.auth0_scope = process.env.AUTH0_SCOPE;
  config.env.auth0_client_id = process.env.AUTH0_CLIENT_ID;
  config.env.auth0_client_secret = process.env.AUTH0_CLIENT_SECRET;

  return config;
};

export default setConfig;
