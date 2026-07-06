# DWP Legacy Technology Debt — Modernization Program Site

A static documentation website for a large-scale Government Technology Modernization Program.  
Content is authored in **Markdown** and **YAML**, rendered client-side by [marked.js](https://marked.js.org/) and [js-yaml](https://github.com/nodeca/js-yaml).

---

## Project Structure

```
tech-modernization-site/
├── index.html                     ← Single-page application shell
├── content/                       ← All content files (source of truth)
│   ├── 01-overview.md             ← Program Overview
│   ├── 04-phases.yaml             ← Program Phases
│   ├── 05-governance.md           ← Governance
│   ├── 11-workproducts.yaml       ← Work Products + Artifact registry
│   └── roles.yaml                 ← Roles registry
├── styles/
│   └── main.css                   ← All styles (variables, layout, markdown, responsive)
├── scripts/
│   └── app.js                     ← YAML/Markdown loader, SPA navigation, D3 graph, routing
├── serve.js                       ← Optional local Node.js dev server
└── README.md
```

---

## How to Run

### Option 1 — Node.js (recommended)

```bash
node serve.js
```

Then open [http://localhost:8080](http://localhost:8080)

### Option 2 — Python

```bash
# Python 3
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080)

### Option 3 — VS Code Live Server

Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.

> **Note:** The site must be served over HTTP (not opened as a `file://` URL) because it fetches
> content files via `fetch()`. Opening `index.html` directly will cause CORS errors.

---

## Content Pages

| Route | File | Description |
|---|---|---|
| `#overview` | `content/01-overview.md` | Program Overview — scope, investment, key facts |
| `#phases` | `content/04-phases.yaml` | 5-Phase Program Lifecycle |
| `#governance` | `content/05-governance.md` | Governance Framework & KPIs |
| `#workproducts` | `content/11-workproducts.yaml` | Work Products across Architecture, Design, Engineering & QA |
| `#roles` | `content/roles.yaml` | All roles and the work products they own |
| `#artifact-graph` | `content/11-workproducts.yaml` | D3 force-directed Artifact Flow Graph |

---

## Adding / Editing Content

All content lives in the `content/` folder.

1. Open the relevant `.md` or `.yaml` file.
2. Edit using standard Markdown or YAML — no build step needed.
3. Save and reload the browser.

### Adding a New Page

1. Create a content file, e.g. `content/12-my-new-page.md`.
2. Open `scripts/app.js` and add an entry to `NAV_SECTIONS`:
   ```js
   { id: 'my-page', label: 'My New Page', icon: '★', file: 'content/12-my-new-page.md' }
   ```
3. Optionally add it to the `cards` array in `buildQuickNav()` for a home card.

---

## Technology Stack

| Component | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, flexbox — no frameworks) |
| Markdown Parser | [marked.js 12.x](https://marked.js.org/) via CDN |
| YAML Parser | [js-yaml 4.x](https://github.com/nodeca/js-yaml) via CDN |
| Graph Visualisation | [D3.js 7.x](https://d3js.org/) via CDN |
| JavaScript | Vanilla ES2020 (no build tools, no bundler) |
| Fonts | Google Fonts (Inter, JetBrains Mono) |

---

## Browser Support

Modern evergreen browsers (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+).
