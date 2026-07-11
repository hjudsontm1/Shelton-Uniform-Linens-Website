(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-journey]");
  if (!root) return;

  const allowedConcepts = new Set(["orb", "label", "portal"]);
  const requestedConcept = new URLSearchParams(window.location.search).get("concept");
  const concept = allowedConcepts.has(requestedConcept) ? requestedConcept : "orb";

  root.dataset.concept = concept;
  window.SheltonPricingJourney = Object.freeze({
    phase: "architecture",
    concept
  });
}());
