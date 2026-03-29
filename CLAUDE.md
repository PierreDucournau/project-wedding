# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Structure

Monorepo — chaque service dans son propre dossier :
- `front/` — SvelteKit (Cloudflare Pages)

## Commands

Toutes les commandes front s'exécutent depuis `front/` :

```bash
cd front
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (outputs to .svelte-kit/cloudflare)
npm run preview      # Preview production build
npm run check        # Type-check with svelte-check
npm run check:watch  # Type-check in watch mode
```

VS Code : lancer le compound **Front** (F5) démarre Vite + Chrome avec sourcemaps.

No test framework is configured yet.

## Architecture

**SvelteKit** app deployed to **Cloudflare Pages** via `@sveltejs/adapter-cloudflare`.

### i18n — Paraglide

All user-facing strings are externalized. The flow:

1. Add/edit keys in `front/messages/fr.json` (source language), `en.json`, `es.json`
2. Paraglide compiles them at build/dev time into `front/src/lib/paraglide/` (auto-generated, do not edit)
3. Import messages in components: `import * as m from '$lib/paraglide/messages'` then call `m['key.name']()`
4. The active language tag comes from `languageTag()` imported from `$lib/paraglide/runtime`

All languages have a URL prefix (`/fr/`, `/en/`, `/es/`). `front/src/hooks.server.ts` detects the user's preferred language via `Accept-Language` header on first visit and redirects accordingly. `svelte.config.js` uses `createReroute(i18n)` for routing.

### Planned pages (from message keys)

- `/[lang]/` — Home: hero, date/countdown, venue, dress code, contact
- `/[lang]/faq` — FAQ
- `/[lang]/itinerary` — Day schedule
- `/[lang]/rsvp` — RSVP form (targets Cloudflare D1 via Workers)

### Cloudflare stack

- **Pages**: hosts the SvelteKit frontend (`front/wrangler.toml` → `pages_build_output_dir = ".svelte-kit/cloudflare"`)
- **D1**: planned database for RSVP submissions
- Deploy via Cloudflare Pages CI or `wrangler pages deploy` from `front/`

### Design reference

`front/moodboard.html` is a standalone HTML file with the visual design system (colors, typography, components). Consult it when building new UI.
