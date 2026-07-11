# Development Pricing Rules

`assets/js/pricing-rules.dev.js` is a private prototype fixture. It is not approved Shelton pricing and must not be referenced by the public Pricing page.

Every rendered result includes:

`DEVELOPMENT ESTIMATE - NOT APPROVED PRICING`

## Stable Interface

The UI calls:

```js
calculatePlanningRange(pricingJourneyState, pricingRules)
```

The renderer does not contain rates or formulas. Replacing the fixture requires a new rules object and calculator implementation with the same return contract, not a UI rewrite.

## Deterministic Formula

1. Estimate weekly planning units from the operation-specific Scale inputs.
2. Use supplied weekly pounds when the prospect provides them.
3. Otherwise combine the operation signal with selected-goods development weights.
4. Apply the operation base and per-unit development rate.
5. Apply one volume-band factor.
6. Add selected finish and specialty-care factors.
7. Apply each model factor independently for Customer-Owned Goods, Hybrid, and Rental.
8. Produce a low/high range using fixed development bounds.
9. Multiply weekly bounds by 4.33 for the projected monthly range.
10. Round visible values to the nearest five dollars.

No random values, timestamps, browser state, or network results affect the calculation.

## Replaceable Rule Groups

- `operationRates`: base and per-unit rates by operation
- `goodsWeights`: development-only physical planning weights
- `volumeBands`: volume thresholds and factors
- `finishFactors`: pressing, hanging, poly, bundle, bag, cart, and labeling factors
- `specialtyFactors`: soil, color, odor, mold, delicate, deadline, and sorting factors
- `modelFactors`: Customer-Owned Goods, Hybrid, and Rental factors
- `rhythmThresholds`: service-rhythm thresholds
- `range`: low/high planning bounds
- `monthlyWeeks`: weekly-to-monthly conversion

## Service-Rhythm Recommendation

- The journey never asks for a desired pickup frequency.
- Hotel, STR, Spa, Gym, Restaurant, Casino, Uniform, and Other use estimated movement plus storage pressure.
- Event uses event calendar and return-window signals.
- Wholesale Dry Cleaning uses production days, turnaround, and capacity need.
- The output is a provisional recommendation, not a route promise.

## Inventory Recommendation

- Already own goods: Customer-Owned Goods
- Own some and need some supplied: Hybrid
- Want Shelton to supply goods: Rental
- Not sure: Hybrid as a flexible development starting point

The selected structure is recommended because of the ownership answer, not because it is the cheapest. All three ranges remain visible for comparison.

## Route And Location Boundary

The fixture keeps the location factor neutral because no approved route table exists. ZIP/city is preserved in the factors and payload for future route review. The result does not promise availability.

## Quote Handoff Boundary

The handoff constructs a local payload with:

- preview and endpoint-integration flags
- journey and rules versions
- operation and goods
- Scale, finish, specialty, ownership, and location answers
- recommended rhythm, model, and weekly range
- missing contact details

It makes no `fetch`, XHR, form action, or POST request. The ready state says `Quote payload ready for endpoint integration. Nothing has been submitted.` The private `?quote=fail` mode verifies that a failure preserves all answers.
