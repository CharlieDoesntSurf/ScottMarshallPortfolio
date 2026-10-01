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
Use a host root URL; subdirectory hosting requires configuring Vite's base path
and the public-asset URLs. Repository imports require access to this private repo.

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
