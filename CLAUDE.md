## Agent Workflow
When a prompt asks to add a feature, fix a bug, or add tests:
1) Review the relevant files and ensure full understanding.
2) Write the plan in `plan.md` before changing any code.
3) Break the plan into small, verifiable steps.
4) Remove ambiguities and assumptions; make the plan explicit.
5) If unsure, ask clarifying questions instead of guessing.
6) Share the plan and wait for user feedback before implementation.

## Core Framework & Technologies

- **React 18**
- **React Router 6**: Powers the client-side routing
- **TypeScript**: Type safety is built-in by default
- **Vite**: Bundling and development server
- **Vitest**: For testing
- **TailwindCSS 3**: For styling

## Routing System

The routing system is powered by React Router 7:

- Routes are defined in `src/App.tsx` using the `react-router-dom` import
- Route files are located in the `src/pages/` directory
- There are two ways for users to navigate the routes, a side menu on desktop view and a bottom sheet on mobile view.

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

## Styling System

The styling system combines several technologies:

- **TailwindCSS 3**: Used as the primary styling method with utility classes
- **tailwind.config.ts**: Used to describe the design system tokens, update this file to change the whole look and feel
- **CSS Imports**: Base styles are imported in `src/index.css`
- **UI Component Library**: A comprehensive set of pre-styled UI components in `src/components/ui/` built with:
  - Radix UI: For accessible UI primitives
  - Class Variance Authority: For component variants
  - TailwindCSS: For styling
  - Icônes: For icons
  - Lots of utility components, like carousels, calendar, alerts...
- **Class Name Utility**: The codebase includes a `cn` utility function from `@/lib/utils` that combines the functionality of `clsx` and `tailwind-merge`. Here's how it's typically used:

  ```typescript
  // A complex example showing the power of the cn utility
  function CustomComponent(props) {
    return (
      <div
        className={cn(
          // Base styles always applied
          "flex items-center rounded-md transition-all duration-200",

          // Object syntax for conditional classes - keys are class names, values are boolean expressions
          {
            // Size-based classes
            "text-xs p-1.5 gap-1": props.size === "sm",
            "text-base p-3.5 gap-3": props.size === "lg",

            // Width control
            "w-full": isFullWidth,
            "w-auto": !isFullWidth,
          },

          // Error state overrides other states
          props.hasError && "border-red-500 text-red-700 bg-red-50",

          // User-provided className comes last for highest precedence
          props.className
        )}
      />
    );
  }
  ```

The styling system supports dark mode through CSS variables and media queries.

## Testing

- **Unit Testing Utilities**: Utility functions such as `cn` in `src/lib/utils.ts` are covered by dedicated unit tests in `src/lib/utils.spec.ts`.
- **Testing Framework**: Tests are written using [Vitest](https://vitest.dev/), which provides a Jest-like API and fast performance for Vite projects.
- **Adding More Tests**: Place new utility tests in the same directory as the utility, using the `.spec.ts` suffix.

## Development Workflow

- **Development**: `npm run dev` - Starts the development server with HMR
- **Production Build**: `npm run build` - Creates optimized production build
- **Type Checking**: `npm run typecheck` - Validates TypeScript types
- **Run tests**: `npm test` - Run all .spec tests

## Architecture Overview

The architecture follows a modern React application structure:

```
package.json
app/
├── components/     # Reusable UI components
│   └── ui/         # Core UI component library
├── routes/         # Route components and logic
├── app.css         # Global styles
├── root.tsx        # Root layout and error boundary
└── routes.ts       # Route configuration
```

This structure provides a clean separation of concerns between UI components, routes, and application logic.

The followings are the project business knowledge:
- When I ask you to make adjustments on the Dashboard, review the file at "src/pages/Dashboard.tsx" first
- When I ask you to make adjustments on the Transactions page, review the file at "src/pages/Transactions.tsx" first
- When I ask you to make adjustments on the Reports page, review the file at "src/pages/Reports.tsx" first
- When I ask you to make adjustments on the Categories page, review the file at "src/pages/Categories.tsx" first
- When I ask you to make adjustments on the More page, review the file at "src/pages/More.tsx" first
- When I ask you to make adjustments on the Recurring Transactions page, review the file at "src/pages/RecurringTransactions.tsx" first
- When you want to use the Playwright MCP server, open the "http://localhost:8080" address. The app is running there. If you need to login, use the credentials UI_TEST_EMAIL as username and UI_TEST_PASSWORD as password from the environment variables.
- There is a core component called, the quick expense modal. This modals responsibility is to give a quick way of tracking expenses to the user. The quick expense modal has three predefined categories: Food, Health, Household. When a user adds a transaction using one of these categories but doesn't have the category defined, the modal creates the category first and then creates the transaction. 