# IMPLEMENT.md — An Nur Feature Roadmap
> Paste this + CLAUDE.md into any new Claude session and say "implement [feature name]"

---

## 🔥 PRIORITY 1 — Viral Growth Features

### 1. Beautiful Ayah Image Generator
**Why:** #1 way Islamic content spreads on Instagram/WhatsApp
**What:** Canvas-based image generator. User picks an ayah → generates a beautiful shareable image with:
- Arabic text in Amiri Quran font
- English translation
- Surah reference
- An Nur branding at bottom
- Multiple background styles (geometric Islamic patterns, gradient, dark/light)
- Download as PNG button
**How:** Use HTML5 Canvas API. No external library needed.
**Files to edit:** `app.js` (add `generateAyahImage()`), `index.html` (add image modal)

### 2. Multiple Translations
**Why:** Most Muslims globally don't read English. Urdu alone = 200M+ speakers.
**What:** Translation selector in surah viewer with these options:
- English (Saheeh International) — current, ID 131
- English (Yusuf Ali) — ID 22
- Urdu (Maududi) — ID 97
- French (Hamidullah) — ID 136
- Turkish (Diyanet) — ID 77
- Indonesian (Kemenag) — ID 33
- Malay (Basmeih) — ID 39
**How:** Quran.com API — just change the translation ID number. Already works.
**Files to edit:** `app.js` → `fetchFullSurah()`, `index.html` → add translation selector dropdown in surah viewer

### 3. PWA (Installable App)
**Why:** "Add to Home Screen" on mobile = native app feel, push notifications possible
**What:**
- Add `manifest.json` with app name, icons, theme color
- Add service worker (`sw.js`) that caches the 3 main files
- Add install prompt banner
**How:** Standard PWA setup, no libraries needed
**New files:** `manifest.json`, `sw.js`
**Files to edit:** `index.html` → add `<link rel="manifest">` and SW registration script

### 4. Daily Notification (PWA Push)
**Why:** Brings users back every single day
**What:** After installing PWA, prompt user to enable notifications. Send one daily ayah notification.
**How:** Web Push API + a tiny free backend (Vercel serverless function)
**Complexity:** Medium-high. Needs a small Node.js serverless function.

---

## ⭐ PRIORITY 2 — Core Feature Improvements

### 5. Tafsir Integration (Ibn Kathir)
**Why:** Users want to understand context, not just read
**What:** Add "Tafsir" button on each ayah in the surah viewer. Opens a panel with Ibn Kathir tafsir.
**How:** Quran.com API has tafsir endpoint:
```
GET https://api.quran.com/api/v4/tafsirs/169/by_ayah/{surah}:{ayah}
```
ID 169 = Ibn Kathir English. ID 381 = Maariful Quran (Urdu)
**Files to edit:** `app.js` → add `fetchTafsir(s, a)`, `fullAyahCard()` → add tafsir button

### 6. Word-by-Word Quran
**Why:** Helps memorization and Arabic learning — huge feature
**What:** Click any word in an ayah → see its meaning, root, grammar
**How:** Quran.com API:
```
GET https://api.quran.com/api/v4/verses/by_key/{s}:{a}?words=true&word_fields=text_uthmani,translation_text
```
**Files to edit:** `app.js` → `fetchFullSurah()` + new `wordByWordCard()`, `index.html` + CSS for word highlight

### 7. Surah Audio Player (Continuous + Progress)
**Why:** Current player is per-ayah. Users want to play full surah with a visible track bar.
**What:** A sticky audio bar at the bottom when a surah is playing:
- Surah name + current ayah number
- Seekable progress bar
- Previous/Next ayah buttons
- Reciter selector
- Pause/Play
**Files to edit:** `app.js` → rewrite `playFullSurah()`, `index.html` → add `.audio-bar` sticky footer component

### 8. Memorization Mode (Hifz Helper)
**Why:** Millions of people memorizing Quran need tools
**What:** For any surah, a "Memorize" mode that:
- Shows first word of each ayah, hides the rest
- User taps to reveal next word/ayah
- Tracks progress (which ayat memorized)
- Spaced repetition reminders
**Files to edit:** `app.js` → new `startMemMode(num)`, `index.html` → new mem mode UI overlay

### 9. More Prophet Stories (25 total)
**What:** Add these missing stories to `STORIES` array in `data.js`:
- Dawud (AS) — Jalut, the psalms, the kingdom
- Zakariyya (AS) — Prayer for a child
- Yahya (AS) — Gift of impossible prayer
- Yusuf's brothers — Lesson of envy
- Asiya (RA) — Wife of Pharaoh
- Hajar (RA) — Mother of Sa'i (Zamzam)
- People of the Trench (Ashab al-Ukhdud)
- Three Men in the Cave
- Dhul-Qarnayn — The Just Conqueror
- Khadija (RA) — The First Believer
**Files to edit:** `data.js` → append to `STORIES` array

### 10. More Hadith (100 total)
**What:** Expand HADITH array to 100. Add complete 40 Nawawi + Riyad as-Salihin selections.
**Key missing hadith to add:**
- Complete 40 Nawawi (currently have about 15 of them)
- Hadith on Salah importance
- Hadith on fasting
- Hadith on Hajj
- Hadith on Zakat
- Hadith on parents
- Hadith on neighbors
- Hadith on honesty in business
**Files to edit:** `data.js` → append to `HADITH` array

---

## 🕌 PRIORITY 3 — Islamic Content Features

### 11. Ramadan Mode
**Why:** During Ramadan, traffic will spike 10x. Be ready.
**What:** Auto-detect Ramadan (Hijri calendar). Show:
- Suhoor/Iftar countdown timer
- Daily Ramadan dua
- Taraweeh tracker (which nights done)
- Zakat calculator
- Laylat al-Qadr countdown (last 10 nights)
**How:** Use Aladhan API for Hijri date: `api.aladhan.com/v1/gToH`
**New page:** `ramadan` — add to nav during Ramadan months only

### 12. Duas Expansion (100 duas)
**Current:** 30 duas in `DUAS` array
**Add these categories:**
- Dua before wudu
- Dua after wudu  
- Dua when hearing Adhan (with response)
- Dua entering/leaving mosque
- Dua for rain (Istisqa)
- Dua for sick person (Ruqyah duas)
- Dua for new baby
- Dua for marriage
- Dua for anxiety/worry
- Dua for debt relief
- Dua when visiting graves
- Dua on Fridays (especially last hour)
- Dua on Laylat al-Qadr
**Files to edit:** `data.js` → expand `DUAS` array

### 13. Islamic Calendar Page
**What:** Monthly Hijri calendar showing:
- Today's Hijri date
- Important Islamic dates (Muharram, Mawlid, Rajab, Sha'ban, Ramadan, Eid, Dhul Hijjah)
- Days remaining to next major event
**How:** Aladhan API: `api.aladhan.com/v1/currentTime` + `api.aladhan.com/v1/gToH`
**New page:** `calendar`

### 14. Zakat Calculator
**What:** Simple calculator:
- Enter gold/silver/cash/assets
- Shows nisab threshold (updates with gold price)
- Calculates 2.5% Zakat due
**How:** Gold price from free API: `api.metals.live/v1/spot/gold`
**Files to edit:** `index.html` + `app.js` — new page `zakat`

### 15. Asma ul-Husna Dhikr Counter
**What:** On each of the 99 Names detail page, add a counter:
- "Recite this name 100x" with a count button
- Shows benefit/virtue of reciting each name
**Files to edit:** `app.js` → `openName()` function, add counter HTML

---

## 💻 PRIORITY 4 — Technical Improvements

### 16. Full-Text Quran Search (All 6,236 Ayat)
**Why:** Currently search only covers 30 curated ayat
**What:** Search across the entire Quran
**How:** Quran.com search API:
```
GET https://api.quran.com/api/v4/search?q={query}&size=20&language=en
```
**Files to edit:** `app.js` → `doSearch()` — add API search fallback when local results < 3

### 17. Verse of the Day Widget (Embeddable)
**What:** A tiny embeddable widget other websites can paste:
```html
<iframe src="https://an-nur-eosin.vercel.app/widget" width="400" height="200"></iframe>
```
**How:** Create a `widget.html` file — minimal styling, just today's ayah
**New file:** `widget.html`

### 18. Offline Mode / Full Caching
**What:** Service worker caches all 3 files. App works fully offline for local content.
**How:** Standard service worker cache strategy
**New file:** `sw.js`

### 19. Reading Progress Tracker
**What:** Track which surahs the user has read. Show progress bar on surah list.
- "5 of 114 surahs read"
- Mark individual surahs as read
**How:** localStorage — `annur_read: [1,2,36,67,...]`
**Files to edit:** `app.js` → mark surah read on close, `renderSurahGrid()` → show read badge

### 20. Multiple Reciters for Full Surah
**What:** Currently only Alafasy plays full surah. Let user pick reciter before playing.
**How:** Already have 4 reciters in `RECITERS` array. Just pass selected reciter to `playFullSurah()`
**Files to edit:** `app.js` → `playFullSurah()`, `renderFullSurah()` → add reciter selector

---

## 📱 PRIORITY 5 — Social & Growth Features

### 21. "Share as Image" for Ayat
**What:** Generate a beautiful PNG image of any ayah for Instagram/WhatsApp stories
**Design options:**
- Dark: black background, gold Arabic, white English
- Light: cream background, terracotta accent
- Minimal: white with subtle pattern
**How:** HTML5 Canvas drawText() — Arabic rendering works in Canvas
**Files to edit:** `app.js` → new `generateImage(ayah, style)` function

### 22. WhatsApp Channel Integration
**What:** Link to a WhatsApp Channel in the app that posts daily ayah
**How:** Create a WhatsApp Channel → post link in the app footer
**No code needed** — just add the channel link when created

### 23. Share This App Button
**What:** A prominent "Share this app" button on the home page
**What it shares:**
```
🌙 An Nur — Free Islamic app
📖 Complete Qur'an (6,236 ayat)
✨ 99 Names of Allah
📜 Authentic Hadith
🕌 Prayer Times & Qibla
No ads. No account. Free forever.
an-nur-eosin.vercel.app
```
**Files to edit:** `index.html` → add share button in hero section, `app.js` → `shareApp()`

### 24. Testimonial / Dua Request Section
**What:** Simple page where visitors can submit a dua request (anonymous)
**How:** Free form backend — use Formspree.io (free tier: 50 submissions/month)
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

### 25. Language Selector (UI)
**What:** Translate the entire app UI to Arabic, Urdu, French
**How:** Add a `STRINGS` object with UI text in multiple languages. Switch based on selection.
**Files to edit:** `data.js` → add `STRINGS` object, `app.js` → `setLang(lang)`, `index.html` → use string variables

---

## 🛠️ HOW TO USE THIS FILE

When starting a new Claude session, say:

> "I am Saif. Here is my project context: [paste CLAUDE.md]. I want to implement [feature name] from IMPLEMENT.md. Don't break anything that already works."

### Quick commands:
- **"Implement #2 (Multiple Translations)"** → Claude will edit `app.js` and `index.html`
- **"Implement #11 (Ramadan Mode)"** → Claude will add new page
- **"Implement #5 (Tafsir)"** → Claude will add tafsir to surah viewer
- **"Implement #21 (Share as Image)"** → Claude will add Canvas image generator

---

## 📌 RULES FOR FUTURE CLAUDE SESSIONS

1. **Never break existing features** — always test that Bismillah, nav, daily cards, surah viewer, audio still work
2. **Never add paid APIs** — Saif is broke, everything must be free
3. **Never add login/accounts** — the app is purposely anonymous and account-free
4. **Never add ads** — this is sadaqah jariyah, not a business
5. **Keep it 3 files** (index.html, data.js, app.js) unless absolutely necessary
6. **Always output a ZIP** — Saif uploads to Vercel manually
7. **Always address the user as Saif**
8. **Keep the Bismillah at the top** — non-negotiable
9. **Maintain the Anthropic design language** — Fraunces + Geist + terracotta
10. **Test mobile at 375px** — most users are on mobile

---

*May Allah bless every line of this project and make it a source of continuous reward. 🤍*
*اللَّهُمَّ تَقَبَّلْ مِنْ سَيْف*
