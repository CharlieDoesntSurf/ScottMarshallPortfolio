# Coach Teddy text chat

The Coach tab calls the `coach-teddy-chat` Supabase Edge Function without sign-in during this testing phase, per the user's instruction. The endpoint is public; CORS limits browser origins but is not authentication. Do not describe it as owner-only or private access. API credentials remain server-side.

Server secrets: `GPTSUB1` and `TEDDY_MODEL` (`gpt-4.1-mini`). Public frontend configuration: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The earlier account UI is removed. Existing Supabase users are unchanged.

The function calls OpenAI Responses with `store:false` and structured output. It sends up to 39 recent messages, the local training profile, current metrics/goals, and the five most recent workouts. There are no model tools, voice sessions, image inputs, or automatic workout/goal mutations.

Explicit measurements from the latest message can update browser-local Journey history. Bounds and exact evidence quotes are validated on the server, and bounds are validated again by the client. Goals, hypothetical examples and ambiguous units must not become measurements. Logging is visible with an Undo control; users can also correct values through Journey or the Overview detail panel. This uses model extraction and is not guaranteed error-free.

Chat history is browser-local under teddy.charlie-surf.chat.v1, capped at 40 messages. Earlier account-scoped history is retained in storage but not loaded into the anonymous demo. Metrics/workouts use the separate Charlie Surf browser-local workspace. See charlie-surf-interview.md for the interview and current demo identity. There is no Supabase fitness-data write and no cross-device sync in this iteration. Existing database RLS issues are not resolved by chat authentication. Keep personal information out of the old public data tables until those permissions are repaired.

Requests are limited to 64KB, model output to 1,400 tokens, and upstream time to 45 seconds. An atomic server-only SQL quota permits 12 requests/minute and 100/day (UTC), shared across all visitors and Edge instances. The quota fails closed and records only aggregate counts, never messages or identities. Anonymous callers cannot read or modify it. This limits spend but does not restrict access to one person.

All six Journey cards now reuse the Overview detail drawer, including auto-saving Current/Goal fields and 90-day charts. Both pages share the same local values.

Validation: npm run test:chat, npm run test:journey, npm run test:interview, npm run build; TypeScript checks; transactional minute/day quota assertions; browser message/metric logging and Journey drawer checks.
