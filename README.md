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
The MLB tab requires the two public Supabase variables from `.env.example`. Copy them into an ignored `.env.local`; never add database passwords or service-role keys to Vite.

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
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (public browser credentials)

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

### MLB tab and Supabase

The `#mlb` route renders `src/app/mlb/App.tsx`; this is the only MLB frontend. Collection and aggregation live in `/Users/scott/project/mlb_trends`. The browser reads the exposed **`mlb`** schema of Supabase project `rsyeiwzoijdojbawpgrd`.

All MLB queries live in `src/app/mlb/data.ts`. The shared public client is `src/app/utils/supabase.ts`. Other future apps can reuse the client while selecting their own schema explicitly. Schemas, table privileges and RLS must be configured separately for each app.

- Playoff Positions: `mlb.playoff_batters`, `mlb.playoff_pitchers`, and related `mlb.pitcher_windows`; four time windows, team/league/position filters, ERA/IP and selected-player details.
- Player Position: `mlb.qualified_players`, loaded by season (2022–2026) with explicit pagination.
- Rolling Offense: `mlb.rolling_teams` metadata and `mlb.rolling_series` for only the two selected teams, over `mlb.rolling_team_windows`. Regular-season rolling windows and postseason-only cumulative values remain separate.

Queries deduplicate concurrent requests and cache results for five minutes; errors show Retry. There is no static-data fallback. Old bundled JSON and public season files have been removed. Local export/reference copies remain in `mlb_trends/data/web`.

Data loaded at **2026-10-05T06:52:52.335243+00:00**. Full table/column mapping, row counts and load provenance are in `/Users/scott/project/supabase_for_front_end.md`, `mlb_trends/data_format.md`, and `mlb_trends/docs/supabase-load-receipt.json`. Refresh with the data project's `scripts/load_supabase.py` after its export pipeline. Data updates become visible without rebuilding the website, subject to the five-minute browser cache.

### GitHub Pages configuration

The live site uses remote `portfolio` (`CharlieDoesntSurf/ScottMarshallPortfolio`); `origin` points to a different repository. `.github/workflows/pages.yml` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **repository Actions variables**, checks that both exist, and supplies them at build time. These public variables are configured on the deployment repository. The local `.env.local` is ignored and never uploaded. The Supabase frontend is deployed by the GitHub Pages workflow when this change is pushed to `portfolio/main`.

### Local verification

The current dev server is http://127.0.0.1:5174/#mlb (5173 was occupied); production preview is http://127.0.0.1:4173/#mlb. Five fresh Chrome contexts measured median initial charts at 0.831 s, first rolling view at 0.855 s, and cached rolling revisits at 0.061 s. Live Supabase adds latency compared with local static files; rolling payload size fell about 81%. See `mlb_trends/docs/validation/supabase-browser-report.json` for conditions and individual measurements.


## FitCoach (In Dev)

The portfolio's `#fitcoach` tab embeds the actual FitCoach web/phone UI in a separate, same-origin HTML entry (`fitcoach/index.html`). This keeps its styles isolated from the portfolio's other apps. Vite builds both entries; GitHub Pages serves the complete static demo without an extra server.

The UI snapshot lives in `src/fitcoach`, adapted from `/Users/scott/project/Fitnesstrackingapp`. The visitor can explore 1,324 exercises and 13 starter templates, view demonstrations/instructions, create workouts/custom exercises, record and correct sets, complete the interview and run the offline coach preview. Demo edits are saved only under `fitcoach.portfolio.workspace.v1` in the visitor's browser. The banner and save indicators describe this accurately. The connected localhost app remains in its separate repository; its database server, credentials, private bucket URLs and user records are not included here.

`public/fitcoach/catalog.json` contains public upstream exercise/template data only. Media uses the pinned upstream CDN URLs already used by openGym; license and provenance notices are in `public/fitcoach/legal`. `scripts/export-fitcoach-catalog.mjs` regenerates this public-only snapshot from the prepared source import on the development machine; it is not run by CI. The source revision is `ce30c7304bdeb66a6eb4a3d14821a06035523b06`.

The prebuild step packages a standalone, buildable copy of the FitCoach demo in `public/fitcoach/source.zip`, linked from the demo footer. It includes the demo source, public catalog, license notices and build configuration, with no environment files. Regenerate by running `npm run build`. Update the embedded copy deliberately when the connected application changes.
