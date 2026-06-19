/* ===== Flower Stalk — interactions ===== */
(function () {
  'use strict';

  /* ---- Preloader (always resolves) ---- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    setTimeout(function () { if (preloader) preloader.style.display = 'none'; }, 550);
  }
  window.addEventListener('load', hidePreloader);
  // Safety fallback — never trap the user behind the loader
  setTimeout(hidePreloader, 1200);

  /* ---- Mobile menu (full-screen overlay) ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  var menuClose = document.getElementById('menu-close');

  function openMenu() {
    if (!menu) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('.mobile-menu__nav a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // 40ms stagger among siblings entering together
          var delay = (el.dataset.stagger ? parseInt(el.dataset.stagger, 10) : 0);
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    // Assign 40ms stagger by grouping siblings under the same parent
    var groups = new Map();
    revealEls.forEach(function (el) {
      var key = el.parentNode;
      var arr = groups.get(key) || [];
      el.dataset.stagger = String(arr.length * 40);
      arr.push(el);
      groups.set(key, arr);
      io.observe(el);
    });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Gallery lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lastFocused = null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  document.querySelectorAll('.gcard').forEach(function (card) {
    card.addEventListener('click', function () {
      var src = card.getAttribute('data-img');
      var img = card.querySelector('img');
      openLightbox(src, img ? img.alt : '');
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Toast ---- */
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 4000);
  }

  /* ---- Order form → WhatsApp + localStorage ---- */
  var form = document.getElementById('order-form');

  function setError(id, msg) {
    var field = document.getElementById(id);
    if (!field) return;
    var wrap = field.closest('.field');
    var err = document.querySelector('.field__err[data-for="' + id + '"]');
    if (wrap) wrap.classList.add('field--invalid');
    if (err) err.textContent = msg;
  }
  function clearError(id) {
    var field = document.getElementById(id);
    if (!field) return;
    var wrap = field.closest('.field');
    var err = document.querySelector('.field__err[data-for="' + id + '"]');
    if (wrap) wrap.classList.remove('field--invalid');
    if (err) err.textContent = '';
  }

  if (form) {
    ['f-name', 'f-phone', 'f-type'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { clearError(id); });
      if (el) el.addEventListener('change', function () { clearError(id); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('f-name').value.trim();
      var phone = document.getElementById('f-phone').value.trim();
      var type = document.getElementById('f-type').value;
      var date = document.getElementById('f-date').value;
      var notes = document.getElementById('f-notes').value.trim();

      var ok = true;
      if (!name) { setError('f-name', 'الرجاء كتابة الاسم'); ok = false; }
      var digits = phone.replace(/\D/g, '');
      if (!phone) { setError('f-phone', 'الرجاء كتابة رقم الجوال'); ok = false; }
      else if (digits.length < 9) { setError('f-phone', 'رقم الجوال غير مكتمل'); ok = false; }
      if (!type) { setError('f-type', 'اختر نوع الطلب'); ok = false; }
      if (!ok) {
        var firstInvalid = form.querySelector('.field--invalid input, .field--invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Save demo order to localStorage
      try {
        var orders = JSON.parse(localStorage.getItem('fs_orders') || '[]');
        orders.push({ name: name, phone: phone, type: type, date: date, notes: notes, at: new Date().toISOString() });
        localStorage.setItem('fs_orders', JSON.stringify(orders));
      } catch (err) { /* localStorage may be unavailable */ }

      // Build WhatsApp message
      var lines = [
        'مرحباً Flower Stalk، أرغب بطلب:',
        'الاسم: ' + name,
        'الجوال: ' + phone,
        'نوع الطلب: ' + type
      ];
      if (date) lines.push('تاريخ التسليم: ' + date);
      if (notes) lines.push('ملاحظات: ' + notes);
      var text = encodeURIComponent(lines.join('\n'));
      var waURL = 'https://wa.me/966534018920?text=' + text;

      showToast('تم تجهيز طلبك! يتم فتح واتساب الآن…');

      // Loading state, then open WhatsApp
      var btn = form.querySelector('.order-form__submit');
      var label = form.querySelector('.order-form__label');
      var original = label ? label.textContent : '';
      if (btn) btn.disabled = true;
      if (label) label.textContent = 'جاري التحويل…';

      setTimeout(function () {
        window.open(waURL, '_blank');
        if (btn) btn.disabled = false;
        if (label) label.textContent = original;
        form.reset();
      }, 700);
    });
  }

  /* ---- Year (safety) ---- */
})();
