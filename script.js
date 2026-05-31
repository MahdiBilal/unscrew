/* ============================================================
   UNICREW SOCIALS — Apple-style motion engine
   ============================================================ */
(() => {
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- INTRO LOADER ---------- */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
const hero = document.querySelector('.hero');

function startHero(){ if(hero) hero.classList.add('loaded'); }

if (reduce || !loader) {
  if (loader) loader.classList.add('done');
  startHero();
} else {
  document.body.classList.add('loading');
  let p = 0;
  const tick = () => {
    p += Math.max(1, (100 - p) * 0.12);
    if (p >= 100) p = 100;
    loaderFill.style.width = p + '%';
    loaderPct.textContent = String(Math.round(p)).padStart(2, '0');
    if (p < 100) {
      setTimeout(tick, 70 + Math.random() * 90);
    } else {
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
        startHero();
      }, 320);
    }
  };
  // kick off shortly after first paint
  setTimeout(tick, 260);
}
// safety net
addEventListener('load', () => { if (hero && !hero.classList.contains('loaded')) startHero(); });
setTimeout(() => { if (hero && !hero.classList.contains('loaded')) startHero(); }, 4000);

/* ---------- NAV + PROGRESS ---------- */
const nav = document.getElementById('nav'), prog = document.getElementById('progress');
function onScrollNav(){
  const y = scrollY;
  nav.classList.toggle('scrolled', y > innerHeight * 0.7);
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
}
addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

/* ---------- TIMECODE ---------- */
const tc = document.getElementById('tc');
const pad = n => String(n).padStart(2, '0');
function updTC(){
  const h = document.documentElement.scrollHeight - innerHeight;
  const p = h > 0 ? scrollY / h : 0;
  const total = Math.round(p * (3 * 60 * 24));
  const f = total % 24, s = Math.floor(total / 24) % 60, m = Math.floor(total / (24 * 60));
  if (tc) tc.textContent = `00:${pad(m)}:${pad(s)}:${pad(f)}`;
}
addEventListener('scroll', updTC, { passive: true });
updTC();

/* ---------- CUSTOM CURSOR ---------- */
if (!reduce && matchMedia('(hover:hover)').matches) {
  const cur = document.getElementById('cur'), curd = document.getElementById('curd');
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    curd.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
  }, { passive: true });
  (function loop(){
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,.svc,.work,.tool,.client,.play,.step').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('hov'));
    el.addEventListener('mouseleave', () => cur.classList.remove('hov'));
  });
}

/* ---------- WORD-SPLIT FOR BIG HEADINGS ---------- */
document.querySelectorAll('h2.big').forEach(h => {
  if (h.dataset.nosplit) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = h.innerHTML;
  function wrap(node){
    const out = document.createDocumentFragment();
    node.childNodes.forEach(c => {
      if (c.nodeType === 3) {
        c.textContent.split(/(\s+)/).forEach(t => {
          if (/^\s+$/.test(t)) { out.appendChild(document.createTextNode(t)); }
          else if (t.length) {
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = t;
            w.appendChild(s); out.appendChild(w);
          }
        });
      } else if (c.nodeName === 'BR') {
        out.appendChild(c.cloneNode());
      } else {
        const el = c.cloneNode(false); el.appendChild(wrap(c)); out.appendChild(el);
      }
    });
    return out;
  }
  h.innerHTML = '';
  h.appendChild(wrap(tmp));
  h.classList.add('wr');
  h.querySelectorAll('.w>span').forEach((s, i) => s.style.transitionDelay = (i * 0.05) + 's');
});

/* ---------- COUNT-UP ---------- */
function countUp(b){
  const t = parseFloat(b.dataset.target), dec = b.dataset.dec === '1', dur = 1600, s = performance.now();
  function tick(n){
    let p = Math.min((n - s) / dur, 1);
    p = 1 - Math.pow(1 - p, 3);
    const v = t * p;
    b.textContent = dec ? v.toFixed(1) : Math.round(v);
    if (p < 1) requestAnimationFrame(tick);
    else b.textContent = dec ? t.toFixed(1) : t;
  }
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.querySelectorAll('b[data-target]').forEach(countUp);
    statsObs.unobserve(e.target);
  }
}), { threshold: 0.4 });
const statsEl = document.getElementById('stats');
if (statsEl) statsObs.observe(statsEl);

/* ---------- REVEALS ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.r,.ey,.work,.wr,.reel-stage,.lens,.lens-media').forEach(el => io.observe(el));

/* ---------- GRACEFUL IMAGE FALLBACK ---------- */
function failImg(img){
  const wi = img.closest('.work-img');
  if (wi) { wi.classList.add('img-fail'); img.style.display = 'none'; return; }
  const lm = img.closest('.lens-media');
  if (lm) { lm.classList.add('img-fail'); img.style.display = 'none'; return; }
  const fr = img.closest('.fr');
  if (fr) { fr.style.background = 'linear-gradient(135deg,#2a2018,#5e1515)'; img.style.display = 'none'; return; }
  const rb = img.closest('.hero-bg, .reel-stage');
  if (rb) { img.style.display = 'none'; }
}

/* ---------- APPLE-STYLE SCROLL ENGINE (parallax + hero scale) ---------- */
if (!reduce) {
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map(el => ({
    el, speed: parseFloat(el.dataset.speed) || 0.15
  }));
  const heroIn = document.querySelector('[data-hero-fade]');
  const wm = document.querySelector('.watermark');
  let raf = false;

  function frame(){
    raf = false;
    const y = scrollY, vh = innerHeight;

    // hero scales down + fades + lifts as you scroll past it (Apple-style)
    if (heroIn && y < vh * 1.2) {
      const p = Math.min(y / vh, 1);
      const scale = 1 - p * 0.08;
      const lift = -p * 60;
      const op = 1 - p * 1.05;
      heroIn.style.transform = `translateY(${lift}px) scale(${scale})`;
      heroIn.style.opacity = Math.max(op, 0).toFixed(3);
    }

    // generic parallax — only translate elements within the viewport band
    for (const { el, speed } of parallaxEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const center = r.top + r.height / 2;
      const off = (center - vh / 2) * -speed;
      if (el === wm) el.style.transform = `translate(${off * 0.4}px,${off}px)`;
      else el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
    }
  }
  function onScroll(){ if (!raf) { raf = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  frame();
}

/* ---------- HERO POINTER PARALLAX ---------- */
if (!reduce && matchMedia('(hover:hover)').matches) {
  const hi = document.getElementById('heroImg');
  addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - 0.5;
    if (hi) hi.style.marginLeft = `${x * -14}px`;
  }, { passive: true });
}

/* ---------- GALLERY SCROLL PARALLAX (subtle) ---------- */
if (!reduce) {
  const imgs = [...document.querySelectorAll('.work-img img')];
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const vh = innerHeight;
      imgs.forEach(im => {
        const r = im.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const off = ((r.top + r.height / 2) / vh - 0.5) * -18;
        im.style.translate = '0 ' + off.toFixed(1) + 'px';
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- FILM STRIP — placeholder frames (images removed) ---------- */
(function(){
  const track = document.getElementById('stripTrack');
  if (!track) return;
  // Build from the gallery cells. If a real <img> is later added to a
  // .work-img, the strip clones it; otherwise it shows a labelled placeholder.
  const cells = [...document.querySelectorAll('.gallery .work-img')];
  const list = cells.length ? cells : new Array(7).fill(null);
  const make = () => list.forEach(cell => {
    const d = document.createElement('div'); d.className = 'fr';
    const realImg = cell && cell.querySelector('img');
    if (realImg && realImg.getAttribute('src')) {
      const im = new Image(); im.src = realImg.getAttribute('src');
      im.setAttribute('data-fallback', '1');
      im.addEventListener('error', () => failImg(im));
      d.appendChild(im);
    } else {
      d.classList.add('fr-ph');
      const s = document.createElement('span'); s.className = 'fr-tag';
      s.textContent = (cell && cell.getAttribute('data-cat')) || 'Image';
      d.appendChild(s);
    }
    track.appendChild(d);
  });
  make(); make(); // duplicate for seamless loop
})();

/* ---------- attach fallback to existing imagery ---------- */
document.querySelectorAll('img[data-fallback], #heroImg').forEach(img => {
  img.addEventListener('error', () => failImg(img));
  if (img.complete && img.naturalWidth === 0) failImg(img);
});

/* ---------- SHOWREEL — muted background loop (loads when in view) ---------- */
(function(){
  const stage = document.getElementById('reelStage');
  if (!stage) return;
  const frame = stage.querySelector('.reel-frame');
  if (!frame || !frame.dataset.src) return;
  if (reduce) return; // respect reduced-motion: keep the static cinematic stage
  let loaded = false;
  function load(){
    if (loaded) return;
    loaded = true;
    frame.addEventListener('load', () => stage.classList.add('video-ready'));
    frame.src = frame.dataset.src; // background+muted+loop -> autoplays, no user gesture needed
  }
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { load(); obs.disconnect(); }
  }), { rootMargin: '200px 0px' });
  obs.observe(stage);
})();
})();
