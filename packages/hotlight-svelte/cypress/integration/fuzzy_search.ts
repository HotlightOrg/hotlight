/// <reference types="cypress" />

describe("Fuzzy Search", () => {
  it("finds results", () => {
    cy.visit("/")

    cy.get("body").type("{cmd}k")

    cy.get('hotlight-modal').shadow().find("hotlight-input").click().shadow().find("input").type("ho")

    cy.contains("Home", { includeShadowDom: true })
  })
})