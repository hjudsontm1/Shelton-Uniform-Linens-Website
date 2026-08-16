(function () {
  if (new URLSearchParams(window.location.search).has('capture')) {
    document.body.classList.add('is-capture');
  }

  document.body.classList.remove('has-horizontal-route');

  const panels = Array.from(document.querySelectorAll('[data-route-panel]'));
  const stages = Array.from(document.querySelectorAll('[data-route-stage]'));
  const customerTracker = document.querySelector('[data-customer-tracker]');
  const customerLinks = customerTracker ? Array.from(customerTracker.querySelectorAll('a[href^="#"]')) : [];
  const startLinks = Array.from(document.querySelectorAll('.process-command-button[href="#pickup"]'));
  const allStageLinks = [...customerLinks, ...startLinks];
  const trackerProgress = document.querySelector('[data-route-progress]');
  const nextStage = document.querySelector('[data-next-stage]');
  const nextUpdate = document.querySelector('[data-next-update]');
  const finishStage = document.querySelector('[data-finish-stage]');
  const finishImage = document.querySelector('[data-finish-image]');
  const finishChoices = Array.from(document.querySelectorAll('[data-finish-choice]'));
  const finishStatus = document.querySelector('[data-finish-status]');
  const finishCaption = document.querySelector('[data-finish-caption]');
  const viewButtons = Array.from(document.querySelectorAll('[data-view-mode]'));
  const compareRange = document.querySelector('[data-compare-range]');
  const compareShell = compareRange ? compareRange.closest('.process-command-hero') : null;
  const dialog = document.querySelector('[data-route-command-dialog]');
  const dialogOpeners = Array.from(document.querySelectorAll('[data-route-command-open]'));
  const dialogCloser = document.querySelector('[data-route-command-close]');
  const processNav = document.querySelector('.process-site-nav');
  const routeDeck = document.querySelector('[data-route-deck]');
  const processCta = document.querySelector('#process-cta');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialRouteHash = window.location.hash;

  const finishContent = {
    pressed: {
      image: 'assets/images/process-ironer.jpg',
      alt: 'Fresh linen moving through a commercial ironer',
      status: 'Pressed for presentation-sensitive sheets, table linen, uniforms, and event goods.',
      checkpoint: 'Checkpoint: Finish complete'
    },
    folded: {
      image: 'assets/images/process-folding.jpg',
      alt: 'Consistent stacks of professionally folded commercial towels',
      status: 'Folded into consistent stacks for linen carts, shelves, storage, and fast restocking.',
      checkpoint: 'Checkpoint: Fold complete'
    },
    hung: {
      image: 'assets/images/industry-uniform.jpg',
      alt: 'Finished uniforms and chef coats arranged for protected return',
      status: 'Hung for uniforms, chef coats, and garments that should return ready for the team.',
      checkpoint: 'Checkpoint: Hang complete'
    },
    bundled: {
      image: 'assets/images/generated/process-bundled-linens-v1.jpg',
      alt: 'A protected bundle of folded white linens secured with a navy inventory band',
      status: 'Bundled and labeled by item type, property, department, or account preference.',
      checkpoint: 'Checkpoint: Bundle complete'
    }
  };

  const updates = [
    ['Sort', 'We’ll update you when sorting is complete.'],
    ['Clean', 'We’ll update you when the wash cycle is complete.'],
    ['Finish', 'We’ll update you when finishing is complete.'],
    ['Inspect', 'We’ll update you after the final quality check.'],
    ['Package', 'We’ll update you when your goods are staged.'],
    ['Return', 'We’ll update you when the route departs.'],
    ['Complete', 'Your route is complete and ready to begin again.']
  ];

  let activePanelIndex = -1;
  let ticking = false;
  let initialAlignmentPending = Boolean(initialRouteHash);
  let navigationToken = 0;
  let programmaticScroll = false;
  let compareTouched = false;
  let lastDialogOpener = null;
  let finishSwapTimer = 0;
  let finishSwapToken = 0;

  function navHeight() {
    return processNav ? processNav.offsetHeight : 0;
  }

  function replacePanelHash(panelIndex) {
    const panel = panels[panelIndex];
    if (!panel) return;

    if (panelIndex === 0) {
      if (!window.location.hash) return;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      return;
    }

    if (!panel.id || window.location.hash === `#${panel.id}`) return;
    window.history.replaceState(null, '', `#${panel.id}`);
  }

  function setDialogOpen(open, opener) {
    if (!dialog) return;
    if (open) {
      if (dialog.open) return;
      lastDialogOpener = opener || document.activeElement;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      return;
    }

    if (!dialog.open && !dialog.hasAttribute('open')) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function scrollTrackerToLink(link) {
    if (!customerTracker || !link || customerTracker.scrollWidth <= customerTracker.clientWidth) return;
    const trackerRect = customerTracker.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const linkCenterInsideTracker = customerTracker.scrollLeft + (linkRect.left - trackerRect.left) + (linkRect.width / 2);
    customerTracker.scrollTo({
      left: Math.max(0, linkCenterInsideTracker - (customerTracker.clientWidth / 2)),
      behavior: motionQuery.matches ? 'auto' : 'smooth'
    });
  }

  function setActivePanel(panelIndex, options = {}) {
    if (panelIndex < 0 || panelIndex >= panels.length) return;
    if (panelIndex === activePanelIndex && !options.force) return;
    activePanelIndex = panelIndex;
    if (routeDeck) routeDeck.dataset.activePanel = String(panelIndex);

    panels.forEach((panel, index) => {
      panel.classList.toggle('is-active', index === panelIndex);
    });

    const isHero = panelIndex === 0;
    const isPortal = panelIndex === panels.length - 1;
    const stageIndex = isHero ? 0 : (isPortal ? -1 : panelIndex - 1);

    customerLinks.forEach((link, linkIndex) => {
      link.classList.toggle('is-complete', isPortal || (!isHero && linkIndex < stageIndex));
      if (linkIndex === stageIndex) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });

    if (trackerProgress) {
      const completedStages = isHero ? 0 : (isPortal ? stages.length : stageIndex + 1);
      trackerProgress.style.width = `${(completedStages / stages.length) * 100}%`;
    }

    const updateIndex = isPortal ? updates.length - 1 : Math.max(0, stageIndex);
    if (nextStage) nextStage.textContent = updates[updateIndex][0];
    if (nextUpdate) nextUpdate.textContent = updates[updateIndex][1];

    if (stageIndex >= 0 && customerTracker && customerTracker.scrollWidth > customerTracker.clientWidth) {
      scrollTrackerToLink(customerLinks[stageIndex]);
    }
  }

  function activePanelFromScroll() {
    if (!panels.length) return;

    const marker = navHeight() + ((window.innerHeight - navHeight()) * 0.38);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const rect = panel.getBoundingClientRect();
      const panelPoint = Math.max(rect.top, Math.min(marker, rect.bottom));
      const distance = Math.abs(panelPoint - marker);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActivePanel(closestIndex);

  }

  function requestScrollUpdate() {
    if (initialAlignmentPending || programmaticScroll) return;
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      activePanelFromScroll();
    });
  }

  function instantScrollTo(top) {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top, behavior: 'auto' });
    if (previousBehavior) root.style.scrollBehavior = previousBehavior;
    else root.style.removeProperty('scroll-behavior');
  }

  function scrollToPanel(index, options = {}) {
    const safeIndex = Math.min(Math.max(index, 0), Math.max(0, panels.length - 1));
    const panel = panels[safeIndex];
    if (!panel) return;

    const behavior = options.behavior || (motionQuery.matches ? 'auto' : 'smooth');
    const target = Math.max(0, panel.getBoundingClientRect().top + window.scrollY - navHeight());
    const currentToken = ++navigationToken;
    let lastScrollY = window.scrollY;
    let stableFrames = 0;
    let totalFrames = 0;
    programmaticScroll = true;

    if (behavior === 'smooth') window.scrollTo({ top: target, behavior });
    else instantScrollTo(target);
    setActivePanel(safeIndex, { force: true });
    if (options.updateHistory !== false) replacePanelHash(safeIndex);

    const settle = () => {
      if (currentToken !== navigationToken) return;
      totalFrames += 1;

      if (Math.abs(window.scrollY - lastScrollY) < 0.5) stableFrames += 1;
      else stableFrames = 0;
      lastScrollY = window.scrollY;

      if (stableFrames < 4 && totalFrames < 120) {
        window.requestAnimationFrame(settle);
        return;
      }

      const correction = panel.getBoundingClientRect().top - navHeight();
      if (Math.abs(correction) > 1) instantScrollTo(window.scrollY + correction);
      programmaticScroll = false;
      setActivePanel(safeIndex, { force: true });

      if (options.focusTarget) {
        const heading = panel.querySelector('h1, h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      }

      requestScrollUpdate();
    };

    window.requestAnimationFrame(settle);
  }

  allStageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const targetIndex = stages.findIndex((stage) => `#${stage.id}` === href);
      if (targetIndex < 0) return;
      event.preventDefault();
      scrollToPanel(targetIndex + 1, { focusTarget: true });
    });
  });

  finishChoices.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.finishChoice;
      const content = finishContent[mode];
      if (!finishStage || !content) return;

      finishStage.dataset.finishMode = mode;
      finishChoices.forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('is-active', selected);
        choice.setAttribute('aria-checked', String(selected));
        choice.tabIndex = selected ? 0 : -1;
      });

      if (finishStatus) finishStatus.textContent = content.status;
      if (finishCaption) finishCaption.textContent = content.checkpoint;

      const currentSwapToken = ++finishSwapToken;
      window.clearTimeout(finishSwapTimer);

      if (finishImage && finishImage.getAttribute('src') !== content.image) {
        finishStage.classList.add('is-changing');
        const nextImage = new Image();
        let imageCommitted = false;

        const commitImage = () => {
          if (imageCommitted || currentSwapToken !== finishSwapToken) return;
          imageCommitted = true;
          window.clearTimeout(finishSwapTimer);
          finishImage.src = content.image;
          finishImage.alt = content.alt;
          window.requestAnimationFrame(() => finishStage.classList.remove('is-changing'));
        };

        nextImage.addEventListener('load', commitImage, { once: true });
        nextImage.src = content.image;
        finishSwapTimer = window.setTimeout(commitImage, 900);
      } else {
        finishStage.classList.remove('is-changing');
      }
    });
  });

  function setComparePosition(value, options = {}) {
    if (!compareRange || !compareShell) return;
    const numericValue = Math.min(Number(compareRange.max), Math.max(Number(compareRange.min), Number(value)));
    compareRange.value = String(numericValue);
    compareShell.style.setProperty('--compare-position', `${numericValue}%`);
    compareRange.setAttribute('aria-valuetext', `${numericValue} percent on arrival and ${100 - numericValue} percent return ready`);
    if (options.userInitiated) compareTouched = true;
  }

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.viewMode;
      document.body.dataset.processView = mode;
      viewButtons.forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('is-active', selected);
        choice.setAttribute('aria-checked', String(selected));
        choice.tabIndex = selected ? 0 : -1;
      });
      const mobilePreset = mode === 'plant' ? 68 : 74;
      const desktopPreset = mode === 'plant' ? 68 : 42;
      setComparePosition(window.innerWidth <= 820 ? mobilePreset : desktopPreset, { userInitiated: true });
    });
  });

  if (compareRange && compareShell) {
    compareRange.addEventListener('input', () => {
      setComparePosition(compareRange.value, { userInitiated: true });
    });
  }

  function bindRovingRadioGroup(buttons) {
    buttons.forEach((button, index) => {
      button.tabIndex = button.getAttribute('aria-checked') === 'true' ? 0 : -1;
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (index + direction + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });
  }

  bindRovingRadioGroup(viewButtons);
  bindRovingRadioGroup(finishChoices);

  dialogOpeners.forEach((button) => {
    button.addEventListener('click', () => setDialogOpen(true, button));
  });

  if (dialogCloser) dialogCloser.addEventListener('click', () => setDialogOpen(false));

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) setDialogOpen(false);
    });
    dialog.addEventListener('close', () => {
      if (lastDialogOpener && typeof lastDialogOpener.focus === 'function') lastDialogOpener.focus();
      lastDialogOpener = null;
    });
  }

  function alignInitialRouteHash() {
    const hashIndex = panels.findIndex((panel) => panel.id && `#${panel.id}` === window.location.hash);
    if (hashIndex >= 0) {
      scrollToPanel(hashIndex, { behavior: 'auto', updateHistory: false });
      initialAlignmentPending = false;
      requestScrollUpdate();
      return;
    }

    if (processCta && window.location.hash === '#process-cta') {
      const target = Math.max(0, processCta.getBoundingClientRect().top + window.scrollY - navHeight());
      instantScrollTo(target);
      initialAlignmentPending = false;
      setActivePanel(panels.length - 1, { force: true });
      return;
    }

    initialAlignmentPending = false;
    activePanelFromScroll();
  }

  function scheduleInitialRouteAlignment() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.setTimeout(alignInitialRouteHash, 120);
      });
    });
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', () => {
    if (!compareTouched) setComparePosition(window.innerWidth <= 820 ? 74 : 50);
    setActivePanel(activePanelIndex, { force: true });
    requestScrollUpdate();
  });
  window.addEventListener('hashchange', () => {
    initialAlignmentPending = false;
    alignInitialRouteHash();
  });

  const initialHashIndex = panels.findIndex((panel) => panel.id && `#${panel.id}` === initialRouteHash);
  setComparePosition(window.innerWidth <= 820 ? 74 : 50);
  setActivePanel(initialHashIndex >= 0 ? initialHashIndex : 0);
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', scheduleInitialRouteAlignment, { once: true });
  else scheduleInitialRouteAlignment();

  if (document.fonts && document.fonts.ready && initialRouteHash) {
    document.fonts.ready.then(alignInitialRouteHash);
  }
})();
