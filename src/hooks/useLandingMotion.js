import { useEffect } from 'react';

// Motion completo per la landing v3: intro curtain, scroll reveals,
// contatori animati, glow che segue il puntatore, sticky steps, nav state,
// parallax leggera. Rispetta prefers-reduced-motion.
export function useLandingMotion() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

    const cleanups = [];

    // ── INTRO CURTAIN ──
    const curtain = $('#curtain');
    function bootHero() {
      document.documentElement.classList.add('ready');
      $$('.hero [data-rise]').forEach((el, i) => {
        el.style.transitionDelay = (reduce ? 0 : 120 + i * 90) + 'ms';
        el.classList.add('in');
      });
      startCounters($('.hero-meta'));
    }
    if (reduce || !curtain) {
      curtain && curtain.remove();
      bootHero();
    } else {
      requestAnimationFrame(() => curtain.classList.add('lift'));
      const t1 = setTimeout(() => { curtain.classList.add('gone'); bootHero(); }, 820);
      const t2 = setTimeout(() => curtain.remove(), 1700);
      cleanups.push(() => { clearTimeout(t1); clearTimeout(t2); });
    }

    // ── SCROLL REVEALS ──
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in');
        if (el.hasAttribute('data-stagger')) {
          $$('[data-item]', el).forEach((c, i) => {
            c.style.transitionDelay = (reduce ? 0 : i * 55) + 'ms';
            c.classList.add('in');
          });
        }
        if (el.hasAttribute('data-count')) startCounters(el);
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    $$('[data-rise]:not(.hero [data-rise]), [data-stagger], [data-count]').forEach(el => io.observe(el));
    cleanups.push(() => io.disconnect());

    // ── COUNTERS ──
    function startCounters(scope) {
      if (!scope) return;
      $$('[data-to]', scope).forEach(el => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const to = parseFloat(el.dataset.to);
        const dec = parseInt(el.dataset.dec || '0', 10);
        const pre = el.dataset.pre || '';
        const suf = el.dataset.suf || '';
        if (reduce) {
          el.textContent = pre + to.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
          return;
        }
        const dur = 1250;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          const v = to * e;
          el.textContent = pre + v.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }

    // ── HERO POINTER GLOW ──
    const hero = $('.hero');
    let heroCleanup;
    if (hero && !reduce && matchMedia('(pointer:fine)').matches) {
      let raf = 0, tx = 50, ty = 30, cx = 50, cy = 30;
      const onMove = e => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top) / r.height) * 100;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      function loop() {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        hero.style.setProperty('--mx', cx.toFixed(2) + '%');
        hero.style.setProperty('--my', cy.toFixed(2) + '%');
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : 0;
      }
      hero.addEventListener('pointermove', onMove);
      heroCleanup = () => { hero.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
      cleanups.push(heroCleanup);
    }

    // ── STICKY STEPS ──
    const steps = $$('.pstep');
    if (steps.length) {
      const so = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) {
            steps.forEach(s => s.classList.remove('active'));
            e.target.classList.add('active');
          }
        });
      }, { threshold: 0.6 });
      steps.forEach(s => so.observe(s));
      cleanups.push(() => so.disconnect());
    }

    // ── NAV STATE ──
    const nav = $('.nav');
    let navCleanup;
    if (nav) {
      const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
      navCleanup = () => removeEventListener('scroll', onScroll);
      cleanups.push(navCleanup);
    }

    // ── PARALLAX (light) ──
    if (!reduce) {
      const layers = $$('[data-par]');
      if (layers.length) {
        let pr = 0;
        const onScrollP = () => {
          if (pr) return;
          pr = requestAnimationFrame(() => {
            layers.forEach(l => {
              const r = l.getBoundingClientRect();
              if (r.bottom < -200 || r.top > innerHeight + 200) return;
              const k = parseFloat(l.dataset.par);
              l.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - innerHeight / 2) * k * -0.06).toFixed(1) + 'px,0)';
            });
            pr = 0;
          });
        };
        addEventListener('scroll', onScrollP, { passive: true });
        cleanups.push(() => removeEventListener('scroll', onScrollP));
      }
    }

    return () => {
      cleanups.forEach(c => c && c());
      document.documentElement.classList.remove('ready');
    };
  }, []);
}
