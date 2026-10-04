# Scott Marshall Portfolio

Personal website built with React, Vite, and Tailwind, based on a Figma Make export.
Includes Welcome, Resume, Tool Belt, My Projects, Agent Structure, ML App,
Model Overview, and Agent Design.
Original design: https://www.figma.com/design/lN5wYNwD2todBaHaGGbHHy/GPT-Model-Overview-Page

## Local development

Use Node.js 22 or newer and npm.

```bash
cd /Users/scott/project/personal
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Open http://127.0.0.1:5173. Vite reloads the preview when source files change.
This runs the exported application locally; Figma Make's AI editor is not included.
No API keys or database connection are required for the current application.

## Production build

```bash
npm run build
```

The generated website is in `dist/`.

## Import and hosting settings

- Framework: Vite / React
- Node.js: 22 or newer
- Install command: `npm ci`
- Build command: `npm run build`
- Publish/output directory: `dist`
- Environment variables: none required

Navigation uses URL hashes, so the host does not need route rewrites.
The site includes the resume PDF and locally stored tool logos in `public/`.
Relative asset paths support both root URLs and GitHub Pages project URLs.
GitHub Pages uses `.github/workflows/pages.yml` to build and deploy `dist`;
select GitHub Actions as the Pages source, not a branch folder. Repository imports require access to this private repo.

## Agent Design

The **Agent Design** navigation tab retains its `#benchmark-eval` URL and adapts
the application from https://github.com/CharlieDoesntSurf/BenchmarkEval.
Its independent local checkout is `/Users/scott/project/BenchmarkEval`.

The original import came from commit
`fc132703a80cf8a44816cbb9dd3292ef19e471ae`. The site now has six agent-design
sections in `src/app/components/AgentDesignSteps.tsx`: model selection,
connection, prompts, output, data injection, and tools. The architecture diagram
in `src/app/components/AgentArchitecture.tsx` connects five inputs to an example
GPT-6 Astra model and branches to five outputs. Every card links to the related
section; the model's API link opens the connection section. Model reference:
https://developers.openai.com/api/docs/models/gpt-6-astra (checked September 30, 2026).
Scoped layout styles live in `src/styles/benchmark-eval.css`.
The tab is loaded on demand and requires no second server or dependency tree.

To update the embedded app, pull the independent checkout, compare shared
components and styles, and merge deliberately into the adapted screen rather
than overwriting the agent-design work. The website is
self-contained and does not import files from the sibling checkout.

This is a guide for the agent we will build. Connection and tool examples are
illustrative; they do not execute model requests or tool calls.

## Tool Belt

The Tool Belt tab keeps the existing `#experience` route. Entries and proficiency
levels live in `src/app/data/tool-belt.json`. Fluent levels come from the user's
list; Some Experience combines the user's list, resume, and GitHub project
stacks. Each entry includes its source; a declared repository dependency is
treated as exposure, not proof of proficiency. C++ was normalized from the
request using the resume. Local brand assets and attribution are in
`public/tool-logos/`; Palantir products share the family mark, and missing marks
use text monograms.

## Export compatibility

Dependencies retain the export versions except for security updates to Vite 6.4.3
and React Router 7.18.4. React and React DOM are installed
as runtime dependencies. Vite aliases resolve Figma Make's version-suffixed imports
to the installed npm packages, and the asset resolver supports `figma:asset/` imports.

### MLB tab

The `#mlb` route renders native React components in `src/app/mlb/`. This is the only MLB frontend; there is no iframe, second application, or runtime dependency on a sibling server. MLB styles are scoped to `.mlb-app`.

The Playoff teams view shows confirmed 2026 opening-series roster batters with one OPS window at a time (Season by default). Team multiselect, league, and position filters compose. OPS above 1.000 uses one fifth of the usual vertical scale, visibly marked on the chart: 1.000–2.000 has the same height as .800–1.000. The By position view retains qualified players from 2022–2026 and its linear scale.

CSV collection lives in the sibling `mlb_trends` repository. Run its `scripts/build_playoff_rosters.py`, then `scripts/export_web_data.py` to refresh this repository's bundled JSON, followed by `npm run build` here. All hitting statistics are regular-season only. The roster snapshot is each team's first playoff game date, rather than a union of later rounds.

The playoff view places pitcher ERA beside batter OPS, sharing the time-window, team, league, and season filters. Pitcher role and batting position filters are independent. ERA is the default pitching metric; users can switch to innings pitched. Labels include baseball-notation IP, and player details show ERA, IP, appearances, and starts. The pitching scale is linear. Charts stack on small screens. Refresh pitching CSVs with `mlb_trends/scripts/build_playoff_pitching.py` before the shared JSON export.

### MLB rolling trends

The MLB **Rolling trends** view supports one playoff team at a time for 2022–2026 (12 teams per year). Four colors represent 10-, 30-, 90-game and season-to-date windows; OPS is solid and AVG dashed. The eight regular-season lines converge at the postseason boundary into two postseason-only cumulative lines. Hover for exact values, or expand the game-by-game table. Actual completed game counts determine the boundary. Current 2026 postseason coverage runs through October 3.

Chart data is served from `public/mlb-trends/{year}.json`, loaded only for the selected year. The CSV pipeline lives in `mlb_trends/scripts/build_rolling_batting.py`, with source reconciliation in `build_rolling_roster_cohort.py` and checks in `validate_rolling_batting.py`. Full-team totals include all hitters; separate player exports retain opening-series roster members and include missed games in rolling windows. Earlier-club regular-season stats are aligned to the playoff club's game intervals. Rates are calculated from summed counts, and undefined rates remain missing. This retrospective roster selection is descriptive and must be accounted for when evaluating predictive models.
