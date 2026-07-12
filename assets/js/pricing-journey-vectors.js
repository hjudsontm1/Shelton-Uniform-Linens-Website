(function () {
  "use strict";

  const escapeText = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const line = (x1, y1, x2, y2, className = "vector-line") =>
    `<line class="${className}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;

  const foldedLayers = (variant = "linen") => {
    const compact = variant === "napkin";
    const towel = variant === "towel";
    const width = compact ? 74 : 106;
    const x = (120 - width) / 2;
    const top = compact ? 42 : 30;
    const spacing = towel ? 19 : 15;
    const layers = [0, 1, 2, 3].map((index) => {
      const inset = index % 2 ? 4 : 0;
      return `<path class="vector-body vector-body--${variant}" d="M${x + inset} ${top + index * spacing} H${x + width - inset} l6 7 -6 8 H${x + inset} l-6 -8 z" />`;
    }).join("");
    const texture = towel
      ? `<path class="vector-texture" d="M28 43 h64 M25 62 h70 M28 81 h64" />`
      : `<path class="vector-seam" d="M31 45 h58 M27 74 h66" />`;
    return `<g class="vector-object">${layers}${texture}</g>`;
  };

  const robe = () => `
    <g class="vector-object">
      <path class="vector-body" d="M43 24 60 15 77 24 94 42 84 58 77 50 82 118 38 118 43 50 36 58 26 42 Z" />
      <path class="vector-seam" d="M60 16 49 38 60 54 71 38 Z M40 73 h40 M47 71 73 88 M73 71 47 88" />
      <path class="vector-accent" d="M51 39 60 51 69 39" />
    </g>`;

  const coat = (variant = "chef") => `
    <g class="vector-object">
      <path class="vector-body" d="M39 25 51 17 h18 l12 8 14 24 -12 8 -7-13 4 73 H40 l4-73 -7 13 -12-8 Z" />
      <path class="vector-seam" d="M52 18 60 35 68 18 M60 35 v80 M43 63 h34" />
      ${variant === "chef"
        ? `<circle class="vector-accent-fill" cx="54" cy="48" r="2" /><circle class="vector-accent-fill" cx="66" cy="48" r="2" /><circle class="vector-accent-fill" cx="54" cy="58" r="2" /><circle class="vector-accent-fill" cx="66" cy="58" r="2" />`
        : `<path class="vector-accent" d="M47 24 60 40 73 24 M48 76 h24" />`}
    </g>`;

  const shirt = (variant = "shirt") => `
    <g class="vector-object">
      <path class="vector-body" d="M38 30 51 19 h18 l13 11 17 18 -13 13 -9-10 3 66 H40 l3-66 -9 10 -13-13 Z" />
      <path class="vector-seam" d="M52 20 60 35 68 20 M60 35 v80 M44 68 h32" />
      ${variant === "workwear" ? `<path class="vector-accent" d="M45 48 h12 v14 H45 Z M65 48 h10" />` : ""}
    </g>`;

  const jacket = () => `
    <g class="vector-object">
      <path class="vector-body" d="M39 25 52 17 h16 l13 8 16 25 -13 11 -8-14 5 70 H39 l5-70 -8 14 -13-11 Z" />
      <path class="vector-seam" d="M53 19 60 43 67 19 M60 43 v72 M43 74 h34 M48 89 h9 M63 89 h9" />
      <path class="vector-accent" d="M51 20 60 42 69 20" />
    </g>`;

  const apron = () => `
    <g class="vector-object">
      <path class="vector-body" d="M48 24 Q60 15 72 24 L78 47 88 116 H32 l10-69 Z" />
      <path class="vector-seam" d="M48 25 Q60 38 72 25 M42 49 h36 M46 75 h28 v22 H46 Z" />
      <path class="vector-accent" d="M42 47 24 62 M78 47 96 62" />
    </g>`;

  const dress = () => `
    <g class="vector-object">
      <path class="vector-body" d="M50 18 h20 l8 29 -10 18 21 53 H31 l21-53 -10-18 Z" />
      <path class="vector-seam" d="M50 19 60 38 70 19 M48 61 h24 M41 101 h38" />
    </g>`;

  const suit = () => `
    <g class="vector-object">
      <path class="vector-body" d="M40 26 53 17 h14 l13 9 15 28 -13 8 -7-15 5 70 H40 l5-70 -7 15 -13-8 Z" />
      <path class="vector-seam" d="M53 19 60 45 67 19 M53 39 60 48 67 39 M60 48 v67 M44 76 h32" />
      <path class="vector-accent-fill" d="M57 47 h6 l-3 22 z" />
    </g>`;

  const tablecloth = () => `
    <g class="vector-object">
      <path class="vector-body" d="M18 49 Q60 34 102 49 L92 116 H28 Z" />
      <path class="vector-seam" d="M18 49 Q60 64 102 49 M37 55 31 112 M60 58 v57 M83 55 89 112" />
      <path class="vector-accent" d="M22 48 Q60 27 98 48" />
    </g>`;

  const rolledTextile = (variant = "runner") => `
    <g class="vector-object">
      <path class="vector-body" d="M25 45 H83 Q101 45 101 62 T83 79 H25 Z" />
      <ellipse class="vector-body vector-body--light" cx="25" cy="62" rx="16" ry="17" />
      <ellipse class="vector-seam-fill" cx="25" cy="62" rx="7" ry="8" />
      <path class="vector-seam" d="M38 50 h45 M38 62 h52 M38 74 h45" />
      ${variant === "special" ? `<path class="vector-accent" d="M44 45 70 79 M60 45 86 79" />` : ""}
    </g>`;

  const skirting = () => `
    <g class="vector-object">
      <path class="vector-body" d="M20 37 h80 v79 H20 Z" />
      <path class="vector-seam" d="M20 37 Q30 52 40 37 T60 37 T80 37 T100 37 M30 43 v68 M50 43 v68 M70 43 v68 M90 43 v68" />
    </g>`;

  const chairCover = () => `
    <g class="vector-object">
      <path class="vector-body" d="M41 20 h38 l6 55 -10 12 9 31 H36 l9-31 -10-12 Z" />
      <path class="vector-seam" d="M43 47 h34 M41 76 Q60 88 79 76 M45 88 39 115 M75 88 81 115" />
    </g>`;

  const faceCover = () => `
    <g class="vector-object">
      <path class="vector-body" d="M18 67 Q23 26 60 24 Q97 26 102 67 Q97 108 60 110 Q23 108 18 67 Z" />
      <path class="vector-cutout" d="M36 67 Q39 46 60 44 Q81 46 84 67 Q81 88 60 90 Q39 88 36 67 Z" />
      <path class="vector-seam" d="M22 67 Q27 31 60 29 Q93 31 98 67" />
    </g>`;

  const choirRobe = () => `
    <g class="vector-object">
      <path class="vector-body" d="M42 22 52 16 h16 l10 6 19 34 -13 9 -11-19 10 72 H37 l10-72 -11 19 -13-9 Z" />
      <path class="vector-seam" d="M52 18 60 35 68 18 M60 35 v80 M43 67 37 114 M77 67 83 114" />
      <path class="vector-accent-fill" d="M49 20 60 39 71 20 68 49 H52 Z" />
    </g>`;

  const shapeFor = (id) => {
    if (["sheets", "duvetCovers", "blankets", "tableLinens", "banquetLinens"].includes(id)) return foldedLayers("linen");
    if (["towels", "handTowels", "bathMats", "barTowels"].includes(id)) return foldedLayers("towel");
    if (id === "napkins") return foldedLayers("napkin");
    if (id === "robes") return robe();
    if (id === "chefCoats") return coat("chef");
    if (id === "casinoUniforms") return coat("casino");
    if (id === "uniformShirts" || id === "shirts") return shirt();
    if (id === "workwear") return shirt("workwear");
    if (id === "jackets") return jacket();
    if (id === "aprons") return apron();
    if (id === "dresses" || id === "specialtyGarments") return dress();
    if (id === "suits") return suit();
    if (id === "tablecloths") return tablecloth();
    if (id === "runners") return rolledTextile();
    if (id === "specialtyEventGoods") return rolledTextile("special");
    if (id === "skirting") return skirting();
    if (id === "chairCovers") return chairCover();
    if (id === "faceCradleCovers") return faceCover();
    if (id === "choirRobes") return choirRobe();
    return foldedLayers("linen");
  };

  const backdropFor = (operationId) => {
    const backdrops = {
      hotel: `<path class="scene-structure" d="M56 285 H844 M690 116 h108 v168 H690 Z M717 116 v168 M771 116 v168" /><path class="scene-accent" d="M716 102 h56" /><text class="scene-note" x="700" y="94">LINEN CART RETURN</text>`,
      str: `<path class="scene-structure" d="M66 285 H834 M78 98 h150 v187 M78 147 h150 M78 203 h150" /><path class="scene-accent" d="M94 115 h48 M94 164 h70 M94 220 h54" /><text class="scene-note" x="78" y="84">CENTRAL TURNOVER STAGING</text>`,
      spa: `<path class="scene-structure" d="M58 285 H842 M650 208 q68-72 136 0 v77 H650 Z" /><path class="scene-accent" d="M675 197 q43-42 86 0" /><text class="scene-note" x="656" y="179">TREATMENT-ROOM FLOW</text>`,
      gym: `<path class="scene-structure" d="M60 285 H840 M120 94 v191 M182 94 v191 M120 128 h62 M120 182 h62 M120 236 h62" /><text class="scene-note" x="112" y="79">PEAK-USE TOWEL RACK</text>`,
      events: `<path class="scene-structure" d="M55 285 H845 M70 93 H830 M93 93 v32 M807 93 v32" /><circle class="scene-accent-fill" cx="122" cy="93" r="4" /><circle class="scene-accent-fill" cx="778" cy="93" r="4" /><text class="scene-note" x="70" y="78">PRESENTATION · COLOR · DEADLINE</text>`,
      restaurant: `<path class="scene-structure" d="M55 285 H845 M105 95 H795 M146 95 v37 M754 95 v37 M670 230 h130 v55" /><text class="scene-note" x="105" y="79">KITCHEN + DINING ROOM</text>`,
      casino: `<path class="scene-structure" d="M55 285 H845 M80 101 h170 M365 101 h170 M650 101 h170" /><text class="scene-note" x="80" y="84">DEPARTMENTS</text><text class="scene-note" x="365" y="84">MULTIPLE SHIFTS</text><text class="scene-note" x="650" y="84">BANQUET VOLUME</text>`,
      uniforms: `<path class="scene-structure" d="M55 285 H845 M88 94 H812 M116 94 v191 M784 94 v191" /><path class="scene-accent" d="M180 94 q12 18 24 0 M360 94 q12 18 24 0 M540 94 q12 18 24 0" /><text class="scene-note" x="88" y="78">ORGANIZED GARMENT RAIL</text>`,
      wholesale: `<path class="scene-structure" d="M55 285 H845 M76 236 H824 M112 236 v49 M788 236 v49" /><circle class="scene-wheel" cx="180" cy="260" r="10" /><circle class="scene-wheel" cx="450" cy="260" r="10" /><circle class="scene-wheel" cx="720" cy="260" r="10" /><text class="scene-note" x="76" y="220">BATCH CAPACITY · PRESSING · TURNAROUND</text>`,
      other: `<path class="scene-structure" d="M55 285 H845 M88 92 H812 M88 140 H812 M88 188 H812" /><text class="scene-note" x="88" y="76">BUILT AROUND THE GOODS</text>`
    };
    return backdrops[operationId] || backdrops.other;
  };

  const layoutFor = (count) => {
    const layouts = {
      1: [{ x: 351, y: 68, scale: 1.65 }],
      2: [{ x: 218, y: 102, scale: 1.3 }, { x: 526, y: 102, scale: 1.3 }],
      3: [{ x: 125, y: 120, scale: 1.08 }, { x: 390, y: 108, scale: 1.2 }, { x: 655, y: 120, scale: 1.08 }],
      4: [{ x: 80, y: 125, scale: 0.98 }, { x: 290, y: 118, scale: 1.04 }, { x: 500, y: 118, scale: 1.04 }, { x: 710, y: 125, scale: 0.98 }],
      5: [{ x: 48, y: 132, scale: 0.84 }, { x: 212, y: 122, scale: 0.9 }, { x: 376, y: 112, scale: 0.98 }, { x: 540, y: 122, scale: 0.9 }, { x: 704, y: 132, scale: 0.84 }],
      6: [{ x: 28, y: 136, scale: 0.76 }, { x: 170, y: 127, scale: 0.82 }, { x: 312, y: 118, scale: 0.88 }, { x: 454, y: 118, scale: 0.88 }, { x: 596, y: 127, scale: 0.82 }, { x: 738, y: 136, scale: 0.76 }]
    };
    return layouts[Math.min(6, Math.max(1, count))];
  };

  const returnOverlayFor = (returnOptions) => {
    const options = new Set(returnOptions || []);
    const overlays = [];
    if (options.has("pressed")) {
      overlays.push(`<path class="return-signal" d="M86 111 H814 M104 122 H796 M126 133 H774" /><text class="return-label" x="86" y="96">PRESSED FINISH</text>`);
    }
    if (options.has("hanging")) {
      overlays.push(`<path class="return-structure" d="M105 80 H795 M132 80 v207 M768 80 v207" /><path class="return-signal" d="M250 80 q12 18 24 0 M438 80 q12 18 24 0 M626 80 q12 18 24 0" /><text class="return-label" x="105" y="64">HANGING RETURN</text>`);
    }
    if (options.has("poly")) {
      overlays.push(`<path class="return-poly" d="M180 95 H720 L756 286 H144 Z" /><text class="return-label" x="700" y="111" text-anchor="end">POLY PROTECTION</text>`);
    }
    if (options.has("bundled")) {
      overlays.push(`<path class="return-strap" d="M312 123 v136 M588 123 v136" /><text class="return-label" x="450" y="278" text-anchor="middle">BUNDLED</text>`);
    }
    if (options.has("bagged")) {
      overlays.push(`<path class="return-bag" d="M212 123 Q450 90 688 123 L726 286 H174 Z" /><path class="return-signal" d="M230 130 Q450 160 670 130" /><text class="return-label" x="450" y="303" text-anchor="middle">BAGGED RETURN</text>`);
    }
    if (options.has("linenCart")) {
      overlays.push(`<path class="return-cart" d="M154 112 H746 L710 280 H190 Z M190 280 h520" /><circle class="return-wheel" cx="250" cy="292" r="9" /><circle class="return-wheel" cx="650" cy="292" r="9" /><text class="return-label" x="450" y="306" text-anchor="middle">LINEN-CART RETURN</text>`);
    }
    if (options.has("labeled")) {
      overlays.push(`<path class="return-tag" d="M714 96 h94 v46 l-47 34 -47-34 Z" /><circle class="return-tag-hole" cx="761" cy="113" r="4" /><text class="return-label return-label--dark" x="761" y="139" text-anchor="middle">LABELED</text>`);
    }
    if (options.has("folded")) {
      overlays.push(`<path class="return-signal" d="M86 269 h118 M696 269 h118" /><text class="return-label" x="86" y="258">FOLDED READY</text>`);
    }
    return overlays.join("");
  };

  const definitions = `
    <defs>
      <linearGradient id="vectorFabric" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4edde" stop-opacity="0.96" />
        <stop offset="0.52" stop-color="#b7b3aa" stop-opacity="0.84" />
        <stop offset="1" stop-color="#555f69" stop-opacity="0.72" />
      </linearGradient>
      <linearGradient id="vectorFabricSelected" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff9ed" />
        <stop offset="0.72" stop-color="#d8c7a5" />
        <stop offset="1" stop-color="#9a7740" />
      </linearGradient>
      <filter id="vectorShadow" x="-40%" y="-40%" width="180%" height="200%">
        <feDropShadow dx="0" dy="11" stdDeviation="9" flood-color="#00040a" flood-opacity="0.52" />
      </filter>
      <pattern id="vectorGrid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M32 0H0V32" fill="none" stroke="#f4edde" stroke-opacity="0.025" stroke-width="1" />
      </pattern>
    </defs>`;

  const renderScene = (container, options) => {
    if (!container) return;
    const operation = options.operation;
    const selected = new Set(options.selectedIds || []);
    const sourceIds = options.selectedOnly && selected.size ? [...selected] : options.goodsIds;
    const ids = sourceIds.slice(0, 6);
    const positions = layoutFor(ids.length);
    const hasSelection = selected.size > 0;

    const objects = ids.map((id, index) => {
      const item = options.catalog[id];
      const position = positions[index];
      const selectedClass = selected.has(id) ? "is-selected" : hasSelection ? "is-receded" : "is-available";
      return `
        <g class="vector-good ${selectedClass}" data-vector-good="${escapeText(id)}" transform="translate(${position.x} ${position.y}) scale(${position.scale})">
          ${shapeFor(id)}
          <line class="vector-baseline" x1="20" y1="128" x2="100" y2="128" />
          <text class="vector-caption" x="60" y="145" text-anchor="middle">${escapeText(item.label.toUpperCase())}</text>
        </g>`;
    }).join("");

    const returnOverlay = returnOverlayFor(options.returnOptions);
    const transformedBackdrop = Array.isArray(options.returnOptions) && options.returnOptions.length
      ? `<path class="scene-structure" d="M55 285 H845" />`
      : backdropFor(operation.id);

    container.innerHTML = `
      <svg class="goods-scene-svg" viewBox="0 0 900 330" role="presentation" focusable="false">
        ${definitions}
        <rect width="900" height="330" fill="url(#vectorGrid)" />
        <g class="scene-backdrop">${transformedBackdrop}</g>
        <g class="scene-goods">${objects}</g>
        <g class="return-overlay">${returnOverlay}</g>
        <text class="scene-operation" x="840" y="310" text-anchor="end">${escapeText(operation.label.toUpperCase())}</text>
      </svg>`;
  };

  window.SheltonPricingJourneyVectors = Object.freeze({ renderScene });
}());
