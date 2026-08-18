(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const chapters = Array.from(document.querySelectorAll("[data-service-chapter]"));
  const serviceIndex = document.querySelector("[data-service-index]");
  const indexLinks = Array.from(serviceIndex?.querySelectorAll("a[href^='#']") || []);
  const startLink = document.querySelector("[data-start-services]");
  const rail = document.querySelector("[data-collection-rail]");
  const railSentinel = document.querySelector("[data-rail-sentinel]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeChapterId = "";

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function setActiveChapter(id) {
    const changed = activeChapterId !== id;
    activeChapterId = id;

    indexLinks.forEach((link) => {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");

      if (active && changed && window.matchMedia("(max-width: 900px)").matches && serviceIndex) {
        window.requestAnimationFrame(() => {
          const left = link.offsetLeft - (serviceIndex.clientWidth - link.clientWidth) / 2;
          serviceIndex.scrollTo({
            left: Math.max(0, left),
            behavior: prefersReducedMotion ? "auto" : "smooth"
          });
        });
      }
    });
  }

  function navigateToChapter(event) {
    const href = event.currentTarget.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", href);
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    setActiveChapter(target.id);
  }

  indexLinks.forEach((link) => link.addEventListener("click", navigateToChapter));
  startLink?.addEventListener("click", navigateToChapter);

  if (rail && railSentinel) {
    let railFrame = 0;
    const syncRail = () => {
      railFrame = 0;
      rail.classList.toggle("is-docked", rail.getBoundingClientRect().top <= 88.5);
    };
    const requestRailSync = () => {
      if (railFrame) return;
      railFrame = window.requestAnimationFrame(syncRail);
    };

    syncRail();
    window.addEventListener("scroll", requestRailSync, { passive: true });
    window.addEventListener("resize", requestRailSync);
  }

  const cleaningStandard = document.querySelector("[data-cleaning-standard]");
  if (cleaningStandard) {
    const standardTabs = Array.from(cleaningStandard.querySelectorAll("[data-standard-tab]"));
    const standardPanels = Array.from(cleaningStandard.querySelectorAll("[data-standard-panel]"));

    const selectStandard = (selectedTab, moveFocus) => {
      const selectedKey = selectedTab.dataset.standardTab;

      standardTabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.classList.toggle("is-active", isSelected);
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
      });

      standardPanels.forEach((panel) => {
        const isSelected = panel.dataset.standardPanel === selectedKey;
        panel.hidden = !isSelected;
        panel.classList.toggle("is-active", isSelected);
      });

      if (moveFocus) selectedTab.focus();
    };

    standardTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectStandard(tab, false));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % standardTabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + standardTabs.length) % standardTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = standardTabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        selectStandard(standardTabs[nextIndex], true);
      });
    });
  }

  if (chapters.length && "IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveChapter(visible.target.id);
    }, { rootMargin: "-24% 0px -58%", threshold: [0.05, 0.2, 0.45] });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  }

  document.querySelectorAll(".service-chapter__disclosures").forEach((panel) => {
    let stableScrollY = null;
    let settleTimer = 0;

    const restoreStableScroll = () => {
      if (stableScrollY === null) return;
      const targetY = stableScrollY;
      window.requestAnimationFrame(() => window.scrollTo({ top: targetY, left: window.scrollX, behavior: "auto" }));
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        window.scrollTo({ top: targetY, left: window.scrollX, behavior: "auto" });
        stableScrollY = null;
      }, 80);
    };

    panel.querySelectorAll(".service-disclosure").forEach((row) => {
      const summary = row.querySelector("summary");
      const toggle = row.querySelector(".service-disclosure__toggle");
      const syncToggle = () => {
        toggle?.classList.toggle("ph-plus", !row.open);
        toggle?.classList.toggle("ph-minus", row.open);
      };

      summary?.addEventListener("click", () => {
        stableScrollY = window.scrollY;
      });

      syncToggle();
      row.addEventListener("toggle", () => {
        syncToggle();
        if (row.open) {
          panel.querySelectorAll(".service-disclosure[open]").forEach((other) => {
            if (other !== row) other.open = false;
          });
        }
        restoreStableScroll();
      });
    });
  });

  const routeMapElement = document.querySelector("[data-service-route-map]");
  const routeMapStage = routeMapElement?.closest(".service-route-check__map-stage");

  if (routeMapElement && window.L) {
    const serviceAreaBounds = window.L.latLngBounds(
      [32.528, -117.72],
      [33.7, -116.04]
    );
    const facilityLocation = window.L.latLng(32.7098573, -117.1495465);
    const routeMap = window.L.map(routeMapElement, {
      attributionControl: true,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      minZoom: 7,
      maxZoom: 15
    });

    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
    }).addTo(routeMap);

    const serviceAreaPane = routeMap.createPane("serviceArea");
    serviceAreaPane.style.zIndex = "350";
    serviceAreaPane.style.pointerEvents = "none";

    fetch("assets/data/shelton-service-area.geojson?v=20260817-coverage-v3")
      .then((response) => {
        if (!response.ok) throw new Error("Service area geometry did not load");
        return response.json();
      })
      .then((serviceArea) => {
        window.L.geoJSON(serviceArea, {
          pane: "serviceArea",
          interactive: false,
          style: {
            className: "service-route-check__service-area",
            color: "#081321",
            weight: 2,
            opacity: 0.86,
            lineJoin: "round",
            fillColor: "#b8965a",
            fillOpacity: 0.34
          }
        }).addTo(routeMap);
        routeMapElement.dataset.serviceAreaReady = "true";
      })
      .catch(() => {
        routeMapElement.dataset.serviceAreaReady = "false";
      });

    window.L.control.scale({ position: "bottomright", imperial: true, metric: false }).addTo(routeMap);

    const facilityMarker = window.L.marker(facilityLocation, {
      alt: "Shelton processing facility at 440 16th Street in San Diego",
      title: "Shelton processing facility, 440 16th Street",
      keyboard: true,
      riseOnHover: true,
      zIndexOffset: 900,
      icon: window.L.divIcon({
        className: "service-route-check__facility-marker",
        html: '<span class="service-route-check__facility-pin" aria-hidden="true"><i class="ph ph-map-pin"></i><img src="assets/Shelton%20Brand%20Assets/brand/shelton-social-avatar-dark.svg" alt="" width="1000" height="1000" /></span>',
        iconSize: [54, 62],
        iconAnchor: [27, 62]
      })
    }).addTo(routeMap);

    const zoomToFacility = () => {
      routeMap.flyTo(facilityLocation, 13, {
        animate: !prefersReducedMotion,
        duration: prefersReducedMotion ? 0 : 0.7
      });
    };

    facilityMarker.on("click", zoomToFacility);

    const facilityMarkerElement = facilityMarker.getElement();
    facilityMarkerElement?.setAttribute("role", "button");
    facilityMarkerElement?.setAttribute("aria-label", "Zoom to Shelton's processing facility at 440 16th Street in San Diego");
    facilityMarkerElement?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      zoomToFacility();
    });

    const fitServiceAreaView = () => {
      const isNarrow = window.matchMedia("(max-width: 620px)").matches;

      routeMap.fitBounds(serviceAreaBounds, {
        padding: [isNarrow ? 18 : 42, isNarrow ? 24 : 42],
        maxZoom: 9,
        animate: false
      });
    };

    routeMap.whenReady(() => {
      fitServiceAreaView();
      routeMapElement.dataset.mapReady = "true";
      routeMapStage?.classList.add("has-live-map");
    });
    window.requestAnimationFrame(() => {
      routeMap.invalidateSize(false);
      fitServiceAreaView();
    });

    let routeResizeFrame = 0;
    window.addEventListener("resize", () => {
      if (routeResizeFrame) window.cancelAnimationFrame(routeResizeFrame);
      routeResizeFrame = window.requestAnimationFrame(() => {
        routeResizeFrame = 0;
        routeMap.invalidateSize(false);
        fitServiceAreaView();
      });
    }, { passive: true });
  }

  const routeForm = document.querySelector("[data-route-form]");
  const routeName = routeForm?.querySelector("input[name='name']");
  const routeCompany = routeForm?.querySelector("input[name='company']");
  const routeEmail = routeForm?.querySelector("input[name='email']");
  const routeInput = routeForm?.querySelector("input[name='zip']");
  const routeMessage = document.querySelector("[data-route-message]");

  routeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = String(routeName?.value || "").trim();
    const company = String(routeCompany?.value || "").trim();
    const email = String(routeEmail?.value || "").trim();
    const zip = String(routeInput?.value || "").trim();

    [routeName, routeCompany, routeEmail, routeInput].forEach((field) => field?.removeAttribute("aria-invalid"));

    if (name.length < 2) {
      if (routeMessage) routeMessage.textContent = "Enter your name so Shelton knows who to contact.";
      routeName?.setAttribute("aria-invalid", "true");
      routeName?.focus();
      return;
    }

    if (company.length < 2) {
      if (routeMessage) routeMessage.textContent = "Enter your company name to begin the service review.";
      routeCompany?.setAttribute("aria-invalid", "true");
      routeCompany?.focus();
      return;
    }

    if (!routeEmail?.checkValidity() || !email.includes("@")) {
      if (routeMessage) routeMessage.textContent = "Enter a valid work email so Shelton can follow up.";
      routeEmail?.setAttribute("aria-invalid", "true");
      routeEmail?.focus();
      return;
    }

    if (!/^\d{5}$/.test(zip)) {
      if (routeMessage) routeMessage.textContent = "Enter a five-digit ZIP code so we can review the route.";
      routeInput?.setAttribute("aria-invalid", "true");
      routeInput?.focus();
      return;
    }

    routeInput?.removeAttribute("aria-invalid");
    if (routeMessage) routeMessage.textContent = "Opening the quote brief with your route details…";

    try {
      window.sessionStorage.setItem("sheltonRouteReviewDraft", JSON.stringify({ name, company, email, zip }));
    } catch {
      // The quote page still opens in route-review mode when storage is unavailable.
    }

    window.location.href = "quote.html?request=route-review#quote-form";
  });

  const reveals = document.querySelectorAll(".service-reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7%", threshold: 0.08 });
    reveals.forEach((item) => revealObserver.observe(item));
  }

  const initialChapter = chapters.find((chapter) => "#" + chapter.id === window.location.hash);
  if (initialChapter) {
    setActiveChapter(initialChapter.id);
    const alignInitialChapter = () => window.requestAnimationFrame(() => initialChapter.scrollIntoView({ behavior: "instant", block: "start" }));
    alignInitialChapter();
  } else if (chapters[0]) {
    setActiveChapter(chapters[0].id);
  }

  window.addEventListener("popstate", () => {
    const target = chapters.find((chapter) => "#" + chapter.id === window.location.hash);
    if (!target) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }
    setActiveChapter(target.id);
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
})();
