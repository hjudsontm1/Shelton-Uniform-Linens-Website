const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pricingPage = fs.readFileSync(path.join(root, "pricing.html"), "utf8");
const pricingScript = fs.readFileSync(path.join(root, "assets/js/pricing-learning.js"), "utf8");
const pricingCalmStyles = fs.readFileSync(path.join(root, "assets/css/pricing-calm.css"), "utf8");
const pricingStyles = fs.readFileSync(path.join(root, "assets/css/pricing-spine-concept.css"), "utf8");

test("Pricing quote validation focuses the first invalid form control", () => {
  assert.match(pricingScript, /invalidControls\.find\(Boolean\) \|\| null/);
  assert.match(pricingScript, /validation\.firstInvalidControl\?\.focus\(\)/);
  assert.doesNotMatch(pricingScript, /quoteError\.focus/);
});

test("Pricing compact-desktop quote type remains readable without changing phone styles", () => {
  const compactRule = pricingStyles.match(
    /@media \(min-width: 621px\) and \(max-width: 1080px\) \{[\s\S]*?\/\* Use the shared site footer/
  );

  assert.ok(compactRule, "expected a 621px to 1080px compact-desktop quote rule");
  assert.match(compactRule[0], /font-size: 0\.72rem/);
  assert.match(compactRule[0], /font-size: 1rem/);
  assert.match(compactRule[0], /\.quote-error,[\s\S]*?font-size: 0\.82rem/);
});

test("Pricing estimator invalidation and rerenders preserve current interaction state", () => {
  assert.match(pricingScript, /const invalidateEstimate = \(\) => \{\s*estimateRequest \+= 1;/);
  assert.match(pricingScript, /restoreRenderedChoiceFocus\(goodsOptions, "goods", id\)/);
  assert.match(pricingScript, /restoreRenderedChoiceFocus\(ownershipOptions, "ownership", state\.ownership\)/);
  assert.match(pricingCalmStyles, /\.ownership-list input:focus-visible \+ span/);
});

test("Pricing handoff keeps native validation as a script-missing fallback", () => {
  assert.match(pricingPage, /name="_gotcha"/);
  assert.doesNotMatch(pricingPage, /<form[^>]*data-quote-form[^>]*novalidate/);
  assert.match(pricingPage, /name="name"[^>]*maxlength="100"/);
  assert.match(pricingPage, /name="business"[^>]*maxlength="120"/);
  assert.match(pricingPage, /name="email"[^>]*maxlength="254"/);
  assert.match(pricingPage, /name="phone"[^>]*maxlength="32"/);
  assert.match(pricingScript, /quoteForm\.noValidate = true/);
  assert.match(pricingScript, /elements\.namedItem\("_gotcha"\)/);
});

test("Pricing phone corrections stay scoped below compact desktop", () => {
  const phoneRule = pricingStyles.match(/\/\* Phone-only accessibility and spacing corrections[\s\S]*$/);
  assert.ok(phoneRule, "expected a phone-only accessibility rule");
  assert.match(phoneRule[0], /@media \(max-width: 620px\)/);
  assert.match(phoneRule[0], /\.return-format\s*\{\s*padding: 0\.2rem 0 0;/);
  assert.match(phoneRule[0], /\.range-progress button\s*\{[\s\S]*?min-height: 44px/);
  assert.match(pricingScript, /clearAnswersArmed/);
  assert.match(pricingScript, /behavior: prefersReducedMotion \? "auto" : "smooth"/);
  assert.match(pricingCalmStyles, /\.skip-link\s*\{[\s\S]*?z-index: 300;/);
});
