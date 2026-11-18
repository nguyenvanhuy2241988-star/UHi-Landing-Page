/* UHi public website analytics. No customer form data or query strings collected. */
(function () {
  'use strict';
  if (!/^(www\.)?uhi\.vn$/.test(location.hostname) || window.__uhiAnalyticsLoaded) return;
  window.__uhiAnalyticsLoaded = true;
  var endpoint = 'https://www.lyhu.com.vn/api/analytics/track';
  function id() { return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2); }
  var visitor = id(), session = id();
  try {
    visitor = localStorage.getItem('uhi_visitor_id') || visitor;
    localStorage.setItem('uhi_visitor_id', visitor);
    session = sessionStorage.getItem('uhi_session_id') || session;
    sessionStorage.setItem('uhi_session_id', session);
  } catch (_) {}
  var lastPath = '', first = true;
  function track() {
    var path = location.pathname;
    if (path === lastPath || /^\/(admin|quan-tri|quan-ly-don(?:\.html)?|login|api)(\/|$)/.test(path)) return;
    lastPath = path;
    var nav = performance.getEntriesByType('navigation')[0];
    var elapsed = first && nav ? Math.round(nav.domContentLoadedEventEnd || performance.now()) : null;
    first = false;
    var referrer = '';
    try { if (document.referrer) referrer = new URL(document.referrer).origin; } catch (_) {}
    fetch(endpoint, {
      method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitor, session_id: session,
        url: location.origin + path, pathname: path, referrer: referrer,
        screen_width: innerWidth, load_time_ms: elapsed, is_webdriver: !!navigator.webdriver })
    }).catch(function () {});
  }
  if (document.readyState === 'complete') track(); else addEventListener('load', track, { once: true });
  addEventListener('pageshow', function (event) {
    if (event.persisted) { lastPath = ''; track(); }
  });
  addEventListener('popstate', track);
  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    history[method] = function () { var result = original.apply(this, arguments); track(); return result; };
  });
})();

