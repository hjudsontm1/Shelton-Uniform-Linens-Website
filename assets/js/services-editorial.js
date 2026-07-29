(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const chapters = Array.from(document.querySelectorAll("[data-service-chapter]"));
  const indexLinks = Array.from(document.querySelectorAll(".service-library-hero__index a[href^='#']"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  chapters.forEach((chapter) => {
    chapter.querySelectorAll(".collection-row[open]").forEach((row) => row.removeAttribute("open"));
  });

  function setActiveChapter(id) {
    indexLinks.forEach((link) => {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function openPrimaryDetail(target) {
    chapters.forEach((chapter) => {
      if (chapter === target) return;
      chapter.querySelectorAll(".collection-row[open]").forEach((row) => row.removeAttribute("open"));
    });
    const primary = Array.from(target.querySelectorAll(".collection-row")).find((row) =>
      row.querySelector("summary")?.textContent.includes("How we clean")
    );
    if (primary) primary.open = true;
  }

  indexLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      openPrimaryDetail(target);
      history.pushState(null, "", link.getAttribute("href"));
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      setActiveChapter(target.id);
    });
  });

  if (chapters.length && "IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveChapter(visible.target.id);
    }, { rootMargin: "-24% 0px -58%", threshold: [0.05, 0.2, 0.45] });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  }

  document.querySelectorAll(".collection-row").forEach((row) => {
    const toggle = row.querySelector(".collection-row__toggle");
    const syncToggle = () => {
      toggle?.classList.toggle("ph-plus", !row.open);
      toggle?.classList.toggle("ph-minus", row.open);
    };
    syncToggle();
    row.addEventListener("toggle", () => {
      syncToggle();
      if (!row.open) return;
      const panel = row.closest(".collection-explorer__details");
      panel?.querySelectorAll(".collection-row[open]").forEach((other) => {
        if (other !== row) other.open = false;
      });
    });
  });

  const routeForm = document.querySelector("[data-route-form]");
  const routeInput = routeForm?.querySelector("input[name='zip']");
  const routeMessage = document.querySelector("[data-route-message]");
  const routeResult = document.querySelector("[data-route-result]");

  routeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const zip = String(routeInput?.value || "").trim();
    if (!/^\d{5}$/.test(zip)) {
      if (routeMessage) routeMessage.textContent = "Enter a five-digit ZIP code so we can review the route.";
      routeInput?.setAttribute("aria-invalid", "true");
      routeInput?.focus();
      return;
    }

    routeInput?.removeAttribute("aria-invalid");
    if (routeMessage) routeMessage.textContent = "Thanks — we will confirm volume, schedule, access, and route fit for " + zip + ".";
    const resultStatus = routeResult?.querySelector(":scope > span");
    if (resultStatus) resultStatus.textContent = "Route review available";
    routeResult?.classList.add("is-confirmed");
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
    openPrimaryDetail(initialChapter);
    setActiveChapter(initialChapter.id);
    const alignInitialChapter = () => window.requestAnimationFrame(() => initialChapter.scrollIntoView({ block: "start" }));
    if (document.fonts?.ready) document.fonts.ready.then(alignInitialChapter);
    else alignInitialChapter();
  } else if (chapters[0]) {
    openPrimaryDetail(chapters[0]);
    setActiveChapter(chapters[0].id);
  }
})();
