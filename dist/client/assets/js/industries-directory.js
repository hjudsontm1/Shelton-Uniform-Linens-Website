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

  const getRootLength = (styles, property, fallback = 0) => {
    const token = styles.getPropertyValue(property).trim();
    const value = Number.parseFloat(token);
    if (!Number.isFinite(value)) return fallback;
    return token.endsWith("rem")
      ? value * Number.parseFloat(styles.fontSize)
      : value;
  };

  const getDockedDirectoryHeight = () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const height = getRootLength(
      rootStyles,
      "--serve-directory-docked-height",
      siteNavigation.offsetHeight,
    );
    const offset = getRootLength(rootStyles, "--serve-directory-docked-offset");
    return height + offset;
  };

  const setActiveLink = (nextId, { center = false } = {}) => {
    if (!nextId) return;
    activeId = nextId;

    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${nextId}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
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
    const hasPassedDirectory = directoryShell.getBoundingClientRect().top <= 1 && window.scrollY > 0;
    const hasReachedClosingSection = closingSection
      ? closingSection.getBoundingClientRect().top <= directoryHeight
      : false;
    const docked = hasPassedDirectory && !hasReachedClosingSection;
    document.body.classList.toggle("has-directory-header", docked);
    directory.classList.toggle("is-docked", docked);

    const readingLine = (docked ? directoryHeight : siteNavigation.offsetHeight) + 40;
    let nextId = sections[0].id;
    let nextTop = Number.NEGATIVE_INFINITY;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= readingLine && sectionTop > nextTop + 2) {
        nextId = section.id;
        nextTop = sectionTop;
      }
    });

    const hashedLink = links.find((link) => link.getAttribute("href") === window.location.hash);
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
  window.addEventListener("hashchange", requestDirectoryUpdate);
  window.addEventListener("load", requestDirectoryUpdate, { once: true });
  updateDirectory();
})();
