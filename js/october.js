/* Parts two and three — October, and the visit. Small plain text, each thing drawn as an object. */
window.renderAfter = function (env) {
  var S = env.settings, P = env.priv, C = S.copy || {};
  var oct = S.october || {}, vis = S.visit || {};
  var draft = !!S.draft;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function line(text, cls) { return text ? '<p class="' + (cls || '') + '">' + esc(text) + '</p>' : ''; }
  // a placeholder Austin sees only while the site is in draft
  function ph(key, what) { return (draft && !C[key]) ? '<p class="ph">[' + esc(what) + ' — copy.' + key + ' in settings.js]</p>' : line(C[key]); }
  function dateLine(s, label) { var f = env.fmtDate(s); return f ? '<p class="meta">' + esc(label ? label + ' ' : '') + esc(f) + '</p>' : ''; }
  function visibleByDate(d) { if (oct.reveal !== 'byDate') return true; var day = env.parseDay(d); return day == null || day <= env.today(); }

  /* ---- art ---------------------------------------------------------- */
  // Austin's hand-drawn icons, lifted off the paper (img/icons, from handdrawn_icons.jpeg)
  function ink(name) { return '<img class="ink" src="img/icons/' + name + '.png" alt="" decoding="async">'; }
  var teaArt = ink('tea'), tomKhaArt = ink('soup'), camArt = ink('jelly'), ticketArt = ink('ticket');
  var gateArt = ink('carrot');   // the gate is a carrot that is pulled up when tapped

  /* ---- October -------------------------------------------------------- */
  var o = document.getElementById('octoberCol');
  // the countdown: how many days until he arrives, the number in pink; nothing until the date is set
  var left = env.nightsLeft(), count = '';
  if (left != null && left > 0 && C.countdown) {
    var days = left + (left === 1 ? ' day' : ' days'), parts = C.countdown.split('{days}');
    count = '<p class="count"><span>' + esc(parts[0]) + '<b>' + esc(days) + '</b>' + esc(parts.slice(1).join('{days}')) + '</span>' +
      (C.countdownLine2 ? '<span class="count-2">' + esc(C.countdownLine2) + '</span>' : '') + '</p>';
  } else if (draft && !(left != null && left > 0)) count = '<p class="ph">[the countdown shows here once arrivalDate is set in settings.js]</p>';
  var html = '<h2>october</h2>' + count;   // the countdown is the intro

  // Tea
  var tea = oct.tea || {}, opts = (tea.options || []).filter(function (t) { return t && t.name; });
  var chosen = tea.chosen || '';   // only the tea Austin sets in settings is marked; a tap is not remembered
  var h = '<article class="act" id="tea"><div class="art">' + teaArt + '</div><div><h3>tea</h3>' + ph('teaIntro', 'what the tea shelf is for') +
    (tea.chosen ? '' : line(C.teaHow, 'how'));   // how picking works, until a tea is chosen
  if (opts.length) {
    h += '<div class="tins">';
    opts.forEach(function (t, i) {
      var isChosen = chosen && chosen === t.name;
      var body = C.teaTextMessage ? C.teaTextMessage.replace('{tea}', t.name) : t.name;
      var attrs = ' class="tin' + (isChosen ? ' chosen' : '') + '" data-tea="' + esc(t.name) + '"';
      var inner = '<span class="tin-name">' + esc(t.name) + '</span>' + (t.notes ? '<span class="tin-notes">' + esc(t.notes) + '</span>' : '');
      if (P.phone && !tea.chosen) h += '<a' + attrs + ' href="sms:' + esc(P.phone) + '?&body=' + encodeURIComponent(body) + '">' + inner + '</a>';
      else h += '<button type="button"' + attrs + (tea.chosen ? ' disabled' : '') + '>' + inner + '</button>';
    });
    h += '</div>';
    if (tea.chosen && tea.shipped) {
      h += '<p class="status">' + esc(tea.chosen) + ' is on its way</p>' + dateLine(tea.brewDate, 'Brewing together') + line(C.teaChosen, 'small');
    } else if (tea.chosen) {
      h += '<p class="status">' + esc(tea.chosen) + '</p>';
    }
  } else if (draft) {
    h += '<p class="ph">[three teas go in settings.js under october.tea.options]</p>';
  }
  h += '</div></article>';
  html += h;

  // Tom kha night
  var tk = oct.tomKha || {};
  if (visibleByDate(tk.date)) {
    html += '<article class="act" id="tomkha"><div class="art">' + tomKhaArt + '</div><div><h3>tom kha night</h3>' + ph('tomKhaIntro', 'what happens on tom kha night') +
      dateLine(tk.date) +
      (tk.groceries === 'delivered' ? '<p class="status">Groceries delivered</p>' : tk.groceries === 'ordered' ? '<p class="status">Groceries ordered</p>' : '') +
      '<div class="recipe">Serves two.<div class="cols"><ul>' +
      '<li>400 ml can full-fat coconut milk</li><li>360 ml chicken broth</li><li>1 lemongrass stalk, smashed, cut in three</li><li>6 thin slices galangal or ginger</li><li>3 makrut lime leaves (optional)</li><li>250 g boneless chicken thigh, thinly sliced</li><li>150 g mushrooms</li><li>1.5 tbsp fish sauce</li><li>1 tsp sugar</li><li>2 tbsp lime juice</li><li>2 Thai chilies (optional)</li><li>Cilantro, jasmine rice to serve</li></ul>' +
      '<ol><li>Start the rice.</li><li>Simmer the coconut milk, broth, lemongrass, galangal and lime leaves gently for 5 minutes. Do not let it boil hard.</li><li>Add the chicken and mushrooms. Simmer about 8 minutes, until the chicken is cooked through.</li><li>Turn off the heat. Stir in the fish sauce, sugar, lime juice and chilies. Taste and adjust.</li><li>Serve with cilantro and rice. The lemongrass, galangal and lime leaves are for flavor and stay in the bowl.</li></ol></div></div>' +
      '</div></article>';
  }

  // Stardew Valley
  var sd = oct.stardew || {};
  if (visibleByDate(sd.firstFarmNight)) {
    // what the gate hides: the code, or the note that the game is in her account. No placeholders here;
    // while it is empty the carrot is a plain icon and nothing opens.
    var inside = '';
    if (sd.giftMethod === 'code' && P.stardewCode) inside += '<span class="code">' + esc(P.stardewCode) + '</span>';
    else if (sd.giftMethod === 'account') inside += line(C.stardewAccountNote);
    var reveal = line(C.stardewInside) + inside + dateLine(sd.firstFarmNight, 'First farm night');
    var art = reveal ? '<button type="button" class="gate-btn" aria-expanded="false" aria-label="Open the gate">' + gateArt + '</button>' : gateArt;
    html += '<article class="act" id="stardew"><div class="art">' + art + '</div><div><h3>stardew valley</h3>' +
      ph('stardewIntro', 'shown by the gate before it opens') +
      (sd.link ? '<p><a href="' + esc(sd.link) + '" target="_blank" rel="noopener noreferrer">Stardew Valley on Steam</a></p>' : '') +
      (reveal ? '<div class="gate-reveal">' + reveal + '</div>' : '') +
      '</div></article>';
  }

  // Live jelly cam
  var jc = oct.jellyCam || {};
  if (visibleByDate(jc.date)) {
    html += '<article class="act" id="jellycam"><div class="art">' + camArt + '</div><div><h3>live jelly cam</h3>' + ph('jellyCamIntro', 'what happens with the jelly cam') +
      dateLine(jc.date) + (jc.hours ? '<p class="meta">Live ' + esc(jc.hours) + '</p>' : '') +
      (jc.link ? '<p><a href="' + esc(jc.link) + '" target="_blank" rel="noopener noreferrer">Open the live cam</a></p>' : '') +
      '</div></article>';
  }

  // Movie night
  var mv = oct.movie || {};
  if (visibleByDate(mv.date)) {
    html += '<article class="act" id="movie"><div class="art">' + ticketArt + '</div><div><h3>movie night</h3><p>Erin Brockovich (2000)</p>' + ph('movieIntro', 'what happens on movie night') +
      dateLine(mv.date) + (mv.where ? '<p class="meta">On ' + esc(mv.where) + '</p>' : '') +
      (mv.link ? '<p><a href="' + esc(mv.link) + '" target="_blank" rel="noopener noreferrer">Open the film</a></p>' : '') +
      '</div></article>';
  }
  o.innerHTML = html;

  // tea: a tap turns the name pink for a moment while Messages opens, then it settles back.
  // Nothing is remembered in her browser; the lasting mark is october.tea.chosen in settings.
  Array.prototype.forEach.call(o.querySelectorAll('.tin'), function (el) {
    el.addEventListener('click', function () {
      if (el.disabled) return;
      el.classList.add('tapped');
      clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('tapped'); el.blur(); }, 1500);
    });
  });
  // the gate
  var gate = o.querySelector('.gate-btn');
  if (gate) gate.addEventListener('click', function () {
    var open = !gate.classList.contains('open');
    gate.classList.toggle('open', open); gate.setAttribute('aria-expanded', String(open));
    gate.setAttribute('aria-label', open ? 'Close the gate' : 'Open the gate');
    o.querySelector('.gate-reveal').classList.toggle('in', open);
  });

  /* ---- The visit ------------------------------------------------------ */
  var v = document.getElementById('visitCol');
  var n = env.nightsLeft();
  if (vis.reveal === 'atZero' && n != null && n > 0) { v.parentNode.hidden = true; return; }
  var spa = vis.spa || {}, booked = spa.status === 'booked';
  var vh = '<h2>' + esc(C.visitTitle || 'the visit') + '</h2>' + (draft && !C.visitIntro ? '<p class="ph">[a few words about the visit, if any — copy.visitIntro]</p>' : line(C.visitIntro, 'intro'));
  vh += '<ul class="visit-list">';
  vh += '<li><span>' + (booked && spa.name ? esc(spa.name) : 'a private soak') + '</span>' +
        (booked && spa.time ? '<p class="note">' + esc(env.fmtDate(spa.time) || spa.time) + '</p>' : '') + note('spaNote') + places(spa.places) + '</li>';
  vh += '<li><span>study rooms at ucsc</span>' + note('studyNote') + places((vis.study || {}).places) + '</li>';
  vh += '<li><span>thrifting together</span>' + note('thriftNote') + places((vis.thrift || {}).places) + '</li>';
  vh += '<li><span>yakitori night at home</span>' + note('yakitoriNote') + '</li>';
  vh += '<li><span>halloween</span>' + note('halloweenNote') + places((vis.halloween || {}).places) + '</li>';
  vh += '</ul>';
  vh += (draft && !C.visitEnd ? '<p class="ph end">[a last line at the bottom, if any — copy.visitEnd]</p>' : (C.visitEnd ? '<p class="end">' + esc(C.visitEnd) + '</p>' : ''));
  v.innerHTML = vh;
  function note(key) { return C[key] ? '<p class="note">' + esc(C[key]) + '</p>' : (draft ? '<p class="note ph">[copy.' + key + ']</p>' : ''); }
  // the places to choose from, as links in a row
  function places(list) { list = (list || []).filter(function (p) { return p && p.name && p.url; }); return list.length ? '<p class="note places">' + list.map(function (p) { return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' + esc(p.name) + '</a>'; }).join(' · ') + '</p>' : ''; }
};
