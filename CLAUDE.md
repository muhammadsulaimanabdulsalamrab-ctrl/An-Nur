# CLAUDE.md — An Nur Project Memory
> Save this file. Paste it at the start of any new Claude conversation to restore full context.

---

## 👤 About the User
- **Name:** Saif (always address him as Saif)
- **Email:** muhammadsulaimanabdulsalamrab@gmail.com (work/project email)
- **Preferences:** Great UI/UX, Anthropic/Claude.ai aesthetic, Fraunces + Geist + Amiri Quran fonts
- **Intent:** Sadaqah jariyah — built this secretly (anonymous profile) to avoid riya
- **Published at:** https://an-nur-eosin.vercel.app
- **Broke:** Yes — use only free tools and APIs

---

## 🌙 Project: An Nur (النور)

### What It Is
A complete free Islamic web app — Qur'an (all 6,236 ayat), 99 Names of Allah, authentic hadith, Prophet stories, prayer times, qibla finder, digital tasbih, du'as, Friday khutbah. No ads, no accounts, no tracking. Sadaqah jariyah for the Ummah.

### Live URL
https://an-nur-eosin.vercel.app

### Tech Stack
- **Pure HTML + CSS + JS** — zero frameworks, zero build step
- **3 files:** `index.html`, `data.js`, `app.js`
- **Fonts:** Fraunces (display, same as Anthropic/Claude.ai) + Geist (body) + Amiri Quran (Arabic)
- **Hosting:** Vercel (free)
- **Analytics:** Umami Cloud — website ID: `5ff00002-dd84-4326-91d1-6a3efa5c6981`

### APIs Used (All Free, No Keys)
| API | Purpose | URL Pattern |
|---|---|---|
| Quran.com v4 | All 6,236 ayat (Arabic + English + Transliteration) | `api.quran.com/api/v4/quran/verses/uthmani?chapter_number={n}` |
| Quran.com v4 | English translation (Saheeh International, ID 131) | `api.quran.com/api/v4/quran/translations/131?chapter_number={n}` |
| Quran.com v4 | Transliteration (ID 1) | `api.quran.com/api/v4/quran/transliterations/1?chapter_number={n}` |
| EveryAyah.com | Audio MP3 recitation | `everyayah.com/data/{reciter}/{surah3}{ayah3}.mp3` |
| Aladhan | Prayer times from GPS | `api.aladhan.com/v1/timings?latitude={lat}&longitude={lng}&method=2` |

### Audio Reciters (EveryAyah IDs)
- `Alafasy_128kbps` — Mishary Alafasy (default)
- `Abdul_Basit_Murattal_192kbps` — Abdul Basit
- `Maher_AlMuaiqly_128kbps` — Maher Al-Muaiqly
- `Minshawi_Murattal_128kbps` — Al-Minshawi

### YouTube Videos Embedded
- **Friday Khutbah:** https://youtu.be/UWAJJ0_yHss
- **99 Names recitation:** https://youtu.be/lgm3puP3tMA?list=RDlgm3puP3tMA

---

## 🎨 Design System (Anthropic-Exact)

### CSS Variables — Light Theme
```css
--bg: #faf9f7        /* warm cream base */
--bg2: #f4f1ec       /* slightly darker surface */
--bg3: #ffffff       /* card/elevated */
--bd1: rgba(0,0,0,.055)   /* subtle border */
--bd2: rgba(0,0,0,.1)     /* default border */
--bd3: rgba(0,0,0,.16)    /* strong border */
--t1: #1a1916        /* primary text */
--t2: #4a4844        /* secondary text */
--t3: #8a8784        /* tertiary text */
--t4: #b5b2ac        /* muted text */
--ac: #c96442        /* terracotta accent (Anthropic orange) */
--ach: #b5572f       /* accent hover */
--acs: rgba(201,100,66,.08)   /* accent soft bg */
--acb: rgba(201,100,66,.2)    /* accent border */
--act: #9e4220       /* accent text */
--gd: #c49a3c        /* gold accent */
--gds: rgba(196,154,60,.08)   /* gold soft */
--gdb: rgba(196,154,60,.2)    /* gold border */
--sg: #5a8a6a        /* sage green */
--sgs: rgba(90,138,106,.08)   /* sage soft */
--sgb: rgba(90,138,106,.2)    /* sage border */
--bl: #4472b8        /* blue accent */
--bls: rgba(68,114,184,.08)   /* blue soft */
--blb: rgba(68,114,184,.2)    /* blue border */
```

### CSS Variables — Dark Theme
```css
--bg: #111110        /* warm near-black */
--bg2: #181816
--bg3: #1f1e1c
--t1: #f0ede8
--t2: #b5b2ac
--t3: #787572
--t4: #525050
--ac: #e07a55        /* brighter coral in dark */
--gd: #d4a84b
--sg: #6aaa7e
--bl: #6898da
```

### Typography
- `--fd: 'Fraunces', Georgia, serif` — display/headings (italic for accents)
- `--fb: 'Geist', -apple-system, sans-serif` — body text
- `--fa: 'Amiri Quran', 'Amiri', serif` — Arabic text
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..500;1,9..144,200..400&family=Geist:wght@300;400;500&family=Amiri+Quran&display=swap`

---

## 📁 File Structure

```
annur/
├── index.html     — All HTML, CSS, page structure (42KB)
├── data.js        — All embedded data (64KB):
│   ├── NAMES[]    — 99 Names of Allah (all with ar, tr, mean, desc)
│   ├── AYAT[]     — 30 curated ayat (for home/daily rotation)
│   ├── HADITH[]   — 46 authentic hadith
│   ├── STORIES[]  — 15 Prophet stories
│   ├── SURAHS[]   — 114 surah metadata
│   └── DUAS[]     — 30 duas by category
├── app.js         — All JS logic (39KB):
│   ├── State management & localStorage
│   ├── Navigation (goPage)
│   ├── Daily rotation (dayOfYear)
│   ├── Search (all content types)
│   ├── Surah grid + full viewer (API)
│   ├── 99 Names display
│   ├── Hadith display
│   ├── Stories display
│   ├── Prayer times (Aladhan API)
│   ├── Tasbih counter
│   ├── Qibla calculator
│   ├── Audio player (EveryAyah)
│   ├── Share modal (Copy/WhatsApp/X)
│   ├── Du'as display
│   └── Bookmarks (localStorage)
├── vercel.json    — Static hosting config
├── README.md      — Full documentation
└── LICENSE        — MIT
```

---

## 📄 Pages (Navigation)

| Page ID | Nav Label | Description |
|---|---|---|
| `home` | Home | Hero, search, daily cards (ayah+name+hadith+story), explore grid |
| `surahs` | Qur'an | 114 surah grid → fullscreen viewer with ALL ayat from API |
| `names` | 99 Names | YouTube embed + all 99 names grid + detail view |
| `hadith` | Hadith | 46 hadith with search, filter, share |
| `stories` | Stories | 15 Prophet stories with lessons |
| `prayer` | Prayer | GPS-based prayer times via Aladhan API |
| `tasbih` | Tasbih | Digital dhikr counter with 5 presets |
| `qibla` | Qibla | Compass pointing to Kaaba using GPS |
| `duas` | Du'as | 30 duas by category with share |
| `khutbah` | Khutbah | YouTube khutbah embed |
| `bookmarks` | Saved | Saved ayat, names, hadith |
| `about` | — | About page (accessible via mobile nav) |

---

## 💾 localStorage Keys

| Key | Value | Description |
|---|---|---|
| `annur_bm` | JSON array | Bookmarks: `[{type:'ayah',s,a}, {type:'name',n}, {type:'hadith',en}]` |
| `annur_rec` | string | Selected reciter ID |
| `annur_th` | `'light'` or `'dark'` | Theme preference |
| `annur_fs` | number | Font size for Quran reader (default 18) |
| `annur_tas` | number | Tasbih count |
| `annur_tas_t` | number | Tasbih target |
| `annur_tas_d` | string | Tasbih dhikr Arabic |
| `annur_tas_tr` | string | Tasbih dhikr transliteration |

---

## 🔑 Key Functions in app.js

```js
goPage(p)               // Navigate to page
toggleTheme()           // Light/dark toggle
renderDaily()           // Renders 4 daily cards (uses dayOfYear())
dayOfYear()             // Returns day number 1-365 for rotation
doSearch()              // Searches AYAT + NAMES + HADITH + STORIES
openSurah(num)          // Opens fullscreen surah viewer
fetchFullSurah(num)     // Fetches from Quran.com API (caches in SURAH_CACHE)
renderFullSurah(num, meta, verses) // Renders loaded surah
downloadSurah(num)      // Downloads surah as .txt
toggleSurahTr()         // Toggle transliteration visibility
playAyah(uid, s, a)     // Play audio from EveryAyah
playFullSurah(num)      // Auto-play entire surah
loadPrayerTimes()       // Gets GPS + fetches Aladhan API
getQibla()              // Calculates qibla bearing from GPS
calculateQibla(lat,lng) // Returns bearing to Kaaba
incTasbih()             // Increment counter + haptic vibration
openShare(type, idx)    // Open share modal
openShareAyah(s, a)     // Share a specific ayah
copyShare()             // Copy to clipboard
waShare()               // Share via WhatsApp
xShare()                // Post on X/Twitter
renderDuas(cat)         // Render du'as filtered by category
renderBookmarks()       // Renders saved items page
```

---

## 📊 Data Counts

| Dataset | Count | Source |
|---|---|---|
| Curated Ayat (home/daily) | 30 | Embedded in data.js |
| Full Qur'an | 6,236 | Quran.com API (live) |
| Surah metadata | 114 | Embedded in data.js |
| Names of Allah | 99 | Embedded in data.js |
| Hadith | 46 | Embedded in data.js |
| Prophet Stories | 15 | Embedded in data.js |
| Du'as | 30 | Embedded in data.js |

---

## 🚀 Deployment

**Vercel (current):**
- Project URL: https://an-nur-eosin.vercel.app
- To update: drag new zip into Vercel dashboard OR push to GitHub and it auto-deploys

**GitHub repo (recommended):**
```bash
git init
git add .
git commit -m "update"
git remote add origin https://github.com/YOUR_USERNAME/an-nur.git
git push -u origin main
```
Then in Vercel: connect GitHub repo for auto-deploy on every push.

---

## 🎯 Important Design Rules (Never Break These)

1. **Bismillah banner** always at the very top of the page (above header)
2. **Fraunces italic** for hero text accents (e.g. `An <em>Nur</em>`)
3. **Amiri Quran** for ALL Arabic text — never use system fonts for Arabic
4. **Anthropic terracotta** `#c96442` as primary accent — never change this
5. **Zero ads, zero tracking** (except Umami which is privacy-first)
6. **No account required** for anything — ever
7. **All APIs free** — never add anything that requires payment
8. **Mobile first** — test at 375px width minimum
9. **Dark mode** must always be fully implemented alongside light mode
10. **Share button** on every piece of content — this is how the app spreads

---

## 🔧 Known Issues & Notes

- **Audio blocked in Claude preview iframe** — works fine on Vercel. Don't try to fix this.
- **Quran.com API blocked in Claude preview** — works fine on Vercel. Don't try to fix this.
- **Transliteration API endpoint:** `api.quran.com/api/v4/quran/transliterations/1` — ID 1 is the standard Latin transliteration
- **SURAH_CACHE** object caches loaded surahs in memory — cleared on page refresh
- **Share text** always appends `an-nur-eosin.vercel.app` as watermark

---

## 📝 Style Conventions

```css
/* Card pattern */
.card { background:var(--bg3); border:.5px solid var(--bd2); border-radius:16px; padding:1.4rem 1.6rem; box-shadow:var(--sh1); }

/* Pill pattern */
.pill { display:inline-flex; padding:3px 10px; border-radius:20px; font-size:11.5px; }

/* Section header pattern */
.sh { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:1.25rem; border-bottom:.5px solid var(--bd1); padding-bottom:.75rem; }
```

---

*Last updated: April 2026 · May Allah accept this sadaqah jariyah from Saif. 🤍*
