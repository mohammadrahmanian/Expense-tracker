# Expense Tracker codebase cleanup proposal

## Scope reviewed

This proposal is based on a quick structural review of the `Expense-tracker` repository, including:

- root project files such as `package.json`, `vite.config.ts`, `README.md`, deployment files, and existing planning/report documents
- `src/App.tsx`, routing, providers, and app shell setup
- `src/pages`, especially the large `RecurringTransactions.tsx` page
- `src/components`, including feature folders such as `transactions`, `recurring`, `dashboard`, `reports`, and `ui`
- `src/hooks/queries`, `src/hooks/mutations`, `src/services`, `src/contexts`, `src/types`, and `src/test`

## High-level assessment

The project already has a reasonable React/Vite structure: pages, components, hooks, services, contexts, types, and tests are separated into recognizable folders. The main cleanup opportunity is to make the feature boundaries more consistent and reduce files that mix data fetching, state management, rendering, and business logic.

The best first cleanup should focus on recurring transactions, query/mutation conventions, dependency hygiene, and documentation organization.

## Recommended target structure

Move gradually toward a feature-first structure while keeping shared UI and platform concerns separate:

```txt
src/
  app/
    App.tsx
    routes.tsx
    providers.tsx
    queryClient.ts
  components/
    ui/
    shared/
    layouts/
  features/
    auth/
    categories/
    dashboard/
    reports/
    recurring-transactions/
    transactions/
  lib/
  services/
  test/
  types/
```

Suggested feature folder shape:

```txt
src/features/recurring-transactions/
  components/
  hooks/
  services/
  types.ts
  utils.ts
  index.ts
```

This keeps domain-specific code close together while preserving `components/ui`, `components/shared`, `lib`, and `test` as shared infrastructure.

## Cleanup priorities

### 1. Split `src/pages/RecurringTransactions.tsx`

`src/pages/RecurringTransactions.tsx` is around 19 KB and currently combines:

- filter state
- dialog state
- React Query reads
- delete/toggle mutations
- derived active/inactive lists
- date formatting
- category lookup
- page layout
- card rendering
- confirmation dialogs
- create/edit dialogs

Recommended split:

```txt
src/features/recurring-transactions/
  components/
    RecurringTransactionCard.tsx
    RecurringTransactionFilters.tsx
    RecurringTransactionSections.tsx
    RecurringTransactionDialogs.tsx
  hooks/
    useRecurringTransactionFilters.ts
    useRecurringTransactionDialogs.ts
  utils.ts
  RecurringTransactionsPage.tsx
```

The page should become a thin composition layer. Filtering, dialog orchestration, and card rendering should live in focused files.

### 2. Move routing and providers out of `App.tsx`

`src/App.tsx` currently owns providers, the React Query client, route config, protected route wrapping, navigation setup, and error boundaries.

Recommended split:

```txt
src/app/queryClient.ts
src/app/providers.tsx
src/app/routes.tsx
src/app/App.tsx
```

Benefits:

- easier route changes
- easier provider testing
- cleaner app entry point
- fewer unrelated responsibilities in one file

### 3. Standardize feature boundaries

Some areas are already feature-like under `src/components`, such as `transactions`, `recurring`, `categories`, `dashboard`, and `reports`. Others live across `pages`, `hooks`, `services`, and `types`.

Recommended approach:

- keep `components/ui` for design-system primitives
- keep `components/shared` for cross-feature reusable components
- move domain-specific components, hooks, service wrappers, types, and utils into `src/features/<feature>`
- keep temporary re-export files during migration to avoid large-bang refactors

Example:

```ts
// src/features/transactions/index.ts
export { TransactionsPage } from "./TransactionsPage";
export * from "./hooks";
export * from "./types";
```

### 4. Reduce repeated React Query mutation patterns

`src/hooks/mutations` contains many similarly shaped hooks such as create/update/delete/toggle hooks. They likely repeat invalidation, toast handling, and error handling patterns.

Recommended cleanup:

- define query key factories per feature
- centralize invalidation helpers
- standardize mutation success/error behavior

Example shape:

```ts
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  detail: (id: string) => [...transactionKeys.all, "detail", id] as const,
};
```

This makes cache invalidation safer and easier to reason about.

### 5. Review dependency surface

`package.json` includes many UI, charting, animation, 3D, PWA, Sentry, and Radix dependencies. Some may be necessary, but the list is broad for an expense tracker frontend.

Recommended cleanup:

- run a dependency audit with a tool such as `depcheck` or manual import search
- confirm whether `three`, `@react-three/fiber`, `@types/three`, `highcharts`, `framer-motion`, `vite-plugin-pwa`, and all Radix packages are actively used
- remove unused packages to reduce install time, bundle size, and maintenance overhead
- group dependencies by purpose in the proposal/README if they remain intentional

### 6. Add linting scripts and enforce them in CI

The repo has ESLint-related dependencies, but `package.json` currently exposes scripts for build, test, format, and typecheck only.

Recommended additions:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint.fix": "eslint . --fix",
    "check": "npm run typecheck:all && npm run lint && npm test && npm run build"
  }
}
```

Then update CI to run the full `check` script before deployment.

### 7. Organize root-level docs

The root currently contains several docs and reports, including implementation plans and TypeScript analysis reports. This makes the root harder to scan.

Recommended cleanup:

```txt
docs/
  architecture/
  plans/
  reports/
  agents/
```

Suggested moves:

- `mobile-navigation-implementation-plan.md` -> `docs/plans/mobile-navigation-implementation-plan.md`
- `recurring-transactions-plan.md` -> `docs/plans/recurring-transactions-plan.md`
- `type-issues-report.md` -> `docs/reports/type-issues-report.md`
- `typecheck-solution-report.md` -> `docs/reports/typecheck-solution-report.md`
- `typescript-errors-analysis.md` -> `docs/reports/typescript-errors-analysis.md`

Keep `README.md`, `AGENTS.md`, and `CLAUDE.md` in root if they are entry-point documentation.

### 8. Strengthen test coverage around refactors

There is existing test setup under `src/test` and at least one sizeable component test for `TransactionForm`. Before splitting larger files, add or preserve tests around behavior that is easy to regress:

- recurring transaction filtering
- active/inactive grouping
- delete confirmation flow
- activate/deactivate flow
- transaction form validation
- auth redirect/protected route behavior

Prefer testing extracted hooks and utilities directly where possible, and use component tests only for user-visible behavior.

## Suggested phased plan

### Phase 1: Safe structure cleanup

- Move root planning/report docs under `docs/plans` and `docs/reports`
- Extract `queryClient`, `providers`, and `routes` from `App.tsx`
- Add `lint`, `lint.fix`, and `check` scripts
- Confirm the current build, typecheck, test, and format commands still pass

### Phase 2: Recurring transactions refactor

- Extract `RecurringTransactionCard`
- Extract filters into `RecurringTransactionFilters`
- Extract dialogs into `RecurringTransactionDialogs`
- Extract filtering logic into `useRecurringTransactionFilters`
- Keep the page as a composition layer
- Add tests for filtering and active/inactive grouping

### Phase 3: Feature-first migration

- Create `src/features/transactions`
- Create `src/features/recurring-transactions`
- Move domain-specific hooks, services, types, utils, and components feature by feature
- Add temporary exports to avoid large import churn
- Remove temporary exports after imports stabilize

### Phase 4: Dependency and CI hardening

- Audit unused dependencies
- Remove packages that are not imported
- Add a CI check workflow for lint, typecheck, tests, and build
- Keep deploy workflow dependent on a successful check

## Acceptance criteria

A cleanup PR should be considered successful when:

- `npm run typecheck:all` passes
- `npm test` passes
- `npm run build` passes
- `npm run lint` passes, if added
- pages remain functionally equivalent
- no unrelated visual redesign is included
- imports are simpler or at least no more complex than before
- large mixed-responsibility files are smaller and easier to review

## Recommended first PR

Start with a small, low-risk PR:

1. Create `src/app/queryClient.ts`, `src/app/providers.tsx`, and `src/app/routes.tsx`.
2. Slim down `src/App.tsx` to app composition only.
3. Move root report/plan docs into `docs/plans` and `docs/reports`.
4. Add a `check` script that combines typecheck, tests, and build.

This creates a cleaner foundation before touching the larger recurring transactions page.
