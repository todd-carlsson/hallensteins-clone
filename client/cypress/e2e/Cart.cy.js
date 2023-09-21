describe('Test Cart Functionality', () => {
  it('passes', () => {
    cy.visit('/clothing')
    cy.getDataTest('product-slider-0').trigger('mouseover')
    cy.pause()
  })
})