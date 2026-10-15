/* Now playing: a small line in the bottom corner naming the track in this memory and the sound
   under it, from settings.nowPlaying. It is there only while sound is on and a memory is in
   front, and it fades out and back in as she moves between them. audio.js announces each change. */
(function () {
  var S = window.SITE || {};
  var names = S.nowPlaying || {};
  var el = document.createElement('div');
  el.className = 'now'; el.hidden = true; el.setAttribute('aria-live', 'polite');
  el.innerHTML = '<i class="now-dot" aria-hidden="true"></i><span class="now-text"><span class="now-track"></span><span class="now-backing"></span></span>';
  document.body.appendChild(el);
  var trackEl = el.querySelector('.now-track'), backingEl = el.querySelector('.now-backing');
  var shown = null, swapTimer = null, hideTimer = null;
  var OUT = 700;    // the words fade for this long before they change, then fade back in

  // the words for a memory: nothing if both are empty, unless the site is in draft, when a grey marker shows
  function entry(id) {
    var n = id ? names[id] : null;
    var t = n ? String(n.track || '').trim() : '', b = n ? String(n.backing || '').trim() : '';
    if (t || b) return { track: t, backing: b, ph: false };
    if (S.draft && id && names.hasOwnProperty(id)) return { track: '[track]', backing: '[backing]', ph: true };
    return null;
  }
  function write(n) {
    trackEl.textContent = n.track; trackEl.hidden = !n.track;
    backingEl.textContent = n.backing; backingEl.hidden = !n.backing;
    el.classList.toggle('ph', n.ph);
  }
  function apply(scene, enabled) {
    var n = enabled ? entry(scene) : null;
    var key = n ? scene + '|' + n.track + '|' + n.backing : null;
    if (key === shown) return;
    clearTimeout(swapTimer); clearTimeout(hideTimer);
    shown = key;
    if (!n) {   // sound off, or a memory with no names, or the pages: fade out, then leave
      el.classList.add('out');
      hideTimer = setTimeout(function () { if (!shown) el.hidden = true; }, 1300);
      return;
    }
    if (el.hidden || el.classList.contains('out')) {   // coming from nothing: set the words, then fade up
      write(n);
      el.hidden = false; el.classList.add('out'); void el.offsetWidth;
      requestAnimationFrame(function () { if (shown === key) el.classList.remove('out'); });
      return;
    }
    el.classList.add('out');   // one memory to the next: out, change the words, back in
    swapTimer = setTimeout(function () { if (shown === key) { write(n); el.classList.remove('out'); } }, OUT);
  }
  document.addEventListener('sound:change', function (e) { var d = e.detail || {}; apply(d.scene, !!d.enabled); });
})();
