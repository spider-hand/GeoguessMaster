describe("Test single player game", () => {
  it("Proceed to game page when clicking start game button", () => {
    cy.visit("/");
    cy.get(".start-game-button").click();
    cy.url().should("include", "/game");
  });

  it("Round should be 1", () => {
    cy.get("#round").should("have.text", "1 / 5");
  });

  it("Score should be 0", () => {
    cy.get("#score").should("have.text", "0");
  });

  it("Guess button should be disabled before selecting a location", () => {
    cy.get("#guess-button").should("be.disabled");
  });

  it("Guess button can be clicked after selecting a location", () => {
    cy.get('#map-container').trigger("mouseover").wait(1000);
    cy.get('#map-container').click();
    cy.get("#guess-button").should("not.be.disabled");
  });

  it("Result dialog shows up when clicking guess button", () => {
    cy.get("#guess-button").click();
    cy.get(".result-modal").should("exist");
  });

  it("Test result text", () => {
    cy.window().its('__store__')
      .then((store) => {
        const distance = store.getters.distance;
        cy.get("#distance").should("have.text", `You are ${distance}km away.`);
      });
  });

  it("Round should be 2", () => {
    cy.get("#next-round-button").click();
    cy.get("#round").should("have.text", "2 / 5");
  });

  it("Round should be 5", () => {
    // Skip some rounds and proceed to round 5
    const roundArr = [2, 3, 4];
    cy.wrap(roundArr).each(() => {
      cy.get('#map-container').trigger("mouseover").wait(1000);
      cy.get('#map-container').click();
      cy.get("#guess-button").click();
      cy.get("#next-round-button").click();
    });

    cy.get("#round").should("have.text", "5 / 5");
  });

  it("View summary button should appear on modal at round 5", () => {
    cy.get('#map-container').trigger("mouseover").wait(1000);
    cy.get('#map-container').click();
    cy.get("#guess-button").click();

    cy.get("#view-summary-button").should("exist");
  });

  it("Test summary text", () => {
    cy.get("#view-summary-button").click();

    cy.window().its('__store__')
      .then((store) => {
        const score = store.state.inGame.score;
        cy.get("#distance").should("have.text", `You are ${score}km away in total.`);
      });
  });

  it("Play again button should appear on modal", () => {
    cy.get("#play-again-button").should("exist");
  });

  it("Exit button should appear on modal", () => {
    cy.get("#exit-button").should("exist");
  });

  it("End single player game and get back to home page", () => {
    cy.get("#exit-button").click();
    cy.url().should("eq", "http://localhost:8080/");
  });
});
