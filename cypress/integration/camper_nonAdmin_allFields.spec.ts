const testUserGroupId = 2;

const testCamperA = {
  group_id: 2,
  first_name: 'Jonathan',
  last_name: 'Appleseed',
  gender: 'Male',
  birthday: '06-22-90',
  grade_completed: '8',
  allergies: 'Apples, peanut butter',
  parent_email: 'dannyboy@comcast.net',
  emergency_name: 'Kelly Appleseed',
  emergency_number: '952-555-6789',
  roommate: 'Colbie Cobweb',
  notes: 'Every time we touch, I get this feeling.',
  registration: 'Online',
  signed_status: 'Emailed',
  adult_leader: 'Yes',
  student_leadership_track: 'Yes',
  camp_attending: 'High School Camp',
  covid_image_type: 'Proof of Vaccine',
};
const testCamperB = {
  group_id: 2,
  first_name: 'Jonny',
  last_name: 'Ackerman',
  gender: 'Female',
  birthday: '08-10-79',
  grade_completed: '6',
  allergies: 'None',
  parent_email: 'bob@fake.net',
  emergency_name: 'Nechama',
  emergency_number: '911',
  roommate: 'Also Nechama',
  notes: 'Lives in Brooklyn',
  registration: 'Paper',
  signed_status: 'Signed',
  adult_leader: 'No',
  student_leadership_track: 'No',
  camp_attending: 'Middle School Camp',
  covid_image_type: 'Negative Test',
};

describe('add camper', () => {
  const baseUrl = Cypress.config().baseUrl;

  it('login', () => {
    cy.login({
      username: Cypress.env('auth0TestUsername'),
      password: Cypress.env('auth0TestPassword'),
    });
  });
  it('redirect to group edit page', () => {
    cy.visit('/');
    cy.url().should('equal', `${baseUrl}/groupEdit?id=${testUserGroupId}`);
  });
  it('go to add camper page', () => {
    cy.contains('Add a camper', { matchCase: false }).click();
    cy.url().should('equal', `${baseUrl}/camperAdd?groupId=${testUserGroupId}`);
  });
  it('fill all fields', () => {
    cy.get('input[name=first_name]').type(testCamperA.first_name);
    cy.get('input[name=last_name]').type(testCamperA.last_name);
    cy.get('input[name=gender]').parent().click();
    cy.contains(testCamperA.gender).click();
    cy.get('input[name=birthday]').type(testCamperA.birthday);
    cy.get('input[name=grade_completed]').parent().click();
    cy.contains(testCamperA.grade_completed).click();
    cy.get('input[name=allergies]').type(testCamperA.allergies);
    cy.get('input[name=parent_email]').type(testCamperA.parent_email);
    cy.get('input[name=emergency_name]').type(testCamperA.emergency_name);
    cy.get('input[name=emergency_number]').type(testCamperA.emergency_number);
    cy.get('input[name=roommate]').type(testCamperA.roommate);
    cy.get('textarea[name=notes]').type(testCamperA.notes);
    cy.get('input[name=registration]').parent().click();
    cy.contains(testCamperA.registration).click();
    cy.get('input[name=signed_status]').parent().click();
    cy.contains(testCamperA.signed_status).click();
    cy.get('input[name=adult_leader]').parent().click();
    cy.contains(testCamperA.adult_leader).click();
    cy.get('input[name=student_leadership_track]').parent().click();
    cy.get('[data-testid=student_leadership_track-yes]').click();
    cy.get('input[name=camp_attending]').parent().click();
    cy.contains(testCamperA.camp_attending).click();
    cy.get('input[name=covid_image_type]').parent().click();
    cy.contains(testCamperA.covid_image_type).click();
    // TODO: covid image?
  });
  it('save', () => {
    cy.intercept(`${baseUrl}/api/addCamper`).as('addCamperRequest');
    cy.contains('save', { matchCase: false }).click();
    cy.contains('Camper successfully saved');
    cy.get('@addCamperRequest').then((req: any) => {
      cy.wrap(req.request.body).should('include', testCamperA);
    });
  });
});

describe('edit camper', () => {
  const baseUrl = Cypress.config().baseUrl;

  it('wait for edit page', () => {
    cy.url().should('include', `${baseUrl}/camperEdit?id=`);
  });
  it('edit all fields', () => {
    cy.get('input[name=first_name]').clear().type(testCamperB.first_name);
    cy.get('input[name=last_name]').clear().type(testCamperB.last_name);
    cy.get('input[name=gender]').parent().click();
    cy.contains(testCamperB.gender).click();
    cy.get('input[name=birthday]').clear().type(testCamperB.birthday);
    cy.get('input[name=grade_completed]').parent().click();
    cy.get('[data-testid=grade_completed-6]').click();
    cy.get('input[name=allergies]').clear().type(testCamperB.allergies);
    cy.get('input[name=parent_email]').clear().type(testCamperB.parent_email);
    cy.get('input[name=emergency_name]')
      .clear()
      .type(testCamperB.emergency_name);
    cy.get('input[name=emergency_number]')
      .clear()
      .type(testCamperB.emergency_number);
    cy.get('input[name=roommate]').clear().type(testCamperB.roommate);
    cy.get('textarea[name=notes]').clear().type(testCamperB.notes);
    cy.get('input[name=registration]').parent().click();
    cy.contains(testCamperB.registration).click();
    cy.get('input[name=signed_status]').parent().click();
    cy.contains(testCamperB.signed_status).click();
    cy.get('input[name=adult_leader]').parent().click();
    cy.get('[data-testid=adult_leader-no]').click();
    cy.get('input[name=student_leadership_track]').parent().click();
    cy.get('[data-testid=student_leadership_track-no]').click();
    cy.get('input[name=camp_attending]').parent().click();
    cy.contains(testCamperB.camp_attending).click();
    cy.get('input[name=covid_image_type]').parent().click();
    cy.contains(testCamperB.covid_image_type).click();
    // TODO: covid image?
  });
  it('save', () => {
    cy.intercept(`${baseUrl}/api/editCamper`).as('editCamperRequest');
    cy.contains('save', { matchCase: false }).click();
    cy.contains('Camper successfully saved');
    cy.get('@editCamperRequest').then((req: any) => {
      cy.wrap(req.request.body).should('include', testCamperB);
    });
  });
});
