

describe('Check Links', () => {
  beforeEach(function () {
    const BASE_URL = Cypress.env('BASE_URL');
    console.log(BASE_URL);
    cy.visit(BASE_URL);
  })

  it('Checks all links', () => {

    // Check A tags
    const checkATags = () => {
      cy.get('#container a').each(($a) => {
        const href = $a.prop('href')
          // make an http request for this resource
          // outside of the browser
          cy.log(href);
          // localhost type of link will fail and we cannot check
          if (!href.includes('localhost')) {
            cy.request({method: 'GET', url: href})
            // drill into the response body
            .its('status')
            // and assert that its contents have the <html> response
            .should('eq', 200);
          }
      })
    };

    const checkIMGTags = () => {
      cy.get('#container img').each(($img) => {
        const href = $img.prop('src')
          // make an http request for this resource
          // outside of the browser
          cy.log(href);
          // localhost type of link will fail and we cannot check
          if (!href.includes('localhost')) {
            cy.request({method: 'GET', url: href})
            // drill into the response body
            .its('status')
            // and assert that its contents have the <html> response
            .should('eq', 200);
          }
      })
    };

    // Check landing page first
    checkATags();
    checkIMGTags();
    // Then check each Lab
    cy.get('#mySidenav li').then(el => { 
      // the UI refreshes the view, so we need to go by the lab index in the list.
      // and do a new look up each time
      const navCount = el.length; 
      cy.log(navCount);
      for (let i = 1; i <= navCount; i++) {
        cy.log(i);
        cy.get(`#mySidenav li:nth-child(${i})`).click().then(() => {
          // cy.pause(1);
          checkATags();
          checkIMGTags();
        })
      }
    });
  })
})
