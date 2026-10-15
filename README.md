# Site for Annika

A small private static site. No build step, no backend, no accounts, no analytics.
Open `index.html` through any local server to preview it, and upload the folder to any static host to publish it.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page. Has the no-index tag. |
| `js/settings.js` | **The only file you edit.** Dates, statuses, the song link, scene order, and every line of your copy. |
| `js/private.js` | Your phone number and the Stardew code. Ignored by git. Copy it from `js/private.example.js`. |
| `js/main.js` | Shows one memory at a time in the order from settings, crossfades between them, remembers her place. |
| `js/scenes/*.js` | One file per memory: `drive`, `dishes`, `jellies`, `tacos`, `cliffs`, `pillows`. Each shows one of your drawings. |
| `img/` | The six drawings, cropped square at 1600 by 1600. The site uses these, not the original photos. |
| `js/october.js` | Parts two and three. |
| `js/audio.js` | Ambient sound, generated in the browser. Off until she turns it on. |
| `css/site.css` | Styles. |
| `audio/` | Empty. Drop recordings here if you want them instead of generated sound (see `audio` in settings). |
| `robots.txt` | Tells crawlers to stay out. |

## Previewing

Any static server works. From this folder:

```
python -m http.server 8931
```

then open `http://localhost:8931/`. To jump straight to a scene while checking it, add `?at=tacos`. Ids: `drive`, `dishes`, `jellies`, `tacos`, `cliffs`, `pillows`, `october`, `visit`.

Open it on your phone over Wi‑Fi too (`http://<your computer's IP>:8931/`), and test Safari on the Mac. Sound needs a tap on the control at the top left; browsers do not allow it to start on its own.

## Filling in settings

Everything in `js/settings.js` starts empty, and anything empty is not shown. While `draft: true`, each line of copy you have not written yet shows as a grey bracketed placeholder so you can see what is missing. Set `draft: false` before sending her the link.

Dates are in Pacific time, written `"2026-10-18"` or `"2026-10-18 19:00"` (24-hour clock).

- `arrivalDate` drives the countdown in the two pillows scene. Empty shows no number.
- `scenes` is the order of the memories. Rearrange freely.
- `songUrl` is where the play button points. A Spotify track link is embedded in the scene when she taps play; anything else opens in a new tab. Empty hides the button.
- `october.reveal`: `"all"` shows everything from day one; `"byDate"` shows each activity only once its date arrives.
- `visit.reveal`: `"always"`, or `"atZero"` to show the visit list only when the countdown reaches zero. The `status` values under `visit` are no longer shown on the page (the planned and suggested labels were dropped on Oct 15, 2026); only `spa.status: "booked"` still matters, since it swaps in the spa's name and time. Each visit item can carry a `places` list of `{ name, url }` links shown under its note.
- `copy.*` is every line of text in parts two and three. The site never invents one.

Her tea pick: tapping a tin opens a text to the number in `private.js` with the tea's name as the message. Once she has texted you, set `october.tea.chosen` to that tea's name, `shipped: true` after you order, and `brewDate`. A tap is not remembered in her browser: the name goes pink for a moment while Messages opens, then settles back. Only `chosen` marks a tin for good.

## Publishing

Use any static host that gives an unlisted address, for example Netlify (drag the folder onto the Netlify dashboard) or Cloudflare Pages. Pick a random subdomain, not her name. Include `js/private.js` in what you upload: the site reads the phone number and code from it in the browser, so anyone who has the address can see them, which is why the address stays private. Keep the repository itself private if you put it in git; `.gitignore` already excludes `private.js`.

## What she sees

The memories are your six drawings, one per scene. A tap or click anywhere, a swipe, the arrow keys, or the chevrons at the bottom corners move between them, with a slow crossfade. To replace a drawing, crop it square, save it as a JPEG of about 1600 by 1600 pixels over the matching file in `img/`, and nothing else needs to change. After the last scene, the next tap opens October, with the visit below it. The site remembers where she left off in her browser. The menu at the top right (three dots) reaches the memories, October and the visit directly, and can start from the beginning. With the reduced-motion setting on, every scene is a still.

## Still open (from the brief)

Visit dates, scene order, all-at-once or over time, when the visit list appears, the three teas, how Stardew is gifted, where the film is streaming, dates for the five activities, and whether the site has a title. Each is a value in settings, so none blocks anything.

## Build notes

**Cover flow (Oct 14, 2026).** The memories are shown as a cover flow: the current drawing in front, one neighbour on each side, smaller, turned away and darkened, the rest hidden. Tapping a neighbour brings it to the front.

The one approach that works reliably: `js/main.js` animates the cards itself, frame by frame, and sets each card's stacking order (`z-index`) from its own position on every frame, so the nearest card is always on top by construction. The neighbours are darkened with a black overlay whose opacity is also set per frame. The card spacing is wide enough that two moving cards pass side by side without overlapping.

A card leaving the flow keeps darkening past the neighbour position until it is fully black, and is only hidden then, so nothing cuts off mid-slide; a card coming back fades in the same way.

**Fast input (Oct 14, 2026).** Every click, tap, swipe and key counts, but two inputs closer than 80 ms are one input (double-fired events), a held arrow key steps every 350 ms, only the first finger or the main mouse button counts, and the buttons opt out of double-tap zoom. A move that interrupts another starts at full speed (ease-out) instead of easing in again, so a burst of clicks never stalls the cards. The ambient sound follows 250 ms after the last click so a burst builds one voice, not one per click.

**Captions, memories and effects (Oct 15, 2026).** Each memory can have a caption under the card (`captions` in `js/settings.js`, one string per line, in a system serif set by `--caption-font` in `css/site.css`) and a memory behind it (`memories`): when a memory is non-empty a `[click me]` label (`clickPrompt`) appears above the card, and tapping the label or the card dims the drawing to near black and shows the text; any other tap, Escape, or moving on closes it. The text panel grows past the card edges if a long memory needs it. Each scene can also ask for one effect layer by a flag in its scene file, built in `js/main.js` and styled in `css/site.css`, all CSS-animated and faded in and out with the card: `stars` (drive), `bubbles` (dishes), `dots` (jellies, slow swirl), `lamp` (tacos, a pink street-lamp cone that flickers on), `leaves` (cliffs, blowing across), `lights` (pillows, two strings of glowing bulbs). All of them live in the dark band above the card, whose height is `--band` on the deck; the lamp uses the whole screen.

**Switching between the gallery and the pages (Oct 15, 2026).** Whatever is showing fades fully to black first, then the other side appears and fades up; nothing is ever half-faded over something else. Two things share the name "pages": the October/visit container is `<div class="pages" id="pages">`, and the body gets a `pages` class while the pages are showing (it switches scrolling on and the nav backdrop in). Any rule that fades or hides the container must therefore target `#pages`, never `.pages`. A `.pages` rule matched the body too and faded the whole document, nav bar included, every time October opened. When checking a fade in the harness, sample the body's opacity and animations as well as the element's.

**October icons (Oct 15, 2026).** The five icons on the October page (tea, tom kha bowl, carrot for Stardew, jellyfish, admit-one ticket) are Austin's ballpoint drawings from `handdrawn_icons.jpeg`, lifted off the lined paper by `tools/extract_icons.py` into `img/icons/*.png` as paper-coloured ink on transparency. The Stardew gate is the carrot: once `october.stardew.giftMethod` (or `copy.stardewInside`) is filled in, tapping it lifts the carrot and opens the reveal; while those are empty the carrot is a plain icon with nothing to open, and no placeholder is shown. To redo an icon, redraw, drop the photo in as `handdrawn_icons.jpeg`, adjust its crop box in the script and run it. The two scribbled-out sketches on the page were skipped on purpose.

Approaches that did not work, so nobody tries them again:

- CSS transitions on the cards with `z-index` swapped at the start of the move: the incoming card painted over the edge of the card still in front.
- Swapping `z-index` halfway through the move: the outgoing card stayed on top far too long.
- `transform-style: preserve-3d` on the deck to let the browser sort by depth: on a GPU-rendered page the back card was never obscured at all, whether the dimming used a `filter` or an overlay. Headless software rendering showed it as correct, which is why it got through.

**Sound start (Oct 15, 2026).** Sound is on by default. On a first visit a browser only lets it begin after her first tap or key, so that gesture starts it. On a return visit (or once she has allowed sound for the site) browsers let it begin at once, so the site tries that on load first; `SOUND.canStartNow()` makes a context and keeps it only if the browser started it running. The first tap still runs as a fallback and kicks a context or recording that was created but held back.
