/* ================================================================
   CLAUSTRUM // SECTOR 03 RECORDS SYSTEM
   script.js — Build 2.0
   ================================================================ */
'use strict';

// ================================================================
// ACCESS CODE SYSTEM — IN-MEMORY ONLY, CODES ACCUMULATE
// Clears completely on page refresh. Each code adds to the set.
// Effective level = highest level reached this session.
//
// DISTRIBUTION:
//   LEVEL C: SECTOR-03 (podcast) · BUNKER7 (game day 2) · OPEN-FILE (instagram)
//   LEVEL B: DN-7749 (physical diary) · NOVADEPTH (game day 4) · ARCHIVE-B (ARG web)
//   LEVEL A: CLEARANCE-A (game day 6, after final door) · SECTOR03-A (limited physical)
//   INFRA:   BUNKER-DEEP (unlocks extra infrastructure data in bunker map)
// ================================================================

const CODES = {
  'SECTOR-03':   { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'BUNKER7':     { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'OPEN-FILE':   { level: 'C', label: 'LEVEL C — BASIC ACCESS' },
  'DN-7749':     { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'NOVADEPTH':   { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'ARCHIVE-B':   { level: 'B', label: 'LEVEL B — EXTENDED ACCESS' },
  'CLEARANCE-A': { level: 'A', label: 'LEVEL A — FULL ACCESS' },
  'SECTOR03-A':  { level: 'A', label: 'LEVEL A — FULL ACCESS' },
  'BUNKER-DEEP': { level: 'INFRA', label: 'INFRASTRUCTURE DEEP ACCESS' },
};

// Video doc unlocked by SECTOR-03 (podcast code)
const PODCAST_VIDEO_CODES = new Set(['SECTOR-03', 'BUNKER7', 'OPEN-FILE', 'DN-7749', 'NOVADEPTH', 'ARCHIVE-B', 'CLEARANCE-A', 'SECTOR03-A']);

const _unlocked = new Set();
let   _effLevel  = null;  // highest archive level
let   _infraDeep = false; // infrastructure extra data
let   _videoUnlocked = false;

function levelRank(l) { return {C:1,B:2,A:3}[l]||0; }

function applyCode(code) {
  const match = CODES[code];
  if (!match) return false;
  _unlocked.add(code);
  if (match.level === 'INFRA') {
    _infraDeep = true;
  } else {
    if (!_effLevel || levelRank(match.level) > levelRank(_effLevel)) {
      _effLevel = match.level;
    }
  }
  if (PODCAST_VIDEO_CODES.has(code)) _videoUnlocked = true;
  return true;
}

function getAccess() {
  if (!_effLevel) return null;
  return {
    level: _effLevel,
    label: 'LEVEL '+_effLevel+' — '+(_effLevel==='A'?'FULL ACCESS':_effLevel==='B'?'EXTENDED ACCESS':'BASIC ACCESS'),
  };
}
function hasLevel(req) { return _effLevel ? levelRank(_effLevel)>=levelRank(req) : false; }

// ================================================================
// CLOCK
// ================================================================
function updateClock() {
  const el = document.getElementById('sysClock');
  if (!el) return;
  const n=new Date(), p=x=>String(x).padStart(2,'0');
  el.textContent=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate())+' '+p(n.getHours())+':'+p(n.getMinutes())+':'+p(n.getSeconds())+' UTC';
}
setInterval(updateClock,1000);
updateClock();

// ================================================================
// TABS
// ================================================================
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      const pg=document.getElementById('page-'+tab.dataset.tab);
      if(pg) pg.classList.add('active');
    });
  });
}

// ================================================================
// SEARCH INDEX
// ================================================================
const SEARCH_INDEX = [
  {ref:'DN-SUJ-001',title:'HARLAN — SUBJECT FILE',snippet:'Forties. Calm voice. Assigned role: bunker caretaker. Full facility access. Status: ACTIVE. Catchphrase documented.',cat:'SUBJECTS',level:'C',tab:'bunker',room:'control'},
  {ref:'DN-SUJ-003',title:'THE SUBJECT — OBSERVATION PROTOCOL',snippet:'Active subject. Partial amnesia induced at intake. Diary under monitoring. Must not become aware of protocol nature.',cat:'SUBJECTS',level:'C',tab:'bunker',room:'dormitory'},
  {ref:'DN-BNK-001',title:'SECTOR 03 — INFRASTRUCTURE OVERVIEW',snippet:'Underground bunker. 6 operational sectors. 14 active cameras. External access: SEALED. Spatial anomaly in Storage A.',cat:'INFRASTRUCTURE',level:'C',tab:'bunker'},
  {ref:'DN-DOC-001',title:'INITIAL SUBJECT DECLARATION',snippet:'Arrival interview transcript. Subject memory of collapse and rescue. Three inconsistencies detected.',cat:'TESTIMONIES',level:'C',tab:'archive'},
  {ref:'DN-DOC-002',title:'OPERATIVE MANUAL — SECTOR 03',snippet:'General facility description, usage protocols and emergency procedures. Revision 4.2.',cat:'INFRASTRUCTURE',level:'C',tab:'archive'},
  {ref:'DN-VID-001',title:'SECTOR 03 — AUDIO-VISUAL DOCUMENT [PODCAST]',snippet:'Classified audio-visual record. Subject matter: Sector 03 incident reconstruction. Distribution: podcast channel only. Code required.',cat:'MEDIA',level:'C',tab:'archive'},
  {ref:'DN-SUJ-002',title:'THE PRIOR SUBJECT — INCOMPLETE FILE',snippet:'Identity: [REDACTED]. Entered Sector 03 on [REDACTED]. Current status: DISAPPEARED. Same initials as flashlight SEC-7.',cat:'SUBJECTS',level:'B',tab:'archive'},
  {ref:'DN-BNK-002',title:'REGISTERED ANOMALIES — SECTOR 03',snippet:'Spatial discrepancy in Storage A. Camera 07 irregular behaviour. Mirror inscription Day 5.',cat:'INFRASTRUCTURE',level:'B',tab:'archive'},
  {ref:'DN-INC-001',title:'INCIDENT 1987 — OFFICIAL REPORT',snippet:'Extreme resilience test protocol. 12 subjects. 3 survivors. Official cause: [REDACTED].',cat:'INCIDENTS',level:'B',tab:'archive'},
  {ref:'DN-OBJ-001',title:'OBJECT REGISTRY — FLASHLIGHT SEC-7',snippet:'Initials engraved on base: [REDACTED]. Linked to unfinished note in Storage A.',cat:'OBJECTS',level:'B',tab:'archive'},
  {ref:'DN-OBJ-002',title:'UNFINISHED NOTE — STORAGE A',snippet:'Text fragment. Author unknown. Same initials as flashlight SEC-7.',cat:'OBJECTS',level:'B',tab:'archive'},
  {ref:'DN-DOC-003',title:'INCIDENT 1987 — EXECUTIVE SUMMARY',snippet:'12 volunteer subjects. 3 survivors. Real objective: [REDACTED]. Official cause falsified.',cat:'INCIDENTS',level:'B',tab:'archive'},
  {ref:'DN-DOC-004',title:'OBJECT FILE — FLASHLIGHT SEC-7',snippet:'Hand-engraved initials. Not in any intake inventory. Matches note DN-OBJ-002 and mirror inscription.',cat:'OBJECTS',level:'B',tab:'archive'},
  {ref:'DN-DOC-007',title:'NON-DISCLOSURE AGREEMENT — 1987 SURVIVORS',snippet:'Agreement signed by three survivors. One signatory status: UNKNOWN since [REDACTED].',cat:'CONTRACTS',level:'B',tab:'archive'},
  {ref:'DN-INC-002',title:'TESTIMONIES — 1987 SURVIVORS',snippet:'Three survivors. No public statement authorised. Significant inconsistencies between versions.',cat:'INCIDENTS',level:'A',tab:'archive'},
  {ref:'DN-PRO-001',title:'HARLAN PROTOCOL — COMPLETE MANUAL',snippet:'Harlan is not a survivor. He is the active coordinator. Nightly questions. Memory rewriting. Day 4 replacement.',cat:'PROTOCOLS',level:'A',tab:'archive'},
  {ref:'DN-DOC-005',title:'HARLAN PROTOCOL — COMPLETE OPERATIVE MANUAL',snippet:'Nightly questions implant false memories. Catchphrase discontinuation Day 4. Replacement procedure.',cat:'PROTOCOLS',level:'A',tab:'archive'},
  {ref:'DN-DOC-006',title:'TESTIMONY — 1987 SURVIVOR — SUBJECT 9',snippet:'"The walls change. The coordinator had a notebook. What you said at dinner — the next day the world matched it."',cat:'TESTIMONIES',level:'A',tab:'archive'},
  {ref:'DN-DOC-008',title:'SURVEILLANCE PLAN — POST-1987 SURVIVORS',snippet:'Subject C (Subject 9): LOCATION UNKNOWN. Risk: [REDACTED]. Active measures: [REDACTED].',cat:'SURVEILLANCE',level:'A',tab:'archive'},
];

function renderResults(results){
  const cont=document.getElementById('sfResults');
  const idle=document.getElementById('sfIdle');
  if(!results){cont.classList.remove('visible');idle.style.display='grid';return;}
  idle.style.display='none';cont.classList.add('visible');
  if(!results.length){
    cont.innerHTML=`<div class="sf-results-hd"><span>SEARCH — NO RESULTS</span><span>0 RECORDS</span></div><div class="result-row" style="cursor:default"><div class="rr-body"><div class="rr-snip">No records found. Check terms or clearance level.</div></div></div>`;
    return;
  }
  const ul=_effLevel?levelRank(_effLevel):0;
  let html=`<div class="sf-results-hd"><span>SEARCH RESULTS</span><span>${results.length} RECORD${results.length!==1?'S':''}</span></div>`;
  results.forEach((r,i)=>{
    const reqL=levelRank(r.level);
    const ok=r.level==='C'?true:ul>=reqL;
    const bc='lv-'+r.level.toLowerCase();
    const lv=r.level==='A'?'LEVEL A — TOP SECRET':r.level==='B'?'LEVEL B — RESTRICTED':'LEVEL C — BASIC';
    html+=`<div class="result-row" onclick="handleResult('${r.tab}','${r.ref}',${ok})">
      <div class="rr-n">${String(i+1).padStart(2,'0')}</div>
      <div class="rr-body">
        <div class="rr-ref">${r.ref} // ${r.cat}</div>
        <div class="rr-title">${ok?r.title:r.title.replace(/[A-Z]{4,}/g,m=>'█'.repeat(m.length))}</div>
        <div class="rr-snip">${ok?r.snippet:'█████████████████ ACCESS DENIED — INSUFFICIENT CLEARANCE █████████████████'}</div>
      </div>
      <span class="rr-badge ${bc}">${lv}</span>
    </div>`;
  });
  cont.innerHTML=html;
}

function handleResult(tab,ref,ok){
  if(!ok){document.querySelector('.nav-tab[data-tab="archive"]')?.click();return;}
  if(tab==='archive'){
    document.querySelector('.nav-tab[data-tab="archive"]')?.click();
    setTimeout(()=>{
      const card=document.querySelector(`.doc-card[data-ref="${ref}"]`);
      if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.click();}
    },250);
  } else if(tab==='bunker'){
    document.querySelector('.nav-tab[data-tab="bunker"]')?.click();
  }
}

function doSearch(){
  const q=(document.getElementById('sfInput')?.value||'').trim().toLowerCase();
  const cat=document.getElementById('sfCat')?.value||'ALL';
  const lev=document.getElementById('sfLevel')?.value||'ALL';
  if(!q&&cat==='ALL'&&lev==='ALL'){renderResults(null);return;}
  const res=SEARCH_INDEX.filter(r=>{
    const mq=!q||r.title.toLowerCase().includes(q)||r.snippet.toLowerCase().includes(q)||r.ref.toLowerCase().includes(q)||r.cat.toLowerCase().includes(q);
    const mc=cat==='ALL'||r.cat===cat;
    const ml=lev==='ALL'||r.level===lev;
    return mq&&mc&&ml;
  });
  renderResults(res);
}

function initSearch(){
  document.getElementById('sfBtn')?.addEventListener('click',doSearch);
  document.getElementById('sfInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});
  document.getElementById('sfCat')?.addEventListener('change',doSearch);
  document.getElementById('sfLevel')?.addEventListener('change',doSearch);
  document.querySelectorAll('.idle-cell').forEach(c=>{
    c.addEventListener('click',()=>{
      const inp=document.getElementById('sfInput');
      if(inp)inp.value=c.dataset.query||'';
      doSearch();
    });
  });
}

// ================================================================
// BUNKER MAP
// ================================================================
const ROOMS = {
  dormitory:{name:'Dormitory',ref:'ZONE D-01',desc:'Metal bed. Reinforced concrete walls. Forced ventilation. Fluorescent lighting.',anomaly:'47 vertical marks on north wall. Inconsistent with current subject\'s time of stay.',classified:'Hidden camera DN-CAM-04. 92% field of view. Continuous recording.',deepData:'Camera feed encrypted via protocol CIPHER-04. Feed accessible only from Control Room terminal. Recording stored offsite since Day 1.',tags:['occupied','monitored','anomaly'],level:'C'},
  main_room:{name:'Main Room',ref:'ZONE P-01',desc:'Central table. Four chairs. Shortwave radio. Monitoring terminal. Access to all sectors.',anomaly:'Security cameras oriented toward centre, not toward entrances. Non-standard but not corrected per protocol.',classified:'Primary meeting point. Harlan Protocol active. All conversations recorded.',deepData:'Microphone array DN-MIC-01 through 06 embedded in table surface. Acoustic profile of subject voice established Day 1. Harlan receives real-time transcription on wristband device.',tags:['central','protocol-active','cameras'],level:'C'},
  kitchen:{name:'Kitchen',ref:'ZONE C-01',desc:'90-day supplies. Coffee maker. Sealed refrigerator. Inventory updated daily.',anomaly:'Supplies modified to match subject\'s nightly statements. Mechanism unknown to subject.',classified:'Primary conditioning vector. See Rewriting Protocol — Appendix C.',deepData:'Access panel behind refrigerator connects to secondary storage corridor not shown on subject-facing plans. Coordinator resupply route. Last used: [CLASSIFIED].',tags:['conditioning','monitored'],level:'C'},
  storage_a:{name:'Storage A',ref:'ZONE AL-01',desc:'Exterior dimensions: 8×6m. Interior: 5.2×4.1m. Unexplained spatial discrepancy.',anomaly:'Unfinished note DN-OBJ-002. Shadow of long-adhered object on north wall. Object previously removed.',classified:'[REDACTED — LEVEL A REQUIRED]',deepData:'False wall on north face conceals auxiliary chamber 1.8×3m. Contents: [CLASSIFIED LEVEL A]. False wall mechanism: pressure plate disguised as floor drain. Activation: [CLASSIFIED].',tags:['spatial-discrepancy','classified-object','anomaly'],level:'B'},
  machine_room:{name:'Machine Room',ref:'ZONE M-01',desc:'Main generator. Ventilation system. Electrical distribution panel. Restricted access.',anomaly:'Generator failures at non-random intervals. Pattern detected Days 4–6. Official cause: undetermined.',classified:'Failures are scheduled per protocol calendar. See Darkness Protocol — Appendix F.',deepData:'Scheduled failure timestamps: Day 4 at [CLASSIFIED], Day 5 at [CLASSIFIED], Day 6 at [CLASSIFIED]. Purpose: disorient subject temporally. Secondary effect: camera blind spots during transition window.',tags:['critical','protocol-active','scheduled-failures'],level:'B'},
  bathroom:{name:'Bathroom',ref:'ZONE B-01',desc:'Single mirror. Shower. Ventilation. Only room without direct camera per privacy protocol.',anomaly:'Day 5: initials in condensation on mirror. Match flashlight SEC-7 and note DN-OBJ-002. Not attributable to current subject.',classified:'Steam sensor active. Activity logged without camera. Forensic analysis pending.',deepData:'Initials were written from OUTSIDE the mirror. Mirror is one-way glass. Observation post behind mirror (0.4m deep). Accessed via corridor not in subject-facing plans. Occupancy: [CLASSIFIED].',tags:['no-camera','day-5-anomaly','initials'],level:'B'},
  north_corridor:{name:'North Corridor',ref:'ZONE PN-01',desc:'Main corridor. Length: [variable per subject declaration]. Fluorescents. 3 cameras.',anomaly:'Perceived length changes per subject\'s nightly questionnaire responses.',classified:'See Rewriting Protocol — Section 2. Progressive spatial confusion expected.',deepData:'Physical corridor length is fixed at 14.2m. Perceived length manipulation achieved via programmable lighting intensity gradient and camera perspective adjustment. Effect documented in 6 of 7 previous protocols.',tags:['rewriting-active','variable','cameras'],level:'A'},
  control:{name:'Control Room',ref:'ZONE CT-01',desc:'Operations centre. Harlan has permanent access. Location unknown to subject.',anomaly:'Does not appear in plans shared with subject.',classified:'[CLASSIFIED — LEVEL A] Operational protocols, external communications, intervention schedule.',deepData:'Terminal designation: CT-MAIN. This database accessible from CT-MAIN terminal. Subject-facing plans show this space as "storage B" — a fiction. All 14 camera feeds visible simultaneously. Direct line to external coordinator established at all times.',tags:['restricted','undisclosed','harlan'],level:'A'},
};

function initMap(){
  document.querySelectorAll('.map-room').forEach(r=>{
    r.addEventListener('click',()=>{
      document.querySelectorAll('.map-room').forEach(x=>x.classList.remove('sel'));
      r.classList.add('sel');
      renderRoom(r.dataset.room);
    });
  });

  // Infrastructure code input
  const inp=document.getElementById('infraCodeInput');
  const btn=document.getElementById('infraCodeBtn');
  const st=document.getElementById('infraCodeStatus');
  function tryInfraCode(){
    const val=(inp?.value||'').trim().toUpperCase();
    if(val==='BUNKER-DEEP'){
      applyCode('BUNKER-DEEP');
      if(st){st.textContent='DEEP ACCESS GRANTED — INFRASTRUCTURE DATA UNLOCKED';st.className='infra-status ok';}
      if(inp)inp.value='';
      // Re-render currently selected room if any
      const sel=document.querySelector('.map-room.sel');
      if(sel)renderRoom(sel.dataset.room);
    } else {
      if(inp)inp.value='';
      if(st){st.textContent='INVALID CODE';st.className='infra-status err';}
      setTimeout(()=>{if(st){st.textContent='ENTER INFRASTRUCTURE CODE';st.className='infra-status';}},2500);
    }
  }
  btn?.addEventListener('click',tryInfraCode);
  inp?.addEventListener('keydown',e=>{if(e.key==='Enter')tryInfraCode();});
}

function renderRoom(id){
  const d=ROOMS[id];if(!d)return;
  const panel=document.getElementById('ipBody');
  const ul=_effLevel?levelRank(_effLevel):0;
  const rl=levelRank(d.level);
  const ok=ul>=rl||d.level==='C';
  const tags=d.tags.map(t=>{
    const cls=t.includes('anomaly')||t.includes('discrepancy')||t.includes('day-5')||t.includes('initials')?'anom':t.includes('restricted')||t.includes('classified')?'crit':'';
    return `<span class="ip-tag ${cls}">${t.toUpperCase()}</span>`;
  }).join('');
  const deepHtml=_infraDeep
    ?`<div class="ip-field"><div class="ip-field-lbl">Deep Infrastructure Data</div><div class="ip-field-val" style="color:var(--amber)">${d.deepData}</div></div>`
    :`<div class="ip-field"><div class="ip-field-lbl">Deep Infrastructure Data</div><div class="ip-field-val" style="color:var(--text-muted)">[BUNKER-DEEP CODE REQUIRED — Enter in infrastructure access field]</div></div>`;
  panel.innerHTML=`
    <div class="ip-room-title">${d.name}</div>
    <div class="ip-field"><div class="ip-field-lbl">Reference</div><div class="ip-field-val">${d.ref}</div></div>
    <div class="ip-field"><div class="ip-field-lbl">Description</div><div class="ip-field-val">${d.desc}</div></div>
    <div class="ip-field"><div class="ip-field-lbl">Registered anomaly</div><div class="ip-field-val anom">${d.anomaly}</div></div>
    <div class="ip-field"><div class="ip-field-lbl">Classified information</div><div class="ip-field-val crit">${ok?d.classified:'[LEVEL '+d.level+' REQUIRED]'}</div></div>
    ${deepHtml}
    <div class="ip-field"><div class="ip-field-lbl">Status</div><div class="ip-tags">${tags}</div></div>`;
  panel.classList.remove('ip-empty');
}

// ================================================================
// ARCHIVE GATE — stays open after unlock so more codes can be entered
// ================================================================
function initGate(){
  const gi=document.getElementById('gateInput');
  const gs=document.getElementById('gateStatus');
  const gb=document.getElementById('gateBtn');

  function tryCode(){
    const val=(gi?.value||'').trim().toUpperCase();
    const ok=applyCode(val);
    if(gi)gi.value='';
    if(ok){
      const a=getAccess();
      // Show archive content (or upgrade level display)
      showArchiveContent();
      if(gs){gs.textContent='CODE ACCEPTED — '+(a?a.label:'ACCESS GRANTED');gs.className='gate-status ok';}
      // Check video unlock
      if(_videoUnlocked)revealVideoDoc();
    } else if(val==='BUNKER-DEEP'){
      // Infra-only code — still show message
      if(gs){gs.textContent='INFRASTRUCTURE CODE ACCEPTED — USE IN INFRASTRUCTURE TAB';gs.className='gate-status ok';}
    } else {
      if(gs){gs.textContent='INVALID CODE — ACCESS DENIED';gs.className='gate-status err';}
      setTimeout(()=>{if(gs){gs.textContent='ENTER AUTHORISATION CODE';gs.className='gate-status';}},2500);
    }
  }

  gb?.addEventListener('click',tryCode);
  gi?.addEventListener('keydown',e=>{if(e.key==='Enter')tryCode();});
}

function showArchiveContent(){
  const a=getAccess();
  if(!a)return;
  // Keep gate visible as compact bar for additional codes
  const gate=document.getElementById('archiveGate');
  const content=document.getElementById('archiveContent');
  if(gate)gate.classList.add('gate-compact');
  if(content)content.classList.add('unlocked');
  const lbl=document.getElementById('aabLabel');
  if(lbl){lbl.textContent=a.label;lbl.className='aab-level lv-'+a.level.toLowerCase();}
  renderDocs(a.level);
  // Show video doc card if any valid code has been entered
  if(_videoUnlocked){
    const vc=document.getElementById('videoDocCard');
    if(vc)vc.style.display='flex';
  }
}

function revealVideoDoc(){
  const card=document.getElementById('videoDocCard');
  if(card)card.classList.remove('locked');
  const card2=document.getElementById('videoDocCard');
  if(card2)card2.style.display='flex';
}

// ================================================================
// DOCUMENTS
// ================================================================
const DOCS = [
  {ref:'DN-DOC-001',level:'C',cat:'TESTIMONIES',title:'Initial Subject Declaration',desc:'Arrival interview transcript. Subject memory of the collapse and rescue. Three inconsistencies documented.',date:'2026-03-[CLASSIFIED]',pages:4,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — SECTOR 03',title:'INITIAL SUBJECT DECLARATION',subtitle:'Arrival interview transcript — Confidential',classif:'RESERVED',ref:'DN-DOC-001 // LEVEL C',date:'[DATE CLASSIFIED]',
      sections:[
        {title:'1. SUBJECT IDENTIFICATION',body:`Subject identified as <span class="redact">████████████</span>. Estimated age: <span class="redact">██</span>. No documentation on arrival. Partial amnesia declared for pre-collapse events. Physical condition: stable.`},
        {title:'2. DECLARATION — THE COLLAPSE',body:`"I don't remember how I got here. I remember the noise, then nothing. Harlan found me. He says he has been searching the outside for days looking for survivors."<br><br>Declaration consistency assessment: <span class="redact">████████████████████████</span>. Inconsistencies detected: 3. See Appendix A.`},
        {title:'3. EVALUATOR NOTES',body:`Subject shows temporal confusion consistent with intake protocol. Has not asked about the outside in the first <span class="redact">██</span> minutes. Trust-stimulus response: POSITIVE. Harlan Protocol activated with expected result.`},
      ],sig:{l:'EVALUATOR: HARLAN [PROTOCOL ACTIVE]',r:'CLASSIFICATION: RESERVED // LEVEL C'}}},
  {ref:'DN-DOC-002',level:'C',cat:'INFRASTRUCTURE',title:'Operative Manual — Sector 03',desc:'General facility description, usage norms and emergency protocol.',date:'1994-11-03',pages:12,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — FACILITIES DIRECTORATE',title:'OPERATIVE MANUAL — SECTOR 03',subtitle:'Internal use — Revision 4.2',classif:'RESERVED',ref:'DN-DOC-002 // LEVEL C',date:'1994-11-03',
      sections:[
        {title:'1. FACILITY DESCRIPTION',body:`Sector 03 is a Class B underground facility designed to house up to <span class="redact">██</span> persons for a maximum period of <span class="redact">███</span> days. Equipped with autonomous generator, filtered ventilation, basic supplies, and shortwave communication.`},
        {title:'2. EMERGENCY PROTOCOL',body:`In the event of main generator failure, backup system activates in <span class="redact">██</span> seconds. Security cameras have independent battery for <span class="redact">██</span> hours. Evacuation protocol: Appendix <span class="redact">█</span>.`},
        {title:'3. USE RESTRICTIONS',body:`Access to Storage A restricted to Level B or higher. Machine Room requires supervision. Control Room exclusive to duty coordinator.`},
      ],sig:{l:'FACILITIES DIRECTORATE — 1994',r:'SECTOR 03 // OPERATIVE MANUAL'}}},
  {ref:'DN-DOC-003',level:'B',cat:'INCIDENTS',title:'Incident 1987 — Executive Summary',desc:'Summary of the 1987 resilience protocol. 12 subjects. 3 survivors.',date:'1987-09-14',pages:8,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — RESEARCH DEPARTMENT',title:'SECTOR 03 INCIDENT — 1987',subtitle:'Executive Summary — Restricted Use',classif:'RESTRICTED',ref:'DN-DOC-003 // LEVEL B',date:'1987-09-14',
      sections:[
        {title:'1. PROTOCOL DESCRIPTION',body:`Extreme resilience test protocol. 12 volunteer subjects. Planned confinement: <span class="redact">██</span> days. Stated objective: evaluate adaptation under prolonged isolation. Actual objective: <span class="redact">████████████████████████████████████</span>.`},
        {title:'2. OUTCOME',body:`At protocol end, 9 of 12 subjects presented <span class="redact">█████████████████████</span>. Three survivors evacuated. Condition at evacuation: <span class="redact">████████████████</span>. Official cause: severe psychological stress. Actual cause: <span class="redact">████████████████████████████</span>.`},
        {title:'3. MEASURES ADOPTED',body:`Full report classified — Level A access only. Three survivors signed non-disclosure agreement DN-DOC-007. None has made public statement since <span class="redact">████████</span>.`},
      ],sig:{l:'LEAD INVESTIGATOR: <span class="redact">████████████</span>',r:'CLASSIFICATION: RESTRICTED // LEVEL B'}}},
  {ref:'DN-DOC-004',level:'B',cat:'OBJECTS',title:'Object File — Flashlight SEC-7',desc:'Unidentified initials engraved on base. Linked to note DN-OBJ-002 and mirror inscription Day 5.',date:'[DATE UNKNOWN]',pages:2,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — SECTOR 03 INVENTORY',title:'OBJECT FILE — FLASHLIGHT SEC-7',subtitle:'Unconfirmed owner',classif:'RESTRICTED',ref:'DN-DOC-004 // LEVEL B',date:'[DATE UNKNOWN]',
      sections:[
        {title:'1. DESCRIPTION',body:`Standard issue flashlight. Condition: functional. Significant wear consistent with prolonged use. Initials hand-engraved on base: <span class="redact">███</span>. Engraving tool: unidentified sharp object.`},
        {title:'2. PROVENANCE',body:`Not in current subject intake inventory. Not in 1987 protocol inventory. Possible provenance: <span class="redact">████████████████████████</span>. Investigation: ongoing.`},
        {title:'3. CONNECTIONS',body:`Initials match signature on note DN-OBJ-002. Also match initials in bathroom mirror condensation (Day 5). Working hypothesis: <span class="redact">████████████████████████████████████████</span>.`},
      ],sig:{l:'INVENTORY: <span class="redact">██████</span>',r:'OBJECT — OWNER UNCONFIRMED'}}},
  {ref:'DN-DOC-007',level:'B',cat:'CONTRACTS',title:'Non-Disclosure Agreement — 1987 Survivors',desc:'Agreement signed by all three survivors. One signatory currently UNLOCATED.',date:'1987-10-02',pages:6,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — LEGAL COUNSEL',title:'NON-DISCLOSURE AGREEMENT',subtitle:'Sector 03 Incident — 1987',classif:'RESTRICTED',ref:'DN-DOC-007 // LEVEL B',date:'1987-10-02',
      sections:[
        {title:'1. PARTIES',body:`The Ministry of Interior Management and signatories identified as <span class="redact">████████████</span>, <span class="redact">████████████</span> and <span class="redact">████████████</span>.`},
        {title:'2. OBJECT',body:`Signatories agree not to disclose: (a) nature of the Resilience Protocol; (b) confinement conditions in Sector 03; (c) fate of other participants; (d) any anomaly observed during confinement.`},
        {title:'3. PENALTIES',body:`Breach will result in: (a) immediate legal proceedings; (b) <span class="redact">████████████████████████████████████████████████████████████████████</span>.`},
        {title:'4. CURRENT STATUS',body:`Active. Last verification contact: <span class="redact">████████</span>. One signatory: <span class="redact">STATUS UNKNOWN SINCE ████████</span>.`},
      ],sig:{l:'LEGAL COUNSEL — 1987',r:'AGREEMENT ACTIVE // LEVEL B'}}},
  {ref:'DN-DOC-005',level:'A',cat:'PROTOCOLS',title:'Harlan Protocol — Complete Operative Manual',desc:'Full instruction manual. Nightly questions, catchphrase, Day 4 change management. Top Secret.',date:'[CLASSIFIED]',pages:23,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — INTERNAL PROTOCOL',title:'HARLAN PROTOCOL — COMPLETE OPERATIVE MANUAL',subtitle:'Authorised coordinators only — Destroy after reading',classif:'TOP SECRET',ref:'DN-DOC-005 // LEVEL A',date:'[CLASSIFIED]',
      sections:[
        {title:'1. PROTOCOL OBJECTIVE',body:`Harlan is not a survivor. He is the active experiment coordinator. His function: maintain the subject in a state of controlled trust while the Memory Rewriting Protocol executes. The subject must not suspect at any point.`},
        {title:'2. NIGHTLY QUESTIONS',body:`Each night, Harlan asks a casual question about a bunker detail. Objective: implant an alternative memory. The following day, the bunker environment reflects the subject's response. If asked, Harlan responds: "I don't remember it well either."`},
        {title:'3. ASSIGNED CATCHPHRASE',body:`Harlan uses "just in case" at the end of sentences — turning it into an emotional security anchor. On Day 4, catchphrase ceases. The subject perceives the change before being able to consciously identify it.`},
        {title:'4. CHANGE MANAGEMENT — DAY 4',body:`On Day 4, Harlan substitution or deep behavioural modification per sub-protocol <span class="redact">████████████████</span>. Substitute has been trained to maintain apparent continuity. Inconsistency management: Appendix H.`},
      ],sig:{l:'PROTOCOL DIRECTORATE — CLASSIFIED',r:'LEVEL A — DESTROY AFTER READING'}}},
  {ref:'DN-DOC-006',level:'A',cat:'TESTIMONIES',title:'Testimony — 1987 Survivor — Subject 9',desc:'Only uncensored transcript. Subject 9 location currently unknown.',date:'1987-09-30',pages:11,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — RESERVED ARCHIVE',title:'TESTIMONY — SUBJECT 9 — 1987',subtitle:'Uncensored transcript — Top Secret',classif:'TOP SECRET',ref:'DN-DOC-006 // LEVEL A',date:'1987-09-30',
      sections:[
        {title:'1. IDENTIFICATION',body:`Survivor identified internally as Subject 9. Real name: <span class="redact">████████████████</span>. Age: <span class="redact">██</span>. Condition at declaration: coherent but showing severe cognitive dissonance.`},
        {title:'2. TESTIMONY EXTRACT',body:`"The bunker is not what it appears to be. The walls change. I know it. I used to see them doing it at night. The coordinator — the one who acted like a friend — had a notebook. He wrote down what we said at dinner. The next day the world was different. Nobody else noticed. Or they pretended not to."<br><br>"The initials on the flashlight belong to <span class="redact">████████</span>. He was the first. Before all of us. And he left the flashlight on purpose."`},
        {title:'3. PSYCHIATRIC EVALUATION',body:`Evaluation classified testimony as product of severe dissociative state. Recommendation: do not give public credibility. NDA signed. Subject 9 did not speak of Sector 03 again until <span class="redact">████████████████████████████</span>.`},
      ],sig:{l:'EVALUATOR: <span class="redact">████████████</span>',r:'TOP SECRET // LEVEL A'}}},
  {ref:'DN-DOC-008',level:'A',cat:'SURVEILLANCE',title:'Surveillance Plan — Post-1987 Survivors',desc:'Active monitoring operative. Subject C location unknown. Risk level classified.',date:'[ACTIVE]',pages:9,
    content:{ministry:'MINISTRY OF INTERIOR MANAGEMENT — SPECIAL OPERATIONS UNIT',title:'SURVEILLANCE PLAN — 1987 SURVIVORS',subtitle:'Active operative — Continuous update',classif:'TOP SECRET',ref:'DN-DOC-008 // LEVEL A',date:'[ACTIVE]',
      sections:[
        {title:'1. SUBJECT A — STATUS',body:`Located. Current residence: <span class="redact">████████████████████</span>. Complying with NDA. Risk: LOW.`},
        {title:'2. SUBJECT B — STATUS',body:`Located. Has attempted journalist contact <span class="redact">█</span> times. Contacts intercepted. No disclosure. Risk: MEDIUM. Active measures: <span class="redact">████████████████████████████</span>.`},
        {title:'3. SUBJECT C (SUBJECT 9) — STATUS',body:`LOCATION: UNKNOWN since <span class="redact">████████</span>. Unknown if still alive. Unknown if information disclosed. Risk: <span class="redact">███████████</span>. Measures: <span class="redact">████████████████████████████████████████████████████</span>.`},
      ],sig:{l:'SPECIAL OPERATIONS UNIT',r:'ACTIVE OPERATIVE — TOP SECRET // LEVEL A'}}},
];

let _currentCat='ALL';

function renderDocs(level){
  const cont=document.getElementById('docGrid');
  if(!cont)return;
  const ul=levelRank(level);
  const filtered=DOCS.filter(d=>_currentCat==='ALL'||d.cat===_currentCat);
  cont.innerHTML=filtered.map(doc=>{
    const rl=levelRank(doc.level);
    const ok=ul>=rl;
    return `<div class="doc-card lv-${doc.level.toLowerCase()} ${!ok?'locked':''}" data-ref="${doc.ref}"
       onclick="${ok?`openDoc('${doc.ref}')`:''}" style="cursor:${ok?'pointer':'not-allowed'}">
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

function initDocCats(){
  document.querySelectorAll('.doc-cat').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.doc-cat').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      _currentCat=btn.dataset.cat;
      const a=getAccess();
      renderDocs(a?a.level:'C');
    });
  });
}

function openDoc(ref){
  const doc=DOCS.find(d=>d.ref===ref);
  if(!doc)return;
  const viewer=document.getElementById('docViewer');
  const hd=document.getElementById('dvHdInfo');
  const body=document.getElementById('dvBody');
  if(!viewer||!body)return;
  if(hd)hd.textContent=`${doc.ref} // ${doc.cat} // LEVEL ${doc.level}`;
  const c=doc.content;
  const secs=c.sections.map(s=>`<div class="doc-sec"><div class="doc-sec-title">${s.title}</div><p>${s.body}</p></div>`).join('');
  body.innerHTML=`
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
    <div class="doc-sig"><span>${c.sig.l}</span><span>${c.sig.r}</span></div>
    <div style="margin-top:28px;text-align:right;">
      <button onclick="printDoc('${ref}')" style="background:none;border:1px solid var(--border-hi);color:var(--text-dim);font-family:var(--font-main);font-size:0.65rem;letter-spacing:0.14em;padding:6px 18px;cursor:pointer;text-transform:uppercase;">EXPORT AS PDF</button>
    </div>`;
  viewer.classList.add('open');
}

function closeDoc(){document.getElementById('docViewer')?.classList.remove('open');}

// ================================================================
// PDF EXPORT
// Opens a print-ready version of the document in a new window
// ================================================================
function printDoc(ref){
  const doc=DOCS.find(d=>d.ref===ref);
  if(!doc)return;
  const c=doc.content;
  const secs=c.sections.map(s=>`<div class="doc-sec"><div class="doc-sec-title">${s.title}</div><p>${s.body}</p></div>`).join('');
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>${c.ref}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Courier New',Courier,monospace;background:#f8f6f0;color:#1a1a0f;padding:60px;font-size:11pt;line-height:1.8;}
    .lh{text-align:center;border-bottom:2px solid #1a1a0f;padding-bottom:16px;margin-bottom:22px;}
    .lh-ministry{font-size:7pt;letter-spacing:0.25em;color:#444;text-transform:uppercase;margin-bottom:8px;}
    .lh-title{font-size:18pt;font-weight:700;letter-spacing:0.08em;margin-bottom:6px;}
    .lh-sub{font-size:8pt;letter-spacing:0.14em;color:#555;}
    .meta-row{display:flex;justify-content:space-between;border:1px solid #1a1a0f;padding:6px 12px;margin-bottom:20px;font-size:8pt;letter-spacing:0.12em;text-transform:uppercase;background:#ede;color:#1a1a0f;}
    .classif-tag{font-weight:700;letter-spacing:0.2em;}
    .sec-title{font-size:8pt;letter-spacing:0.22em;color:#1a1a0f;text-transform:uppercase;border-bottom:1px solid #aaa;padding-bottom:4px;margin:18px 0 10px;font-weight:700;}
    p{margin-bottom:10px;color:#222;}
    .redact{background:#1a1a0f;color:#1a1a0f;padding:0 2px;}
    .sig-row{margin-top:30px;border-top:1px solid #1a1a0f;padding-top:14px;font-size:8pt;letter-spacing:0.1em;text-transform:uppercase;display:flex;justify-content:space-between;color:#444;}
    .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:72pt;font-weight:700;color:rgba(0,0,0,0.04);letter-spacing:0.2em;pointer-events:none;white-space:nowrap;}
    @media print{body{padding:40px;} .no-print{display:none;}}
  </style>
  </head><body>
  <div class="watermark">${c.classif}</div>
  <div class="lh">
    <div class="lh-ministry">${c.ministry}</div>
    <div class="lh-title">${c.title}</div>
    <div class="lh-sub">${c.subtitle}</div>
  </div>
  <div class="meta-row">
    <span>${c.ref} // ${c.date}</span>
    <span class="classif-tag">${c.classif}</span>
  </div>
  ${c.sections.map(s=>`<div class="sec-title">${s.title}</div><p>${s.body}</p>`).join('')}
  <div class="sig-row"><span>${c.sig.l}</span><span>${c.sig.r}</span></div>
  <p style="margin-top:24px;font-size:7pt;color:#888;text-align:center;letter-spacing:0.14em;">CLAUSTRUM // SECTOR 03 RECORDS SYSTEM // DOCUMENT REF: ${doc.ref}</p>
  <div class="no-print" style="margin-top:24px;text-align:center;">
    <button onclick="window.print()" style="font-family:'Courier New';font-size:10pt;padding:8px 24px;cursor:pointer;letter-spacing:0.12em;">PRINT / SAVE AS PDF</button>
  </div>
  </body></html>`);
  win.document.close();
  setTimeout(()=>win.print(),400);
}

// ================================================================
// VIDEO DOC (unlocked by any Level C+ code = podcast code)
// ================================================================
function openVideoDoc(){
  const viewer=document.getElementById('docViewer');
  const hd=document.getElementById('dvHdInfo');
  const body=document.getElementById('dvBody');
  if(!viewer||!body)return;
  if(hd)hd.textContent='DN-VID-001 // MEDIA // LEVEL C — PODCAST DOCUMENT';
  body.innerHTML=`
    <div class="doc-lh">
      <div class="doc-lh-ministry">MINISTRY OF INTERIOR MANAGEMENT — SECTOR 03 — AUDIO-VISUAL ARCHIVE</div>
      <div class="doc-lh-title">SECTOR 03 — CLASSIFIED AUDIO-VISUAL DOCUMENT</div>
      <div class="doc-lh-sub">Incident reconstruction — Internal distribution only</div>
    </div>
    <div class="doc-meta-row">
      <span>DN-VID-001 // LEVEL C // DISTRIBUTION: PODCAST CHANNEL</span>
      <span class="doc-classif-tag">RESERVED</span>
    </div>
    <div class="doc-sec">
      <div class="doc-sec-title">1. DOCUMENT IDENTIFICATION</div>
      <p>Reference: DN-VID-001. Classification: RESERVED. Medium: audio-visual. Runtime: <span class="redact">██:██</span>. Distribution authorised through podcast channel only. Access code: SECTOR-03.</p>
    </div>
    <div class="doc-sec">
      <div class="doc-sec-title">2. CONTENT DESCRIPTION</div>
      <p>Reconstructed audio-visual account of events preceding current protocol activation. Material gathered from <span class="redact">████████████████</span> sources. Authenticity: <span class="redact">██%</span> verified. Gaps in record correspond to periods of deliberate information suppression by <span class="redact">████████████████████████</span>.</p>
      <p>Subjects identifiable in material: <span class="redact">█</span>. Locations confirmed: Sector 03 primary corridor, Storage A, external perimeter. Date of events depicted: <span class="redact">████████████████████</span>.</p>
    </div>
    <div class="doc-sec">
      <div class="doc-sec-title">3. DISTRIBUTION NOTICE</div>
      <p>This document has been released through the PODCAST CHANNEL as part of the ongoing public information disclosure programme authorised by <span class="redact">████████████████████████</span>. Recipients are reminded that further distribution constitutes a breach of classified material handling protocols.</p>
    </div>
    <div style="margin:28px 0 10px;border:1px solid var(--border-hi);background:var(--bg);padding:12px 16px;">
      <div style="font-size:0.58rem;letter-spacing:0.2em;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;">VIDEO RECORD — DN-VID-001</div>
      <video controls style="width:100%;max-height:480px;background:#000;display:block;">
        <source src="assets/DOC1.mp4" type="video/mp4">
        VIDEO PLAYBACK NOT SUPPORTED IN THIS BROWSER.
      </video>
      <div style="font-size:0.58rem;letter-spacing:0.12em;color:var(--text-muted);margin-top:8px;text-transform:uppercase;">RUNTIME: CLASSIFIED // FORMAT: MP4 // ENCODING: STANDARD</div>
    </div>
    <div class="doc-sig">
      <span>AUDIO-VISUAL ARCHIVE — SECTOR 03</span>
      <span>CLASSIFICATION: RESERVED // LEVEL C</span>
    </div>`;
  viewer.classList.add('open');
}

// ================================================================
// PARTICLES
// ================================================================
(function(){
  const cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(cv);
  const ctx=cv.getContext('2d');
  let W,H,pts=[];
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;init();}
  function init(){pts=[];const R=W<600?16:24,C=W<600?16:24;for(let i=0;i<R;i++)for(let j=0;j<C;j++)pts.push({bx:(j/C)*W,by:(i/R)*H,s:0.35+Math.random()*0.4,ph:Math.random()*Math.PI*2,off:(i+j)*0.18});}
  let t=0;
  function draw(){ctx.fillStyle='rgba(0,0,0,0.22)';ctx.fillRect(0,0,W,H);t+=0.0025;for(const p of pts){const x=p.bx+Math.sin(t+p.off)*7,y=p.by+Math.cos(t*0.55+p.off)*11,b=Math.sin(t*0.8+p.ph)*0.5+0.5;ctx.beginPath();ctx.arc(x,y,p.s,0,Math.PI*2);ctx.fillStyle=`rgba(40,70,30,${0.03+b*0.09})`;ctx.fill();}requestAnimationFrame(draw);}
  window.addEventListener('resize',resize);resize();draw();
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
