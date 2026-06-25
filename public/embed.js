/**
 * Depgrow WhatsApp Widget — embed.js
 * Served from /public/embed.js
 * Zero dependencies. Zero CSS conflicts. Works on any website.
 *
 * Usage:
 *   <script src="https://widget.depgrow.in/embed.js" data-widget="wgt_abc123" async></script>
 */
;(function () {
  'use strict'

  // ── Guard: only run once ────────────────────────────────────────────────
  if (window.__depgrowWidgetLoaded) return
  window.__depgrowWidgetLoaded = true

  // ── Find our script tag ─────────────────────────────────────────────────
  var scripts  = document.querySelectorAll('script[data-widget]')
  var scriptEl = scripts[scripts.length - 1]
  if (!scriptEl) return

  var slug    = scriptEl.getAttribute('data-widget')
  var baseUrl = scriptEl.src.replace('/embed.js', '')
  if (!slug) return

  // ── Fetch config ─────────────────────────────────────────────────────────
  fetch(baseUrl + '/api/config/' + slug, { mode: 'cors' })
    .then(function (r) { return r.json() })
    .then(function (res) {
      if (!res.data || !res.data.is_active) return
      init(res.data, baseUrl, slug)
    })
    .catch(function (e) {
      console.warn('[Depgrow Widget] Failed to load config:', e)
    })

  // ── Init widget ──────────────────────────────────────────────────────────
  function init(cfg, baseUrl, slug) {
    var pos      = cfg.position === 'bottom-left' ? 'left' : 'right'
    var sizeMap  = { sm: 48, md: 56, lg: 64 }
    var iconMap  = { sm: 24, md: 28, lg: 32 }
    var btnSize  = sizeMap[cfg.button_size] || 56
    var iconSize = iconMap[cfg.button_size] || 28
    var waUrl    = 'https://wa.me/' + cfg.phone.replace(/\D/g, '') + '?text=' + encodeURIComponent(cfg.pre_filled_message)

    // ── Shadow DOM host (zero CSS conflict) ─────────────────────────────
    var host = document.createElement('div')
    host.id  = 'depgrow-widget-host'
    host.setAttribute('style', [
      'position:fixed',
      'bottom:24px',
      pos + ':24px',
      'z-index:9999',
      'display:flex',
      'flex-direction:column',
      'align-items:' + (pos === 'right' ? 'flex-end' : 'flex-start'),
      'gap:10px',
      'pointer-events:none',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    ].join(';'))
    document.body.appendChild(host)

    // ── Tooltip ──────────────────────────────────────────────────────────
    var tooltip = null
    if (cfg.show_tooltip && cfg.tooltip_text) {
      tooltip = document.createElement('div')
      tooltip.setAttribute('style', [
        'background:#fff',
        'color:#111',
        'border:1px solid #e5e7eb',
        'border-radius:10px',
        'padding:8px 14px',
        'font-size:13px',
        'font-weight:500',
        'white-space:nowrap',
        'box-shadow:0 4px 16px rgba(0,0,0,0.12)',
        'pointer-events:auto',
        'opacity:0',
        'transform:translateY(6px)',
        'transition:opacity 0.3s,transform 0.3s',
        'cursor:pointer',
        'max-width:220px',
        'white-space:normal',
        'line-height:1.4',
      ].join(';'))
      tooltip.textContent = cfg.tooltip_text
      tooltip.addEventListener('click', function () { openWhatsApp() })
      host.appendChild(tooltip)

      // Show after delay
      setTimeout(function () {
        tooltip.style.opacity = '1'
        tooltip.style.transform = 'translateY(0)'
      }, cfg.tooltip_delay || 3000)
    }

    // ── Button ────────────────────────────────────────────────────────────
    var btn = document.createElement('a')
    btn.href   = waUrl
    btn.target = '_blank'
    btn.rel    = 'noopener noreferrer'
    btn.setAttribute('aria-label', cfg.button_label || 'Chat on WhatsApp')
    btn.setAttribute('style', [
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'width:' + btnSize + 'px',
      'height:' + btnSize + 'px',
      'border-radius:50%',
      'background:' + (cfg.button_color || '#25D366'),
      'box-shadow:0 4px 20px rgba(0,0,0,0.22)',
      'cursor:pointer',
      'pointer-events:auto',
      'text-decoration:none',
      'border:none',
      'outline:none',
      'transition:transform 0.2s,box-shadow 0.2s',
    ].join(';'))

    // WhatsApp icon SVG
    btn.innerHTML = [
      '<svg width="' + iconSize + '" height="' + iconSize + '" viewBox="0 0 24 24" fill="' + (cfg.icon_color || '#fff') + '">',
      '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.13h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.27-8.22 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.83c0 4.53-3.7 8.19-8.27 8.19zm4.52-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z"/>',
      '</svg>',
    ].join('')

    // Hover effects
    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1)'
      this.style.boxShadow = '0 6px 28px rgba(0,0,0,0.3)'
    })
    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)'
      this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.22)'
    })

    // Click → track + open
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      openWhatsApp()
    })

    host.appendChild(btn)

    // ── Open WhatsApp + track ───────────────────────────────────────────
    function openWhatsApp() {
      // Hide tooltip on click
      if (tooltip) {
        tooltip.style.opacity = '0'
        tooltip.style.transform = 'translateY(6px)'
      }
      // Track click (fire-and-forget)
      try {
        fetch(baseUrl + '/api/track/' + slug, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer:   window.location.href,
            user_agent: navigator.userAgent,
          }),
          keepalive: true,
        }).catch(function () {})
      } catch (_) {}
      // Open WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }
})()
