# 🌙 An Nur — القرآن الكريم

> **"Allah is the Light of the heavens and the earth."** — An-Nur 24:35

A beautiful, free, fully offline-capable Qur'an discovery tool. Find any ayah you half-remember — by meaning, transliteration, surah, or theme — with audio recitation from 4 of the most beloved reciters.

**[→ Live Demo](https://your-username.github.io/an-nur)**

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **Smart Search** | Search 48 beloved ayat by meaning, transliteration, surah name, or theme |
| 📖 **All 114 Surahs** | Full index with English/Arabic names, meanings, ayat count, Makki/Madani |
| 🗂️ **16 Topic Cards** | Browse by Mercy, Patience, Forgiveness, Hope, Tawakkul, Light, and more |
| 🌙 **Ayah of the Day** | Rotates daily — a new ayah every morning |
| 🎧 **Audio Recitation** | 4 reciters: Mishary Alafasy, Abdul Basit, Maher Al-Muaiqly, Al-Minshawi |
| 🔖 **Bookmarks** | Save your favourites — persists across sessions via localStorage |
| ☀️🌙 **Light & Dark Mode** | Anthropic-exact palette — warm cream light, warm near-black dark |
| 📱 **Fully Responsive** | Works beautifully on mobile, tablet, and desktop |
| ⚡ **Zero Dependencies** | Single HTML file, no build step, no backend, no API keys |
| 🆓 **Free Forever** | Built as sadaqah jariyah for the Ummah |

---

## 🚀 Deploy in 60 Seconds

### Option 1 — GitHub Pages (Recommended, Free)

```bash
# 1. Fork or clone this repo
git clone https://github.com/your-username/an-nur.git
cd an-nur

# 2. Push to GitHub
git add .
git commit -m "initial commit"
git push origin main

# 3. Go to Settings → Pages → Source: main branch / root
# Your site will be live at: https://your-username.github.io/an-nur
```

### Option 2 — Netlify (Free, Instant)

1. Go to [netlify.com](https://netlify.com) → "Deploy manually"
2. Drag and drop the `index.html` file
3. Done — live in seconds with a custom URL

### Option 3 — Vercel (Free)

```bash
npx vercel --prod
```

### Option 4 — Any Static Host

Just upload `index.html` anywhere that serves static files. That's it.

---

## 🛠️ Tech Stack

- **Zero frameworks** — pure HTML, CSS, JavaScript
- **Fonts** — Fraunces (display, same as Anthropic.com) + Geist (body) + Amiri Quran (Arabic)
- **Audio** — [EveryAyah.com](https://everyayah.com) (free MP3 CDN, no API key)
- **Data** — All 48 curated ayat fully embedded with Arabic text (with tashkeel), transliteration, and Saheeh International translation
- **Storage** — localStorage for bookmarks and preferences

---

## 📁 Project Structure

```
an-nur/
├── index.html          # The entire app — single self-contained file
├── README.md           # This file
├── LICENSE             # MIT License
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploy to GitHub Pages on push
```

---

## 🎨 Design

Built with the exact Anthropic/Claude.ai design language:

- **Typography** — Fraunces (editorial serif, same as anthropic.com) + Geist
- **Light theme** — warm cream base `#faf9f7`, terracotta accent `#c96442`
- **Dark theme** — warm near-black `#111110`, coral accent `#e07a55`
- **Motion** — subtle fade-up animations, hover states, micro-interactions

---

## 🎙️ Reciters

| Reciter | Style |
|---|---|
| Mishary Rashid Alafasy | Murattal — clear, melodic |
| Abdul Basit Abdus Samad | Mujawwad — classical, revered |
| Maher Al-Muaiqly | Murattal — Madinah, warm |
| Mahmoud Khalil Al-Minshawi | Murattal — deeply moving |

---

## 📿 Data

- **48 curated ayat** — hand-selected beloved ayat with full Arabic (with tashkeel), transliteration (with diacritics), and Saheeh International English translation
- **114 surahs** — complete metadata for the entire Qur'an
- **16 topics** — Mercy, Patience, Gratitude, Forgiveness, Hope, Strength, Tawakkul, Light, Du'a, Tawheed, Paradise, Knowledge, Brotherhood, Repentance, Peace, Creation

---

## 🤲 Intention

*This project was built as sadaqah jariyah — a continuing charity — for the Muslim Ummah worldwide. It is free, will always be free, and carries no ads. May Allah accept it.*

> اللَّهُمَّ تَقَبَّلْ مِنَّا

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 🌙 Coming Soon

- [ ] Full Qur'an search (all 6,236 ayat)
- [ ] Fuzzy/phonetic transliteration matching
- [ ] Related ayat
- [ ] Memorization helper
- [ ] Tafsir integration
- [ ] PWA / installable app

---

*Built with love. May Allah guide us all to the straight path. 🤍*
