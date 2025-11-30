# Plan: Fix Toast and FAB Overlap Issue

## Problem
- Notification toasts are appearing over the FAB (Floating Action Button)
- Toasts don't have a close button for manual dismissal

## Current State
- **FAB Position**:
  - Mobile: `bottom-32 right-6` (128px from bottom)
  - Desktop: `bottom-6 right-6` (24px from bottom)
  - z-index: `z-50`
  - Located in: `src/components/ui/floating-action-button.tsx`

- **Toast Implementation**:
  - Using Sonner library (from "sonner" package)
  - Configured in: `src/components/ui/sonner.tsx`
  - Currently has default positioning (bottom of screen)
  - No close button currently enabled

## Solution

### 1. Adjust Toast Positioning
**File**: `src/components/ui/sonner.tsx`

Modify the Sonner component to:
- Set the `position` prop to control toast placement
- Add bottom offset using `offset` prop to move toasts above the FAB
- On mobile: offset should be greater than 128px (FAB is at bottom-32)
- On desktop: offset should be greater than 24px (FAB is at bottom-6)
- Recommended offset: `160px` for mobile, `80px` for desktop to provide comfortable spacing

### 2. Add Close Button
**File**: `src/components/ui/sonner.tsx`

Enable the close button by:
- Adding `closeButton={true}` prop to the Sonner component
- This will add an X button to each toast notification

### 3. Implementation Details

Changes to `src/components/ui/sonner.tsx`:
```tsx
<Sonner
  theme={theme as ToasterProps["theme"]}
  className="toaster group"
  position="bottom-right"  // ADD: Explicit position
  offset="160px"           // ADD: Offset to avoid FAB on mobile
  closeButton={true}       // ADD: Close button
  toastOptions={{
    classNames: {
      toast: "...",
      // ... existing classNames
    },
  }}
  {...props}
/>
```

**Note**: We'll use a single offset value of `160px` which works well for mobile (where FAB is at 128px). On desktop, the FAB is lower (24px), so the 160px offset will provide even more comfortable spacing.

## Files to Modify
1. `src/components/ui/sonner.tsx` - Add position, offset, and closeButton props

## Verification Steps
1. Test toast notifications on mobile viewport (width < 1024px)
2. Test toast notifications on desktop viewport (width >= 1024px)
3. Verify toasts don't overlap with FAB at bottom-32 (mobile) or bottom-6 (desktop)
4. Verify close button appears and works on each toast
5. Check that multiple toasts stack properly with the new positioning

## Non-Goals
- Not changing FAB position or styling
- Not changing toast styling beyond positioning
- Not modifying toast timeout/duration behavior
