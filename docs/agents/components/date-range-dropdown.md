# DateRangeDropdown — Agent Context

Token-efficient summary. Read this before editing anything in `src/components/transactions/DateRangeDropdown/` or `src/components/transactions/DateRangeCalendarPanel/`. Only open source files when you need details beyond what's here.

## Purpose

Date filter control used on the Transactions page. Lets the user pick a preset (`Today`, `Yesterday`, `This Month`, `Last Month`) or a custom single date / date range. Renders as a Radix `Popover` on large screens and a `vaul` bottomsheet `Drawer` on small screens, so the calendar never has to squeeze below a tall item list.

## Entry point

- `DateRangeDropdown.tsx` — smart component. Props: `{ preset, startDate, endDate, onPresetChange, onCustomDateSelect, onCustomRangeSelect, variant?: "default" | "pill" }`.
- Exported via `src/components/transactions/DateRangeDropdown/index.ts`.
- The calendar UI itself is shared via `src/components/transactions/DateRangeCalendarPanel/` (used here and by `FilterDateSection` in the mobile Filters bottomsheet).

## Folder layout

```text
DateRangeDropdown/
├── index.ts                     # barrel: export { DateRangeDropdown }
├── DateRangeDropdown.tsx        # smart shell: owns the hook, reads useMediaQuery, renders the View
├── DateRangeDropdown.utils.ts   # PRESET_OPTIONS, GROUPED_PRESET_OPTIONS, getPillLabel, getPresetLabel,
│                                 # LARGE_SCREEN_QUERY, CalendarMode, DateRangePanelProps (shared bag type)
├── useDateRangeDropdown.ts      # state: open, calendarMode, pendingDate/Range, canApply, handlers;
│                                 # returns { open, panelProps, handleOpenChange, handleBack }
├── DateRangeDropdownView.tsx    # picks Popover (desktop) vs Drawer (mobile) based on isLargeScreen
├── DateRangeTrigger.tsx         # forwardRef button (asChild target for Popover/Drawer trigger)
├── DateRangePresetList.tsx      # the six preset items (day/month/custom groups)
├── DateRangeDesktopPanel.tsx    # preset list + calendar side-by-side (>=1024px)
└── DateRangeMobileSheet.tsx     # two-step bottomsheet: preset list, then calendar with back button

DateRangeCalendarPanel/          # shared calendar UI, no dropdown-specific logic
├── DateRangeCalendarPanel.tsx   # renders Calendar (single/range) + footer; mode & footer are
│                                 # discriminated unions, so callers must branch on calendarMode
├── DateRangeCalendarPanel.utils.ts  # formatDateLabel(start?, end?)
└── DateRangeFooter.tsx          # startDate/endDate label + Clear/Apply buttons ("actions" footer only)
```

## State & data flow

- All local state lives in `useDateRangeDropdown.ts`: `open`, `calendarMode` (`CalendarMode = "single" | "range" | null`), `pendingDate`, `pendingRange`, `canApply`.
- Opening the popover/drawer while `preset` is already `custom_date`/`custom_range` seeds `calendarMode` and the pending value from `startDate`/`endDate` (see `handleOpenChange`).
- Clicking a preset item: non-custom presets call `onPresetChange` and close immediately; the two custom items switch `calendarMode` and wait for `Apply`.
- `handleApply` fires `onCustomDateSelect`/`onCustomRangeSelect`, resets local state, and closes.
- `handleBack` (mobile bottomsheet only) resets `calendarMode`/pending values back to the preset list step, without closing the sheet. Internally calls the same `resetLocal` used elsewhere.
- The hook builds `panelProps` (typed `DateRangePanelProps`) as a `useMemo` bag over `useCallback`-wrapped handlers, so it is referentially stable across renders unless one of its actual inputs changes.
- `DateRangeDropdown.tsx` reads `useMediaQuery(LARGE_SCREEN_QUERY)` and passes `isLargeScreen` + `panelProps` down to `DateRangeDropdownView.tsx`, which is the component that actually picks `DateRangeDesktopPanel` (inside a `Popover`) or `DateRangeMobileSheet` (inside a `Drawer`). Both panels consume the same `DateRangePanelProps` type (`DateRangeMobileSheetProps` adds `onBack`).

## UI notes

- Breakpoint: **1024px** (`lg`), exported as `LARGE_SCREEN_QUERY` from `DateRangeDropdown.utils.ts`, consumed via `src/hooks/use-media-query.ts` — do not confuse with `useIsMobile()` in `use-mobile.tsx`, which uses 768px and is unrelated to this component.
- Desktop: `DateRangeDesktopPanel` shows `DateRangePresetList` (`w-[300px]`) and `DateRangeCalendarPanel` (`w-[280px]`) side by side; the calendar panel carries its own `border-l` (no separate divider element). The calendar only renders once `calendarMode` is set. `PopoverContent` uses `collisionPadding={16}` so the wider popover stays on screen near viewport edges.
- Mobile: `DateRangeMobileSheet` shows the preset list (with a `ChevronRight` on the two custom items instead of a checkmark) as step 1, then the calendar with a back header (`ChevronLeft` + title) as step 2. `DrawerContent` is capped at `max-h-[90dvh]`. The step heading is itself the `vaul`-required `DrawerTitle` (visible, not `sr-only`), so the accessible dialog name tracks the current step; on entering step 2 focus moves to the back button. Both mobile call sites (`DateRangeMobileSheet` and the Filters bottomsheet's `FilterDateSection`) pass `size="comfortable"` to `DateRangeCalendarPanel` for larger tap targets (16px day text, 44px day cells) — desktop stays at the `size="default"` sizing.
- `DateRangeCalendarPanel`'s `size` prop (`"default" | "comfortable"`) forwards a partial `classNames` override to the shared `Calendar` (`src/components/ui/calendar.tsx`), which now merges caller-supplied `classNames` per key via `cn()` instead of fully replacing them — safe to pass a partial override without losing the button/interaction styling for that key.
- `DateRangeCalendarPanel`'s `mode` and `footer` props are each a discriminated union (`mode: "single"` pairs with `selectedDate`/`onDateChange`; `mode: "range"` pairs with `selectedRange`/`onRangeChange`; `footer: "actions"` pairs with `canApply`/`onClear`/`onApply`; `footer: "summary"` takes no extra props). Callers must branch on `calendarMode` at the JSX call site — there is no "pass everything and let it sort itself out." `"actions"` shows `DateRangeFooter`, `"summary"` shows only the formatted date text (used by the Filters bottomsheet, which has its own single `Apply Filters` button).
- The calendar carries `key={mode}` so switching between single/range remounts it instead of reusing a stale `react-day-picker` instance (which only reads `defaultMonth` on init).
- `DateRangeTrigger` must stay wrapped in `forwardRef`: both `PopoverTrigger asChild` and `DrawerTrigger asChild` need a ref on the child button.

## Common edit recipes

- **Add a new preset** → add to `PRESET_OPTIONS` in `DateRangeDropdown.utils.ts` (also update `getPillLabel`/`getPresetLabel` if it needs custom label text). `DateRangePresetList` picks it up automatically via `GROUPED_PRESET_OPTIONS`.
- **Change desktop/mobile breakpoint** → edit `LARGE_SCREEN_QUERY` in `DateRangeDropdown.utils.ts`. Do not change `use-mobile.tsx`.
- **Change calendar appearance everywhere** (dropdown + Filters bottomsheet) → edit `DateRangeCalendarPanel.tsx`, not the individual callers.
- **Change only the dropdown's Apply/Clear behavior** → edit `useDateRangeDropdown.ts`; keep `DateRangeFooter.tsx` presentation-only.
- **Don't** re-add the calendar inline inside `DateRangePresetList` — the list is intentionally calendar-free so it fits in one popover width and one bottomsheet step.
