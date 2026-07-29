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
  const customerStep = document.querySelector('[data-customer-step]');
  const nextStage = document.querySelector('[data-next-stage]');
  const nextUpdate = document.querySelector('[data-next-update]');
  const finishStage = document.querySelector('[data-finish-stage]');
  const finishChoices = Array.from(document.querySelectorAll('[data-finish-choice]'));
  const finishStatus = document.querySelector('[data-finish-status]');
  const finishCaption = document.querySelector('[data-finish-caption]');
  const viewButtons = Array.from(document.querySelectorAll('[data-view-mode]'));
  const viewStatus = document.querySelector('[data-view-status]');
  const dialog = document.querySelector('[data-route-command-dialog]');
  const dialogOpeners = Array.from(document.querySelectorAll('[data-route-command-open]'));
  const dialogCloser = document.querySelector('[data-route-command-close]');
  const processNav = document.querySelector('.process-site-nav');
  const routeDeck = document.querySelector('[data-route-deck]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialRouteHash = window.location.hash;

  const finishContent = {
    pressed: {
      status: 'Pressed for presentation-sensitive sheets, table linen, uniforms, and event goods.',
      checkpoint: 'Checkpoint: Finish complete'
    },
    folded: {
      status: 'Folded into consistent stacks for linen carts, shelves, storage, and fast restocking.',
      checkpoint: 'Checkpoint: Fold complete'
    },
    hung: {
      status: 'Hung for uniforms, chef coats, and garments that should return ready for the team.',
      checkpoint: 'Checkpoint: Hang complete'
    },
    bundled: {
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

  function setDialogOpen(open) {
    if (!dialog) return;
    if (open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      return;
    }

    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function scrollTrackerToLink(link) {
    if (!customerTracker || !link || customerTracker.scrollWidth <= customerTracker.clientWidth) return;
    customerTracker.scrollTo({
      left: link.offsetLeft - ((customerTracker.clientWidth - link.offsetWidth) / 2),
      behavior: motionQuery.matches ? 'auto' : 'smooth'
    });
  }

  function setActivePanel(panelIndex) {
    if (panelIndex < 0 || panelIndex >= panels.length || panelIndex === activePanelIndex) return;
    activePanelIndex = panelIndex;

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

    if (customerStep) {
      if (isHero) customerStep.textContent = 'Ready to start the route';
      else if (isPortal) customerStep.textContent = 'Route complete · Route Command';
      else customerStep.textContent = `Step ${stageIndex + 1} of ${stages.length}`;
    }

    const updateIndex = isPortal ? updates.length - 1 : Math.max(0, stageIndex);
    if (nextStage) nextStage.textContent = updates[updateIndex][0];
    if (nextUpdate) nextUpdate.textContent = updates[updateIndex][1];

    if (window.innerWidth <= 720 && stageIndex >= 0) {
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

    if (routeDeck) routeDeck.dataset.activePanel = String(closestIndex);
  }

  function requestScrollUpdate() {
    if (initialAlignmentPending) return;
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      activePanelFromScroll();
    });
  }

  function scrollToPanel(index, options = {}) {
    const safeIndex = Math.min(Math.max(index, 0), Math.max(0, panels.length - 1));
    const panel = panels[safeIndex];
    if (!panel) return;

    const behavior = options.behavior || (motionQuery.matches ? 'auto' : 'smooth');
    const target = Math.max(0, panel.getBoundingClientRect().top + window.scrollY - navHeight());
    window.scrollTo({ top: target, behavior: behavior === 'auto' ? 'instant' : behavior });

    if (behavior === 'auto') {
      window.requestAnimationFrame(() => {
        const correction = panel.getBoundingClientRect().top - navHeight();
        if (Math.abs(correction) > 1) window.scrollBy({ top: correction, behavior: 'instant' });
      });
    }
    setActivePanel(safeIndex);
    if (options.updateHistory !== false) replacePanelHash(safeIndex);
  }

  allStageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const targetIndex = stages.findIndex((stage) => `#${stage.id}` === href);
      if (targetIndex < 0) return;
      event.preventDefault();
      scrollToPanel(targetIndex + 1);
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
        choice.setAttribute('aria-pressed', String(selected));
      });

      if (finishStatus) finishStatus.textContent = content.status;
      if (finishCaption) finishCaption.textContent = content.checkpoint;
    });
  });

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.viewMode;
      document.body.dataset.processView = mode;
      viewButtons.forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('is-active', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });
      if (viewStatus) viewStatus.textContent = mode === 'plant' ? 'Plant view' : 'In service';
    });
  });

  dialogOpeners.forEach((button) => {
    button.addEventListener('click', () => setDialogOpen(true));
  });

  if (dialogCloser) dialogCloser.addEventListener('click', () => setDialogOpen(false));

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) setDialogOpen(false);
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
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('hashchange', () => {
    initialAlignmentPending = false;
    alignInitialRouteHash();
  });

  const initialHashIndex = panels.findIndex((panel) => panel.id && `#${panel.id}` === initialRouteHash);
  setActivePanel(initialHashIndex >= 0 ? initialHashIndex : 0);
  if (document.readyState === 'complete') scheduleInitialRouteAlignment();
  else window.addEventListener('load', scheduleInitialRouteAlignment, { once: true });
})();
