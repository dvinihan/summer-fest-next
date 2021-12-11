const testGroupA = {
  group_name: "Charlie's Angles",
  leader_name: 'Grand Master',
};
const testGroupB = {
  group_name: "Jon's Devils",
  leader_name: 'Jon',
};

describe('add group', () => {
  const baseUrl = Cypress.config().baseUrl;

  it('login', () => {
    cy.login({
      username: Cypress.env('auth0TestAdminUsername'),
      password: Cypress.env('auth0TestAdminPassword'),
    });
  });
  it('redirect to group edit page', () => {
    cy.visit('/admin');
    cy.url().should('equal', `${baseUrl}/admin`);
  });
  it('go to add group page', () => {
    cy.contains('Add a group', { matchCase: false }).click();
    cy.url({ timeout: 6000 }).should('equal', `${baseUrl}/groupAdd`);
  });
  it('fill all fields', () => {
    cy.get('input[name=group_name]').type(testGroupA.group_name);
    cy.get('input[name=leader_name]').type(testGroupA.leader_name);
  });
  it('save', () => {
    cy.intercept(`${baseUrl}/api/addGroup`).as('addGroupRequest');
    cy.contains('save', { matchCase: false }).click();
    cy.contains('Group successfully saved');
    cy.get('@addGroupRequest').then((req: any) => {
      cy.wrap(req.request.body).should('include', testGroupA);
    });
  });
});

describe('edit group', () => {
  const baseUrl = Cypress.config().baseUrl;

  it('wait for edit page', () => {
    cy.url({ timeout: 6000 }).should('include', `${baseUrl}/groupEdit?id=`);
  });
  it('edit all fields', () => {
    cy.get('input[name=group_name]').clear().type(testGroupB.group_name);
    cy.get('input[name=leader_name]').clear().type(testGroupB.leader_name);
  });
  it('save', () => {
    cy.intercept(`${baseUrl}/api/editGroup`).as('editGroupRequest');
    cy.contains('save', { matchCase: false }).click();
    cy.contains('Group successfully saved');
    cy.get('@editGroupRequest').then((req: any) => {
      cy.wrap(req.request.body).should('include', testGroupB);
    });
  });
});

describe('delete group', () => {
  it('delete', () => {
    cy.contains('delete', { matchCase: false }).click();
    cy.contains('yes', { matchCase: false }).click();
    cy.contains(`Group ${testGroupB.group_name} successfully deleted.`);
  });
});
