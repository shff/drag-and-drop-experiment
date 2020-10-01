context("Window", () => {
  it("contains the expected text", () => {
    cy.visit("dist/");
    cy.get(".h-screen").contains("Campaign Editor");
  });
});
