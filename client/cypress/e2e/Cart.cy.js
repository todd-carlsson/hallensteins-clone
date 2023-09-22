import "cypress-real-events";

describe('Test Cart Functionality', () => {
  beforeEach(() => {
    cy.visit('/clothing')
  })

  it('Add and delete single item from cart', () => {
    //ADD ITEM TO CART
    cy.getDataTest('cart-qty-icon').should('not.exist')
    cy.getDataTest('product-slider-0').click()
    cy.getDataTest('add-to-bag-button').click()
    cy.getDataTest('cart-qty-icon').should('have.text', '1')

    //DELETE ITEM FROM CART
    cy.getDataTest('delete-cart-item-button').click()
    cy.getDataTest('cart-qty-icon').should('not.exist')

    cy.contains(/There are currently no items in your cart./i)

    //CLOSE CART
    cy.getDataTest('cart-top-close').click()
    cy.contains(/There are currently no items in your cart./i).should('not.be.visible')
  })
})