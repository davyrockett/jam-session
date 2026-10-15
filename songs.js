// The songs. Each one is a book; each page has a picture (a scene from art.js),
// the lyric lines, and its part: 'verse' or 'chorus' (the music changes chords to match).
// To add a song, add another entry to SONGS.

const CHORUS = ["That's what I do", "They can't stop us", 'Not a chance', 'We were born for this'];

const SONGS = [
  {
    id: 'walters-cruise',
    title: "Walter's Cruise",
    by: 'Walter and David',
    cover: 'cover',
    boats: true,          // the cover asks what colour the boat should be
    pages: [
      { scene: 'blender', part: 'verse', lines: ["This weekend Walter's gonna go on a cruise", "Of course he's gonna bring his blender on the cruise.", 'Oh yeah'] },
      { scene: 'salad', part: 'verse', lines: ["Walter's sister loves salad and salad dressing", "So he's going to give her the recipe for salad.", "That's right"] },
      { scene: 'chorus', part: 'chorus', lines: CHORUS },
      { scene: 'motor', part: 'verse', lines: ['While Walter was cruising, he saw the water', 'The captain revved the motor and he was like', 'WHAT!?'] },
      { scene: 'marines', part: 'verse', lines: ['It was a little bit scary but I dealt with it well', 'The Marines helped me onto the boat,', 'I said 1, 2, 3'] },
      { scene: 'chorus', part: 'chorus', lines: CHORUS },
      { scene: 'sing', part: 'verse', lines: ['We sang Boyz II Men on the cruise', "That's what I did"] },
      { scene: 'drive', part: 'verse', lines: ['My sister Tish was driving the boat', 'and then my sister Mariana', 'And then ME!'] },
      { scene: 'chorus', part: 'chorus', lines: CHORUS },
      { scene: 'finale', part: 'chorus', lines: CHORUS, note: 'Sing it twice!', end: true },
    ],
  },
];

// Session routines. {name} is replaced by the name typed on the first page
// (or left out if no name is typed). The name is never saved.
const ROUTINES = [
  {
    id: 'hello',
    title: 'Hello',
    by: 'David',
    cover: 'helloSun',
    routine: true,
    pages: [
      // Placeholder until David sends the hello song lyrics.
      { scene: 'helloSun', part: 'verse', lines: ['Hello {name}!', "It's time to play some music today"] },
    ],
  },
  {
    id: 'goodbye',
    title: 'Goodbye',
    by: 'David',
    cover: 'byeSunset',
    routine: true,
    pages: [
      { scene: 'pack', part: 'verse', lines: ["We're all done for the day,", 'time to pick up our stuff', 'and move it along'] },
      { scene: 'byeSunset', part: 'verse', lines: ['And end the song,', "I'll see you again,", "it won't be long"] },
      { scene: 'byeFriends', part: 'chorus', lines: ["So I'll see you later {name},", "I'll see you later my friend"], end: true },
    ],
  },
];
