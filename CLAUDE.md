# Sebak Wind: instructions for Claude

This repo is the live backend for Sebak's character sheet (`index.html`, served by GitHub Pages). The sheet polls `data/state.json` and `data/log.json` on `main` every 15 seconds, so those two files must always reflect the story as it stands.

## If you are running the story (DM / game master)

Keep the state files in step with play. This is part of running the game, not an optional extra.

- **After every beat that changes anything on the sheet**, update `data/state.json` and commit it to `main`. A beat might be damage or healing, a chakra point spent, a kunai thrown or recovered, coin or items gained or lost, a condition or exhaustion level, a location or time change, an enemy moving, falling or fleeing, or an encounter starting or ending.
- **Every update** also sets `updated_at` (UTC, `YYYY-MM-DDTHH:MM:SSZ`) and `last_log` (one line: what just happened or what Sebak faces now).
- **At the end of each scene or significant moment**, append an entry to `data/log.json` (`{ at, title, text }`, oldest first, never edit old entries).
- **Party members** live in `world.companions`. Track `hp_current`/`hp_max` (and `ac`, `conditions`, `down`) for anyone who can be hurt, and update them as they are hurt or healed, the same as Sebak's.
- **During combat**, keep `encounter` current: `round`, each enemy's `status`, and every token's `x`/`y` on `encounter.map` after it moves. Append every attack, spell, save or notable action to `encounter.combat_log` (who, against whom, the roll, the outcome and damage) as it happens. Set `down: true` on tokens that drop. When the fight ends, set `encounter.active` to `false` and remove `map` and `combat_log`; the scene's `log.json` entry carries the summary.
- **When the player asks to note something down**, append it to `player_notes` (`{ title, text, at }`) so it shows on the sheet's Notes tab.
- Store only what `data/README.md` says to store. Ability modifiers, saves, skill bonuses, initiative and the Alar check/DC are derived by the page.
- Run `npm install && npm run validate` before committing. Commit `data/` changes on their own with a short message naming the beat (e.g. `State: Sebak takes 4 damage from the crossbow bolt`).
- Commit straight to `main`; a branch or PR won't show on the sheet. Only do this once the user has said the story thread may push state updates to `main`.

### Rules of Sympathy

As in *The Name of the Wind*, sympathetic bindings follow three principles. Apply them when ruling on any binding:

1. **The Doctrine of Correspondence:** similarity increases sympathy.
2. **The Principle of Consanguinity:** a piece of a thing can represent the whole of the thing.
3. **The Law of Conservation:** energy is neither created nor destroyed. Every binding needs a source (fire, motion, body heat or chakra), and what isn't transferred is lost as slippage.

Standing rulings:
- Iron to iron (for example, Sebak's iron nails to an iron-shod club) is a **Good** link under Correspondence and Consanguinity.
- The blood/hair clause in the Good link tier applies only to organic targets.
- Setting up a binding is always a **bonus action**, whatever the link quality. A weak link is less efficient, not slower, and there is no "complex binding" that costs more. Maintaining an established binding costs no action but occupies Sebak's one mental split. Body Flicker is also a bonus action, so it's one or the other each turn.
- Bindings are not attack rolls, so they never "miss" against AC. Setting one up is an **Alar check**: d20 + INT + proficiency, plus Sebak's WIS modifier when he is focused. He loses the WIS bonus if he took damage or was grappled since his last turn, and rolls with advantage after a calm round of preparation.
- The Alar check DC is set by the link: **Perfect 8, Good 11, Poor 15**. The margin decides efficiency and slippage. A failed check means heavy slippage and a partial effect, not a clean miss.
- When a binding acts on a person (for example, heating their clothes), they make a save against Sebak's **Sympathy DC** (8 + INT + proficiency, 13 at level 1).
- Backlash and Binder's Chills are resisted with a **CON save** (DC 10 + the energy level drawn).

The full field reference is in [data/README.md](data/README.md). Background lore is in [campaign/backstory.md](campaign/backstory.md), which the sheet shows on its Character tab.

## If you are changing the site or schema

- Keep `data/state.schema.json`, `scripts/validate-state.mjs`, `data/README.md` and `index.html` in agreement. A field the page reads must be in the schema and documented.
- New fields should be optional so existing state keeps validating.
- `index.html` has no build step. Keep it a single self-contained file and set game text with `textContent`, never `innerHTML`.
