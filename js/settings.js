/*
  SETTINGS â€” the only file Austin needs to edit.

  Every value here starts empty. The site looks finished when a value is
  missing: anything empty is simply not shown.

  Dates and times are in Pacific time (her time zone), written as
    "2026-10-18"         a day
    "2026-10-18 19:00"   a day and a time, 24-hour clock
  Leave a string empty ("") if it is not known yet.

  The phone number and the Stardew redeem code live in js/private.js,
  which is not committed. Copy js/private.example.js to js/private.js.
*/
window.SITE = {

  // While true, every line of copy you have not written yet shows as a grey
  // bracketed placeholder so you can see what is missing. Set to false before
  // sending her the link: then anything empty is simply not shown.
  draft: true,

  // Shown in the browser tab. Leave empty for no title at all.
  title: "",

  // Part one: the order of the six memories along the road.
  // Rearrange freely. Available: drive, dishes, jellies, tacos, cliffs, pillows.
  scenes: ["drive", "dishes", "jellies", "tacos", "cliffs", "pillows"],

  // The three words along the top of the screen: the memories, October, and the visit.
  nav: { gallery: "gallery", october: "october", visit: "sc" },

  // The small label on a memory that has text behind it. Tapping the card dims it and shows the text.
  clickPrompt: "[click me]",

  // The memory behind each card, shown over the dimmed drawing when it is tapped. Empty = the card
  // is not clickable. Blank lines in the string become paragraph breaks.
  memories: {
    drive:   "driving back from our date in san francisco I really felt like I was inside the most beautiful dream. I love to drive at night, the open highway lit by streetlamps, the mountains, us sitting in silence holding hands and listening to this song. I wished the road lasted forever...",
    dishes:  "its funny the little patterns that come out of nowhere. I didn't know this sink before, and now its a place in my life, washing our dishes after we cook. and it tasted soooo good",
    jellies: "and those jellyfish were like a dream too, and the whole monterray, driving through the fog, all the tricks nature pulled for us on that day, and you overlooking the pacific ocean, and you finally let me take a picture of you. and that car accident we almost got in! how scary it all was, and the woman who was so kind to you, and the turtle and the otter and the bad monopoly game, and touching the animals and learning about them, it was amazing",
    tacos:   "we got to walk under the moon too, through the neighborhood at night, and the truth is I felt exactly like I did when I was just 19, before life happened at all. i felt like a kid. maybe they knew that when we went in there, how happy they were... and we passed that laundromat lit up at night, and the mountains all around...",
    cliffs:  "I never saw cliffs in my life before, if you can believe it. i knew these things from pictures and paintings, and then i find myself walking there with you. in your black trench coat, and your face set against the ocean. i saw how strong you are, you stare into the ocean at the edge of a cliff, all in silence, i was moved then.",
    pillows: "then we strung up those lights together, and it made your space so alive!! it filled it with light. which was a metaphore, I guess, cause we filled it up with light too"
  },

  // A caption under each memory, one string per line. Empty list = no caption.
  captions: {
    drive:   ["driving home!", "a sky full of stars..."],
    dishes:  ["after dinner"],
    jellies: ["we saw jellyfish"],
    tacos:   ["we walked to get tacos", "and they were so happy"],
    cliffs:  ["we walked on the cliffs"],
    pillows: ["and you made a place for us to sleep"]
  },

  // The night he arrives. Drives the countdown at the top of October (hidden while empty) and the visit part.
  // Empty = no number is shown.
  arrivalDate: "2026-10-30",

  // Where the play button on the night drive points.
  // A Spotify track link (open.spotify.com/track/...) is embedded in the scene
  // when she taps play. Any other link opens in a new tab. Empty = no button.
  songUrl: "",

  // Ambient sound. By default each scene's sound is generated in the browser
  // (nothing to download). To use a recording instead, drop the file in the
  // audio/ folder and give its path here, e.g. drive: "audio/road.mp3".
  audio: {
    drive: "audio/drive.mp3", dishes: "audio/dishes.mp3", jellies: "audio/jellies.mp3",
    tacos: "audio/tacos.mp3", cliffs: "audio/cliffs.mp3", pillows: "audio/pillows.mp3"
  },

  // The small line in the bottom corner while sound is on: the track playing in this memory, and the
  // sound under it. Both empty = nothing is shown for that memory (a grey marker while draft is true).
  nowPlaying: {
    drive:   { track: "My Mind Went Blank · DJ Screw",                 backing: "driving down the 17" },
    dishes:  { track: "The Girl From Ipanema · Stan Getz",            backing: "dishes in your kitchen" },
    jellies: { track: "The Bounce · Qendresa",                        backing: "standing by the ocean at monterey bay" },
    tacos:   { track: "Sky Full of Stars · Persona 4 Golden",         backing: "happy midnight patrons at the taco place" },
    cliffs:  { track: "Fontainebleau · Stills-Young Band",            backing: "first time hearing the wind roar over cliffs" },
    pillows: { track: "Leo and Jas", backing: "watching youtube together" }
  },

  // Part two: October.
  october: {
    // "all" shows every activity from day one.
    // "byDate" shows each activity only once its date arrives (undated ones always show).
    reveal: "all",

    tea: {
      // Three teas. The plan: one Japanese green, one Darjeeling first flush,
      // one rose or hibiscus blend that brews pink.
      options: [
        { name: "Ippodo Hosen Sencha (Kyoto, Japan)",
          notes: "A bright, sweet-grassy green tea from one of Kyoto’s oldest tea houses. Pale jade in the cup, with a soft umami finish and no bitterness if brewed gently. Good for three or four infusions from the same leaves, so the pot keeps giving over a long conversation." },
        { name: "Castleton Estate Darjeeling, 2026 First Flush (West Bengal, India)",
          notes: "Picked in the first weeks of spring, before the monsoon, from one of Darjeeling’s most respected gardens. Light gold, floral, with the muscatel note the region is famous for — closer to a white wine than to a typical black tea. Delicate and a little astonishing." },
        { name: "Mountain Rose Herbs Hibiscus High (Oregon, USA)",
          notes: "A caffeine-free blend of hibiscus, rose, spearmint, and lemongrass that brews a clear rose-pink rather than the usual deep red. Tart, cool, and faintly sweet; lovely hot or over ice. The one to choose when the color matters as much as the taste." }
      ],
      chosen: "",          // the name of the tea she picked, once she has texted it
      shipped: false,      // true once ordered: the chosen tin shows as on its way
      brewDate: ""         // when you brew it together on a call
    },

    tomKha: {
      date: "",
      groceries: ""        // "", "ordered" or "delivered"
    },

    stardew: {
      giftMethod: "",      // "code"  = she enters a redeem code (code lives in private.js)
                           // "account" = the game is already waiting in her account
                           // ""      = the gate still opens, but shows nothing yet
      firstFarmNight: "",
      link: "https://store.steampowered.com/app/413150/Stardew_Valley/"   // the game's store page, shown under the intro. Empty = no link.
    },

    jellyCam: {
      link: "https://www.montereybayaquarium.org/cams-videos/live-cams/jelly-cam",   // the aquarium's live jelly cam page
      hours: "",           // e.g. "7 am to 7 pm Pacific" â€” check the aquarium's site
      date: ""             // when you both open it on a call
    },

    movie: {
      date: "",
      where: "",           // e.g. the name of the service
      link: ""             // a link to the film, if there is one
    }
  },

  // Part three: the visit.
  visit: {
    // "always" shows the list from the start.
    // "atZero" shows it only once the countdown reaches zero.
    reveal: "always",

    // status for each: "suggested", "planned" or "booked". Not shown on the page; "booked" on the spa shows its name and time.
    spa:      { status: "planned", name: "", time: "",   // name and time only once booked
                places: [                                 // the onsens to choose from, linked under the note
                  { name: "tea house spa", url: "https://teahousespa.com/" },
                  { name: "well within spa", url: "https://wellwithinspa.com/" }
                ] },
    study:    { status: "planned",
                places: [ { name: "ucsc library study rooms", url: "https://library.ucsc.edu/study-room-policies" } ] },
    thrift:   { status: "planned",
                places: [                                 // the shops, linked under the note
                  { name: "moon zooom", url: "https://downtownsantacruz.com/go/moonzooom" },
                  { name: "artifact goods", url: "https://www.instagram.com/artifactsantacruz/" },
                  { name: "pastime", url: "https://www.instagram.com/pastimesantacruz/" }
                ] },
    yakitori: { status: "suggested" },
    halloween: {}                                         // he is there for it; places: [] can hold links like the others
  },

  // Every line of text in parts two and three. Austin writes these.
  // Anything left empty is not shown. The site never invents a line.
  copy: {
    countdown: "there are {days} before I see you",   // top of October; {days} becomes e.g. "16 days", in pink
    countdownLine2: "lets enjoy them!",                // the line under it, set in a little

    teaIntro: "let's pick a tea and brew it together~",
  teaHow: "when you pick a tea, it will text me your choice! so then we can get it together",   // under the intro, hidden once a tea is chosen
    teaTextMessage: "",   // the text she sends when she taps a tin; {tea} becomes the tea's name.
                          // Empty = just the tea's name.
    teaChosen: "",        // shown under the chosen tin once it has shipped

    tomKhaIntro: "I love this soup so much! let's get the ingredients and try to make it together!",   // what happens on tom kha night

    stardewIntro: "if we get stardew valley, we can make a little farm together :)",   // shown by the gate before it is opened
    stardewInside: "",    // shown once the gate is open, above the code or account note
    stardewAccountNote: "", // the note when the game is waiting in her account

    jellyCamIntro: "for when you wanna relax and think back on how fun that was",

    movieIntro: "you suggested this to me, and I really want to see it! lets watch it together <3",

    visitTitle: "sc",                        // the heading of the visit part
    visitIntro: "I can't wait to see you",
    spaNote: "lets go to one of the onsens and relax for your birthday",
    studyNote: "your library seems soooo cool!!",
    thriftNote: "lets go thrifting! there's such cool places here",
    yakitoriNote: "lets get one of those little grills?",
    halloweenNote: "what are we gonna wear?",

    visitEnd: "and staying home all day just relaxing too"   // a last line at the very bottom of the site, if any
  }
};
