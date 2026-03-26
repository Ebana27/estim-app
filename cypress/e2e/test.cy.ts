/* cypress\e2e\test.cy.ts */
describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('ion-content', 'Accueil page')
  })
})
