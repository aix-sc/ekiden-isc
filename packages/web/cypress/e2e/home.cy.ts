describe('ISC experiments home', () => {
  it('renders the hero, the cost model and the maintenance results', () => {
    cy.visit('/')
    cy.contains('Pay semantic labour')
    cy.contains('Cost model')
    cy.get('#expA').contains('break-even R*')
    cy.get('#expA').contains('10,521')
    cy.get('#expC').contains('Incremental maintenance vs. full re-SVD')
    cy.get('#next').contains('Real-corpus run')
  })
})
