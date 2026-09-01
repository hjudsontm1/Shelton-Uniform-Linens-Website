# Pricing Journey Goods And Education Map

The canonical implementation source is `assets/js/pricing-journey-config.js`. This document records the private prototype branch map for review; it does not establish production pricing or service promises.

| Operation | Goods | Scene context | Educational emphasis |
| --- | --- | --- | --- |
| Hotel / Boutique Stay | Sheets, towels, bath mats, robes, blankets | Guest-goods line with linen-cart return | Presentation, occupancy shifts, storage, room turns |
| STR / Property Manager | Sheets, towels, bath mats, duvet covers, blankets | Central turnover staging shelves | Bulk central pickup/return, turnover volume, no house-to-house implication |
| Spa / Wellness | Towels, sheets, robes, blankets, face cradle covers | Treatment-room soft-goods flow | Appointment volume, room turnover, feel, compact storage |
| Gym / Fitness | Towels, hand towels | High-use towel rack | Peak usage, odor, volume, steady restocking |
| Event / Venue / Convention Center | Tablecloths, napkins, runners, skirting, chair covers, specialty event goods | Event presentation line and deadline rail | Staining, color, fabric, presentation, deadlines |
| Restaurant / Food Service | Chef coats, aprons, napkins, bar towels, table linens | Kitchen and dining-room goods line | Food soil, grease, repeat use, dining presentation |
| Casino / Entertainment | Casino uniforms, chef coats, napkins, table linens, towels, banquet linens | Departments, multiple shifts, banquet volume | Staff presentation plus restaurant and event volume |
| Uniform Account | Uniform shirts, chef coats, casino uniforms, workwear, jackets | Organized garment rail | Repeated wear, departments, shifts, organized return |
| Wholesale Dry Cleaning | Shirts, suits, dresses, specialty garments | Batch conveyor and finishing capacity | Batch volume, pressing, structured garments, turnaround |
| Other / Not Sure | Towels, table linens, uniform shirts, robes, choir robes, specialty garments | Flexible mixed-goods field | Start from physical goods when the operation does not fit a standard branch |

## Item Education Pattern

Each selected good exposes exactly one concise positioning sentence and up to three capability details. The configuration includes dedicated language for every item; representative patterns are:

- Chef coats: heavy soil and white retention; stain treatment; pressing; hanger-and-poly return where selected.
- Sheets: appearance and feel; pressed or folded finishing; linen-cart or bundled return.
- Event linens: color and fabric awareness; stain and specialty treatment; pressed, folded, or hanging return.
- Towels: soil and odor treatment; high-volume processing; folded, bundled, or bagged return.
- Robes: cleanliness and feel; guest-facing presentation; folded or hanging return.

Only the currently focused selected good drives the education panel. Unselected or incompatible item explanations are not displayed.

## Dependency Rules

- Changing Operation preserves goods that exist in both branches.
- Goods that do not exist in the new branch are removed and announced.
- A changed Operation reopens Goods for review even when compatible selections remain.
- The Goods scene shows all compatible options while selecting; selected objects gain focus and nonselected objects recede.
- The assembled foundation scene renders selected goods only. A single robe selection produces one robe and no sheets, towels, or unrelated objects.
