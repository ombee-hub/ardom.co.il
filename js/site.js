(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const EMAIL = 'web@ardomtele.co.il';

  /* ---------- header: צל כשגוללים ---------- */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('is-solid', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- מגירת תפריט (טלפון/טאבלט) ---------- */
  const burger = $('.burger');
  const scrim = $('.nav-scrim');
  if (burger && scrim) {
    const setOpen = open => {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open);
      if (open) { scrim.hidden = false; requestAnimationFrame(() => $('.drawer-x').focus()); }
      else { setTimeout(() => { if (!document.body.classList.contains('nav-open')) scrim.hidden = true; }, 380); }
    };
    burger.addEventListener('click', () => setOpen(true));
    $('.drawer-x').addEventListener('click', () => { setOpen(false); burger.focus(); });
    scrim.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setOpen(false); burger.focus(); }
    });
    $$('.nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    window.matchMedia('(min-width: 1181px)').addEventListener('change', e => e.matches && setOpen(false));
  }

  /* ---------- סרטוני יוטיוב: נטענים רק בלחיצה ---------- */
  $$('.yt[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.id}?autoplay=1&rel=0`;
      f.title = btn.getAttribute('aria-label') || 'סרטון';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      btn.replaceChildren(f);
      btn.removeAttribute('aria-label');
      btn.style.cursor = 'default';
    }, { once: true });
  });

  /* ---------- טפסים: פותחים הודעת מייל מוכנה ---------- */
  $$('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = Object.fromEntries(new FormData(form));
      const labels = { name: 'שם מלא', company: 'חברה', phone: 'טלפון', email: 'אימייל', topic: 'נושא' };
      const lines = Object.keys(labels).filter(k => d[k]).map(k => `${labels[k]}: ${d[k]}`);
      if (d.message) lines.push('', d.message);
      const subject = `פנייה מהאתר${d.topic ? ' – ' + d.topic : ''}`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const st = $('.form-status', form);
      if (st) st.textContent = 'נפתחה הודעת מייל מוכנה לשליחה. אם לא נפתחה, אפשר לכתוב ישירות ל-' + EMAIL;
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const rev = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => rev.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  $$('.year').forEach(y => { y.textContent = new Date().getFullYear(); });
})();
