# Sebak Wind

Living character sheet for Sebak, a half-Uchiha shinobi dropped into Temerant.

- **Sheet:** `index.html`, served by GitHub Pages. It reads the game state from this repo and refreshes itself every 15 seconds.
- **Game state:** `data/state.json` (current sheet) and `data/log.json` (story log). See [data/README.md](data/README.md) for the format and how to update it.
- **Backstory:** [campaign/backstory.md](campaign/backstory.md).
- **Story thread rules:** [CLAUDE.md](CLAUDE.md) tells any Claude session running the game how to keep the state in step.

## Hosting

Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`. The site is then at `https://4imble.github.io/SebakWind/`.

## Validating state locally

```sh
npm install
npm run validate
```
