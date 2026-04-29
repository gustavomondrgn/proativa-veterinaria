/* ==========================================================================
   Proativa — LGPD Cookie Consent
   - Google Consent Mode v2 (default DENIED)
   - Banner: Aceitar todos / Recusar todos / Personalizar
   - Modal granular: Essenciais (locked) / Análise / Marketing
   - Persistência via cookie próprio por 180 dias
   - API pública: window.ProativaConsent
   ========================================================================== */

(function () {
  'use strict';

  const CONSENT_KEY = 'proativa_consent_v1';
  const CONSENT_DURATION_DAYS = 180; // 6 meses

  /* ---------- Google Consent Mode v2: tudo DENIED por padrão ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });

  /* ---------- Cookie helpers ---------- */
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    const secure = location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() +
      ';path=/;SameSite=Lax' + secure;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].trim().split('=');
      if (parts[0] === name) return decodeURIComponent(parts.slice(1).join('='));
    }
    return null;
  }

  /* ---------- Aplicar e persistir consent ---------- */
  function applyConsent(choice, persist) {
    if (persist !== false) {
      setCookie(CONSENT_KEY, JSON.stringify(choice), CONSENT_DURATION_DAYS);
    }

    gtag('consent', 'update', {
      'ad_storage': choice.marketing ? 'granted' : 'denied',
      'ad_user_data': choice.marketing ? 'granted' : 'denied',
      'ad_personalization': choice.marketing ? 'granted' : 'denied',
      'analytics_storage': choice.analytics ? 'granted' : 'denied'
    });

    // Meta Pixel (se carregado)
    if (typeof window.fbq === 'function') {
      window.fbq('consent', choice.marketing ? 'grant' : 'revoke');
    }

    // Custom event para outros scripts
    document.dispatchEvent(new CustomEvent('proativa:consent', { detail: choice }));
  }

  function loadExistingConsent() {
    const saved = getCookie(CONSENT_KEY);
    if (!saved) return null;
    try {
      const choice = JSON.parse(saved);
      applyConsent(choice, false);
      return choice;
    } catch (e) {
      return null;
    }
  }

  /* ---------- UI: banner ---------- */
  function showBanner() {
    const banner = document.getElementById('cookie-consent');
    if (!banner) return;
    banner.removeAttribute('hidden');
    // Force reflow so transition triggers
    void banner.offsetWidth;
    banner.classList.add('is-visible');
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-consent');
    if (!banner) return;
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.setAttribute('hidden', ''); }, 350);
  }

  /* ---------- UI: modal ---------- */
  function openModal(prefill) {
    const modal = document.getElementById('cookie-modal');
    if (!modal) return;
    const ana = document.getElementById('toggle-analytics');
    const mkt = document.getElementById('toggle-marketing');
    const existing = prefill || loadExistingConsent() || { analytics: false, marketing: false };
    if (ana) ana.checked = !!existing.analytics;
    if (mkt) mkt.checked = !!existing.marketing;

    modal.removeAttribute('hidden');
    void modal.offsetWidth;
    modal.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('cookie-modal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    setTimeout(function () { modal.setAttribute('hidden', ''); }, 250);
    document.body.style.overflow = '';
  }

  function saveFromModal() {
    const ana = document.getElementById('toggle-analytics');
    const mkt = document.getElementById('toggle-marketing');
    applyConsent({
      analytics: !!(ana && ana.checked),
      marketing: !!(mkt && mkt.checked)
    });
    closeModal();
    hideBanner();
  }

  /* ---------- Wire up ---------- */
  function init() {
    const existing = loadExistingConsent();
    if (!existing) {
      // 1s de delay pra não assustar
      setTimeout(showBanner, 1000);
    }

    const acceptAll = document.getElementById('cookie-accept-all');
    const rejectAll = document.getElementById('cookie-reject-all');
    const customize = document.getElementById('cookie-customize');
    const modalSave = document.getElementById('cookie-modal-save');
    const openPrefs = document.getElementById('open-cookie-prefs');
    const modal = document.getElementById('cookie-modal');

    if (acceptAll) acceptAll.addEventListener('click', function () {
      applyConsent({ analytics: true, marketing: true });
      hideBanner();
    });

    if (rejectAll) rejectAll.addEventListener('click', function () {
      applyConsent({ analytics: false, marketing: false });
      hideBanner();
    });

    if (customize) customize.addEventListener('click', function () { openModal(); });
    if (modalSave) modalSave.addEventListener('click', saveFromModal);

    // Fechar modal por backdrop, X ou cancel
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.matches('[data-close]')) closeModal();
      });
    }

    // Esc fecha modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const m = document.getElementById('cookie-modal');
        if (m && !m.hasAttribute('hidden')) closeModal();
      }
    });

    // Link "Preferências de Cookies" no footer
    if (openPrefs) openPrefs.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- API pública ---------- */
  window.ProativaConsent = {
    hasConsent: function (category) {
      const saved = getCookie(CONSENT_KEY);
      if (!saved) return false;
      try { return JSON.parse(saved)[category] === true; } catch (e) { return false; }
    },
    reopenBanner: showBanner,
    openPreferences: openModal,
    revoke: function () {
      document.cookie = CONSENT_KEY + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      applyConsent({ analytics: false, marketing: false }, false);
      showBanner();
    }
  };
})();
