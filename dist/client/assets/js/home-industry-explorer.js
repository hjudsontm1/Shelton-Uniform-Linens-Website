(() => {
  "use strict";

  const accordion = document.querySelector("[data-home-industry-accordion]");
  if (!accordion) return;

  const panels = Array.from(accordion.querySelectorAll("[data-home-industry-panel]"));
  const desktopTriggers = panels.map((panel) =>
    panel.querySelector("[data-home-industry-trigger]")
  );
  const compactDock = accordion.querySelector("[data-home-industry-compact-dock]");
  const compactTriggers = compactDock
    ? Array.from(compactDock.querySelectorAll("[data-home-industry-compact-trigger]"))
    : [];
  const compactLayout = window.matchMedia("(max-width: 760px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = Math.max(
    0,
    panels.findIndex((panel) => panel.classList.contains("is-active"))
  );
  let activationVersion = 0;
  let revealTimer;

  const panelTitle = (panel) =>
    panel.querySelector(".home-industry-panel__rail-title")?.textContent.trim() ||
    "industry";

  const panelDetails = (panel) =>
    panel.querySelector("[data-home-industry-details]");

  const warmPanelImage = (panel) => {
    const image = panel.querySelector(".home-industry-panel__image");
    if (!image || typeof image.decode !== "function") return;
    image.decode().catch(() => {});
  };

  const updateControls = () => {
    const compact = compactLayout.matches;

    panels.forEach((panel, index) => {
      const isActive = index === activeIndex;
      const details = panelDetails(panel);
      const desktopTrigger = desktopTriggers[index];
      const compactTrigger = compactTriggers[index];

      if (desktopTrigger) {
        desktopTrigger.setAttribute("aria-expanded", String(isActive));
        desktopTrigger.setAttribute(
          "aria-label",
          `${isActive ? "Selected" : "Explore"} ${panelTitle(panel)}`
        );
        if (compact) {
          desktopTrigger.setAttribute("tabindex", "-1");
        } else {
          desktopTrigger.removeAttribute("tabindex");
        }
      }

      if (compactTrigger) {
        compactTrigger.classList.toggle("is-selected", isActive);
        compactTrigger.setAttribute("aria-selected", String(isActive));
        compactTrigger.setAttribute("tabindex", compact && isActive ? "0" : "-1");
      }

      if (!details) return;
      if (compact) {
        details.setAttribute("role", "tabpanel");
        details.setAttribute(
          "aria-labelledby",
          compactTrigger?.id || desktopTrigger?.id || ""
        );
        details.removeAttribute("aria-live");
      } else {
        details.setAttribute("role", "region");
        details.setAttribute(
          "aria-labelledby",
          desktopTrigger?.id || compactTrigger?.id || ""
        );
        details.setAttribute("aria-live", "polite");
      }
    });
  };

  const revealDetails = (panel, version) => {
    if (version !== activationVersion || !panel.classList.contains("is-active")) {
      return;
    }
    const details = panelDetails(panel);
    if (details) details.hidden = false;
  };

  const focusActiveControl = (controlFamily) => {
    const control =
      controlFamily === "compact"
        ? compactTriggers[activeIndex]
        : desktopTriggers[activeIndex];
    window.requestAnimationFrame(() => {
      if (!control) return;
      try {
        control.focus({ preventScroll: true });
      } catch (_error) {
        control.focus();
      }
    });
  };

  const activatePanel = (nextIndex, options = {}) => {
    const {
      shouldFocus = false,
      controlFamily = compactLayout.matches ? "compact" : "desktop",
    } = options;
    if (nextIndex < 0 || nextIndex >= panels.length) return;

    if (nextIndex === activeIndex) {
      updateControls();
      if (shouldFocus) focusActiveControl(controlFamily);
      return;
    }

    window.clearTimeout(revealTimer);
    activationVersion += 1;
    const version = activationVersion;

    panels.forEach((panel) => {
      const details = panelDetails(panel);
      if (details) details.hidden = true;
    });

    panels.forEach((panel, index) => {
      panel.classList.toggle("is-active", index === nextIndex);
    });

    activeIndex = nextIndex;
    warmPanelImage(panels[nextIndex]);
    updateControls();

    if (shouldFocus) focusActiveControl(controlFamily);

    const revealDelay = reduceMotion.matches
      ? 0
      : compactLayout.matches
        ? 120
        : 430;

    if (revealDelay === 0) {
      revealDetails(panels[nextIndex], version);
      return;
    }

    revealTimer = window.setTimeout(() => {
      revealDetails(panels[nextIndex], version);
    }, revealDelay);
  };

  const nextIndexFromKey = (key, index) => {
    if (key === "Home") return 0;
    if (key === "End") return panels.length - 1;
    if (key === "ArrowRight" || key === "ArrowDown") {
      return (index + 1) % panels.length;
    }
    if (key === "ArrowLeft" || key === "ArrowUp") {
      return (index - 1 + panels.length) % panels.length;
    }
    return index;
  };

  const bindTrigger = (trigger, index, controlFamily) => {
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      activatePanel(index, { controlFamily });
    });

    trigger.addEventListener("keydown", (event) => {
      const supportedKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (!supportedKeys.includes(event.key)) return;

      event.preventDefault();
      activatePanel(nextIndexFromKey(event.key, index), {
        shouldFocus: true,
        controlFamily,
      });
    });
  };

  desktopTriggers.forEach((trigger, index) => {
    bindTrigger(trigger, index, "desktop");
  });

  compactTriggers.forEach((trigger, index) => {
    bindTrigger(trigger, index, "compact");
  });

  const syncLayoutMode = () => {
    window.clearTimeout(revealTimer);
    activationVersion += 1;

    panels.forEach((panel, index) => {
      const isActive = index === activeIndex;
      panel.classList.toggle("is-active", isActive);
      const details = panelDetails(panel);
      if (details) details.hidden = !isActive;
    });

    updateControls();
    warmPanelImage(panels[activeIndex]);
  };

  if (typeof compactLayout.addEventListener === "function") {
    compactLayout.addEventListener("change", syncLayoutMode);
  } else {
    compactLayout.addListener(syncLayoutMode);
  }

  syncLayoutMode();
})();
