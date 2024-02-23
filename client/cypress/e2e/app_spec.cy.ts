// Referencing: https://www.browserstack.com/guide/how-to-test-react-using-cypress
// Referencing: https://www.freecodecamp.org/news/cypress-for-end-to-end-testing-react-apps/

const testUserEmail = 'test@email.com';
const testUserPassword = 'asd123ASD?';

describe('App Integration Tests', () => {
  it('Navigates successfully to registration page', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.contains('h2', 'Registration Page');
    cy.contains('Go back Home').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  // For the registration, mocking the fetch API response so the database is not affected
  it('Shows an error message on registration failure', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('newUserPassword');

    // Mocking fetch API response for a failed registration
    cy.intercept('POST', '/api/user/account/register', {
      statusCode: 403,
      body: 'Email already in use'
    }).as('registerRequest');

    cy.get('form').submit();
    cy.wait('@registerRequest');
    cy.get('.alert-danger').should('contain', 'Email already in use');
  });

  it('Successfully registers a new user', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').type('newUserPassword');

    // Mocking fetch API response for a successful registration
    cy.intercept('POST', '/api/user/account/register', {
      statusCode: 200,
      body: 'User successfully registered'
    }).as('registerRequest');

    cy.get('form').submit();
    cy.wait('@registerRequest');
    cy.contains('Registration successful! Redirecting to login page...');
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('Navigates successfully to login page', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('h2', 'Login Page');
    cy.contains('Go back Home').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('Shows an error message on login failure', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type('wrongPassword');
    cy.get('form').submit();
    cy.get('.alert-danger').should('contain', 'Invalid credentials');
  });

  it('Successfully logs in and redirects to the main page', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type(testUserPassword);
    cy.get('form').submit();
    cy.url().should('include', `/user/${testUserEmail}`);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('auth_token')).to.not.be.null;
    });
    cy.contains('Welcome to Main Page');
  });

  it('Views profile cards on the main page', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type(testUserPassword);
    cy.get('form').submit();
    cy.url().should('include', `/user/${testUserEmail}`);
    cy.get('.card').should('have.length.at.least', 1);
  });

  it('Navigates to and displays the Edit your information tab', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type(testUserPassword);
    cy.get('form').submit();
    cy.contains('Edit your information').click();
    cy.get('form').find('input').should('exist');
    cy.contains('Update Information').should('exist');
  });

  it('Navigates to and displays the List your chats tab', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type(testUserPassword);
    cy.get('form').submit();
    cy.contains('List your chats').click();
  });

  it('Successfully logs out the user', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(testUserEmail);
    cy.get('input[type="password"]').type(testUserPassword);
    cy.get('form').submit();
    cy.contains('Logout').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('auth_token')).to.be.null;
    });
  });
});
