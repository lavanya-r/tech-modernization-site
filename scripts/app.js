/**
 * DWP LTD — Legacy Technology Debt Modernization Program
 * app.js — Markdown-powered SPA navigation
 */

/* ── Navigation Config ──────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: 'Program',
    items: [
      { id: 'home',         label: 'Home',                  icon: '⌂',  file: null },
      { id: 'overview',     label: 'Program Overview',      icon: '◉',  file: 'content/01-overview.md',      badge: null },
    ]
  },
  {
    label: 'Delivery',
    items: [
      { id: 'phases',       label: 'Program Phases',        icon: '▶',  file: 'content/04-phases.yaml' },
      { id: 'roles',        label: 'Roles',                 icon: '◈',  file: 'content/roles.yaml',        disabled: true },
      { id: 'artifact-graph', label: 'Artefact Flow Graph', icon: '⬡',  file: 'content/11-workproducts.yaml' },
    ]
  },
  {
    label: 'Management',
    items: [
      { id: 'governance',   label: 'Governance',            icon: '⬡',  file: 'content/05-governance.md',  disabled: true },
    ]
  }
];

/* Flat lookup map: id → item */
const PAGE_MAP = {};
NAV_SECTIONS.forEach(s => s.items.forEach(item => { PAGE_MAP[item.id] = item; }));

/* Content cache: file → rendered HTML */
const MD_CACHE = {};

/* ── DOM Ready ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  buildQuickNav();
  attachMenuToggle();
  attachHashRouting();
  navigateTo(getCurrentHash() || 'home');
  updateClock();
  setInterval(updateClock, 60000);
});

/* ── Sidebar Builder ────────────────────────────────────────────────────── */
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  NAV_SECTIONS.forEach(section => {
    const title = document.createElement('div');
    title.className = 'nav-section-title';
    title.textContent = section.label;
    nav.appendChild(title);

    section.items.forEach(item => {
      if (item.disabled) {
        const span = document.createElement('span');
        span.className = 'nav-item nav-item--disabled';
        span.id = `nav-${item.id}`;
        span.innerHTML = `
          <span class="nav-item-icon">${item.icon}</span>
          <span class="nav-item-label">${item.label}</span>
          <span class="nav-item-badge nav-item-badge--soon">Soon</span>
        `;
        nav.appendChild(span);
        return;
      }
      const a = document.createElement('a');
      a.className = 'nav-item';
      a.id = `nav-${item.id}`;
      a.href = `#${item.id}`;
      a.innerHTML = `
        <span class="nav-item-icon">${item.icon}</span>
        <span class="nav-item-label">${item.label}</span>
        ${item.badge ? `<span class="nav-item-badge">${item.badge}</span>` : ''}
      `;
      a.addEventListener('click', e => {
        e.preventDefault();
        closeSidebar();
        navigateTo(item.id);
        history.pushState(null, '', `#${item.id}`);
      });
      nav.appendChild(a);
    });
  });
}

/* ── Quick Nav Cards (Home) ─────────────────────────────────────────────── */
function buildQuickNav() {
  const grid = document.getElementById('quicknav-grid');
  if (!grid) return;

  const cards = [
    { id: 'overview',     title: 'Program Overview',       desc: 'Scope, investment & success criteria' },
    { id: 'phases',       title: 'Program Phases',         desc: '5-phase delivery lifecycle, FY25–FY30' },
    { id: 'governance',   title: 'Governance',             desc: 'Decision rights, reporting & KPIs' },
    { id: 'workproducts', title: 'Work Products',          desc: 'Architecture, Design, Engineering and Quality Assurance workproducts' },
    { id: 'roles',        title: 'Roles',                  desc: 'All program roles and the work products they own' },
  ];

  cards.forEach((card, i) => {
    const div = document.createElement('div');
    div.className = 'quicknav-card';
    div.innerHTML = `
      <div class="quicknav-icon">${String.fromCharCode(65 + i)}</div>
      <div class="quicknav-title">${card.title}</div>
      <div class="quicknav-desc">${card.desc}</div>
    `;
    div.addEventListener('click', () => {
      navigateTo(card.id);
      history.pushState(null, '', `#${card.id}`);
    });
    grid.appendChild(div);
  });
}

/* ── Navigation ─────────────────────────────────────────────────────────── */
function navigateTo(id) {
  // Validate id
  if (!PAGE_MAP[id]) id = 'home';

  // Update active nav state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${id}`);
  if (activeNav) {
    activeNav.classList.add('active');
    // Scroll into view in sidebar if needed
    activeNav.scrollIntoView({ block: 'nearest' });
  }

  // Show home or content page
  if (id === 'home') {
    document.getElementById('home-view').style.display = 'flex';
    document.getElementById('content-view').style.display = 'none';
    return;
  }

  document.getElementById('home-view').style.display = 'none';
  document.getElementById('content-view').style.display = 'block';

  const item = PAGE_MAP[id];
  loadPage(item);
}

async function loadPage(item) {
  const container = document.getElementById('md-container');
  const breadcrumb = document.getElementById('page-breadcrumb');

  // Update breadcrumb
  if (breadcrumb) {
    const section = NAV_SECTIONS.find(s => s.items.some(i => i.id === item.id));
    breadcrumb.innerHTML = `Program / <span>${section ? section.label : ''}</span> / ${item.label}`;
  }

  // Cache key is per-page-id so pages sharing the same file (e.g. workproducts
  // and artifact-graph) each get their own rendered HTML cache entry.
  const cacheKey = item.id;

  // Check cache — graph and phases pages must re-init their JS every time (DOM is recreated)
  if (MD_CACHE[cacheKey] && item.id !== 'artifact-graph' && item.id !== 'phases') {
    container.innerHTML = `<div class="md-content">${MD_CACHE[cacheKey]}</div>`;
    window.scrollTo(0, 0);
    return;
  }

  // Show skeleton loader
  container.innerHTML = buildSkeleton();

  try {
    const response = await fetch(item.file);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const isYaml = item.file.endsWith('.yaml') || item.file.endsWith('.yml');
    let result;
    if (isYaml) {
      const data = jsyaml.load(text);
      result = await renderYaml(item.id, data);
    } else {
      result = marked.parse(text);
    }
    // renderArtifactGraph returns { html, init } instead of a plain string
    const html   = (result && result.html) ? result.html : result;
    const initFn = (result && result.init) ? result.init : null;
    MD_CACHE[cacheKey] = html;
    container.innerHTML = `<div class="md-content">${html}</div>`;
    if (initFn) initFn();   // called after innerHTML is set — DOM is ready
    window.scrollTo(0, 0);
  } catch (err) {
    container.innerHTML = `
      <div class="md-content">
        <div style="padding:2rem;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;color:#991b1b;">
          <strong>⚠ Content Unavailable</strong><br>
          Unable to load <code>${item.file}</code>. Ensure you are running this site through a local web server.
          <br><br><small>Error: ${err.message}</small>
        </div>
      </div>`;
  }
}

function buildSkeleton() {
  return `
    <div class="loading-placeholder">
      <div class="skeleton" style="height:36px;width:55%;"></div>
      <div class="skeleton" style="height:14px;width:100%;"></div>
      <div class="skeleton" style="height:14px;width:90%;"></div>
      <div class="skeleton" style="height:14px;width:95%;"></div>
      <div class="skeleton" style="height:14px;width:80%;margin-top:0.5rem;"></div>
      <div class="skeleton" style="height:110px;width:100%;margin-top:0.75rem;border-radius:8px;"></div>
      <div class="skeleton" style="height:14px;width:88%;margin-top:0.5rem;"></div>
      <div class="skeleton" style="height:14px;width:75%;"></div>
    </div>`;
}

/* ── YAML Renderers ─────────────────────────────────────────────────────── */
async function renderYaml(id, data) {
  if (id === 'phases') return await renderPhases(data);
  if (id === 'roles') return await renderRoles(data);
  if (id === 'artifact-graph') return await renderArtifactGraph(data);
  // Generic fallback: pretty-print as a <pre> block
  return `<h1>${data.title || id}</h1><pre class="yaml-raw">${jsyaml.dump(data)}</pre>`;
}

// ── Normalise a name for fuzzy matching (lowercase, alphanumeric+space only) ──
function _normName(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Build artefact lookup map from workproducts registry ──
// desc falls back to joining the `includes` list when no explicit desc is present
function _buildArtefactLookup(wpData) {
  const map = new Map();
  for (const art of (wpData.artefacts || [])) {
    const norm = _normName(art.name);
    let desc = art.desc || art.description || '';
    if (!desc && art.includes && art.includes.length) {
      desc = 'Includes: ' + art.includes.join('; ');
    }
    map.set(norm, { id: art.id, name: art.name, desc });
  }
  return map;
}

// ── Find best matching registry entry for a phase artefact name ──
// Priority: 1) exact normalised match  2) containment either way
function _matchArtefact(phaseName, lookup) {
  const norm = _normName(phaseName);
  if (lookup.has(norm)) return lookup.get(norm);
  for (const [key, entry] of lookup) {
    if (norm.includes(key) || key.includes(norm)) return entry;
  }
  return null;
}

// ── Render a single artefact <li> — with info icon+tooltip if matched ──
function _artefactLi(name, lookup) {
  const match = _matchArtefact(name, lookup);
  if (!match || !match.desc) return `<li>${name}</li>`;
  const safeDesc = match.desc.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeId   = match.id.replace(/</g, '&lt;');
  return `<li><span class="art-item">${name}<span class="art-info" tabindex="0" aria-label="${match.name}: ${safeDesc}"><i class="art-info-icon">i</i><span class="art-tooltip"><span class="art-tooltip-id">${safeId}</span><br/>${safeDesc}</span></span></span></li>`;
}

async function renderPhases(data) {
  // Fetch artefact registry from workproducts yaml for tooltip lookup
  let artefactLookup = new Map();
  try {
    const resp = await fetch('content/11-workproducts.yaml');
    if (resp.ok) {
      const wpData = jsyaml.load(await resp.text());
      artefactLookup = _buildArtefactLookup(wpData);
    }
  } catch (_) { /* tooltips optional — fail silently */ }

  const phases = data.phases || [];

  // ── Tab strip ──────────────────────────────────────────────
  let tabsHtml = '';
  let panelsHtml = '';

  phases.forEach((phase, idx) => {
    const isFirst  = idx === 0;
    const panelId  = `phase-panel-${idx}`;
    const tabId    = `phase-tab-${idx}`;

    const activitiesHtml       = (phase.activities || []).map(a => {
      // js-yaml folds indented sub-items into one string separated by " - "
      const parts = String(a).split(' - ');
      const parent = parts[0].trim();
      const subs   = parts.slice(1).map(s => `<li>${s.trim()}</li>`);
      const subHtml = subs.length
        ? `<ul class="activity-sub-list">${subs.join('')}</ul>`
        : '';
      return `<li>${parent}${subHtml}</li>`;
    }).join('');
    const artefactsHtml        = (phase.artefacts || []).map(a => _artefactLi(a, artefactLookup)).join('');
    const deliverablesHtml     = (phase.deliverables || []).map(d => `<li>${d}</li>`).join('');
    const internalGatesHtml    = (phase.internal_quality_gates || []).map(g => `<li>${g}</li>`).join('');
    const clientGatesHtml      = (phase.client_quality_gates || []).map(g => `<li>${g}</li>`).join('');

    // Optional: modernization strategy table
    let strategyHtml = '';
    if (phase.modernization_strategies) {
      const rows = phase.modernization_strategies
        .map(s => `<tr><td>${s.strategy}</td><td>${s.applications}</td><td>${s.percentage}</td></tr>`)
        .join('');
      strategyHtml = `
        <div class="phase-section phase-section--full">
          <h4>Modernization Strategy Distribution</h4>
          <table class="yaml-table">
            <thead><tr><th>Strategy</th><th>Applications</th><th>% of Portfolio</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    // Optional: data domains list
    let domainsHtml = '';
    if (phase.data_domains) {
      const items = phase.data_domains
        .map(d => `<li><strong>${d.name}</strong> — ${d.description}</li>`).join('');
      domainsHtml = `
        <div class="phase-section phase-section--full">
          <h4>Data Domains</h4>
          <ol>${items}</ol>
        </div>`;
    }

    tabsHtml += `
      <button class="phase-tab${isFirst ? ' active' : ''}"
              role="tab"
              id="${tabId}"
              aria-controls="${panelId}"
              aria-selected="${isFirst ? 'true' : 'false'}"
              data-phase-idx="${idx}">
        <span class="phase-tab-number">Phase ${phase.number}</span>
        <span class="phase-tab-name">${phase.name}</span>
      </button>`;

    const artefactsDeliverables = (artefactsHtml || deliverablesHtml) ? `
      <div class="phase-artifacts-deliverables">
        ${artefactsHtml    ? `<div class="phase-ad-col phase-ad-col--artefacts"><div class="phase-section-label">Artefacts</div><ul>${artefactsHtml}</ul></div>`       : ''}
        ${deliverablesHtml ? `<div class="phase-ad-col phase-ad-col--deliverables"><div class="phase-section-label">Deliverables</div><ul>${deliverablesHtml}</ul></div>` : ''}
      </div>` : '';

    const governanceHtml = (internalGatesHtml || clientGatesHtml) ? `
      <div class="phase-governance-section">
        <div class="phase-governance-title">Governance</div>
        <div class="phase-governance-grid">
          ${internalGatesHtml ? `<div class="phase-gov-col phase-gov-col--internal"><span class="phase-gov-col-label">Internal Quality Gates</span><ul>${internalGatesHtml}</ul></div>` : ''}
          ${clientGatesHtml   ? `<div class="phase-gov-col phase-gov-col--client"><span class="phase-gov-col-label">Client Quality Gates</span><ul>${clientGatesHtml}</ul></div>`       : ''}
        </div>
      </div>` : '';

    panelsHtml += `
      <div class="phase-panel${isFirst ? ' active' : ''}"
           role="tabpanel"
           id="${panelId}"
           aria-labelledby="${tabId}">
        <div class="phase-panel-title">
          <span class="phase-badge">Phase ${phase.number}</span>
          <h2 class="phase-panel-name">${phase.name}</h2>
        </div>
        <p class="phase-objective">${phase.objective}</p>
        ${activitiesHtml ? `<div class="phase-activities-section"><div class="phase-section-label">Key Activities</div><ul>${activitiesHtml}</ul></div>` : ''}
        ${artefactsDeliverables}
        ${strategyHtml}
        ${domainsHtml}
        ${governanceHtml}
      </div>`;
  });

  const html = `
    <div class="yaml-page-header">
      <h1>${data.title}</h1>
      <p class="yaml-description">${data.description || ''}</p>
    </div>
    <div class="phase-tabs-wrapper">
      <div class="phase-tab-list" role="tablist" aria-label="Program phases">
        ${tabsHtml}
      </div>
      ${panelsHtml}
    </div>`;

  return { html, init: initPhaseTabs };
}

function initPhaseTabs() {
  const wrapper = document.querySelector('.phase-tabs-wrapper');
  if (!wrapper) return;
  wrapper.querySelectorAll('.phase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.phaseIdx;
      wrapper.querySelectorAll('.phase-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.phaseIdx === idx);
        t.setAttribute('aria-selected', t.dataset.phaseIdx === idx ? 'true' : 'false');
      });
      wrapper.querySelectorAll('.phase-panel').forEach((p, i) => {
        p.classList.toggle('active', String(i) === idx);
      });
    });
  });
}

/* ── Roles Renderer ─────────────────────────────────────────────────────── */
async function renderRoles(data) {
  // Fetch workproducts to build reverse-map: role-id → [workproduct names]
  let wpByRole = {};
  try {
    const res = await fetch('content/11-workproducts.yaml');
    if (res.ok) {
      const wpData = jsyaml.load(await res.text());
      (wpData.categories || []).forEach(cat => {
        (cat.workproducts || []).forEach(wp => {
          if (wp.owner) {
            if (!wpByRole[wp.owner]) wpByRole[wp.owner] = [];
            wpByRole[wp.owner].push({ name: wp.name, category: cat.name, icon: cat.icon });
          }
        });
      });
    }
  } catch (_) { /* workproducts unavailable */ }

  const roles = data.roles || [];

  let html = `
    <div class="yaml-page-header">
      <h1>${data.title}</h1>
      <p class="yaml-description">${data.description || ''}</p>
    </div>
    <div class="role-list">`;

  roles.forEach(role => {
    const owned = wpByRole[role.id] || [];
    const wpListHtml = owned.length
      ? owned.map(wp => `
          <li class="role-wp-item">
            <span class="role-wp-cat-icon">${wp.icon}</span>
            <a class="role-wp-name" href="#workproducts"
               onclick="event.preventDefault();navigateTo('workproducts');history.pushState(null,'','#workproducts');"
               title="Go to Work Products">${wp.name}</a>
            <span class="role-wp-cat">${wp.category}</span>
          </li>`).join('')
      : `<li class="role-wp-item role-wp-none">No work products assigned</li>`;

    html += `
      <div class="role-card">
        <div class="role-card-header">
          <div class="role-name">${role.name}</div>
          <code class="role-id">${role.id}</code>
        </div>
        <ul class="role-wp-list">${wpListHtml}</ul>
      </div>`;
  });

  html += `</div>`;
  return html;
}

/* ── Artifact Flow Graph — Phase-box swimlane layout ────────────────────── */
async function renderArtifactGraph(data) {
  const artifacts = data.artefacts || [];

  // ── Phase definitions (colours + display order) ───────────────────────────
  const PHASES = [
    { id: 'phase-disco',    label: 'Discovery',          color: '#d97706', fill: '#fffbeb' },
    { id: 'phase-alpha-hld',label: 'High-Level Design',  color: '#1d4ed8', fill: '#eff6ff' },
    { id: 'phase-beta-lld', label: 'Low-Level Design',   color: '#0e7490', fill: '#f0fdfa' },
  ];

  // ── Fetch phase artefact lists from 04-phases.yaml ────────────────────────
  let phaseArtNames = {};   // phaseId → string[]
  try {
    const res = await fetch('content/04-phases.yaml');
    if (res.ok) {
      const pd = jsyaml.load(await res.text());
      (pd.phases || []).forEach(p => { phaseArtNames[p.id] = p.artefacts || []; });
    }
  } catch (_) { /* phases unavailable — fall back to ungrouped */ }

  // ── Build name→registry lookup using existing helper ─────────────────────
  const artLookup = _buildArtefactLookup(data);

  // ── Map each phase artefact name → registry id (best-effort fuzzy match) ──
  // phaseNodes: phaseId → Array<{ uid, id, name, desc, repeated }>
  // uid is unique per (phase, id) so repeated artefacts get separate node objects.
  const phaseNodes = {};
  const seenAcrossPhases = {};  // registryId → count (to flag repeated nodes)

  PHASES.forEach(ph => {
    phaseNodes[ph.id] = [];
    (phaseArtNames[ph.id] || []).forEach(artName => {
      const match = _matchArtefact(artName, artLookup);
      const regId = match ? match.id   : null;
      const name  = match ? match.name : artName;
      const desc  = match ? match.desc : '';
      const uid   = regId ? `${ph.id}__${regId}` : `${ph.id}__${artName}`;
      if (regId) seenAcrossPhases[regId] = (seenAcrossPhases[regId] || 0) + 1;
      phaseNodes[ph.id].push({ uid, regId, name, desc, phaseId: ph.id });
    });
  });

  // Mark repeated nodes (same registry id appears in >1 phase)
  PHASES.forEach(ph => {
    phaseNodes[ph.id].forEach(n => {
      n.repeated = n.regId && seenAcrossPhases[n.regId] > 1;
    });
  });

  // ── Flat node list (one entry per phase occurrence) ───────────────────────
  const nodes = PHASES.flatMap(ph => phaseNodes[ph.id]);

  // ── Build edges from registry input_artefacts ─────────────────────────────
  // For each registry edge (srcRegId → tgtRegId), emit one D3 link connecting
  // the uid of srcRegId's node in the *earliest* phase it appears to the uid
  // of tgtRegId's node in its phase.
  const uidByRegId = {};  // regId → first uid encountered (earliest phase)
  PHASES.forEach(ph => {
    phaseNodes[ph.id].forEach(n => {
      if (n.regId && !uidByRegId[n.regId]) uidByRegId[n.regId] = n.uid;
    });
  });
  // Also build a per-phase uid map for target lookup (use same-phase copy if available)
  const uidByRegIdAndPhase = {};  // `${phaseId}|${regId}` → uid
  PHASES.forEach(ph => {
    phaseNodes[ph.id].forEach(n => {
      if (n.regId) uidByRegIdAndPhase[`${ph.id}|${n.regId}`] = n.uid;
    });
  });

  const nodeUids = new Set(nodes.map(n => n.uid));
  const links = [];
  artifacts.forEach(tgtArt => {
    const tgtMatch = _matchArtefact(tgtArt.name, artLookup);
    if (!tgtMatch) return;
    (tgtArt.input_artefacts || []).forEach(srcRegId => {
      // Find all phase copies of the target
      PHASES.forEach(ph => {
        const tgtUid = uidByRegIdAndPhase[`${ph.id}|${tgtMatch.id}`];
        if (!tgtUid) return;
        // Prefer same-phase source copy; fall back to earliest
        const srcUid = uidByRegIdAndPhase[`${ph.id}|${srcRegId}`] || uidByRegId[srcRegId];
        if (srcUid && nodeUids.has(srcUid) && srcUid !== tgtUid) {
          // Avoid duplicate links
          if (!links.find(l => l.source === srcUid && l.target === tgtUid)) {
            links.push({ source: srcUid, target: tgtUid,
              crossPhase: !srcUid.startsWith(ph.id) });
          }
        }
      });
    });
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const linkedUids = new Set(links.flatMap(l => [l.source, l.target]));
  const standaloneCount = nodes.filter(n => !linkedUids.has(n.uid)).length;

  // ── Legend HTML ───────────────────────────────────────────────────────────
  const legendHtml = PHASES.map(ph => `
    <div class="ag-legend-item">
      <span class="ag-legend-dot" style="background:${ph.color};"></span>
      <span>${ph.label}</span>
    </div>`).join('') + `
    <div class="ag-legend-item">
      <span class="ag-legend-dot" style="background:#9ca3af;border:1.5px dashed #9ca3af;box-sizing:border-box;"></span>
      <span>Repeated node</span>
    </div>`;

  // ── Container HTML ────────────────────────────────────────────────────────
  const html = `
    <div class="yaml-page-header">
      <h1>Artefact Flow Graph</h1>
      <p class="yaml-description">
        Phase-swimlane dependency graph. Artefacts are placed inside their phase box.
        Nodes appearing in multiple phases are repeated — arrows show
        <em>input_artefact</em> relationships from the registry.
      </p>
    </div>

    <div class="ag-toolbar">
      <div class="ag-stats">
        <span class="ag-stat"><strong>${nodes.length}</strong> nodes</span>
        <span class="ag-stat"><strong>${links.length}</strong> dependencies</span>
        <span class="ag-stat"><strong>${standaloneCount}</strong> standalone</span>
      </div>
      <div class="ag-legend">${legendHtml}</div>
      <div class="ag-controls">
        <button class="ag-btn" id="ag-reset-btn" title="Reset zoom">⟳ Reset</button>
      </div>
    </div>

    <div class="ag-canvas-wrap" id="ag-wrap">
      <svg id="ag-svg"></svg>
      <div class="ag-tooltip" id="ag-tooltip"></div>
    </div>`;

  return { html, init: () => initArtifactGraph(nodes, links, PHASES, phaseNodes) };
}

function initArtifactGraph(nodes, links, PHASES, phaseNodes) {
  const wrap     = document.getElementById('ag-wrap');
  const svg      = d3.select('#ag-svg');
  const tip      = document.getElementById('ag-tooltip');
  const resetBtn = document.getElementById('ag-reset-btn');
  if (!wrap || svg.empty()) return;

  const W = wrap.clientWidth  || 960;
  const H = wrap.clientHeight || 620;
  svg.attr('width', W).attr('height', H);

  // ── Phase box geometry ────────────────────────────────────────────────────
  const PAD_TOP    = 54;   // space for phase label inside box
  const PAD_SIDE   = 18;
  const BOX_GAP    = 24;
  const BOX_COUNT  = PHASES.length;
  const BOX_W      = Math.floor((W - BOX_GAP * (BOX_COUNT + 1)) / BOX_COUNT);
  const BOX_H      = H - 40;
  const NODE_R     = 14;
  const COLS       = Math.max(1, Math.floor((BOX_W - PAD_SIDE * 2) / 90));

  // Assign initial (fx/fy) positions — grid inside each phase box
  PHASES.forEach((ph, pi) => {
    const boxX = BOX_GAP + pi * (BOX_W + BOX_GAP);
    const boxY = 20;
    phaseNodes[ph.id].forEach((n, ni) => {
      const col = ni % COLS;
      const row = Math.floor(ni / COLS);
      n.fx0 = boxX + PAD_SIDE + col * Math.floor((BOX_W - PAD_SIDE * 2) / COLS) + NODE_R + 10;
      n.fy0 = boxY + PAD_TOP  + row * 80 + NODE_R + 10;
      n.x   = n.fx0;
      n.y   = n.fy0;
      n.boxX = boxX;
      n.boxY = boxY;
      n.boxW = BOX_W;
      n.boxH = BOX_H;
      n.phaseColor = ph.color;
      n.phaseFill  = ph.fill;
      n.phaseLabel = ph.label;
    });
  });

  // ── Arrow markers ─────────────────────────────────────────────────────────
  const defs = svg.append('defs');
  const ARROW_COLORS = { within: '#64748b', cross: '#94a3b8' };
  ['within', 'cross'].forEach(t => {
    defs.append('marker')
      .attr('id', `arr-${t}`)
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 16).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', ARROW_COLORS[t]).attr('opacity', 0.85);
  });
  // Per-phase markers for within-box links
  PHASES.forEach(ph => {
    defs.append('marker')
      .attr('id', `arr-ph-${ph.id}`)
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 16).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', ph.color).attr('opacity', 0.75);
  });

  // ── Zoom layer ────────────────────────────────────────────────────────────
  const g = svg.append('g').attr('class', 'ag-g');
  const zoom = d3.zoom().scaleExtent([0.15, 4])
    .on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoom);
  if (resetBtn) resetBtn.addEventListener('click', () =>
    svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));

  // ── Phase box rects (background layer) ────────────────────────────────────
  const boxLayer = g.append('g').attr('class', 'ag-phase-boxes');
  PHASES.forEach((ph, pi) => {
    const bx = BOX_GAP + pi * (BOX_W + BOX_GAP);
    const by = 20;
    // Shadow rect
    boxLayer.append('rect')
      .attr('x', bx + 3).attr('y', by + 3)
      .attr('width', BOX_W).attr('height', BOX_H).attr('rx', 10)
      .attr('fill', 'rgba(0,0,0,0.06)');
    // Fill rect
    boxLayer.append('rect')
      .attr('x', bx).attr('y', by)
      .attr('width', BOX_W).attr('height', BOX_H).attr('rx', 10)
      .attr('fill', ph.fill).attr('stroke', ph.color).attr('stroke-width', 2);
    // Header band
    boxLayer.append('rect')
      .attr('x', bx).attr('y', by)
      .attr('width', BOX_W).attr('height', 34).attr('rx', 10)
      .attr('fill', ph.color);
    boxLayer.append('rect')
      .attr('x', bx).attr('y', by + 24)
      .attr('width', BOX_W).attr('height', 10)
      .attr('fill', ph.color);
    // Phase number badge
    boxLayer.append('circle')
      .attr('cx', bx + 18).attr('cy', by + 17)
      .attr('r', 9).attr('fill', 'rgba(255,255,255,0.25)');
    boxLayer.append('text')
      .attr('x', bx + 18).attr('y', by + 21)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('font-weight', '700').attr('fill', '#fff')
      .text(pi + 1);
    // Phase label
    boxLayer.append('text')
      .attr('x', bx + 32).attr('y', by + 21)
      .attr('font-size', 10.5).attr('font-weight', '700').attr('fill', '#fff')
      .attr('letter-spacing', '0.4')
      .text(ph.label.toUpperCase());
  });

  // ── Force simulation ──────────────────────────────────────────────────────
  // Soft-pin nodes inside their box; allow gentle drift within box bounds.
  const simulation = d3.forceSimulation(nodes)
    .force('link',    d3.forceLink(links).id(d => d.uid).distance(85).strength(0.4))
    .force('charge',  d3.forceManyBody().strength(-180))
    .force('collide', d3.forceCollide(NODE_R + 6))
    .force('boxX',    d3.forceX(d => d.fx0).strength(0.35))
    .force('boxY',    d3.forceY(d => d.fy0).strength(0.35))
    .alphaDecay(0.03);

  // Clamp nodes inside their phase box on each tick
  function clamp(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }

  // ── Edges ─────────────────────────────────────────────────────────────────
  const link = g.append('g').attr('class', 'ag-links')
    .selectAll('line').data(links).join('line')
      .attr('class', 'ag-link')
      .attr('stroke', d => {
        if (d.crossPhase) return '#94a3b8';
        const srcNode = nodes.find(n => n.uid === (d.source.uid || d.source));
        return srcNode ? srcNode.phaseColor : '#94a3b8';
      })
      .attr('stroke-dasharray', d => d.crossPhase ? '5 3' : null)
      .attr('stroke-width', d => d.crossPhase ? 1.3 : 1.6)
      .attr('marker-end', d => {
        if (d.crossPhase) return 'url(#arr-cross)';
        const srcNode = nodes.find(n => n.uid === (d.source.uid || d.source));
        return srcNode ? `url(#arr-ph-${srcNode.phaseId})` : 'url(#arr-within)';
      });

  // ── Node groups ───────────────────────────────────────────────────────────
  const node = g.append('g').attr('class', 'ag-nodes')
    .selectAll('g').data(nodes).join('g')
      .attr('class', 'ag-node')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (e, d) => {
          d.fx = clamp(e.x, d.boxX + NODE_R + 4, d.boxX + d.boxW - NODE_R - 4);
          d.fy = clamp(e.y, d.boxY + PAD_TOP + NODE_R, d.boxY + d.boxH - NODE_R - 4);
        })
        .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

  // Circle — repeated nodes get dashed stroke
  node.append('circle')
    .attr('r', NODE_R)
    .attr('fill', d => d.phaseColor)
    .attr('fill-opacity', 0.18)
    .attr('stroke', d => d.repeated ? '#9ca3af' : d.phaseColor)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', d => d.repeated ? '4 2' : null);

  // Short ID label inside circle
  node.append('text')
    .attr('class', 'ag-node-id')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', d => d.phaseColor)
    .text(d => {
      if (!d.regId) return 'NA';
      const parts = d.regId.split(/[\s\-_]/);
      return parts[parts.length - 1].slice(0, 5);
    });

  // Name label below circle
  node.append('text')
    .attr('class', 'ag-node-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '2.4em')
    .text(d => d.name.length > 20 ? d.name.slice(0, 18) + '…' : d.name);

  // ── Tooltip ───────────────────────────────────────────────────────────────
  node
    .on('mouseenter', (e, d) => {
      const inDeps  = links.filter(l => (l.target.uid || l.target) === d.uid)
                           .map(l => { const s = nodes.find(n => n.uid === (l.source.uid || l.source)); return s ? s.name : l.source; });
      const outDeps = links.filter(l => (l.source.uid || l.source) === d.uid)
                           .map(l => { const t = nodes.find(n => n.uid === (l.target.uid || l.target)); return t ? t.name : l.target; });
      tip.innerHTML = `
        <div class="ag-tip-id">${d.regId || '—'}</div>
        <div class="ag-tip-name">${d.name}</div>
        ${d.desc ? `<div class="ag-tip-desc">${d.desc}</div>` : ''}
        <div class="ag-tip-row"><span class="ag-tip-lbl ag-tip-lbl--in" style="background:${d.phaseColor}88">${d.phaseLabel}</span></div>
        ${inDeps.length  ? `<div class="ag-tip-row"><span class="ag-tip-lbl ag-tip-lbl--in">Inputs</span> ${inDeps.join(', ')}</div>`  : ''}
        ${outDeps.length ? `<div class="ag-tip-row"><span class="ag-tip-lbl ag-tip-lbl--out">Used by</span> ${outDeps.join(', ')}</div>` : ''}`;
      tip.style.display = 'block';
    })
    .on('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      let tx = e.clientX - rect.left + 14;
      let ty = e.clientY - rect.top  - 10;
      if (tx + 240 > wrap.clientWidth)  tx = e.clientX - rect.left - 250;
      if (ty + 140 > wrap.clientHeight) ty = e.clientY - rect.top  - 150;
      tip.style.left = tx + 'px';
      tip.style.top  = ty + 'px';
    })
    .on('mouseleave', () => { tip.style.display = 'none'; });

  // ── Highlight on hover ────────────────────────────────────────────────────
  node.on('mouseenter.highlight', (e, d) => {
    const connected = new Set(
      links.flatMap(l => {
        const s = l.source.uid || l.source, t = l.target.uid || l.target;
        return s === d.uid ? [t] : t === d.uid ? [s] : [];
      })
    );
    connected.add(d.uid);

    node.select('circle')
      .attr('fill-opacity', n => connected.has(n.uid) ? 0.9  : 0.04)
      .attr('stroke-opacity', n => connected.has(n.uid) ? 1   : 0.2);
    node.select('.ag-node-id')
      .attr('opacity', n => connected.has(n.uid) ? 1 : 0.15);
    node.select('.ag-node-label')
      .attr('opacity', n => connected.has(n.uid) ? 1 : 0.1);
    link.attr('opacity', l => {
      const s = l.source.uid || l.source, t = l.target.uid || l.target;
      return (s === d.uid || t === d.uid) ? 1 : 0.04;
    });
  })
  .on('mouseleave.highlight', () => {
    node.select('circle').attr('fill-opacity', 0.18).attr('stroke-opacity', 1);
    node.select('.ag-node-id').attr('opacity', 1);
    node.select('.ag-node-label').attr('opacity', 1);
    link.attr('opacity', 0.6);
  });

  // ── Tick ──────────────────────────────────────────────────────────────────
  simulation.on('tick', () => {
    // Clamp nodes inside their box
    nodes.forEach(d => {
      d.x = clamp(d.x, d.boxX + NODE_R + 4, d.boxX + d.boxW - NODE_R - 4);
      d.y = clamp(d.y, d.boxY + PAD_TOP + NODE_R, d.boxY + d.boxH - NODE_R - 4);
    });

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}


/* ── Hash Routing ───────────────────────────────────────────────────────── */
function attachHashRouting() {
  window.addEventListener('popstate', () => {
    navigateTo(getCurrentHash() || 'home');
  });
}

function getCurrentHash() {
  return window.location.hash.replace('#', '') || null;
}

/* ── Mobile Menu ────────────────────────────────────────────────────────── */
function attachMenuToggle() {
  const btn = document.getElementById('menu-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (btn) btn.addEventListener('click', () => toggleSidebar());
  if (overlay) overlay.addEventListener('click', () => closeSidebar());
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}

/* ── Clock ──────────────────────────────────────────────────────────────── */
function updateClock() {
  const el = document.getElementById('topbar-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) + ' ET';
}
