# TypeScript Type Issues Report

## Issue: `vi` Not Recognized in test-utils.tsx

### Problem
The IDE shows a type error: `Cannot find name 'vi'` in `src/test/test-utils.tsx`, but terminal `npm run typecheck` doesn't catch this error.

### Root Cause Analysis

#### Why Terminal TypeCheck Doesn't Catch It:
1. **TypeScript Configuration**: The `tsconfig.app.json` only includes `src` directory but may not properly handle Vitest globals
2. **Missing Vitest Types**: The `test-utils.tsx` file uses `vi` from Vitest but doesn't import it or have the proper type declarations

#### Why IDE Shows the Error:
1. **More Comprehensive Analysis**: IDEs use their own TypeScript language server that analyzes all files
2. **Missing Import**: The `vi` global is not imported in `test-utils.tsx`

### Current Setup Analysis

**Vitest Configuration** (from `vite.config.ts`):
```typescript
test: {
  globals: true,        // ✅ Enables vi globally
  environment: 'jsdom', // ✅ Correct test environment
  setupFiles: ['./src/test/setup.ts'], // ✅ Setup file exists
},
```

**Setup File** (`src/test/setup.ts`):
```typescript
import { beforeAll, beforeEach, afterEach, vi } from 'vitest'; // ✅ vi imported here
```

**Problem File** (`src/test/test-utils.tsx`):
```typescript
// ❌ Missing vi import
export const mockAuthContext: AuthContextType = {
  user: mockUser,
  login: vi.fn(), // ← vi not imported!
  logout: vi.fn(),
  // ...
};
```

### Solutions

#### Option 1: Add Missing Import (Recommended)
```typescript
// Add to src/test/test-utils.tsx
import { vi } from 'vitest';
```

#### Option 2: Use Global Types Declaration
Create `src/test/vitest-globals.d.ts`:
```typescript
import 'vitest/globals';
```

#### Option 3: Update TypeScript Config
Add vitest types to tsconfig:
```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Immediate Fix Needed

**File:** `src/test/test-utils.tsx`
**Line 18:** Add import statement
**Fix:** `import { vi } from 'vitest';`

### Why This Wasn't Caught Earlier

1. **Vitest Runtime**: During test execution, `vi` is available globally due to `globals: true` config
2. **Terminal TypeCheck**: Uses different configuration that may not include test file type checking
3. **IDE vs Terminal**: IDE performs more comprehensive type checking across all files

### Recommended Action

Add the missing import to fix the type error and ensure consistency between IDE and runtime behavior.

**Status:** 🔴 Needs immediate fix
**Impact:** High - blocks proper TypeScript checking for test files
**Effort:** Low - single import statement