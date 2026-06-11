/* ================================================================
   CLAUSTRUM // SECTOR 03 RECORDS SYSTEM
   script.js — Build 1.0
   ================================================================ */
'use strict';

// ================================================================
// ACCESS CODE SYSTEM
// ================================================================

/*
  CODES AND THEIR DISTRIBUTION:

  LEVEL C — BASIC ACCESS
    SECTOR-03    → distributed in the PODCAST episode
    BUNKER7      → found inside the GAME (terminal in day 2)
    OPEN-FILE    → distributed via INSTAGRAM devlog

  LEVEL B — EXTENDED ACCESS
    DN-7749      → hidden in the PHYSICAL DIARY easter egg
    NOVADEPTH    → found inside the GAME (terminal in day 4)
    ARCHIVE-B    → distributed via the ARG web pages

  LEVEL A — FULL ACCESS
    CLEARANCE-A  → found inside the GAME (terminal in day 6, after final door)
    SECTOR03-A   → distributed in very limited physical editions only
*/

const CODES = {
  'SECTOR-03':   { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'BUNKER7':     { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'OPEN-FILE':   { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'DN-7749':     { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'NOVADEPTH':   { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'ARCHIVE-B':   { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'CLEARANCE-A': { level: 'A', label: 'LEVEL A — FULL ACCESS' },
  'SECTOR03-A':  { level: 'A', label: 'LEVEL A — FULL ACCESS' },
};

const SK = 'claustrum_access';

function getAccess() {
  try { return JSON.parse(sessionStorage.getItem(SK)) || null; }
  catch { return null; }
}
function setAccess(level, label) {
  sessionStorage.setItem(SK, JSON.stringify({ level, label }));
}
function levelRank(l) { return { C:1, B:2, A:3 }[l] || 0; }
function hasLevel(req) {
  const a = getAccess();
  return a ? levelRank(a.level) >= levelRank(req) : false;
}

// ================================================================
// CLOCK
// ================================================================
function updateClock() {
  const el = document.getElementById('sysClock');
  if (!el) return;
  const n = new Date();
  const p = x => String(x).padStart(2,'0');
  el.textContent =
    n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate())+
    ' '+p(n.getHours())+':'+p(n.getMinutes())+':'+p(n.getSeconds())+' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ================================================================
// TAB NAVIGATION
// ================================================================
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pg = document.getElementById('page-' + tab.dataset.tab);
      if (pg) pg.classList.add('active');
    });
  });
}

// ================================================================
// SEARCH INDEX
// All content, including classified entries unlocked at various levels
// ================================================================
const SEARCH_INDEX = [
  // ── OPEN (Level C) ──
  {
    ref:'DN-SUJ-001', title:'HARLAN — SUBJECT FILE',
    snippet:'Forties. Calm voice. Assigned role: bunker caretaker. Full facility access. Status: ACTIVE. Catchphrase documented. Refer protocol file.',
    cat:'SUBJECTS', level:'C', tab:'bunker', room:'control'
  },
  {
    ref:'DN-SUJ-003', title:'THE SUBJECT — OBSERVATION PROTOCOL',
    snippet:'Active subject. Partial amnesia induced at intake. Diary: under monitoring. Must not become aware of protocol nature. Day 6 threshold approaching.',
    cat:'SUBJECTS', level:'C', tab:'bunker', room:'dormitory'
  },
  {
    ref:'DN-BNK-001', title:'SECTOR 03 — INFRASTRUCTURE OVERVIEW',
    snippet:'Underground bunker. 6 operational sectors. Redundant generator. 14 active security cameras. External access: SEALED. Spatial anomaly in Storage A.',
    cat:'INFRASTRUCTURE', level:'C', tab:'bunker'
  },
  {
    ref:'DN-DOC-001', title:'INITIAL SUBJECT DECLARATION',
    snippet:'Arrival interview transcript. Subject memory of the collapse and rescue. Three inconsistencies detected. See Appendix A.',
    cat:'TESTIMONIES', level:'C', tab:'archive'
  },
  {
    ref:'DN-DOC-002', title:'OPERATIVE MANUAL — SECTOR 03',
    snippet:'General facility description, usage protocols and emergency procedures. Revision 4.2. Restricted access: Storage A and Machine Room.',
    cat:'INFRASTRUCTURE', level:'C', tab:'archive'
  },
  // ── RESTRICTED (Level B) ──
  {
    ref:'DN-SUJ-002', title:'THE PRIOR SUBJECT — INCOMPLETE FILE',
    snippet:'Identity: [REDACTED]. Entered Sector 03 on [REDACTED]. Current status: DISAPPEARED. Same initials as flashlight SEC-7 and unfinished note.',
    cat:'SUBJECTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-BNK-002', title:'REGISTERED ANOMALIES — SECTOR 03',
    snippet:'Spatial discrepancy in Storage A. Camera 07 irregular behaviour. Unexplained audio fragments. Days 3–5. Mirror inscription Day 5.',
    cat:'INFRASTRUCTURE', level:'B', tab:'archive'
  },
  {
    ref:'DN-INC-001', title:'INCIDENT 1987 — OFFICIAL REPORT',
    snippet:'Extreme resilience test protocol. 12 subjects. 3 survivors. Official cause: [REDACTED]. Classification elevated to RESERVED.',
    cat:'INCIDENTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-OBJ-001', title:'OBJECT REGISTRY — FLASHLIGHT SEC-7',
    snippet:'Standard issue flashlight. Initials engraved on base: [REDACTED]. Origin unconfirmed. Linked to unfinished note in Storage A. Prior subject connection.',
    cat:'OBJECTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-OBJ-002', title:'UNFINISHED NOTE — STORAGE A',
    snippet:'Text fragment. Author unknown. Same initials as flashlight SEC-7. Content: [REDACTED]. Date estimated prior to current subject.',
    cat:'OBJECTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-DOC-003', title:'INCIDENT 1987 — EXECUTIVE SUMMARY',
    snippet:'Extreme resilience test protocol. 12 volunteer subjects. 3 survivors. Real objective: [REDACTED]. Official cause falsified.',
    cat:'INCIDENTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-DOC-004', title:'OBJECT FILE — FLASHLIGHT SEC-7',
    snippet:'Initials engraved by hand. Not in any intake inventory. Provenance unknown. Matches note DN-OBJ-002 and mirror inscription Day 5.',
    cat:'OBJECTS', level:'B', tab:'archive'
  },
  {
    ref:'DN-DOC-007', title:'NON-DISCLOSURE AGREEMENT — 1987 SURVIVORS',
    snippet:'Agreement signed by three survivors. Terms include: [REDACTED]. One signatory status: UNKNOWN since [REDACTED].',
    cat:'CONTRACTS', level:'B', tab:'archive'
  },
  // ── CLASSIFIED (Level A) ──
  {
    ref:'DN-INC-002', title:'TESTIMONIES — 1987 SURVIVORS',
    snippet:'Three survivors identified. No public statement authorised. Classified interviews. Significant inconsistencies between versions.',
    cat:'INCIDENTS', level:'A', tab:'archive'
  },
  {
    ref:'DN-PRO-001', title:'HARLAN PROTOCOL — COMPLETE MANUAL',
    snippet:'Harlan is not a survivor. He is the active protocol coordinator. Nightly questions. Catchphrase. Memory rewriting. Day 4 replacement procedure.',
    cat:'PROTOCOLS', level:'A', tab:'archive'
  },
  {
    ref:'DN-DOC-005', title:'HARLAN PROTOCOL — COMPLETE OPERATIVE MANUAL',
    snippet:'Harlan coordinates the experiment. Nightly questions implant false memories. Catchphrase discontinuation on Day 4. Replacement or deep modification.',
    cat:'PROTOCOLS', level:'A', tab:'archive'
  },
  {
    ref:'DN-DOC-006', title:'TESTIMONY — 1987 SURVIVOR — SUBJECT 9',
    snippet:'Only uncensored transcript. "The walls change. The coordinator had a notebook. What you said at dinner — the next day the world matched it." Flashlight connection revealed.',
    cat:'TESTIMONIES', level:'A', tab:'archive'
  },
  {
    ref:'DN-DOC-008', title:'SURVEILLANCE PLAN — POST-1987 SURVIVORS',
    snippet:'Active monitoring of three survivors. Subject C (Subject 9): LOCATION UNKNOWN since [REDACTED]. Risk: [REDACTED]. Active measures: [REDACTED].',
    cat:'SURVEILLANCE', level:'A', tab:'archive'
  },
];

function renderResults(results) {
  const cont   = document.getElementById('sfResults');
  const idle   = document.getElementById('sfIdle');
  if (!results) {
    cont.classList.remove('visible');
    idle.style.display = 'grid';
    return;
  }
  idle.style.display = 'none';
  cont.classList.add('visible');

  if (results.length === 0) {
    cont.innerHTML = `<div class="sf-results-hd"><span>SEARCH — NO RESULTS</span><span>0 RECORDS</span></div>
      <div class="result-row" style="cursor:default">
        <div class="rr-body"><div class="rr-snip">No records found for this query. Check search terms or your clearance level.</div></div>
      </div>`;
    return;
  }

  const access = getAccess();
  const ul = access ? levelRank(access.level) : 0;

  let html = `<div class="sf-results-hd"><span>SEARCH RESULTS</span><span>${results.length} RECORD${results.length!==1?'S':''} FOUND</span></div>`;

  results.forEach((r, i) => {
    const reqL = levelRank(r.level);
    const ok   = ul >= reqL;
    const badgeClass = 'lv-'+r.level.toLowerCase();
    const lvLabel = r.level==='A'?'LEVEL A — TOP SECRET': r.level==='B'?'LEVEL B — RESTRICTED':'LEVEL C — BASIC';

    html += `<div class="result-row" onclick="handleResult('${r.tab}','${r.ref}',${ok})">
      <div class="rr-n">${String(i+1).padStart(2,'0')}</div>
      <div class="rr-body">
        <div class="rr-ref">${r.ref} // ${r.cat}</div>
        <div class="rr-title">${ok ? r.title : r.title.replace(/[A-Z]{4,}/g, m=>'█'.repeat(m.length))}</div>
        <div class="rr-snip">${ok ? r.snippet : '█████████████████ ACCESS DENIED — INSUFFICIENT CLEARANCE █████████████████'}</div>
      </div>
      <span class="rr-badge ${badgeClass}">${lvLabel}</span>
    </div>`;
  });

  cont.innerHTML = html;
}

function handleResult(tab, ref, ok) {
  if (!ok) {
    const gs = document.getElementById('gateStatus');
    if (gs) { gs.textContent='ACCESS DENIED — HIGHER CLEARANCE REQUIRED'; gs.className='gate-status err'; }
    // Switch to archive tab to show gate
    document.querySelector('.nav-tab[data-tab="archive"]')?.click();
    return;
  }
  if (tab === 'archive') {
    document.querySelector('.nav-tab[data-tab="archive"]')?.click();
    setTimeout(() => {
      const card = document.querySelector(`.doc-card[data-ref="${ref}"]`);
      if (card) { card.scrollIntoView({behavior:'smooth',block:'center'}); card.click(); }
    }, 200);
  } else if (tab === 'bunker') {
    document.querySelector('.nav-tab[data-tab="bunker"]')?.click();
  }
}

function doSearch() {
  const q   = (document.getElementById('sfInput')?.value||'').trim().toLowerCase();
  const cat = document.getElementById('sfCat')?.value || 'ALL';
  const lev = document.getElementById('sfLevel')?.value || 'ALL';

  if (!q && cat==='ALL' && lev==='ALL') { renderResults(null); return; }

  const res = SEARCH_INDEX.filter(r => {
    const mq = !q || r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q) ||
                r.ref.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q);
    const mc = cat==='ALL' || r.cat===cat;
    const ml = lev==='ALL' || r.level===lev;
    return mq && mc && ml;
  });
  renderResults(res);
}

function initSearch() {
  document.getElementById('sfBtn')?.addEventListener('click', doSearch);
  document.getElementById('sfInput')?.addEventListener('keydown', e => { if(e.key==='Enter') doSearch(); });
  document.getElementById('sfCat')?.addEventListener('change', doSearch);
  document.getElementById('sfLevel')?.addEventListener('change', doSearch);

  document.querySelectorAll('.idle-cell').forEach(c => {
    c.addEventListener('click', () => {
      const inp = document.getElementById('sfInput');
      if(inp) inp.value = c.dataset.query||'';
      doSearch();
    });
  });
}

// ================================================================
// BUNKER MAP
// ================================================================
const ROOMS = {
  dormitory: {
    name:'Dormitory', ref:'ZONE D-01',
    desc:'Metal bed. Reinforced concrete walls. Forced ventilation. Fluorescent lighting.',
    anomaly:'47 vertical marks on the north wall. Inconsistent with current subject\'s time of stay.',
    classified:'Hidden camera DN-CAM-04. 92% field of view. Continuous recording.',
    tags:['occupied','monitored','anomaly'], level:'C'
  },
  main_room: {
    name:'Main Room', ref:'ZONE P-01',
    desc:'Central table. Four chairs. Shortwave radio. Monitoring terminal. Access to all sectors.',
    anomaly:'Security cameras oriented toward centre — not toward entrances. Non-standard. Recorded but not corrected per protocol.',
    classified:'Primary meeting point. Harlan Protocol active in this room. All conversations recorded.',
    tags:['central','protocol-active','cameras'], level:'C'
  },
  kitchen: {
    name:'Kitchen', ref:'ZONE C-01',
    desc:'90-day supplies. Coffee maker. Sealed refrigerator. Inventory updated daily.',
    anomaly:'Supplies modified to match subject\'s nightly statements. Mechanism unknown to subject.',
    classified:'Primary conditioning vector. See Rewriting Protocol — Appendix C.',
    tags:['conditioning','monitored'], level:'C'
  },
  storage_a: {
    name:'Storage A', ref:'ZONE AL-01',
    desc:'Exterior dimensions: 8x6m. Interior dimensions: 5.2x4.1m. Unexplained spatial discrepancy.',
    anomaly:'Unfinished note. Ref. DN-OBJ-002. Shadow of long-adhered object on north wall. Object previously removed.',
    classified:'[REDACTED — LEVEL A REQUIRED]',
    tags:['spatial-discrepancy','classified-object','anomaly'], level:'B'
  },
  machine_room: {
    name:'Machine Room', ref:'ZONE M-01',
    desc:'Main generator. Ventilation system. Electrical distribution panel. Restricted access.',
    anomaly:'Generator failures at non-random intervals. Pattern detected Days 4–6. Official cause: undetermined.',
    classified:'Failures are scheduled per protocol calendar. See Darkness Protocol — Appendix F.',
    tags:['critical','protocol-active','scheduled-failures'], level:'B'
  },
  bathroom: {
    name:'Bathroom', ref:'ZONE B-01',
    desc:'Single mirror. Shower. Ventilation. Only room without direct camera per privacy protocol.',
    anomaly:'Day 5: initials written in condensation on mirror. Match flashlight SEC-7 and note DN-OBJ-002. Not attributable to current subject.',
    classified:'Steam sensor active. Activity logged without camera. Forensic analysis pending.',
    tags:['no-camera','day-5-anomaly','initials'], level:'B'
  },
  north_corridor: {
    name:'North Corridor', ref:'ZONE PN-01',
    desc:'Main corridor. Length: [variable per subject declaration]. Fluorescents. 3 cameras.',
    anomaly:'Perceived length changes according to subject response in nightly questionnaire.',
    classified:'See Rewriting Protocol — Section 2. Expected outcome: progressive spatial confusion.',
    tags:['rewriting-active','variable','cameras'], level:'A'
  },
  control: {
    name:'Control Room', ref:'ZONE CT-01',
    desc:'Operations centre. Access: authorised personnel only. Harlan has permanent access.',
    anomaly:'Location unknown to the subject. Does not appear in plans shared with the subject.',
    classified:'[CLASSIFIED — LEVEL A] Contains: operational protocols, external communications, intervention schedule.',
    tags:['restricted','undisclosed','harlan'], level:'A'
  },
};

function initMap() {
  document.querySelectorAll('.map-room').forEach(r => {
    r.addEventListener('click', () => {
      document.querySelectorAll('.map-room').forEach(x => x.classList.remove('sel'));
      r.classList.add('sel');
      renderRoom(r.dataset.room);
    });
  });
}

function renderRoom(id) {
  const d = ROOMS[id]; if(!d) return;
  const panel = document.getElementById('ipBody');
  const ul = getAccess() ? levelRank(getAccess().level) : 0;
  const rl = levelRank(d.level);
  const ok = ul >= rl;

  const tags = d.tags.map(t => {
    const cls = t.includes('anomaly')||t.includes('discrepancy')||t.includes('day-5')||t.includes('initials') ? 'anom'
              : t.includes('restricted')||t.includes('classified') ? 'crit' : '';
    return `<span class="ip-tag ${cls}">${t.toUpperCase()}</span>`;
  }).join('');

  panel.innerHTML = `
    <div class="ip-room-title">${d.name}</div>
    <div class="ip-field"><div class="ip-field-lbl">Reference</div><div class="ip-field-val">${d.ref}</div></div>
    <div class="ip-field"><div class="ip-field-lbl">Description</div><div class="ip-field-val">${d.desc}</div></div>
    <div class="ip-field"><div class="ip-field-lbl">Registered anomaly</div><div class="ip-field-val anom">${d.anomaly}</div></div>
    <div class="ip-field">
      <div class="ip-field-lbl">Classified information</div>
      <div class="ip-field-val crit">${ok ? d.classified : '[LEVEL '+d.level+' REQUIRED — ENTER ACCESS CODE]'}</div>
    </div>
    <div class="ip-field"><div class="ip-field-lbl">Status tags</div><div class="ip-tags">${tags}</div></div>`;
  panel.classList.remove('ip-empty');
}

// ================================================================
// ARCHIVE GATE
// ================================================================
function initGate() {
  const existing = getAccess();
  if (existing) { unlockArchive(existing.level, existing.label); }

  function tryCode(input, status) {
    const val = (input?.value||'').trim().toUpperCase();
    const match = CODES[val];
    if (match) {
      setAccess(match.level, match.label);
      if(input) input.value='';
      if(status){ status.textContent='AUTHENTICATION SUCCESSFUL — '+match.label; status.className='gate-status ok'; }
      setTimeout(() => unlockArchive(match.level, match.label), 600);
    } else {
      if(input) input.value='';
      if(status){ status.textContent='INVALID CODE — ACCESS DENIED'; status.className='gate-status err'; }
      setTimeout(()=>{ if(status){status.textContent='ENTER AUTHORISATION CODE'; status.className='gate-status';} }, 3000);
    }
  }

  const gi = document.getElementById('gateInput');
  const gs = document.getElementById('gateStatus');
  const gb = document.getElementById('gateBtn');
  gb?.addEventListener('click', () => tryCode(gi, gs));
  gi?.addEventListener('keydown', e => { if(e.key==='Enter') tryCode(gi,gs); });
}

function unlockArchive(level, label) {
  document.getElementById('archiveGate').style.display = 'none';
  document.getElementById('archiveContent').classList.add('unlocked');
  const lbl = document.getElementById('aabLabel');
  if(lbl){ lbl.textContent = label; lbl.className = 'aab-level lv-'+level.toLowerCase(); }
  renderDocs(level);
}

// ================================================================
// DOCUMENTS
// ================================================================
const DOCS = [
  // LEVEL C
  {
    ref:'DN-DOC-001', level:'C', cat:'TESTIMONIES',
    title:'Initial Subject Declaration',
    desc:'Arrival interview transcript. Subject memory of the collapse and rescue. Inconsistencies documented.',
    date:'2026-03-[REDACTED]', pages:4,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — SECTOR 03',
      title:'INITIAL SUBJECT DECLARATION',
      subtitle:'Arrival interview transcript — Confidential',
      classif:'RESERVED', ref:'DN-DOC-001 // LEVEL C', date:'[DATE CLASSIFIED]',
      sections:[
        { title:'1. SUBJECT IDENTIFICATION',
          body:`Subject identified as <span class="redact">████████████</span>. Estimated age: <span class="redact">██</span>. No documentation on arrival. Partial amnesia declared for pre-collapse events. Physical condition: stable.` },
        { title:'2. DECLARATION — THE COLLAPSE',
          body:`"I don't remember how I got here. I remember the noise, then nothing. Harlan found me. He says he has been searching the outside for days looking for survivors."<br><br>Declaration consistency: <span class="redact">████████████████████████</span>. Inconsistencies detected: 3. See Appendix A.` },
        { title:'3. EVALUATOR NOTES',
          body:`Subject shows temporal confusion consistent with intake protocol. Has not asked about the outside in the first <span class="redact">██</span> minutes. Trust-stimulus response: POSITIVE. Harlan Protocol activated with expected result.` },
      ],
      sig:{ l:'EVALUATOR: HARLAN [PROTOCOL ACTIVE]', r:'CLASSIFICATION: RESERVED // LEVEL C' }
    }
  },
  {
    ref:'DN-DOC-002', level:'C', cat:'INFRASTRUCTURE',
    title:'Operative Manual — Sector 03',
    desc:'General facility description, usage norms and emergency protocol for Sector 03.',
    date:'1994-11-03', pages:12,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — FACILITIES DIRECTORATE',
      title:'OPERATIVE MANUAL — SECTOR 03',
      subtitle:'Internal use — Revision 4.2',
      classif:'RESERVED', ref:'DN-DOC-002 // LEVEL C', date:'1994-11-03',
      sections:[
        { title:'1. FACILITY DESCRIPTION',
          body:`Sector 03 is a Class B underground facility designed to house up to <span class="redact">██</span> persons for a maximum period of <span class="redact">███</span> days. Equipped with autonomous generator, filtered ventilation, basic supplies, and shortwave communication.` },
        { title:'2. EMERGENCY PROTOCOL',
          body:`In the event of main generator failure, the backup system activates in <span class="redact">██</span> seconds. Security cameras have independent battery for <span class="redact">██</span> hours. Evacuation protocol: Appendix <span class="redact">█</span>.` },
        { title:'3. USE RESTRICTIONS',
          body:`Access to Storage A is restricted to Level B or higher. Machine Room requires supervision. Control Room is exclusive to the duty coordinator.` },
      ],
      sig:{ l:'FACILITIES DIRECTORATE — 1994', r:'SECTOR 03 // OPERATIVE MANUAL' }
    }
  },
  // LEVEL B
  {
    ref:'DN-DOC-003', level:'B', cat:'INCIDENTS',
    title:'Incident 1987 — Executive Summary',
    desc:'Summary of the 1987 resilience protocol. 12 subjects. 3 survivors. Official causes.',
    date:'1987-09-14', pages:8,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — RESEARCH DEPARTMENT',
      title:'SECTOR 03 INCIDENT — 1987',
      subtitle:'Executive Summary — Restricted Use',
      classif:'RESTRICTED', ref:'DN-DOC-003 // LEVEL B', date:'1987-09-14',
      sections:[
        { title:'1. PROTOCOL DESCRIPTION',
          body:`Extreme resilience test protocol. 12 volunteer subjects. Planned confinement period: <span class="redact">██</span> days. Stated objective to subjects: evaluate adaptation capacity under prolonged isolation. Actual objective: <span class="redact">████████████████████████████████████</span>.` },
        { title:'2. OUTCOME',
          body:`At protocol end, 9 of 12 subjects presented <span class="redact">█████████████████████</span>. Three survivors evacuated. Condition at evacuation: <span class="redact">████████████████</span>. Official cause recorded: severe psychological stress. Actual cause: <span class="redact">████████████████████████████</span>.` },
        { title:'3. MEASURES ADOPTED',
          body:`Full report classified. Access: Level A only. Three survivors signed non-disclosure agreement. See contract DN-DOC-007. None has made a public statement since <span class="redact">████████</span>.` },
      ],
      sig:{ l:'LEAD INVESTIGATOR: <span class="redact">████████████</span>', r:'CLASSIFICATION: RESTRICTED // LEVEL B' }
    }
  },
  {
    ref:'DN-DOC-004', level:'B', cat:'OBJECTS',
    title:'Object File — Flashlight SEC-7',
    desc:'Unidentified initials engraved on base. Linked to unfinished note DN-OBJ-002 and mirror inscription.',
    date:'[DATE UNKNOWN]', pages:2,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — SECTOR 03 INVENTORY',
      title:'OBJECT FILE — FLASHLIGHT SEC-7',
      subtitle:'Unconfirmed owner',
      classif:'RESTRICTED', ref:'DN-DOC-004 // LEVEL B', date:'[DATE UNKNOWN]',
      sections:[
        { title:'1. DESCRIPTION',
          body:`Standard issue flashlight. Model: industrial. Condition: functional. Significant wear consistent with prolonged use. Initials hand-engraved on base: <span class="redact">███</span>. Engraving tool: unidentified sharp object.` },
        { title:'2. PROVENANCE',
          body:`Origin unknown. Not in current subject intake inventory. Not in 1987 protocol inventory. Possible provenance: <span class="redact">████████████████████████</span>. Investigation: ongoing.` },
        { title:'3. CONNECTIONS',
          body:`Initials match signature on note DN-OBJ-002 found in Storage A. Also match initials detected in bathroom mirror (Day 5). Working hypothesis: <span class="redact">████████████████████████████████████████</span>.` },
      ],
      sig:{ l:'INVENTORY: <span class="redact">██████</span>', r:'OBJECT — OWNER UNCONFIRMED' }
    }
  },
  {
    ref:'DN-DOC-007', level:'B', cat:'CONTRACTS',
    title:'Non-Disclosure Agreement — 1987 Survivors',
    desc:'Agreement signed by all three survivors. Terms, penalties, and current status of signatories.',
    date:'1987-10-02', pages:6,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — LEGAL COUNSEL',
      title:'NON-DISCLOSURE AGREEMENT',
      subtitle:'Sector 03 Incident — 1987 — Survivors',
      classif:'RESTRICTED', ref:'DN-DOC-007 // LEVEL B', date:'1987-10-02',
      sections:[
        { title:'1. PARTIES',
          body:`The Ministry of Interior Management, hereinafter "the Authority", and the signatories identified as <span class="redact">████████████</span>, <span class="redact">████████████</span> and <span class="redact">████████████</span>, hereinafter "the Survivors".` },
        { title:'2. OBJECT',
          body:`The Survivors agree not to disclose by any means information relating to: (a) the nature of the Resilience Protocol; (b) confinement conditions in Sector 03; (c) the fate of other participants; (d) any anomaly observed during the confinement period.` },
        { title:'3. PENALTIES',
          body:`Breach of this agreement will result in: (a) immediate legal proceedings; (b) <span class="redact">████████████████████████████████████████████████████████████████████</span>; (c) <span class="redact">████████████████████████████████</span>.` },
        { title:'4. AGREEMENT STATUS',
          body:`Active. All three signatories have complied to date. Last verification contact: <span class="redact">████████</span>. One signatory: <span class="redact">STATUS UNKNOWN SINCE ████████</span>.` },
      ],
      sig:{ l:'LEGAL COUNSEL — 1987', r:'AGREEMENT ACTIVE // LEVEL B' }
    }
  },
  // LEVEL A
  {
    ref:'DN-DOC-005', level:'A', cat:'PROTOCOLS',
    title:'Harlan Protocol — Complete Operative Manual',
    desc:'Full instruction manual for the Harlan role. Nightly questions, catchphrase, Day 4 change management.',
    date:'[CLASSIFIED]', pages:23,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — INTERNAL PROTOCOL',
      title:'HARLAN PROTOCOL — COMPLETE OPERATIVE MANUAL',
      subtitle:'Authorised coordinators only — Destroy after reading',
      classif:'TOP SECRET', ref:'DN-DOC-005 // LEVEL A', date:'[CLASSIFIED]',
      sections:[
        { title:'1. PROTOCOL OBJECTIVE',
          body:`Harlan is not a survivor. He is the active experiment coordinator. His function: maintain the subject in a state of controlled trust while the Memory Rewriting Protocol is executed. The subject must not suspect at any point that Harlan has more information than he appears to have.` },
        { title:'2. NIGHTLY QUESTIONS',
          body:`Each night, Harlan will ask a casual question about a bunker detail. The objective: implant an alternative memory version. The following day, the bunker environment will reflect the subject's response. The subject must not perceive the pattern. If asked, Harlan responds: "I don't remember it well either."` },
        { title:'3. ASSIGNED CATCHPHRASE',
          body:`Harlan will systematically use the phrase "just in case" at the end of sentences. Objective: turn it into an emotional security anchor for the subject. On Day 4, the catchphrase ceases. The subject will perceive the change before being able to consciously identify it.` },
        { title:'4. CHANGE MANAGEMENT — DAY 4',
          body:`On Day 4, Harlan substitution or deep behavioural modification will occur per sub-protocol <span class="redact">████████████████</span>. The substitute coordinator, if applicable, has been trained to maintain apparent continuity. Inconsistency management: see Appendix H.` },
      ],
      sig:{ l:'PROTOCOL DIRECTORATE — CLASSIFIED', r:'LEVEL A — DESTROY AFTER READING' }
    }
  },
  {
    ref:'DN-DOC-006', level:'A', cat:'TESTIMONIES',
    title:'Testimony — 1987 Survivor — Subject 9',
    desc:'Complete declaration of survivor identified as Subject 9. Only uncensored transcript in existence.',
    date:'1987-09-30', pages:11,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — RESERVED ARCHIVE',
      title:'TESTIMONY — 1987 SURVIVOR — SUBJECT 9',
      subtitle:'Uncensored transcript — Top Secret',
      classif:'TOP SECRET', ref:'DN-DOC-006 // LEVEL A', date:'1987-09-30',
      sections:[
        { title:'1. IDENTIFICATION',
          body:`Survivor identified internally as Subject 9. Real name: <span class="redact">████████████████</span>. Age at time of incident: <span class="redact">██</span>. Condition at declaration: coherent but showing signs of severe cognitive dissonance.` },
        { title:'2. TESTIMONY EXTRACT',
          body:`"The bunker is not what it appears to be. The walls change. I know it. I used to see them doing it at night when they thought we were asleep. The coordinator — the one who acted like a friend — had a notebook. He wrote down what we said at dinner. The next day the world was different. Nobody else noticed. Or they pretended not to."<br><br>"The initials on the flashlight belong to <span class="redact">████████</span>. He was the first. Before all of us. And he left the flashlight on purpose."` },
        { title:'3. PSYCHIATRIC EVALUATION',
          body:`Subsequent evaluation classified Subject 9's testimony as the product of severe dissociative state. Evaluator recommendation: do not give public credibility to testimony. Non-disclosure agreement signed. Subject 9 did not speak of Sector 03 again until <span class="redact">████████████████████████████</span>.` },
      ],
      sig:{ l:'EVALUATOR: <span class="redact">████████████</span>', r:'TOP SECRET // LEVEL A' }
    }
  },
  {
    ref:'DN-DOC-008', level:'A', cat:'SURVEILLANCE',
    title:'Surveillance Plan — Post-1987 Survivors',
    desc:'Active monitoring operative on three survivors. Current status of each subject.',
    date:'[ACTIVE]', pages:9,
    content:{
      ministry:'MINISTRY OF INTERIOR MANAGEMENT — SPECIAL OPERATIONS UNIT',
      title:'SURVEILLANCE PLAN — 1987 SURVIVORS',
      subtitle:'Active operative — Continuous update',
      classif:'TOP SECRET', ref:'DN-DOC-008 // LEVEL A', date:'[ACTIVE]',
      sections:[
        { title:'1. SUBJECT A — STATUS',
          body:`Located. Current residence: <span class="redact">████████████████████</span>. Social activity: minimal. Complying with non-disclosure agreement. Quarterly verification contact. No signs of intent to disclose. Risk: LOW.` },
        { title:'2. SUBJECT B — STATUS',
          body:`Located. Current residence: <span class="redact">████████████████████</span>. Has attempted contact with journalists on <span class="redact">█</span> occasions. Contacts intercepted. No effective disclosure has occurred. Risk: MEDIUM. Active measures: <span class="redact">████████████████████████████</span>.` },
        { title:'3. SUBJECT C (SUBJECT 9) — STATUS',
          body:`LOCATION: UNKNOWN since <span class="redact">████████</span>. Last registered contact: <span class="redact">████████████████████</span>. Unknown if still alive. Unknown if information has been disclosed. Risk: <span class="redact">███████████</span>. Measures adopted: <span class="redact">████████████████████████████████████████████████████</span>.` },
      ],
      sig:{ l:'SPECIAL OPERATIONS UNIT', r:'ACTIVE OPERATIVE — TOP SECRET // LEVEL A' }
    }
  },
];

let currentCat = 'ALL';

function renderDocs(level) {
  const cont = document.getElementById('docGrid');
  if(!cont) return;
  const ul = levelRank(level);

  const filtered = DOCS.filter(d => currentCat==='ALL' || d.cat===currentCat);

  cont.innerHTML = filtered.map(doc => {
    const rl = levelRank(doc.level);
    const ok = ul >= rl;
    return `<div class="doc-card lv-${doc.level.toLowerCase()} ${!ok?'locked':''}"
         data-ref="${doc.ref}"
         onclick="${ok?`openDoc('${doc.ref}')`:''}"
         style="cursor:${ok?'pointer':'not-allowed'}">
      <div class="dc-ref">${doc.ref}</div>
      <div class="dc-title">${doc.title}</div>
      <div class="dc-desc">${doc.desc}</div>
      <div class="dc-meta">
        <span class="dc-badge lv-${doc.level.toLowerCase()}">LEVEL ${doc.level}</span>
        <span class="dc-date">${doc.date}</span>
        <span class="dc-pages">${doc.pages} p.</span>
      </div>
    </div>`;
  }).join('');
}

function initDocCats() {
  document.querySelectorAll('.doc-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.doc-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      const a = getAccess();
      renderDocs(a ? a.level : 'C');
    });
  });
}

function openDoc(ref) {
  const doc = DOCS.find(d => d.ref===ref);
  if(!doc) return;
  const viewer = document.getElementById('docViewer');
  const hd     = document.getElementById('dvHdInfo');
  const body   = document.getElementById('dvBody');
  if(!viewer||!body) return;

  if(hd) hd.textContent = `${doc.ref} // ${doc.cat} // LEVEL ${doc.level}`;

  const c = doc.content;
  const secs = c.sections.map(s =>
    `<div class="doc-sec"><div class="doc-sec-title">${s.title}</div><p>${s.body}</p></div>`
  ).join('');

  body.innerHTML = `
    <div class="doc-lh">
      <div class="doc-lh-ministry">${c.ministry}</div>
      <div class="doc-lh-title">${c.title}</div>
      <div class="doc-lh-sub">${c.subtitle}</div>
    </div>
    <div class="doc-meta-row">
      <span>${c.ref} // ${c.date}</span>
      <span class="doc-classif-tag">${c.classif}</span>
    </div>
    ${secs}
    <div class="doc-sig"><span>${c.sig.l}</span><span>${c.sig.r}</span></div>`;

  viewer.classList.add('open');
}

function closeDoc() {
  document.getElementById('docViewer')?.classList.remove('open');
}

// ================================================================
// PARTICLES (very subtle, dark green)
// ================================================================
(function(){
  const cv = document.createElement('canvas');
  cv.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(cv);
  const ctx=cv.getContext('2d');
  let W,H,pts=[];
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;init();}
  function init(){
    pts=[];
    const R=W<600?16:24,C=W<600?16:24;
    for(let i=0;i<R;i++) for(let j=0;j<C;j++)
      pts.push({bx:(j/C)*W,by:(i/R)*H,s:0.35+Math.random()*0.4,ph:Math.random()*Math.PI*2,off:(i+j)*0.18});
  }
  let t=0;
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.22)';
    ctx.fillRect(0,0,W,H);
    t+=0.0025;
    for(const p of pts){
      const x=p.bx+Math.sin(t+p.off)*7;
      const y=p.by+Math.cos(t*0.55+p.off)*11;
      const b=Math.sin(t*0.8+p.ph)*0.5+0.5;
      ctx.beginPath();ctx.arc(x,y,p.s,0,Math.PI*2);
      ctx.fillStyle=`rgba(40,70,30,${0.03+b*0.09})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
})();

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded',()=>{
  updateClock();
  initTabs();
  initSearch();
  initMap();
  initGate();
  initDocCats();
});
