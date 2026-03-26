/**
 * blog-lang.js
 * Applies the correct translated title to all .multilang-title elements
 * based on the active i18next language, and re-applies on language change.
 *
 * Works alongside i18n-config.js — no dependencies on main.js.
 */

(function () {
    function applyMultilangTitles() {
        const lang = (typeof currentLang !== 'undefined' ? currentLang : 'en') || 'en';
        document.querySelectorAll('.multilang-title').forEach(function (el) {
            const title =
                el.getAttribute('data-lang-' + lang) ||
                el.getAttribute('data-lang-en') ||
                el.textContent;
            if (title) el.textContent = title;
        });
    }

    // Hook into i18n-config's ready / language-change callbacks
    const _prevOnI18nReady = window.onI18nReady;
    window.onI18nReady = function () {
        if (typeof _prevOnI18nReady === 'function') _prevOnI18nReady();
        applyMultilangTitles();
    };

    const _prevOnLangChange = window.onLangChange;
    window.onLangChange = function () {
        if (typeof _prevOnLangChange === 'function') _prevOnLangChange();
        applyMultilangTitles();
    };

    // Also patch i18next.changeLanguage so language switches on blog pages work
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof i18next === 'undefined') return;

        const _origChange = i18next.changeLanguage.bind(i18next);
        i18next.changeLanguage = function (lang, cb) {
            return _origChange(lang, function () {
                if (typeof cb === 'function') cb.apply(this, arguments);
                applyMultilangTitles();
            });
        };

        // Initial application (in case i18n already resolved)
        applyMultilangTitles();
    });
})();
