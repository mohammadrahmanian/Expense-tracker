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
├── DateRangeDropdown.tsx        # smart shell: picks Popover vs Drawer via useMediaQuery
├── DateRangeDropdown.utils.ts   # PRESET_OPTIONS, getPillLabel, getPresetLabel
├── useDateRangeDropdown.ts      # state: open, calendarMode, pendingDate/Range, canApply, handlers
├── DateRangeTrigger.tsx         # forwardRef button (asChild target for Popover/Drawer trigger)
├── DateRangePresetList.tsx      # the six preset items (day/month/custom groups)
├── DateRangeDesktopPanel.tsx    # preset list + calendar side-by-side (>=1024px)
└── DateRangeMobileSheet.tsx     # two-step bottomsheet: preset list, then calendar with back button

DateRangeCalendarPanel/          # shared calendar UI, no dropdown-specific logic
├── DateRangeCalendarPanel.tsx   # renders Calendar (single/range) + footer
├── DateRangeCalendarPanel.utils.ts  # formatDateLabel(start?, end?)
└── DateRangeFooter.tsx          # date label + Clear/Apply buttons ("actions" footer only)
```

## State & data flow

- All local state lives in `useDateRangeDropdown.ts`: `open`, `calendarMode` (`"single" | "range" | null`), `pendingDate`, `pendingRange`, `canApply`.
- Opening the popover/drawer while `preset` is already `custom_date`/`custom_range` seeds `calendarMode` and the pending value from `startDate`/`endDate` (see `handleOpenChange`).
- Clicking a preset item: non-custom presets call `onPresetChange` and close immediately; the two custom items switch `calendarMode` and wait for `Apply`.
- `handleApply` fires `onCustomDateSelect`/`onCustomRangeSelect`, resets local state, and closes.
- `handleBack` (mobile bottomsheet only) resets `calendarMode`/pending values back to the preset list step, without closing the sheet. Internally calls the same `resetLocal` used elsewhere.
- `DateRangeDropdown.tsx` reads `useMediaQuery("(min-width: 1024px)")` to choose `DateRangeDesktopPanel` (inside a `Popover`) or `DateRangeMobileSheet` (inside a `Drawer`). Both panels are fed the same prop bag built once in the shell.

## UI notes

- Breakpoint: **1024px** (`lg`), via `src/hooks/use-media-query.ts` — do not confuse with `useIsMobile()` in `use-mobile.tsx`, which uses 768px and is unrelated to this component.
- Desktop: `DateRangeDesktopPanel` shows `DateRangePresetList` (`w-[300px]`) and `DateRangeCalendarPanel` (`w-[320px]`) side by side, separated by a `border-l`. The calendar only renders once `calendarMode` is set. `PopoverContent` uses `collisionPadding={16}` so the wider popover stays on screen near viewport edges.
- Mobile: `DateRangeMobileSheet` shows the preset list (with a `ChevronRight` on the two custom items instead of a checkmark) as step 1, then the calendar with a back header (`ChevronLeft` + title) as step 2. `DrawerContent` is capped at `max-h-[90dvh]` and carries a visually-hidden `DrawerTitle` (required by `vaul` to avoid a console error).
- `DateRangeCalendarPanel`'s `footer` prop controls chrome: `"actions"` shows `DateRangeFooter` (date label + Clear/Apply), `"summary"` shows only the formatted date text with no buttons — used by the Filters bottomsheet, which has its own single `Apply Filters` button.
- `DateRangeTrigger` must stay wrapped in `forwardRef`: both `PopoverTrigger asChild` and `DrawerTrigger asChild` need a ref on the child button.

## Common edit recipes

- **Add a new preset** → add to `PRESET_OPTIONS` in `DateRangeDropdown.utils.ts` (also update `getPillLabel`/`getPresetLabel` if it needs custom label text). `DateRangePresetList` picks it up automatically via the `group` field.
- **Change desktop/mobile breakpoint** → edit the media query string passed to `useMediaQuery` in `DateRangeDropdown.tsx` only. Do not change `use-mobile.tsx`.
- **Change calendar appearance everywhere** (dropdown + Filters bottomsheet) → edit `DateRangeCalendarPanel.tsx`, not the individual callers.
- **Change only the dropdown's Apply/Clear behavior** → edit `useDateRangeDropdown.ts`; keep `DateRangeFooter.tsx` presentation-only.
- **Don't** re-add the calendar inline inside `DateRangePresetList` — the list is intentionally calendar-free so it fits in one popover width and one bottomsheet step.
