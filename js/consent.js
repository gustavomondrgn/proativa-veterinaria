/* ============================================================
   PROATIVA — consent.js
   Banner de cookies LGPD + Google Consent Mode v2.
   Implementação completa virá na etapa LGPD.
   ============================================================ */

(function () {
  'use strict';

  const CONSENT_KEY = 'proativa_consent_v1';
  const CONSENT_DURATION_DAYS = 180; // 6 meses

  // Inicializa Consent Mode com tudo DENIED por padrão.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });

  // API pública (a popular na etapa LGPD)
  window.ProativaConsent = {
    hasConsent: function (/* category */) { return false; },
    reopenBanner: function () { /* a implementar */ }
  };
})();
