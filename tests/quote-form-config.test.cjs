const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const quote = read("quote.html");
const confirmation = read("thank-you.html");
const quoteScript = read("assets/js/quote-form.js");
const siteScript = read("assets/js/site.js");
const quoteStyles = read("assets/css/quote-experience.css");

assert.match(quote, /action="https:\/\/formspree\.io\/f\/mdenldgn"/);
assert.match(quote, /aria-labelledby="quote-form-title"/);
assert.match(quote, /aria-describedby="quote-use-note"/);
assert.match(quote, /name="_gotcha"/);
assert.match(quote, /name="_subject" value="New Shelton Linen commercial quote brief"/);
assert.match(quote, /name="form_source" value="Shelton request-a-quote page"/);
assert.match(quote, /name="page_url"[^>]+data-quote-page-url/);
assert.match(quote, /name="submitted_at"[^>]+data-quote-submitted-at/);
assert.match(quote, /name="company"[^>]+required[^>]+maxlength="120"/);
assert.match(quote, /name="name"[^>]+required[^>]+maxlength="100"/);
assert.match(quote, /name="email"[^>]+required[^>]+maxlength="254"/);
assert.match(quote, /name="phone"[^>]+maxlength="32"/);
assert.match(quote, /name="message"[^>]+maxlength="3000"/);
assert.match(quote, /data-quote-submit/);
assert.match(quote, /data-quote-status/);
assert.match(quote, /assets\/js\/quote-form\.js/);
assert.match(quote, /tel:\+16193208703/);
assert.match(quote, /mailto:info@sheltonlinenanduniform\.com/);
assert.doesNotMatch(quote, /quote-form__progress/);
assert.doesNotMatch(quote, /Tell us about your goods, weekly volume/);
assert.match(quote, /quote-form__group-header[\s\S]*?Account details[\s\S]*?quote-form__required/);

assert.match(quoteScript, /let inFlight = false/);
assert.match(quoteScript, /new AbortController\(\)/);
assert.match(quoteScript, /activeController\?\.abort\(\)/);
assert.match(quoteScript, /form\.setAttribute\("aria-busy"/);
assert.match(quoteScript, /new FormData\(form\)/);
assert.match(quoteScript, /form\.addEventListener\("invalid"/);
assert.match(quoteScript, /field\.setAttribute\("aria-invalid", "true"\)/);
assert.match(quoteScript, /status\?\.focus\(\{ preventScroll: true \}\)/);
assert.match(quoteScript, /window\.location\.assign\("thank-you\.html"\)/);
assert.doesNotMatch(siteScript, /Sending quote request\.\.\./);

assert.match(quoteStyles, /rgba\(var\(--quote-field-ink-rgb\), 0\.65\)/);
assert.match(quoteStyles, /label:has\(input:focus-visible\)/);
assert.match(quoteStyles, /\.form-submit\.is-sending/);
assert.match(quoteStyles, /\.form-row \{[\s\S]*?align-items: start/);
assert.match(quoteStyles, /\.form-row > label \{[\s\S]*?grid-template-rows:/);
assert.match(quoteStyles, /@media \(max-width: 1080px\)/);
assert.match(quoteStyles, /@media \(max-width: 620px\)/);

assert.doesNotMatch(confirmation, /once finalized/i);
assert.match(confirmation, /data-page="quote-success"/);
assert.match(confirmation, /name="robots" content="noindex, nofollow"/);
assert.match(confirmation, /assets\/css\/quote-confirmation\.css/);
assert.match(confirmation, /Thank you\. Your request was sent\./);
assert.match(confirmation, /class="quote-success"/);
assert.match(confirmation, /tel:\+16193208703/);
assert.match(confirmation, /mailto:info@sheltonlinenanduniform\.com/);

console.log("quote-form configuration checks passed");
