# Charlie Surf text interview — 2026-11-20

Public portfolio testing uses a fixed Charlie Surf developer persona, automatically active without authentication. This is not a Supabase Auth account. Each browser has its own data; visitors do not share a record. Use invented information only. No voice, live conversations, wearable data, HealthKit, or health monitoring is connected.

Design Preview defaults to Phone. Journey starts with a conversational interview: goals and reasons → daily routine → concrete obstacles → strengths → small actions and if–then plan → editable review. Each turn uses the existing public Supabase Edge Function and OpenAI Responses, with GPTSUB1 available only on the server. Shared public quota and CORS policy are unchanged. See coach-chat.md for limits.

The interview follows [AI Behavioral Coach Onboarding](https://app.notion.com/p/41dbe0b2974f8103af93e3570f230d56) under [Coach Teddy](https://app.notion.com/p/41abe0b2974f815cb900f21fc08944d5). The user's newer text-only, fake-data, browser-local scope supersedes the brief's voice and health-data roadmap.

Teddy asks one question at a time, reflects answers, respects skips, and proposes structured fields with exact quotes and source message IDs. Values are allowlisted and bounded. Pattern hypotheses must be individually confirmed or rejected; only confirmed observations are included in ongoing Coach/Daily Focus context. Coaching summaries and actions become active only when the review is explicitly saved. The review can also save a partial profile; unknown values stay blank. The manual Journey form remains available.

Storage uses teddy.charlie-surf.workspace.v1, teddy.charlie-surf.interview.v1, teddy.charlie-surf.chat.v1 and teddy.charlie-surf.daily-focus.v1. Previous browser keys remain untouched and are not imported. Interview progress, pause state, transcript, evidence and review decisions survive reload in the same browser. Saved fitness data is not written to Supabase, and clearing browser storage removes this local data. Native iOS and cross-device persistence remain future work.

Validation: build; Journey tests; chat/interview contract tests; draft-save tests; live model reply; browser pause/reload, review and save. No fake interview answers are preloaded on the published site.
