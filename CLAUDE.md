<!-- shared-preferences:start -->
## David's preferences (shared across all of David's apps)

This section is the same in every one of David's app repos. If David states a new general preference
(not specific to this app), add it here, in this file, and commit it. David's Mac copies it to the other repos.

**Who David is.** A guitar teacher and gigging guitarist (he/him) who builds personal and teaching apps with Claude.
Comfortable with tech but not a programmer: explain in plain words, skip jargon, keep replies short and
concrete. Likes to see things working: verify before saying "done".

**How the apps are built and hosted**
- Public web apps on GitHub Pages under the **davyrockett** GitHub account (never an Artifact or a hosted
  service). Live at `https://davyrockett.github.io/<repo>/`.
- Each app: `index.html` (+ `app.js` / `styles.css` when bigger), `sw.js` service worker for offline use
  with an update banner, `manifest.webmanifest`, `icons/` drawn by `tools/make-icons.py`, a
  `Start <App>.command` for local testing on the Mac, and a README written for David.
- **Every change must bump the version** (`tools/bump.sh` where it exists, otherwise `VERSION` in `sw.js`
  and the matching app version). Without it, installed copies on phones never update.
- Settings (gear icon) always has **Appearance: Light / Dark / Auto** and **Check for updates**.
  Apps open in **Light** unless changed in Settings.
- Design follows David's First Frets app: warm off-white / dark-brown palette, bright orange accent (#F57C14; dark mode #FF9433; David tried his logo orange #E27039, too red) and
  davyrockett grey secondary text (#676767; dark mode #A3A3A3),
  Big Shoulders Display headings, Atkinson Hyperlegible body text, works well on a phone.
- Data lives on the device (localStorage / IndexedDB). Apps whose data must sync between phone and Mac
  use a separate `davyrockett/<app>-data` repo (`data.json`) and an access key pasted into Settings.
  Never commit keys, tokens or anything in `private/`.
- **Publish when done:** commit, push to `main`, and confirm the live site shows the new version.
  End with a brief summary of what changed. David's Mac pulls GitHub changes into its Dropbox copy
  automatically, so pushing is all that's needed.

**Taste**
- Labels and descriptions plain and descriptive. Jokes belong in names (e.g. "Page Fright"), not taglines.
- Keep screens uncluttered: show extra controls only when they're relevant.
- Nothing should jump around: when a control doesn't apply, grey it out in place rather than hiding it, and
  reserve space for things that appear, so other controls never shift.
- **No AI voices, ever:** no text-to-speech or synthesised singing in any app. Use written instructions on
  screen, and instrument or synth sounds for audio.
- Commit messages: a short, plain description of the change.
- When renaming or moving an app, keep the old address working with a redirect repo.

**New apps:** create the repo under davyrockett and turn on GitHub Pages; David's Mac downloads new
davyrockett repos into `~/Dropbox/Local/Claude Apps/` automatically. Give each new app its own CLAUDE.md
with this section (copy it from any other app) plus an "## This app" section.
<!-- shared-preferences:end -->

## This app

**Jam Session**: music activities David uses in sessions with clients who have developmental delays
(mostly David on an iPad; very occasionally a caregiver at home). Repo `jam-session`.
Live: https://davyrockett.github.io/jam-session/ See README.md for features.

- **Privacy:** one shared app, no client profiles. Songs use **first names only** (David's choice; the repo is
  public). Hello/Goodbye ask for a name each time and never save it.
- **Song Builder songs sync** across devices (David asked for this): `sync.js` keeps them in the **private**
  repo davyrockett/jam-session-data (`data.json`: `songs` + `deleted`), same scheme as Health Log
  (newest edit wins, deletions remembered). Each device needs David's fine-grained access key pasted in
  Settings (stored on the device only). Always save/delete through `saveMySong()` / `deleteMySong()`.
  Local copy is localStorage `js.songs`; the app syncs on open and when it comes back to the front.
- **Activities** (menu in `app.js` `ACTIVITIES`): Songbook (picture books, `songs.js`), Cause & Effect
  (`react.js`), Song Builder (`builder.js`), Hello / Goodbye (`ROUTINES` in `songs.js`, read with the
  same book reader), Choice Board (`choice.js`). Screens are chosen by the `#/…` address (`route()` in app.js).
- **Pictures are drawn in code (SVG)**: whole scenes in `art.js` (`SCENES`, people via `walter()`,
  `sister()`, `marine()`, `captain()`), single things in `objects.js` (`OBJECTS`, 100×100, each with a
  `main` colour the Song Builder can swap). Walter is Black with short black hair and uses a wheelchair;
  his sisters Tish (pink, ponytail) and Mariana (purple, long hair) are tan with brown hair.
  Boats use the `--boat` colour picked on the Walter's Cruise cover (set via `style="fill:var(--boat)"`,
  not a fill attribute, for Safari).
- **Music** (`music.js`): a live Web Audio "island groove" in G major (Walter's Hapi drum is in G).
  Verse pages play G C G D, chorus pages C D G G. It's for when David isn't there: when he plays guitar
  the music stays off. Speed in Settings. No voices or singing, ever.
- **Cause & Effect:** the microphone detects any hit (loudness jump over a learned noise floor,
  `Listener` in react.js) plus taps on the picture. Sensitivity slider with a live meter. Worlds:
  Ocean, Animals, Vehicles, Party; pictures are pinned to the bottom of the stage (`ground` is in
  picture units).
- **Hello song lyrics are a placeholder** until David sends them (`ROUTINES` in songs.js).
- **Test locally:** `Start Jam Session.command`, or `python3 -m http.server 8773` here and open
  http://localhost:8773/. Offline caching is switched off on localhost so tests always load fresh files.
- **Publish:** run `tools/bump.sh`, commit, push, confirm live.
