# Coach Teddy text chat

The Coach tab calls the `coach-teddy-chat` Supabase Edge Function, which authenticates the bearer token through Supabase Auth and permits only `TEDDY_OWNER_ID`. The gateway JWT toggle is off because the function performs its own token validation, including support for current signing keys. Anonymous and other-user access is denied before model calls.

Server secrets: `GPTSUB1` (the user-selected credential), `TEDDY_OWNER_ID`, and `TEDDY_MODEL` (`gpt-4.1-mini`). Never expose these in Vite variables. Public frontend configuration: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Configure the exact `/fitcoach/` URL in Supabase's Auth redirect allowlist. Sign-in supports existing-account password or an emailed link; the app does not create accounts.

The function calls OpenAI Responses with `store:false` and structured output. It sends up to 39 recent messages, the local training profile, current metrics/goals, and the five most recent workouts. There are no model tools, voice sessions, image inputs, or automatic workout/goal mutations.

Explicit measurements from the latest message can update browser-local Journey history. Bounds and exact evidence quotes are validated on the server, and bounds are validated again by the client. Goals, hypothetical examples and ambiguous units must not become measurements. Logging is visible with an Undo control; users can also correct values through Journey or the Overview detail panel. This uses model extraction and is not guaranteed error-free.

Chat history is browser-local and scoped by auth user ID, capped at 40 messages. Metrics/workouts retain the existing browser-local workspace. There is no Supabase data-table write and no cross-device sync in this iteration. Existing database RLS issues are not resolved by chat authentication. Keep personal information out of the old public data tables until those permissions are repaired.

Requests are limited to 64KB, model output to 1,400 tokens, and upstream time to 45 seconds. A 12/minute per-user guard is isolate-local (not a global quota). Single-owner authorization is the main spend/access boundary. A durable distributed quota is a future improvement.

Validation: `npm run test:chat`, `npm run test:journey`, `npm run test:interview`, `npm run build`. Authenticated deployment smoke test on 2026-11-15 returned a real reply and extracted sleep/energy; unauthenticated requests returned 401, foreign-origin requests 403, and invalid roles 422. Tests use synthetic measurements only. Browser sign-in must be performed by the user; email delivery was not tested by sending mail.
