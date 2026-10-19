# Game state

The character sheet (`index.html`) renders these two files. They are the single source of truth for Sebak's current state. Edit them, commit to `main`, and the sheet picks up the change within about 15 seconds; there is no separate sync step.

| File | What it holds |
| --- | --- |
| `state.json` | Sebak's sheet as it stands right now. Overwrite values in place. |
| `log.json` | Story log, one entry per beat. Append to the end; never rewrite old entries. |
| `state.schema.json`, `log.schema.json` | JSON Schemas for the two files. |

Git history is the full audit trail, so `state.json` only ever needs the present.

## Updating after a beat of play

1. Change the values that moved in `state.json` (HP, chakra, ammo, coin, items, encounter, location...).
2. Set `updated_at` to the current UTC time, e.g. `2026-10-19T18:05:00Z`.
3. Set `last_log` to one line saying what just happened or what Sebak is facing. The sheet shows it in the DM Log banner.
4. Append an entry to `log.json`: `{ "at": "<same UTC time>", "title": "<short>", "text": "<a few sentences>" }`.
5. Run `npm install && npm run validate` if you can, then commit both files together with a message describing the beat.

A GitHub Action runs the same validation on every push and PR touching `data/`, so a malformed file shows up as a red check.

## state.json fields

Fields marked *derived* are computed by the page and must **not** be stored.

| Path | Type | Notes |
| --- | --- | --- |
| `schema_version` | `1` | Bump only with a schema change. |
| `updated_at` | UTC timestamp | `YYYY-MM-DDTHH:MM:SSZ`. |
| `character.name`, `.title`, `.lineage`, `.class`, `.background`, `.alignment` | string | Header text. |
| `character.level` | integer 1–20 | Raise `vitals.proficiency_bonus` by hand when the level calls for it. |
| `vitals.hp_current`, `.hp_max`, `.hp_temp` | integer | `hp_current` may not exceed `hp_max`. Temp HP is separate. |
| `vitals.hit_die`, `.hit_dice_remaining` | string, integer | e.g. `"1d8"`, `1`. |
| `vitals.ac`, `.ac_notes` | integer, string | AC is stored, not derived (armour varies). |
| `vitals.speed` | string | e.g. `"30 ft."`. |
| `vitals.proficiency_bonus` | integer | Used for saves, skills and Alar. |
| `vitals.exhaustion` | integer 0–6 | Binder's Chills adds levels here. |
| `vitals.conditions` | string[] | e.g. `["Prone", "Poisoned"]`. Shown as badges. |
| `chakra.current`, `.max`, `.recovery` | integer, integer, string | One orb is drawn per point of `max`. |
| `alar.mental_splits`, `.notes` | integer, string | Optional `attack_bonus` / `save_dc` override the derived values. |
| `abilities.<str\|dex\|con\|int\|wis\|cha>.score` | integer | Modifier is *derived*. |
| `abilities.<key>.save_proficient` | boolean | Save bonus is *derived* (mod + proficiency if true). |
| `skills[]` | `{ name, ability, proficiency }` | `proficiency` is `none`, `proficient` or `expertise`. Bonus is *derived*; `bonus_override` forces a value. |
| `weapons[]` | `{ name, attack_bonus, damage, damage_type, properties, ammo }` | `damage` must look like `1d6+3`. `ammo` is a count or `null` for melee. Decrement it when thrown, increment when recovered. |
| `features[]` | `{ name, category, cost, status, description }` | `category`: `chakra`, `sympathy`, `trait`, `bloodline`, `other` (decides which panel it appears in). `status`: `active`, `locked`, `unknown`. Unlocking the Sharingan = change its `status` to `active` and rewrite `description`. |
| `inventory.currency` | `{ talents, jots, drabs }` | Integers. |
| `inventory.items[]` | `{ name, qty, notes }` | Remove an item when `qty` hits 0. |
| `inventory.keepsakes` | string[] | |
| `world.location`, `.time`, `.weather` | string | |
| `world.companions[]` | `{ name, role, notes }` | NPCs travelling with Sebak (employer, allies). |
| `encounter.active` | boolean | `false` hides the enemy list and shows "No active encounter". |
| `encounter.title`, `.round` | string, integer | Round 0 = surprise round. |
| `encounter.enemies[]` | `{ name, position, status, notes }` | One entry per creature. Put HP/wounds in `status` (e.g. `"Bloodied"`, `"Down"`). |
| `encounter.environment` | string[] | Heat sources, cover, terrain. |
| `last_log` | string | One line for the DM Log banner. |
| `notes` | string | Free text, not shown on the sheet. |

Derived values on the sheet: ability modifiers, saving throws, skill bonuses, initiative (DEX mod), Alar attack (INT mod + proficiency) and Sympathy DC (8 + INT mod + proficiency).
