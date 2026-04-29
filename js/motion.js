/* ==========================================================================
   MOTION — sitewide micro-interactions (JS layer)
   ========================================================================== */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Reveal on scroll — fade + lift quando entra viewport
     ------------------------------------------------------------------------ */
  const revealTargets = [
    '.section__head',
    '.diff-card',
    '.vet-card',
    '.urgency__card',
    '.urgency__list li',
    '.services__col',
    '.location__address-card',
    '.location__facts li',
    '.location__phones',
    '.final-cta__step',
    '.review-card',
  ];

  if (!reduceMotion) {
    document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
      el.classList.add('reveal');
      // stagger entre filhos do mesmo pai
      const idxInParent = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--reveal-delay', `${Math.min(idxInParent, 6) * 60}ms`);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    // reduced-motion: marca tudo como visível direto
    document.querySelectorAll(revealTargets.join(',')).forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     2. Header sticky shrink — encolhe ao rolar
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrolled = false;
    const updateHeader = () => {
      const scrolled = window.scrollY > 24;
      if (scrolled !== lastScrolled) {
        header.classList.toggle('is-scrolled', scrolled);
        lastScrolled = scrolled;
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. Live time — transição suave ao atualizar texto
     ------------------------------------------------------------------------ */
  const liveTimeEl = document.getElementById('liveTime');
  if (liveTimeEl && !reduceMotion) {
    const observer = new MutationObserver(() => {
      liveTimeEl.style.opacity = '0.4';
      requestAnimationFrame(() => {
        liveTimeEl.style.opacity = '1';
      });
    });
    observer.observe(liveTimeEl, { childList: true, characterData: true, subtree: true });
  }
})();
