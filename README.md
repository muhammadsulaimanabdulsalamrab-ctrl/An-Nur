# 🌙 An Nur — Qur'an · Hadith · The Names of Allah

> **"Allah is the Light of the heavens and the earth."** — An-Nur 24:35

A complete, free, production-ready Islamic knowledge companion. All 114 Surahs (6,236 ayat via Quran.com API), 99 Names of Allah, 45+ authentic hadith, 15 Prophet stories, prayer times, qibla finder, digital tasbih, and Friday khutbah — all in one beautiful interface.

**[→ Deploy to Vercel in 60 seconds](#-deploy-in-60-seconds)**

---

## ✨ All Features (50+)

### 📖 Qur'an (Complete)
- **All 114 Surahs** browsable with Arabic, English, meaning, ayat count, Makki/Madani
- **All 6,236 ayat** via Quran.com API (free, no key needed)
- Surah search by English name, Arabic name, or meaning
- Filter by Makki / Madani
- Full surah reader with continuous scroll
- Font size adjustment (A−/A+) — persists across sessions
- **Play entire surah** with auto-advance between ayat
- Bismillah shown at start of every surah (except At-Tawbah)
- Per-ayah audio from 4 reciters: Mishary Alafasy, Abdul Basit, Maher Al-Muaiqly, Al-Minshawi
- Seekable audio progress bar with current/total time
- Reciter preference saved in localStorage
- Fallback URLs — if one reciter fails, auto-retries with Alafasy

### ✨ 99 Names of Allah (Al-Asma ul-Husna)
- All 99 names with Arabic, transliteration, meaning, detailed description
- Search any name by English, transliteration, or description
- Individual name detail page with enlarged Arabic
- Bookmark any name
- Hadith of the Prophet ﷺ about reciting the names

### 📜 Authentic Hadith (45+)
- From **Sahih Bukhari**, **Sahih Muslim**, **40 Nawawi**, **Tirmidhi**, **Abu Dawud**, **Ibn Majah**, **Nasa'i**
- Each hadith: Arabic, English, narrator, source, authenticity grade (Sahih/Hasan)
- 40 Nawawi hadith specially marked with their number
- Category tags: Intention, Character, Brotherhood, Speech, Worship, Mercy, Gratitude, Knowledge, Charity, Family, Tawheed, Faith
- Search hadith by text, narrator, category, or source
- Bookmark any hadith

### 🌙 Prophet Stories (15)
- Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, Muhammad ﷺ, Yunus, Ayyub, Sulaiman, Maryam, Khadija, Asiya, People of the Cave, Luqman
- Each story: full narrative, reflection/lesson, beautiful icon card
- Anchored links so daily story card jumps directly to full story

### 🕌 Prayer Times
- **Automatic geolocation** — gets your location (with permission)
- Uses Aladhan API (free) — ISNA method
- Shows Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
- **Highlights the next prayer** automatically
- Shows both Gregorian and Hijri dates
- Refresh button if location changes

### 🧭 Qibla Finder
- Calculates exact bearing to the Ka'bah from your GPS location
- Visual compass with rotating needle pointing to Makkah 🕋
- Shows degree from North
- Shows your coordinates

### 📿 Digital Tasbih Counter
- Large tap-to-count button with haptic vibration (on mobile)
- **5 preset dhikr**:
  - SubhanAllah (33)
  - Alhamdulillah (33)
  - Allahu Akbar (34)
  - La ilaha illa Allah (100)
  - Astaghfirullah (100)
- Target tracking — toast notification when target reached
- Count persists across sessions
- Reset button

### 🎥 Friday Khutbah
- Embedded link to [your YouTube khutbah](https://youtu.be/UWAJJ0_yHss)
- Beautiful thumbnail with play button
- Opens in new tab on YouTube
- Supporting hadith about Jumu'ah

### 🔍 Universal Search
- Search across **all content types** simultaneously — ayat, names, hadith, stories
- Filter by category (All / Ayat / Names / Hadith / Stories)
- Debounced live search — starts 250ms after you stop typing
- Highlights matching terms in results
- Grouped results with counts per category

### 🔖 Saved Items (Bookmarks)
- Bookmark any ayah, name, or hadith
- All bookmarks persist in localStorage
- Organized by type (Ayat / Names / Hadith) on the Saved page
- Count shown in header

### ✦ Daily Rotation
- Every day the homepage shows:
  - A new **Ayah of the Day**
  - A new **Name of Allah** (cycles through all 99)
  - A new **authentic Hadith**
  - A new **Prophet Story**
- Based on day-of-year — same for everyone worldwide, changes at midnight
- Date shown in header

### 🎨 Design & UX
- **Fraunces** (editorial serif, same as Claude.ai/Anthropic.com) + **Geist** (body) + **Amiri Quran** (Arabic)
- **Anthropic-exact color palette** — warm cream light theme, warm near-black dark theme
- Terracotta accent (#c96442), gold accent (#c49a3c), sage green (#5a8a6a)
- Light/Dark mode toggle — persists across sessions
- Bismillah banner pinned at the top of every page
- Favicon with Arabic ن letter
- Smooth page transitions, staggered fade-up animations
- Backdrop-blur glassmorphism header
- Custom hover states, micro-interactions

### 📱 Fully Mobile Responsive
- Hamburger menu with full-screen mobile navigation
- Stats collapse to 2-column on small screens
- Daily grid becomes single column on narrow viewports
- Horizontal-scroll tab nav on tablet
- Touch-optimized buttons (min 32×32px)
- Works from 320px width up to 4K

### ⚙️ Other Features
- **Zero build step** — plain HTML/CSS/JS
- **Zero dependencies** (npm/yarn-free)
- **Zero tracking, zero ads, zero accounts**
- Works offline for local data (names, hadith, stories)
- PWA-ready (can be installed to home screen)
- Accessible keyboard navigation
- Semantic HTML

---

## 🚀 Deploy in 60 Seconds

### Option 1 — Vercel (Recommended, Free, Instant)

```bash
# Clone or download this repo
# Then just:
npx vercel --prod
```

Or via Vercel Web UI:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repo from GitHub (or drag & drop the folder)
3. Click **Deploy** — done in 30 seconds
4. Your site is live at `your-project.vercel.app`

### Option 2 — GitHub Pages

```bash
# 1. Push to GitHub
git add .
git commit -m "launch An Nur"
git push origin main

# 2. Settings → Pages → Source: main branch / root
# Live at: https://your-username.github.io/an-nur
```

### Option 3 — Netlify

1. Go to [netlify.com](https://app.netlify.com/drop)
2. Drag & drop this folder
3. Live instantly with auto-generated URL

### Option 4 — Any Static Host

Upload the three files (`index.html`, `data.js`, `app.js`) anywhere. No server, no backend, no configuration.

---

## 📁 Project Structure

```
annur/
├── index.html      # Main HTML — all pages, layout, styling
├── data.js         # All embedded data (99 Names, hadith, stories, ayat, surahs)
├── app.js          # All application logic (search, audio, API calls, etc.)
├── vercel.json     # Vercel config (static routing)
├── README.md       # This file
└── LICENSE         # MIT
```

Just **3 files** to deploy. Total size: ~150KB unzipped. Loads instantly.

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Frontend** | Plain HTML, CSS, JavaScript — no framework, no build |
| **Fonts** | Fraunces (display) + Geist (body) + Amiri Quran (Arabic) via Google Fonts |
| **Qur'an Data** | [Quran.com API v4](https://api-docs.quran.com/) — free, open, no key |
| **Audio** | [EveryAyah.com](https://everyayah.com) — free MP3 CDN |
| **Prayer Times** | [Aladhan API](https://aladhan.com/prayer-times-api) — free |
| **Storage** | localStorage (bookmarks, theme, reciter, tasbih) |
| **Hosting** | Vercel / GitHub Pages / Netlify / any static host |

---

## 🌐 APIs Used (All Free, No Keys)

1. **Quran.com API** — `api.quran.com/api/v4/quran/verses/uthmani` for Arabic and `/quran/translations/131` for Saheeh International English. Loads full surahs on demand.
2. **EveryAyah** — `everyayah.com/data/{reciter}/{surah3}{ayah3}.mp3` for audio recitation
3. **Aladhan** — `api.aladhan.com/v1/timings` for prayer times from GPS coordinates

All APIs work on Vercel, GitHub Pages, Netlify, etc. They're blocked only in some sandboxed preview iframes.

---

## 🤲 Intention

*This project was built as sadaqah jariyah — a continuing charity — for the Ummah. It is free, will always be free, and carries no ads, no accounts, no tracking. May Allah accept it.*

> اللَّهُمَّ تَقَبَّلْ مِنَّا

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 🌙 Future Features (Contributions Welcome)

- [ ] Multiple translations (Pickthall, Yusuf Ali, French, Urdu, Turkish)
- [ ] Tafsir integration (Ibn Kathir, Saadi)
- [ ] Ramadan mode with fasting times and Taraweeh tracker
- [ ] Hajj & Umrah guide
- [ ] Memorization helper with spaced repetition
- [ ] Daily Islamic calendar events
- [ ] More Prophet stories (Dawud, Zakariyya, Yahya, Dhul-Qarnayn)
- [ ] Duas for every occasion
- [ ] Offline PWA with full cached Qur'an

---

*Built with love for the Ummah. May Allah guide us all to the straight path. 🤍*

**اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ**
