(() => {
  document.documentElement.classList.add("js-enabled");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setText = (root, selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setItems = (root, selector, items, tagName = "li") => {
    const list = root.querySelector(selector);
    if (!list) return;
    const nodes = items.map((item) => {
      const node = document.createElement(tagName);
      node.textContent = item;
      return node;
    });
    list.replaceChildren(...nodes);
  };

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#primary-menu");
  if (toggle && menu) {
    const nav = toggle.closest(".site-nav");
    const mobileNavigation = window.matchMedia("(max-width: 1080px)");
    const isolatedSiblings = new Set();
    const setBackgroundInert = (shouldIsolate) => {
      if (!nav) return;
      if (shouldIsolate) {
        Array.from(document.body.children).forEach((element) => {
          if (element === nav || element.tagName === "SCRIPT" || element.hasAttribute("inert")) return;
          element.setAttribute("inert", "");
          isolatedSiblings.add(element);
        });
        return;
      }
      isolatedSiblings.forEach((element) => element.removeAttribute("inert"));
      isolatedSiblings.clear();
    };
    const menuIsOpen = () => toggle.getAttribute("aria-expanded") === "true";
    const closeMenu = ({ restoreFocus = false } = {}) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      menu.classList.remove("is-open");
      document.body.classList.remove("has-open-menu");
      setBackgroundInert(false);
      if (restoreFocus) toggle.focus();
    };
    const openMenu = ({ focusFirst = true } = {}) => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
      menu.classList.add("is-open");
      document.body.classList.add("has-open-menu");
      setBackgroundInert(mobileNavigation.matches);
      if (focusFirst) {
        window.setTimeout(() => {
          if (menuIsOpen()) menu.querySelector("a[href]")?.focus();
        }, prefersReducedMotion ? 0 : 260);
      }
    };

    toggle.addEventListener("click", (event) => {
      if (menuIsOpen()) closeMenu();
      else {
        const openedWithKeyboard = event.detail === 0;
        openMenu({ focusFirst: openedWithKeyboard });
      }
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (!menuIsOpen()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
        return;
      }
      if (event.key !== "Tab" || !nav) return;

      const focusable = Array.from(nav.querySelectorAll('a[href], button:not([disabled])'))
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const resetDesktopMenu = (event) => {
      if (!event.matches) closeMenu();
    };
    const syncMenuIsolation = (event) => {
      if (menuIsOpen()) setBackgroundInert(event.matches);
    };
    if (typeof mobileNavigation.addEventListener === "function") {
      mobileNavigation.addEventListener("change", resetDesktopMenu);
      mobileNavigation.addEventListener("change", syncMenuIsolation);
    } else {
      mobileNavigation.addListener(resetDesktopMenu);
      mobileNavigation.addListener(syncMenuIsolation);
    }
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const insightPanels = document.querySelectorAll(".insight-popout");
  insightPanels.forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (!panel.open) return;
      insightPanels.forEach((otherPanel) => {
        if (otherPanel !== panel) otherPanel.removeAttribute("open");
      });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    insightPanels.forEach((panel) => panel.removeAttribute("open"));
  });

  const pricingShell = document.querySelector("[data-pricing-shell]");
  if (pricingShell) {
    const pricingButtons = Array.from(pricingShell.querySelectorAll("[data-pricing-option]"));
    const pricingSummary = pricingShell.querySelector("[data-pricing-summary]");
    const renderPricingSummary = () => {
      if (!pricingSummary) return;
      const selections = pricingButtons
        .filter((button) => button.getAttribute("aria-pressed") === "true")
        .map((button) => button.textContent.trim());
      if (!selections.length) {
        const placeholder = document.createElement("span");
        placeholder.textContent = "Selections will appear as you choose options.";
        pricingSummary.replaceChildren(placeholder);
        return;
      }
      const nodes = selections.map((selection) => {
        const node = document.createElement("span");
        node.className = "is-selection";
        node.textContent = selection;
        return node;
      });
      pricingSummary.replaceChildren(...nodes);
    };

    pricingButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const step = button.closest("[data-pricing-step]");
        const isMultiple = step?.dataset.pricingMode === "multiple";
        const isActive = button.getAttribute("aria-pressed") === "true";
        if (!isMultiple && step) {
          step.querySelectorAll("[data-pricing-option]").forEach((otherButton) => {
            otherButton.setAttribute("aria-pressed", "false");
          });
        }
        button.setAttribute("aria-pressed", String(!isActive));
        renderPricingSummary();
      });
    });
    renderPricingSummary();
  }

  const aboutMontage = document.querySelector("[data-about-montage]");
  if (aboutMontage) {
    const aboutTiles = Array.from(aboutMontage.querySelectorAll("[data-about-tile]"));
    const aboutTv = aboutMontage.querySelector("[data-about-tv]");
    const tvScreen = aboutTv?.querySelector("[data-about-tv-screen]");
    const tvPhoto = aboutTv?.querySelector("[data-about-tv-photo]");
    const tvPhotoCanvas = aboutTv?.querySelector("[data-about-tv-photo-canvas]");
    const tvContact = aboutTv?.querySelector("[data-about-tv-contact]");
    const tvPhone = aboutTv?.querySelector("[data-about-tv-phone]");
    const tvEmail = aboutTv?.querySelector("[data-about-tv-email]");
    const nextButton = aboutTv?.querySelector("[data-about-tv-next]");
    const tvInstruction = {
      era: "Shelton family archive",
      title: "Click a photo to tune into the story.",
      story: "Turn the dial or choose a square from the wall to read a short family laundry story."
    };
    let activeAboutTile = null;
    let aboutTuneId = 0;
    let aboutTuneRenderTimeout = null;
    let aboutTuneClearTimeout = null;
    let aboutWarmupTimeout = null;
    let aboutIntroTimeout = null;
    let aboutAutoplayTimeout = null;
    const aboutTuneRenderDelay = 24;
    const aboutTuneSettleDelay = 170;
    const aboutWarmupDuration = 180;
    const aboutIntroDuration = 4500;
    const aboutStoryAutoplayInterval = 15000;
    const aboutResponsiveArchive = window.matchMedia("(max-width: 900px)");
    const aboutPeopleTiles = aboutTiles.filter((tile) => tile.classList.contains("about-tile--reserved")).slice(0, 4);
    const aboutArchiveTiles = aboutTiles.filter((tile) => !aboutPeopleTiles.includes(tile));

    aboutArchiveTiles.forEach((tile, index) => {
      tile.style.setProperty("--about-mobile-column", String(Math.floor(index / 2) + 1));
      tile.style.setProperty("--about-mobile-row", String((index % 2) + 1));
    });
    aboutPeopleTiles.forEach((tile, index) => {
      tile.style.setProperty("--about-mobile-person-column", String(index + 1));
      tile.style.setProperty("--about-mobile-person-left", `calc(${index} * (var(--about-mobile-tile) + 1px))`);
    });

    const visibleAboutTiles = () => aboutTiles.filter((tile) => window.getComputedStyle(tile).display !== "none");
    const syncAboutTileTabStops = (preferredTile = activeAboutTile) => {
      const pool = visibleAboutTiles();
      const keyboardTile = pool.includes(preferredTile) ? preferredTile : pool[0];
      aboutTiles.forEach((tile) => {
        tile.tabIndex = tile === keyboardTile ? 0 : -1;
      });
    };
    const aboutTileData = (tile) => {
      const tileImage = tile?.querySelector("img");
      return {
        title: tile?.dataset.title || "Shelton story",
        era: tile?.dataset.era || "Shelton history",
        story: tile?.dataset.story || "A future archive note can live here when this photo is added.",
        phone: tile?.dataset.phone || "",
        email: tile?.dataset.email || "",
        photoSrc: tileImage?.currentSrc || tileImage?.getAttribute("src") || ""
      };
    };
    const renderAboutTvContact = (data) => {
      const phone = data.phone?.trim() || "";
      const email = data.email?.trim() || "";
      if (tvPhone) {
        tvPhone.hidden = !phone;
        tvPhone.textContent = phone;
        const digits = phone.replace(/\D/g, "");
        if (digits) {
          tvPhone.href = `tel:${digits.length === 10 ? "+1" : ""}${digits}`;
        } else {
          tvPhone.removeAttribute("href");
        }
      }
      if (tvEmail) {
        tvEmail.hidden = !email;
        tvEmail.textContent = email;
        if (email) {
          tvEmail.href = `mailto:${email}`;
        } else {
          tvEmail.removeAttribute("href");
        }
      }
      if (tvContact) tvContact.hidden = !phone && !email;
    };
    const drawAboutTvPhoto = (tile) => {
      if (!(tvPhotoCanvas instanceof HTMLCanvasElement) || !tvPhoto) return;
      const source = tile?.querySelector("img");
      const context = tvPhotoCanvas.getContext("2d", { alpha: false });
      if (!context) return;
      if (!source || !source.complete || !source.naturalWidth || !source.naturalHeight) {
        context.clearRect(0, 0, tvPhotoCanvas.width, tvPhotoCanvas.height);
        if (source) {
          source.addEventListener("load", () => {
            if (activeAboutTile === tile) drawAboutTvPhoto(tile);
          }, { once: true });
        }
        return;
      }

      const targetWidth = Math.max(1, Math.min(900, Math.round(tvPhoto.clientWidth || 720)));
      const targetHeight = Math.max(1, Math.min(720, Math.round(tvPhoto.clientHeight || 560)));
      if (tvPhotoCanvas.width !== targetWidth) tvPhotoCanvas.width = targetWidth;
      if (tvPhotoCanvas.height !== targetHeight) tvPhotoCanvas.height = targetHeight;

      const scale = Math.max(targetWidth / source.naturalWidth, targetHeight / source.naturalHeight);
      const sourceWidth = targetWidth / scale;
      const sourceHeight = targetHeight / scale;
      const sourceX = (source.naturalWidth - sourceWidth) / 2;
      const sourceY = (source.naturalHeight - sourceHeight) / 2;

      context.filter = "none";
      context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

      // Safari does not reliably apply CanvasRenderingContext2D.filter. Grade the
      // drawn pixels once per channel change so every browser gets the same image.
      const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imageData.data;
      for (let index = 0; index < pixels.length; index += 4) {
        const luminance = (pixels[index] * 0.299) + (pixels[index + 1] * 0.587) + (pixels[index + 2] * 0.114);
        const softened = ((luminance - 128) * 0.78) + 128;
        const darkened = Math.max(0, Math.min(255, softened * 0.72));
        pixels[index] = Math.min(255, darkened * 1.1);
        pixels[index + 1] = Math.min(255, darkened * 1.02);
        pixels[index + 2] = Math.min(255, darkened * 0.86);
      }
      context.putImageData(imageData, 0, 0);
    };
    const renderAboutTv = (data, tile = null) => {
      if (!aboutTv) return;
      aboutTv.classList.toggle("is-instruction", !tile);
      tvScreen?.classList.toggle("has-photo", Boolean(tile && data.photoSrc));
      drawAboutTvPhoto(tile);
      setText(aboutTv, "[data-about-tv-era]", data.era);
      setText(aboutTv, "[data-about-tv-title]", data.title);
      setText(aboutTv, "[data-about-tv-story]", data.story);
      renderAboutTvContact(data);
    };
    const setActiveAboutTile = (tile) => {
      if (activeAboutTile && activeAboutTile !== tile) {
        activeAboutTile.classList.remove("is-tuned");
        activeAboutTile.setAttribute("aria-pressed", "false");
      }
      activeAboutTile = tile;
      if (!tile) {
        syncAboutTileTabStops(null);
        return;
      }
      tile.classList.add("is-tuned");
      tile.setAttribute("aria-pressed", "true");
      syncAboutTileTabStops(tile);
    };
    const clearAboutTune = () => {
      window.clearTimeout(aboutTuneRenderTimeout);
      window.clearTimeout(aboutTuneClearTimeout);
      window.clearTimeout(aboutWarmupTimeout);
      tvScreen?.classList.remove("is-tuning", "is-warming-up");
    };
    const tuneAboutTv = (tile, { flicker = true, announce = true } = {}) => {
      const data = tile ? aboutTileData(tile) : tvInstruction;
      const tuneId = ++aboutTuneId;
      setActiveAboutTile(tile);
      clearAboutTune();
      tvScreen?.setAttribute("aria-live", announce ? "polite" : "off");
      if (!prefersReducedMotion && flicker && tvScreen) {
        tvScreen.classList.add("is-tuning");
        aboutTuneRenderTimeout = window.setTimeout(() => {
          if (tuneId === aboutTuneId) renderAboutTv(data, tile);
        }, aboutTuneRenderDelay);
        aboutTuneClearTimeout = window.setTimeout(() => {
          if (tuneId === aboutTuneId) tvScreen.classList.remove("is-tuning");
        }, aboutTuneSettleDelay);
      } else {
        renderAboutTv(data, tile);
      }
    };
    const nextAboutStory = ({ announce = true } = {}) => {
      const pool = visibleAboutTiles();
      if (!pool.length) return;
      const currentIndex = Math.max(0, pool.indexOf(activeAboutTile));
      const nextIndex = activeAboutTile && pool.includes(activeAboutTile) ? (currentIndex + 1) % pool.length : 0;
      tuneAboutTv(pool[nextIndex], { announce });
    };
    const stopAboutAutoplay = () => {
      window.clearTimeout(aboutIntroTimeout);
      window.clearTimeout(aboutAutoplayTimeout);
    };
    const scheduleAboutAutoplay = (delay = aboutStoryAutoplayInterval) => {
      window.clearTimeout(aboutAutoplayTimeout);
      aboutAutoplayTimeout = window.setTimeout(() => {
        if (document.hidden) return;
        nextAboutStory({ announce: false });
        scheduleAboutAutoplay();
      }, delay);
    };
    const scheduleAboutIntro = () => {
      stopAboutAutoplay();
      aboutIntroTimeout = window.setTimeout(() => {
        if (document.hidden) return;
        const pool = visibleAboutTiles();
        if (!activeAboutTile && pool.length) tuneAboutTv(pool[0], { announce: false });
        scheduleAboutAutoplay();
      }, aboutIntroDuration);
    };
    const restartAboutAutoplay = () => {
      window.clearTimeout(aboutIntroTimeout);
      scheduleAboutAutoplay();
    };
    const syncAboutResponsiveArchive = () => {
      tvScreen?.setAttribute("aria-live", activeAboutTile ? "polite" : "off");
      clearAboutTune();
      syncAboutTileTabStops(activeAboutTile);
    };
    const revealAboutTvIfNeeded = () => {
      if (!aboutResponsiveArchive.matches || !aboutTv) return;
      const tvRect = aboutTv.getBoundingClientRect();
      const navigationBottom = document.querySelector(".site-nav")?.getBoundingClientRect().bottom || 0;
      const visibleTop = Math.max(0, navigationBottom);
      const isFullyVisible = tvRect.top >= visibleTop && tvRect.bottom <= window.innerHeight;
      if (isFullyVisible) return;
      aboutTv.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    };

    aboutTiles.forEach((tile) => {
      const data = aboutTileData(tile);
      tile.setAttribute("aria-label", `Tune story: ${data.title}`);
      tile.setAttribute("aria-pressed", "false");
      tile.addEventListener("click", () => {
        tuneAboutTv(tile);
        restartAboutAutoplay();
        revealAboutTvIfNeeded();
      });
      tile.addEventListener("keydown", (event) => {
        const pool = visibleAboutTiles();
        const currentIndex = pool.indexOf(tile);
        if (currentIndex < 0) return;

        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % pool.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + pool.length) % pool.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = pool.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        const nextTile = pool[nextIndex];
        nextTile.focus();
        tuneAboutTv(nextTile);
        restartAboutAutoplay();
      });
    });

    nextButton?.addEventListener("click", () => {
      nextButton.classList.add("is-dialing");
      window.setTimeout(() => nextButton.classList.remove("is-dialing"), 340);
      nextAboutStory();
      restartAboutAutoplay();
    });

    if (aboutTv && tvScreen) {
      syncAboutResponsiveArchive();
      renderAboutTv(tvInstruction, null);
      if (!prefersReducedMotion) {
        tvScreen.classList.add("is-warming-up");
        aboutWarmupTimeout = window.setTimeout(() => tvScreen.classList.remove("is-warming-up"), aboutWarmupDuration);
      }
      scheduleAboutIntro();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopAboutAutoplay();
        } else if (activeAboutTile) {
          scheduleAboutAutoplay();
        } else {
          scheduleAboutIntro();
        }
      });
      if (typeof aboutResponsiveArchive.addEventListener === "function") {
        aboutResponsiveArchive.addEventListener("change", syncAboutResponsiveArchive);
      } else {
        aboutResponsiveArchive.addListener(syncAboutResponsiveArchive);
      }
    }
  }

  const aboutLinenTimeline = document.querySelector("[data-about-linen-timeline]");
  if (aboutLinenTimeline) {
    const linenFolds = Array.from(aboutLinenTimeline.querySelectorAll("[data-about-linen-fold]"));
    const linenSummaries = linenFolds.map((fold) => fold.querySelector("[data-about-linen-summary]"));

    const syncLinenStack = (activeFold, { animate = true } = {}) => {
      const activeIndex = Math.max(0, linenFolds.indexOf(activeFold));
      linenFolds.forEach((fold, index) => {
        fold.classList.toggle("is-before-active", index < activeIndex);
        fold.classList.toggle("is-after-active", index > activeIndex);
        fold.classList.toggle("is-next-after-active", index === activeIndex + 1);
        if (fold !== activeFold) fold.classList.remove("is-unfolded");
      });

      if (!activeFold) return;
      if (prefersReducedMotion || !animate) {
        activeFold.classList.add("is-unfolded");
        return;
      }

      activeFold.classList.remove("is-unfolded");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => activeFold.classList.add("is-unfolded"));
      });
    };

    linenFolds.forEach((fold, index) => {
      const summary = linenSummaries[index];
      summary?.addEventListener("click", (event) => {
        if (fold.open) event.preventDefault();
      });
      summary?.addEventListener("keydown", (event) => {
        if (["Enter", " ", "Spacebar"].includes(event.key)) {
          event.preventDefault();
          if (!fold.open) fold.open = true;
          return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === "Home"
          ? 0
          : event.key === "End"
            ? linenSummaries.length - 1
            : event.key === "ArrowDown"
              ? (index + 1) % linenSummaries.length
              : (index - 1 + linenSummaries.length) % linenSummaries.length;
        linenSummaries[nextIndex]?.focus();
      });
      fold.addEventListener("toggle", () => {
        if (!fold.open) return;
        linenFolds.forEach((otherFold) => {
          if (otherFold !== fold && otherFold.open) otherFold.open = false;
        });
        syncLinenStack(fold);
      });
    });

    const initialFold = linenFolds.find((fold) => fold.open) || linenFolds[0];
    if (initialFold) {
      initialFold.open = true;
      syncLinenStack(initialFold, { animate: false });
    }
  }

  const towelTimelines = Array.from(document.querySelectorAll("[data-towel-timeline-v2]"));
  towelTimelines.forEach((timeline) => {
    const items = Array.from(timeline.querySelectorAll("[data-towel-item]"));
    const triggers = items.map((item) => item.querySelector("[data-towel-trigger]"));
    const panels = items.map((item) => item.querySelector("[data-towel-panel]"));
    const triggerTitles = items.map((item) => item.querySelector(".about-towel-history__label"));
    const detailTitles = items.map((item) => item.querySelector(".about-towel-history__detail-header h3"));
    const detailCopies = items.map((item) => item.querySelector(".about-towel-history__copy"));
    let timelineFitFrame = null;

    const fitSingleLineTitle = (element, sizeProperty) => {
      if (!element) return;
      element.style.removeProperty(sizeProperty);
      const styles = window.getComputedStyle(element);
      const availableWidth = element.clientWidth
        - Number.parseFloat(styles.paddingLeft)
        - Number.parseFloat(styles.paddingRight)
        - 2;
      const naturalFontSize = Number.parseFloat(styles.fontSize);
      const titleRange = document.createRange();
      titleRange.selectNodeContents(element);
      const naturalWidth = titleRange.getBoundingClientRect().width;
      titleRange.detach?.();
      if (!availableWidth || !naturalFontSize || !naturalWidth) return;
      const fitScale = naturalWidth > availableWidth
        ? (availableWidth / naturalWidth) * 0.99
        : 1;
      const fittedFontSize = naturalFontSize * fitScale;
      element.style.setProperty(sizeProperty, `${Math.max(8, fittedFontSize).toFixed(2)}px`);
      element.dataset.titleLength = String(element.textContent.trim().length);
      element.dataset.titleFit = fittedFontSize < naturalFontSize - 0.25 ? "scaled" : "natural";
    };

    const fitMultilineCopy = (element) => {
      if (!element) return;
      element.style.removeProperty("--towel-copy-size");
      const surface = element.closest(".about-towel-history__detail-surface");
      const naturalFontSize = Number.parseFloat(window.getComputedStyle(element).fontSize);
      if (!surface || !naturalFontSize || !element.getClientRects().length) return;

      const minimumFontSize = window.innerWidth <= 620
        ? 13
        : window.innerWidth <= 860
          ? 14
          : 10;
      const copyFitsAboveBand = () => {
        const surfaceRect = surface.getBoundingClientRect();
        const copyRect = element.getBoundingClientRect();
        const bandStart = Number.parseFloat(window.getComputedStyle(surface).getPropertyValue("--towel-band-start")) || 0.905;
        const safeGap = window.innerWidth <= 860 ? 14 : 12;
        return copyRect.bottom <= surfaceRect.top + (surfaceRect.height * bandStart) - safeGap + 0.5;
      };

      let fittedFontSize = naturalFontSize;
      if (!copyFitsAboveBand()) {
        let low = Math.min(minimumFontSize, naturalFontSize);
        let high = naturalFontSize;
        element.style.setProperty("--towel-copy-size", `${low.toFixed(2)}px`);
        fittedFontSize = low;
        if (copyFitsAboveBand()) {
          for (let step = 0; step < 9; step += 1) {
            const candidate = (low + high) / 2;
            element.style.setProperty("--towel-copy-size", `${candidate.toFixed(2)}px`);
            if (copyFitsAboveBand()) {
              low = candidate;
              fittedFontSize = candidate;
            } else {
              high = candidate;
            }
          }
        }
      }

      element.style.setProperty("--towel-copy-size", `${fittedFontSize.toFixed(2)}px`);
      element.dataset.copyLength = String(element.textContent.trim().length);
      element.dataset.copyFit = fittedFontSize < naturalFontSize - 0.25 ? "scaled" : "natural";
    };

    const scheduleTimelineFits = () => {
      window.cancelAnimationFrame(timelineFitFrame);
      timelineFitFrame = window.requestAnimationFrame(() => {
        triggerTitles.forEach((heading) => fitSingleLineTitle(heading, "--towel-trigger-title-size"));
        const activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
        fitSingleLineTitle(detailTitles[activeIndex], "--towel-detail-title-size");
        fitMultilineCopy(detailCopies[activeIndex]);
      });
    };

    const activateTowel = (nextIndex, { focus = false } = {}) => {
      if (nextIndex < 0 || nextIndex >= items.length) return;
      items.forEach((item, index) => {
        const isActive = index === nextIndex;
        item.classList.toggle("is-active", isActive);
        triggers[index]?.setAttribute("aria-expanded", String(isActive));
        panels[index]?.setAttribute("aria-hidden", String(!isActive));
      });
      scheduleTimelineFits();
      if (focus) triggers[nextIndex]?.focus();
    };

    triggers.forEach((trigger, index) => {
      if (!trigger) return;
      trigger.addEventListener("click", () => activateTowel(index));
      trigger.addEventListener("keydown", (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? triggers.length - 1
            : event.key === 'ArrowDown'
              ? (index + 1) % triggers.length
              : (index - 1 + triggers.length) % triggers.length;
        activateTowel(nextIndex, { focus: true });
      });
    });

    const initialIndex = Math.max(0, items.findIndex((item) => item.hasAttribute("data-towel-initial")));
    activateTowel(initialIndex);
    window.addEventListener("resize", scheduleTimelineFits, { passive: true });
    document.fonts?.ready.then(scheduleTimelineFits);
  });

  const storyCarousel = document.querySelector("[data-story-carousel]");
  if (storyCarousel) {
    const slides = Array.from(storyCarousel.querySelectorAll("[data-story-slide]"));
    const dots = Array.from(storyCarousel.querySelectorAll("[data-story-dot]"));
    const previousButton = storyCarousel.querySelector("[data-story-prev]");
    const nextButton = storyCarousel.querySelector("[data-story-next]");
    const counter = storyCarousel.querySelector("[data-story-counter]");
    const caption = storyCarousel.querySelector("[data-story-current-caption]");
    let activeStoryIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let isStoryFlipped = false;
    const storyNonMobile = window.matchMedia("(min-width: 621px)");
    const storyReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let storyDemoState = "idle";
    let storyDemoOpenTimer = null;
    let storyDemoCloseTimer = null;
    let storyDemoObserver = null;
    let storyDemoWasFlippedAtInteraction = false;

    const storyNumber = (value) => String(value).padStart(2, "0");
    const activeStorySlide = () => slides[activeStoryIndex];
    const visibleQueueCount = () => {
      if (window.matchMedia("(max-width: 620px)").matches) return 0;
      if (window.matchMedia("(max-width: 980px)").matches) return 2;
      return 4;
    };
    const storyLabel = (slide, action = "Flip story card for") => {
      const captionText = slide.dataset.storyCaption || slide.dataset.storyTitle || "story photo";
      return `${action} ${captionText}`;
    };
    const setStoryFlipped = (isFlipped) => {
      isStoryFlipped = isFlipped;
      storyCarousel.classList.toggle("is-flipped", isStoryFlipped);
      slides.forEach((slide, index) => {
        const isActive = index === activeStoryIndex;
        slide.classList.toggle("is-flipped", isActive && isStoryFlipped);
        slide.setAttribute("aria-pressed", String(isActive && isStoryFlipped));
        if (isActive) {
          slide.setAttribute("aria-label", storyLabel(slide, isStoryFlipped ? "Flip back to photo for" : "Flip story card for"));
        }
      });
    };
    const clearStoryDemoTimers = () => {
      if (storyDemoOpenTimer !== null) window.clearTimeout(storyDemoOpenTimer);
      if (storyDemoCloseTimer !== null) window.clearTimeout(storyDemoCloseTimer);
      storyDemoOpenTimer = null;
      storyDemoCloseTimer = null;
    };
    const clearStoryDemoVisual = () => {
      storyCarousel.classList.remove("is-demo-flipped");
      slides.forEach((slide) => slide.classList.remove("is-demo-flipped"));
    };
    const cancelStoryDemo = ({ restoreFront = false } = {}) => {
      clearStoryDemoTimers();
      clearStoryDemoVisual();
      if (storyDemoState !== "done") storyDemoState = "cancelled";
      storyDemoObserver?.disconnect();
      storyDemoObserver = null;
      if (restoreFront) setStoryFlipped(false);
    };
    const startStoryDemo = () => {
      if (
        storyDemoState !== "idle"
        || !storyNonMobile.matches
        || storyReducedMotion.matches
        || document.hidden
      ) return;

      storyDemoState = "scheduled";
      storyDemoObserver?.disconnect();
      storyDemoObserver = null;
      storyDemoOpenTimer = window.setTimeout(() => {
        storyDemoOpenTimer = null;
        if (!storyNonMobile.matches || storyReducedMotion.matches || document.hidden) {
          cancelStoryDemo({ restoreFront: true });
          return;
        }

        const currentSlide = activeStorySlide();
        if (!currentSlide) {
          cancelStoryDemo();
          return;
        }

        storyDemoState = "running";
        storyCarousel.classList.add("is-demo-flipped");
        currentSlide.classList.add("is-demo-flipped");
        storyDemoCloseTimer = window.setTimeout(() => {
          storyDemoCloseTimer = null;
          clearStoryDemoVisual();
          storyDemoState = "done";
        }, 2400);
      }, 800);
    };
    const renderStorySlide = (index) => {
      if (!slides.length) return;
      clearStoryDemoVisual();
      storyDemoWasFlippedAtInteraction = false;
      activeStoryIndex = (index + slides.length) % slides.length;
      const maxQueue = Math.min(visibleQueueCount(), Math.floor((slides.length - 1) / 2));
      slides.forEach((slide, slideIndex) => {
        const rawOffset = (slideIndex - activeStoryIndex + slides.length) % slides.length;
        const signedOffset = rawOffset > slides.length / 2 ? rawOffset - slides.length : rawOffset;
        const distance = Math.abs(signedOffset);
        const isActive = signedOffset === 0;
        const isQueued = distance > 0 && distance <= maxQueue;
        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-queued", isQueued);
        for (let queueIndex = 1; queueIndex <= 4; queueIndex += 1) {
          slide.classList.toggle(`is-prev-${queueIndex}`, signedOffset === -queueIndex && isQueued);
          slide.classList.toggle(`is-next-${queueIndex}`, signedOffset === queueIndex && isQueued);
        }
        slide.setAttribute("aria-hidden", String(!isActive && !isQueued));
        slide.tabIndex = isActive ? 0 : -1;
        if (!isActive) slide.setAttribute("aria-label", storyLabel(slide, "Show"));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeStoryIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
      if (counter) counter.textContent = `${storyNumber(activeStoryIndex + 1)} / ${storyNumber(slides.length)}`;
      if (caption) caption.textContent = activeStorySlide()?.dataset.storyCaption || "";
      setStoryFlipped(false);
    };

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (index === activeStoryIndex) {
          if (storyDemoWasFlippedAtInteraction) {
            storyDemoWasFlippedAtInteraction = false;
            setStoryFlipped(false);
          } else {
            setStoryFlipped(!isStoryFlipped);
          }
        } else {
          renderStorySlide(index);
        }
      });
      slide.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex + 1);
          activeStorySlide()?.focus();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex - 1);
          activeStorySlide()?.focus();
        }
      });
    });
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => renderStorySlide(index));
    });
    if (previousButton) previousButton.addEventListener("click", () => renderStorySlide(activeStoryIndex - 1));
    if (nextButton) nextButton.addEventListener("click", () => renderStorySlide(activeStoryIndex + 1));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") cancelStoryDemo({ restoreFront: true });
    });
    window.addEventListener("resize", () => renderStorySlide(activeStoryIndex));
    renderStorySlide(activeStoryIndex);

    const cancelStoryDemoForPointer = () => {
      storyDemoWasFlippedAtInteraction = storyDemoWasFlippedAtInteraction
        || storyCarousel.classList.contains("is-demo-flipped");
      cancelStoryDemo();
    };
    const cancelStoryDemoForClick = (event) => {
      if (!event.detail) cancelStoryDemoForPointer();
    };
    const cancelStoryDemoForKeyboard = (event) => {
      if (["Enter", " ", "Spacebar"].includes(event.key)) {
        storyDemoWasFlippedAtInteraction = storyDemoWasFlippedAtInteraction
          || storyCarousel.classList.contains("is-demo-flipped");
      }
      cancelStoryDemo();
    };
    storyCarousel.addEventListener("pointerdown", cancelStoryDemoForPointer, true);
    storyCarousel.addEventListener("click", cancelStoryDemoForClick, true);
    storyCarousel.addEventListener("keydown", cancelStoryDemoForKeyboard, true);
    storyCarousel.addEventListener("focusin", () => cancelStoryDemo({ restoreFront: true }), true);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && ["scheduled", "running"].includes(storyDemoState)) {
        cancelStoryDemo({ restoreFront: true });
      }
    });
    window.addEventListener("pagehide", () => cancelStoryDemo({ restoreFront: true }), { once: true });

    const cancelStoryDemoForPreference = (event) => {
      if (!event.matches) return;
      cancelStoryDemo({ restoreFront: true });
    };
    if (typeof storyNonMobile.addEventListener === "function") {
      storyNonMobile.addEventListener("change", (event) => {
        if (!event.matches) cancelStoryDemo({ restoreFront: true });
      });
      storyReducedMotion.addEventListener("change", cancelStoryDemoForPreference);
    } else {
      storyNonMobile.addListener((event) => {
        if (!event.matches) cancelStoryDemo({ restoreFront: true });
      });
      storyReducedMotion.addListener(cancelStoryDemoForPreference);
    }

    if (
      "IntersectionObserver" in window
      && storyNonMobile.matches
      && !storyReducedMotion.matches
    ) {
      storyDemoObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.38) startStoryDemo();
      }, { threshold: [0.38] });
      storyDemoObserver.observe(storyCarousel);
    }
  }

  const qualityCinema = document.querySelector("[data-quality-cinema]");
  if (qualityCinema) {
    const qualityStages = [
      {
        count: "01 / 04",
        title: "They come in tired.",
        copy: "Chef coats, linens, and towels arrive with different soil, wear, and return needs."
      },
      {
        count: "02 / 04",
        title: "Cleaned for the item, not just the load.",
        copy: "Soil, stains, chemistry, cycle choice, and handling all affect what your team receives back."
      },
      {
        count: "03 / 04",
        title: "Finished for how your team uses it.",
        copy: "Coats, linens, and towels are finished according to how they need to return."
      },
      {
        count: "04 / 04",
        title: "Clean goods. Longer life. Fewer headaches.",
        copy: "Chef coats return hung in poly, linens return stacked in a linen cart, and towels return packed in a bag."
      }
    ];
    const countNode = qualityCinema.querySelector("[data-quality-cinema-count]");
    const titleNode = qualityCinema.querySelector("[data-quality-cinema-title]");
    const copyNode = qualityCinema.querySelector("[data-quality-cinema-copy]");
    const stepNodes = Array.from(qualityCinema.querySelectorAll("[data-quality-cinema-step]"));
    let activeQualityStage = -1;
    let qualityFrame = null;

    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
    const renderQualityCinema = (progress) => {
      const cleanProgress = clamp((progress - 0.18) / 0.34);
      const finishProgress = clamp((progress - 0.48) / 0.34);
      const stageIndex = Math.min(qualityStages.length - 1, Math.floor(clamp(progress) * qualityStages.length));
      qualityCinema.style.setProperty("--quality-progress", progress.toFixed(3));
      qualityCinema.style.setProperty("--quality-clean-progress", cleanProgress.toFixed(3));
      qualityCinema.style.setProperty("--quality-finish-progress", finishProgress.toFixed(3));
      qualityCinema.dataset.qualityStage = String(stageIndex + 1);
      if (stageIndex === activeQualityStage) return;
      activeQualityStage = stageIndex;
      const stage = qualityStages[stageIndex];
      if (countNode) countNode.textContent = stage.count;
      if (titleNode) titleNode.textContent = stage.title;
      if (copyNode) copyNode.textContent = stage.copy;
      stepNodes.forEach((node, index) => node.classList.toggle("is-active", index === stageIndex));
    };
    const updateQualityCinema = () => {
      qualityFrame = null;
      if (prefersReducedMotion) {
        renderQualityCinema(1);
        return;
      }
      const rect = qualityCinema.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollDistance);
      renderQualityCinema(progress);
    };
    const requestQualityUpdate = () => {
      if (qualityFrame) return;
      qualityFrame = window.requestAnimationFrame(updateQualityCinema);
    };
    window.addEventListener("scroll", requestQualityUpdate, { passive: true });
    window.addEventListener("resize", requestQualityUpdate);
    updateQualityCinema();
  }

  const programProfiles = {
    hotels: {
      label: "Hotels & Boutique Stays",
      summary: "A dependable linen program for hotels and boutique properties, built around occupancy, volume, and room turnover.",
      items: ["Bed linens", "Towels", "Bath mats", "Robes", "Blankets"],
      rhythm: "Pickup and delivery scheduled around your property's needs, from weekly to daily service.",
      helps: "Shelton combines consistent commercial cleaning with the flexibility and personal attention of a local, family-run company. We learn how your property operates, then shape pickup schedules, finishing, packaging, and returns around your housekeeping workflow. Your linens are cleaned to our high standards, professionally finished, organized to your specifications, and returned on the schedule your team needs.",
      finishing: "Folded, bundled, and returned in linen carts based on your property's needs.",
      flow: ["Pickup cadence", "Account sorting", "Finishing standards", "Route-ready return"],
      cta: "Build a Hotel Program",
      href: "quote.html?program=hotels",
      secondaryCta: "Learn more about hospitality laundry →",
      secondaryHref: "industries.html#hotels"
    },
    str: {
      label: "Short-Term Rentals & Property Managers",
      summary: "A dependable bulk laundry program for operators and property managers handling frequent guest turnover.",
      items: ["Bed linens", "Towels", "Bath mats", "Duvet covers", "Blankets"],
      rhythm: "Bulk pickup and delivery to a central location, scheduled around turnover volume, property needs, and seasonal demand.",
      helps: "Shelton gives short-term rental operators access to the same efficient bulk-cleaning approach used for hotel linen programs. Consolidating linens for commercial processing provides consistent cleaning standards and hotel-style pricing without requiring hotel-level volume. Dependable scheduled service eliminates on-site washing and laundromat runs while helping prevent linen shortages.",
      finishing: "All sheets are professionally pressed and folded, while towels are neatly folded. Every item is bundled and organized before return, making distribution straightforward.",
      flow: ["Checkout pickup", "Property labeling", "Guest-ready folds", "Cleaner-friendly return"],
      cta: "Build a Short-Term Rental Program",
      href: "quote.html?program=str",
      secondaryCta: "Learn more about STR laundry programs →",
      secondaryHref: "industries.html#short-term-rentals"
    },
    spa: {
      label: "Spas, Massage & Wellness",
      summary: "A dependable laundry program for spas, massage studios, wellness clinics, and other treatment-based businesses.",
      items: ["Towels", "Sheets", "Robes", "Blankets", "Face cradle covers"],
      rhythm: "Recurring service scheduled around appointment volume, treatment-room turnover, and available storage.",
      helps: "Spa linens influence both client comfort and the presentation of every treatment room. Shelton provides consistently cleaned, professionally finished towels, sheets, and robes on a dependable schedule built around your business. Your staff can stay focused on clients instead of washing, drying, pressing, folding, and restocking throughout the day.",
      finishing: "Sheets are professionally pressed and folded. Towels are returned soft and professionally folded. Robes and other items are folded, bundled, and organized for easy restocking.",
      flow: ["Treatment-room volume", "Softness standards", "Use-based bundles", "Stocked return"],
      cta: "Build a Spa & Wellness Program",
      href: "quote.html?program=spa",
      secondaryCta: "Learn more about spa & wellness laundry →",
      secondaryHref: "industries.html#spas"
    },
    fitness: {
      label: "Gyms, Yoga & Fitness Studios",
      summary: "A dependable towel program for gyms, yoga and Pilates studios, fitness clubs, and training facilities.",
      items: ["Towels", "Hand towels", "Specialty items"],
      rhythm: "Recurring service scheduled around towel demand.",
      helps: "Shelton helps fitness facilities maintain a consistent supply of clean, fresh, and odor-free towels without requiring staff to manage laundry throughout the day. Commercial bulk cleaning handles high towel volume efficiently, while dependable scheduled service helps keep towel stations stocked through classes and peak hours.",
      finishing: "Towels are returned soft, professionally folded, bundled, and organized for easy restocking.",
      flow: ["Usage planning", "Frequent pickup", "Towel bundles", "Storage-aware return"],
      cta: "Build a Fitness Towel Program",
      href: "quote.html?program=fitness",
      secondaryCta: "Learn more about fitness towel service →",
      secondaryHref: "industries.html#gyms"
    },
    events: {
      label: "Event Linen Programs",
      summary: "A specialty linen program for event companies, venues, convention centers, and planners working with presentation goods, colored linens, and tight turnaround windows.",
      items: ["Tablecloths", "Napkins", "Runners", "Skirting", "Chair covers", "Specialty event goods"],
      rhythm: "Service scheduled around event dates, seasonal volume, and production needs.",
      helps: "Event linens must look their best and return to circulation quickly. Shelton combines high-quality commercial cleaning with careful handling for specialty fabrics and colors. We also offer specialized stain and mold treatment that can help recover damaged linens, reduce unnecessary replacement, and extend the useful life of your inventory.",
      finishing: "Linens are professionally pressed, hung or folded, sorted by item type, and organized for your team.",
      flow: ["Event deadline", "Specialty cleaning", "Order sorting", "Presentation-ready return"],
      cta: "Build an Event Linen Program",
      href: "quote.html?program=events",
      secondaryCta: "Learn more about event linen care →",
      secondaryHref: "industries.html#events"
    },
    restaurants: {
      label: "Restaurants & Food Service",
      summary: "A dependable commercial laundry program for restaurants, catering teams, and kitchens that need professional goods on a recurring schedule.",
      items: ["Chef coats", "Aprons", "Napkins", "Bar towels", "Tablecloths"],
      rhythm: "Recurring service scheduled around daily or weekly volume and kitchen use.",
      helps: "Shelton gives chef coats the high quality commercial cleaning and professional finishing they need to look sharp through repeated use. Each coat is properly cleaned, pressed, and returned on a dependable schedule, helping your kitchen maintain a consistent, professional appearance ensuring they look brand new on the 500th use. We apply that same standard of care to aprons, napkins, bar towels, and tablecloths.",
      finishing: "Items are professionally pressed, hung or folded, and returned in linen carts or bags based on your operation.",
      flow: ["Recurring service", "Stain-aware wash", "Dining-room finish", "Consistent return"],
      cta: "Build a Restaurant Laundry Program",
      href: "quote.html?program=restaurants",
      secondaryCta: "Learn more about restaurant laundry →",
      secondaryHref: "industries.html#restaurants"
    },
    uniforms: {
      label: "Uniforms & Casino Programs",
      summary: "A dependable uniform-cleaning program for casinos, hospitality teams, security, valet services, and other staff accounts.",
      items: ["Uniform shirts", "Chef coats", "Casino uniforms", "Workwear", "Jackets"],
      rhythm: "Recurring service scheduled around staff count, uniform use, changeouts, and shift requirements.",
      helps: "Uniforms are an important part of how your team and brand are presented. Shelton applies consistent cleaning and professional finishing across every garment, with a program built around your staff, departments, and organizational needs. Dependable scheduled service helps keep employees properly outfitted and looking professional for every shift.",
      finishing: "Uniforms are professionally pressed, hung or folded, and packaged according to your needs.",
      flow: ["Staff count", "Garment grouping", "Hung or folded finish", "Route-ready return"],
      cta: "Build a Uniform Program",
      href: "quote.html?program=uniforms",
      secondaryCta: "Learn more about uniform programs →",
      secondaryHref: "industries.html#uniforms"
    },
    specialty: {
      label: "Specialty Commercial Accounts",
      summary: "A flexible laundry and dry-cleaning program for theaters, religious organizations, clubs, and commercial accounts with unique fabric, scheduling, or presentation needs.",
      items: ["Costumes", "Choir robes", "Table linens", "Uniforms", "Dry-clean-only garments", "Specialty pieces"],
      rhythm: "Scheduled or as-needed service built around performances, services, events, banquets, and seasonal demand.",
      helps: "Some items do not fit neatly into a standard laundry program. Shelton takes the time to understand how each piece is used, how it should be presented, and how it needs to be handled. We use the appropriate commercial laundry or dry-cleaning process based on each item's fabric, construction, and use. Our professional finishing and local flexibility allow us to build a practical program around unique goods, irregular schedules, and specialized requirements.",
      finishing: "Items are professionally finished, hung or folded, and packaged according to their care requirements and your preferences.",
      flow: ["Unique goods", "Careful handling", "Presentation finish", "Packaged return"],
      cta: "Discuss Your Specialty Laundry Needs",
      href: "quote.html?program=specialty",
      secondaryCta: "Learn more about specialty accounts →",
      secondaryHref: "industries.html#specialty"
    }
  };

  const programButtons = document.querySelectorAll("[data-program-key]");
  const programPanel = document.querySelector("#program-detail-panel");
  let programTimer;
  const renderProgram = (key, shouldScroll = false) => {
    const profile = programProfiles[key] || programProfiles.hotels;
    if (!programPanel) return;

    const commit = () => {
      programButtons.forEach((button) => {
        const isActive = button.dataset.programKey === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-expanded", String(isActive));
      });
      setText(programPanel, "[data-program-field='title']", profile.label);
      setText(programPanel, "[data-program-field='summary']", profile.summary);
      setText(programPanel, "[data-program-field='rhythm']", profile.rhythm);
      setText(programPanel, "[data-program-field='helps']", profile.helps);
      setText(programPanel, "[data-program-field='finishing']", profile.finishing);
      setItems(programPanel, "[data-program-list='items']", profile.items);

      const cta = programPanel.querySelector("[data-program-field='href']");
      if (cta) {
        cta.textContent = profile.cta;
        cta.href = profile.href;
      }

      const secondaryCta = programPanel.querySelector("[data-program-field='secondaryHref']");
      if (secondaryCta) {
        const hasSecondaryCta = Boolean(profile.secondaryCta && profile.secondaryHref);
        secondaryCta.hidden = !hasSecondaryCta;
        secondaryCta.textContent = profile.secondaryCta || "";
        if (hasSecondaryCta) {
          secondaryCta.href = profile.secondaryHref;
        } else {
          secondaryCta.removeAttribute("href");
        }
      }

      programPanel.classList.remove("is-updating");
      programPanel.setAttribute("aria-busy", "false");
      if (shouldScroll && window.matchMedia("(max-width: 700px)").matches) {
        programPanel.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    };

    window.clearTimeout(programTimer);
    programPanel.setAttribute("aria-busy", "true");
    if (prefersReducedMotion) {
      commit();
    } else {
      programPanel.classList.add("is-updating");
      programTimer = window.setTimeout(commit, 120);
    }
  };

  programButtons.forEach((button) => {
    button.addEventListener("click", () => renderProgram(button.dataset.programKey, true));
  });

  const params = new URLSearchParams(window.location.search);
  const industry = params.get("industry");
  const service = params.get("service");
  const request = params.get("request");
  const program = params.get("program");
  const industrySelect = document.querySelector("#industry-select");
  const serviceSelect = document.querySelector("#service-select");
  const messageField = document.querySelector("#message-field");
  const programQuoteMap = {
    hotels: {
      industry: "hotel",
      service: "linen",
      message: "I am interested in building a hotel or boutique stay linen program."
    },
    str: {
      industry: "str",
      service: "linen",
      message: "I am interested in building a short-term rental or property management laundry program."
    },
    spa: {
      industry: "spa",
      service: "towels",
      message: "I am interested in building a spa, massage, or wellness laundry program."
    },
    fitness: {
      industry: "gym",
      service: "towels",
      message: "I am interested in building a gym, yoga, or fitness towel program."
    },
    events: {
      industry: "event",
      service: "event",
      message: "I am interested in building an event linen program for tablecloths, napkins, runners, or specialty event goods."
    },
    restaurants: {
      industry: "restaurant",
      service: "event",
      message: "I am interested in building a restaurant or food service laundry program for napkins, aprons, bar towels, dining-room goods, or uniforms."
    },
    uniforms: {
      industry: "uniform",
      service: "uniforms",
      message: "I am interested in building a uniform cleaning and finishing program."
    },
    specialty: {
      industry: "other",
      service: "not-sure",
      message: "I am interested in discussing a specialty commercial laundry or garment-care program for unique goods, schedules, or handling requirements."
    }
  };
  const programQuote = programQuoteMap[program];
  if (programQuote) {
    if (industrySelect) industrySelect.value = programQuote.industry;
    if (serviceSelect) serviceSelect.value = programQuote.service;
    if (messageField && !messageField.value) messageField.value = programQuote.message;
  }
  if (industrySelect && industry) industrySelect.value = industry;
  if (serviceSelect && service) serviceSelect.value = service;
  const requestQuoteMap = {
    "plant-tour": {
      service: "route",
      message: "I would like to schedule a plant tour and discuss a commercial laundry account."
    },
    "service-change": {
      service: "route",
      message: "I would like to request a change to my current commercial route service."
    },
    "route-command": {
      service: "route",
      message: "I would like to request access to Route Command for my commercial account."
    },
    "route-review": {
      service: "route",
      message: "I would like Shelton to review route availability for my business."
    }
  };
  const requestQuote = requestQuoteMap[request];
  if (requestQuote) {
    if (serviceSelect) serviceSelect.value = requestQuote.service;
    if (messageField) messageField.value = requestQuote.message;
  }

  if (request === "route-review") {
    try {
      const savedRouteDraft = window.sessionStorage.getItem("sheltonRouteReviewDraft");
      if (savedRouteDraft) {
        const routeDraft = JSON.parse(savedRouteDraft);
        const companyField = document.querySelector("#quote-form [name='company']");
        const nameField = document.querySelector("#quote-form [name='name']");
        const emailField = document.querySelector("#quote-form [name='email']");
        if (companyField && routeDraft.company) companyField.value = routeDraft.company;
        if (nameField && routeDraft.name) nameField.value = routeDraft.name;
        if (emailField && routeDraft.email) emailField.value = routeDraft.email;
        if (messageField && routeDraft.zip) {
          messageField.value = `${requestQuoteMap["route-review"].message}\nRoute ZIP: ${routeDraft.zip}.`;
        }
        window.sessionStorage.removeItem("sheltonRouteReviewDraft");
      }
    } catch {
      window.sessionStorage.removeItem("sheltonRouteReviewDraft");
    }
  }

})();
