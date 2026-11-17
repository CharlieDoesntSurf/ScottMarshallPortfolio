# Coach Teddy first-use setup

Reviewed Supabase project rsyeiwzoijdojbawpgrd on 2026-11-16 using read-only schema queries. No existing personal row values were copied into defaults.

- `user_profiles`: goal, fitness level, height, availability, exercise days, equipment, motivation and other context.
- `user_profiles_context_api`: main goal, target weight/body fat, experience, equipment, time availability and preferred diet context.
- `user_measurement_log`: weight/body fat, fell-asleep/wake timestamps, sleep duration and daily ratings.
- `user_nutrition_log`: calories, protein, carbs and fat.
- `user_nutrition_targets`: targets and min/max values for calories and macros.
- No food or supplement catalog was found. Goal columns are text, not a referenced goal-options table. The app retains its four supported goal options and accepts a free-text overall goal. Diet, food restrictions and supplements are free text.
- Starter plan names: 5 × 5, Full Body, Push / Pull / Legs, Upper / Lower. These are workout templates, not nutrition recommendations.

The four-step form covers identity/intentions, training, all current Journey metrics and their targets, sleep times, and nutrition preferences. It opens for a new browser workspace. Existing workspaces can use Edit setup. No account is created. Completing setup saves through the existing browser workspace loader; it does not write to the legacy database tables. Several legacy personal-data tables have RLS disabled; database access was not expanded or changed.

Daily Check-in records explicit sleep duration separately from sleep/wake clock times (clock times alone do not determine sleep duration). Supplements are user-reported text, not recommendations. Recent daily details and saved preferences are included in the existing server-side Coach/Daily Focus context. GPTSUB1 remains server-only.
