# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router entrypoint lives in `src/app`, with layouts, routes, and metadata. Shared UI sits under `src/components` and page-level assemblies in `src/sections`. Feature hooks and lib utilities are in `src/hooks` and `src/lib`. Mock data for local experiments is in `src/_mock`; global themes and palette logic are under `src/theme`. Static assets belong in `public/`, while localized copy is grouped by namespace in `src/locales`.

## Build, Test, and Development Commands
Install dependencies with `yarn install` (preferred) or `npm install`. Use `yarn dev -p 8083` to run the development server. `yarn build` compiles for production and `yarn start` serves the compiled output. Quality gates include `yarn lint`, `yarn fm:check` for Prettier verification, and `yarn ts` for type checks. Generate or refresh API clients from the Orval config via `yarn orval`.

## Coding Style & Naming Conventions
We author in TypeScript and follow the ESLint AirBnB + TypeScript ruleset augmented with `eslint-plugin-perfectionist` for import order. Prettier (`prettier.config.mjs`) enforces 2-space indentation, 100-character line width, single quotes, and trailing commas. Prefer PascalCase for components, camelCase for helpers and hooks, and SCREAMING_SNAKE_CASE for constant exports. Group files by feature rather than type, mirroring the folder structure above.

## Testing Guidelines
A formal test runner is not yet wired in. When adding coverage, scaffold Jest or Vitest with React Testing Library and keep tests next to the implementation (e.g., `components/Card/Card.test.tsx`). Validate async flows with MSW or the `_mock` fixtures. Ensure critical features ship with smoke tests and document additional manual verification steps in the pull request.

## Commit & Pull Request Guidelines
Commits in this repo are short, action-oriented lines (`add filter by access`, `update student table after student create`). Continue that style: one subject line in the imperative, no trailing period, optional scope prefix (`students: refresh table`). For pull requests, include a concise summary, screenshots or recordings for UI changes, and links to Jira/issues. Note any env variables touched (`NEXT_PUBLIC_*`) and list verification steps (`yarn lint`, `yarn dev`). Request review once checks pass and Orval outputs (if regenerated) are committed.

## Configuration Notes
Runtime settings live in `src/config-global.ts` and are sourced from `.env.local`; always provide sample values or defaults when new keys are added. Keep secrets out of git and lean on `NEXT_PUBLIC_` for client-side exposure only when necessary.
