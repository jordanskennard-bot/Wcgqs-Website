(function () {
    'use strict';

    var STORAGE_KEY = 'fp_cookie_consent';
    var GA_ID = 'G-BHLYP9Q4HK';

    /* ── Helpers ─────────────────────────────────────────── */

    function getConsent() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function saveConsent(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    }

    function grantAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                analytics_storage:   'granted',
                ad_storage:          'granted',
                ad_user_data:        'granted',
                ad_personalization:  'granted'
            });
        }
    }

    function denyAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                analytics_storage:   'denied',
                ad_storage:          'denied',
                ad_user_data:        'denied',
                ad_personalization:  'denied'
            });
        }
    }

    function hideBanner() {
        var banner = document.getElementById('fp-cookie-banner');
        if (banner) {
            banner.style.transform = 'translateY(120%)';
            banner.style.opacity   = '0';
            setTimeout(function () {
                if (banner.parentNode) banner.parentNode.removeChild(banner);
            }, 400);
        }
    }

    /* ── Inject CSS ──────────────────────────────────────── */

    var style = document.createElement('style');
    style.textContent = [
        '#fp-cookie-banner {',
        '  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);',
        '  z-index: 9999; width: calc(100% - 3rem); max-width: 780px;',
        '  background: #111e35; border: 1px solid rgba(77,212,232,0.35);',
        '  border-radius: 14px; padding: 1.2rem 1.5rem;',
        '  display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap;',
        '  box-shadow: 0 8px 40px rgba(0,0,0,0.55);',
        '  font-family: Barlow, Arial, sans-serif; font-size: 0.9rem;',
        '  color: rgba(255,255,255,0.8); line-height: 1.5;',
        '  transition: transform 0.4s ease, opacity 0.4s ease;',
        '}',
        '#fp-cookie-banner p { margin: 0; flex: 1; min-width: 200px; }',
        '#fp-cookie-banner a { color: #4dd4e8; text-decoration: none; }',
        '#fp-cookie-banner a:hover { text-decoration: underline; }',
        '#fp-cookie-banner .fp-btn-wrap { display: flex; gap: 0.6rem; flex-shrink: 0; flex-wrap: wrap; }',
        '#fp-cookie-banner button {',
        '  font-family: Barlow, Arial, sans-serif; font-size: 0.875rem; font-weight: 600;',
        '  padding: 0.55rem 1.2rem; border-radius: 50px; border: none; cursor: pointer;',
        '  transition: opacity 0.2s;',
        '}',
        '#fp-cookie-banner button:hover { opacity: 0.85; }',
        '#fp-btn-accept { background: #4dd4e8; color: #0a1628; }',
        '#fp-btn-reject { background: transparent; color: rgba(255,255,255,0.6);',
        '  border: 1px solid rgba(255,255,255,0.25) !important; }',
        '@media (max-width: 500px) {',
        '  #fp-cookie-banner { flex-direction: column; align-items: flex-start; }',
        '  #fp-cookie-banner .fp-btn-wrap { width: 100%; justify-content: flex-end; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    /* ── Inject Banner HTML ──────────────────────────────── */

    function showBanner() {
        var banner = document.createElement('div');
        banner.id = 'fp-cookie-banner';
        banner.innerHTML =
            '<p>We use cookies for analytics and advertising. See our ' +
            '<a href="/privacy.html">Privacy Policy</a> for details.</p>' +
            '<div class="fp-btn-wrap">' +
            '<button id="fp-btn-reject">Essential only</button>' +
            '<button id="fp-btn-accept">Accept all</button>' +
            '</div>';

        document.body.appendChild(banner);

        document.getElementById('fp-btn-accept').addEventListener('click', function () {
            saveConsent('granted');
            grantAnalytics();
            hideBanner();
        });

        document.getElementById('fp-btn-reject').addEventListener('click', function () {
            saveConsent('denied');
            denyAnalytics();
            hideBanner();
        });
    }

    /* ── Init ────────────────────────────────────────────── */

    function init() {
        var consent = getConsent();
        if (consent === 'granted') {
            grantAnalytics();           // restore consent for this session
        } else if (consent === 'denied') {
            denyAnalytics();            // keep denied, no banner
        } else {
            showBanner();               // first visit — ask
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
