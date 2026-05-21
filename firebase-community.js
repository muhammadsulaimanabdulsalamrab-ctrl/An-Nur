// An-Nur — Firebase Community Features
// All user content is HTML-escaped via esc() before DOM insertion. Safe against XSS.

let _db = null, _fns = null;

// esc() sanitizes every user-provided string before any innerHTML usage
function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function fmtN(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return String(n);
}
function timeAgo(d) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60)+'m ago';
  if (s < 86400) return Math.floor(s/3600)+'h ago';
  return Math.floor(s/86400)+'d ago';
}

// DB init — waits for Firebase module to expose ANNUR_DB on window
function withDb(cb) {
  if (_db) { cb(_db, _fns); return; }
  const tryInit = () => {
    if (window.ANNUR_DB) {
      _db = window.ANNUR_DB; _fns = window.ANNUR_FNS;
      cb(_db, _fns);
    } else {
      setTimeout(tryInit, 120);
    }
  };
  tryInit();
}

// ═══ COMMUNITY TABS ═══
window.switchComTab = function(tab) {
  ['dhikr','duas','reflections'].forEach(t => {
    const el = document.getElementById('com-'+t);
    if (el) el.style.display = t === tab ? '' : 'none';
  });
  document.querySelectorAll('.com-tab').forEach((btn, i) => {
    btn.classList.toggle('on', ['dhikr','duas','reflections'][i] === tab);
  });
  if (tab === 'duas') window.loadDuaBoard('recent');
  if (tab === 'reflections') renderReflectionsPrompt();
};

// ═══ GLOBAL DHIKR ═══
let _dhikrUnsub = null;
function initGlobalDhikr() {
  if (_dhikrUnsub) return;
  withDb((db, fns) => {
    const ref = fns.doc(db, 'global', 'dhikr');
    _dhikrUnsub = fns.onSnapshot(ref, snap => {
      if (!snap.exists()) {
        fns.setDoc(ref, { subhanallah:0, alhamdulillah:0, allahu_akbar:0, total:0 });
        return;
      }
      const d = snap.data();
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmtN(val||0); };
      set('globSub', d.subhanallah);
      set('globHamd', d.alhamdulillah);
      set('globAkbar', d.allahu_akbar);
      set('globTotal', d.total);
    }, ()=>{});
  });
}

window.globIncrement = function(type, el) {
  withDb((db, fns) => {
    const ref = fns.doc(db, 'global', 'dhikr');
    fns.updateDoc(ref, { [type]: fns.firestoreIncrement(1), total: fns.firestoreIncrement(1) })
      .catch(() => fns.setDoc(ref, { subhanallah:0, alhamdulillah:0, allahu_akbar:0, total:1, [type]:1 }));
    if (navigator.vibrate) navigator.vibrate(10);
    if (el) { el.classList.remove('glob-tap'); void el.offsetWidth; el.classList.add('glob-tap'); }
    const num = el && el.querySelector('.glob-n');
    if (num) { num.classList.remove('bump'); void num.offsetWidth; num.classList.add('bump'); }
  });
};

// ═══ DU'A BOARD ═══
let DUA_SORT = 'recent';
window.loadDuaBoard = async function(sort) {
  DUA_SORT = sort || DUA_SORT;
  document.querySelectorAll('.com-sort-btn').forEach((b, i) => b.classList.toggle('on', i===(DUA_SORT==='recent'?0:1)));
  const list = document.getElementById('duaBoardList');
  if (!list) return;
  // Safe static HTML for loading state
  list.textContent = '';
  const loader = document.createElement('div');
  loader.className = 'com-loading';
  loader.textContent = 'Loading du\'as…';
  list.appendChild(loader);
  withDb(async (db, fns) => {
    try {
      const q = fns.query(
        fns.collection(db,'duas_board'),
        fns.orderBy(DUA_SORT==='recent'?'timestamp':'ameens','desc'),
        fns.limit(30)
      );
      const snap = await fns.getDocs(q);
      list.textContent = '';
      if (snap.empty) {
        const emp = document.createElement('div'); emp.className='com-empty';
        emp.textContent = "Be the first to post a du'a 🤲";
        list.appendChild(emp); return;
      }
      snap.docs.forEach(d => list.appendChild(buildDuaCard(d.id, d.data())));
    } catch {
      list.textContent = '';
      const err = document.createElement('div'); err.className='com-empty';
      err.textContent = 'Could not load. Check your connection.';
      list.appendChild(err);
    }
  });
};

function buildDuaCard(id, d) {
  // All text set via textContent — no XSS risk
  const card = document.createElement('div'); card.className='dua-board-card';
  const txt = document.createElement('div'); txt.className='dbc-text'; txt.textContent=d.text||'';
  const meta = document.createElement('div'); meta.className='dbc-meta';
  const nameEl = document.createElement('span'); nameEl.className='dbc-name'; nameEl.textContent=d.name||'A Believer';
  const dot = document.createElement('span'); dot.className='dbc-dot'; dot.textContent='·';
  const timeEl = document.createElement('span'); timeEl.className='dbc-time';
  timeEl.textContent = d.timestamp?.toDate ? timeAgo(d.timestamp.toDate()) : 'recently';
  meta.append(nameEl, dot, timeEl);
  const btn = document.createElement('button'); btn.className='ameen-btn'; btn.id='ameen-btn-'+id;
  btn.setAttribute('aria-label','Say Ameen');
  btn.onclick = function(){ window.sendAmeen(id, btn); };
  const ar = document.createElement('span'); ar.className='ameen-ar'; ar.textContent='آمِين';
  const num = document.createElement('span'); num.className='ameen-n'; num.id='ameen-n-'+id; num.textContent=String(d.ameens||0);
  btn.append(ar, num);
  card.append(txt, meta, btn);
  return card;
}

window.postDua = async function() {
  const textEl = document.getElementById('duaBoardText');
  const nameEl = document.getElementById('duaBoardName');
  const txt = textEl?.value?.trim();
  const name = nameEl?.value?.trim();
  if (!txt) { window.toast && window.toast("Write a du'a first"); return; }
  if (txt.length > 500) { window.toast && window.toast('Max 500 characters'); return; }
  const btn = document.querySelector('.com-post-btn');
  if (btn) { btn.disabled=true; btn.textContent='Posting…'; }
  withDb(async (db, fns) => {
    try {
      await fns.addDoc(fns.collection(db,'duas_board'), {
        text:txt, name:name||'A Believer', ameens:0, timestamp:fns.serverTimestamp()
      });
      textEl.value = '';
      window.toast && window.toast("Du'a posted. May Allah accept it 🤍");
      window.loadDuaBoard('recent');
    } catch { window.toast && window.toast('Failed to post. Try again.'); }
    finally { if (btn) { btn.disabled=false; btn.textContent='Post Du\'a'; } }
  });
};

window.sendAmeen = function(id, btn) {
  if (btn.dataset.done) return;
  btn.dataset.done = '1';
  btn.classList.add('ameened');
  withDb(async (db, fns) => {
    try {
      await fns.updateDoc(fns.doc(db,'duas_board',id), { ameens: fns.firestoreIncrement(1) });
      const n = document.getElementById('ameen-n-'+id);
      if (n) n.textContent = String(parseInt(n.textContent||'0') + 1);
      if (navigator.vibrate) navigator.vibrate(10);
    } catch { delete btn.dataset.done; btn.classList.remove('ameened'); }
  });
};

// ═══ AYAH REFLECTIONS ═══
let REF_KEY = null;
window.openReflections = function(surahNum, ayahNum, preview='') {
  REF_KEY = surahNum+'_'+ayahNum;
  const sheet = document.getElementById('refSheet');
  if (!sheet) return;
  const lbl = document.getElementById('refSheetLabel');
  if (lbl) lbl.textContent = surahNum+':'+ayahNum + (preview ? ' — '+preview.slice(0,55)+'…' : '');
  const refList = document.getElementById('refSheetList');
  if (refList) { refList.textContent=''; const l=document.createElement('div'); l.className='com-loading'; l.textContent='Loading…'; refList.appendChild(l); }
  const refText = document.getElementById('refText');
  if (refText) refText.value='';
  sheet.classList.add('on');
  document.body.style.overflow='hidden';
  loadReflectionsFor(surahNum, ayahNum);
};
window.closeRefSheet = function() {
  document.getElementById('refSheet')?.classList.remove('on');
  document.body.style.overflow='';
};

async function loadReflectionsFor(s, a) {
  const list = document.getElementById('refSheetList');
  if (!list) return;
  withDb(async (db, fns) => {
    try {
      const q = fns.query(fns.collection(db,'ref_'+s+'_'+a), fns.orderBy('timestamp','desc'), fns.limit(40));
      const snap = await fns.getDocs(q);
      list.textContent='';
      if (snap.empty) {
        const emp=document.createElement('div'); emp.className='com-empty';
        emp.textContent='No reflections yet — be the first ✨';
        list.appendChild(emp); return;
      }
      snap.docs.forEach(d => list.appendChild(buildRefCard(d.data())));
    } catch {
      list.textContent='';
      const err=document.createElement('div'); err.className='com-empty';
      err.textContent='Could not load reflections.';
      list.appendChild(err);
    }
  });
}

function buildRefCard(d) {
  const card = document.createElement('div'); card.className='ref-card';
  const txt = document.createElement('div'); txt.className='ref-text'; txt.textContent=d.text||'';
  const meta = document.createElement('div'); meta.className='ref-meta';
  const nameEl=document.createElement('span'); nameEl.className='ref-name'; nameEl.textContent=d.name||'A Believer';
  const timeEl=document.createElement('span'); timeEl.className='ref-time';
  timeEl.textContent = d.timestamp?.toDate ? timeAgo(d.timestamp.toDate()) : 'recently';
  meta.append(nameEl, timeEl);
  card.append(txt, meta);
  return card;
}

window.postReflection = function() {
  const textEl = document.getElementById('refText');
  const nameEl = document.getElementById('refName');
  const text = textEl?.value?.trim();
  const name = nameEl?.value?.trim();
  if (!text) { window.toast && window.toast('Write your reflection first'); return; }
  if (!REF_KEY) return;
  const btn = document.getElementById('refPostBtn');
  if (btn) { btn.disabled=true; btn.textContent='Posting…'; }
  const [s,a] = REF_KEY.split('_');
  withDb(async (db, fns) => {
    try {
      await fns.addDoc(fns.collection(db,'ref_'+s+'_'+a), {
        text, name:name||'A Believer', timestamp:fns.serverTimestamp()
      });
      if (textEl) textEl.value='';
      window.toast && window.toast('Reflection shared 🤍');
      loadReflectionsFor(s, a);
    } catch { window.toast && window.toast('Failed to post. Try again.'); }
    finally { if (btn) { btn.disabled=false; btn.textContent='Share Reflection'; } }
  });
};

function renderReflectionsPrompt() {
  const el = document.getElementById('reflectionsList');
  if (!el) return;
  el.textContent='';
  const wrap = document.createElement('div');
  wrap.style.cssText='text-align:center;padding:2.5rem 1rem;color:var(--t3)';
  const icon = document.createElement('div'); icon.style.cssText='font-size:2.5rem;margin-bottom:1rem'; icon.textContent='📖';
  const p = document.createElement('p'); p.style.cssText='font-size:14px;line-height:1.8;max-width:340px;margin:0 auto';
  p.textContent='Open any Surah and tap 💬 on an ayah to read and share reflections from believers worldwide.';
  const btnEl = document.createElement('button'); btnEl.className='fc';
  btnEl.style.cssText='margin-top:1.5rem;padding:8px 20px';
  btnEl.textContent='Open Qur\'an →';
  btnEl.onclick = ()=>window.goPage('surahs');
  wrap.append(icon, p, btnEl);
  el.appendChild(wrap);
}

// ═══ DAILY NOTIFICATIONS ═══
window.requestDailyNotif = function() {
  if (!('Notification' in window)) { window.toast && window.toast('Notifications not supported'); return; }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      localStorage.setItem('annur_notif','1');
      window.toast && window.toast('Daily reminders enabled 🌅');
      scheduleNotif();
      window.dismissNotifBar();
    } else {
      window.toast && window.toast('Permission denied — enable in browser settings');
    }
  });
};
window.dismissNotifBar = function() {
  const bar = document.getElementById('notifBar');
  if (bar) { bar.classList.remove('on'); setTimeout(()=>bar.remove(),400); }
  localStorage.setItem('annur_notif_dismissed','1');
};
function scheduleNotif() {
  if (Notification.permission !== 'granted') return;
  const now = new Date(), next = new Date();
  next.setHours(8,0,0,0);
  if (next <= now) next.setDate(next.getDate()+1);
  setTimeout(()=>{ fireNotif(); setInterval(fireNotif,86400000); }, next-now);
}
function fireNotif() {
  if (Notification.permission !== 'granted') return;
  const day = Math.floor(Date.now()/86400000);
  const all = window.QURAN_VERSES;
  const v = all ? all[day % all.length] : null;
  const body = v ? '"'+(v.en||'').slice(0,100)+'…" — '+v.s+':'+v.a : 'Your daily ayah awaits. Open An Nur.';
  new Notification('An Nur — Daily Reminder ✨', { body, icon:'/icon.svg', badge:'/icon.svg', tag:'annur-daily' });
}

// ═══ BOOT ═══
document.addEventListener('DOMContentLoaded', ()=>{
  // Notification prompt after 3s if not set
  const dismissed = localStorage.getItem('annur_notif_dismissed');
  const enabled = localStorage.getItem('annur_notif')==='1';
  if (!dismissed && !enabled && 'Notification' in window && Notification.permission !== 'denied') {
    setTimeout(()=>document.getElementById('notifBar')?.classList.add('on'), 3000);
  }
  if (enabled) scheduleNotif();
  // Patch goPage to init community features lazily
  const _orig = window.goPage;
  if (_orig) window.goPage = function(p) {
    _orig(p);
    if (p==='community') setTimeout(initGlobalDhikr, 80);
  };
});
