/* ================================================================
   CLAUSTRUM — SISTEMA DE ARCHIVOS SECTOR 03
   SCRIPT v1.0.0
   ================================================================ */

'use strict';

// ================================================================
// ACCESS CODE SYSTEM
// Multiple codes → different clearance levels
// ================================================================
const CODES = {
  // Level C — basic access (podcast, devlog, in-game)
  'SECTOR03':    { level: 'C', label: 'NIVEL C — ACCESO BÁSICO' },
  'BUNKER-7':    { level: 'C', label: 'NIVEL C — ACCESO BÁSICO' },
  'DN-OPEN':     { level: 'C', label: 'NIVEL C — ACCESO BÁSICO' },

  // Level B — extended access (web ARG, physical diary)
  'DN-7749':     { level: 'B', label: 'NIVEL B — ACCESO EXTENDIDO' },
  'NOVADEPTH':   { level: 'B', label: 'NIVEL B — ACCESO EXTENDIDO' },
  'ARCHIVO-B':   { level: 'B', label: 'NIVEL B — ACCESO EXTENDIDO' },

  // Level A — full access (reserved for special distribution)
  'CLEARANCE-A': { level: 'A', label: 'NIVEL A — ACCESO TOTAL' },
  'SECTOR03-A':  { level: 'A', label: 'NIVEL A — ACCESO TOTAL' },
};

const STORAGE_KEY = 'claustrum_access';

function getAccess() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}
function setAccess(level, label) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ level, label }));
}
function hasLevel(required) {
  const access = getAccess();
  if (!access) return false;
  const order = { 'C': 1, 'B': 2, 'A': 3 };
  return (order[access.level] || 0) >= (order[required] || 99);
}

// ================================================================
// CLOCK
// ================================================================
function updateClock() {
  const el = document.getElementById('sysClock');
  if (!el) return;
  const now = new Date();
  const p = n => String(n).padStart(2, '0');
  el.textContent =
    `${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())} ` +
    `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())} UTC`;
}
setInterval(updateClock, 1000);
updateClock();

// ================================================================
// TAB NAVIGATION
// ================================================================
function initTabs() {
  const tabs  = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      const page = document.getElementById('page-' + target);
      if (page) page.classList.add('active');
    });
  });
}

// ================================================================
// SEARCH ENGINE
// ================================================================

// Search index — all content of the site
const SEARCH_INDEX = [
  {
    ref: 'DN-SUJ-001',
    title: 'HARLAN — EXPEDIENTE DE SUJETO',
    snippet: 'Cuarenta y tantos años. Voz pausada. Rol asignado: cuidador del búnker. Nivel de acceso: COMPLETO. Estado: ACTIVO.',
    category: 'SUJETOS',
    level: 'C',
    tab: 'bunker',
    room: 'control',
  },
  {
    ref: 'DN-SUJ-002',
    title: 'SUJETO ANTERIOR — EXPEDIENTE INCOMPLETO',
    snippet: 'Identidad: [REDACTADO]. Entró al Sector 03 el [REDACTADO]. Estado actual: DESAPARECIDO. Ver archivos DN-INT-009.',
    category: 'SUJETOS',
    level: 'B',
    tab: 'archive',
  },
  {
    ref: 'DN-SUJ-003',
    title: 'EL SUJETO — PROTOCOLO DE OBSERVACIÓN',
    snippet: 'Sujeto activo. Amnesia parcial inducida. Supervisión: continua. Diario: en seguimiento. No debe conocer la naturaleza del protocolo.',
    category: 'SUJETOS',
    level: 'C',
    tab: 'bunker',
  },
  {
    ref: 'DN-BNK-001',
    title: 'SECTOR 03 — PLANOS DE INFRAESTRUCTURA',
    snippet: 'Búnker subterráneo. 6 sectores operativos. Sistema de generador redundante. Cámaras de seguridad: 14 activas. Acceso exterior: SELLADO.',
    category: 'INFRAESTRUCTURA',
    level: 'C',
    tab: 'bunker',
  },
  {
    ref: 'DN-BNK-002',
    title: 'ANOMALÍAS REGISTRADAS — SECTOR 03',
    snippet: 'Discrepancias espaciales en Almacén A. Comportamiento irregular Cámara 07. Registros de audio: fragmentos no explicados. Días 3-5.',
    category: 'INFRAESTRUCTURA',
    level: 'B',
    tab: 'archive',
  },
  {
    ref: 'DN-INC-001',
    title: 'INCIDENTE 1987 — INFORME OFICIAL',
    snippet: 'Protocolo de resiliencia extrema. 12 sujetos. 3 supervivientes. Causa oficial: [REDACTADO]. Archivado. Clasificación elevada a RESERVADO.',
    category: 'INCIDENTES',
    level: 'B',
    tab: 'archive',
  },
  {
    ref: 'DN-INC-002',
    title: 'TESTIMONIOS — SUPERVIVIENTES 1987',
    snippet: 'Tres supervivientes identificados. Ninguno autorizó declaración pública. Entrevistas clasificadas. Inconsistencias detectadas en versiones.',
    category: 'INCIDENTES',
    level: 'A',
    tab: 'archive',
  },
  {
    ref: 'DN-OBJ-001',
    title: 'INVENTARIO DE OBJETOS — LINTERNA SEC-7',
    snippet: 'Linterna estándar. Iniciales grabadas en la base: [REDACTADO]. Origen: no confirmado. Conectada con nota sin terminar en Almacén A.',
    category: 'OBJETOS',
    level: 'B',
    tab: 'archive',
  },
  {
    ref: 'DN-OBJ-002',
    title: 'NOTA SIN TERMINAR — ALMACÉN A',
    snippet: 'Fragmento de texto. Autor: desconocido. Mismas iniciales que linterna SEC-7. Contenido: [REDACTADO]. Fecha estimada: anterior al sujeto actual.',
    category: 'OBJETOS',
    level: 'B',
    tab: 'archive',
  },
  {
    ref: 'DN-PRO-001',
    title: 'PROTOCOLO HARLAN — MANUAL DE INSTRUCCIONES',
    snippet: 'Directrices para el rol de Harlan. Preguntas nocturnas: cuestionario adjunto. Objetivo: reescritura de memoria del sujeto. Muletilla asignada: [REDACTADO].',
    category: 'PROTOCOLOS',
    level: 'A',
    tab: 'archive',
  },
];

function renderResults(results) {
  const container = document.getElementById('searchResults');
  const idle      = document.getElementById('searchIdle');
  if (!results) {
    container.classList.remove('visible');
    idle.style.display = 'grid';
    return;
  }
  idle.style.display = 'none';
  container.classList.add('visible');

  if (results.length === 0) {
    container.innerHTML = `
      <div class="results-header">
        <span>BÚSQUEDA — SIN RESULTADOS</span>
        <span>0 REGISTROS ENCONTRADOS</span>
      </div>
      <div class="result-item" style="cursor:default;">
        <div class="ri-body"><div class="ri-snippet">No se han encontrado registros para esta consulta. Compruebe los términos de búsqueda o su nivel de acceso.</div></div>
      </div>`;
    return;
  }

  const access = getAccess();
  const levelOrder = { 'C': 1, 'B': 2, 'A': 3 };
  const userLevel  = access ? (levelOrder[access.level] || 0) : 0;

  let html = `<div class="results-header">
    <span>RESULTADOS DE BÚSQUEDA</span>
    <span>${results.length} REGISTRO${results.length !== 1 ? 'S' : ''} ENCONTRADO${results.length !== 1 ? 'S' : ''}</span>
  </div>`;

  results.forEach((r, i) => {
    const reqLevel = levelOrder[r.level] || 1;
    const accessible = userLevel >= reqLevel;
    const classifClass = r.level === 'A' ? 'locked' : (r.level === 'B' ? '' : '');
    const classifLabel = r.level === 'A' ? 'NIVEL A — CLASIFICADO' : (r.level === 'B' ? 'NIVEL B — RESTRINGIDO' : 'ACCESO ABIERTO');

    html += `<div class="result-item" onclick="handleResultClick('${r.tab}', '${r.ref}', ${accessible})">
      <div class="ri-num">${String(i+1).padStart(2,'0')}</div>
      <div class="ri-body">
        <div class="ri-ref">${r.ref} // ${r.category}</div>
        <div class="ri-title">${accessible ? r.title : r.title.replace(/[A-ZÁÉÍÓÚÑ]{4,}/g, m => '█'.repeat(m.length))}</div>
        <div class="ri-snippet">${accessible ? r.snippet : '████████████████ ACCESO DENEGADO — NIVEL INSUFICIENTE ████████████████'}</div>
      </div>
      <div class="ri-classif ${classifClass}">${classifLabel}</div>
    </div>`;
  });

  container.innerHTML = html;
}

function handleResultClick(tab, ref, accessible) {
  if (!accessible) {
    showGateMessage('ACCESO DENEGADO — SE REQUIERE MAYOR NIVEL DE AUTORIZACIÓN');
    return;
  }
  // Switch to the relevant tab
  const tabBtn = document.querySelector(`.nav-tab[data-tab="${tab}"]`);
  if (tabBtn) tabBtn.click();
}

function showGateMessage(msg) {
  const status = document.getElementById('gateStatus');
  if (status) { status.textContent = msg; status.className = 'gate-status err'; }
}

function initSearch() {
  const input   = document.getElementById('searchInput');
  const btn     = document.getElementById('searchBtn');
  const selCat  = document.getElementById('filterCat');
  const selLev  = document.getElementById('filterLevel');

  function doSearch() {
    const query = (input ? input.value.trim().toLowerCase() : '');
    const cat   = selCat ? selCat.value : 'ALL';
    const lev   = selLev ? selLev.value : 'ALL';

    if (!query && cat === 'ALL' && lev === 'ALL') {
      renderResults(null);
      return;
    }

    let results = SEARCH_INDEX.filter(r => {
      const matchQ = !query ||
        r.title.toLowerCase().includes(query) ||
        r.snippet.toLowerCase().includes(query) ||
        r.ref.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query);
      const matchC = cat === 'ALL' || r.category === cat;
      const matchL = lev === 'ALL' || r.level === lev;
      return matchQ && matchC && matchL;
    });

    renderResults(results);
  }

  if (btn)   btn.addEventListener('click', doSearch);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  if (selCat) selCat.addEventListener('change', doSearch);
  if (selLev) selLev.addEventListener('change', doSearch);

  // Idle quick-search cards
  document.querySelectorAll('.idle-card').forEach(card => {
    card.addEventListener('click', () => {
      const q = card.dataset.query || '';
      if (input) input.value = q;
      doSearch();
    });
  });
}

// ================================================================
// BUNKER MAP
// ================================================================
const ROOMS = {
  dormitorio: {
    name: 'Dormitorio',
    ref: 'SECTOR 03 — ZONA D-01',
    desc: 'Cama metálica. Paredes de hormigón armado. Ventilación forzada. Iluminación fluorescente.',
    anomaly: 'Rayas verticales en la pared norte. 47 marcas contadas. Número inconsistente con tiempo de estancia del sujeto actual.',
    classified: 'Cámara oculta DN-CAM-04. Ángulo de visión: 92%. Grabación continua.',
    tags: ['habitado', 'supervisado', 'anomalía-detectada'],
    level: 'C',
  },
  sala_principal: {
    name: 'Sala Principal',
    ref: 'SECTOR 03 — ZONA P-01',
    desc: 'Mesa central. Cuatro sillas. Radio de onda corta. Terminal de monitoreo. Acceso a todos los sectores.',
    anomaly: 'Cámaras de seguridad orientadas al centro, no a las entradas. Comportamiento no estándar. Registrado pero no corregido por protocolo.',
    classified: 'Punto de encuentro principal. Protocolo Harlan activo en esta sala. Conversaciones grabadas.',
    tags: ['punto-central', 'protocolo-activo', 'cámaras-activas'],
    level: 'C',
  },
  cocina: {
    name: 'Cocina',
    ref: 'SECTOR 03 — ZONA C-01',
    desc: 'Suministros para 90 días. Cafetera. Nevera sellada. Inventario actualizado diariamente.',
    anomaly: 'Suministros modificados según declaraciones nocturnas del sujeto. Mecanismo: desconocido para el sujeto.',
    classified: 'Vector de condicionamiento principal. Ver Protocolo de Reescritura — Apéndice C.',
    tags: ['condicionamiento', 'supervisado'],
    level: 'C',
  },
  almacen: {
    name: 'Almacén A',
    ref: 'SECTOR 03 — ZONA AL-01',
    desc: 'Dimensiones exteriores: 8x6m. Dimensiones interiores: 5.2x4.1m. Discrepancia espacial no explicada.',
    anomaly: 'Nota sin terminar. Ref. DN-OBJ-002. Sombra de objeto adherido durante años en pared norte. Objeto: retirado previamente.',
    classified: '[REDACTADO — NIVEL A REQUERIDO]',
    tags: ['discrepancia-espacial', 'objeto-clasificado', 'anomalía-arquitectónica'],
    level: 'B',
  },
  cuarto_maquinas: {
    name: 'Cuarto de Máquinas',
    ref: 'SECTOR 03 — ZONA M-01',
    desc: 'Generador principal. Sistema de ventilación. Panel de distribución eléctrica. Acceso restringido.',
    anomaly: 'Fallos de generador en intervalos no aleatorios. Patrón detectado en días 4-6. Causa: no determinada oficialmente.',
    classified: 'Fallos programados según calendario de protocolo. Ver Protocolo de Oscuridad — Apéndice F.',
    tags: ['crítico', 'protocolo-activo', 'fallos-programados'],
    level: 'B',
  },
  bano: {
    name: 'Baño',
    ref: 'SECTOR 03 — ZONA B-01',
    desc: 'Espejo único. Ducha. Ventilación. Único espacio sin cámara directa por protocolo de privacidad.',
    anomaly: 'Día 5: iniciales escritas con vapor en espejo. Mismas iniciales que Linterna SEC-7 y nota DN-OBJ-002. No atribuibles al sujeto actual.',
    classified: 'Sensor de vapor activo. Actividad registrada sin cámara. Análisis forense pendiente.',
    tags: ['sin-cámara', 'anomalía-día-5', 'iniciales'],
    level: 'B',
  },
  pasillo_norte: {
    name: 'Pasillo Norte',
    ref: 'SECTOR 03 — ZONA PN-01',
    desc: 'Corredor principal. Longitud: [variable según declaración del sujeto]. Fluorescentes. 3 cámaras.',
    anomaly: 'Longitud percibida cambia según respuesta del sujeto en cuestionario nocturno. Patrón coherente con protocolo de reescritura.',
    classified: 'Ver Protocolo de Reescritura — Sección 2. Resultado esperado: confusión espacial progresiva.',
    tags: ['reescritura-activa', 'variable', 'cámaras-activas'],
    level: 'A',
  },
  control: {
    name: 'Sala de Control',
    ref: 'SECTOR 03 — ZONA CT-01',
    desc: 'Centro de operaciones. Acceso: solo personal autorizado. Harlan tiene acceso permanente.',
    anomaly: 'Ubicación desconocida para el sujeto. No figura en planos compartidos con el sujeto.',
    classified: '[CLASIFICADO — NIVEL A] Contiene: protocolos operativos, comunicaciones externas, calendario de intervenciones.',
    tags: ['acceso-restringido', 'no-revelado', 'harlan'],
    level: 'A',
  },
};

function initBunkerMap() {
  const rooms = document.querySelectorAll('.map-room');
  const detailPanel = document.getElementById('roomDetail');

  rooms.forEach(room => {
    room.addEventListener('click', () => {
      rooms.forEach(r => r.classList.remove('highlighted'));
      room.classList.add('highlighted');
      const id = room.dataset.room;
      renderRoomDetail(id, detailPanel);
    });
  });
}

function renderRoomDetail(id, panel) {
  const data = ROOMS[id];
  const access = getAccess();
  const levelOrder = { C:1, B:2, A:3 };
  const userLevel = access ? (levelOrder[access.level] || 0) : 0;
  const reqLevel  = levelOrder[data.level] || 1;
  const canSeeClassified = userLevel >= reqLevel;

  const tagsHTML = data.tags.map(t =>
    `<span class="rd-tag ${t.includes('anomalía') || t.includes('clasificado') ? 'anomaly' : ''}">${t.toUpperCase()}</span>`
  ).join('');

  panel.innerHTML = `
    <div class="rd-room-name">${data.name}</div>
    <div class="rd-field">
      <div class="rd-field-label">Referencia</div>
      <div class="rd-field-value">${data.ref}</div>
    </div>
    <div class="rd-field">
      <div class="rd-field-label">Descripción</div>
      <div class="rd-field-value">${data.desc}</div>
    </div>
    <div class="rd-field">
      <div class="rd-field-label">Anomalía registrada</div>
      <div class="rd-field-value anomaly">${data.anomaly}</div>
    </div>
    <div class="rd-field">
      <div class="rd-field-label">Información clasificada</div>
      <div class="rd-field-value classified">${canSeeClassified ? data.classified : '[NIVEL ' + data.level + ' REQUERIDO — CÓDIGO DE ACCESO NECESARIO]'}</div>
    </div>
    <div class="rd-field">
      <div class="rd-field-label">Estado</div>
      <div class="rd-tags">${tagsHTML}</div>
    </div>
  `;
  panel.classList.remove('empty');
}

// ================================================================
// ARCHIVE GATE
// ================================================================

function initArchiveGate() {
  const input  = document.getElementById('gateInput');
  const btn    = document.getElementById('gateBtn');
  const status = document.getElementById('gateStatus');

  // Restore session
  const existing = getAccess();
  if (existing) {
    unlockArchive(existing.level, existing.label);
  }

  function tryCode() {
    const val = (input ? input.value.trim().toUpperCase() : '');
    const match = CODES[val];
    if (match) {
      setAccess(match.level, match.label);
      if (status) { status.textContent = 'AUTENTICACIÓN CORRECTA — ' + match.label; status.className = 'gate-status ok'; }
      input.value = '';
      setTimeout(() => unlockArchive(match.level, match.label), 700);
    } else {
      if (input) input.value = '';
      if (status) { status.textContent = 'CÓDIGO INVÁLIDO — ACCESO DENEGADO'; status.className = 'gate-status err'; }
      setTimeout(() => {
        if (status) { status.textContent = 'INTRODUCE TU CÓDIGO DE AUTORIZACIÓN'; status.className = 'gate-status'; }
      }, 3000);
    }
  }

  if (btn)   btn.addEventListener('click', tryCode);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') tryCode(); });
}

function unlockArchive(level, label) {
  const gate    = document.getElementById('archiveGate');
  const content = document.getElementById('archiveContent');
  const accessBar = document.getElementById('archiveAccessLabel');

  if (gate)    gate.style.display = 'none';
  if (content) content.classList.add('unlocked');
  if (accessBar) accessBar.textContent = label || 'SESIÓN ACTIVA';

  renderDocs(level);
}

// ================================================================
// DOCUMENTS
// ================================================================
const DOCS = [
  // LEVEL C — basic
  {
    ref: 'DN-DOC-001', level: 'C', category: 'TESTIMONIOS',
    title: 'Declaración Inicial — Sujeto Actual',
    desc: 'Transcripción de la declaración de llegada al Sector 03. Memoria del sujeto sobre el colapso y el rescate.',
    date: '2026-03-??', pages: 4,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — SECTOR 03',
      title: 'DECLARACIÓN INICIAL DE SUJETO',
      subtitle: 'Transcripción de entrevista de llegada — Confidencial',
      classification: 'RESERVADO',
      ref: 'DN-DOC-001 // NIVEL C',
      date: '[FECHA CLASIFICADA]',
      sections: [
        {
          title: '1. IDENTIFICACIÓN DEL SUJETO',
          text: `Sujeto identificado como <span class="redact">████████████</span>. Edad estimada: <span class="redact">██</span> años. Sin documentación en su poder al momento de llegada. Amnesia parcial declarada sobre eventos previos al colapso. Estado físico: estable.`,
        },
        {
          title: '2. DECLARACIÓN SOBRE EL COLAPSO',
          text: `"No recuerdo bien cómo llegué aquí. Recuerdo el ruido, luego nada. Harlan me encontró. Dice que lleva días en el exterior buscando supervivientes."<br><br>Coherencia de la declaración: <span class="redact">████████████████████████</span>. Inconsistencias detectadas: 3. Ver apéndice A.`,
        },
        {
          title: '3. OBSERVACIONES DEL EVALUADOR',
          text: `El sujeto muestra confusión temporal coherente con el protocolo de ingreso. No ha preguntado por el exterior en los primeros <span class="redact">██</span> minutos. Respuesta a estímulos de confianza: POSITIVA. Protocolo Harlan activado con resultado esperado.`,
        },
      ],
      signature: { left: 'EVALUADOR: HARLAN [PROTOCOLO ACTIVO]', right: 'CLASIFICACIÓN: RESERVADO // NIVEL C' },
    },
  },
  {
    ref: 'DN-DOC-002', level: 'C', category: 'INFRAESTRUCTURA',
    title: 'Manual Operativo — Sector 03',
    desc: 'Descripción general de instalaciones, normas de uso y protocolo de emergencia para el Sector 03.',
    date: '1994-11-03', pages: 12,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — DIRECCIÓN DE INSTALACIONES',
      title: 'MANUAL OPERATIVO — SECTOR 03',
      subtitle: 'Uso interno — Revisión 4.2',
      classification: 'RESERVADO',
      ref: 'DN-DOC-002 // NIVEL C',
      date: '1994-11-03',
      sections: [
        {
          title: '1. DESCRIPCIÓN DE INSTALACIONES',
          text: `El Sector 03 es una instalación subterránea de clase B diseñada para albergar hasta <span class="redact">██</span> personas durante un periodo máximo de <span class="redact">███</span> días. Cuenta con generador autónomo, sistema de ventilación filtrada, suministros de primera necesidad y equipamiento de comunicaciones de onda corta.`,
        },
        {
          title: '2. PROTOCOLO DE EMERGENCIA',
          text: `En caso de fallo del generador principal, el sistema de respaldo se activará en <span class="redact">██</span> segundos. Las cámaras de seguridad tienen batería independiente de <span class="redact">██</span> horas. El protocolo de evacuación está descrito en el Apéndice <span class="redact">█</span>.`,
        },
        {
          title: '3. RESTRICCIONES DE USO',
          text: `El acceso al Almacén A está restringido a personal con autorización de nivel B o superior. El Cuarto de Máquinas requiere supervisión. La Sala de Control es de acceso exclusivo para el coordinador de turno.`,
        },
      ],
      signature: { left: 'DIRECCIÓN DE INSTALACIONES — 1994', right: 'SECTOR 03 // MANUAL OPERATIVO' },
    },
  },

  // LEVEL B
  {
    ref: 'DN-DOC-003', level: 'B', category: 'INCIDENTES',
    title: 'Informe Incidente 1987 — Resumen Ejecutivo',
    desc: 'Resumen no clasificado del protocolo de resiliencia de 1987. 12 sujetos. 3 supervivientes. Causas oficiales.',
    date: '1987-09-14', pages: 8,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — DEPARTAMENTO DE INVESTIGACIÓN',
      title: 'INCIDENTE SECTOR 03 — 1987',
      subtitle: 'Resumen Ejecutivo — Uso Restringido',
      classification: 'RESTRINGIDO',
      ref: 'DN-DOC-003 // NIVEL B',
      date: '1987-09-14',
      sections: [
        {
          title: '1. DESCRIPCIÓN DEL PROTOCOLO',
          text: `Protocolo de prueba de resiliencia extrema. 12 sujetos voluntarios. Periodo de confinamiento previsto: <span class="redact">██</span> días. Objetivo declarado a los sujetos: evaluar capacidad de adaptación bajo aislamiento prolongado. Objetivo real: <span class="redact">████████████████████████████████████</span>.`,
        },
        {
          title: '2. RESULTADO',
          text: `Al término del protocolo, 9 de los 12 sujetos presentaban <span class="redact">█████████████████████</span>. Tres supervivientes evacuados. Estado en el momento de evacuación: <span class="redact">████████████████</span>. Causa oficial registrada: estrés psicológico severo. Causa real: <span class="redact">████████████████████████████</span>.`,
        },
        {
          title: '3. MEDIDAS ADOPTADAS',
          text: `Informe completo clasificado. Acceso: nivel A exclusivo. Los tres supervivientes firmaron acuerdo de confidencialidad. Ver contrato DN-DOC-007. Ninguno ha emitido declaración pública desde <span class="redact">████████</span>.`,
        },
      ],
      signature: { left: 'INVESTIGADOR PRINCIPAL: <span class="redact">████████████</span>', right: 'CLASIFICACIÓN: RESTRINGIDO // NIVEL B' },
    },
  },
  {
    ref: 'DN-DOC-004', level: 'B', category: 'OBJETOS',
    title: 'Ficha de Objeto — Linterna SEC-7',
    desc: 'Registro de objeto encontrado en el búnker. Iniciales no identificadas. Conexión con nota DN-OBJ-002.',
    date: '[FECHA DESCONOCIDA]', pages: 2,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — INVENTARIO SECTOR 03',
      title: 'FICHA DE OBJETO — LINTERNA SEC-7',
      subtitle: 'Objeto sin propietario confirmado',
      classification: 'RESTRINGIDO',
      ref: 'DN-DOC-004 // NIVEL B',
      date: '[FECHA DESCONOCIDA]',
      sections: [
        {
          title: '1. DESCRIPCIÓN',
          text: `Linterna de uso estándar. Modelo: industrial. Estado: funcional. Desgaste considerable consistente con uso prolongado. Iniciales grabadas en la base: <span class="redact">███</span>. Grabado a mano. Herramienta utilizada: objeto cortante no identificado.`,
        },
        {
          title: '2. PROCEDENCIA',
          text: `Origen desconocido. No figura en el inventario de entrada del sujeto actual. No figura en el inventario del protocolo 1987. Posible procedencia: <span class="redact">████████████████████████</span>. Investigación: en curso.`,
        },
        {
          title: '3. CONEXIONES',
          text: `Las iniciales coinciden con la firma de la nota DN-OBJ-002 encontrada en el Almacén A. También coinciden con las iniciales detectadas en el espejo del baño (día 5). Hipótesis de investigación: <span class="redact">████████████████████████████████████████</span>.`,
        },
      ],
      signature: { left: 'INVENTARIO: <span class="redact">██████</span>', right: 'OBJETO SIN PROPIETARIO CONFIRMADO' },
    },
  },
  {
    ref: 'DN-DOC-007', level: 'B', category: 'CONTRATOS',
    title: 'Contrato de Confidencialidad — Supervivientes 1987',
    desc: 'Acuerdo de no divulgación firmado por los tres supervivientes del incidente de 1987. Términos y sanciones.',
    date: '1987-10-02', pages: 6,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — ASESORÍA JURÍDICA',
      title: 'ACUERDO DE CONFIDENCIALIDAD',
      subtitle: 'Incidente Sector 03 — 1987 — Supervivientes',
      classification: 'RESTRINGIDO',
      ref: 'DN-DOC-007 // NIVEL B',
      date: '1987-10-02',
      sections: [
        {
          title: '1. PARTES',
          text: `El Ministerio de Gestión Interior, en adelante "el Organismo", y los firmantes identificados como <span class="redact">████████████</span>, <span class="redact">████████████</span> y <span class="redact">████████████</span>, en adelante "los Supervivientes".`,
        },
        {
          title: '2. OBJETO',
          text: `Los Supervivientes se comprometen a no divulgar, por ningún medio, información relativa a: (a) la naturaleza del Protocolo de Resiliencia; (b) las condiciones de confinamiento en el Sector 03; (c) la suerte de los demás participantes; (d) cualquier anomalía observada durante el periodo de confinamiento.`,
        },
        {
          title: '3. SANCIONES',
          text: `El incumplimiento de este acuerdo conllevará: (a) acciones legales inmediatas; (b) <span class="redact">████████████████████████████████████████████████████████████████████</span>; (c) <span class="redact">████████████████████████████████</span>.`,
        },
        {
          title: '4. ESTADO DEL ACUERDO',
          text: `Vigente. Los tres firmantes han cumplido el acuerdo hasta la fecha. Último contacto de verificación: <span class="redact">████████</span>. Uno de los firmantes: <span class="redact">ESTADO DESCONOCIDO DESDE ████████</span>.`,
        },
      ],
      signature: { left: 'ASESORÍA JURÍDICA — 1987', right: 'ACUERDO VIGENTE // NIVEL B' },
    },
  },

  // LEVEL A
  {
    ref: 'DN-DOC-005', level: 'A', category: 'PROTOCOLOS',
    title: 'Protocolo Harlan — Manual Completo',
    desc: 'Manual de instrucciones completo para el rol de Harlan. Preguntas nocturnas, muletilla, gestión de cambios.',
    date: '[CLASIFICADO]', pages: 23,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — PROTOCOLO INTERNO',
      title: 'PROTOCOLO HARLAN — MANUAL OPERATIVO COMPLETO',
      subtitle: 'Solo para coordinadores autorizados — Destruir tras lectura',
      classification: 'MÁXIMO SECRETO',
      ref: 'DN-DOC-005 // NIVEL A',
      date: '[CLASIFICADO]',
      sections: [
        {
          title: '1. OBJETIVO DEL PROTOCOLO',
          text: `Harlan no es un superviviente. Es el coordinador activo del experimento. Su función: mantener al sujeto en un estado de confianza controlada mientras se ejecuta el Protocolo de Reescritura de Memoria. El sujeto no debe sospechar en ningún momento que Harlan tiene más información de la que aparenta.`,
        },
        {
          title: '2. PREGUNTAS NOCTURNAS',
          text: `Cada noche, Harlan formulará una pregunta casual sobre detalles del búnker. El objetivo: implantar una versión alternativa del recuerdo. Al día siguiente, el entorno del búnker reflejará la respuesta del sujeto. El sujeto no debe percibir el patrón. Si pregunta, Harlan responderá: "Yo tampoco lo recuerdo bien."`,
        },
        {
          title: '3. MULETILLA ASIGNADA',
          text: `Harlan usará sistemáticamente la expresión "por si acaso" al final de sus frases. El objetivo: convertirla en un ancla emocional de seguridad para el sujeto. En el día 4, la muletilla dejará de usarse. El sujeto percibirá el cambio antes de poder identificarlo conscientemente.`,
        },
        {
          title: '4. GESTIÓN DEL CAMBIO — DÍA 4',
          text: `En el día 4 se producirá la sustitución de Harlan o la modificación profunda de su comportamiento según el subprotocolo <span class="redact">████████████████</span>. El coordinador sustituto, si aplica, ha sido entrenado para mantener continuidad aparente. Gestión de inconsistencias: ver Apéndice H.`,
        },
      ],
      signature: { left: 'DIRECCIÓN DE PROTOCOLO — CLASIFICADO', right: 'NIVEL A — DESTRUIR TRAS LECTURA' },
    },
  },
  {
    ref: 'DN-DOC-006', level: 'A', category: 'TESTIMONIOS',
    title: 'Testimonio Superviviente 1987 — Sujeto 9',
    desc: 'Declaración completa del superviviente identificado como Sujeto 9. Única transcripción no censurada.',
    date: '1987-09-30', pages: 11,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — ARCHIVO RESERVADO',
      title: 'TESTIMONIO — SUPERVIVIENTE 1987 — SUJETO 9',
      subtitle: 'Transcripción no censurada — Máximo Secreto',
      classification: 'MÁXIMO SECRETO',
      ref: 'DN-DOC-006 // NIVEL A',
      date: '1987-09-30',
      sections: [
        {
          title: '1. IDENTIFICACIÓN',
          text: `Superviviente identificado internamente como Sujeto 9. Nombre real: <span class="redact">████████████████</span>. Edad en el momento del incidente: <span class="redact">██</span> años. Estado en el momento de la declaración: coherente pero con signos de disonancia cognitiva severa.`,
        },
        {
          title: '2. EXTRACTO DE DECLARACIÓN',
          text: `"El búnker no es lo que parece. Las paredes cambian. Yo lo sé. Les veía hacerlo por las noches cuando fingían que dormíamos. El coordinador —el que hacía de amigo— tenía un cuaderno. Apuntaba lo que decíamos en la cena. Al día siguiente el mundo era diferente. Nadie más lo notaba. O fingían no notarlo."<br><br>"Las iniciales en la linterna son de <span class="redact">████████</span>. Él fue el primero. Antes que todos nosotros. Y dejó la linterna aposta."`,
        },
        {
          title: '3. EVALUACIÓN PSIQUIÁTRICA',
          text: `La evaluación posterior calificó el testimonio del Sujeto 9 como producto de un estado disociativo grave. Recomendación del evaluador: no dar credibilidad pública al testimonio. Acuerdo de confidencialidad firmado. El Sujeto 9 no volvió a hablar del Sector 03 hasta <span class="redact">████████████████████████████</span>.`,
        },
      ],
      signature: { left: 'EVALUADOR: <span class="redact">████████████</span>', right: 'MÁXIMO SECRETO // NIVEL A' },
    },
  },
  {
    ref: 'DN-DOC-008', level: 'A', category: 'VIGILANCIA',
    title: 'Plan de Vigilancia — Supervivientes Post-1987',
    desc: 'Operativo de seguimiento activo sobre los tres supervivientes del incidente. Estado actual de cada sujeto.',
    date: '[VIGENTE]', pages: 9,
    content: {
      letterhead: 'MINISTERIO DE GESTIÓN INTERIOR — UNIDAD DE OPERACIONES ESPECIALES',
      title: 'PLAN DE VIGILANCIA — SUPERVIVIENTES 1987',
      subtitle: 'Operativo activo — Actualización continua',
      classification: 'MÁXIMO SECRETO',
      ref: 'DN-DOC-008 // NIVEL A',
      date: '[VIGENTE]',
      sections: [
        {
          title: '1. SUJETO A — ESTADO',
          text: `Localizado. Residencia actual: <span class="redact">████████████████████</span>. Actividad social: mínima. Cumple acuerdo de confidencialidad. Contacto de verificación trimestral. Sin señales de intención de divulgar. Riesgo: BAJO.`,
        },
        {
          title: '2. SUJETO B — ESTADO',
          text: `Localizado. Residencia actual: <span class="redact">████████████████████</span>. Ha intentado contactar con periodistas en <span class="redact">█</span> ocasiones. Contactos interceptados. No se ha producido divulgación efectiva. Riesgo: MEDIO. Medidas activas: <span class="redact">████████████████████████████</span>.`,
        },
        {
          title: '3. SUJETO C (SUJETO 9) — ESTADO',
          text: `LOCALIZACIÓN: DESCONOCIDA desde <span class="redact">████████</span>. Último contacto registrado: <span class="redact">████████████████████</span>. Se desconoce si sigue con vida. Se desconoce si ha divulgado información. Riesgo: <span class="redact">███████████</span>. Medidas adoptadas: <span class="redact">████████████████████████████████████████████████████</span>.`,
        },
      ],
      signature: { left: 'UNIDAD DE OPERACIONES ESPECIALES', right: 'OPERATIVO ACTIVO — MÁXIMO SECRETO // NIVEL A' },
    },
  },
];

let currentCategory = 'TODOS';

function renderDocs(level) {
  const levelOrder = { C:1, B:2, A:3 };
  const userLevel  = levelOrder[level] || 0;

  const container = document.getElementById('docGrid');
  if (!container) return;

  const filtered = DOCS.filter(d => {
    if (currentCategory !== 'TODOS' && d.category !== currentCategory) return false;
    return true;
  });

  container.innerHTML = filtered.map(doc => {
    const reqLevel = levelOrder[doc.level] || 1;
    const accessible = userLevel >= reqLevel;
    const lvClass = `level-${doc.level.toLowerCase()}`;
    const badgeClass = `lv-${doc.level.toLowerCase()}`;
    return `
      <div class="doc-card ${lvClass} ${!accessible ? 'locked' : ''}" onclick="${accessible ? `openDoc('${doc.ref}')` : ''}">
        <div class="dc-ref">${doc.ref}</div>
        <div class="dc-title">${doc.title}</div>
        <div class="dc-desc">${doc.desc}</div>
        <div class="dc-meta">
          <span class="level-badge ${badgeClass}">NIVEL ${doc.level}</span>
          <span class="dc-date">${doc.date}</span>
          <span class="dc-pages">${doc.pages} pág.</span>
        </div>
      </div>`;
  }).join('');
}

function initDocCategories() {
  const btns = document.querySelectorAll('.doc-cat-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      const access = getAccess();
      renderDocs(access ? access.level : 'C');
    });
  });
}

function openDoc(ref) {
  const doc = DOCS.find(d => d.ref === ref);
  if (!doc) return;
  const viewer  = document.getElementById('docViewer');
  const header  = document.getElementById('dvHeaderInfo');
  const body    = document.getElementById('dvBody');
  if (!viewer || !body) return;

  if (header) header.textContent = `${doc.ref} // ${doc.category} // NIVEL ${doc.level}`;

  const c = doc.content;
  const sectionsHTML = c.sections.map(s => `
    <div class="doc-section">
      <div class="doc-section-title">${s.title}</div>
      <p>${s.text}</p>
    </div>`).join('');

  body.innerHTML = `
    <div class="doc-letterhead">
      <div class="ministry">${c.letterhead}</div>
      <div class="doc-title">${c.title}</div>
      <div class="doc-subtitle">${c.subtitle}</div>
    </div>
    <div class="doc-stamp-row">
      <span>${c.ref} // ${c.date}</span>
      <span class="stamp-classif">${c.classification}</span>
    </div>
    ${sectionsHTML}
    <div class="doc-signature">
      <span>${c.signature.left}</span>
      <span>${c.signature.right}</span>
    </div>`;

  viewer.classList.add('open');
}

function closeDoc() {
  const viewer = document.getElementById('docViewer');
  if (viewer) viewer.classList.remove('open');
}

// ================================================================
// PARTICLES
// ================================================================
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }
  function init() {
    particles = [];
    const R = W < 768 ? 22 : 32, C = W < 768 ? 22 : 32;
    for (let i = 0; i < R; i++)
      for (let j = 0; j < C; j++)
        particles.push({ bx:(j/C)*W, by:(i/R)*H, size:0.4+Math.random()*0.5,
          phase:Math.random()*Math.PI*2, offset:(i+j)*0.16 });
  }
  let t = 0;
  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0,0,W,H);
    t += 0.003;
    for (const p of particles) {
      const x = p.bx + Math.sin(t + p.offset) * 8;
      const y = p.by + Math.cos(t*0.6 + p.offset) * 12;
      const b = Math.sin(t*0.9 + p.phase) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(40,100,50,${0.04 + b * 0.12})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  initTabs();
  initSearch();
  initBunkerMap();
  initArchiveGate();
  initDocCategories();
});
