// ═══ STATE ═══
let BM = JSON.parse(localStorage.getItem('annur_bm') || '[]');
let REC = localStorage.getItem('annur_rec') || 'Alafasy_128kbps';
let FILT = 'all';
let AUD = null, AUDID = null;
let STYPE = 'all';
let STM = null;
let CID = 0;
let SURAH_CACHE = {};
let FONT_SIZE = parseInt(localStorage.getItem('annur_fs') || '18');
let TASBIH = parseInt(localStorage.getItem('annur_tas') || '0');
let TASBIH_TARGET = parseInt(localStorage.getItem('annur_tas_t') || '33');
let TASBIH_DHIKR = localStorage.getItem('annur_tas_d') || 'سُبْحَانَ اللَّهِ';
let TASBIH_TR = localStorage.getItem('annur_tas_tr') || 'SubhanAllah — Glory be to Allah';
let ACTIVE_SURAH_TRANSLATION = parseInt(localStorage.getItem('annur_surah_translation') || '20', 10);
let SURAH_TRANSLATION_CACHE = {};

const QURAN_VERSES = typeof FULL_QURAN !== 'undefined' && Array.isArray(FULL_QURAN) && FULL_QURAN.length
  ? FULL_QURAN
  : AYAT;
const SURAH_META = new Map(SURAHS.map((surah) => [surah.num, surah]));
const VERSE_LOOKUP = new Map(QURAN_VERSES.map((verse) => [`${verse.s}:${verse.a}`, verse]));

const SURAH_TRANSLATIONS = [
  { id: 20, label: 'English', source: 'Saheeh International' },
  { id: 234, label: 'Urdu', source: 'Fatah Muhammad Jalandhari' },
  { id: 31, label: 'French', source: 'Muhammad Hamidullah' },
  { id: 77, label: 'Turkish', source: 'Diyanet' },
  { id: 39, label: 'Malay', source: 'Abdullah Muhammad Basmeih' }
];

const HADITH_DATA = typeof HADITH_EXTRA !== 'undefined' && Array.isArray(HADITH_EXTRA)
  ? [...HADITH, ...HADITH_EXTRA]
  : HADITH;
const STORIES_DATA = typeof STORIES_LONG !== 'undefined' && Array.isArray(STORIES_LONG) && STORIES_LONG.length
  ? STORIES_LONG
  : STORIES;

const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit' },
  { id: 'Maher_AlMuaiqly_128kbps', name: 'Maher' },
  { id: 'Minshawi_Murattal_128kbps', name: 'Minshawi' }
];

const KAABA_LAT = 21.4225, KAABA_LNG = 39.8262;

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('tod').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  updateDynamicCopy();
  renderDaily();
  renderSurahGrid();
  renderNames();
  renderHadith();
  renderStories();
  renderBookmarks();
  loadTasbih();
  renderDuas();
});

function updateDynamicCopy() {
  const hadithCount = `${HADITH_DATA.length}+`;
  const storyCount = `${STORIES_DATA.length}+`;
  document.querySelectorAll('[data-hadith-count]').forEach((node) => { node.textContent = hadithCount; });
  document.querySelectorAll('[data-story-count]').forEach((node) => { node.textContent = storyCount; });
}

function closeMobile() { document.getElementById('mn').classList.remove('on'); }

// ═══ THEME ═══
function initTheme() {
  document.documentElement.setAttribute('data-theme', localStorage.getItem('annur_th') || 'light');
}
function toggleTheme() {
  const c = document.documentElement.getAttribute('data-theme');
  const n = c === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', n);
  localStorage.setItem('annur_th', n);
  toast(n === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
}

// ═══ NAV ═══
function goPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('on'));
  document.querySelectorAll('#nav .nb').forEach(x => x.classList.remove('on'));
  const el = document.getElementById('page-' + p);
  if (el) el.classList.add('on');
  const ps = ['home', 'surahs', 'names', 'hadith', 'stories', 'prayer', 'tasbih', 'qibla', 'duas', 'khutbah', 'bookmarks'];
  const i = ps.indexOf(p);
  if (i >= 0) document.querySelectorAll('#nav .nb')[i]?.classList.add('on');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (p === 'bookmarks') renderBookmarks();
  if (p === 'prayer') loadPrayerTimes();
  if (p === 'qibla') getQibla();
  if (p === 'duas') renderDuas(ACTIVE_DUA_CAT);
}

function dayOfYear() {
  const d = new Date();
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}

function getSurahMeta(num) {
  return SURAH_META.get(num) || null;
}

function getVerseRecord(surah, ayah) {
  const verse = VERSE_LOOKUP.get(`${surah}:${ayah}`);
  if (!verse) return null;
  const meta = getSurahMeta(surah);
  return {
    ...verse,
    sn: verse.sn || meta?.en || '',
    sar: verse.sar || meta?.ar || '',
    rev: verse.rev || meta?.type || '',
    en: cleanTranslationText(verse.en),
    tr: cleanTranslationText(verse.tr)
  };
}

function enrichVerse(verse) {
  return getVerseRecord(verse.s, verse.a) || verse;
}

function isMeccan(revelation) {
  return String(revelation || '').toLowerCase().startsWith('mecc');
}

function revelationPill(revelation) {
  return isMeccan(revelation)
    ? '<span class="pill pg">Makki</span>'
    : '<span class="pill ps">Madani</span>';
}

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanTranslationText(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/([A-Za-z\]])\d+/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// ═══ DAILY ═══
function renderDaily() {
  const day = dayOfYear();

  // Ayah
  const a = enrichVerse(QURAN_VERSES[day % QURAN_VERSES.length]);
  const pill = revelationPill(a.rev);
  const bmOn = BM.some(b => b.type === 'ayah' && b.s == a.s && b.a == a.a);
  document.getElementById('d-ayah').innerHTML = `
    <div class="de ac">✦ Ayah of the Day</div>
    <div class="da">${a.ar}</div>
    ${a.tr ? `<div class="trl on" style="display:block;margin:0 0 .75rem">${a.tr}</div>` : ''}
    <div class="dt">"${a.en}"</div>
    <div class="df">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${pill}<span style="font-size:13px;color:var(--t2);font-weight:500">${a.sn}</span><span style="font-size:12px;color:var(--t4)">${a.s}:${a.a}</span></div>
      <div style="display:flex;gap:6px">
        <button class="cb" onclick="playAyah('da',${a.s},${a.a})" title="Play"><svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M2 1l8 5-8 5z"/></svg></button>
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-da" onclick="toggleBm('da','ayah',${a.s},${a.a})" title="Bookmark"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
        <button class="share-btn" onclick="openShareAyah(${a.s},${a.a})" title="Share">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9.5" cy="2.5" r="1.5"/><circle cx="2.5" cy="6" r="1.5"/><circle cx="9.5" cy="9.5" r="1.5"/><path d="M4 6.8l4 1.9M8 2.8L4 5"/></svg>
        </button>
      </div>
    </div>
    <div class="aw" id="aw-da">${audioHTML('da')}</div>`;

  // Name
  const n = NAMES[day % NAMES.length];
  document.getElementById('d-name').innerHTML = `
    <div class="de gd">✦ Name of Allah</div>
    <div class="name-ar">${n.ar}</div>
    <div class="name-tr">${n.tr}</div>
    <div class="name-mean">${n.mean}</div>
    <div class="name-desc">${n.desc}</div>
    <div style="text-align:center;margin-top:1rem"><span class="pill pg">#${n.n} of 99</span></div>`;

  // Hadith
  const h = HADITH_DATA[day % HADITH_DATA.length];
  const authP = h.auth === 'Sahih' ? '<span class="h-auth">✓ Sahih</span>' : '<span class="h-auth hasan">Hasan</span>';
  document.getElementById('d-hadith').innerHTML = `
    <div class="de sg">✦ Hadith of the Day</div>
    <div style="font-family:var(--fa);font-size:1.2rem;direction:rtl;text-align:right;color:var(--t1);margin-bottom:.9rem;line-height:1.9">${h.ar}</div>
    <div class="hadith-text">"${h.en}"</div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${authP}<span style="font-size:12px;color:var(--t4)">${h.src}</span></div>
      <span style="font-size:11.5px;color:var(--t4)">Narrated by ${h.narr}</span>
    </div>`;

  // Story
  const s = STORIES_DATA[day % STORIES_DATA.length];
  const short = s.body.split('\n\n')[0];
  document.getElementById('d-story').innerHTML = `
    <div class="de bl">✦ Story of the Day</div>
    <div style="display:flex;align-items:center;gap:11px;margin-bottom:1rem;flex-wrap:wrap"><span style="font-size:28px">${s.icon}</span><div><div style="font-family:var(--fd);font-size:1.1rem">${s.name}</div><div style="font-size:12px;color:var(--t4)">${s.sub}</div></div></div>
    <div class="story-txt">${short}</div>
    <button class="fc" style="font-size:12px" onclick="goPage('stories');setTimeout(()=>document.getElementById('story-${day % STORIES_DATA.length}')?.scrollIntoView({behavior:'smooth'}),100)">Read full →</button>`;
}

// ═══ SEARCH ═══
function onInput() {
  const q = document.getElementById('sq').value.trim();
  clearTimeout(STM);
  if (!q) { clearSearch(); return; }
  STM = setTimeout(doSearch, 250);
}
function setFilter(btn, f) {
  FILT = f;
  document.querySelectorAll('.fc[data-f]').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  const q = document.getElementById('sq').value.trim();
  if (q) doSearch();
}
function clearSearch() {
  document.getElementById('sq').value = '';
  document.getElementById('resSec').style.display = 'none';
  document.getElementById('homeContent').style.display = 'block';
}
function doSearch() {
  const q = document.getElementById('sq').value.trim().toLowerCase();
  if (!q) { clearSearch(); return; }
  document.getElementById('resSec').style.display = 'block';
  document.getElementById('homeContent').style.display = 'none';
  document.getElementById('ld').classList.add('on');
  document.getElementById('es').classList.remove('on');
  document.getElementById('rg').innerHTML = '';

  setTimeout(() => {
    const r = { ayat: [], names: [], hadith: [], stories: [] };
    if (FILT === 'all' || FILT === 'ayat') {
      r.ayat = QURAN_VERSES
        .map(enrichVerse)
        .filter(a => `${a.en} ${a.tr} ${a.sn} ${a.sar || ''} ${a.ar}`.toLowerCase().includes(q))
        .slice(0, 12);
    }
    if (FILT === 'all' || FILT === 'names') r.names = NAMES.filter(n => `${n.tr} ${n.mean} ${n.desc}`.toLowerCase().includes(q)).slice(0, 8);
    if (FILT === 'all' || FILT === 'hadith') r.hadith = HADITH_DATA.filter(h => `${h.en} ${h.narr} ${h.cat}`.toLowerCase().includes(q)).slice(0, 8);
    if (FILT === 'all' || FILT === 'stories') r.stories = STORIES_DATA.filter(s => `${s.name} ${s.sub} ${s.body}`.toLowerCase().includes(q)).slice(0, 5);

    const total = r.ayat.length + r.names.length + r.hadith.length + r.stories.length;
    document.getElementById('ld').classList.remove('on');
    document.getElementById('rc').textContent = total + ' found';

    if (total === 0) { document.getElementById('es').classList.add('on'); return; }

    let html = '';
    if (r.ayat.length) html += `<h3 style="font-family:var(--fd);font-size:.9rem;color:var(--t3);margin:1rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Ayat (${r.ayat.length})</h3><div class="cs">${r.ayat.map(a => cardHTML(a, q)).join('')}</div>`;
    if (r.names.length) html += `<h3 style="font-family:var(--fd);font-size:.9rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Names (${r.names.length})</h3><div class="names-grid">${r.names.map(nameCard).join('')}</div>`;
    if (r.hadith.length) html += `<h3 style="font-family:var(--fd);font-size:.9rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Hadith (${r.hadith.length})</h3>${r.hadith.map(hadithCard).join('')}`;
    if (r.stories.length) html += `<h3 style="font-family:var(--fd);font-size:.9rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Stories (${r.stories.length})</h3>${r.stories.map((s, i) => storyCard(s, i)).join('')}`;
    document.getElementById('rg').innerHTML = html;
  }, 180);
}

// ═══ SURAH GRID ═══
function renderSurahGrid(f = '', t = 'all') {
  const list = SURAHS.filter(s => {
    const nm = !f || s.en.toLowerCase().includes(f.toLowerCase()) || s.ar.includes(f) || s.meaning.toLowerCase().includes(f.toLowerCase());
    const tp = t === 'all' || s.type === t;
    return nm && tp;
  });
  document.getElementById('sg').innerHTML = list.map(s => `
    <div class="sr2" onclick="openSurah(${s.num})">
      <div class="sn2">${s.num}</div>
      <div class="sin"><div class="se">${s.en}</div><div class="ss">${s.meaning} · ${s.ayat} ayat</div></div>
      <div class="sar2">${s.ar}</div>
    </div>`).join('');
}
function filterSurahs(v) { renderSurahGrid(v, STYPE); }
function setSType(btn, t) {
  STYPE = t;
  document.querySelectorAll('[data-t]').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderSurahGrid(document.getElementById('ssi').value, t);
}

// ═══ FULL SURAH VIEW (Quran.com API) ═══
async function openSurah(num) {
  const meta = SURAHS.find(s => s.num === num);
  const fsv = document.getElementById('fullSurahView');
  fsv.classList.add('on');
  document.body.style.overflow = 'hidden';
  document.getElementById('fsTitle').innerHTML = `<span style="color:var(--t3)">${meta?.num}</span> &nbsp;${meta?.en} <span style="color:var(--t4);font-size:.85em">· ${meta?.meaning}</span>`;
  document.getElementById('fsAr').textContent = meta?.ar;
  document.getElementById('fsBody').innerHTML = `<div class="ld on"><div class="d"></div><div class="d"></div><div class="d"></div></div><div style="text-align:center;color:var(--t4);font-size:13px;margin-top:1rem">Loading ${meta.ayat} ayat from Quran.com…</div>`;

  try {
    const ayat = await fetchFullSurah(num);
    renderFullSurah(num, meta, ayat);
  } catch (e) {
    document.getElementById('fsBody').innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--t3);font-size:14px;line-height:1.8">
        <div style="font-size:40px;margin-bottom:1rem">⚠️</div>
        <h3 style="font-family:var(--fd);font-weight:300;font-size:1.3rem;color:var(--t2);margin-bottom:.5rem">Couldn't load surah</h3>
        <p style="font-size:13px;color:var(--t4)">This usually works fine once deployed to Vercel or GitHub Pages.<br>In some preview environments, external API calls are blocked.</p>
        <a href="https://quran.com/${num}" target="_blank" style="display:inline-block;margin-top:1rem;padding:8px 18px;background:var(--ac);color:#fff;border-radius:9px;font-size:13px">Read on Quran.com →</a>
      </div>`;
  }
}

async function fetchFullSurah(num) {
  if (SURAH_CACHE[num]) return SURAH_CACHE[num];
  const localVerses = QURAN_VERSES.filter((verse) => verse.s === num);
  if (localVerses.length) {
    const verses = localVerses.map((verse) => ({
      key: verse.key || `${verse.s}:${verse.a}`,
      num: verse.a,
      ar: verse.ar,
      en: cleanTranslationText(verse.en),
      tr: cleanTranslationText(verse.tr)
    }));
    SURAH_CACHE[num] = verses;
    return verses;
  }

  const verses = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${num}?language=en&words=false&translations=20,57&fields=text_uthmani&per_page=50&page=${page}`);
    if (!res.ok) throw new Error(`Failed to fetch chapter ${num}`);
    const data = await res.json();
    totalPages = data.pagination?.total_pages || 1;
    verses.push(...(data.verses || []).map((verse) => {
      const translations = verse.translations || [];
      return {
        key: verse.verse_key,
        num: verse.verse_number,
        ar: verse.text_uthmani,
        en: cleanTranslationText(translations.find((entry) => entry.resource_id === 20)?.text || ''),
        tr: cleanTranslationText(translations.find((entry) => entry.resource_id === 57)?.text || '')
      };
    }));
    page += 1;
  } while (page <= totalPages);

  SURAH_CACHE[num] = verses;
  return verses;
}

function renderFullSurah(num, meta, verses) {
  const bism = num !== 1 && num !== 9 ? '<div class="bism-view">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : '';
  const pill = revelationPill(meta?.type);
  const html = `
    <div class="quran-view-head">
      <div><h2 style="font-family:var(--fd);font-size:1.5rem;font-weight:300;letter-spacing:-.03em;margin-bottom:5px">${meta.en}</h2><p style="font-size:13px;color:var(--t4)">${meta.meaning} · ${meta.ayat} ayat · ${pill}</p></div>
      <div style="font-family:var(--fa);font-size:2.2rem;color:var(--t2)">${meta.ar}</div>
    </div>
    <div class="quran-settings">
      <button class="qset" onclick="fontDec()">A−</button>
      <button class="qset" onclick="fontInc()">A+</button>
      <button class="qset on" id="trBtn" onclick="toggleSurahTr()">Transliteration</button>
      <select class="qset" id="surahTranslationSelect" onchange="changeSurahTranslation(${num}, this.value)" aria-label="Translation">
        ${SURAH_TRANSLATIONS.map((translation) => `<option value="${translation.id}" ${translation.id === ACTIVE_SURAH_TRANSLATION ? 'selected' : ''}>${translation.label}</option>`).join('')}
      </select>
      <button class="qset" onclick="playFullSurah(${num})">▶ Play Surah</button>
      <button class="qset" onclick="downloadSurah(${num})">⬇ Full Text</button>
      <button class="qset" onclick="downloadTransliteration(${num})">⬇ Transliteration</button>
    </div>
    ${bism}
    <div class="cs" id="fullAyat">${verses.map(v => fullAyahCard(num, v, meta)).join('')}</div>`;
  document.getElementById('fsBody').innerHTML = html;
  applyFontSize();
  if (ACTIVE_SURAH_TRANSLATION !== 20) {
    changeSurahTranslation(num, ACTIVE_SURAH_TRANSLATION, true);
  }
}

let SHOW_TR = true;
function toggleSurahTr() {
  SHOW_TR = !SHOW_TR;
  document.querySelectorAll('.full-tr').forEach(e => e.style.display = SHOW_TR ? 'block' : 'none');
  const btn = document.getElementById('trBtn');
  if (btn) btn.classList.toggle('on', SHOW_TR);
}

async function fetchChapterTranslation(num, translationId) {
  if (translationId === 20) {
    const verses = SURAH_CACHE[num] || await fetchFullSurah(num);
    return Object.fromEntries(verses.map((verse) => [verse.num, verse.en]));
  }
  SURAH_TRANSLATION_CACHE[num] ||= {};
  if (SURAH_TRANSLATION_CACHE[num][translationId]) return SURAH_TRANSLATION_CACHE[num][translationId];

  const byVerse = {};
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${num}?language=en&words=false&translations=${translationId}&fields=text_uthmani&per_page=50&page=${page}`);
    if (!res.ok) throw new Error(`Failed translation fetch for chapter ${num}`);
    const data = await res.json();
    totalPages = data.pagination?.total_pages || 1;
    for (const verse of data.verses || []) {
      byVerse[verse.verse_number] = cleanTranslationText(verse.translations?.[0]?.text || '');
    }
    page += 1;
  } while (page <= totalPages);

  SURAH_TRANSLATION_CACHE[num][translationId] = byVerse;
  return byVerse;
}

async function changeSurahTranslation(num, translationId, silent = false) {
  const id = parseInt(translationId, 10);
  ACTIVE_SURAH_TRANSLATION = id;
  localStorage.setItem('annur_surah_translation', String(id));
  const select = document.getElementById('surahTranslationSelect');
  if (select && String(select.value) !== String(id)) select.value = String(id);

  try {
    const translations = await fetchChapterTranslation(num, id);
    document.querySelectorAll('.full-en[data-verse]').forEach((node) => {
      const verseNumber = Number(node.dataset.verse);
      node.textContent = translations[verseNumber] || '';
    });
    if (!silent) {
      const label = SURAH_TRANSLATIONS.find((translation) => translation.id === id)?.label || 'Translation';
      toast(`${label} loaded`);
    }
  } catch (error) {
    if (!silent) toast('Could not load that translation');
  }
}

function downloadSurah(num) {
  const verses = SURAH_CACHE[num];
  if (!verses) { toast('Load the surah first'); return; }
  const meta = SURAHS.find(s => s.num === num);
  const translationLabel = SURAH_TRANSLATIONS.find((translation) => translation.id === ACTIVE_SURAH_TRANSLATION)?.label || 'English';
  let txt = `${meta.en} (${meta.ar}) — ${meta.meaning}\n`;
  txt += `Translation: ${translationLabel}\n`;
  txt += `${'═'.repeat(50)}\n\n`;
  const activeTranslations = {};
  document.querySelectorAll('.full-en[data-verse]').forEach((node) => {
    activeTranslations[Number(node.dataset.verse)] = node.textContent.trim();
  });
  verses.forEach(v => {
    txt += `[${num}:${v.num}]\n`;
    txt += `${v.ar}\n`;
    if (v.tr) txt += `${v.tr}\n`;
    txt += `${activeTranslations[v.num] || v.en}\n\n`;
  });
  txt += `\nAn Nur · an-nur-eosin.vercel.app`;
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${meta.en.replace(/[^a-z0-9]/gi,'_')}_Quran.txt`;
  a.click();
  toast('Downloading…');
}

function downloadTransliteration(num) {
  const verses = SURAH_CACHE[num];
  if (!verses) { toast('Load the surah first'); return; }
  const meta = SURAHS.find(s => s.num === num);
  let txt = `An Nur\n`;
  txt += `${meta.en} (${meta.ar}) — Transliteration Edition\n`;
  txt += `${meta.meaning}\n`;
  txt += `${'═'.repeat(50)}\n\n`;
  verses.forEach((v) => {
    txt += `[${num}:${v.num}]\n`;
    txt += `${v.tr || ''}\n\n`;
  });
  txt += `Read online: an-nur-eosin.vercel.app\n`;
  txt += `Built as sadaqah jariyah.\n`;
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${meta.en.replace(/[^a-z0-9]/gi, '_')}_Transliteration_AnNur.txt`;
  a.click();
  toast('Transliteration downloading…');
}

function fullAyahCard(surahNum, v, meta) {
  const uid = 'fa' + surahNum + '_' + v.num;
  const bmOn = BM.some(b => b.type === 'ayah' && b.s == surahNum && b.a == v.num);
  return `<div class="card" id="card-${uid}">
    <div class="ch">
      <div class="cm"><span class="cs2" style="font-size:13px;font-weight:600;color:var(--t2)">${surahNum}:${v.num}</span></div>
      <div class="cbs">
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-${uid}" onclick="toggleBm('${uid}','ayah',${surahNum},${v.num})" title="Bookmark"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
        <button class="cb" onclick="playAyah('${uid}',${surahNum},${v.num})" title="Play"><svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M2 1l8 5-8 5z"/></svg></button>
        <button class="share-btn" onclick="openShareAyah(${surahNum},${v.num})" title="Share ${meta.en} ${surahNum}:${v.num}">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9.5" cy="2.5" r="1.5"/><circle cx="2.5" cy="6" r="1.5"/><circle cx="9.5" cy="9.5" r="1.5"/><path d="M4 6.8l4 1.9M8 2.8L4 5"/></svg>
        </button>
      </div>
    </div>
    <div class="arabic full-ar">${v.ar}</div>
    ${v.tr ? `<div class="full-tr" style="font-size:13px;color:var(--t3);font-style:italic;line-height:1.7;margin-bottom:.75rem;display:${SHOW_TR?'block':'none'}">${v.tr}</div>` : ''}
    <div class="trs full-en" data-verse="${v.num}">${v.en}</div>
    <div class="aw" id="aw-${uid}">${audioHTML(uid)}</div>
  </div>`;
}

function closeSurah() {
  document.getElementById('fullSurahView').classList.remove('on');
  document.body.style.overflow = '';
  stopAud();
}

function fontInc() { FONT_SIZE = Math.min(30, FONT_SIZE + 2); localStorage.setItem('annur_fs', FONT_SIZE); applyFontSize(); }
function fontDec() { FONT_SIZE = Math.max(14, FONT_SIZE - 2); localStorage.setItem('annur_fs', FONT_SIZE); applyFontSize(); }
function applyFontSize() {
  document.querySelectorAll('.full-ar').forEach(e => e.style.fontSize = (FONT_SIZE + 6) + 'px');
  document.querySelectorAll('.full-en').forEach(e => e.style.fontSize = FONT_SIZE + 'px');
}

function playFullSurah(num) {
  toast('Starting surah recitation…');
  // Play first ayah, chain to next
  const verses = SURAH_CACHE[num];
  if (!verses || !verses.length) return;
  playChain(num, verses, 0);
}
function playChain(num, verses, idx) {
  if (idx >= verses.length) { toast('Surah complete 🤍'); return; }
  const v = verses[idx];
  const uid = 'fa' + num + '_' + v.num;
  playAyah(uid, num, v.num);
  const check = setInterval(() => {
    if (!AUD) { clearInterval(check); return; }
    if (AUD.ended) {
      clearInterval(check);
      document.getElementById('card-' + uid)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => playChain(num, verses, idx + 1), 400);
    }
  }, 400);
}

// ═══ NAMES ═══
function renderNames(filter = '') {
  const f = filter.toLowerCase();
  const list = f ? NAMES.filter(n => n.tr.toLowerCase().includes(f) || n.mean.toLowerCase().includes(f) || n.desc.toLowerCase().includes(f)) : NAMES;
  document.getElementById('ng').innerHTML = list.map(nameCard).join('');
}
function filterNames(v) { renderNames(v); }
function nameCard(n) {
  return `<div class="ncard" onclick="openName(${n.n})"><div class="n-num">${n.n}</div><div class="n-ar">${n.ar}</div><div class="n-tr">${n.tr}</div><div class="n-mn">${n.mean}</div></div>`;
}
function openName(num) {
  const n = NAMES.find(x => x.n === num);
  if (!n) return;
  const bmOn = BM.some(b => b.type === 'name' && b.n === num);
  const fsv = document.getElementById('fullSurahView');
  fsv.classList.add('on');
  document.body.style.overflow = 'hidden';
  document.getElementById('fsTitle').innerHTML = `Name <span style="color:var(--t3)">#${n.n}</span>`;
  document.getElementById('fsAr').textContent = '';
  document.getElementById('fsBody').innerHTML = `
    <div style="background:var(--bg3);border:.5px solid var(--bd2);border-radius:var(--r3);padding:2.5rem 2rem;box-shadow:var(--sh2);text-align:center">
      <div style="display:inline-block;font-size:12px;color:var(--gd);background:var(--gds);border:.5px solid var(--gdb);border-radius:20px;padding:4px 14px;margin-bottom:1.5rem">Name ${n.n} of 99</div>
      <div style="font-family:var(--fa);font-size:clamp(3rem,8vw,5rem);color:var(--t1);line-height:1.2;margin-bottom:1rem">${n.ar}</div>
      <div style="font-family:var(--fd);font-size:2rem;font-weight:300;color:var(--gd);letter-spacing:-.02em;margin-bottom:.5rem">${n.tr}</div>
      <div style="font-size:16px;color:var(--t2);font-style:italic;margin-bottom:1.5rem">${n.mean}</div>
      <div style="font-size:14.5px;color:var(--t2);line-height:1.8;max-width:600px;margin:0 auto;font-weight:300">${n.desc}</div>
      <button class="fc ${bmOn ? 'on' : ''}" style="margin-top:2rem;padding:8px 16px" onclick="toggleBm('nv','name',${num},0);this.classList.toggle('on')">${bmOn ? 'Bookmarked ✓' : 'Bookmark'}</button>
    </div>`;
}

// ═══ HADITH ═══
function renderHadith(filter = '') {
  const f = filter.toLowerCase();
  const list = f ? HADITH_DATA.filter(h => (h.en + ' ' + h.narr + ' ' + h.cat + ' ' + h.src).toLowerCase().includes(f)) : HADITH_DATA;
  document.getElementById('hg').innerHTML = list.map(h => hadithCard(h, HADITH_DATA.indexOf(h))).join('');
}
function filterHadith(v) { renderHadith(v); }
function hadithCard(h, idx = HADITH_DATA.indexOf(h)) {
  const uid = 'h' + (++CID);
  const bmOn = BM.some(b => b.type === 'hadith' && b.en === h.en);
  const authP = h.auth === 'Sahih' ? '<span class="h-auth">✓ Sahih</span>' : '<span class="h-auth hasan">Hasan</span>';
  return `<div class="hcard">
    <div class="h-head">
      ${authP}
      <span class="h-src">${h.src}</span>
      ${h.num ? `<span class="pill pa">40 Nawawi #${h.num}</span>` : ''}
      <span class="pill pb">${h.cat}</span>
      <button class="cb ${bmOn ? 'bm' : ''}" id="bm-${uid}" onclick="toggleBmHadith('${uid}',\`${h.en.replace(/`/g, '').substring(0, 80)}\`)" style="margin-left:auto"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
    </div>
    <div class="h-ar">${h.ar}</div>
    <div class="h-txt">"${h.en}"</div>
    <div class="h-narr">Narrated by ${h.narr}</div>
    <div style="margin-top:.75rem">
      <button class="share-btn" onclick="openShare('hadith',${idx})">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9.5" cy="2.5" r="1.5"/><circle cx="2.5" cy="6" r="1.5"/><circle cx="9.5" cy="9.5" r="1.5"/><path d="M4 6.8l4 1.9M8 2.8L4 5"/></svg>
        Share
      </button>
    </div>
  </div>`;
}
function toggleBmHadith(uid, snippet) {
  const h = HADITH_DATA.find(x => x.en.substring(0, 80) === snippet);
  if (!h) return;
  const i = BM.findIndex(b => b.type === 'hadith' && b.en === h.en);
  if (i === -1) { BM.push({ type: 'hadith', en: h.en }); toast('Saved ✓'); }
  else { BM.splice(i, 1); toast('Removed'); }
  localStorage.setItem('annur_bm', JSON.stringify(BM));
  const btn = document.getElementById('bm-' + uid);
  if (btn) {
    const on = BM.some(b => b.type === 'hadith' && b.en === h.en);
    btn.classList.toggle('bm', on);
    btn.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none');
  }
}

// ═══ STORIES ═══
function renderStories() {
  document.getElementById('stg').innerHTML = STORIES_DATA.map((s, i) => storyCard(s, i)).join('');
}
function storyCard(s, idx) {
  const paras = s.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
  return `<div class="story-card" id="story-${idx}">
    <div class="story-head"><div class="story-ico">${s.icon}</div><div><div class="story-title">${s.name}</div><div class="story-sub">${s.sub}</div></div></div>
    <div class="story-body">${paras}</div>
    <div class="story-lesson"><strong>Reflection:</strong> ${s.lesson}</div>
  </div>`;
}

// ═══ BOOKMARKS ═══
function renderBookmarks() {
  document.getElementById('bmc').textContent = BM.length + ' saved';
  if (!BM.length) {
    document.getElementById('bg2').innerHTML = '';
    document.getElementById('be').style.display = 'block';
    return;
  }
  document.getElementById('be').style.display = 'none';
  let html = '';
  const aBm = BM.filter(b => b.type === 'ayah');
  const nBm = BM.filter(b => b.type === 'name');
  const hBm = BM.filter(b => b.type === 'hadith');
  if (aBm.length) {
    const matched = aBm.map(b => getVerseRecord(b.s, b.a)).filter(Boolean);
    if (matched.length) html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1rem 0 .5rem">Ayat (${matched.length})</h3><div class="cs">${matched.map(a => cardHTML(a)).join('')}</div>`;
  }
  if (nBm.length) {
    const matched = nBm.map(b => NAMES.find(n => n.n === b.n)).filter(Boolean);
    html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1.5rem 0 .5rem">Names (${matched.length})</h3><div class="names-grid">${matched.map(nameCard).join('')}</div>`;
  }
  if (hBm.length) {
    const matched = hBm.map(b => HADITH_DATA.find(h => h.en === b.en)).filter(Boolean);
    html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1.5rem 0 .5rem">Hadith (${matched.length})</h3>${matched.map(hadithCard).join('')}`;
  }
  document.getElementById('bg2').innerHTML = html;
}
function toggleBm(uid, type, s, a) {
  const i = BM.findIndex(b => {
    if (type === 'ayah') return b.type === 'ayah' && b.s == s && b.a == a;
    if (type === 'name') return b.type === 'name' && b.n === s;
    return false;
  });
  if (i === -1) {
    if (type === 'ayah') BM.push({ type, s, a });
    else if (type === 'name') BM.push({ type, n: s });
    toast('Saved ✓');
  } else {
    BM.splice(i, 1);
    toast('Removed');
  }
  localStorage.setItem('annur_bm', JSON.stringify(BM));
  const btn = document.getElementById('bm-' + uid);
  if (btn) {
    const on = BM.some(b => {
      if (type === 'ayah') return b.type === 'ayah' && b.s == s && b.a == a;
      if (type === 'name') return b.type === 'name' && b.n === s;
    });
    btn.classList.toggle('bm', on);
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', on ? 'currentColor' : 'none');
  }
}

// ═══ AYAH CARDS ═══
function cardHTML(a, q = '') {
  const verse = enrichVerse(a);
  const uid = 'c' + (++CID);
  const bmOn = BM.some(b => b.type === 'ayah' && b.s == verse.s && b.a == verse.a);
  const pill = revelationPill(verse.rev);
  return `<div class="card" id="card-${uid}">
    <div class="ch">
      <div class="cm">${pill}<span class="cr">${verse.sn}</span><span class="cs2">· ${verse.s}:${verse.a}</span></div>
      <div class="cbs">
        <button class="cb" title="Transliteration" onclick="toggleTr('${uid}')"><svg width="13" height="10" viewBox="0 0 13 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1.5 2.5h10M1.5 5h7M1.5 7.5h5"/></svg></button>
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-${uid}" onclick="toggleBm('${uid}','ayah',${verse.s},${verse.a})"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
        <button class="cb" onclick="playAyah('${uid}',${verse.s},${verse.a})"><svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M2 1l8 5-8 5z"/></svg></button>
        <button class="share-btn" onclick="openShareAyah(${verse.s},${verse.a})" title="Share ${verse.sn} ${verse.s}:${verse.a}">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9.5" cy="2.5" r="1.5"/><circle cx="2.5" cy="6" r="1.5"/><circle cx="9.5" cy="9.5" r="1.5"/><path d="M4 6.8l4 1.9M8 2.8L4 5"/></svg>
        </button>
      </div>
    </div>
    <div class="arabic">${verse.ar}</div>
    <div class="trl on" id="trl-${uid}">${q ? hl(verse.tr || '', q) : (verse.tr || '')}</div>
    <div class="trs">${q ? hl(verse.en, q) : verse.en}</div>
    <div class="aw" id="aw-${uid}">${audioHTML(uid)}</div>
  </div>`;
}
function toggleTr(uid) { document.getElementById('trl-' + uid)?.classList.toggle('on'); }
function hl(t, q) {
  if (!q) return t;
  const ws = q.split(/\s+/).filter(w => w.length > 1);
  let r = t;
  ws.forEach(w => {
    const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    r = r.replace(re, '<mark>$1</mark>');
  });
  return r;
}

// ═══ AUDIO ═══
function audioHTML(uid) {
  return `<button class="pc" id="pc-${uid}" onclick="togglePP('${uid}')"><svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M2 1.5l8 5-8 5z"/></svg></button>
    <div class="pw"><div class="pb2" onclick="seekA(event,this)"><div class="pf" id="pf-${uid}"></div></div><span class="pt" id="pt-${uid}">0:00</span></div>
    <select class="rs" onchange="chRec(this.value)">${RECITERS.map(r => `<option value="${r.id}" ${r.id === REC ? 'selected' : ''}>${r.name}</option>`).join('')}</select>`;
}
function playAyah(uid, s, a) {
  const aw = document.getElementById('aw-' + uid);
  if (aw) aw.classList.add('on');
  if (AUDID === uid && AUD) {
    if (AUD.paused) { AUD.play(); setPI(uid, true); }
    else { AUD.pause(); setPI(uid, false); }
    return;
  }
  stopAud();
  const s3 = String(s).padStart(3, '0'), a3 = String(a).padStart(3, '0');
  const urls = [`https://everyayah.com/data/${REC}/${s3}${a3}.mp3`, `https://everyayah.com/data/Alafasy_128kbps/${s3}${a3}.mp3`];
  const tryPlay = (i = 0) => {
    if (i >= urls.length) { showAudioErr(uid); AUD = null; AUDID = null; return; }
    AUD = new Audio(urls[i]); AUDID = uid;
    AUD.addEventListener('play', () => setPI(uid, true));
    AUD.addEventListener('pause', () => setPI(uid, false));
    AUD.addEventListener('ended', () => { setPI(uid, false); AUDID = null; const pf = document.getElementById('pf-' + uid); if (pf) pf.style.width = '0%'; });
    AUD.addEventListener('timeupdate', () => {
      if (!AUD.duration) return;
      const pf = document.getElementById('pf-' + uid), pt = document.getElementById('pt-' + uid);
      if (pf) pf.style.width = (AUD.currentTime / AUD.duration * 100) + '%';
      if (pt) pt.textContent = fmt(AUD.currentTime);
    });
    AUD.play().catch(() => tryPlay(i + 1));
  };
  tryPlay();
}
function togglePP(uid) { if (AUDID === uid && AUD) { if (AUD.paused) { AUD.play(); setPI(uid, true); } else { AUD.pause(); setPI(uid, false); } } }
function stopAud() { if (AUD) { AUD.pause(); if (AUDID) setPI(AUDID, false); AUD = null; AUDID = null; } }
function setPI(uid, pl) {
  const btn = document.getElementById('pc-' + uid);
  if (!btn) return;
  btn.innerHTML = pl ? '<svg width="9" height="11" viewBox="0 0 9 11" fill="white"><rect x=".5" y=".5" width="3" height="10" rx="1"/><rect x="5.5" y=".5" width="3" height="10" rx="1"/></svg>' : '<svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M2 1.5l8 5-8 5z"/></svg>';
}
function chRec(v) { REC = v; localStorage.setItem('annur_rec', v); }
function seekA(e, bar) { if (!AUD || !AUD.duration) return; const r = bar.getBoundingClientRect(); AUD.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * AUD.duration; }
function fmt(s) { return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }
function showAudioErr(uid) {
  const aw = document.getElementById('aw-' + uid);
  if (!aw) return;
  aw.innerHTML = `<div style="font-size:12.5px;color:var(--t3);width:100%">⚠️ Audio works once deployed. <a href="https://everyayah.com" target="_blank" style="color:var(--ac)">EveryAyah ↗</a></div>`;
}

// ═══ PRAYER TIMES ═══
function loadPrayerTimes() {
  if (!navigator.geolocation) {
    document.getElementById('prBody').innerHTML = '<div class="es on"><h3>Location needed</h3><p>Your browser does not support geolocation.</p></div>';
    return;
  }
  document.getElementById('prLoc').textContent = 'Getting location…';
  navigator.geolocation.getCurrentPosition(
    pos => fetchPrayer(pos.coords.latitude, pos.coords.longitude),
    err => {
      document.getElementById('prBody').innerHTML = `<div class="es on"><h3>Location denied</h3><p>Enable location to see prayer times for your area.</p><button class="fc" onclick="loadPrayerTimes()" style="margin-top:1rem">Try again</button></div>`;
    },
    { timeout: 10000, enableHighAccuracy: false }
  );
}

async function fetchPrayer(lat, lng) {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
    const data = await res.json();
    if (data.code !== 200) throw new Error();
    const t = data.data.timings;
    const city = data.data.meta.timezone || 'Your location';
    document.getElementById('prLoc').textContent = city;

    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const prayers = [
      { name: 'Fajr', time: t.Fajr },
      { name: 'Sunrise', time: t.Sunrise },
      { name: 'Dhuhr', time: t.Dhuhr },
      { name: 'Asr', time: t.Asr },
      { name: 'Maghrib', time: t.Maghrib },
      { name: 'Isha', time: t.Isha }
    ];
    let nextIdx = prayers.findIndex(p => {
      const [h, m] = p.time.split(':').map(Number);
      return h * 60 + m > curMin;
    });
    if (nextIdx === -1) nextIdx = 0;

    document.getElementById('prBody').innerHTML = `
      <div class="prayer-grid">
        ${prayers.map((p, i) => `
          <div class="prayer-card ${i === nextIdx ? 'next' : ''}">
            <div class="p-name">${p.name}</div>
            <div class="p-time">${p.time}</div>
            ${i === nextIdx ? '<div class="p-next">Next prayer</div>' : ''}
          </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:1.5rem;padding:13px 15px;background:var(--bg3);border:.5px solid var(--bd1);border-radius:var(--r2);font-size:12.5px;color:var(--t3)">📅 ${data.data.date.readable} · ${data.data.date.hijri.date} AH<br>Method: Islamic Society of North America · Timings may vary slightly by method</div>`;
  } catch (e) {
    document.getElementById('prBody').innerHTML = `<div class="es on"><h3>Couldn't load prayer times</h3><p>This usually works once deployed. Try again in a moment.</p></div>`;
  }
}

// ═══ TASBIH ═══
function loadTasbih() {
  document.getElementById('tCount').textContent = TASBIH;
  document.getElementById('tDhikr').textContent = TASBIH_DHIKR;
  document.getElementById('tTr').textContent = TASBIH_TR;
  document.getElementById('tTarget').textContent = `Target: ${TASBIH_TARGET}`;
}
function incTasbih() {
  TASBIH++;
  localStorage.setItem('annur_tas', TASBIH);
  document.getElementById('tCount').textContent = TASBIH;
  if (navigator.vibrate) navigator.vibrate(20);
  if (TASBIH === TASBIH_TARGET) toast('Target reached ✓ SubhanAllah');
}
function resetTasbih() {
  TASBIH = 0;
  localStorage.setItem('annur_tas', 0);
  document.getElementById('tCount').textContent = 0;
  toast('Reset');
}
function setDhikr(ar, tr, target) {
  TASBIH_DHIKR = ar; TASBIH_TR = tr; TASBIH_TARGET = target;
  localStorage.setItem('annur_tas_d', ar);
  localStorage.setItem('annur_tas_tr', tr);
  localStorage.setItem('annur_tas_t', target);
  resetTasbih();
  loadTasbih();
}

// ═══ QIBLA ═══
function getQibla() {
  if (!navigator.geolocation) {
    document.getElementById('qiblaDir').textContent = 'Geolocation not supported';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const qibla = calculateQibla(lat, lng);
      document.getElementById('qiblaDir').textContent = `${qibla.toFixed(1)}° from North`;
      document.getElementById('qiblaInfo').innerHTML = `Your location: ${lat.toFixed(3)}°, ${lng.toFixed(3)}°<br>Face this direction for salah.`;
      document.getElementById('needle').style.transform = `rotate(${qibla}deg)`;
    },
    () => {
      document.getElementById('qiblaDir').textContent = 'Location denied';
      document.getElementById('qiblaInfo').textContent = 'Enable location to find the qibla direction.';
    }
  );
}

function calculateQibla(lat, lng) {
  const toRad = x => x * Math.PI / 180;
  const toDeg = x => x * 180 / Math.PI;
  const φ1 = toRad(lat), φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let θ = toDeg(Math.atan2(y, x));
  return (θ + 360) % 360;
}

// ═══ TOAST ═══
let TT;
function toast(m) {
  const el = document.getElementById('toast');
  document.getElementById('tm').textContent = m;
  el.classList.add('on');
  clearTimeout(TT);
  TT = setTimeout(() => el.classList.remove('on'), 2200);
}

// ═══ DU'AS ═══
const DUA_CATS = ['All','Morning','Evening','Salah','Daily Life','Travel','Hardship','Forgiveness','Special'];
let ACTIVE_DUA_CAT = 'All';
let SHARE_DATA = null;

function renderDuas(cat = 'All') {
  ACTIVE_DUA_CAT = cat;
  // Render category pills
  document.getElementById('duaCats').innerHTML = DUA_CATS.map(c =>
    `<button class="fc ${c === cat ? 'on' : ''}" onclick="renderDuas('${c}')">${c}</button>`
  ).join('');
  // Render duas
  const list = cat === 'All' ? DUAS : DUAS.filter(d => d.cat === cat);
  document.getElementById('duaGrid').innerHTML = list.map((d, i) => duaCard(d, i)).join('');
}

function duaCard(d, i) {
  return `<div class="dua-card">
    <div class="dua-cat-pill">${d.cat}</div>
    <div class="dua-title">${d.title}</div>
    <div class="dua-ar">${d.ar}</div>
    <div class="dua-tr">${d.tr}</div>
    <div class="dua-en">"${d.en}"</div>
    <div class="dua-src">Source: ${d.src}</div>
    <div class="dua-actions">
      <button class="share-btn" onclick="openShare('dua',${i})">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9.5" cy="2.5" r="1.5"/><circle cx="2.5" cy="6" r="1.5"/><circle cx="9.5" cy="9.5" r="1.5"/><path d="M4 6.8l4 1.9M8 2.8L4 5"/></svg>
        Share
      </button>
    </div>
  </div>`;
}

// ═══ SHARE ═══
function openShare(type, idx) {
  let ar, en, ref, tr = '';
  if (type === 'dua') {
    const d = ACTIVE_DUA_CAT === 'All' ? DUAS[idx] : DUAS.filter(x => x.cat === ACTIVE_DUA_CAT)[idx];
    ar = d.ar; en = d.en; ref = `${d.title} · ${d.src}`; tr = d.tr;
  } else if (type === 'ayah') {
    const a = enrichVerse(QURAN_VERSES[idx]);
    ar = a.ar; en = a.en; ref = `${a.sn} ${a.s}:${a.a}`; tr = a.tr || '';
  } else if (type === 'hadith') {
    const h = HADITH_DATA[idx];
    ar = h.ar; en = h.en; ref = `Narrated by ${h.narr} · ${h.src}`; tr = '';
  }
  SHARE_DATA = { ar, en, ref, tr };
  document.getElementById('sharePreview').innerHTML = `
    <div class="share-ar">${ar}</div>
    ${tr ? `<div style="font-size:12px;color:var(--t3);font-style:italic;text-align:right;margin-bottom:.5rem">${tr}</div>` : ''}
    <div class="share-en">"${en}"</div>
    <div class="share-ref">${ref}</div>
    <div class="share-watermark">an-nur-eosin.vercel.app</div>`;
  document.getElementById('shareModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeShare() {
  document.getElementById('shareModal').classList.remove('on');
  document.body.style.overflow = '';
}

function buildShareText() {
  if (!SHARE_DATA) return '';
  return `${SHARE_DATA.ar}\n${SHARE_DATA.tr ? `\n${SHARE_DATA.tr}\n` : '\n'}\n"${SHARE_DATA.en}"\n\n— ${SHARE_DATA.ref}\n\nAn Nur · an-nur-eosin.vercel.app`;
}

function copyShare() {
  navigator.clipboard.writeText(buildShareText()).then(() => {
    toast('Copied ✓');
    closeShare();
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = buildShareText();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Copied ✓');
    closeShare();
  });
}

function waShare() {
  const text = encodeURIComponent(buildShareText());
  window.open(`https://wa.me/?text=${text}`, '_blank');
  closeShare();
}

function xShare() {
  // X has 280 char limit so send shorter version
  const short = `"${SHARE_DATA.en}"\n\n— ${SHARE_DATA.ref}\n\nan-nur-eosin.vercel.app`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(short)}`, '_blank');
  closeShare();
}

// ═══ SHARE HELPERS ═══
function openShareAyah(s, a) {
  const ayah = getVerseRecord(s, a);
  if (!ayah) return;
  SHARE_DATA = { ar: ayah.ar, en: ayah.en, ref: `${ayah.sn} ${ayah.s}:${ayah.a}`, tr: ayah.tr || '' };
  document.getElementById('sharePreview').innerHTML = `
    <div class="share-ar">${ayah.ar}</div>
    ${ayah.tr ? `<div style="font-size:12px;color:var(--t3);font-style:italic;text-align:right;margin-bottom:.5rem">${ayah.tr}</div>` : ''}
    <div class="share-en">"${ayah.en}"</div>
    <div class="share-ref">${ayah.sn} ${ayah.s}:${ayah.a}</div>
    <div class="share-watermark">an-nur-eosin.vercel.app · An Nur</div>`;
  document.getElementById('shareModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function openShareDirect(ar, en, ref) {
  SHARE_DATA = { ar, en, ref, tr: '' };
  document.getElementById('sharePreview').innerHTML = `
    <div class="share-ar">${ar}</div>
    <div class="share-en">"${en}"</div>
    <div class="share-ref">${ref}</div>
    <div class="share-watermark">an-nur-eosin.vercel.app · An Nur</div>`;
  document.getElementById('shareModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function openShareDirect2(ar, en, ref) {
  SHARE_DATA = { ar, en, ref, tr: '' };
  document.getElementById('sharePreview').innerHTML = `
    <div class="share-ar">${ar}</div>
    <div class="share-en">"${en}"</div>
    <div class="share-ref">${ref}</div>
    <div class="share-watermark">an-nur-eosin.vercel.app · An Nur</div>`;
  document.getElementById('shareModal').classList.add('on');
  document.body.style.overflow = 'hidden';
}
