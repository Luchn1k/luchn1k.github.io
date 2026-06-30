'use strict';

/**
 * ============================================================
 *  Portfolio Website — Main Script
 *  Pure vanilla JS · Zero dependencies · Production-ready
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
   *  1. THEME TOGGLE
   * ────────────────────────────────────────────── */

  const THEME_KEY = 'theme';

  const SVG_MOON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  const SVG_SUN = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  /**
   * Apply a theme to the document and persist the choice.
   * @param {'dark'|'light'} theme
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      // In dark mode show the moon icon (click will switch to light).
      // In light mode show the sun icon (click will switch to dark).
      btn.innerHTML = theme === 'dark' ? SVG_MOON : SVG_SUN;
    }
  }

  // Initialise theme — default to dark when no preference is stored.
  const storedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(storedTheme === 'light' ? 'light' : 'dark');

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ──────────────────────────────────────────────
   *  2. TYPING ANIMATION
   * ────────────────────────────────────────────── */

  const typingEl = document.getElementById('typing-text');

  if (typingEl) {
    const phrases = [
      'AI Engineer & Tech Lead',
      'Agentic AI Architect',
      'Multi-Agent Systems Builder',
      'LLM Infrastructure Engineer',
      'Full-Stack Developer',
    ];

    const TYPE_SPEED   = 60;   // ms per character typed
    const DELETE_SPEED  = 40;   // ms per character deleted
    const PAUSE_AFTER   = 2000; // ms pause after full phrase typed
    const PAUSE_BETWEEN = 500;  // ms pause between phrases

    let phraseIdx = 0;
    let charIdx   = 0;
    let isDeleting = false;

    function tick() {
      const current = phrases[phraseIdx];

      if (!isDeleting) {
        // Typing forward
        charIdx++;
        typingEl.textContent = current.substring(0, charIdx);

        if (charIdx === current.length) {
          // Finished typing — pause, then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting backward
        charIdx--;
        typingEl.textContent = current.substring(0, charIdx);

        if (charIdx === 0) {
          // Finished deleting — move to next phrase
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, PAUSE_BETWEEN);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    // Kick off the animation
    setTimeout(tick, PAUSE_BETWEEN);
  }

  /* ──────────────────────────────────────────────
   *  3. SCROLL ANIMATIONS  (Intersection Observer)
   * ────────────────────────────────────────────── */

  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    fadeEls.forEach((el) => fadeObserver.observe(el));
  }

  /* ──────────────────────────────────────────────
   *  4. NAVBAR SCROLL EFFECT
   * ────────────────────────────────────────────── */

  const navbar = document.getElementById('navbar');

  /* ──────────────────────────────────────────────
   *  5. ACTIVE NAV LINK HIGHLIGHTING
   * ────────────────────────────────────────────── */

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  /**
   * Combined scroll handler for navbar background + active link.
   * Throttled via requestAnimationFrame for performance.
   */
  let scrollTicking = false;

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // 4 — Navbar background toggle
      if (navbar) {
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // 5 — Active section detection
      // We walk top-to-bottom; the last section whose top has been passed wins.
      let currentId = '';
      const offset = window.innerHeight * 0.35; // look-ahead offset

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - offset;
        if (scrollY >= sectionTop) {
          currentId = section.getAttribute('id');
        }
      });

      navAnchors.forEach((a) => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${currentId}`) {
          a.classList.add('active');
        }
      });

      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load so the initial state is correct.
  onScroll();

  /* ──────────────────────────────────────────────
   *  6. SMOOTH SCROLL FOR NAV LINKS
   * ────────────────────────────────────────────── */

  const navLinkContainer = document.getElementById('nav-links');

  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      // Close mobile menu if it's open
      if (navLinkContainer && navLinkContainer.classList.contains('active')) {
        navLinkContainer.classList.remove('active');
        const mobileBtn = document.getElementById('mobile-menu-toggle');
        if (mobileBtn) mobileBtn.classList.remove('active');
      }
    });
  });

  /* ──────────────────────────────────────────────
   *  7. MOBILE MENU TOGGLE
   * ────────────────────────────────────────────── */

  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');

  if (mobileMenuBtn && navLinkContainer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinkContainer.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (
        navLinkContainer.classList.contains('active') &&
        !navLinkContainer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navLinkContainer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }

  /* ──────────────────────────────────────────────
   *  8. COUNTER ANIMATION
   * ────────────────────────────────────────────── */

  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    /**
     * Animate a single counter element from 0 → data-target over ~2 s.
     * Uses requestAnimationFrame for buttery-smooth rendering.
     */
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000; // ms
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);

        // Ease-out cubic for a satisfying deceleration curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure final value is exact
          el.textContent = target + '+';
        }
      }

      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

}); // end DOMContentLoaded
