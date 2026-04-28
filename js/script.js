/* ============================================================
   PROATIVA — script.js
   Funcionalidades principais:
   1. Tracking de CTAs (depende de consent)
   2. Marquee de reviews (pause on touch)
   3. Smooth scroll
   4. Header sticky behavior
   ============================================================ */

(function () {
  'use strict';

  // 1. Tracking de CTAs — placeholder. Implementação completa quando
  //    Pixel ID e GTM ID estiverem definidos.
  function setupCTATracking() {
    // a implementar
  }

  // 2. Marquee — pause on touch (mobile). Hover é tratado via CSS.
  function setupMarqueeTouch() {
    var marquee = document.getElementById('reviews-marquee');
    if (!marquee) return;

    var resumeTimeout;
    function pause() {
      clearTimeout(resumeTimeout);
      marquee.classList.add('is-paused');
    }
    function scheduleResume() {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(function () {
        marquee.classList.remove('is-paused');
      }, 1500);
    }

    marquee.addEventListener('touchstart', pause, { passive: true });
    marquee.addEventListener('touchend',   scheduleResume, { passive: true });
    marquee.addEventListener('touchcancel', scheduleResume, { passive: true });
  }

  // 3. Smooth scroll para âncoras internas
  function setupSmoothScroll() {
    // a implementar
  }

  // 4. Header sticky — comportamento de show/hide ao scrollar
  function setupStickyHeader() {
    // a implementar
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupCTATracking();
    setupMarqueeTouch();
    setupSmoothScroll();
    setupStickyHeader();
  });
})();
