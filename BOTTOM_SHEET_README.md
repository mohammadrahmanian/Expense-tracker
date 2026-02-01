# Responsive Bottom Sheet Implementation

## Overview

All modals in the application now automatically display as bottom sheets on mobile devices while maintaining the traditional centered modal experience on desktop.

## What was implemented

### 1. Responsive Dialog Component (`src/components/ui/responsive-dialog.tsx`)

- **Desktop**: Centered modal with zoom animations
- **Mobile**: Bottom sheet with slide-up animations
- **Features**:
  - Drag indicator on mobile
  - Safe area inset support for devices with notches
  - Maximum height of 85vh on mobile with scrolling
  - Smooth animations with custom CSS keyframes

### 2. Updated Components

- ✅ **QuickExpenseModal** (FAB modal)
- ✅ **TransactionForm** (in Transactions page)
- ✅ **CategoryForm** (in Categories page)

### 3. Custom Animations

Added to `src/index.css`:

- `slide-in-from-bottom` - Smooth slide up animation
- `slide-out-to-bottom` - Smooth slide down animation
- Mobile safe area support

## Usage

Replace regular Dialog imports with responsive versions:

```tsx
// Before
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// After
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
```

## Mobile Experience Features

- 📱 **Bottom Sheet**: Slides up from bottom on mobile
- 📏 **Drag Indicator**: Visual cue for users
- 🔒 **Safe Areas**: Respects device notches and home indicators
- 📜 **Scrollable**: Handles long content gracefully
- ⚡ **Smooth Animations**: Custom CSS animations for better UX
- 🎯 **Touch Friendly**: Optimized for mobile interaction

## Desktop Experience

- 🖥️ **Centered Modal**: Traditional modal experience
- 🎨 **Zoom Animations**: Smooth scale-in/out transitions
- 📐 **Max Width Control**: Responsive sizing with `sm:max-w-*` classes

## Testing

To test the responsive behavior:

1. Open the app in browser
2. Use browser dev tools to toggle device simulation
3. Try opening modals in different viewport sizes
4. Test the FAB (floating action button) for quick expense entry
