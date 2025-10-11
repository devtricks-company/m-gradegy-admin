# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Minimal UI Next.js starter template** built with TypeScript. It's a simplified version designed to start new projects, with the expectation that developers will copy components from the full version as needed.

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode enabled
- **UI Library**: Material-UI (MUI) v5 with Emotion for styling
- **State Management**: TanStack Query (React Query) v5
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with configured instance
- **Authentication**: JWT (configurable for Firebase, Auth0, Amplify, Supabase)
- **Package Manager**: Yarn (recommended) or npm

## Commands

### Development
```bash
yarn dev          # Start dev server on port 8083
yarn dev:ts       # Start dev server with TypeScript watch mode
```

### Type Checking
```bash
yarn ts           # Run TypeScript compiler without emitting files
yarn ts:watch     # Run TypeScript compiler in watch mode
```

### Build & Production
```bash
yarn build        # Build production bundle
yarn start        # Start production server on port 8083
yarn start:out    # Serve static export from 'out' directory
```

### Code Quality
```bash
yarn lint         # Run ESLint on src/**/*.{js,jsx,ts,tsx}
yarn lint:fix     # Auto-fix ESLint issues
yarn fm:check     # Check code formatting with Prettier
yarn fm:fix       # Auto-format code with Prettier
```

### Reset/Reinstall
```bash
yarn rm:all       # Remove node_modules, .next, out, dist, build
yarn re:start     # Clean install and start dev server
yarn re:build     # Clean install and build
```

### API Client Generation (Orval)
```bash
yarn orval        # Generate API client from OpenAPI schema
yarn orval:watch  # Watch mode - regenerate on schema changes
npm run orval     # Alternative with npm
```

## Architecture

### Provider Hierarchy (Root Layout)

The app uses a nested provider structure in [src/app/layout.tsx](src/app/layout.tsx):

```
QueryProvider (TanStack Query)
  └─ AuthProvider (JWT authentication)
      └─ SettingsProvider (theme settings)
          └─ ThemeProvider (MUI theming)
              └─ MotionLazy (Framer Motion lazy loading)
```

All providers are client-side and wrap the application root.

### Authentication System

- Default method: JWT (configurable in [src/config-global.ts](src/config-global.ts))
- Auth context: [src/auth/context/jwt/auth-provider.tsx](src/auth/context/jwt/auth-provider.tsx)
- Access tokens stored in `sessionStorage` with `STORAGE_KEY`
- Session validation checks token expiry via `isValidToken()`
- Axios interceptor automatically attaches auth tokens from session
- Auth guards available in `src/auth/guard/` for protected routes

### API & Data Fetching

**Axios Configuration** ([src/utils/axios.ts](src/utils/axios.ts)):
- Base URL from `CONFIG.serverUrl` (defaults to demo API: `https://api-dev-minimal-v610.pages.dev`)
- Centralized error handling via response interceptor
- Pre-configured endpoints in `endpoints` object (auth, mail, post, product, etc.)
- `fetcher` function for TanStack Query integration

**TanStack Query Setup** ([src/lib/react-query/](src/lib/react-query/)):
- Query client configured with default options
- `example-usage.ts` demonstrates patterns for queries, mutations, optimistic updates, pagination, and infinite queries
- DevTools enabled by default in development

**Orval API Client** ([src/lib/orval/](src/lib/orval/)):
- Auto-generated type-safe API clients from OpenAPI schema at `http://localhost:5400/schema`
- Configuration: [orval.config.ts](orval.config.ts)
- Generates React Query hooks for all API endpoints
- Custom axios instance mutator: [src/lib/orval/custom-instance.ts](src/lib/orval/custom-instance.ts)
- Generated files organized by OpenAPI tags in `src/lib/orval/generated/`
- TypeScript models in `src/lib/orval/generated/model/`
- Integrates with existing axios instance (inherits auth interceptors)
- Run `yarn orval` to regenerate when API schema changes

### Routing

- Uses Next.js App Router with file-based routing
- Route paths defined centrally in [src/routes/paths.ts](src/routes/paths.ts)
- Main sections: `/auth/*` for authentication, `/dashboard/*` for dashboard
- Route utilities in `src/routes/utils.ts` and hooks in `src/routes/hooks/`

### Theme System

- MUI theme customization in `src/theme/`
- Color scheme config in [src/theme/scheme-config.ts](src/theme/scheme-config.ts)
- Theme settings persist via `SettingsProvider` with drawer component
- RTL support via `stylis-plugin-rtl`
- Custom theme creation in `src/theme/core/` (palette, typography, shadows, components)

### Layout System

- Multiple layout variants in `src/layouts/`:
  - `auth-split`: Split-screen auth layouts
  - `dashboard`: Main dashboard layout with navigation
  - `simple`: Minimal layout for basic pages
  - `core`: Shared layout components
- Navigation configs: `config-nav-dashboard.tsx`, `config-nav-account.tsx`, `config-nav-workspace.tsx`

### Components

Reusable components in `src/components/`:
- `animate`: Framer Motion wrappers
- `hook-form`: React Hook Form field components
- `settings`: Theme settings drawer
- `nav-section`: Navigation rendering
- `iconify`: Icon component using @iconify/react
- `logo`, `label`, `scrollbar`, `progress-bar`, etc.

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── auth/             # Authentication logic (context, guards, hooks, views)
├── components/       # Shared UI components
├── layouts/          # Layout components and configs
├── lib/
│   ├── orval/        # Orval API client setup
│   │   ├── generated/    # Auto-generated API clients (DO NOT EDIT)
│   │   └── custom-instance.ts  # Custom axios mutator for Orval
│   └── react-query/  # TanStack Query configuration
├── routes/           # Route definitions and utilities
├── sections/         # Page-specific sections (blank, error)
├── theme/            # MUI theme configuration
├── utils/            # Utilities (axios, formatting, helpers)
├── assets/           # Static assets
├── hooks/            # Custom React hooks
├── _mock/            # Mock data
├── config-global.ts  # Global configuration
└── global.css        # Global styles
```

### TypeScript Configuration

- Strict mode enabled with `noImplicitAny`, `strictNullChecks`
- Base URL set to `.` for absolute imports from project root
- Module resolution: Node
- Paths: Import from `src/*` directly (e.g., `import { CONFIG } from 'src/config-global'`)

### ESLint Configuration

Uses Airbnb style guide with TypeScript extensions:
- **Import sorting**: `perfectionist` plugin enforces custom import order:
  1. Styles
  2. Types
  3. Built-in/external
  4. MUI imports
  5. Routes
  6. Hooks
  7. Utils
  8. Components
  9. Sections
  10. Auth
  11. Local imports
- **Unused imports**: Auto-removed via `unused-imports` plugin
- Type imports/exports must use `type` keyword consistently

### Environment Variables

Configure in `.env`:
- `NEXT_PUBLIC_SERVER_URL`: API server URL
- `NEXT_PUBLIC_ASSETS_DIR`: Public assets directory
- Auth provider configs (Firebase, AWS Amplify, Auth0, Supabase)
- `NEXT_PUBLIC_MAPBOX_API_KEY`: For map components

## Development Notes

- **Mock Server**: By default, uses demo data from `https://api-dev-minimal-v610.pages.dev`. For local server setup, see: https://docs.minimals.cc/mock-server
- **Static Export**: Toggle via `isStaticExport` in [next.config.mjs](next.config.mjs) (currently set to `'false'`)
- **SVG Handling**: SVGs automatically processed via `@svgr/webpack` as React components
- **Node Version**: Requires Node.js 20.x
- **Port**: Development and production servers run on port **8083** by default

## Important Files to Know

- [src/config-global.ts](src/config-global.ts) - Global app configuration (auth method, server URL, etc.)
- [src/utils/axios.ts](src/utils/axios.ts) - Axios instance and API endpoints
- [src/routes/paths.ts](src/routes/paths.ts) - Centralized route definitions
- [src/app/layout.tsx](src/app/layout.tsx) - Root layout with provider tree
- [.eslintrc.js](.eslintrc.js) - ESLint rules and import ordering
- [.env](.env) - Environment configuration
- [orval.config.ts](orval.config.ts) - Orval API client generator configuration
- [tsconfig.orval.json](tsconfig.orval.json) - TypeScript config for Orval (es2020 target)

## Using Orval-Generated API Clients

### Basic Usage

Import generated hooks from the appropriate tag directory:

```typescript
import { useUsersControllerFindAll, useUsersControllerCreate } from 'src/lib/orval/generated/users/users';

function UsersPage() {
  // GET request with React Query
  const { data: users, isLoading, error } = useUsersControllerFindAll();

  // POST mutation
  const { mutate: createUser } = useUsersControllerCreate();

  const handleCreate = () => {
    createUser({
      data: { name: 'John Doe', email: 'john@example.com' }
    });
  };

  return (/* ... */);
}
```

### Available Endpoints by Tag

Generated clients are organized by OpenAPI tags:
- `access-control/` - Access control endpoints
- `app/` - App endpoints
- `auth/` - Authentication endpoints
- `azurestorage/` - Azure storage endpoints
- `categories/` - Categories endpoints
- `experience-progress/` - Experience progress endpoints
- `experiences/` - Experiences endpoints
- `highschools/` - High schools endpoints
- `organizations/` - Organizations endpoints
- `projects/` - Projects endpoints
- `school-districts/` - School districts endpoints
- `subcategories/` - Subcategories endpoints
- `universities/` - Universities endpoints
- `users/` - Users endpoints

### TypeScript Models

All TypeScript interfaces/types are in `src/lib/orval/generated/model/`:

```typescript
import type { CreateUserDto, User } from 'src/lib/orval/generated/model';
```

### Regenerating API Clients

When the backend OpenAPI schema changes:

```bash
# One-time generation
yarn orval

# Watch mode (auto-regenerate on changes)
yarn orval:watch
```

**Note**: The backend API must be running at `http://localhost:5400` for generation to work.
