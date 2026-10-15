/*
  Sound. Off until she turns it on. One quiet ambient loop per scene,
  generated in the browser so nothing has to download, or a recording
  from settings.audio if one is given. Everything fades over seconds.
*/
window.SOUND = (function () {
  var ctx = null, master = null, enabled = false, ducked = false;
  var current = null;          // { id, gain, stop(), tick(p, now) }
  var fading = [];
  var noiseBuf = null;
  var FADE = 2.6;

  function ac() { return window.AudioContext || window.webkitAudioContext; }

  function ensure() {
    if (!ac()) return false;
    if (!ctx) {
      ctx = new (ac())();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return true;
  }

  function noise() {
    if (noiseBuf) return noiseBuf;
    var len = ctx.sampleRate * 3;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function noiseSource() {
    var s = ctx.createBufferSource(); s.buffer = noise(); s.loop = true; s.start(); return s;
  }
  function filt(type, f, q) {
    var b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; return b;
  }
  function gain(v) { var g = ctx.createGain(); g.gain.value = v; return g; }
  function lfo(f, amt, target) {
    var o = ctx.createOscillator(); o.frequency.value = f;
    var g = gain(amt); o.connect(g); g.connect(target); o.start(); return o;
  }
  function chain() { // connect a list of nodes in order, return last
    for (var i = 0; i < arguments.length - 1; i++) arguments[i].connect(arguments[i + 1]);
    return arguments[arguments.length - 1];
  }

  /* ---- scene voices ------------------------------------------------- */
  var voices = {
    drive: function (out) {
      var n = noiseSource();
      var lp = filt('lowpass', 110, 0.7);
      var g = gain(0.9);
      chain(n, lp, g, out);
      lfo(0.07, 35, lp.frequency);
      var hum = ctx.createOscillator(); hum.type = 'triangle'; hum.frequency.value = 52;
      var hg = gain(0.05); chain(hum, filt('lowpass', 160), hg, out); hum.start();
      lfo(0.11, 2.5, hum.frequency);
      return { stop: function () { n.stop(); hum.stop(); } };
    },
    dishes: function (out) {
      var n = noiseSource();
      var bp = filt('bandpass', 1400, 0.6);
      var g = gain(0.14);
      chain(n, bp, g, out);
      lfo(0.3, 200, bp.frequency);
      var room = noiseSource(); chain(room, filt('lowpass', 180), gain(0.18), out);
      var alive = true, timer = null;
      function clink() {
        if (!alive) return;
        var o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = 1800 + Math.random() * 1800;
        var e = gain(0); chain(o, e, out);
        var t = ctx.currentTime;
        e.gain.setValueAtTime(0, t);
        e.gain.linearRampToValueAtTime(0.05, t + 0.005);
        e.gain.exponentialRampToValueAtTime(0.0005, t + 0.5);
        o.start(t); o.stop(t + 0.6);
      }
      function later() { clink(); if (alive) timer = setTimeout(later, 6000 + Math.random() * 9000); }
      timer = setTimeout(later, 4000);
      return {
        stop: function () { alive = false; clearTimeout(timer); n.stop(); room.stop(); },
        clink: clink
      };
    },
    jellies: function (out) {
      var n = noiseSource();
      var lp = filt('lowpass', 220, 0.9);
      chain(n, lp, gain(0.5), out);
      lfo(0.05, 90, lp.frequency);
      var o1 = ctx.createOscillator(); o1.frequency.value = 64;
      var o2 = ctx.createOscillator(); o2.frequency.value = 64.6;
      var dg = gain(0.035); o1.connect(dg); o2.connect(dg); chain(dg, filt('lowpass', 300), out);
      o1.start(); o2.start();
      return { stop: function () { n.stop(); o1.stop(); o2.stop(); } };
    },
    tacos: function (out) {
      var room = noiseSource(); chain(room, filt('lowpass', 140), gain(0.22), out);
      var grill = noiseSource(); var gg = gain(0);
      chain(grill, filt('highpass', 2600), gg, out);
      var flutter = ctx.createOscillator(); flutter.frequency.value = 7.3;
      var fl = gain(0); flutter.connect(fl); fl.connect(gg.gain); flutter.start();
      var lastStep = 0;
      function step(now) {
        var n = noiseSource(); var e = gain(0);
        chain(n, filt('lowpass', 420 + Math.random() * 120), e, out);
        var t = ctx.currentTime;
        e.gain.setValueAtTime(0, t);
        e.gain.linearRampToValueAtTime(0.22, t + 0.012);
        e.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
        n.stop(t + 0.2);
      }
      return {
        stop: function () { room.stop(); grill.stop(); flutter.stop(); },
        tick: function (p, now) {
          var walking = p < 0.72;
          var target = walking ? 0 : 0.06 * Math.min(1, (p - 0.72) / 0.12);
          gg.gain.setTargetAtTime(target, ctx.currentTime, 0.8);
          fl.gain.setTargetAtTime(target * 0.5, ctx.currentTime, 0.8);
          if (walking && now - lastStep > 0.78) { lastStep = now; step(now); }
        }
      };
    },
    cliffs: function (out) {
      var n = noiseSource();
      var lp = filt('lowpass', 420, 0.5);
      var swell = gain(0.25);
      chain(n, lp, swell, out);
      lfo(0.09, 0.2, swell.gain);     // slow wave swell
      lfo(0.04, 150, lp.frequency);
      var w = noiseSource();
      var bp = filt('bandpass', 700, 0.4);
      var wg = gain(0.09);
      chain(w, bp, wg, out);
      lfo(0.13, 350, bp.frequency);
      lfo(0.17, 0.05, wg.gain);
      return { stop: function () { n.stop(); w.stop(); } };
    },
    pillows: function (out) {
      var n = noiseSource();
      chain(n, filt('lowpass', 90), gain(0.12), out);
      return { stop: function () { n.stop(); } };
    }
  };

  function fileVoice(src, out) {
    var el = document.createElement('audio');
    el.src = src; el.loop = true; el.crossOrigin = 'anonymous'; el.preload = 'auto';
    var node = ctx.createMediaElementSource(el);
    node.connect(out);
    el.play().catch(function () {});
    return { stop: function () { el.pause(); el.src = ''; } };
  }

  function build(id) {
    var g = gain(0); g.connect(master);
    var files = (window.SITE && window.SITE.audio) || {};
    var v = (files[id] ? fileVoice(files[id], g) : (voices[id] ? voices[id](g) : null));
    if (!v) { return null; }
    return { id: id, gain: g, stop: v.stop, tick: v.tick || null, clink: v.clink || null };
  }

  function setScene(id) {
    if (!enabled || !ctx) { pendingScene = id; announce(); return; }
    pendingScene = id; announce();
    if (current && current.id === id) return;
    var t = ctx.currentTime;
    if (current) {
      var old = current;
      old.gain.gain.setTargetAtTime(0, t, FADE / 3);
      setTimeout(function () { try { old.stop(); } catch (e) {} old.gain.disconnect(); }, FADE * 1000 + 500);
    }
    current = id ? build(id) : null;
    if (current) current.gain.gain.setTargetAtTime(1, t, FADE / 3);
  }

  var pendingScene = null;
  // what is playing (or would be, once sound is on), for anything that shows it: nowplaying.js listens
  function announce() {
    try { document.dispatchEvent(new CustomEvent('sound:change', { detail: { scene: pendingScene, enabled: enabled } })); } catch (e) {}
  }

  function masterLevel() { return enabled ? (ducked ? 0.08 : 0.5) : 0; }
  function applyMaster() {
    if (!ctx) return;
    master.gain.setTargetAtTime(masterLevel(), ctx.currentTime, FADE / 3);
  }

  return {
    enable: function (on) {
      enabled = !!on;
      if (enabled) {
        if (!ensure()) { enabled = false; return false; }
        applyMaster();
        if (pendingScene) { var p = pendingScene; pendingScene = null; setScene(p); }
      } else if (ctx) {
        applyMaster();
      }
      announce();
      return enabled;
    },
    isEnabled: function () { return enabled; },
    scene: setScene,
    duck: function (on) { ducked = !!on; applyMaster(); },
    tick: function (id, p, now) {
      if (current && current.id === id && current.tick) current.tick(p, now);
    },
    clink: function () { if (current && current.clink) current.clink(); },
    suspend: function () { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume: function () { if (ctx && enabled && ctx.state === 'suspended') ctx.resume(); }
  };
})();
