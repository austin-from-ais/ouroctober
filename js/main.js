/* The memories are separate scenes she clicks or taps between. Then October and the visit, as pages. */
(function () {
  var S = window.SITE || {};
  var P = window.SITE_PRIVATE || {};
  var SCENES = window.SCENES || {};
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  if (S.title) document.title = S.title;
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  /* ---- storage that may not exist ----------------------------------- */
  var store = {
    get: function (k) { try { return localStorage.getItem('annika.' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('annika.' + k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem('annika.' + k); } catch (e) {} }
  };

  /* ---- dates, all in Pacific time ----------------------------------- */
  function today() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return Date.UTC(+o.year, +o.month - 1, +o.day);
    } catch (e) { var d = new Date(); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  }
  function parseDay(s) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '').trim()); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null; }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?/.exec(String(s || '').trim());
    if (!m) return '';
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    var out = DAYS[d.getUTCDay()] + ', ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate();
    if (m[4] != null) {
      var hh = +m[4], mm = m[5], ap = hh >= 12 ? 'pm' : 'am'; hh = hh % 12 || 12;
      out += ', ' + hh + (mm === '00' ? '' : ':' + mm) + ' ' + ap + ' Pacific';
    }
    return out;
  }
  function nightsLeft() {
    var a = parseDay(S.arrivalDate); if (a == null) return null;
    return Math.round((a - today()) / 864e5);
  }

  var env = {
    settings: S, priv: P, reduced: reduced, sound: window.SOUND, store: store,
    today: today, parseDay: parseDay, fmtDate: fmtDate, nightsLeft: nightsLeft,
    songStarted: function () { window.SOUND.duck(true); }
  };

  /* ---- a sky of tiny pink stars along the top of the screen ---------- */
  // same sky every load (seeded), each star twinkling on its own cycle in CSS
  function makeStars() {
    var sky = document.createElement('div'); sky.className = 'sky'; sky.setAttribute('aria-hidden', 'true');
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < 42; i++) {
      var st = document.createElement('i');
      var size = 1 + rnd() * 1.8;
      st.style.left = (1.5 + rnd() * 97).toFixed(2) + '%';
      st.style.top = (4 + rnd() * 92).toFixed(2) + '%';   // of the band, which is the top fifth of the screen
      st.style.width = st.style.height = size.toFixed(2) + 'px';
      st.style.animationDuration = (1.8 + rnd() * 3.2).toFixed(2) + 's';
      st.style.animationDelay = (-rnd() * 5).toFixed(2) + 's';
      sky.appendChild(st);
    }
    deck.appendChild(sky);
    return sky;
  }

  /* ---- soap bubbles drifting up through the dark around the card ------ */
  function makeBubbles() {
    var layer = document.createElement('div'); layer.className = 'bubbles'; layer.setAttribute('aria-hidden', 'true');
    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < 18; i++) {
      var b = document.createElement('i'), size = 3 + rnd() * rnd() * 9;   // 3 to 12 px, mostly small
      b.style.left = (2 + rnd() * 96).toFixed(2) + '%';
      b.style.width = b.style.height = size.toFixed(1) + 'px';
      b.style.animationDuration = (9 + rnd() * 10).toFixed(2) + 's';         // the rise through the band above the card
      b.style.animationDelay = (-rnd() * 19).toFixed(2) + 's';               // so the air is already full of them
      var sway = document.createElement('b');
      sway.style.animationDuration = (2.6 + rnd() * 2.8).toFixed(2) + 's';   // the sideways wobble
      sway.style.animationDelay = (-rnd() * 5).toFixed(2) + 's';
      b.appendChild(sway);
      layer.appendChild(b);
    }
    deck.appendChild(layer);
    return layer;
  }

  /* ---- soft dots swirling slowly above the card, like jellyfish -------- */
  function makeDots() {
    var layer = document.createElement('div'); layer.className = 'dots'; layer.setAttribute('aria-hidden', 'true');
    var seed = 23;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < 30; i++) {
      var d = document.createElement('i'), size = 2 + rnd() * 2.5;
      d.style.left = (3 + rnd() * 94).toFixed(2) + '%';
      d.style.top = (8 + rnd() * 84).toFixed(2) + '%';
      d.style.width = d.style.height = size.toFixed(2) + 'px';
      d.style.setProperty('--dx', ((rnd() - 0.5) * 90).toFixed(1) + 'px');   // how far the slow wander goes
      d.style.setProperty('--dy', ((rnd() - 0.5) * 40).toFixed(1) + 'px');
      d.style.setProperty('--r', (6 + rnd() * 14).toFixed(1) + 'px');        // radius of the little circling
      d.style.animationDuration = (16 + rnd() * 14).toFixed(2) + 's';         // the wander and the pulse
      d.style.animationDelay = (-rnd() * 30).toFixed(2) + 's';
      var b = document.createElement('b');
      b.style.animationDuration = (7 + rnd() * 8).toFixed(2) + 's';           // the circling
      b.style.animationDelay = (-rnd() * 15).toFixed(2) + 's';
      if (rnd() < 0.5) b.style.animationDirection = 'reverse';
      d.appendChild(b);
      layer.appendChild(d);
    }
    deck.appendChild(layer);
    return layer;
  }

  /* ---- a street lamp: a pale pink cone down the screen, behind the card -- */
  function makeLamp() {
    var layer = document.createElement('div'); layer.className = 'lamp'; layer.setAttribute('aria-hidden', 'true');
    var cone = document.createElement('i'); cone.className = 'cone'; layer.appendChild(cone);
    var head = document.createElement('i'); head.className = 'head'; layer.appendChild(head);
    deck.appendChild(layer);
    return layer;
  }

  /* ---- leaves blowing across the top of the screen --------------------- */
  function makeLeaves() {
    var layer = document.createElement('div'); layer.className = 'leaves'; layer.setAttribute('aria-hidden', 'true');
    var seed = 31;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < 16; i++) {
      var l = document.createElement('i'), w = 5 + rnd() * 6;
      l.style.top = (6 + rnd() * 84).toFixed(2) + '%';
      l.style.width = w.toFixed(2) + 'px'; l.style.height = (w * 0.55).toFixed(2) + 'px';
      l.style.setProperty('--bob', (6 + rnd() * 16).toFixed(1) + 'px');     // how much it lifts and dips on the way
      l.style.animationDuration = (9 + rnd() * 11).toFixed(2) + 's';         // the crossing
      l.style.animationDelay = (-rnd() * 20).toFixed(2) + 's';
      var b = document.createElement('b');
      b.style.animationDuration = (1.6 + rnd() * 2.2).toFixed(2) + 's';      // the tumble
      b.style.animationDelay = (-rnd() * 4).toFixed(2) + 's';
      b.style.opacity = (0.45 + rnd() * 0.4).toFixed(2);
      l.appendChild(b);
      layer.appendChild(l);
    }
    deck.appendChild(layer);
    return layer;
  }

  /* ---- strings of lights: sagging wires across the top, bulbs glowing softly ---- */
  function makeLights() {
    var layer = document.createElement('div'); layer.className = 'lights'; layer.setAttribute('aria-hidden', 'true');
    var seed = 53;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    // each string is a curve from the left edge to the right, sagging in the middle; x and y are percent of the band
    var strings = [
      { x0: -3, y0: 22, x1: 103, y1: 16, sag: 58, bulbs: 15 },
      { x0: -3, y0: 54, x1: 103, y1: 62, sag: 92, bulbs: 13 }
    ];
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
    strings.forEach(function (w) {
      var cx = (w.x0 + w.x1) / 2, cy = w.sag * 2 - (w.y0 + w.y1) / 2;   // control point so the curve's lowest point is at 'sag'
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M' + w.x0 + ' ' + w.y0 + ' Q' + cx + ' ' + cy + ' ' + w.x1 + ' ' + w.y1);
      svg.appendChild(path);
      for (var i = 0; i < w.bulbs; i++) {
        var t = (i + 0.5 + (rnd() - 0.5) * 0.2) / w.bulbs, u = 1 - t;
        var x = u * u * w.x0 + 2 * u * t * cx + t * t * w.x1, y = u * u * w.y0 + 2 * u * t * cy + t * t * w.y1;
        var bulb = document.createElement('i');
        bulb.style.left = x.toFixed(2) + '%'; bulb.style.top = y.toFixed(2) + '%';
        bulb.style.animationDuration = (2.8 + rnd() * 3.6).toFixed(2) + 's';
        bulb.style.animationDelay = (-rnd() * 6).toFixed(2) + 's';
        layer.appendChild(bulb);
      }
    });
    layer.insertBefore(svg, layer.firstChild);
    deck.appendChild(layer);
    return layer;
  }

  /* ---- build the scenes ---------------------------------------------- */
  var deck = document.getElementById('deck');
  var pages = document.getElementById('pages');
  var order = (S.scenes || []).filter(function (id) { return SCENES[id]; });
  var scenes = [];
  order.forEach(function (id) {
    var def = SCENES[id];
    var stage = document.createElement('div'); stage.className = 'stage'; stage.id = 'scene-' + id; stage.dataset.scene = id;
    deck.appendChild(stage);
    var handle = def.mount(stage, env);
    // the caption sits under the card and fades with it; lines come from settings.captions
    var cap = null, lines = ((S.captions || {})[id] || []).filter(function (l) { return String(l || '').trim(); });
    if (lines.length) {
      cap = document.createElement('div'); cap.className = 'caption';
      lines.forEach(function (l, k) { var p = document.createElement('span'); p.className = k ? 'l2' : 'l1'; p.textContent = l; cap.appendChild(p); });
      deck.appendChild(cap);
    }
    var sky = def.stars ? makeStars() : def.bubbles ? makeBubbles() : def.dots ? makeDots() : def.lamp ? makeLamp() : def.leaves ? makeLeaves() : def.lights ? makeLights() : null;   // a layer that fades with the card
    // a memory behind the card: a prompt on the drawing, and the text over it once tapped
    var memory = String((S.memories || {})[id] || '').trim();
    if (memory) {
      var prompt = document.createElement('span'); prompt.className = 'prompt';
      prompt.textContent = S.clickPrompt == null ? '[click me]' : S.clickPrompt;
      stage.appendChild(prompt);
      var box = document.createElement('div'); box.className = 'memory';
      memory.split(/\n\s*\n/).forEach(function (para) { var p = document.createElement('p'); p.textContent = para.replace(/\s*\n\s*/g, ' '); box.appendChild(p); });
      stage.appendChild(box);
    }
    scenes.push({ id: id, stage: stage, cap: cap, sky: sky, memory: !!memory, open: false, handle: handle, duration: def.duration || 0, started: 0, leavingUntil: 0 });
  });
  window.renderAfter(env);

  /* ---- showing one scene at a time ----------------------------------- */
  var cur = -1, mode = 'deck', soundTimer = null;
  var prevBtn = document.getElementById('prevBtn'), nextBtn = document.getElementById('nextBtn');
  var FADE = reduced ? 0 : 1400;

  function cardSize() { return Math.round(Math.min(window.innerWidth * 0.8, window.innerHeight * 0.74, 920)); }
  // cover flow, animated here frame by frame: each card has a position (0 = front, -1/+1 = the
  // neighbours, further = out of sight), and its stacking order follows that position exactly.
  var anim = null;
  function place(s, pos, card) {
    var ad = Math.abs(pos), sg = pos < 0 ? -1 : 1, t = Math.min(1, ad);
    // neighbours: 0.9 card widths out, a full card width back, turned 50 degrees, at 0.6 scale.
    // at these numbers two sliding cards keep a gap at the midpoint on every screen size
    s.stage.style.transform = 'translateX(' + (sg * card * 0.9 * t) + 'px) translateZ(' + (-card * t) + 'px) rotateY(' + (-sg * 50 * t) + 'deg) scale(' + (1 - 0.4 * t) + ')';
    // the veil darkens to 0.64 over the first position, then on to full black over the second,
    // so a card leaving the flow fades out (and one coming back fades in) before it is hidden
    var veil = ad <= 1 ? 0.64 * t : 0.64 + 0.36 * Math.min(1, ad - 1);
    s.stage.style.setProperty('--veil', veil.toFixed(3));
    s.stage.style.zIndex = String(Math.round(1000 - ad * 100));
    s.stage.classList.toggle('far', veil >= 0.995);
    // the caption and the stars are only there while their card is (nearly) in front
    var vis = Math.max(0, 1 - 2.5 * ad);
    if (s.cap) {
      s.cap.style.opacity = vis.toFixed(3);
      s.cap.style.transform = 'translateY(' + (10 * (1 - vis)).toFixed(1) + 'px)';
      s.cap.style.visibility = vis > 0 ? 'visible' : 'hidden';
    }
    if (s.sky) { s.sky.style.opacity = vis.toFixed(3); s.sky.style.visibility = vis > 0 ? 'visible' : 'hidden'; }
  }
  function layout() {
    var card = cardSize(), now = performance.now();
    deck.style.setProperty('--card', card + 'px');
    scenes.forEach(function (s, i) {
      if (s.pos == null) s.pos = i - cur;
      s.from = s.pos; s.to = i - cur;
      s.stage.classList.toggle('on', i === cur);
    });
    // a move that interrupts another starts at speed, so fast clicking never stalls the cards
    anim = { start: now, card: card, retarget: !!anim };
    if (FADE === 0) stepAnim(now); else wake();
  }
  function stepAnim(now) {
    if (!anim) return;
    var k = FADE ? Math.min(1, (now - anim.start) / FADE) : 1;
    var e = anim.retarget ? 1 - Math.pow(1 - k, 3) : (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    scenes.forEach(function (s) { s.pos = s.from + (s.to - s.from) * e; place(s, s.pos, anim.card); });
    if (k >= 1) anim = null;
  }

  function setOpen(s, open) {
    s.open = !!open;
    s.stage.classList.toggle('open', s.open);
  }
  function toggleMemory() { if (mode === 'deck' && cur >= 0 && scenes[cur].memory) setOpen(scenes[cur], !scenes[cur].open); }

  function show(i, offsetMs) {
    i = Math.max(0, Math.min(scenes.length - 1, i));
    var now = performance.now();
    if (cur >= 0 && cur !== i) { scenes[cur].leavingUntil = now + FADE; setOpen(scenes[cur], false); }
    cur = i;
    var s = scenes[i];
    s.started = now - (offsetMs || 0);
    layout();
    // the effect layer of the card in front is 'lit'; re-adding the class restarts its turn-on animation
    scenes.forEach(function (o, k) {
      if (!o.sky) return;
      o.sky.classList.remove('lit');
      if (k === i) { void o.sky.offsetWidth; o.sky.classList.add('lit'); }
    });
    // the ambience follows once the clicking settles, so a burst of clicks builds one voice, not ten
    clearTimeout(soundTimer);
    soundTimer = setTimeout(function () { if (mode === 'deck' && cur >= 0) window.SOUND.scene(scenes[cur].id); }, 250);
    prevBtn.hidden = (i === 0);
    nextBtn.hidden = false;
    store.set('place', JSON.stringify({ mode: 'deck', id: s.id }));
  }

  // switching between the gallery and the pages: whatever is showing fades to black first, then the other
  // side appears and fades up. nothing is ever on screen half-faded over something else.
  var SWAP = reduced ? 0 : 1300, swapTimer = null;
  function enterDeck(i, offsetMs) {
    mode = 'deck';
    setNav('road');
    clearTimeout(swapTimer);
    var target = i == null ? Math.max(0, cur) : i;
    if (!deck.hidden) { deck.classList.remove('out'); show(target, offsetMs); return; }   // still (or again) on the deck
    pages.classList.add('out');
    swapTimer = setTimeout(function () {
      if (mode !== 'deck') return;
      pages.hidden = true; pages.classList.remove('out');
      document.body.classList.remove('pages');
      window.scrollTo(0, 0);
      deck.hidden = false; deck.classList.add('out'); void deck.offsetWidth; deck.classList.remove('out');   // up from black
      show(target, offsetMs);
    }, SWAP);
  }

  function enterPages(id) {
    mode = 'pages';
    clearTimeout(soundTimer);
    window.SOUND.scene(null);
    clearTimeout(swapTimer);
    prevBtn.hidden = true; nextBtn.hidden = true;
    setNav(id === 'visit' ? 'visit' : 'october');
    store.set('place', JSON.stringify({ mode: 'pages', id: id }));
    function reveal() {
      deck.hidden = true;
      var first = pages.hidden;
      document.body.classList.add('pages');
      pages.hidden = false; pages.classList.remove('out');
      var el = document.getElementById(id === 'visit' && !document.getElementById('visit').hidden ? 'visit' : 'october');
      if (first || reduced) window.scrollTo(0, el.offsetTop); else window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      setNav(el.id);
    }
    if (deck.hidden) { reveal(); return; }   // already on the pages: just go to the section
    deck.classList.add('out');
    swapTimer = setTimeout(function () { if (mode === 'pages') reveal(); }, SWAP);
  }

  // every press counts, but two events closer than a few frames are one press (a double-fired
  // tap, a bounce), and a held key steps at a pace she can follow
  var lastNav = 0;
  function allow(held) {
    var now = performance.now();
    if (now - lastNav < (held ? 350 : 80)) return false;
    lastNav = now; return true;
  }
  function next(held) {
    if (mode !== 'deck' || !allow(held)) return;
    if (cur < scenes.length - 1) show(cur + 1); else enterPages('october');
  }
  function prev(held) { if (mode === 'deck' && cur > 0 && allow(held)) show(cur - 1); }

  /* ---- rendering ------------------------------------------------------ */
  var t0 = performance.now();
  // the frame loop runs only while cards are moving; the rest of the time the page is still
  var looping = false;
  function frame(now) {
    stepAnim(now);
    if (anim) requestAnimationFrame(frame); else looping = false;
  }
  function wake() { if (!looping) { looping = true; requestAnimationFrame(frame); } }

  /* ---- click, tap, swipe, keys ----------------------------------------- */
  var down = null;
  function interactive(el) { return !!(el.closest && el.closest('button, a, iframe, .plate, .pot, [data-go], .top, .sound')); }
  // one finger or the main mouse button only; a second finger or a stray button never counts
  deck.addEventListener('pointerdown', function (e) {
    if (e.isPrimary === false || (e.button != null && e.button !== 0)) return;
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), target: e.target };
  });
  deck.addEventListener('pointerup', function (e) {
    if (!down || e.pointerId !== down.id) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y, dt = performance.now() - down.t;
    var d = down; down = null;
    if (interactive(d.target)) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 800) { if (dx < 0) next(); else prev(); return; }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 600) {
      var st = d.target.closest && d.target.closest('.stage');
      var idx = -1; scenes.forEach(function (s, k) { if (s.stage === st) idx = k; });
      if (idx >= 0 && idx !== cur) { if (allow()) show(idx); }
      else if (cur >= 0 && scenes[cur].open) { if (allow()) setOpen(scenes[cur], false); }   // open memory: any other tap closes it
      else if (idx === cur && scenes[cur].memory) { if (allow()) toggleMemory(); }
      else next();
    }
  });
  deck.addEventListener('pointercancel', function () { down = null; });
  nextBtn.addEventListener('click', function () { next(); });
  prevBtn.addEventListener('click', function () { prev(); });
  document.addEventListener('keydown', function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (mode !== 'deck') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(e.repeat); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev(e.repeat); }
  });

  /* ---- the three words along the top ------------------------------------ */
  var navEls = { road: document.getElementById('navRoad'), october: document.getElementById('navOctober'), visit: document.getElementById('navVisit') };
  var navWords = S.nav || {};
  navEls.road.textContent = navWords.gallery == null ? 'gallery' : navWords.gallery;
  navEls.october.textContent = navWords.october == null ? 'october' : navWords.october;
  navEls.visit.textContent = navWords.visit == null ? 'sc' : navWords.visit;
  function setNav(id) { Object.keys(navEls).forEach(function (k) { navEls[k].classList.toggle('cur', k === id); }); }
  // on the pages, the lit word follows the scroll between October and the visit
  function navFromScroll() {
    if (mode !== 'pages') return;
    var v = document.getElementById('visit');
    setNav(!v.hidden && window.scrollY + window.innerHeight * 0.4 >= v.offsetTop ? 'visit' : 'october');
  }
  window.addEventListener('scroll', navFromScroll, { passive: true });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mode === 'deck' && cur >= 0) setOpen(scenes[cur], false); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-go]'); if (!a) return;
    e.preventDefault();
    var go = a.getAttribute('data-go');
    if (go === 'road') { if (mode === 'deck') { if (cur > 0) show(0); } else enterDeck(cur < 0 ? 0 : cur); return; }   // already here: back to the first memory
    enterPages(go);
  });

  /* ---- sound ---------------------------------------------------------- */
  var soundBtn = document.getElementById('soundBtn');
  function setSoundUI(on) {
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.querySelector('.sound-label').textContent = on ? 'sound on' : 'sound off';
  }
  soundBtn.addEventListener('click', function () {
    var on = !window.SOUND.isEnabled();
    on = window.SOUND.enable(on);
    setSoundUI(on);
    store.set('sound', on ? 'on' : 'off');
    if (on && mode === 'deck' && cur >= 0) window.SOUND.scene(scenes[cur].id);
  });
  // sound is on from the start, unless she turned it off last time. the browser only lets it begin after
  // her first tap or key, so the control reads 'sound on' right away and that first gesture starts it
  if (store.get('sound') !== 'off') {
    setSoundUI(true);
    var firstTouch = function () {
      document.removeEventListener('pointerdown', firstTouch, true);
      document.removeEventListener('keydown', firstTouch, true);
      if (window.SOUND.isEnabled() || soundBtn.getAttribute('aria-pressed') !== 'true') return;
      if (window.SOUND.enable(true) && mode === 'deck' && cur >= 0) window.SOUND.scene(scenes[cur].id);
    };
    document.addEventListener('pointerdown', firstTouch, true);
    document.addEventListener('keydown', firstTouch, true);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) window.SOUND.suspend(); else window.SOUND.resume(); });

  /* ---- resize ---------------------------------------------------------- */
  var rt = null;
  function onResize() { clearTimeout(rt); rt = setTimeout(function () { scenes.forEach(function (s) { s.handle.resize(); }); if (cur >= 0) layout(); }, 150); }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  /* ---- start where she left off ---------------------------------------- */
  function start() {
    var q = /[?&]at=([a-z]+)(?:&p=([0-9.]+))?/.exec(location.search);
    var place = null;
    if (q) place = { mode: (q[1] === 'october' || q[1] === 'visit') ? 'pages' : 'deck', id: q[1], p: +(q[2] || 0) };
    else { try { place = JSON.parse(store.get('place') || 'null'); } catch (e) { place = null; } }
    if (place && place.mode === 'pages') { enterPages(place.id); return; }
    var idx = 0, off = 0;
    if (place && place.id) { var k = order.indexOf(place.id); if (k >= 0) idx = k; }
    if (place && place.p && scenes[idx].duration) off = place.p * scenes[idx].duration * 1000;
    enterDeck(idx, off);
  }
  requestAnimationFrame(start);
})();
