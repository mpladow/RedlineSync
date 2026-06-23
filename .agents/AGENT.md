## RedlineSync Agent Guide

### Project context
- **Repo name**: `RedlineSync`
- **Purpose**: A React + Vite helper app for the Iron Colossus tabletop system. It manages focus allocation, weapon loadouts, heat tracking, handler calls, and damage markers.
- **Tech stack**: React, Vite, vanilla CSS, Lucide icons.
- **Primary source**: `src/main.jsx` and reusable component modules in `src/components/`.
- **Data layer**: game constants live in `src/constants/`; component logic should avoid duplicating the same data.

### Key commands
- `npm install` — install dependencies
- `npm run dev` — start the local Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally

### Agent quality and style guards
- **Keep changes small and targeted**: prefer minimal fixes over broad rewrites.
- **Respect existing app structure**: keep UI logic in components, constants in `src/constants`, helpers in `src/utils`, and hooks in `src/hooks`.
- **Preserve formatting and conventions**: use existing React/JS style, indentation, and string quoting.
- **No new dependencies unless necessary**: if a new package is proposed, explain why it is required and keep it lightweight.
- **Avoid breaking runtime behavior**: confirm the app still builds and starts successfully after edits.
- **Prefer explicit imports** over wildcard or dynamic module loading.
- **Don’t expose secrets** in code, logs, or generated content.

### Review expectations
- Verify main app flow after changes: component rendering, state persistence, and modal behavior.
- For refactors, keep existing behavior and use consistent naming for props and callbacks.
- If a new hook or utility is added, place it in `src/hooks/` or `src/utils/` and import it from consuming modules.
- Mention any assumptions made when the repo context is not explicit.

### Useful file references
- `src/main.jsx` — entrypoint and app composition
- `src/components/` — reusable UI components
- `src/constants/` — static game data
- `src/hooks/useLocalStorage.js` — state persistence helper
- `package.json` — dev scripts and dependencies
