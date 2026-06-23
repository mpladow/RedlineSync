# RedlineSync

Companion UI for the Resonance Sync Z tabletop system — a small React + Vite app.

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm (comes with Node.js)

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/mpladow/RedlineSync.git
cd RedlineSync
npm install
```

## Development

Start the dev server (Vite):

```bash
npm run dev
```

The app will be served locally (default Vite port 5173). Open the URL printed in the terminal, e.g. `http://127.0.0.1:5173`.

## Build & Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/` — application source
  - `components/` — reusable React components
  - `constants/` — extracted game data/constants
  - `utils/` — helper functions
  - `styles.css` — app styling
- `index.html` — Vite entry
- `package.json` — scripts and dependencies

## Notes

- The app persists UI state to `localStorage` under the key `redline-sync-state`.
- No tests are included yet.

## Contributing

Open an issue or submit a PR. Keep changes focused and include a short description of why the change was made.

---
Made with ❤️ — ask if you want a development checklist, tests, or CI added.