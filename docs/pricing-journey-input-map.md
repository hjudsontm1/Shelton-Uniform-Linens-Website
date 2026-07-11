# Adaptive Pricing Input Map

Checkpoint 4 collects operating signals rather than asking a prospect to choose a pickup frequency. The result layer uses these values to recommend a likely service rhythm.

## Operation-Specific Scale Signals

| Operation | Required signals | Optional signal |
| --- | --- | --- |
| Hotel / Boutique Stay | Guest rooms, approximate occupancy, weekly room turns, clean-goods storage | Known weekly pounds |
| STR / Property Manager | Properties, weekly turns, central pickup arrangement, seasonality | Known weekly pounds |
| Spa / Wellness | Weekly appointments, treatment rooms, goods per appointment, storage | Known weekly pounds |
| Gym / Fitness | Weekly towel uses, peak-use pattern, active days, storage | None |
| Event / Venue / Convention Center | Events per month, pieces per event, return window, seasonality | None |
| Restaurant / Food Service | Employees, weekly covers, shifts, goods mix | Known weekly pounds |
| Casino / Entertainment | Employees, departments, shifts, banquet events, restaurant outlets | None |
| Uniform Account | Employees, departments, shifts, pieces per employee | Known weekly pounds |
| Wholesale Dry Cleaning | Weekly volume, tracked unit, production days, turnaround, capacity need | None |
| Other / Not Sure | Weekly volume, tracked unit, operating days, variability, storage | None |

No schema contains a desired-frequency, cadence, or pickup-choice field.

## Finish And Specialty Compatibility

- Finish choices are filtered against the selected goods before rendering.
- Folded goods may expose folded, pressed, bundled, bagged, linen-cart, and labeled returns where compatible.
- Garments may expose pressed, hanging, poly, and labeled returns where compatible.
- Specialty prompts require both a compatible selected good and, where configured, a compatible operation.
- A single robe selection therefore keeps robe-relevant returns and removes sheets, towels, linen carts, and unrelated care prompts from the active UI.
- Compatible answers remain when a chapter is reopened; incompatible answers are removed by configuration filtering.

## Inventory Ownership

The primary choices are plain-language responses with no default selection:

1. We already own the goods
2. We own some and need some supplied
3. We want Shelton to supply the goods
4. We are not sure

Customer-Owned Goods, Hybrid Program, Rental Program, and Recommend a Model appear only as secondary educational labels. Recommendation and model comparison are deferred to the result.

## Location

- Accepts a five-digit ZIP code or a city name.
- Does not request a street address.
- Does not reject a prospect because a route table is unavailable.
- Makes no route-availability promise.
- Persists the normalized input for Review, future route factors, and exact-quote payload construction.
