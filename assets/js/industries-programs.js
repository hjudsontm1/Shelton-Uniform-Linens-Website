(() => {
  const programs = {
    hotels: {
      eyebrow: "01 · HOSPITALITY PROGRAM",
      title: "Hotels & Boutique Stays",
      overviewTitle: "A complete linen program for the way your hotel operates.",
      lead: "Hotel laundry rarely moves as one category. Guest-room bedding, terry, spa goods, dining linens, banquet pieces, and staff garments each have their own volume, handling, and presentation requirements. Shelton brings those needs into one coordinated program so every department receives the cleaning, finishing, and organization it requires without creating more work for housekeeping.",
      overviewFacts: [
        {
          icon: "ph-buildings",
          label: "Property-Wide Coverage",
          text: "Guest rooms, spa and pool, dining, banquets, and staff operations.",
        },
        {
          icon: "ph-arrows-clockwise",
          label: "Flexible Program Models",
          text: "Customer-owned, rental, or hybrid inventory programs.",
        },
        {
          icon: "ph-calendar-check",
          label: "Occupancy-Driven Service",
          text: "Volume and service days planned around property demand and housekeeping schedules.",
        },
        {
          icon: "ph-package",
          label: "Department-Ready Organization",
          text: "Goods pressed, folded, hung, and organized for the teams that use them.",
        },
      ],
      panelContent: {
        goods: {
          catalog: true,
          items: [
            { icon: "ph-bed", label: "Sheets", text: "Commercially cleaned at controlled temperatures, then professionally pressed and folded to a consistent size." },
            { icon: "ph-square", label: "Pillowcases", text: "Body oils, makeup, and residue are removed before each piece is professionally pressed and folded." },
            { icon: "ph-stack", label: "Duvet Covers", text: "Processed according to fabric and construction, then pressed and prepared for housekeeping." },
            { icon: "ph-towel", label: "Bath Towels", text: "Cleaned at 160°F to remove body oils, makeup, and odor, then conditioned and professionally folded." },
            { icon: "ph-towel", label: "Hand Towels", text: "Cleaned and conditioned for softness and absorbency, then folded for guest-room presentation." },
            { icon: "ph-square", label: "Washcloths", text: "Purpose-built chemistry targets makeup, oils, and difficult residue while protecting fabric quality." },
            { icon: "ph-towel", label: "Pool Towels", text: "Sunscreen, body oils, and odor are removed before towels are folded for pool-area restocking." },
            { icon: "ph-towel", label: "Spa Towels", text: "Specialized formulas remove massage oils, lotions, makeup, and treatment residue while maintaining absorbency." },
            { icon: "ph-table", label: "Tablecloths", text: "Food and oil are removed before tablecloths are professionally pressed and folded or hung." },
            { icon: "ph-square-half", label: "Napkins", text: "Commercially cleaned, professionally pressed, laid flat, and stacked for dining and banquet service." },
          ],
        },
      },
      goods: "Sheets, duvet covers, bath towels, robes, and table linen.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Agree on service days, volume, handoff location, and return format.",
      collect: "Shelton picks up contained goods from the designated commercial handoff point.",
      process: "Goods remain account-organized through sorting, cleaning, finishing, and quality review.",
      return: "Clean goods arrive folded, bundled, carted, or sorted to the account’s agreed standard.",
      routeNote: "Route frequency and turnaround are planned around property volume and operating schedule.",
      quality: [
        "Material- and use-aware cleaning",
        "Stain attention and controlled finishing",
        "Inspection before organized return",
      ],
      quoteHref: "quote.html?industry=hotel&service=linen",
      quoteLabel: "Request a hotel program quote",
    },
    "short-term-rentals": {
      eyebrow: "02 · HOSPITALITY PROGRAM",
      title: "Short-Term Rentals & Property Managers",
      lead: "Centralized linen support works best when property turns are consolidated into one commercial flow. The program is shaped around reservation swings, a practical handoff point, and bundles that make each reset faster to stage.",
      goods: "Bed linen, bath towels, kitchen linen, and guest-ready bundles.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Set a central commercial handoff point, service rhythm, and property-ready pack standard.",
      collect: "Used goods are consolidated for scheduled pickup rather than collected house to house.",
      process: "Loads are sorted, cleaned, finished, inspected, and kept organized for the operator.",
      return: "Fresh goods come back folded or packed to support fast, repeatable property turns.",
      routeNote: "Service is built for commercial operators with a practical central handoff location.",
      quality: [
        "Consistent wash and finish standards",
        "Account-organized processing",
        "Property-ready folding and packing",
      ],
      quoteHref: "quote.html?industry=str&service=linen",
      quoteLabel: "Request a rental program quote",
    },
    gyms: {
      eyebrow: "03 · WELLNESS PROGRAM",
      title: "Gyms & Fitness Centers",
      lead: "A fitness towel program must handle concentrated peaks without overfilling storage or leaving members short. Weekly use, the busiest class windows, and the desired presentation determine inventory levels and return rhythm.",
      goods: "Workout towels, bath towels, mats, and select staff garments.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Map member volume, peak days, storage space, and the desired towel presentation.",
      collect: "Soiled goods are contained at the agreed handoff point for scheduled route pickup.",
      process: "Towels are sorted, cleaned, dried, inspected, and prepared for the next service cycle.",
      return: "Clean inventory returns folded, bundled, or carted to match the facility’s workflow.",
      routeNote: "Par levels and service frequency can be adjusted around class and member demand.",
      quality: [
        "Load separation by use and material",
        "Reliable finishing for a clean hand feel",
        "Inspection before every return",
      ],
      quoteHref: "quote.html?industry=gym&service=towels",
      quoteLabel: "Request a fitness program quote",
    },
    spas: {
      eyebrow: "04 · WELLNESS PROGRAM",
      title: "Spas & Wellness",
      lead: "Treatment-room textiles are both working inventory and part of the guest experience. Appointment volume, item mix, hand feel, storage, and room-reset timing all shape how the program should be processed and returned.",
      goods: "Treatment linens, bath towels, hand towels, robes, and wraps.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Align service with treatment volume, preferred folds, storage, and room-reset timing.",
      collect: "Used goods are contained and collected from the designated commercial handoff point.",
      process: "Items are sorted by type, carefully cleaned, finished, and checked for presentation.",
      return: "Finished goods return folded or bundled to support efficient treatment-room resets.",
      routeNote: "Pickup cadence can flex with appointment volume and seasonal demand.",
      quality: [
        "Fabric-aware wash selection",
        "Finish standards suited to guest-facing use",
        "Visual inspection before return",
      ],
      quoteHref: "quote.html?industry=spa&service=towels",
      quoteLabel: "Request a spa program quote",
    },
    events: {
      eyebrow: "05 · EVENTS PROGRAM",
      title: "Event Companies & Venues",
      lead: "Event linen care has to work backward from a fixed deadline while accounting for quantity, fabric, color, finish, and specialty pieces. Each batch stays identified so the final return is ready for staging rather than another round of sorting.",
      goods: "Tablecloths, napkins, runners, overlays, skirting, and select uniforms.",
      models: "Customer-owned and project-based service.",
      plan: "Confirm quantities, fabric and color mix, event date, handoff, and required return time.",
      collect: "Goods are received as a clearly identified event batch at the agreed route or plant handoff.",
      process: "Each batch is sorted, stain-reviewed, cleaned, finished, and checked against the order.",
      return: "Finished pieces are folded, hung, or packed to support staging and setup.",
      routeNote: "Timing is agreed in advance so the service plan reflects the event deadline.",
      quality: [
        "Batch organization by event",
        "Targeted stain attention",
        "Finish and count review before return",
      ],
      quoteHref: "quote.html?industry=event&service=event",
      quoteLabel: "Request an event program quote",
    },
    restaurants: {
      eyebrow: "06 · FOOD SERVICE PROGRAM",
      title: "Restaurants & Food Service",
      lead: "Dining linens and kitchen garments carry different soils, finish standards, and service pressures. A useful program separates those needs while aligning par levels, storage, and return timing with the restaurant’s operating week.",
      goods: "Table linen, napkins, aprons, chef wear, bar towels, and service garments.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Set par levels, route timing, item mix, collection point, and the preferred return format.",
      collect: "Used goods are contained by the team and collected from the designated service location.",
      process: "Loads are sorted by item and soil profile, then cleaned, finished, and inspected.",
      return: "Clean goods return folded, bundled, or hung for efficient restocking before service.",
      routeNote: "Service frequency is planned around covers, operating days, and storage capacity.",
      quality: [
        "Soil-aware cleaning choices",
        "Controlled finishing for table and staff use",
        "Organized inspection and return",
      ],
      quoteHref: "quote.html?industry=restaurant&service=event",
      quoteLabel: "Request a restaurant program quote",
    },
    uniforms: {
      eyebrow: "07 · WORKFORCE PROGRAM",
      title: "Uniform Accounts",
      lead: "A uniform program needs to follow how garments move through actual roles, departments, and shifts. Wearer counts matter, but identification, finish, and an organized return determine whether clean garments are truly ready for the next shift.",
      goods: "Work shirts, pants, jackets, aprons, chef wear, and role-specific garments.",
      models: "Customer-owned garment care and selected program structures.",
      plan: "Document staff count, departments, garment mix, identification needs, and service rhythm.",
      collect: "Worn garments are contained and picked up from the assigned workplace handoff point.",
      process: "Items are account-organized, cleaned with garment needs in mind, finished, and checked.",
      return: "Garments return folded, hung, bundled, or department-sorted as agreed.",
      routeNote: "The program is sized around staffing, changes, and the site’s operating pattern.",
      quality: [
        "Garment-appropriate cleaning",
        "Finish standards suited to workplace wear",
        "Account and department organization",
      ],
      quoteHref: "quote.html?industry=uniform&service=uniforms",
      quoteLabel: "Request a uniform program quote",
    },
    casinos: {
      eyebrow: "08 · WORKFORCE PROGRAM",
      title: "Casinos & Entertainment",
      lead: "Casino properties often combine hospitality, food service, uniforms, and event goods under one operating roof. The program works best when each department retains its own volume, handling, finish, and return standard inside one coordinated account.",
      goods: "Guest linen, food-and-beverage textiles, uniforms, towels, and department-specific goods.",
      models: "Customer-owned, rental, or hybrid by program.",
      plan: "Map departments, volume, access points, service windows, storage, and return standards.",
      collect: "Goods are consolidated by the property and collected at agreed commercial handoff points.",
      process: "Distinct item groups remain organized through sorting, cleaning, finishing, and review.",
      return: "Clean inventory returns by department in the agreed folded, carted, bundled, or hung format.",
      routeNote: "Route and program planning account for round-the-clock operations and multiple departments.",
      quality: [
        "Program-specific processing",
        "Controlled finishing across mixed goods",
        "Department-organized quality review",
      ],
      quoteHref: "quote.html?industry=casino&service=uniforms",
      quoteLabel: "Request a casino program quote",
    },
    wholesale: {
      eyebrow: "09 · PARTNER PROGRAM",
      title: "Wholesale Dry Cleaners & Laundry Partners",
      lead: "Wholesale support sits behind another operator’s promise to its customer, so capacity alone is not enough. Item mix, batch identification, turnaround, finish, and documented handoff standards define whether the partnership can scale reliably.",
      goods: "Program-specific commercial textile batches agreed during discovery.",
      models: "Partner processing and volume-based service structures.",
      plan: "Define item mix, expected volume, batch identification, handoff, finish, and service schedule.",
      collect: "Partner goods transfer through an agreed route, dock, or plant handoff process.",
      process: "Batches remain partner-organized through the specified wash, finish, and review workflow.",
      return: "Completed goods transfer back in the agreed count, pack, cart, or delivery format.",
      routeNote: "Capacity and turnaround are confirmed against the actual item and volume profile.",
      quality: [
        "Documented partner specifications",
        "Batch organization through processing",
        "Review against agreed return standards",
      ],
      quoteHref: "quote.html?industry=wholesale&service=wholesale",
      quoteLabel: "Request a wholesale program quote",
    },
    specialty: {
      eyebrow: "10 · SPECIALTY PROGRAM",
      title: "Specialty Commercial Accounts",
      lead: "Specialty commercial work begins with discovery because the material, construction, use, and desired result may fall outside a standard production path. Suitability, handling, timing, and quality expectations are agreed before the program is approved.",
      goods: "Specialty textile items reviewed for material, use, volume, finish, and handling needs.",
      models: "Customer-owned and project-specific structures.",
      plan: "Begin with an item and process review before confirming suitability, scope, and timing.",
      collect: "If the program is a fit, establish a safe commercial handoff and identification method.",
      process: "Approved goods follow a documented sorting, cleaning, finishing, and quality workflow.",
      return: "Items return in the agreed format with handling expectations defined before service begins.",
      routeNote: "Specialty requests are evaluated individually; service is confirmed only after review.",
      quality: [
        "Item review before program approval",
        "Documented handling expectations",
        "Quality checks suited to the agreed scope",
      ],
      quoteHref: "quote.html?industry=other&service=not-sure",
      quoteLabel: "Request a specialty program quote",
    },
  };

  const createSection = (id, label, title, contentSource, icon) => ({
    id,
    label,
    title,
    contentSource,
    icon,
  });

  const programStructures = {
    hotels: {
      sections: [
        createSection("overview", "Overview", "A complete linen program for the way your hotel operates.", "overview", "ph-house"),
        createSection("goods", "Goods", "The right care for every item.", "goods", "ph-package"),
        createSection("cleaning-quality", "Cleaning Quality", "Cleaning quality built around the item.", "quality", "ph-drop"),
        createSection("finishing-presentation", "Finishing & Presentation", "How clean goods return presentation-ready.", "finishing", "ph-sparkle"),
        createSection("service-flow", "Service Flow", "How pickup and return work.", "flow", "ph-arrows-clockwise"),
        createSection("program-planning", "Program Planning", "A program shaped around the property.", "planning", "ph-calendar-check"),
      ],
    },
    "short-term-rentals": {
      overviewTitle: "Hotel-level processing without hotel-level volume.",
      lead: "Short-term rental laundry works best when linens from multiple turnovers move through one centralized commercial program. Shelton consolidates volume for efficient bulk cleaning, consistent standards, professional pressing, and hotel-style pricing, then organizes finished goods for straightforward distribution across the portfolio.",
      overviewFacts: [
        { icon: "ph-buildings", label: "Centralized Bulk Processing", text: "Multiple properties consolidated through one commercial laundry program." },
        { icon: "ph-tag", label: "Hotel-Style Pricing", text: "Efficient commercial pricing without requiring hotel-level volume." },
        { icon: "ph-calendar-check", label: "Turnover-Driven Service", text: "Volume and cadence planned around bookings and seasonal demand." },
        { icon: "ph-package", label: "Distribution-Ready Organization", text: "Pressed sheets and folded towels bundled for straightforward distribution." },
      ],
      panelContent: {
        goods: {
          intro: "A multi-property program begins with the complete turnover inventory. Shelton reviews what is used in bedrooms, bathrooms, kitchens, and shared spaces so the program reflects the way the portfolio actually operates.",
          cards: [
            { label: "Bedroom Linens", text: "Sheets, pillowcases, duvet covers, and other customer-owned bedding used across the portfolio.", primary: true },
            { label: "Bath Textiles", text: "Bath towels, hand towels, washcloths, bath mats, pool towels, and other guest-facing terry." },
            { label: "Kitchen & Dining", text: "Kitchen towels, cloth napkins, table linens, and other washable goods used during a stay." },
            { label: "Centralized Program", text: "Goods from multiple properties are consolidated into one commercial account with an agreed handoff and return standard." },
          ],
        },
        "bulk-cleaning-pricing": {
          intro: "Consolidating linens from multiple turnovers creates the production efficiency of a hotel program, even when no single property has hotel-level volume. The result is consistent commercial processing and hotel-style pricing without requiring on-site laundry equipment or staff time.",
          label: "What consolidation provides",
          points: [
            "Volume from multiple properties moves through one efficient bulk cleaning program instead of separate household loads or laundromat visits.",
            "The same professional formulas, controlled temperatures, cycle times, and finishing standards are applied across the portfolio.",
            "Pricing is shaped around total weekly volume, item mix, service cadence, and finishing needs rather than the size of any one property.",
          ],
          note: "Centralized commercial processing gives smaller operators access to the efficiency and consistency associated with hotel linen programs.",
        },
        "finishing-organization": {
          intro: "Finishing is designed to remove steps from the next turnover. Clean goods are presented consistently and organized so the team can move them from the central handoff point into property distribution with less sorting and preparation.",
          cards: [
            { label: "Professionally Pressed Sheets", text: "All sheets are professionally pressed and folded to a consistent size.", primary: true },
            { label: "Soft, Folded Towels", text: "Towels are conditioned as appropriate, professionally folded, and prepared for straightforward restocking." },
            { label: "Clear Bundling", text: "Finished items can be bundled by item type or another agreed system that supports the portfolio workflow." },
            { label: "Organized Return", text: "Goods return to the central handoff point organized for storage, staging, and distribution across properties." },
          ],
        },
        "service-flow": {
          intro: "The service flow is centralized so Shelton can support a portfolio efficiently without collecting from each individual rental. One commercial handoff connects property turnovers to a repeatable pickup, production, and return schedule.",
          steps: [
            { label: "Define the Program", text: "Review the property count, turnover pattern, item mix, weekly volume, storage, and desired bundle standard." },
            { label: "Consolidate", text: "The operator brings soiled goods from individual properties to one agreed commercial handoff point." },
            { label: "Clean & Finish", text: "Shelton processes consolidated volume through commercial cleaning, professional sheet pressing, towel folding, and quality review." },
            { label: "Return & Distribute", text: "Finished goods return to the central location bundled and organized for the operator’s next round of property distribution." },
          ],
          aside: [
            { label: "Handoff Model", text: "One practical commercial pickup and delivery point for the managed portfolio." },
            { label: "Service Rhythm", text: "Recurring service planned around bookings, seasonal demand, and the time needed to reset inventory." },
          ],
          note: "The operator keeps control of property-level distribution while Shelton handles the commercial production behind it.",
        },
        "program-planning": {
          intro: "A dependable program starts with the numbers that drive turnovers. Shelton uses the portfolio’s actual booking pattern and linen inventory to establish the right service rhythm, processing capacity, and organization standard.",
          cards: [
            { label: "Turnovers & Weekly Volume", text: "Estimate active properties, average turns, seasonal swings, and the quantity of linen used in a typical reset." },
            { label: "Inventory & Storage", text: "Review available par levels, central storage, and the clean inventory needed to cover the time between service days." },
            { label: "Handoff & Return Standard", text: "Confirm the pickup location, recurring cadence, pressed and folded presentation, and the bundle system used for distribution." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "Hotel-level processing without hotel-level volume.", "overview", "ph-house"),
        createSection("goods", "Goods", "What the portfolio can send.", "goods", "ph-package"),
        createSection("bulk-cleaning-pricing", "Bulk Cleaning & Pricing", "Commercial processing built around consolidated volume.", "quality", "ph-stack"),
        createSection("finishing-organization", "Finishing & Organization", "How finished goods return distribution-ready.", "finishing", "ph-package"),
        createSection("service-flow", "Service Flow", "How centralized pickup and return work.", "flow", "ph-arrows-clockwise"),
        createSection("program-planning", "Program Planning", "A program shaped around the portfolio.", "planning", "ph-calendar-check"),
      ],
    },
    gyms: {
      overviewTitle: "A towel program built for peak demand.",
      lead: "Fitness towel use rises and falls with class schedules, member traffic, and peak hours. Shelton combines high-volume commercial cleaning, controlled conditioning, precision folding, and dependable service planning to keep towel stations supplied without turning staff into a laundry team.",
      overviewFacts: [
        { icon: "ph-stack", label: "High-Volume Towel Care", text: "Commercial bulk cleaning for steady daily towel demand." },
        { icon: "ph-feather", label: "Softness & Absorbency", text: "Measured conditioning supports comfort without compromising performance." },
        { icon: "ph-calendar-check", label: "Peak-Hour Planning", text: "Service and inventory levels shaped around classes and member volume." },
        { icon: "ph-package", label: "Restocking-Ready Organization", text: "Towels precisely folded, bundled, and organized for towel stations." },
      ],
      panelContent: {
        goods: {
          intro: "Fitness programs are built around the towel types members and staff move through each day. Shelton reviews material, color, weight, use, and daily circulation so every item receives the appropriate cleaning, conditioning, and finishing process.",
          cards: [
            { label: "Member Towels", text: "Workout towels, hand towels, washcloths, bath towels, and other high-circulation terry.", primary: true },
            { label: "Pool & Locker Room", text: "Pool towels, bath mats, and other washable textiles used in wet areas and changing spaces." },
            { label: "Facility Textiles", text: "Select staff garments and other washable goods can be reviewed as part of the account." },
            { label: "Program Model", text: "Customer-owned, rental, or hybrid inventory can be planned around the facility’s needs." },
          ],
        },
        "cleaning-odor": {
          intro: "Fitness towels repeatedly absorb perspiration, body oils, cosmetics, and moisture. Shelton uses professional chemistry, controlled heat, and purpose-built wash formulas to remove residue and odor at commercial volume while protecting towel quality.",
          label: "Built into every load",
          points: [
            "Seitz professional chemistry is precisely measured to break down body oils, makeup, and the residue that allows odors to remain after washing.",
            "Towels can be cleaned at 160°F with chemistry, cycle time, water level, and mechanical action controlled as one complete sanitizing process.",
            "Oxygen bleach is used when appropriate to sanitize, clean, and retain brightness while protecting towel quality and absorbency.",
          ],
          note: "Shelton never uses chlorine bleach. Clean towels should not come at the expense of fiber strength or useful service life.",
        },
        "softness-finishing": {
          intro: "A fitness towel needs to feel comfortable, remain absorbent, and return in a consistent format that staff can restock quickly. Conditioning and finishing are controlled with all three requirements in mind.",
          cards: [
            { label: "Measured Conditioning", text: "Conditioners are introduced at controlled levels to support a softer hand without compromising towel absorbency.", primary: true },
            { label: "Consistent Folding", text: "The Girbau FTQ towel folder produces precise, repeatable folds across high daily volume." },
            { label: "Quality Review", text: "Finished towels are checked for cleaning quality, presentation, and suitability for the next service cycle." },
            { label: "Ready to Restock", text: "Towels are bundled and organized around towel stations, storage, and the facility’s preferred restocking process." },
          ],
        },
        "service-flow": {
          intro: "Scheduled service keeps towel production separate from the work of running the facility. The program connects contained soil collection to a dependable supply of clean inventory for locker rooms, classes, and peak-use periods.",
          steps: [
            { label: "Measure Demand", text: "Review member traffic, class schedules, towel use, storage, and the busiest days and hours." },
            { label: "Collect", text: "Staff contain used towels at the agreed handoff point for recurring commercial pickup." },
            { label: "Clean & Condition", text: "Shelton cleans, sanitizes, conditions, dries, folds, and reviews towels through a controlled production process." },
            { label: "Return & Restock", text: "Soft, professionally folded towels return bundled and organized for fast movement into storage and towel stations." },
          ],
          aside: [
            { label: "Demand Pattern", text: "Daily member volume, class peaks, locker-room use, and seasonal changes." },
            { label: "Return Format", text: "Folded, bundled, or carted based on storage and staff workflow." },
          ],
          note: "A consistent service rhythm helps staff stay focused on members instead of managing laundry throughout the day.",
        },
        "program-planning": {
          intro: "Towel availability depends on the relationship between daily use, clean inventory, storage, and pickup frequency. Shelton plans those pieces together so peak demand is covered without creating unnecessary inventory or storage pressure.",
          cards: [
            { label: "Usage & Peak Demand", text: "Estimate towels used by day, class, member visit, locker room, and pool area, with attention to the busiest operating windows." },
            { label: "Par Levels & Storage", text: "Set the clean inventory needed between service days and confirm where both clean and soiled goods will be held." },
            { label: "Cadence & Restocking", text: "Choose pickup frequency, handoff timing, and a folded return format that supports the facility’s restocking pattern." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "A towel program built for peak demand.", "overview", "ph-house"),
        createSection("goods", "Goods", "What the facility can send.", "goods", "ph-stack"),
        createSection("cleaning-odor", "Cleaning & Odor", "Cleaning built for repeated towel use.", "quality", "ph-drop"),
        createSection("softness-finishing", "Softness & Finishing", "Softness, absorbency, and a consistent fold.", "finishing", "ph-feather"),
        createSection("service-flow", "Service Flow", "How pickup and return work.", "flow", "ph-arrows-clockwise"),
        createSection("program-planning", "Program Planning", "A program shaped around peak demand.", "planning", "ph-calendar-check"),
      ],
    },
    spas: {
      overviewTitle: "Every treatment starts with the right textiles.",
      lead: "Treatment linens and towels carry massage oils, lotions, makeup, and the presentation expectations of every guest-facing room. Shelton builds a coordinated program around oil removal, sanitation, softness, professional pressing, appointment volume, and room-reset timing.",
      overviewFacts: [
        { icon: "ph-sparkle", label: "Treatment-Room Coverage", text: "Sheets, towels, robes, face-cradle covers, wraps, and specialty textiles." },
        { icon: "ph-drop", label: "Oil & Makeup Removal", text: "Purpose-built formulas target oils, lotions, makeup, and odor." },
        { icon: "ph-feather", label: "Soft Towels, Pressed Sheets", text: "Conditioning, precision folding, and professional sheet pressing." },
        { icon: "ph-calendar-check", label: "Appointment-Driven Service", text: "Volume and cadence shaped around treatments and room resets." },
      ],
      panelContent: {
        goods: {
          intro: "Spa and wellness programs combine absorbent towels with the sheets, covers, robes, and wraps that shape each treatment room. Shelton reviews material, color, weight, use, and exposure to oils or cosmetics before establishing the cleaning and finishing process.",
          cards: [
            { label: "Treatment Linens", text: "Sheets, face-cradle covers, wraps, and other washable textiles used during treatments.", primary: true },
            { label: "Towels", text: "Bath towels, hand towels, washcloths, treatment towels, and other guest-facing terry." },
            { label: "Robes & Guest Textiles", text: "Robes and other washable items that contribute to comfort and presentation throughout the visit." },
            { label: "Program Model", text: "Customer-owned, rental, or hybrid inventory can be reviewed around the facility’s treatment mix." },
          ],
        },
        "oil-residue-removal": {
          intro: "Massage oils, lotions, makeup, and treatment products require more than a standard wash. Shelton combines concentrated Seitz chemistry with controlled temperature, water level, cycle time, and mechanical action to release residue from the textile instead of allowing it to build through repeated use.",
          label: "What the process targets",
          points: [
            "Professional formulas are selected and precisely dosed to break down massage oils, lotions, makeup, body oils, and related odor.",
            "Purpose-built cycles give chemistry the correct water level, temperature, and contact time to reach difficult residue throughout the load.",
            "Oxygen bleach is used when appropriate to sanitize, clean, and retain brightness while protecting textile quality and color.",
          ],
          note: "Residue removal is built into the wash formula so treatment textiles can return clean, fresh, and ready for repeated guest-facing use.",
        },
        "softness-finishing": {
          intro: "The right finish depends on the item. Towels should feel soft while retaining absorbency, sheets should present smoothly in the treatment room, and robes and covers should return in a format that simplifies each reset.",
          cards: [
            { label: "Soft, Absorbent Towels", text: "Measured conditioning supports a comfortable hand while preserving the absorbency needed in treatments and wet areas.", primary: true },
            { label: "Professionally Pressed Sheets", text: "All sheets are professionally pressed and folded to a consistent size for polished treatment-room presentation." },
            { label: "Consistent Folding", text: "Towels are professionally folded through controlled finishing and prepared for easy storage and restocking." },
            { label: "Room-Reset Organization", text: "Finished goods are bundled and organized around storage, treatment rooms, and the facility’s preferred reset workflow." },
          ],
        },
        "service-flow": {
          intro: "A spa program should follow the pace of appointments without interrupting treatment rooms or front-of-house service. Shelton builds one recurring flow from the facility’s handoff point through cleaning, finishing, and organized return.",
          steps: [
            { label: "Review Treatments", text: "Map appointment volume, treatment types, item use, storage, and the preferred room-reset format." },
            { label: "Collect", text: "Used goods are contained and collected from one designated commercial handoff point." },
            { label: "Clean & Finish", text: "Items receive the appropriate oil and residue removal, sanitation, conditioning, pressing, folding, and quality review." },
            { label: "Return for Reset", text: "Finished textiles return organized for storage and efficient movement back into treatment rooms." },
          ],
          aside: [
            { label: "Volume Driver", text: "Treatment count, services offered, room count, and textiles used per appointment." },
            { label: "Presentation Standard", text: "Soft folded towels, professionally pressed sheets, and organized guest-facing goods." },
          ],
          note: "Service cadence can flex with appointment volume, seasonal demand, and the inventory available between pickups.",
        },
        "program-planning": {
          intro: "Planning begins with how textiles move from treatment to treatment. Shelton uses actual appointment demand and available inventory to establish a service schedule that supports clean rooms, reliable resets, and guest-facing presentation.",
          cards: [
            { label: "Appointments & Item Use", text: "Estimate weekly treatments, the textiles used in each service, and the busiest days or seasonal periods." },
            { label: "Inventory & Room Resets", text: "Review par levels, storage, and the clean inventory needed to reset rooms between scheduled returns." },
            { label: "Handoff & Presentation", text: "Confirm collection points, pickup cadence, towel folds, sheet pressing, bundling, and the organization required on return." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "Every treatment starts with the right textiles.", "overview", "ph-house"),
        createSection("goods", "Goods", "What the treatment program can send.", "goods", "ph-package"),
        createSection("oil-residue-removal", "Oil & Residue Removal", "Cleaning choices built around oils and residue.", "quality", "ph-drop"),
        createSection("softness-finishing", "Softness & Finishing", "How towels and sheets return treatment-room ready.", "finishing", "ph-feather"),
        createSection("service-flow", "Service Flow", "How pickup and return work.", "flow", "ph-arrows-clockwise"),
        createSection("program-planning", "Program Planning", "A program shaped around appointments and room resets.", "planning", "ph-calendar-check"),
      ],
    },
    events: {
      overviewTitle: "Presentation, color, and timing in one program.",
      lead: "Event linen programs must protect color and presentation while keeping every batch tied to a fixed production schedule. Shelton coordinates color care, mold removal, professional pressing, hanging, stacking, batch organization, and turnaround around the date each order is required.",
      overviewFacts: [
        { icon: "ph-palette", label: "Color Protection", text: "Controlled low pH cleaning and color-locking options for new linens." },
        { icon: "ph-flask", label: "Mold Removal", text: "Specialized recovery for mold-affected colored and white goods." },
        { icon: "ph-sparkle", label: "Precision Finishing", text: "Tablecloths pressed and hung, with napkins pressed, laid flat, and stacked." },
        { icon: "ph-calendar-check", label: "Deadline-Driven Batches", text: "Production and organization planned around the required event date." },
      ],
      panelContent: {
        goods: {
          intro: "Event inventory can vary widely in size, color, construction, and finishing requirements. Shelton reviews each category and order standard so table goods and specialty pieces receive the process and presentation their next event requires.",
          cards: [
            { label: "Table Linens", text: "Tablecloths, napkins, runners, overlays, and other guest-facing flatwork.", primary: true },
            { label: "Presentation Pieces", text: "Skirting, chair covers, and specialty goods that require careful cleaning and finishing." },
            { label: "Colored Inventory", text: "Matching color groups and same-SKU inventory that benefit from controlled low pH cleaning and color management." },
            { label: "Program Structure", text: "Customer-owned inventory can be handled through recurring production or clearly identified event batches." },
          ],
        },
        "color-care-cleaning": {
          intro: "Colored event linens are cleaned with Seitz formulas at controlled low pH levels to minimize fading and color loss through repeated use. New linens can receive a color-locking cycle during their first cleaning to help stabilize dyes and keep matching inventory visually consistent for longer.",
          label: "Color control in practice",
          points: [
            "Item type, fabric, color, construction, and previous use are reviewed before the cleaning formula is selected.",
            "Water level, cycle time, temperature, pH, and chemistry are tailored to provide the cleaning quality required for presentation goods.",
            "Matching inventory remains organized by color and batch so same-SKU pieces can retain a more consistent appearance through service.",
          ],
          note: "Color care is part of the complete process, from the first cleaning through repeated production and final quality review.",
        },
        "mold-removal": {
          intro: "Mold affected event linens do not need to be replaced, even on colored items! Shelton uses specialized chemistry and controlled processing to target mold and related discoloration while protecting fabric and color. Recovering affected goods can reduce unnecessary replacement and extend the useful life of your inventory.",
          label: "The recovery process",
          points: [
            "Affected goods are reviewed by item, fabric, color, condition, and the extent of visible mold before processing begins.",
            "Specialized chemistry and controlled formulas are used to target mold and related discoloration on both colored and white event linens.",
            "Recovered pieces receive cleaning and presentation review before they are returned to the event inventory.",
          ],
          note: "Mold removal can preserve valuable inventory and matching color groups that would otherwise be difficult or expensive to replace.",
        },
        "finishing-batch-organization": {
          intro: "Event finishing is designed around presentation and staging. Each category receives the format that best protects the finish, preserves organization, and helps the production team move directly into preparation for the next order.",
          cards: [
            { label: "Pressed & Hung Tablecloths", text: "Event tablecloths are professionally pressed and usually hung to prevent extra soft creases.", primary: true },
            { label: "Flat, Stacked Napkins", text: "Napkins are professionally pressed, laid flat, and stacked for consistent presentation and easier counting." },
            { label: "Specialty Finishing", text: "Runners, overlays, skirting, chair covers, and specialty goods are hung or folded according to the needs of the item." },
            { label: "Batch Organization", text: "Finished goods remain identified and organized by item type, color, order, or another agreed production system." },
          ],
        },
        "deadline-planning": {
          intro: "Event work is planned backward from the date and time each order is required. Clear counts, batch identification, finishing instructions, and handoff timing give production the information needed to protect both presentation and turnaround.",
          cards: [
            { label: "Order & Inventory Detail", text: "Confirm item types, quantities, sizes, colors, specialty pieces, condition, and any same-SKU matching requirements." },
            { label: "Required Finish", text: "Document which goods should be pressed, hung, folded, laid flat, stacked, or organized by a specific order or batch." },
            { label: "Event Date & Handoff", text: "Establish the incoming handoff, production window, required completion date, and return format before the batch enters service." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "Presentation, color, and timing in one program.", "overview", "ph-house"),
        createSection("goods", "Goods", "What the event program can send.", "goods", "ph-package"),
        createSection("color-care-cleaning", "Color Care & Cleaning", "Color-aware care for presentation goods.", "quality", "ph-palette"),
        createSection("mold-removal", "Mold Removal", "A review-led path for mold-affected goods.", "review", "ph-flask"),
        createSection("finishing-batch-organization", "Finishing & Batch Organization", "How event linens return ready for staging.", "finishing", "ph-sparkle"),
        createSection("deadline-planning", "Deadline Planning", "A production plan built backward from the event.", "planning", "ph-calendar-check"),
      ],
    },
    restaurants: {
      overviewTitle: "A higher standard for every service.",
      lead: "Restaurant laundry combines guest-facing table linens with hard-working kitchen garments and towels. Shelton gives each category its own cleaning and finishing process, with professional pressing for chef coats and table goods and a recurring schedule shaped around covers, operating days, and storage.",
      overviewFacts: [
        { icon: "ph-fork-knife", label: "Dining & Kitchen Coverage", text: "Chef coats, aprons, napkins, tablecloths, and bar towels." },
        { icon: "ph-chef-hat", label: "Chef Coats for Repeated Use", text: "High-quality cleaning and pressing that maintains a professional appearance." },
        { icon: "ph-sparkle", label: "Professional Pressing", text: "Table linens and presentation garments finished to a consistent standard." },
        { icon: "ph-calendar-check", label: "Service-Driven Cadence", text: "Recurring service planned around volume, covers, and operating days." },
      ],
      panelContent: {
        goods: {
          intro: "Restaurant programs bring together guest-facing table linens and hard-working kitchen garments. Shelton reviews each category separately so cleaning, finishing, storage, and service cadence reflect where the item is used and how it should look when it returns.",
          cards: [
            { label: "Chef & Kitchen Garments", text: "Chef coats, aprons, kitchen shirts, trousers, and other back-of-house garments.", primary: true },
            { label: "Dining Linens", text: "Tablecloths, napkins, and other guest-facing table goods that require consistent cleaning and pressing." },
            { label: "Working Towels", text: "Bar towels and other approved washable textiles used throughout service and kitchen operations." },
            { label: "Program Model", text: "Customer-owned, rental, or hybrid inventory can be shaped around the restaurant’s item mix and operating week." },
          ],
        },
        "chef-coats-kitchen-garments": {
          intro: "Shelton gives chef coats the high-quality commercial cleaning and professional finishing they need to look sharp through repeated use. Each coat is properly cleaned and pressed, helping your kitchen maintain a consistent, professional appearance and ensuring garments look new on the 500th use. The same standard applies to aprons, kitchen shirts, trousers, and other back-of-house garments.",
          label: "Care through repeated use",
          points: [
            "Professional cleaning formulas are selected around garment construction, color, trim, use, and the oils and food residue encountered in the kitchen.",
            "Chef coats and presentation garments are professionally pressed and inspected so collars, plackets, sleeves, and the overall garment look sharp.",
            "Aprons, shirts, trousers, and other back-of-house pieces receive the cleaning and finishing appropriate to their role and construction.",
          ],
          note: "Consistent professional care supports the polished appearance of the kitchen without treating hard-working garments as disposable inventory.",
        },
        "table-linen-cleaning": {
          intro: "Table linens sit directly in the guest experience. Shelton uses concentrated Seitz chemistry and controlled wash formulas to remove food, oil, makeup, and service residue while protecting brightness, color, and fabric quality through repeated use.",
          label: "A complete cleaning process",
          points: [
            "Tablecloths, napkins, and working towels are processed according to item type, color, fabric, use, and the cleaning requirements of the load.",
            "Chemistry, water level, temperature, cycle time, and mechanical action are programmed together for consistent commercial cleaning.",
            "Oxygen bleach is used when appropriate to sanitize, brighten, and break down difficult residue while remaining color safe and gentler on fabric.",
          ],
          note: "Shelton never uses chlorine bleach, helping dining linens retain their strength and appearance through repeated service.",
        },
        "finishing-presentation": {
          intro: "The finishing standard changes with the item, but the goal remains the same: clean goods should return in a polished format that helps the dining room and kitchen prepare for service efficiently.",
          cards: [
            { label: "Pressed Chef Garments", text: "Chef coats, service jackets, shirts, and other presentation garments are professionally pressed, placed on hangers, and protected for return.", primary: true },
            { label: "Pressed Table Linens", text: "Tablecloths and napkins are professionally pressed and folded to a consistent presentation standard." },
            { label: "Inspected & Organized", text: "Each item is inspected during finishing and organized based on the needs of the restaurant." },
            { label: "Operational Return", text: "Finished goods can return in linen carts, bags, on hangers, or in another agreed format based on storage and service workflow." },
          ],
        },
        "service-planning": {
          intro: "Restaurant volume follows covers, operating days, private events, seasonal demand, and the amount of inventory available between services. Shelton uses those factors to build a dependable recurring program for both kitchen and dining goods.",
          cards: [
            { label: "Volume & Item Mix", text: "Review weekly covers, operating days, banquet or catering demand, garment counts, table sizes, and the quantity of each item in circulation." },
            { label: "Par Levels & Storage", text: "Set the clean inventory needed between service days and confirm where soiled and finished goods will be staged." },
            { label: "Pickup & Return", text: "Establish recurring service days, the collection point, required pressing and hanging, and the cart, bag, or bundle standard used on return." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "A higher standard for every service.", "overview", "ph-house"),
        createSection("goods", "Goods", "What dining and kitchen teams can send.", "goods", "ph-package"),
        createSection("chef-coats-kitchen-garments", "Chef Coats & Kitchen Garments", "Care built around hard-working kitchen garments.", "quality", "ph-chef-hat"),
        createSection("table-linen-cleaning", "Table Linen Cleaning", "Cleaning standards for guest-facing table goods.", "quality", "ph-drop"),
        createSection("finishing-presentation", "Finishing & Presentation", "How table linens and garments return service-ready.", "finishing", "ph-sparkle"),
        createSection("service-planning", "Service Planning", "A recurring plan shaped around operating volume.", "planning", "ph-calendar-check"),
      ],
    },
    uniforms: {
      overviewTitle: "Professional presentation for every role and every shift.",
      lead: "A uniform program must follow the way garments move through departments, roles, and changeouts. Shelton combines garment-specific cleaning, professional pressing, hanging or folding, and organized return with a service plan shaped around staff count and shift requirements.",
      overviewFacts: [
        { icon: "ph-users-three", label: "Department-Wide Coverage", text: "Garments organized around roles, departments, and staffing needs." },
        { icon: "ph-shirt-folded", label: "Garment-Specific Cleaning", text: "Cleaning formulas matched to construction, color, trim, branding, and use." },
        { icon: "ph-sparkle", label: "Professional Pressing", text: "Presentation garments pressed, placed on hangers, and protected." },
        { icon: "ph-stack", label: "Shift-Driven Organization", text: "Finished garments grouped to simplify distribution and changeouts." },
      ],
      panelContent: {
        garments: {
          intro: "A uniform program begins with the garments worn in each role and the way employees move through changes and shifts. Shelton reviews construction, color, trim, branding, use, and presentation so every category receives the right cleaning and finishing path.",
          cards: [
            { label: "Workwear", text: "Work shirts, trousers, jackets, aprons, and other garments used through regular operations.", primary: true },
            { label: "Presentation Garments", text: "Service jackets, shirts, chef coats, and other pieces that require professional pressing and hanging." },
            { label: "Role-Specific Items", text: "Department garments, branded pieces, and specialty uniforms reviewed around their construction and use." },
            { label: "Program Structure", text: "Customer-owned garment care and selected account structures organized around roles, departments, and staffing needs." },
          ],
        },
        "cleaning-quality": {
          intro: "Uniforms do different work and should not be pushed through one generic process. Shelton selects the appropriate laundry, professional wet cleaning, or dry-cleaning method and then controls chemistry, cycle conditions, and review around the garment.",
          label: "Garment-specific control",
          points: [
            "Material, construction, color, trim, branding, and workplace use are considered before the cleaning formula is established.",
            "Shelton uses Seitz professional chemistry for both laundry and dry cleaning, allowing the process to be matched to the garment and desired result.",
            "Garments are reviewed through cleaning and finishing so the account standard stays consistent across repeated service cycles.",
          ],
          note: "The correct process protects professional appearance while respecting the construction and service demands of each uniform category.",
        },
        "finishing-presentation": {
          intro: "Professional finishing restores the structure and presentation that washing alone cannot provide. The return format is selected by garment type so employees receive pieces that are ready for the next role, shift, or customer-facing interaction.",
          cards: [
            { label: "Pressed & Hung", text: "Coats, jackets, shirts, and other presentation garments are professionally pressed, placed on hangers, and protected for return.", primary: true },
            { label: "Pressed or Folded", text: "Trousers, aprons, and role-specific garments are pressed, hung, or folded according to construction and account needs." },
            { label: "Final Inspection", text: "Each piece is inspected during finishing for cleaning quality, presentation, and the agreed account standard." },
            { label: "Consistent Presentation", text: "Finishing specifications are documented so garments return with a repeatable appearance through ongoing service." },
          ],
        },
        "organization-return": {
          intro: "Clean uniforms are only useful when the right garments reach the right people. Shelton builds the handoff and return system around the account’s departments, roles, changeouts, and preferred level of identification.",
          steps: [
            { label: "Identify", text: "Document departments, roles, garment categories, wearer needs, and the account’s preferred organization system." },
            { label: "Collect", text: "Worn garments are contained and transferred through the assigned workplace handoff point." },
            { label: "Process", text: "Garments remain account-organized through cleaning, pressing, hanging or folding, and final review." },
            { label: "Return", text: "Finished garments return grouped by department, role, bundle, hanger, or another agreed distribution format." },
          ],
          aside: [
            { label: "Organization Level", text: "Account, department, role, garment type, or another agreed identification structure." },
            { label: "Return Format", text: "Pressed and hung, professionally folded, bundled, or protected based on the garment." },
          ],
          note: "The organization standard is established during setup so the clean return supports actual shift and distribution needs.",
        },
        "program-planning": {
          intro: "Uniform planning connects staff count to garment changes, service frequency, and return organization. Shelton uses those operating details to size the program and reduce the gap between clean production and the next scheduled shift.",
          cards: [
            { label: "Roles & Garment Counts", text: "Review departments, active staff, garments assigned to each role, changes per week, and any seasonal or staffing variation." },
            { label: "Cleaning & Finish Standards", text: "Confirm which pieces require laundry, wet cleaning, or dry cleaning and whether they should return pressed, hung, folded, or protected." },
            { label: "Cadence & Distribution", text: "Set the workplace handoff, recurring schedule, identification needs, and the organization used to distribute clean garments." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "Professional presentation for every role and every shift.", "overview", "ph-house"),
        createSection("garments", "Garments", "What the uniform program can handle.", "goods", "ph-shirt-folded"),
        createSection("cleaning-quality", "Cleaning Quality", "Cleaning quality built around the garment.", "quality", "ph-drop"),
        createSection("finishing-presentation", "Finishing & Presentation", "How garments return professionally finished.", "finishing", "ph-sparkle"),
        createSection("organization-return", "Organization & Return", "A return flow organized around roles and shifts.", "flow", "ph-stack"),
        createSection("program-planning", "Program Planning", "A program shaped around staffing and changeouts.", "planning", "ph-calendar-check"),
      ],
    },
    casinos: {
      overviewTitle: "One coordinated standard across every department.",
      lead: "Casino properties combine hospitality, dining, entertainment, events, uniforms, and continuous operations under one roof. Shelton coordinates distinct cleaning, finishing, organization, and service requirements within one property-wide program while preserving the standards each department needs.",
      overviewFacts: [
        { icon: "ph-buildings", label: "Property-Wide Coverage", text: "Guest rooms, food and beverage, uniforms, events, towels, and specialty goods." },
        { icon: "ph-package", label: "Mixed-Goods Expertise", text: "Item-specific cleaning and finishing within one coordinated account." },
        { icon: "ph-clock", label: "Continuous Operations Planning", text: "Service windows shaped around round-the-clock property needs." },
        { icon: "ph-arrows-clockwise", label: "Department-Ready Organization", text: "Goods returned in the format required by each operating team." },
      ],
      panelContent: {
        "departments-goods": {
          intro: "A casino account can contain several distinct laundry programs inside one property. Shelton maps the goods, volume, presentation, storage, and operating requirements of each department before connecting them through a coordinated service plan.",
          cards: [
            { label: "Hotel, Spa & Pool", text: "Guest-room sheets, bath and pool towels, robes, treatment textiles, and other hospitality goods.", primary: true },
            { label: "Food & Beverage", text: "Chef coats, aprons, napkins, tablecloths, bar towels, and service garments." },
            { label: "Uniforms", text: "Presentation garments, workwear, and department-specific uniforms used across the property." },
            { label: "Events & Specialty", text: "Banquet linens, event goods, entertainment textiles, and specialty items reviewed for the property." },
          ],
        },
        "cleaning-by-program": {
          intro: "Mixed goods should not mean one standard wash. Shelton establishes separate cleaning paths for guest linens, towels, food-service textiles, uniforms, event goods, and specialty pieces while maintaining one coordinated account.",
          label: "Department-specific control",
          points: [
            "Seitz professional chemistry is precisely measured through item-specific laundry and dry-cleaning formulas across approved departments.",
            "Temperature, water level, cycle time, mechanical action, and oxygen bleach are controlled according to the item, color, use, and desired result.",
            "Distinct goods remain organized through production so the cleaning standard and final review stay connected to the department that uses them.",
          ],
          note: "Each program receives the cleaning process it needs without losing the efficiency of property-wide coordination.",
        },
        "finishing-by-department": {
          intro: "Finishing follows the way each department presents and distributes its inventory. Guest linens, towels, table goods, uniforms, and event pieces can all return differently while remaining part of one property-wide program.",
          cards: [
            { label: "Hospitality", text: "Sheets are professionally pressed, towels are folded consistently, and guest-facing goods are organized for housekeeping, spa, or pool operations.", primary: true },
            { label: "Food & Beverage", text: "Chef garments and table linens receive professional pressing, with goods hung or folded for kitchen, dining, and banquet use." },
            { label: "Uniforms", text: "Presentation garments are pressed, placed on hangers, protected, and organized around department or role." },
            { label: "Events & Specialty", text: "Event linens are pressed, hung, folded, stacked, and kept batch-organized according to the requirements of the order." },
          ],
        },
        "service-flow": {
          intro: "One coordinated account can still preserve separate department standards. The service flow establishes where goods are consolidated, how each program remains identified, and how finished inventory returns to the correct operating team.",
          steps: [
            { label: "Map Departments", text: "Document department contacts, item categories, volume, storage, access points, service windows, and return requirements." },
            { label: "Consolidate Handoffs", text: "The property stages goods at agreed commercial collection points with the identification needed to preserve department organization." },
            { label: "Process by Program", text: "Shelton routes each category through its appropriate cleaning, finishing, and quality review while maintaining account control." },
            { label: "Return by Department", text: "Finished goods return folded, carted, bundled, stacked, or hung according to the standard established for each team." },
          ],
          aside: [
            { label: "Operating Pattern", text: "Round-the-clock activity, multiple departments, controlled access, and varied volume throughout the week." },
            { label: "Program Model", text: "Customer-owned, rental, or hybrid inventory can be established by department or item category." },
          ],
          note: "Property-wide coordination simplifies the account without flattening the different standards required across the operation.",
        },
        "property-planning": {
          intro: "Casino planning starts at the department level and then connects those needs into one service structure. Shelton accounts for continuous operations, multiple access points, varied storage, and the production requirements of each program.",
          cards: [
            { label: "Departments & Volume", text: "Review goods, weekly volume, peak periods, special events, staffing patterns, and the inventory needs of every participating department." },
            { label: "Access & Service Windows", text: "Confirm approved handoff points, loading access, route timing, security or operational restrictions, and the clean storage available on property." },
            { label: "Department Return Standards", text: "Document how hospitality, food and beverage, uniforms, events, and specialty goods should be finished, identified, and distributed on return." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "One coordinated standard across every department.", "overview", "ph-house"),
        createSection("departments-goods", "Departments & Goods", "What a property-wide program can include.", "goods", "ph-buildings"),
        createSection("cleaning-by-program", "Cleaning by Program", "Cleaning standards matched to distinct departments and goods.", "quality", "ph-drop"),
        createSection("finishing-by-department", "Finishing by Department", "How each department receives the finish it needs.", "finishing", "ph-sparkle"),
        createSection("service-flow", "Service Flow", "How mixed goods move through one coordinated account.", "flow", "ph-arrows-clockwise"),
        createSection("property-planning", "Property Planning", "A program shaped around continuous operations.", "planning", "ph-calendar-check"),
      ],
    },
    wholesale: {
      overviewTitle: "Capacity and quality behind your name.",
      lead: "Wholesale support becomes part of the partner’s own customer promise. Shelton provides scalable laundry, dry cleaning, pressing, and finishing capacity with documented specifications, batch control, and turnaround standards designed to protect quality behind the scenes.",
      overviewFacts: [
        { icon: "ph-factory", label: "Laundry & Dry Cleaning Capacity", text: "Flexible processing support for approved commercial textile batches." },
        { icon: "ph-clipboard-text", label: "Documented Partner Standards", text: "Cleaning, finishing, identification, and handoff expectations agreed in advance." },
        { icon: "ph-stack", label: "Batch-Level Control", text: "Partner goods remain organized through processing and quality review." },
        { icon: "ph-chart-line-up", label: "Scalable Production Support", text: "Capacity and turnaround planned around actual item mix and volume." },
      ],
      panelContent: {
        "accepted-goods": {
          intro: "Wholesale fit is determined by the actual goods, quantities, condition, and specifications behind the partner account. Shelton reviews representative items before confirming the processing path, production standard, and available capacity.",
          cards: [
            { label: "Commercial Laundry", text: "Approved linen, towel, uniform, and commercial textile batches suited to industrial laundry processing.", primary: true },
            { label: "Dry Cleaning & Wet Cleaning", text: "Approved garments and specialty batches requiring professional dry cleaning or wet cleaning." },
            { label: "Flatwork & Towel Programs", text: "Sheets, table linens, event goods, and towels that require commercial pressing, ironing, folding, or stacking." },
            { label: "Review Before Approval", text: "Item mix, construction, condition, volume, finish, and turnaround are assessed before a wholesale program is accepted." },
          ],
        },
        "processing-capabilities": {
          intro: "Shelton provides professional laundry, wet-cleaning, and dry-cleaning capacity under documented partner specifications. The processing method is established around the goods and desired result rather than forcing every batch through the same production path.",
          label: "Production capabilities",
          points: [
            "Seitz professional chemistry supports controlled formulas across commercial laundry and dry cleaning for approved partner goods.",
            "Yamamoto high-speed, soft-mount washer-extractors provide programmable control over chemistry, water level, temperature, and cycle time.",
            "Batch identification and quality review remain connected to the partner specification throughout cleaning and production.",
          ],
          note: "Capacity is confirmed against the real item mix, weekly volume, processing method, finishing requirement, and turnaround expectation.",
        },
        "finishing-standards": {
          intro: "Wholesale finishing is produced to an agreed specification so the partner receives a consistent result behind its own customer relationship. Shelton can support towel folding, flatwork production, garment pressing, hanging, stacking, and organized packing.",
          cards: [
            { label: "Towel Folding", text: "The Girbau FTQ towel folder produces consistent folds across approved high-volume towel batches.", primary: true },
            { label: "Sheet & Flatwork Finishing", text: "The Girbau Compact PRO feeds, dries, irons, folds, and stacks approved flat linens through one controlled system." },
            { label: "Event & Delicate Flatwork", text: "The Girbau X20 provides a consistent, high-quality flatwork finish for approved event linens and delicate textiles." },
            { label: "Garment Presentation", text: "Approved garments can be professionally pressed, placed on hangers, folded, protected, and packed to the documented partner standard." },
          ],
        },
        "handoff-batch-control": {
          intro: "A wholesale program must protect the partner’s identity and customer commitments through every transfer. The handoff system defines how batches are identified, counted, processed, reviewed, and returned before recurring volume begins.",
          steps: [
            { label: "Document", text: "Agree on accepted goods, partner identifiers, quantities, processing methods, finish, packing, turnaround, and exception handling." },
            { label: "Transfer", text: "Partner goods enter through the approved route, dock, or plant handoff with the identification needed to preserve batch control." },
            { label: "Process & Review", text: "Batches remain organized through the specified cleaning and finishing path and are checked against the documented standard." },
            { label: "Return", text: "Completed goods transfer back in the agreed count, pack, cart, hanger, or delivery format." },
          ],
          aside: [
            { label: "Partner Standard", text: "Cleaning, finishing, identification, packaging, turnaround, and handoff expectations established in advance." },
            { label: "Batch Control", text: "Clear partner and batch identification maintained through production and return." },
          ],
          note: "Defined specifications create a repeatable production relationship while keeping Shelton behind the partner’s own customer promise.",
        },
        "capacity-planning": {
          intro: "Wholesale capacity is planned from production reality, not a general volume estimate. Shelton reviews the item mix, weekly pounds or pieces, process time, finishing load, handoff rhythm, and required turnaround before committing capacity.",
          cards: [
            { label: "Item Mix & Specification", text: "Provide representative goods, quantities, cleaning method, finishing standard, packing requirements, and any batch-level identification needs." },
            { label: "Volume & Turnaround", text: "Map expected weekly or project volume, peak periods, incoming handoffs, completion windows, and the flexibility available in production timing." },
            { label: "Program Confirmation", text: "Align approved scope, documented quality standard, capacity, pricing, and the recurring or project schedule before live production begins." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "Capacity and quality behind your name.", "overview", "ph-house"),
        createSection("accepted-goods", "Accepted Goods", "The approved goods and batches a partnership can include.", "goods", "ph-package"),
        createSection("processing-capabilities", "Processing Capabilities", "Processing capacity guided by documented partner standards.", "quality", "ph-factory"),
        createSection("finishing-standards", "Finishing Standards", "How finished goods return to the agreed specification.", "finishing", "ph-sparkle"),
        createSection("handoff-batch-control", "Handoff & Batch Control", "How partner goods stay identified through handoff and return.", "flow", "ph-stack"),
        createSection("capacity-planning", "Capacity Planning", "A production plan shaped around actual batch volume.", "planning", "ph-chart-line-up"),
      ],
    },
    specialty: {
      overviewTitle: "A process built around what makes the item different.",
      lead: "Specialty items do not fit one standard production path. Together with Shelton Cleaners, Shelton can process nearly every type of textile or garment after reviewing material, construction, condition, intended use, cleaning method, finishing, and timing.",
      overviewFacts: [
        { icon: "ph-drop", label: "Laundry, Wet & Dry Cleaning", text: "The appropriate professional cleaning method selected for the item." },
        { icon: "ph-magnifying-glass", label: "Individual Item Review", text: "Material, construction, color, trim, and condition assessed before quoting." },
        { icon: "ph-sparkle", label: "Custom Handling", text: "Processing and presentation requirements established around the item." },
        { icon: "ph-calendar-dots", label: "Project or Recurring Programs", text: "Service shaped around performances, events, seasons, or regular demand." },
      ],
      panelContent: {
        "specialty-goods": {
          intro: "Specialty items are Shelton’s specialty. In conjunction with Shelton Cleaners, we can process nearly every type of textile or garment after an individual review establishes the appropriate cleaning, finishing, and handling path.",
          cards: [
            { label: "Performance & Ceremonial", text: "Costumes, choir robes, ceremonial garments, and other pieces used for performances, services, or formal occasions.", primary: true },
            { label: "Decorative Textiles", text: "Drapery, decorative textiles, and unusual fabric goods with item-specific construction or presentation needs." },
            { label: "Specialty Uniforms", text: "Specialty uniforms and commercial garments that fall outside a standard recurring laundry program." },
            { label: "Unusual Commercial Pieces", text: "Other textiles and garments reviewed for material, construction, color, trim, condition, intended use, and desired result." },
          ],
        },
        "laundry-dry-cleaning": {
          intro: "Specialty items may be processed through commercial laundry, professional wet cleaning, or dry cleaning. Shelton uses Seitz professional chemistry for both laundry and dry cleaning, allowing each process to be tailored to the item and desired result.",
          label: "Available cleaning paths",
          points: [
            "Commercial laundry can support approved washable goods that benefit from programmable chemistry, water level, temperature, and cycle control.",
            "Professional wet cleaning provides a controlled water-based option for approved garments and textiles requiring specialized care.",
            "Dry cleaning is available through Shelton Cleaners for approved items whose material, construction, trim, or desired finish calls for that process.",
          ],
          note: "The cleaning method is selected only after Shelton reviews the complete item and the result the account expects.",
        },
        "review-process": {
          intro: "With the high degree of variability in specialty goods, each account receives a thorough review before any quote is generated. The review establishes whether Shelton can process the item safely, what method should be used, and how the expected result will be defined.",
          label: "What Shelton reviews",
          points: [
            "Material, construction, color, trim, decoration, dimensions, condition, age, and intended use are considered together.",
            "Representative items, care information, photographs, or an in-person review may be requested before suitability and scope are confirmed.",
            "Cleaning method, finishing, handling, timing, quantity, packaging, and quality expectations are documented before a quote is prepared.",
          ],
          note: "Please reach out with any questions or unusual items so Shelton can review the request and provide further details.",
        },
        "handling-requirements": {
          intro: "Specialty handling begins before cleaning and continues through final presentation. Shelton establishes how the item should be identified, supported, finished, protected, and returned based on its construction and use.",
          cards: [
            { label: "Item Identification", text: "Project, batch, item, or account identification is established so specialty goods remain organized through processing.", primary: true },
            { label: "Construction & Trim", text: "Fasteners, decoration, trim, linings, structure, and fragile details are considered when the handling path is set." },
            { label: "Finishing Method", text: "Pressing, steaming, hanging, folding, shaping, stacking, or other presentation requirements are agreed around the item." },
            { label: "Protected Return", text: "Finished pieces return in the hanger, fold, cover, bundle, container, or other format established during review." },
          ],
        },
        "program-planning": {
          intro: "Specialty work may be a single project or a recurring commercial need. Planning connects the individual item review to quantities, production timing, handoff, finishing, and the date the goods are required.",
          cards: [
            { label: "Item & Scope Review", text: "Provide the goods, quantities, condition, intended use, desired cleaning result, and any construction or handling concerns." },
            { label: "Timing & Handoff", text: "Confirm whether the work is project-based or recurring, how items will be transferred, and the date or cadence required." },
            { label: "Approved Process & Quote", text: "Shelton confirms suitability, cleaning method, finishing, handling, return format, timing, and pricing before the program begins." },
          ],
        },
      },
      sections: [
        createSection("overview", "Overview", "A process built around what makes the item different.", "overview", "ph-house"),
        createSection("specialty-goods", "Specialty Goods", "The goods considered through individual review.", "goods", "ph-package"),
        createSection("laundry-dry-cleaning", "Laundry & Dry Cleaning", "Selecting the appropriate professional cleaning path.", "quality", "ph-drop"),
        createSection("review-process", "Review Process", "How suitability, condition, and expectations are assessed.", "review", "ph-magnifying-glass"),
        createSection("handling-requirements", "Handling Requirements", "How custom handling and return expectations are established.", "finishing", "ph-sparkle"),
        createSection("program-planning", "Program Planning", "A project or recurring program shaped around the item.", "planning", "ph-calendar-dots"),
      ],
    },
  };

  Object.entries(programStructures).forEach(([programId, structure]) => {
    Object.assign(programs[programId], structure);
  });

  const drawer = document.querySelector("#program-drawer");
  const triggers = document.querySelectorAll("[data-program]");

  if (!drawer || !triggers.length) return;

  const rail = drawer.querySelector("[data-drawer-rail]");
  const panelHost = drawer.querySelector("[data-drawer-panels]");
  const eyebrowFields = drawer.querySelectorAll("[data-drawer-eyebrow]");
  const quote = drawer.querySelector("[data-drawer-quote]");
  const quoteLabel = drawer.querySelector("[data-drawer-quote-label]");
  const closeButton = drawer.querySelector("[data-drawer-close]");
  const drawerInner = drawer.querySelector(".program-drawer__inner");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTrigger = null;
  let closeTimer = null;

  const sectionIntroductions = {
    goods: "The item mix, volume, material, storage, and presentation standard are reviewed together before the service rhythm and return format are set.",
    quality: "Cleaning choices and review points stay connected to the goods, their use, and the agreed return standard.",
    finishing: "Finishing and organization are shaped around how clean goods need to be presented, stored, and distributed.",
    flow: "Four connected stages turn operating needs into a repeatable service rhythm.",
    planning: "Volume, handoff, timing, and return expectations are aligned before a recurring or project-based program begins.",
    review: "Suitability, condition, method, and expected result are reviewed together before processing is confirmed.",
  };

  const fallbackSections = [
    createSection("overview", "Overview", "Built around the way your operation moves.", "overview", "ph-house"),
    createSection("goods", "Goods", "What the program can handle.", "goods", "ph-package"),
    createSection("cleaning-quality", "Cleaning Quality", "Quality built into the program.", "quality", "ph-drop"),
    createSection("finishing-presentation", "Finishing & Presentation", "How clean goods return ready to use.", "finishing", "ph-sparkle"),
    createSection("service-flow", "Service Flow", "How pickup and return work.", "flow", "ph-arrows-clockwise"),
    createSection("program-planning", "Program Planning", "A cadence shaped around the operation.", "planning", "ph-calendar-check"),
  ];

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const createIcon = (iconName) => {
    const icon = createElement("i", `ph ${iconName}`);
    icon.setAttribute("aria-hidden", "true");
    return icon;
  };

  const createChapterHeading = (section, introduction, { overview = false } = {}) => {
    const heading = createElement("div", "program-drawer__chapter-heading");
    const title = createElement("h3", "", section.title);

    if (overview || !section.icon) {
      heading.append(title);
    } else {
      const titleLine = createElement("div", "program-drawer__chapter-title");
      titleLine.append(createIcon(section.icon), title);
      heading.append(titleLine);
    }

    heading.append(createElement("p", "", introduction));
    return heading;
  };

  const createOverview = (program, section) => {
    const fragment = document.createDocumentFragment();
    const overviewSection = { ...section, title: program.overviewTitle };
    const facts = createElement("div", "program-overview__facts program-overview__facts--featured");

    fragment.append(createChapterHeading(overviewSection, program.lead, { overview: true }));
    program.overviewFacts.forEach((fact) => {
      const factItem = createElement("section");
      const copy = createElement("div", "program-overview__fact-copy");
      copy.append(createElement("h4", "", fact.label), createElement("p", "", fact.text));
      factItem.append(createIcon(fact.icon), copy);
      facts.append(factItem);
    });
    fragment.append(facts);
    return fragment;
  };

  const createInfoArticle = (label, text, primary = false, icon = "") => {
    const article = createElement("article", primary ? "program-goods__primary" : "");
    if (icon) {
      article.classList.add("program-goods__item");
      const heading = createElement("div", "program-goods__item-heading");
      heading.append(createIcon(icon), createElement("span", "", label));
      article.append(heading, createElement("p", "", text));
    } else {
      article.append(createElement("span", "", label), createElement("p", "", text));
    }
    return article;
  };

  const getPanelCopy = (program, section) => program.panelContent?.[section.id] || {};

  const createGoodsCatalog = (section, copy) => {
    const fragment = document.createDocumentFragment();
    const catalog = createElement("div", "program-catalog program-catalog__items");
    copy.items.forEach((good) => {
      const item = createElement("article", "program-catalog__item");
      const icon = createElement("span", "program-catalog__item-icon");
      icon.append(createIcon(good.icon));
      const itemCopy = createElement("div", "program-catalog__item-copy");
      itemCopy.append(createElement("h3", "", good.label), createElement("p", "", good.text));
      item.append(icon, itemCopy);
      catalog.append(item);
    });

    fragment.append(catalog);
    return fragment;
  };

  const createGoodsPanel = (program, section) => {
    const fragment = document.createDocumentFragment();
    const copy = getPanelCopy(program, section);
    if (copy.catalog) return createGoodsCatalog(section, copy);
    const layout = createElement("div", "program-goods__layout");
    const cards = copy.cards || [
      { label: "Typical goods", text: program.goods, primary: true },
      { label: "Program model", text: program.models },
      { label: "How goods are evaluated", text: "Material, use, soil, volume, finish, and handling needs help define the appropriate program." },
      { label: "How goods return", text: program.return },
    ];
    cards.forEach((card) => layout.append(createInfoArticle(card.label, card.text, card.primary, card.icon)));
    fragment.append(createChapterHeading(section, copy.intro || sectionIntroductions.goods), layout);
    return fragment;
  };

  const createQualityPanel = (program, section, review = false) => {
    const fragment = document.createDocumentFragment();
    const copy = getPanelCopy(program, section);
    const field = createElement("div", "program-quality__field");
    const list = createElement("ol");
    const points = copy.points || program.quality;
    points.forEach((item) => list.append(createElement("li", "", item)));
    field.append(createElement("p", "program-quality__label", copy.label || (review ? "Review framework" : "What Shelton controls")), list);
    fragment.append(
      createChapterHeading(section, copy.intro || sectionIntroductions[review ? "review" : "quality"]),
      field,
      createElement("p", "program-quality__note", copy.note || (review ? program.routeNote : program.process)),
    );
    return fragment;
  };

  const createFinishingPanel = (program, section) => {
    const fragment = document.createDocumentFragment();
    const copy = getPanelCopy(program, section);
    const layout = createElement("div", "program-goods__layout program-finishing__layout");
    const cards = copy.cards || [
      { label: "Finished return", text: program.return, primary: true },
      { label: "Quality checkpoints", text: program.quality.join(" ") },
      { label: "Program structure", text: program.models },
      { label: "Operating fit", text: program.routeNote },
    ];
    cards.forEach((card) => layout.append(createInfoArticle(card.label, card.text, card.primary, card.icon)));
    fragment.append(createChapterHeading(section, copy.intro || sectionIntroductions.finishing), layout);
    return fragment;
  };

  const createFlowPanel = (program, section) => {
    const fragment = document.createDocumentFragment();
    const copy = getPanelCopy(program, section);
    const layout = createElement("div", "program-flow__layout");
    const steps = createElement("ol", "program-flow__steps");
    const flowSteps = copy.steps || [
      { label: "Plan", text: program.plan },
      { label: "Collect", text: program.collect },
      { label: "Process", text: program.process },
      { label: "Return", text: program.return },
    ];
    flowSteps.forEach(({ label, text }, index) => {
      const item = createElement("li");
      const copy = createElement("div");
      copy.append(createElement("strong", "", label), createElement("p", "", text));
      item.append(createElement("span", "", String(index + 1).padStart(2, "0")), copy, createIcon("ph-caret-right"));
      steps.append(item);
    });
    const aside = createElement("aside", "program-flow__aside");
    const asideCards = copy.aside || [
      { label: "Typical goods", text: program.goods },
      { label: "Program model", text: program.models },
    ];
    asideCards.forEach((card) => {
      const item = createElement("section");
      item.append(createElement("h4", "", card.label), createElement("p", "", card.text));
      aside.append(item);
    });
    aside.append(createElement("p", "", copy.note || "Every program is shaped around the actual item mix, operating volume, storage, handoff, and finish standard."));
    layout.append(steps, aside);
    fragment.append(createChapterHeading(section, copy.intro || sectionIntroductions.flow), layout);
    return fragment;
  };

  const createPlanningPanel = (program, section) => {
    const fragment = document.createDocumentFragment();
    const copy = getPanelCopy(program, section);
    const grid = createElement("div", "program-route-planning__grid");
    const cards = copy.cards || [
      { label: "Program scope", text: program.goods },
      { label: "Handoff & cadence", text: `${program.plan} ${program.collect}` },
      { label: "Return standard", text: `${program.routeNote} ${program.return}` },
    ];
    cards.forEach(({ label, text }, index) => {
      const item = createElement("section");
      item.append(createElement("span", "", String(index + 1).padStart(2, "0")), createElement("h4", "", label), createElement("p", "", text));
      grid.append(item);
    });
    fragment.append(createChapterHeading(section, copy.intro || sectionIntroductions.planning), grid);
    return fragment;
  };

  const createPanelContent = (program, section) => {
    if (section.contentSource === "overview") return createOverview(program, section);
    if (section.contentSource === "goods") return createGoodsPanel(program, section);
    if (section.contentSource === "quality") return createQualityPanel(program, section);
    if (section.contentSource === "finishing") return createFinishingPanel(program, section);
    if (section.contentSource === "flow") return createFlowPanel(program, section);
    if (section.contentSource === "review") return createQualityPanel(program, section, true);
    return createPlanningPanel(program, section);
  };

  const getTabs = () => Array.from(drawer.querySelectorAll("[data-drawer-tab]"));
  const getPanels = () => Array.from(drawer.querySelectorAll("[data-drawer-panel]"));

  const showPanel = (panelId, { focus = false, resetScroll = true } = {}) => {
    const tabs = getTabs();
    const panels = getPanels();
    const activeTab = tabs.find((tab) => tab.dataset.drawerTab === panelId);
    const activePanel = panels.find((panel) => panel.dataset.drawerPanel === panelId);
    if (!activeTab || !activePanel) return;

    tabs.forEach((tab) => {
      const selected = tab === activeTab;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel === activePanel;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });

    drawer.classList.toggle("program-drawer--overview-active", panelId === "overview");
    drawer.classList.toggle("program-drawer--catalog-active", activePanel.classList.contains("program-catalog-panel"));

    if (resetScroll && drawerInner) drawerInner.scrollTop = 0;
    if (focus) activeTab.focus({ preventScroll: true });
    activeTab.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const createTab = (programId, section, index) => {
    const tab = createElement("button");
    const tabId = `program-tab-${programId}-${section.id}`;
    const panelId = `program-panel-${programId}-${section.id}`;
    tab.type = "button";
    tab.id = tabId;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(index === 0));
    tab.setAttribute("aria-controls", panelId);
    tab.dataset.drawerTab = section.id;
    tab.tabIndex = index === 0 ? 0 : -1;
    if (index === 0) tab.classList.add("is-active");
    tab.append(createElement("span", "", String(index + 1).padStart(2, "0")), createElement("strong", "", section.label));
    return tab;
  };

  const createPanel = (programId, program, section, index) => {
    const panel = createElement("section", "program-drawer__panel");
    panel.id = `program-panel-${programId}-${section.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `program-tab-${programId}-${section.id}`);
    panel.dataset.drawerPanel = section.id;
    panel.hidden = index !== 0;
    if (index === 0) panel.classList.add("is-active");
    if (section.contentSource === "overview") panel.classList.add("program-overview", "program-overview--featured");
    if (program.panelContent?.[section.id]?.catalog) panel.classList.add("program-catalog-panel");
    panel.append(createPanelContent(program, section));
    return panel;
  };

  const renderDrawer = (programId, program) => {
    const sections = program.sections?.length ? program.sections : fallbackSections;
    eyebrowFields.forEach((field) => { field.textContent = program.eyebrow; });
    drawer.dataset.program = programId;
    drawer.classList.toggle("program-drawer--featured-overview", Array.isArray(program.overviewFacts));
    rail.replaceChildren(...sections.map((section, index) => createTab(programId, section, index)));
    panelHost.replaceChildren(...sections.map((section, index) => createPanel(programId, program, section, index)));
    if (quote) quote.href = program.quoteHref;
    if (quoteLabel) quoteLabel.textContent = program.quoteLabel;
  };

  const openDrawer = (programId, trigger) => {
    const program = programs[programId];
    if (!program) return;

    window.clearTimeout(closeTimer);
    renderDrawer(programId, program);
    showPanel("overview", { resetScroll: false });
    activeTrigger = trigger;

    if (!drawer.open) drawer.showModal();
    document.body.classList.add("program-drawer-open");
    if (drawerInner) drawerInner.scrollTop = 0;
    window.requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      drawer.focus({ preventScroll: true });
    });
  };

  const finishClose = () => {
    if (drawer.open) drawer.close();
    document.body.classList.remove("program-drawer-open");
    activeTrigger?.focus({ preventScroll: true });
  };

  const closeDrawer = () => {
    if (!drawer.open) return;
    drawer.classList.remove("is-open");

    if (prefersReducedMotion.matches) {
      finishClose();
      return;
    }

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(finishClose, 360);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openDrawer(trigger.dataset.program, trigger));
  });

  rail?.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-drawer-tab]");
    if (!tab) return;
    showPanel(tab.dataset.drawerTab);
  });

  rail?.addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-drawer-tab]");
    if (!tab) return;
    const tabs = getTabs();
    const index = tabs.indexOf(tab);
    const nextKeys = ["ArrowDown", "ArrowRight"];
    const previousKeys = ["ArrowUp", "ArrowLeft"];
    let nextIndex = null;

    if (nextKeys.includes(event.key)) nextIndex = (index + 1) % tabs.length;
    if (previousKeys.includes(event.key)) nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    showPanel(tabs[nextIndex].dataset.drawerTab, { focus: true });
  });

  closeButton?.addEventListener("click", closeDrawer);

  drawer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !drawer.open) return;
    event.preventDefault();
    closeDrawer();
  });

  drawer.addEventListener("click", (event) => {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right) closeDrawer();
  });

  drawer.addEventListener("close", () => {
    drawer.classList.remove("is-open");
    document.body.classList.remove("program-drawer-open");
  });
})();

(() => {
  const directory = document.querySelector(".serve-directory");
  const directoryShell = document.querySelector(".serve-directory-shell");
  const siteNavigation = document.querySelector(".site-nav");
  const closingSection = document.querySelector(".serve-fit");
  const links = Array.from(directory?.querySelectorAll('a[href^="#"]') || []);
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!directory || !directoryShell || !siteNavigation || !links.length || !sections.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactDirectory = window.matchMedia("(max-width: 1180px)");
  let activeId = sections[0].id;
  let frameRequested = false;
  let wasDocked = false;
  let wasCompact = compactDirectory.matches;

  const getDockedDirectoryHeight = () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const heightToken = rootStyles.getPropertyValue("--serve-directory-docked-height").trim();
    const tokenValue = Number.parseFloat(heightToken);
    if (!Number.isFinite(tokenValue)) return siteNavigation.offsetHeight;
    return heightToken.endsWith("rem")
      ? tokenValue * Number.parseFloat(rootStyles.fontSize)
      : tokenValue;
  };

  const setActiveLink = (nextId, { center = false } = {}) => {
    if (!nextId) return;
    activeId = nextId;

    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${nextId}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (!center || !compactDirectory.matches) return;
    const activeLink = links.find((link) => link.getAttribute("href") === `#${nextId}`);
    if (!activeLink) return;

    const nextLeft = activeLink.offsetLeft - (directory.clientWidth - activeLink.offsetWidth) / 2;
    directory.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  const updateDirectory = () => {
    frameRequested = false;
    const directoryHeight = getDockedDirectoryHeight();
    const hasPassedDirectory = directoryShell.getBoundingClientRect().top <= 0 && window.scrollY > 0;
    const hasReachedClosingSection = closingSection
      ? closingSection.getBoundingClientRect().top <= directoryHeight
      : false;
    const docked = hasPassedDirectory && !hasReachedClosingSection;
    document.body.classList.toggle("has-directory-header", docked);
    directory.classList.toggle("is-docked", docked);

    const readingLine = (docked ? directory.offsetHeight : siteNavigation.offsetHeight) + 40;
    let nextId = sections[0].id;
    let nextTop = Number.NEGATIVE_INFINITY;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= readingLine && sectionTop > nextTop + 2) {
        nextId = section.id;
        nextTop = sectionTop;
      }
    });

    const hashedLink = links.find((link) => link.getAttribute("href") === location.hash);
    const hashedSection = hashedLink
      ? document.querySelector(hashedLink.getAttribute("href"))
      : null;
    const nextSection = document.querySelector(`#${nextId}`);
    if (hashedSection && nextSection) {
      const hashTop = hashedSection.getBoundingClientRect().top;
      const candidateTop = nextSection.getBoundingClientRect().top;
      if (Math.abs(hashTop - candidateTop) <= 2) nextId = hashedSection.id;
    }

    if (closingSection?.getBoundingClientRect().top <= readingLine) {
      nextId = sections[sections.length - 1].id;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
      nextId = sections[sections.length - 1].id;
    }

    const compactChanged = compactDirectory.matches !== wasCompact;
    const dockingChanged = docked !== wasDocked;
    if (nextId !== activeId || compactChanged || dockingChanged) {
      setActiveLink(nextId, { center: docked });
    }

    wasDocked = docked;
    wasCompact = compactDirectory.matches;
  };

  const requestDirectoryUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateDirectory);
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const nextId = link.getAttribute("href").slice(1);
      setActiveLink(nextId, { center: true });
    });
  });

  window.addEventListener("scroll", requestDirectoryUpdate, { passive: true });
  window.addEventListener("resize", requestDirectoryUpdate);
  window.addEventListener("load", requestDirectoryUpdate, { once: true });
  updateDirectory();
})();
