/* =========================================================
   HUFF STUDIO · comportamento do portfólio
   1. montagem (cards, galeria, páginas de projeto)
   2. abertura (loader, odômetro, "Huff" voando para o menu)
   3. hero (pilha de prints)
   4. anel 3D de trabalhos
   5. frase com setores + prévia
   6. galeria, projetos, revelações, contato, cursor
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rad = d => d * Math.PI / 180;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const FINE = matchMedia('(pointer: fine)').matches;
  const P = window.PROJECTS, S = window.SECTORS, C = window.CONFIG;
  const img = (id, v = '') => `assets/img/${id}${v}.webp`;
  const pad = n => String(n).padStart(2, '0');

  /* mola simples */
  function spring(k, d, m = 1) {
    return { x: 0, v: 0, t: 0, step(dt) { const a = (-k * (this.x - this.t) - d * this.v) / m; this.v += a * dt; this.x += this.v * dt; return this.x; } };
  }

  /* ---------------- 1. MONTAGEM ---------------- */
  // pilha do hero
  const stack = $('#heroStack');
  P.forEach(p => { const f = document.createElement('figure'); f.innerHTML = `<img src="${img(p.id)}" alt="">`; stack.appendChild(f); });

  // cards do anel: 2 por projeto (12)
  const center = $('#center');
  const slots = [];
  P.forEach((p, i) => {
    [0, 1].forEach(v => {
      const sec = S[p.sector];
      const a = document.createElement(p.url ? 'a' : 'div');
      a.className = 'card';
      if (p.url) { a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.tabIndex = 0; a.dataset.go = 'p-' + p.id; }
      a.dataset.sector = p.sector;
      a.dataset.cursor = p.url ? 'Abrir' : 'Ver';
      a.setAttribute('aria-label', `${p.name}, ${sec.label.toLowerCase()}${p.url ? ' (abre em nova aba)' : ''}`);
      a.style.setProperty('--wc', sec.color); a.style.setProperty('--on', sec.on);
      const w = 294; a.style.width = w + 'px'; a.style.left = -w / 2 + 'px';
      const first = v === 0 ? img(p.id) : img(p.id, '-2');
      const second = v === 0 ? img(p.id, '-2') : img(p.id);
      a.innerHTML = `<div class="tilt"><div class="frame"></div><div class="face">
        <img src="${first}" alt="" draggable="false" loading="eager"><img class="alt" src="${second}" alt="" draggable="false" loading="lazy">
        <span class="chip"><i></i>No. ${pad(slots.length + 1)}</span>
        <span class="bar"><b>${sec.label}</b><em>${p.short}</em><i>↗</i></span>
        <span class="dim"></span></div></div>`;
      center.appendChild(a);
      slots.push({ el: a, tilt: a.firstElementChild, rx: spring(180, 24), ry: spring(180, 24), tz: spring(180, 24), hover: false, vis: true, flip: false });
    });
  });
  // intercala para não ficar o mesmo projeto lado a lado
  const order = []; for (let i = 0; i < P.length; i++) order.push(i * 2); for (let i = 0; i < P.length; i++) order.push(i * 2 + 1);
  const ring = order.map(i => slots[i]);

  // galeria (prints de celular)
  const track = $('#gTrack');
  P.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'gitem reveal'; a.style.setProperty('--d', (i * .06) + 's');
    a.href = '#p-' + p.id; a.dataset.cursor = 'Ver';
    a.innerHTML = `<span class="gitem__img"><img src="${img(p.id, '-m')}" alt="${p.name} no celular" loading="lazy"></span><h3>${p.name}</h3><p>${S[p.sector].label} · ${p.kind}</p>`;
    track.appendChild(a);
  });
  $('#gCount').textContent = pad(P.length);

  // sumário + páginas de projeto
  const toc = $('#toc'), spreads = $('#spreads');
  P.forEach((p, i) => {
    const sec = S[p.sector];
    toc.insertAdjacentHTML('beforeend', `<li><a href="#p-${p.id}"><span>${pad(i + 1)}</span><span>${p.name}</span></a></li>`);
    const el = document.createElement('article');
    el.className = 'spread' + (i % 2 ? ' rev' : '');
    el.id = 'p-' + p.id;
    el.style.setProperty('--block', p.block); el.style.setProperty('--wc', sec.color);
    const btn = p.url
      ? `<a class="btn magnetic" href="${p.url}" target="_blank" rel="noopener">Ver site ↗</a>`
      : `<span class="btn btn--off">Link em breve</span>`;
    el.innerHTML = `
      <div class="spread__visual">
        <div class="spread__shot reveal"><img src="${img(p.id)}" alt="Tela inicial do site ${p.name}" loading="lazy"><img class="alt" src="${img(p.id, '-2')}" alt="" loading="lazy"></div>
        <div class="spread__phone reveal" style="--d:.15s"><img src="${img(p.id, '-m')}" alt="" loading="lazy"></div>
        <span class="spread__num" aria-hidden="true">${pad(i + 1)}</span>
      </div>
      <div class="spread__text">
        <p class="spread__kind"><i></i>${sec.label} · ${p.kind}</p>
        <h3 class="spread__title split">${p.name.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</h3>
        <p class="spread__desc reveal">${p.desc}</p>
        <ul class="feat reveal" style="--d:.1s">${p.features.map((f, j) => `<li><span>${pad(j + 1)}</span>${f}</li>`).join('')}</ul>
        <div class="spread__foot reveal" style="--d:.2s"><span class="pal" aria-label="Paleta do site">${p.palette.map(c => `<i style="--c:${c}"></i>`).join('')}</span>${btn}</div>
      </div>`;
    spreads.appendChild(el);
  });

  // motes
  const motes = $('#motes');
  [[8,62,10,14,-2],[18,40,6,18,-9],[27,70,14,16,-5],[36,52,8,20,-13],[44,30,5,17,-3],[53,66,12,15,-11],[61,44,7,19,-7],[69,74,16,14,-1],[77,36,6,21,-15],[85,58,11,16,-8],[92,46,7,18,-4],[13,82,9,22,-17],[48,84,13,17,-6],[72,22,5,23,-19]]
    .forEach(([l, t, s, d, dl]) => { const m = document.createElement('i'); m.className = 'mote'; m.style.cssText = `left:${l}%;top:${t}%;width:${s}px;height:${s}px;--t:${d}s;--dl:${dl}s`; motes.appendChild(m); });

  // divide palavras: .w ganha span interno; texto solto da frase vira .w.tw
  function wrapW(root) { $$('.w', root).forEach(w => { if (!w.firstElementChild || w.firstElementChild.tagName !== 'SPAN' || w.children.length !== 1 || w.firstElementChild.className) { w.innerHTML = `<span>${w.innerHTML}</span>`; } }); }
  const sentence = $('#sentence');
  (function splitSentence() {
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3 && n.textContent.trim()) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = 'w' + (node === sentence ? ' tw' : '');
            s.innerHTML = `<span>${part}</span>`; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.classList.contains('cw')) walk(n);
      });
    };
    walk(sentence);
    $$('.choice', sentence).forEach(c => walk(c));
  })();
  wrapW(document);
  // atrasos em cascata por bloco
  function stagger(root, base, step) { $$('.w>span', root).forEach((s, i) => s.style.setProperty('--d', (base + i * step) + 's')); }
  stagger(sentence, .05, .035);
  $$('.split, .studio__title, .display, .hero__title').forEach(h => stagger(h, h.classList.contains('hero__title') ? 0 : .05, .07));

  /* ---------------- 2. ABERTURA ---------------- */
  const loader = $('#loader');
  const odoDigits = $('#odoDigits');
  const cols = [0, 1, 2].map(() => { const c = document.createElement('span'); c.className = 'odo__col'; c.innerHTML = '<span>' + Array.from({ length: 10 }, (_, i) => `<i>${i}</i>`).join('') + '</span>'; odoDigits.appendChild(c); return c; });
  function setOdo(v) {
    v = Math.round(clamp(v, 0, 100)); const s = String(v).padStart(3, '0');
    cols.forEach((c, i) => { c.firstChild.style.transform = `translateY(${-s[i] * 10}%)`; c.classList.toggle('hide', i < 3 - String(v).length); });
  }
  setOdo(0);
  let shown = 0, target = 0, tweenFrom = 0, tweenT0 = 0;
  function tweenOdo(now) {
    const k = clamp((now - tweenT0) / 650, 0, 1), e = 1 - Math.pow(1 - k, 3);
    const v = tweenFrom + (target - tweenFrom) * e;
    if (Math.round(v) !== Math.round(shown)) setOdo(v);
    shown = v; if (k < 1) requestAnimationFrame(tweenOdo);
  }
  function bump(v) { tweenFrom = shown; target = v; tweenT0 = performance.now(); requestAnimationFrame(tweenOdo); }

  let revealed = false;
  const hero = $('.hero');
  function enterHero(delay) { setTimeout(() => hero.classList.add('in'), delay); }

  function finish(instant) {
    if (revealed) return; revealed = true;
    document.removeEventListener('keydown', onKey);
    const wm = $('#wmFirst');
    if (instant || RM.matches) {
      loader.remove(); document.body.classList.remove('is-loading'); enterHero(0); return;
    }
    loader.classList.add('done');
    // "Huff" voa para o menu
    const src = $('.lm>span', loader).getBoundingClientRect();
    const fsA = parseFloat(getComputedStyle($('#loaderName')).fontSize);
    const fly = document.createElement('div'); fly.className = 'flyer';
    fly.innerHTML = '<span>Huff</span><span class="dot" style="color:var(--terra)">.</span>';
    fly.style.cssText = `left:${src.left}px;top:${src.top}px;font-size:${fsA}px;`;
    document.body.appendChild(fly);
    setTimeout(() => loader.classList.add('out'), 250);
    requestAnimationFrame(() => {
      const t = wm.getBoundingClientRect();
      const fsB = parseFloat(getComputedStyle(wm).fontSize);
      const sc = fsB / fsA;
      const dy = t.top - src.top + (fsB * 1 - fsB * .95) / 2;
      fly.style.transition = 'transform 1.3s cubic-bezier(.65,0,.35,1)';
      fly.style.transform = `translate(${t.left - src.left}px, ${dy}px) scale(${sc})`;
      fly.querySelector('.dot').style.opacity = '0';
    });
    enterHero(500);
    setTimeout(() => { document.body.classList.remove('is-loading'); fly.remove(); }, 1350);
    setTimeout(() => loader.remove(), 1400);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Tab') finish(true); }

  if (RM.matches || location.hash.length > 1) {
    finish(true);
  } else {
    document.addEventListener('keydown', onKey);
    $('#skip').addEventListener('click', () => finish(true));
    requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('go')));
    // legenda digitada
    const cap = 'CARREGANDO PROJETOS', capEl = $('#loaderCaption');
    let ci = 0; setTimeout(function type() { capEl.textContent = cap.slice(0, ++ci); if (ci < cap.length) setTimeout(type, 45); }, 350);
    // pré-carrega os prints
    const urls = [...new Set(P.flatMap(p => [img(p.id), img(p.id, '-2')]))];
    let loaded = 0; const t0 = performance.now();
    const tick = () => { loaded++; bump(loaded / urls.length * 100); if (loaded === urls.length) ready(); };
    urls.forEach(u => { const im = new Image(); im.onload = im.onerror = tick; im.src = u; });
    setTimeout(() => { if (!revealed) { bump(100); ready(); } }, 8000);
    function ready() { const wait = Math.max(0, 2300 - (performance.now() - t0)); setTimeout(() => finish(false), wait + 700); }
  }

  /* ---------------- 3. HERO: pilha de prints ---------------- */
  const figs = $$('figure', stack);
  let topIdx = 0;
  const POS = [
    'translate(0,0) rotate(-4deg)',
    'translate(9%,-8%) rotate(5deg) scale(.95)',
    'translate(17%,-15%) rotate(11deg) scale(.9)'
  ];
  function layoutStack() {
    figs.forEach((f, i) => {
      const k = (i - topIdx + figs.length) % figs.length;
      f.style.zIndex = 10 - k;
      if (k < 3) { f.style.transform = POS[k]; f.style.opacity = 1; f.style.filter = `brightness(${1 - k * .18})`; }
      else { f.style.transform = 'translate(26%,-20%) rotate(16deg) scale(.85)'; f.style.opacity = 0; }
    });
  }
  layoutStack();
  if (!RM.matches) setInterval(() => { if (document.hidden) return; topIdx = (topIdx + 1) % figs.length; layoutStack(); }, 2600);
  if (FINE && !RM.matches) {
    const hx = spring(40, 18), hy = spring(40, 18);
    addEventListener('pointermove', e => { hx.t = e.clientX / innerWidth - .5; hy.t = e.clientY / innerHeight - .5; }, { passive: true });
    let last = performance.now();
    (function heroLoop(now) {
      requestAnimationFrame(heroLoop);
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (scrollY > innerHeight) return;
      hx.step(dt); hy.step(dt);
      stack.style.translate = `${hx.x * -40}px ${hy.x * -26}px`;
      stack.style.rotate = `${hx.x * 4}deg`;
    })(last);
  }

  /* ---------------- 4. ANEL 3D ---------------- */
  const ringSec = $('#trabalhos'), world = $('#world'), wall = $('#wall'), lens = $('#lens');
  const N = ring.length;
  let wallScale = 1.1, fit = 1;
  function measure() {
    const phone = innerWidth <= 820;
    wallScale = phone ? 1.15 : (innerHeight <= 760 ? .9 : 1.1);
    fit = Math.min(1.05, (innerWidth - 32) / 1240, .66 * innerHeight / 800) / wallScale;
  }
  measure(); addEventListener('resize', measure);

  const rot = spring(150, 27); // rotação exibida segue o alvo
  let formation = 0, formStart = -1, entered = false, E = 1, hoverCount = 0, lastY = scrollY;
  let dragging = false, focusInside = false;

  new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting && formStart < 0) {
        formStart = performance.now();
        setTimeout(() => { ringSec.classList.add('entered'); entered = true; countStats(); }, RM.matches ? 0 : 500);
      }
    });
  }, { threshold: .3 }).observe(world);

  function countStats() {
    $$('.stats .num').forEach(n => {
      const to = +n.dataset.to, t0 = performance.now();
      if (RM.matches) return;
      (function f(now) { const k = clamp((now - t0) / 1400, 0, 1), e = 1 - Math.pow(1 - k, 3); const v = Math.round(to * e); n.textContent = to >= 100 ? v : pad(v); if (k < 1) requestAnimationFrame(f); })(t0);
    });
  }

  ring.forEach(s => {
    s.el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { s.hover = true; hoverCount++; } });
    s.el.addEventListener('pointerleave', e => { if (s.hover) { s.hover = false; hoverCount--; } s.rx.t = s.ry.t = s.tz.t = 0; });
    s.el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || dragging) return;
      const r = s.el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      s.rx.t = -20 * y; s.ry.t = 24 * x; s.tz.t = 45;
    });
    if (s.el.dataset.go) s.el.addEventListener('click', () => { if (!justDragged()) document.getElementById(s.el.dataset.go).scrollIntoView({ behavior: 'smooth' }); });
  });

  // arrastar
  let dStart = 0, mStart = 0, moved = false, dragEnd = 0, pid = null, dStartY = 0, axis = null;
  const justDragged = () => performance.now() - dragEnd < 60;
  wall.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    pid = e.pointerId; dStart = e.clientX; dStartY = e.clientY; mStart = rot.t; moved = false; axis = e.pointerType === 'mouse' ? 'x' : null;
  });
  addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - dStart, dy = e.clientY - dStartY;
    if (!axis) { if (Math.abs(dx) > 6 || Math.abs(dy) > 6) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; else return; }
    if (axis === 'y') return; // deixa o celular rolar a página
    if (!moved && Math.abs(dx) > 4) { moved = true; dragging = true; wall.classList.add('dragging'); try { wall.setPointerCapture(pid); } catch (_) {} }
    if (moved) rot.t = mStart + .2 * dx;
  });
  const endDrag = e => { if (e.pointerId !== pid) return; if (moved) dragEnd = performance.now(); pid = null; dragging = false; wall.classList.remove('dragging'); };
  addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);
  wall.addEventListener('click', e => { if (justDragged()) { e.preventDefault(); e.stopPropagation(); } }, true);
  wall.addEventListener('focusin', () => focusInside = true);
  wall.addEventListener('focusout', () => focusInside = false);
  wall.addEventListener('keydown', e => { if (e.key === 'ArrowRight') rot.t -= 360 / N; if (e.key === 'ArrowLeft') rot.t += 360 / N; });

  let lastT = performance.now();
  function ringFrame(now) {
    requestAnimationFrame(ringFrame);
    const dtms = Math.min(50, now - lastT); lastT = now;
    const k = Math.min(3, dtms / 16.67), dt = dtms / 1000;
    const r = ringSec.getBoundingClientRect(), vh = innerHeight;
    const dy = scrollY - lastY; lastY = scrollY;
    if (r.bottom < 0 || r.top > vh) return;

    // abertura do anel pela rolagem
    const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    const raw = clamp((p + .02) / .3, 0, 1);
    const e = RM.matches ? 1 : raw * raw * (3 - 2 * raw);
    if (formStart >= 0) formation = RM.matches ? 1 : clamp((now - formStart) / 2200, 0, 1);
    const done = e > .985 && formation >= 1;

    // rotação
    E += ((hoverCount > 0 ? .2 : 1) - E) * Math.min(1, .08 * k);
    if (!dragging && !focusInside && !RM.matches && formation > 0) rot.t += .3 * (.4 + .6 * e) * E * k;
    if (Math.abs(dy) < 400 && p > 0 && p < 1) rot.t += dy * .06; // rolar também gira
    if (RM.matches) rot.x = rot.t; else rot.step(dt);
    const g = rot.x;

    // câmera
    const tilt = -22 * (1 - e), radius = 460 + 1340 * e, persp = 1000 - 240 * e, roll = -20 * (1 - e);
    const cs = .52 + 1.78 * e * e;
    const anchor = -radius * Math.sin(rad(tilt)) + 460 * Math.sin(rad(-22)) * (1 - e);
    const isc = fit + (1 - fit) * e, A = wallScale * isc;
    center.style.transform = `translate(${160 * Math.sin(rad(roll)) * A}px, ${anchor * A}px) rotateZ(${roll}deg) rotateX(${tilt}deg) scale3d(${A},${A},${A})`;
    lens.style.perspective = (persp * A) + 'px';

    const ct = Math.cos(rad(tilt));
    for (let i = 0; i < N; i++) {
      const s = ring[i];
      const ang = ((((360 * i / N + g + 180) % 360) + 360) % 360) - 180;
      const n = ang + 180, a = n / 360;
      const ii = clamp((formation - .7 * a) / .3, 0, 1), sm = 1 - Math.pow(1 - ii, 3);
      const l = -180 + n * sm, c = radius - (1 - sm) * a * 24;
      const x = -Math.sin(rad(l)) * c, z = -Math.cos(rad(l)) * c;
      const appear = Math.min(1, 2.5 * ii);
      const hide = z * ct >= persp - 70 || (done && Math.abs(ang) > 100) || appear <= 0;
      if (hide !== !s.vis) { s.vis = !hide; s.el.classList.toggle('off', hide); }
      if (hide) continue;
      const flip = z > radius * radius / persp;
      if (flip !== s.flip) { s.flip = flip; s.el.classList.toggle('flip', flip); }
      s.el.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${l}deg) scale(${cs})`;
      s.el.style.opacity = appear;
      if (s.hover || Math.abs(s.rx.x) > .01 || Math.abs(s.tz.x) > .05) {
        s.rx.step(dt); s.ry.step(dt); s.tz.step(dt);
        s.tilt.style.transform = `translateZ(${s.tz.x}px) rotateX(${s.rx.x}deg) rotateY(${s.ry.x}deg)`;
      }
    }
  }
  requestAnimationFrame(ringFrame);

  /* ---------------- 5. FRASE + PRÉVIA ---------------- */
  const prev = $('#preview'), pCard = $('#previewCard'), pMedia = $('#previewMedia'), pLabel = $('#previewLabel'), pBlurb = $('#previewBlurb');
  const px = spring(260, 28, .6), py = spring(260, 28, .6);
  let pOn = false, flipX = false, flipY = false, pLast = performance.now();
  $$('.choice', sentence).forEach(ch => {
    const sec = S[ch.dataset.sector];
    ch.style.setProperty('--wc', sec.color); ch.style.setProperty('--on', sec.on);
    const firstP = P.find(p => p.sector === ch.dataset.sector);
    ch.href = '#p-' + firstP.id;
    const on = () => {
      if (!entered) return;
      $$('.choice', sentence).forEach(c => c.classList.toggle('active', c === ch));
      sentence.classList.add('hovering');
      world.dataset.focus = ch.dataset.sector;
      ring.forEach(s => s.el.toggleAttribute('data-match', s.el.dataset.sector === ch.dataset.sector));
      pCard.style.setProperty('--wc', sec.color);
      pMedia.style.backgroundImage = `url(${img(firstP.id)})`;
      pLabel.textContent = `${sec.label} · ${firstP.short.toUpperCase()}`;
      pBlurb.textContent = sec.blurb;
    };
    const off = () => {
      ch.classList.remove('active'); sentence.classList.remove('hovering');
      delete world.dataset.focus; prev.classList.remove('on'); pOn = false;
    };
    ch.addEventListener('pointerenter', e => { on(); if (e.pointerType === 'mouse' && entered) { prev.classList.add('on'); if (!pOn) { px.x = px.t = e.clientX; py.x = py.t = e.clientY; } pOn = true; } });
    ch.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') off(); });
    ch.addEventListener('click', e => {
      if (!FINE && !ch.classList.contains('active')) { e.preventDefault(); on(); }
    });
  });
  addEventListener('pointermove', e => { px.t = e.clientX; py.t = e.clientY; }, { passive: true });
  (function prevLoop(now) {
    requestAnimationFrame(prevLoop);
    const dt = Math.min(.05, (now - pLast) / 1000); pLast = now;
    if (!pOn) return;
    const x = px.step(dt), y = py.step(dt), W = 260, H = pCard.offsetHeight || 220, M = 12, HY = 24;
    if (!flipY && y - 22 - H < M) flipY = true; else if (flipY && y - 22 - H > M + HY) flipY = false;
    if (!flipX && x + 18 + W > innerWidth - M) flipX = true; else if (flipX && x + 18 + W < innerWidth - M - HY) flipX = false;
    let L = flipX ? x - 18 - W : x + 18, T = flipY ? y + 22 : y - 22 - H;
    L = clamp(L, M, innerWidth - W - M); T = clamp(T, M, innerHeight - H - M);
    pCard.style.left = L + 'px'; pCard.style.top = T + 'px';
    pCard.style.transformOrigin = `${flipX ? 'right' : 'left'} ${flipY ? 'top' : 'bottom'}`;
  })(pLast);

  /* ---------------- 6. GALERIA, PROJETOS, REVELAÇÕES ---------------- */
  const step = () => (track.firstElementChild.getBoundingClientRect().width + 20);
  $('#gPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#gNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .split, .studio__title, .display').forEach(el => io.observe(el));

  // leve parallax nas páginas de projeto
  const spreadEls = $$('.spread');
  if (!RM.matches) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        spreadEls.forEach(sp => {
          const r = sp.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
          const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          sp.style.setProperty('--py', (c * -24).toFixed(1) + 'px');
          sp.style.setProperty('--py2', (c * -60).toFixed(1) + 'px');
        });
      });
    }, { passive: true });
  }

  // menu: item atual
  const navLinks = $$('.nav__links a');
  const secIO = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['trabalhos', 'projetos', 'estudio', 'contato'].forEach(id => secIO.observe(document.getElementById(id)));

  /* ---------------- CONTATO ---------------- */
  $('#mailShow').textContent = C.email.toUpperCase();
  $('#footCity').textContent = C.city;
  $('#heroYear').textContent = '©' + C.year;
  const whenBtns = $$('.when button');
  whenBtns.forEach(b => b.addEventListener('click', () => whenBtns.forEach(o => o.setAttribute('aria-checked', o === b))));
  function compose() {
    const who = $('#bWho').value.trim() || $('#bWho').placeholder;
    const what = $('#bWhat').value.trim() || $('#bWhat').placeholder;
    const when = ($('.when [aria-checked=true]') || whenBtns[0]).dataset.v;
    return `Olá, Huff Studio! Sou da ${who}, preciso de ${what} e quero no ar ${when}. Podemos conversar?`;
  }
  const ok = $('#bOk');
  function flash(t) { ok.textContent = t; clearTimeout(flash.t); flash.t = setTimeout(() => ok.textContent = '', 1800); }
  $('#bCopy').addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(compose()).then(() => flash('Mensagem copiada'), () => flash('Não foi possível copiar')); });
  $('#brief').addEventListener('submit', e => {
    e.preventDefault();
    location.href = `mailto:${C.email}?subject=${encodeURIComponent('Novo projeto')}&body=${encodeURIComponent(compose())}`;
  });
  // campos crescem com o texto
  $$('.brief input').forEach(inp => { const f = () => inp.size = Math.max(inp.placeholder.length - 2, inp.value.length + 1); f(); inp.addEventListener('input', f); });

  /* ---------------- CURSOR + MAGNÉTICOS ---------------- */
  if (FINE) {
    const cur = $('#cursor'), lab = $('#cursorLabel');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    (function cl() { requestAnimationFrame(cl); cx += (tx - cx) * .35; cy += (ty - cy) * .35; cur.style.transform = `translate(${cx}px,${cy}px)`; })();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('big', !!t); if (t) lab.textContent = t.dataset.cursor;
    });
    document.addEventListener('pointerdown', () => cur.classList.remove('big'));
    document.addEventListener('pointerover', e => {
      const m = e.target.closest('.magnetic'); if (!m || m.__mag) return; m.__mag = true;
      m.addEventListener('pointermove', ev => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * .3}px,${(ev.clientY - r.top - r.height / 2) * .4}px)`; });
      m.addEventListener('pointerleave', () => m.style.transform = '');
    });
  }
})();
