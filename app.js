// ═══════════════ STATE ═══════════════
let BM = JSON.parse(localStorage.getItem('annur_bm') || '[]');
let REC = localStorage.getItem('annur_rec') || 'Alafasy_128kbps';
let FILT = 'all';
let AUD = null, AUDID = null;
let STYPE = 'all';
let STM = null;
let CID = 0;

const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'Mishary Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit' },
  { id: 'Maher_AlMuaiqly_128kbps', name: 'Maher Al-Muaiqly' },
  { id: 'Minshawi_Murattal_128kbps', name: 'Al-Minshawi' }
];

// ═══════════════ INIT ═══════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('tod').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  renderDaily();
  renderSurahGrid();
  renderNames();
  renderHadith();
  renderStories();
  renderBookmarks();
});

// ═══════════════ THEME ═══════════════
function initTheme() {
  const t = localStorage.getItem('annur_th') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  const c = document.documentElement.getAttribute('data-theme');
  const n = c === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', n);
  localStorage.setItem('annur_th', n);
  toast(n === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
}

// ═══════════════ NAV ═══════════════
function goPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('on'));
  document.querySelectorAll('#nav .nb').forEach(x => x.classList.remove('on'));
  const el = document.getElementById('page-' + p);
  if (el) el.classList.add('on');
  const ps = ['home', 'surahs', 'names', 'hadith', 'stories', 'khutbah', 'bookmarks', 'about'];
  const i = ps.indexOf(p);
  if (i >= 0) document.querySelectorAll('#nav .nb')[i]?.classList.add('on');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (p === 'bookmarks') renderBookmarks();
}

// ═══════════════ DAILY ROTATION ═══════════════
function dayOfYear() {
  const d = new Date();
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}

function renderDaily() {
  const day = dayOfYear();

  // Daily Ayah
  const a = AYAT[day % AYAT.length];
  const pill = a.rev === 'Meccan' ? '<span class="pill pg">Makki</span>' : '<span class="pill ps">Madani</span>';
  const bmOn = BM.some(b => b.type === 'ayah' && b.s == a.s && b.a == a.a);
  document.getElementById('daily-ayah').innerHTML = `
    <div class="de ac"><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5.5l1.09 3.36H10L7.2 5.77l1.09 3.36L5.5 7.22 2.71 9.13 3.8 5.77 1 3.86h3.41z"/></svg>Ayah of the Day</div>
    <div class="da">${a.ar}</div>
    <div class="dt">"${a.en}"</div>
    <div class="df">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${pill}<span style="font-size:14px;color:var(--t2);font-weight:500">${a.sn}</span><span style="font-size:13px;color:var(--t4)">${a.s}:${a.a}</span></div>
      <div style="display:flex;gap:6px">
        <button class="cb" onclick="playAyah('da',${a.s},${a.a})" title="Play"><svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M2 1l8 5-8 5z"/></svg></button>
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-da" onclick="toggleBm('da','ayah',${a.s},${a.a})" title="Bookmark"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
      </div>
    </div>
    <div class="aw" id="aw-da">${audioHTML('da')}</div>`;

  // Daily Name
  const n = NAMES[day % NAMES.length];
  document.getElementById('daily-name').innerHTML = `
    <div class="de gd"><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5.5l1.09 3.36H10L7.2 5.77l1.09 3.36L5.5 7.22 2.71 9.13 3.8 5.77 1 3.86h3.41z"/></svg>Name of Allah</div>
    <div class="name-ar">${n.ar}</div>
    <div class="name-tr">${n.tr}</div>
    <div class="name-meaning">${n.mean}</div>
    <div class="name-desc">${n.desc}</div>
    <div style="text-align:center;margin-top:1rem"><span class="pill pg">#${n.n} of 99</span></div>`;

  // Daily Hadith
  const h = HADITH[day % HADITH.length];
  const authPill = h.auth === 'Sahih' ? '<span class="h-auth">✓ Sahih (Authentic)</span>' : '<span class="h-auth weak">Hasan (Good)</span>';
  document.getElementById('daily-hadith').innerHTML = `
    <div class="de sg"><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5.5l1.09 3.36H10L7.2 5.77l1.09 3.36L5.5 7.22 2.71 9.13 3.8 5.77 1 3.86h3.41z"/></svg>Hadith of the Day</div>
    <div style="font-family:var(--fa);font-size:1.3rem;direction:rtl;text-align:right;color:var(--t1);margin-bottom:1rem;line-height:1.9">${h.ar}</div>
    <div class="hadith-text">"${h.en}"</div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${authPill}<span class="hadith-src">${h.src}</span></div>
      <span style="font-size:12px;color:var(--t4)">Narrated by ${h.narr}</span>
    </div>`;

  // Daily Story
  const s = STORIES[day % STORIES.length];
  const short = s.body.split('\n\n')[0];
  document.getElementById('daily-story').innerHTML = `
    <div class="de bl"><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5.5l1.09 3.36H10L7.2 5.77l1.09 3.36L5.5 7.22 2.71 9.13 3.8 5.77 1 3.86h3.41z"/></svg>Story of the Day</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap"><span style="font-size:32px">${s.icon}</span><div><div style="font-family:var(--fd);font-size:1.15rem;font-weight:400">${s.name}</div><div style="font-size:12px;color:var(--t4)">${s.sub}</div></div></div>
    <div class="story-txt">${short}</div>
    <button class="fc" style="font-size:12.5px" onclick="goPage('stories');setTimeout(()=>document.getElementById('story-${day % STORIES.length}')?.scrollIntoView({behavior:'smooth'}),100)">Read full story →</button>`;
}

// ═══════════════ SEARCH ═══════════════
function onInput() {
  const q = document.getElementById('sq').value.trim();
  document.getElementById('sx').classList.toggle('on', q.length > 0);
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
  document.getElementById('sx').classList.remove('on');
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
    const results = { ayat: [], names: [], hadith: [], stories: [] };
    if (FILT === 'all' || FILT === 'ayat') {
      results.ayat = AYAT.filter(a => `${a.en} ${a.tr} ${a.sn} ${a.th.join(' ')}`.toLowerCase().includes(q)).slice(0, 10);
    }
    if (FILT === 'all' || FILT === 'names') {
      results.names = NAMES.filter(n => `${n.tr} ${n.mean} ${n.desc}`.toLowerCase().includes(q)).slice(0, 8);
    }
    if (FILT === 'all' || FILT === 'hadith') {
      results.hadith = HADITH.filter(h => `${h.en} ${h.narr} ${h.cat}`.toLowerCase().includes(q)).slice(0, 8);
    }
    if (FILT === 'all' || FILT === 'stories') {
      results.stories = STORIES.filter(s => `${s.name} ${s.sub} ${s.body} ${s.lesson}`.toLowerCase().includes(q)).slice(0, 5);
    }

    const total = results.ayat.length + results.names.length + results.hadith.length + results.stories.length;
    document.getElementById('ld').classList.remove('on');
    document.getElementById('resCount').textContent = total + ' found';

    if (total === 0) {
      document.getElementById('es').classList.add('on');
      return;
    }

    let html = '';
    if (results.ayat.length) {
      html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Ayat (${results.ayat.length})</h3><div class="cs">${results.ayat.map(a => cardHTML(a, q)).join('')}</div>`;
    }
    if (results.names.length) {
      html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Names of Allah (${results.names.length})</h3><div class="names-grid">${results.names.map(nameCard).join('')}</div>`;
    }
    if (results.hadith.length) {
      html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Hadith (${results.hadith.length})</h3>${results.hadith.map(hadithCard).join('')}`;
    }
    if (results.stories.length) {
      html += `<h3 style="font-family:var(--fd);font-size:.95rem;color:var(--t3);margin:1.5rem 0 .5rem;letter-spacing:.05em;text-transform:uppercase">Stories (${results.stories.length})</h3>${results.stories.map((s,i)=>storyCard(s,i)).join('')}`;
    }
    document.getElementById('rg').innerHTML = html;
  }, 200);
}

// ═══════════════ SURAH GRID ═══════════════
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
function openSurah(num) {
  goPage('sv');
  const meta = SURAHS.find(s => s.num === num);
  const ayat = AYAT.filter(a => a.s === num);
  const bism = num !== 1 && num !== 9 ? '<div style="text-align:center;font-family:var(--fa);font-size:2rem;color:var(--t2);padding:1.5rem;margin-bottom:1.25rem;background:var(--bg3);border:.5px solid var(--gdb);border-radius:var(--r2);box-shadow:var(--sh1)">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : '';
  const pill = meta?.type === 'Meccan' ? '<span class="pill pg">Makki</span>' : '<span class="pill ps">Madani</span>';
  document.getElementById('svc').innerHTML = `
    <div style="background:var(--bg3);border:.5px solid var(--bd2);border-radius:var(--r3);padding:1.75rem 2rem;margin-bottom:1.5rem;box-shadow:var(--sh1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <div><h2 style="font-family:var(--fd);font-size:1.6rem;font-weight:300;letter-spacing:-.03em;margin-bottom:6px">${meta?.en || 'Surah ' + num}</h2><p style="font-size:13px;color:var(--t4)">${meta?.meaning || ''} · ${meta?.ayat || ''} ayat · ${pill}</p></div>
      <div style="font-family:var(--fa);font-size:2.2rem;color:var(--t2);text-align:right">${meta?.ar || ''}</div>
    </div>
    ${bism}
    ${ayat.length ? '<div class="cs">' + ayat.map(a => cardHTML(a)).join('') + '</div>' : '<div style="padding:2rem;text-align:center;color:var(--t4);font-size:14px">No curated ayat available for this surah yet.</div>'}`;
}

// ═══════════════ 99 NAMES ═══════════════
function renderNames(filter = '') {
  const f = filter.toLowerCase();
  const list = f ? NAMES.filter(n => n.tr.toLowerCase().includes(f) || n.mean.toLowerCase().includes(f) || n.desc.toLowerCase().includes(f)) : NAMES;
  document.getElementById('ng').innerHTML = list.map(nameCard).join('');
}
function filterNames(v) { renderNames(v); }
function nameCard(n) {
  return `<div class="ncard" onclick="openName(${n.n})">
    <div class="n-num">${n.n}</div>
    <div class="n-ar">${n.ar}</div>
    <div class="n-tr">${n.tr}</div>
    <div class="n-mean">${n.mean}</div>
  </div>`;
}
function openName(num) {
  const n = NAMES.find(x => x.n === num);
  if (!n) return;
  goPage('nv');
  const bmOn = BM.some(b => b.type === 'name' && b.n === num);
  document.getElementById('nvc').innerHTML = `
    <div style="background:var(--bg3);border:.5px solid var(--bd2);border-radius:var(--r3);padding:2.5rem 2rem;box-shadow:var(--sh2);text-align:center">
      <div style="display:inline-block;font-size:12px;color:var(--gd);background:var(--gds);border:.5px solid var(--gdb);border-radius:20px;padding:4px 14px;margin-bottom:1.5rem">Name ${n.n} of 99</div>
      <div style="font-family:var(--fa);font-size:clamp(3rem,8vw,5rem);color:var(--t1);line-height:1.2;margin-bottom:1rem">${n.ar}</div>
      <div style="font-family:var(--fd);font-size:2rem;font-weight:300;color:var(--gd);letter-spacing:-.02em;margin-bottom:.5rem">${n.tr}</div>
      <div style="font-size:16px;color:var(--t2);font-style:italic;margin-bottom:1.5rem">${n.mean}</div>
      <div style="font-size:14.5px;color:var(--t2);line-height:1.8;max-width:600px;margin:0 auto;font-weight:300">${n.desc}</div>
      <div style="margin-top:2rem;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-nv" onclick="toggleBm('nv','name',${num},0)" style="padding:8px 16px;width:auto;gap:6px">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg>
          ${bmOn ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </div>`;
}

// ═══════════════ HADITH ═══════════════
function renderHadith(filter = '') {
  const f = filter.toLowerCase();
  const list = f ? HADITH.filter(h => (h.en + ' ' + h.narr + ' ' + h.cat + ' ' + h.src).toLowerCase().includes(f)) : HADITH;
  document.getElementById('hg').innerHTML = list.map(hadithCard).join('');
}
function filterHadith(v) { renderHadith(v); }
function hadithCard(h) {
  const uid = 'h' + (++CID);
  const bmOn = BM.some(b => b.type === 'hadith' && b.en === h.en);
  const authPill = h.auth === 'Sahih' ? '<span class="h-auth">✓ Sahih (Authentic)</span>' : '<span class="h-auth weak">Hasan (Good)</span>';
  return `<div class="hcard">
    <div class="h-head">
      ${authPill}
      <span class="h-src">${h.src}</span>
      ${h.num ? `<span class="pill pa">40 Nawawi #${h.num}</span>` : ''}
      <span class="pill pb">${h.cat}</span>
      <button class="cb ${bmOn ? 'bm' : ''}" id="bm-${uid}" onclick="toggleBmHadith('${uid}','${h.en.replace(/'/g,"\\'").substring(0,100)}')" style="margin-left:auto"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
    </div>
    <div class="h-ar">${h.ar}</div>
    <div class="h-txt">"${h.en}"</div>
    <div class="h-narr">Narrated by ${h.narr}</div>
  </div>`;
}
function toggleBmHadith(uid, enSnippet) {
  const h = HADITH.find(x => x.en.substring(0, 100) === enSnippet);
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

// ═══════════════ STORIES ═══════════════
function renderStories() {
  document.getElementById('stg').innerHTML = STORIES.map((s, i) => storyCard(s, i)).join('');
}
function storyCard(s, idx) {
  const paras = s.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
  return `<div class="story-card" id="story-${idx}">
    <div class="story-head">
      <div class="story-ico">${s.icon}</div>
      <div><div class="story-title">${s.name}</div><div class="story-subtitle">${s.sub}</div></div>
    </div>
    <div class="story-body">${paras}</div>
    <div class="story-lesson"><strong>Reflection:</strong> ${s.lesson}</div>
  </div>`;
}

// ═══════════════ BOOKMARKS ═══════════════
function renderBookmarks() {
  document.getElementById('bmc').textContent = BM.length + ' saved';
  if (BM.length === 0) {
    document.getElementById('bg2').innerHTML = '';
    document.getElementById('be').style.display = 'block';
    return;
  }
  document.getElementById('be').style.display = 'none';
  let html = '';
  const ayahBms = BM.filter(b => b.type === 'ayah');
  const nameBms = BM.filter(b => b.type === 'name');
  const hadithBms = BM.filter(b => b.type === 'hadith');
  if (ayahBms.length) {
    const ayat = ayahBms.map(b => AYAT.find(a => a.s == b.s && a.a == b.a)).filter(Boolean);
    html += `<h3 style="font-family:var(--fd);font-size:1rem;color:var(--t3);margin:1rem 0 .5rem">Ayat (${ayat.length})</h3><div class="cs">${ayat.map(a => cardHTML(a)).join('')}</div>`;
  }
  if (nameBms.length) {
    const names = nameBms.map(b => NAMES.find(n => n.n === b.n)).filter(Boolean);
    html += `<h3 style="font-family:var(--fd);font-size:1rem;color:var(--t3);margin:1.5rem 0 .5rem">Names (${names.length})</h3><div class="names-grid">${names.map(nameCard).join('')}</div>`;
  }
  if (hadithBms.length) {
    const hads = hadithBms.map(b => HADITH.find(h => h.en === b.en)).filter(Boolean);
    html += `<h3 style="font-family:var(--fd);font-size:1rem;color:var(--t3);margin:1.5rem 0 .5rem">Hadith (${hads.length})</h3>${hads.map(hadithCard).join('')}`;
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

// ═══════════════ AYAT CARDS ═══════════════
function cardHTML(a, q = '') {
  const uid = 'c' + (++CID);
  const bmOn = BM.some(b => b.type === 'ayah' && b.s == a.s && b.a == a.a);
  const pill = a.rev === 'Meccan' ? '<span class="pill pg">Makki</span>' : '<span class="pill ps">Madani</span>';
  return `<div class="card" id="card-${uid}">
    <div class="ch">
      <div class="cm">${pill}<span class="cr">${a.sn}</span><span class="cs2">· ${a.s}:${a.a}</span></div>
      <div class="cbs">
        <button class="cb" title="Transliteration" onclick="toggleTr('${uid}')"><svg width="13" height="10" viewBox="0 0 13 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1.5 2.5h10M1.5 5h7M1.5 7.5h5"/></svg></button>
        <button class="cb ${bmOn ? 'bm' : ''}" id="bm-${uid}" title="Bookmark" onclick="toggleBm('${uid}','ayah',${a.s},${a.a})"><svg width="10" height="12" viewBox="0 0 10 12" fill="${bmOn ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1.5 1.5h7v9L5 8 1.5 10.5z"/></svg></button>
        <button class="cb" title="Play" onclick="playAyah('${uid}',${a.s},${a.a})"><svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor"><path d="M2 1l8 5-8 5z"/></svg></button>
      </div>
    </div>
    <div class="arabic">${a.ar}</div>
    <div class="trl" id="trl-${uid}">${a.tr}</div>
    <div class="trs">${q ? hl(a.en, q) : a.en}</div>
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

// ═══════════════ AUDIO ═══════════════
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
  const urls = [
    `https://everyayah.com/data/${REC}/${s3}${a3}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${s3}${a3}.mp3`
  ];
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
  btn.innerHTML = pl
    ? '<svg width="9" height="11" viewBox="0 0 9 11" fill="white"><rect x=".5" y=".5" width="3" height="10" rx="1"/><rect x="5.5" y=".5" width="3" height="10" rx="1"/></svg>'
    : '<svg width="11" height="13" viewBox="0 0 11 13" fill="white"><path d="M2 1.5l8 5-8 5z"/></svg>';
}
function chRec(v) { REC = v; localStorage.setItem('annur_rec', v); }
function seekA(e, bar) { if (!AUD || !AUD.duration) return; const r = bar.getBoundingClientRect(); AUD.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * AUD.duration; }
function fmt(s) { return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }
function showAudioErr(uid) {
  const aw = document.getElementById('aw-' + uid);
  if (!aw) return;
  aw.innerHTML = `<div style="display:flex;align-items:center;gap:10px;width:100%;flex-wrap:wrap;font-size:13px;color:var(--t3)">⚠️ Audio blocked in preview — works once deployed to Vercel/GitHub Pages. <a href="https://everyayah.com" target="_blank" style="color:var(--ac);text-decoration:underline">Open EveryAyah →</a></div>`;
}

// ═══════════════ TOAST ═══════════════
let TT;
function toast(m) {
  const el = document.getElementById('toast');
  document.getElementById('tm').textContent = m;
  el.classList.add('on');
  clearTimeout(TT);
  TT = setTimeout(() => el.classList.remove('on'), 2200);
}
