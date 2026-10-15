/* A memory that is one of Austin's drawings: a square image centred on black.
   photoScene('img/x.jpg') makes a scene; pass { song: true } to add the play button for the song,
   { stars: true } for tiny pink stars twinkling along the top of the screen while this memory is in front,
   { bubbles: true } for soap bubbles drifting up through the dark above the card,
   { dots: true } for soft dots swirling slowly above the card, the way jellyfish move,
   { lamp: true } for the pink cone of a street lamp falling down the screen behind the card, flickering on,
   { leaves: true } for small leaves blowing across the top of the screen in the wind,
   { lights: true } for two strings of softly glowing bulbs across the top of the screen. */
window.photoScene = function (src, opts) {
  opts = opts || {};
  return {
    stars: !!opts.stars,
    bubbles: !!opts.bubbles,
    dots: !!opts.dots,
    lamp: !!opts.lamp,
    leaves: !!opts.leaves,
    lights: !!opts.lights,
    mount: function (stage, env) {
      var fig = document.createElement('div'); fig.className = 'photo';
      var img = document.createElement('img');
      img.src = src; img.alt = ''; img.decoding = 'async';
      fig.appendChild(img);
      stage.appendChild(fig);

      var song = opts.song ? (env.settings.songUrl || '') : '';
      if (song) {
        var ui = document.createElement('div'); ui.className = 'ui';
        stage.appendChild(ui);
        var btn = document.createElement('button');
        btn.className = 'play'; btn.type = 'button'; btn.setAttribute('aria-label', 'Play the song');
        btn.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1.5v11l10-5.5z" fill="currentColor"/></svg>';
        ui.appendChild(btn);
        btn.addEventListener('click', function () {
          var m = song.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|episode)\/([A-Za-z0-9]+)/);
          if (m) {
            var box = document.createElement('div'); box.className = 'song-embed';
            var f = document.createElement('iframe');
            f.src = 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?theme=0';
            f.allow = 'encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture';
            f.loading = 'lazy'; f.title = 'Song';
            box.appendChild(f); ui.appendChild(box);
            requestAnimationFrame(function () { box.classList.add('in'); });
            btn.style.opacity = 0; btn.style.transition = 'opacity 2s';
            setTimeout(function () { btn.remove(); }, 2200);
          } else {
            window.open(song, '_blank', 'noopener');
          }
          env.songStarted();
        });
      }
      return { render: function () {}, resize: function () {} };
    }
  };
};
