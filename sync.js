// Keeps Song Builder songs the same on every device.
// The songs live in one file, data.json, in the GitHub project
// davyrockett/jam-session-data. Each time it syncs, the app:
//   1. downloads data.json,
//   2. merges it with the songs on this device (the newest edit of each song wins;
//      deleted songs are remembered so they don't come back),
//   3. uploads the result if anything changed.
// GitHub keeps every upload as a version, so nothing is ever lost.
// The access key stays on this device only.

const SYNC_FILE = 'data.json';
const DEFAULT_REPO = 'davyrockett/jam-session-data';

class SyncError extends Error {
  constructor(kind, message) { super(message); this.kind = kind; } // auth | offline | missing | conflict | other
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function fromBase64(b64) {
  const bin = atob(b64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

async function github(repo, token, path, options = {}) {
  let res;
  try {
    res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...options,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch {
    throw new SyncError('offline', 'No connection. Songs will sync when you’re back online.');
  }
  if (res.status === 401) throw new SyncError('auth', 'The access key isn’t working (expired or mistyped).');
  if (res.status === 403) throw new SyncError('auth', 'The access key doesn’t have permission to read and write this project.');
  return res;
}

async function downloadData(repo, token) {
  const res = await github(repo, token, `/contents/${SYNC_FILE}`);
  if (res.status === 404) {
    const repoRes = await github(repo, token, '');
    if (repoRes.status === 404) throw new SyncError('missing', `Can’t find the project “${repo}”. Check that the key includes it.`);
    return { data: null, sha: null };
  }
  if (!res.ok) throw new SyncError('other', `GitHub said ${res.status} when downloading.`);
  const body = await res.json();
  return { data: JSON.parse(fromBase64(body.content)), sha: body.sha };
}

async function uploadData(repo, token, data, sha) {
  const device = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document ? 'iPad'
    : /iPhone/.test(navigator.userAgent) ? 'iPhone' : /Macintosh/.test(navigator.userAgent) ? 'Mac' : 'device';
  const res = await github(repo, token, `/contents/${SYNC_FILE}`, {
    method: 'PUT',
    body: JSON.stringify({ message: `Sync from ${device}`, content: toBase64(JSON.stringify(data, null, 2) + '\n'), ...(sha ? { sha } : {}) }),
  });
  if (res.status === 409 || res.status === 422) throw new SyncError('conflict', 'Changed on another device at the same moment.');
  if (!res.ok) throw new SyncError('other', `GitHub said ${res.status} when uploading.`);
}

// For each song the newest edit wins; a deletion wins over any edit made before it.
function mergeCopies(a, b) {
  const deleted = new Map();
  for (const t of [...(a.deleted || []), ...(b.deleted || [])]) {
    const prev = deleted.get(t.id);
    if (!prev || t.deletedAt > prev.deletedAt) deleted.set(t.id, t);
  }
  const byId = new Map();
  for (const s of [...(a.songs || []), ...(b.songs || [])]) {
    const prev = byId.get(s.id);
    if (!prev || (s.updatedAt || '') > (prev.updatedAt || '')) byId.set(s.id, s);
  }
  const songs = [...byId.values()]
    .filter((s) => { const t = deleted.get(s.id); return !t || (s.updatedAt || '') > t.deletedAt; })
    .sort((x, y) => (x.createdAt || x.id).localeCompare(y.createdAt || y.id));
  const alive = new Set(songs.map((s) => s.id));
  return { songs, deleted: [...deleted.values()].filter((t) => !alive.has(t.id)) };
}

const sameData = (a, b) => {
  const canon = (d) => JSON.stringify([[...((d && d.songs) || [])].sort((x, y) => x.id.localeCompare(y.id)),
    [...((d && d.deleted) || [])].sort((x, y) => x.id.localeCompare(y.id))]);
  return canon(a) === canon(b);
};

const sync = {
  status: 'off',       // off | syncing | ok | an error kind
  message: '',
  onStatus: () => {},  // Settings redraws its status line
  onUpdated: () => {}, // the app redraws when songs arrived from another device

  isOn: () => Boolean(store.get('syncRepo', '') && store.get('syncToken', '')),
  repo: () => store.get('syncRepo', ''),
  lastSynced: () => store.get('syncLast', null),

  setStatus(status, message = '') { this.status = status; this.message = message; this.onStatus(); },

  async run() {
    if (!this.isOn()) return this.setStatus('off');
    if (this.running) { this.again = true; return; }
    this.running = true;
    this.setStatus('syncing');
    const repo = this.repo(), token = store.get('syncToken', '');
    try {
      for (let attempt = 1; ; attempt++) {
        const { data: remote, sha } = await downloadData(repo, token);
        const local = { songs: store.get('songs', []), deleted: store.get('deleted', []) };
        const merged = mergeCopies(local, remote || {});
        if (!sameData(local, merged)) {
          store.set('songs', merged.songs);
          store.set('deleted', merged.deleted);
          this.onUpdated();
        }
        if (sameData(remote, merged)) break;
        try { await uploadData(repo, token, { app: 'jam-session', format: 1, ...merged }, sha); break; }
        catch (e) { if (e.kind !== 'conflict' || attempt >= 3) throw e; }
      }
      store.set('syncLast', new Date().toISOString());
      this.setStatus('ok');
    } catch (e) {
      this.setStatus(e.kind || 'other', e.message);
    } finally {
      this.running = false;
      if (this.again) { this.again = false; this.run(); }
    }
  },

  // After a song is saved or deleted: sync shortly.
  soon() {
    if (!this.isOn()) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.run(), 1000);
  },

  async connect(repo, token) {
    await downloadData(repo, token);   // throws if the key or project is wrong
    store.set('syncRepo', repo);
    store.set('syncToken', token);
    store.set('syncLast', null);
    return this.run();
  },

  disconnect() {
    store.set('syncToken', '');
    store.set('syncLast', null);
    this.setStatus('off');
  },
};

// Song Builder calls these instead of writing the song list directly.
function saveMySong(song) {
  const now = new Date().toISOString();
  song.updatedAt = now;
  if (!song.createdAt) song.createdAt = now;
  const songs = store.get('songs', []);
  const i = songs.findIndex((s) => s.id === song.id);
  if (i < 0) songs.push(song); else songs.splice(i, 1, song);
  store.set('songs', songs);
  sync.soon();
}
function deleteMySong(id) {
  store.set('songs', store.get('songs', []).filter((s) => s.id !== id));
  store.set('deleted', [...store.get('deleted', []).filter((t) => t.id !== id), { id, deletedAt: new Date().toISOString() }]);
  sync.soon();
}
