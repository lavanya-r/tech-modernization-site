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
      { id: 'workproducts', label: 'Work Products',         icon: '◑',  file: 'content/11-workproducts.yaml' },
      { id: 'roles',        label: 'Roles',                 icon: '◈',  file: 'content/roles.yaml' },
      { id: 'artifact-graph', label: 'Artifact Flow Graph', icon: '⬡',  file: 'content/11-workproducts.yaml' },
    ]
  },
  {
    label: 'Management',
    items: [
      { id: 'governance',   label: 'Governance',            icon: '⬡',  file: 'content/05-governance.md' },
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

  // Check cache — graph page must re-init D3 every time (DOM is recreated)
  if (MD_CACHE[cacheKey] && item.id !== 'artifact-graph') {
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
    let html;
    if (isYaml) {
      const data = jsyaml.load(text);
      html = await renderYaml(item.id, data);
    } else {
      html = marked.parse(text);
    }
    MD_CACHE[cacheKey] = html;
    container.innerHTML = `<div class="md-content">${html}</div>`;
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
  if (id === 'phases') return renderPhases(data);
  if (id === 'workproducts') return await renderWorkproducts(data);
  if (id === 'roles') return await renderRoles(data);
  if (id === 'artifact-graph') return renderArtifactGraph(data);
  // Generic fallback: pretty-print as a <pre> block
  return `<h1>${data.title || id}</h1><pre class="yaml-raw">${jsyaml.dump(data)}</pre>`;
}

function renderPhases(data) {
  const phases = data.phases || [];

  let html = `
    <div class="yaml-page-header">
      <h1>${data.title}</h1>
      <p class="yaml-description">${data.description || ''}</p>
    </div>
    <div class="phase-timeline">`;

  phases.forEach(phase => {
    const activitiesHtml = (phase.activities || [])
      .map(a => `<li>${a}</li>`).join('');
    const deliverablesHtml = (phase.deliverables || [])
      .map(d => `<li>${d}</li>`).join('');
    const exitHtml = (phase.exit_criteria || [])
      .map(e => `<li>${e}</li>`).join('');

    // Optional: modernization strategy table
    let strategyHtml = '';
    if (phase.modernization_strategies) {
      const rows = phase.modernization_strategies
        .map(s => `<tr><td>${s.strategy}</td><td>${s.applications}</td><td>${s.percentage}</td></tr>`)
        .join('');
      strategyHtml = `
        <div class="phase-section">
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
        <div class="phase-section">
          <h4>Data Domains</h4>
          <ol>${items}</ol>
        </div>`;
    }

    html += `
      <div class="phase-card">
        <div class="phase-card-header">
          <div class="phase-number">Phase ${phase.number}</div>
          <div class="phase-title-block">
            <h2 class="phase-name">${phase.name}</h2>
          </div>
        </div>
        <p class="phase-objective">${phase.objective}</p>
        <div class="phase-grid">
          ${activitiesHtml ? `<div class="phase-section"><h4>Key Activities</h4><ul>${activitiesHtml}</ul></div>` : ''}
          ${deliverablesHtml ? `<div class="phase-section"><h4>Deliverables</h4><ul>${deliverablesHtml}</ul></div>` : ''}
        </div>
        ${strategyHtml}
        ${domainsHtml}
        ${exitHtml ? `<div class="phase-exit"><h4>Exit Criteria</h4><ul>${exitHtml}</ul></div>` : ''}
      </div>`;
  });

  html += `</div>`;
  return html;
}

async function renderWorkproducts(data) {
  // Build artifact lookup map: id → name
  const artifactMap = {};
  (data.artifacts || []).forEach(a => { artifactMap[a.id] = a.name; });

  // Fetch and build a phase lookup map from 04-phases.yaml
  let phaseMap = {};
  try {
    const res = await fetch('content/04-phases.yaml');
    if (res.ok) {
      const phasesData = jsyaml.load(await res.text());
      (phasesData.phases || []).forEach(p => { phaseMap[p.id] = p; });
    }
  } catch (_) { /* phases data unavailable — phase links will degrade gracefully */ }

  // Fetch and build a roles lookup map: role-id → role name
  let roleMap = {};
  try {
    const res = await fetch('content/roles.yaml');
    if (res.ok) {
      const rolesData = jsyaml.load(await res.text());
      (rolesData.roles || []).forEach(r => { roleMap[r.id] = r.name; });
    }
  } catch (_) { /* roles data unavailable — owner will display as plain text */ }

  const categories = data.categories || [];

  let html = `
    <div class="yaml-page-header">
      <h1>${data.title}</h1>
      <p class="yaml-description">${data.description || ''}</p>
    </div>`;

  categories.forEach(cat => {
    html += `
      <div class="wp-category">
        <div class="wp-category-header">
          <span class="wp-category-icon">${cat.icon}</span>
          <h2 class="wp-category-name">${cat.name}</h2>
        </div>
        <div class="wp-grid">`;

    (cat.workproducts || []).forEach(wp => {
      // Resolve artifact IDs → names
      const resolveArtifacts = (ids) =>
        (ids || []).map(id => artifactMap[id]
          ? `<li><span class="art-id">${id}</span> ${artifactMap[id]}</li>`
          : `<li><span class="art-id">${id}</span> ${id}</li>`
        ).join('');

      const inputsHtml  = resolveArtifacts(wp.input_artifacts);
      const outputsHtml = resolveArtifacts(wp.artifacts);

      // Resolve phase_id → phase name , with a nav link to the phases page
      const phase = phaseMap[wp.phase_id];
      const phaseHtml = phase
        ? `<a class="wp-phase-link" href="#phases" onclick="event.preventDefault();navigateTo('phases');history.pushState(null,'','#phases');">
             Phase ${phase.number}: ${phase.name}
           </a>`
        : `<span class="wp-phase-link">${wp.phase_id || ''}</span>`;

      // Resolve owner role-id → display name with link to roles page
      const ownerName = roleMap[wp.owner] || wp.owner;
      const ownerHtml = roleMap[wp.owner]
        ? `<a class="wp-owner-link" href="#roles"
             onclick="event.preventDefault();navigateTo('roles');history.pushState(null,'','#roles');"
             title="View role: ${ownerName}">${ownerName}</a>`
        : ownerName;

      html += `
          <div class="wp-card">
            <div class="wp-card-top">
              ${phaseHtml}
            </div>
            <h3 class="wp-name">${wp.name}</h3>
            <p class="wp-desc">${wp.description}</p>
            <div class="wp-owner">Owner: ${ownerHtml}</div>
            <div class="wp-io">
              ${inputsHtml ? `
              <div class="wp-io-col">
                <div class="wp-io-label wp-io-label--in">Inputs</div>
                <ul class="wp-io-list">${inputsHtml}</ul>
              </div>` : ''}
              ${outputsHtml ? `
              <div class="wp-io-col">
                <div class="wp-io-label wp-io-label--out">Outputs</div>
                <ul class="wp-io-list">${outputsHtml}</ul>
              </div>` : ''}
            </div>
          </div>`;
    });

    html += `</div></div>`;
  });

  return html;
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

/* ── Artifact Flow Graph (D3 force-directed) ────────────────────────────── */
function renderArtifactGraph(data) {
  const artifacts = data.artifacts || [];

  // ── Determine category group from id prefix ──────────────────────────────
  const GROUP_RULES = [
    { test: id => /^ART 06[45]/.test(id),  group: 'requirements',   label: 'Requirements'    },
    { test: id => /^ARC/.test(id),          group: 'standards',      label: 'Standards'       },
    { test: id => /^ART 05/.test(id),       group: 'architecture',   label: 'Architecture'    },
    { test: id => /^APP/.test(id),          group: 'design',         label: 'Design'          },
    { test: id => /^CUST/.test(id),         group: 'design',         label: 'Design'          },
    { test: id => /^art-0[34]/.test(id),    group: 'engineering',    label: 'Engineering'     },
    { test: id => /^art-042|art-043|art-044/.test(id), group: 'qa', label: 'QA'              },
    { test: id => /^ENG/.test(id),          group: 'quality-gate',   label: 'Quality Gates'   },
    { test: id => /^APP 402/.test(id),      group: 'lifecycle',      label: 'Lifecycle'       },
  ];

  const GROUP_COLORS = {
    requirements:  '#3b82f6',   // blue
    standards:     '#8b5cf6',   // violet
    architecture:  '#003a70',   // navy
    design:        '#0e7490',   // teal
    engineering:   '#065f46',   // green
    qa:            '#92400e',   // amber
    'quality-gate':'#991b1b',   // red
    lifecycle:     '#4a5568',   // grey
    unknown:       '#718096',
  };

  function getGroup(id) {
    for (const r of GROUP_RULES) if (r.test(id)) return r.group;
    return 'unknown';
  }
  function getGroupLabel(group) {
    const r = GROUP_RULES.find(x => x.group === group);
    return r ? r.label : 'Other';
  }

  // ── Build nodes ───────────────────────────────────────────────────────────
  const nodes = artifacts.map(a => ({
    id:    a.id,
    name:  a.name,
    desc:  a.desc || '',
    group: getGroup(a.id),
  }));

  // ── Build edges from artifact-level input_artifacts ───────────────────────
  const links = [];
  const nodeIds = new Set(nodes.map(n => n.id));
  artifacts.forEach(a => {
    (a.input_artifacts || []).forEach(srcId => {
      if (nodeIds.has(srcId)) {
        links.push({ source: srcId, target: a.id });
      }
    });
  });

  // Unique groups present
  const groups = [...new Set(nodes.map(n => n.group))];

  // ── Legend HTML ───────────────────────────────────────────────────────────
  const legendHtml = groups.map(g => `
    <div class="ag-legend-item">
      <span class="ag-legend-dot" style="background:${GROUP_COLORS[g]};"></span>
      <span>${getGroupLabel(g)}</span>
    </div>`).join('');

  // ── Stats ─────────────────────────────────────────────────────────────────
  const linkedCount = new Set(links.flatMap(l => [l.source, l.target])).size;
  const isolatedCount = nodes.length - linkedCount;

  // ── Container HTML ────────────────────────────────────────────────────────
  const html = `
    <div class="yaml-page-header">
      <h1>Artifact Flow Graph</h1>
      <p class="yaml-description">
        Force-directed dependency graph of all ${nodes.length} artifacts in the registry.
        Edges represent <em>input_artifact</em> relationships — an arrow points from a
        source artifact into the artifact that depends on it.
      </p>
    </div>

    <div class="ag-toolbar">
      <div class="ag-stats">
        <span class="ag-stat"><strong>${nodes.length}</strong> artifacts</span>
        <span class="ag-stat"><strong>${links.length}</strong> dependencies</span>
        <span class="ag-stat"><strong>${isolatedCount}</strong> standalone</span>
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

  // Schedule D3 initialisation after the HTML is inserted into the DOM
  requestAnimationFrame(() => initArtifactGraph(nodes, links, GROUP_COLORS));

  return html;
}

function initArtifactGraph(nodes, links, GROUP_COLORS) {
  const wrap  = document.getElementById('ag-wrap');
  const svg   = d3.select('#ag-svg');
  const tip   = document.getElementById('ag-tooltip');
  const resetBtn = document.getElementById('ag-reset-btn');
  if (!wrap || svg.empty()) return;

  const W = wrap.clientWidth  || 900;
  const H = wrap.clientHeight || 600;

  svg.attr('width', W).attr('height', H);

  // ── Arrow marker ──────────────────────────────────────────────────────────
  const defs = svg.append('defs');

  // One marker per group colour
  Object.entries(GROUP_COLORS).forEach(([grp, color]) => {
    defs.append('marker')
      .attr('id',           `arrow-${grp}`)
      .attr('viewBox',      '0 -5 10 10')
      .attr('refX',         20)
      .attr('refY',         0)
      .attr('markerWidth',  6)
      .attr('markerHeight', 6)
      .attr('orient',       'auto')
      .append('path')
        .attr('d',    'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.7);
  });

  // ── Zoom layer ────────────────────────────────────────────────────────────
  const g = svg.append('g').attr('class', 'ag-g');

  const zoom = d3.zoom()
    .scaleExtent([0.15, 4])
    .on('zoom', e => g.attr('transform', e.transform));

  svg.call(zoom);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      svg.transition().duration(400)
         .call(zoom.transform, d3.zoomIdentity);
    });
  }

  // ── Simulation ────────────────────────────────────────────────────────────
  const simulation = d3.forceSimulation(nodes)
    .force('link',   d3.forceLink(links).id(d => d.id).distance(120).strength(0.6))
    .force('charge', d3.forceManyBody().strength(-320))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(36));

  // ── Edges ─────────────────────────────────────────────────────────────────
  const link = g.append('g').attr('class', 'ag-links')
    .selectAll('line')
    .data(links)
    .join('line')
      .attr('class', 'ag-link')
      .attr('stroke', d => {
        const src = nodes.find(n => n.id === (d.source.id || d.source));
        return src ? GROUP_COLORS[src.group] : '#aaa';
      })
      .attr('marker-end', d => {
        const src = nodes.find(n => n.id === (d.source.id || d.source));
        return `url(#arrow-${src ? src.group : 'unknown'})`;
      });

  // ── Node groups ───────────────────────────────────────────────────────────
  const node = g.append('g').attr('class', 'ag-nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
      .attr('class', 'ag-node')
      .call(
        d3.drag()
          .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

  // Circle
  node.append('circle')
    .attr('r', 14)
    .attr('fill', d => GROUP_COLORS[d.group] || '#718096')
    .attr('fill-opacity', 0.15)
    .attr('stroke', d => GROUP_COLORS[d.group] || '#718096')
    .attr('stroke-width', 2);

  // ID label (inside circle)
  node.append('text')
    .attr('class', 'ag-node-id')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .text(d => {
      // Shorten ID to fit — take last token
      const parts = d.id.split(/[\s\-]/);
      return parts[parts.length - 1];
    });

  // Name label (below circle)
  node.append('text')
    .attr('class', 'ag-node-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '2.4em')
    .text(d => d.name.length > 22 ? d.name.slice(0, 20) + '…' : d.name);

  // ── Tooltip ───────────────────────────────────────────────────────────────
  node
    .on('mouseenter', (e, d) => {
      const inDeps  = links.filter(l => (l.target.id || l.target) === d.id).map(l => (l.source.name || l.source));
      const outDeps = links.filter(l => (l.source.id || l.source) === d.id).map(l => (l.target.name || l.target));
      tip.innerHTML = `
        <div class="ag-tip-id">${d.id}</div>
        <div class="ag-tip-name">${d.name}</div>
        ${d.desc ? `<div class="ag-tip-desc">${d.desc}</div>` : ''}
        ${inDeps.length  ? `<div class="ag-tip-row"><span class="ag-tip-lbl ag-tip-lbl--in">Inputs</span> ${inDeps.join(', ')}</div>`  : ''}
        ${outDeps.length ? `<div class="ag-tip-row"><span class="ag-tip-lbl ag-tip-lbl--out">Used by</span> ${outDeps.join(', ')}</div>` : ''}`;
      tip.style.display = 'block';
    })
    .on('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      let tx = e.clientX - rect.left + 14;
      let ty = e.clientY - rect.top  - 10;
      // Keep tooltip inside wrap
      if (tx + 240 > wrap.clientWidth)  tx = e.clientX - rect.left - 250;
      if (ty + 120 > wrap.clientHeight) ty = e.clientY - rect.top  - 130;
      tip.style.left = tx + 'px';
      tip.style.top  = ty + 'px';
    })
    .on('mouseleave', () => { tip.style.display = 'none'; });

  // ── Tick ──────────────────────────────────────────────────────────────────
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // ── Highlight on hover ────────────────────────────────────────────────────
  node.on('mouseenter.highlight', (e, d) => {
    const connectedIds = new Set(
      links.flatMap(l => {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        return s === d.id ? [t] : t === d.id ? [s] : [];
      })
    );
    connectedIds.add(d.id);

    node.select('circle')
      .attr('fill-opacity', n => connectedIds.has(n.id) ? 0.9 : 0.05)
      .attr('stroke-opacity', n => connectedIds.has(n.id) ? 1 : 0.2);
    node.select('.ag-node-label')
      .attr('opacity', n => connectedIds.has(n.id) ? 1 : 0.15);
    link
      .attr('opacity', l => {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        return (s === d.id || t === d.id) ? 1 : 0.05;
      });
  })
  .on('mouseleave.highlight', () => {
    node.select('circle').attr('fill-opacity', 0.15).attr('stroke-opacity', 1);
    node.select('.ag-node-label').attr('opacity', 1);
    link.attr('opacity', 0.6);
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
