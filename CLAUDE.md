# Sebak Wind: instructions for Claude

This repo is the live backend for Sebak's character sheet (`index.html`, served by GitHub Pages). The sheet polls `data/state.json` and `data/log.json` on `main` every 15 seconds, so those two files must always reflect the story as it stands.

## If you are running the story (DM / game master)

Keep the state files in step with play. This is part of running the game, not an optional extra.

- **After every beat that changes anything on the sheet**, update `data/state.json` and commit it to `main`. A beat might be damage or healing, a chakra point spent, a kunai thrown or recovered, coin or items gained or lost, a condition or exhaustion level, a location or time change, an enemy moving, falling or fleeing, or an encounter starting or ending.
- **Every update** also sets `updated_at` (UTC, `YYYY-MM-DDTHH:MM:SSZ`) and `last_log` (one line: what just happened or what Sebak faces now).
- **At the end of each scene or significant moment**, append an entry to `data/log.json` (`{ at, title, text }`, oldest first, never edit old entries).
- **Party members** live in `world.companions`. Track `hp_current`/`hp_max` (and `ac`, `conditions`, `down`) for anyone who can be hurt, and update them as they are hurt or healed, the same as Sebak's.
- **During combat**, keep `encounter` current: `round`, each enemy's `status`, and every token's `x`/`y` on `encounter.map` after it moves. Append every attack, spell, save or notable action to `encounter.combat_log` (who, against whom, the roll, the outcome and damage) as it happens. Set `down: true` on tokens that drop. When the fight ends, set `encounter.active` to `false` and remove `map` and `combat_log`; the scene's `log.json` entry carries the summary.
- Store only what `data/README.md` says to store. Ability modifiers, saves, skill bonuses, initiative and the Alar attack/DC are derived by the page.
- Run `npm install && npm run validate` before committing. Commit `data/` changes on their own with a short message naming the beat (e.g. `State: Sebak takes 4 damage from the crossbow bolt`).
- Commit straight to `main`; a branch or PR won't show on the sheet. Only do this once the user has said the story thread may push state updates to `main`.

The full field reference is in [data/README.md](data/README.md). Background lore is in [campaign/backstory.md](campaign/backstory.md).

## If you are changing the site or schema

- Keep `data/state.schema.json`, `scripts/validate-state.mjs`, `data/README.md` and `index.html` in agreement. A field the page reads must be in the schema and documented.
- New fields should be optional so existing state keeps validating.
- `index.html` has no build step. Keep it a single self-contained file and set game text with `textContent`, never `innerHTML`.
