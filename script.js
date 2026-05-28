/* ============================================================
   UNICREW SOCIALS — interactions
   ============================================================ */

(() => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---------- Loader ---------- */
  const loader = $('#loader');
  const counter = $('[data-count]');
  let counterDone = false;
  let n = 0;
  const tick = () => {
    n = Math.min(100, n + Math.ceil(Math.random()*7));
    if (counter) counter.textContent = String(n).padStart(2,'0');
    if (n < 100) setTimeout(tick, 60);
    else { counterDone = true; tryFinish(); }
  };
  tick();

  function tryFinish(){
    if (!counterDone) return;
    document.body.classList.add('ready');
    loader.classList.add('done');
  }
  window.addEventListener('load', () => setTimeout(tryFinish, 400));

  /* ---------- Custom cursor ---------- */
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (cursor && matchMedia('(min-width: 901px)').matches){
    let mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const raf = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform  = `translate(${mx-3}px, ${my-3}px)`;
      ring.style.transform = `translate(${rx-18}px, ${ry-18}px)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const hoverables = 'a, button, input, textarea, label, [data-tilt], .tier, .reel-dot';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) cursor.classList.remove('hover');
    });
  }

  /* ---------- Nav scroll state + on-light sections ---------- */
  const nav = $('#nav');
  const lightSections = $$('[data-scene="standard"], [data-scene="process"], [data-scene="manifesto"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.5){
        nav.classList.add('on-light');
      }
    });
    // Recheck if none of the light sections is dominant -> dark
    const onLight = lightSections.some(sec => {
      const r = sec.getBoundingClientRect();
      return r.top < 80 && r.bottom > 120;
    });
    nav.classList.toggle('on-light', onLight);
  }, { threshold:[0,.5,1] });
  lightSections.forEach(s => navObserver.observe(s));

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    const onLight = lightSections.some(sec => {
      const r = sec.getBoundingClientRect();
      return r.top < 80 && r.bottom > 120;
    });
    nav.classList.toggle('on-light', onLight);
  }, { passive:true });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-stagger, .compare-card, .track, .rail-step').forEach(el => io.observe(el));

  /* ---------- Animated price counters ---------- */
  const priceIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1400;
      const t0 = performance.now();
      const fmt = (n) => n.toLocaleString('en-US');
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      priceIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.price-num[data-target]').forEach(el => { el.textContent = '0'; priceIO.observe(el); });

  /* ---------- Edge card pointer glow ---------- */
  $$('.edge-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Tilt on compare cards ---------- */
  $$('[data-tilt]').forEach(card => {
    let rect = null;
    card.addEventListener('pointerenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 6;
      const ry = (x - 0.5) * 6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      rect = null;
    });
  });

  /* ---------- Reel auto-rotate ---------- */
  const reelSlides = $$('.reel-slide');
  const reelDots = $$('.reel-dot');
  const reelBar = $('.reel-progress i');
  let reelIdx = 0;
  const REEL_MS = 4200;
  let reelStart = performance.now();
  let reelPaused = false;

  function setReel(i){
    reelIdx = (i + reelSlides.length) % reelSlides.length;
    reelSlides.forEach((s, k) => s.classList.toggle('active', k === reelIdx));
    reelDots.forEach((d, k) => d.classList.toggle('active', k === reelIdx));
    reelStart = performance.now();
  }
  reelDots.forEach((d, k) => d.addEventListener('click', () => setReel(k)));

  function reelLoop(t){
    if (!reelPaused){
      const p = Math.min(1, (t - reelStart) / REEL_MS);
      if (reelBar) reelBar.style.width = (p * 100) + '%';
      if (p >= 1) setReel(reelIdx + 1);
    }
    requestAnimationFrame(reelLoop);
  }
  if (reelSlides.length){
    setReel(0);
    requestAnimationFrame(reelLoop);
    const reelFrame = $('.reel-frame');
    reelFrame.addEventListener('pointerenter', () => { reelPaused = true; });
    reelFrame.addEventListener('pointerleave', () => { reelPaused = false; reelStart = performance.now(); });
  }

  /* ---------- Hero parallax ---------- */
  const orbA = $('.hero-orb-a');
  const orbB = $('.hero-orb-b');
  const grid = $('.hero-grid');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    if (orbA) orbA.style.transform = `translate(${y * -0.04}px, ${y * 0.08}px)`;
    if (orbB) orbB.style.transform = `translate(${y * 0.04}px, ${y * -0.06}px)`;
    if (grid) grid.style.transform = `translateY(${y * 0.18}px)`;
  }, { passive:true });

  /* ---------- Brief form (no backend) ---------- */
  const form = $('#briefForm');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.brand || !data.email){
        status.textContent = '× Please add name, brand and email.';
        status.classList.remove('ok');
        return;
      }
      const subject = encodeURIComponent(`New Brief · ${data.brand} · ${data.tier || 'tier tbd'}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nBrand: ${data.brand}\nEmail: ${data.email}\nTier: ${data.tier || '—'}\nStart: ${data.start || '—'}\n\nBrief:\n${data.brief || '—'}`
      );
      window.location.href = `mailto:hello@unicrew.ae?subject=${subject}&body=${body}`;
      status.textContent = '✓ Opening your mail client — we reply within one business day.';
      status.classList.add('ok');
    });
  }

  /* ---------- Smooth anchor scroll (respect reduced motion) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
