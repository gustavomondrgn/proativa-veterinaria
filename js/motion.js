/* ==========================================================================
   MOTION — sitewide micro-interactions (JS layer)
   ========================================================================== */

(() => {
  'use strict';

  const PAPER_MODE = new URLSearchParams(location.search).has('paper');
  if (PAPER_MODE) document.documentElement.classList.add('paper-mode');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || PAPER_MODE;

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

  /* ------------------------------------------------------------------------
     4. Floating WhatsApp — show/hide inteligente
        - Esconde enquanto o hero está visível (CTAs já à mão)
        - Esconde quando o final-cta entra em vista (CTAs gigantes ali)
        - Aparece em todas as seções intermediárias
     ------------------------------------------------------------------------ */
  const floatBtn = document.getElementById('floatWhatsApp');
  const heroEl = document.querySelector('.hero');
  const finalCtaEl = document.querySelector('.final-cta');

  if (floatBtn && heroEl && finalCtaEl) {
    floatBtn.removeAttribute('hidden');

    let heroVisible = true;
    let finalCtaVisible = false;

    const updateFloat = () => {
      const shouldShow = !heroVisible && !finalCtaVisible;
      floatBtn.classList.toggle('is-visible', shouldShow);
    };

    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updateFloat();
    }, { threshold: 0, rootMargin: '0px 0px -200px 0px' }).observe(heroEl);

    new IntersectionObserver((entries) => {
      finalCtaVisible = entries[0].isIntersecting;
      updateFloat();
    }, { threshold: 0.15 }).observe(finalCtaEl);
  }
})();
