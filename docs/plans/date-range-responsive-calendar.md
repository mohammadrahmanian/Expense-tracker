# Plan — Responsive Calendar For The Date Range Filter

This document is written in ASD-STE100 (Simplified Technical English).
Read all of Part 1 before you start Part 2.
Do the steps in Part 2 in the given sequence.

---

## Part 1 — Background

### 1.1 The problem

The transactions page has a date filter button.
The button opens a menu.
The menu shows six preset items.
Two items are `Custom Date` and `Custom Date Range`.

A click on one of these two items adds a calendar below the item list.
The calendar is inside the same menu panel.
The menu becomes very tall.
The menu does not fit on a mobile screen.
The menu also does not fit on a medium desktop screen.

### 1.2 The solution

Show the calendar in a separate panel.

- On a large screen, show the calendar at the side of the item list.
  Keep the item list visible.
- On a small screen, show the item list in a bottomsheet.
  Show the calendar as a second step in the same bottomsheet.

### 1.3 Decisions that are already made

Do not change these decisions.

| Topic | Decision |
| --- | --- |
| Breakpoint | `lg` (1024 px). A width of 1024 px or more is a large screen. |
| Large screen layout | Two panels at the side of each other. The item list stays visible. |
| Small screen layout | One bottomsheet with two steps. Step 1 is the item list. Step 2 is the calendar. |
| Scope | Also change the calendar in the mobile Filters bottomsheet. |

### 1.4 Files that you must know

| File | Function |
| --- | --- |
| `src/components/transactions/DateRangeDropdown/DateRangeDropdown.tsx` | The menu shell. Holds a Radix `Popover`. Has a `variant` prop with the values `default` and `pill`. |
| `src/components/transactions/DateRangeDropdown/DateRangeDropdownContent.tsx` | Shows the six preset items. Adds the calendar below the items. This is the cause of the problem. |
| `src/components/transactions/DateRangeDropdown/DateRangeFooter.tsx` | Shows the selected date, a `Clear` button and an `Apply` button. |
| `src/components/transactions/DateRangeDropdown/useDateRangeDropdown.ts` | Holds the state: `open`, `calendarMode`, `pendingDate`, `pendingRange`, `canApply`. |
| `src/components/transactions/DateRangeDropdown/DateRangeDropdown.utils.ts` | Holds `PRESET_OPTIONS`, `getPillLabel` and `getPresetLabel`. |
| `src/components/transactions/TransactionTabFilterBar/TransactionTabFilterControls/TransactionTabFilterControls.tsx` | Uses the menu with `variant="default"`. |
| `src/components/transactions/mobile/MobilePillTabs/MobilePillTabs.tsx` | Uses the menu with `variant="pill"`. |
| `src/components/transactions/mobile/MobileFilterBottomsheet/FilterBottomsheetContent.tsx` | Has a second calendar. This calendar is inline in the Filters bottomsheet. |
| `src/components/ui/drawer.tsx` | The bottomsheet component. It uses the `vaul` library. |
| `src/components/ui/calendar.tsx` | The calendar component. It uses the `react-day-picker` library. |
| `src/hooks/use-mobile.tsx` | Has `useIsMobile()`. The breakpoint is 768 px. Do not change this file. |

### 1.5 Rules of the project

Obey these rules. The rules are in `AGENTS.md`.

1. A `.tsx` component file must have 100 lines or less.
2. Each component has a folder. The folder has an `index.ts` barrel file.
3. Use named exports. Do not use default exports.
4. Import the `FC` type. Do not write `React.FC`.
5. Write props types with `type`. Keep the props type in the component file.
6. Give each color a dark mode class.
7. Use the design tokens of `tailwind.config.ts`. Do not write a raw hex color.
8. Do not add a new dependency.

---

## Part 2 — The steps

### Step 1 — Make a media query hook

Make the file `src/hooks/use-media-query.ts`.

1. Export a function with the name `useMediaQuery`.
2. Give the function one parameter `query` of the type `string`.
3. Let the function return a `boolean`.
4. Use `window.matchMedia(query)` in a `useEffect` hook.
5. Read `mql.matches` one time when the effect starts.
6. Add a `change` listener to the media query list.
7. Remove the listener in the cleanup function.
8. Use `src/hooks/use-mobile.tsx` as the example of the pattern.

Note: `use-mobile.tsx` starts with the state `undefined`.
Use the same pattern. This pattern prevents an incorrect first render.

### Step 2 — Make a test for the hook

The project rules make a test for a hook necessary.

1. Make the file `src/hooks/use-media-query.test.ts`.
2. Make a mock of `window.matchMedia`.
3. Test that the hook returns `true` when the query agrees.
4. Test that the hook returns `false` when the query does not agree.
5. Test that the hook removes the listener at unmount.

### Step 3 — Make the shared calendar panel

Make the folder `src/components/transactions/DateRangeCalendarPanel/`.

Make the file `DateRangeCalendarPanel.tsx` in this folder.
This component shows only the calendar. It has no business logic.

Give the component these props:

```ts
type DateRangeCalendarPanelProps = {
  mode: "single" | "range";
  selectedDate?: Date;
  selectedRange?: DateRange;
  onDateChange: (date: Date | undefined) => void;
  onRangeChange: (range: DateRange | undefined) => void;
  footer: "actions" | "summary";
  canApply?: boolean;
  onClear?: () => void;
  onApply?: () => void;
};
```

Make the component with these rules:

1. Show `<Calendar mode="single">` when `mode` is `"single"`.
2. Show `<Calendar mode="range">` when `mode` is `"range"`.
3. Set `defaultMonth` to `selectedDate` or to `selectedRange?.from`.
4. Show `<DateRangeFooter>` when `footer` is `"actions"`.
5. Show only the date text when `footer` is `"summary"`.
6. Do not show the `Clear` button when `footer` is `"summary"`.
7. Do not show the `Apply` button when `footer` is `"summary"`.

Move the file `DateRangeFooter.tsx` into this new folder.
Move the text format logic of `DateRangeFooter.tsx` into a new file `DateRangeCalendarPanel.utils.ts`.
Export a function `formatDateLabel(start?: Date, end?: Date): string` from this file.
Use this function for the `"actions"` footer and for the `"summary"` footer.

Make the file `index.ts` in the folder.
Export `DateRangeCalendarPanel` from `index.ts`.

### Step 4 — Make the preset item list

Make the file `DateRangePresetList.tsx` in the folder
`src/components/transactions/DateRangeDropdown/`.

Move the preset item list from `DateRangeDropdownContent.tsx` into this file.
This is the code between line 38 and line 71 of the old file.

Give the component these props:

```ts
type DateRangePresetListProps = {
  preset: DatePreset;
  calendarMode: "single" | "range" | null;
  onPresetClick: (value: DatePreset) => void;
  showChevron?: boolean;
};
```

Keep the active-item logic. The logic is:

- The item is active when `calendarMode` is `"single"` and the value is `custom_date`.
- The item is active when `calendarMode` is `"range"` and the value is `custom_range`.
- The item is active when `calendarMode` is `null` and the value agrees with `preset`.

Add this new behaviour:

1. Show a `ChevronRight` icon at the right of the two custom items when `showChevron` is `true`.
2. Show the `Check` icon for all other active items.
3. Set `showChevron` to `true` only for the bottomsheet.

Note: the chevron icon tells the user that a second step comes next.

### Step 5 — Make the desktop panel

Make the file `DateRangeDesktopPanel.tsx` in the folder
`src/components/transactions/DateRangeDropdown/`.

This component is the content of the popover on a large screen.

1. Make a `div` with the class `flex items-stretch`.
2. Put `<DateRangePresetList>` in the `div`. Give it the class `w-[300px] shrink-0`.
3. Show a vertical border between the two panels. Use `border-l border-border`.
4. Put `<DateRangeCalendarPanel>` after the border.
5. Give the calendar panel the class `w-[320px] shrink-0`.
6. Show the calendar panel only when `calendarMode` is not `null`.
7. Set the prop `footer` of the calendar panel to `"actions"`.
8. Set `showChevron` of the preset list to `false`.

Warning: the width of the popover changes when the calendar panel opens.
Radix moves the popover to keep it on the screen.
Set `collisionPadding={16}` on the `PopoverContent` to make a margin.

### Step 6 — Make the mobile bottomsheet

Make the file `DateRangeMobileSheet.tsx` in the folder
`src/components/transactions/DateRangeDropdown/`.

This component is the content of the bottomsheet on a small screen.
The bottomsheet has two steps.

1. Show `<DateRangePresetList>` when `calendarMode` is `null`.
2. Set `showChevron` to `true` for this list.
3. Show a header with the text `Select Date` above the list.
4. Show `<DateRangeCalendarPanel>` when `calendarMode` is not `null`.
5. Set the prop `footer` of the calendar panel to `"actions"`.
6. Show a header above the calendar. The header has a back button and a title.
7. Use the `ChevronLeft` icon for the back button.
8. Set the title to `Custom Date` when `calendarMode` is `"single"`.
9. Set the title to `Custom Date Range` when `calendarMode` is `"range"`.
10. Give the back button the label `aria-label="Back to the date options"`.
11. Call the new function `handleBack` when the user clicks the back button.

Make the calendar wide on a small screen:

1. Give the calendar container the class `flex justify-center`.
2. Do not set a fixed pixel width on the calendar.

### Step 7 — Add a back handler to the hook

Open `src/components/transactions/DateRangeDropdown/useDateRangeDropdown.ts`.

1. Add a function `handleBack`.
2. Let `handleBack` set `calendarMode` to `null`.
3. Let `handleBack` set `pendingDate` to `undefined`.
4. Let `handleBack` set `pendingRange` to `undefined`.
5. Add `handleBack` to the return object.

Do not change the other functions of this hook.

Note: `handleBack` does the same operations as the internal function `resetLocal`.
Call `resetLocal` from `handleBack`.

### Step 8 — Make the trigger button a separate component

The shell file must have 100 lines or less. Move the button out of the shell.

Make the file `DateRangeTrigger.tsx` in the folder
`src/components/transactions/DateRangeDropdown/`.

1. Move the `<button>` element of `DateRangeDropdown.tsx` into this file.
2. Keep all the current classes of the button.
3. Give the component these props: `variant`, `label`, `open`, `preset`.
4. Wrap the component in `forwardRef`.
5. Send the `ref` and all other props to the `<button>` element.

Warning: `forwardRef` is necessary.
Radix `PopoverTrigger` and `vaul` `DrawerTrigger` use `asChild`.
`asChild` needs a ref on the child element.

### Step 9 — Change the shell component

Open `src/components/transactions/DateRangeDropdown/DateRangeDropdown.tsx`.

1. Keep the props type. Do not change the public interface.
2. Call `useDateRangeDropdown` as before.
3. Add this line: `const isLargeScreen = useMediaQuery("(min-width: 1024px)");`
4. Calculate the label as before.

Show the popover when `isLargeScreen` is `true`:

1. Use `<Popover>`, `<PopoverTrigger asChild>` and `<PopoverContent>`.
2. Put `<DateRangeTrigger>` in the trigger.
3. Put `<DateRangeDesktopPanel>` in the content.
4. Set `align="end"` and `className="w-auto p-0"` on the content.
5. Set `collisionPadding={16}` on the content.

Show the bottomsheet when `isLargeScreen` is `false`:

1. Use `<Drawer>`, `<DrawerTrigger asChild>` and `<DrawerContent>`.
2. Put `<DateRangeTrigger>` in the trigger.
3. Put `<DateRangeMobileSheet>` in the content.
4. Set `className="max-h-[90dvh]"` on `<DrawerContent>`.
5. Add `<DrawerTitle className="sr-only">Date filter</DrawerTitle>`.
6. Use `open` and `onOpenChange` on `<Drawer>`, as for the popover.

Note: `src/components/transactions/mobile/MobileFilterBottomsheet/MobileFilterBottomsheet.tsx`
shows the correct pattern for a `Drawer` with a hidden title. Read it.

Warning: the hidden title is necessary for accessibility.
The `vaul` library shows a console error without a title.

Check the line count of the file. Move more code out if the file has more than 100 lines.

### Step 10 — Delete the old content file

1. Delete the file `src/components/transactions/DateRangeDropdown/DateRangeDropdownContent.tsx`.
2. Make sure that no file imports this file.
3. Remove all imports that are no longer necessary.

### Step 11 — Unify the calendar of the Filters bottomsheet

Open `src/components/transactions/mobile/MobileFilterBottomsheet/FilterBottomsheetContent.tsx`.

This file has 164 lines. The rules permit 100 lines.
Decompose the file, because you change it.

Make the file `FilterBottomsheetContent.utils.ts`:

1. Move `TYPE_OPTIONS`, `DATE_OPTIONS` and `SORT_OPTIONS` into this file.
2. Move `toSortOption` and `fromSortOption` into this file.
3. Move the type `DraftFilterState` into this file.
4. Export all six items.
5. Correct the imports in `MobileFilterBottomsheet.tsx`.

Make the file `FilterDateSection.tsx`:

1. Move the `Date Range` block into this file. This is line 90 to line 122 of the old file.
2. Replace the inline `<Calendar mode="range">` with `<DateRangeCalendarPanel>`.
3. Set `mode` to `"range"`.
4. Set `footer` to `"summary"`.
5. Send `draft.startDate` and `draft.endDate` as the `selectedRange` prop.
6. Send an `onRangeChange` handler that calls `onDraftChange`.

Warning: do not add a `Clear` button or an `Apply` button in the Filters bottomsheet.
The Filters bottomsheet has its own `Apply Filters` button at the bottom.
The `"summary"` footer prevents the second set of buttons.

Warning: do not put a `Drawer` inside the Filters `Drawer`.
The calendar stays inline in this bottomsheet.
Only the visual panel is shared.

Check the line count of `FilterBottomsheetContent.tsx`.
The file must have 100 lines or less after the decomposition.

### Step 12 — Check the two callers

Open `TransactionTabFilterControls.tsx` and `MobilePillTabs.tsx`.

1. Do not change the props that these files send.
2. Make sure that the code compiles.

Note: the public interface of `DateRangeDropdown` does not change.
No change in these two files is expected.

### Step 13 — Test the result by hand

Start the development server with `npm run dev`.

Test on a large screen (1440 px):

1. Click the date button. The item list opens.
2. Click `Custom Date`. The calendar opens at the side of the list.
3. Make sure that the item list stays visible.
4. Select a date. Click `Apply`. The menu closes.
5. Make sure that the button label shows the new date.

Test near the right edge of the screen:

1. Make the browser window 1100 px wide.
2. Open the menu and the calendar.
3. Make sure that the calendar stays fully on the screen.

Test on a medium screen (900 px):

1. Click the date button. The bottomsheet opens.
2. Click `Custom Date Range`. The calendar step opens.
3. Click the back button. The item list comes back.

Test on a small screen (390 px):

1. Do the same test with the pill button.
2. Make sure that the bottomsheet is not higher than 90 % of the screen.
3. Make sure that the calendar is fully visible.

Test the Filters bottomsheet on a small screen:

1. Open the Filters bottomsheet.
2. Select the `Custom` date chip.
3. Make sure that the calendar has the same appearance as the new panel.
4. Make sure that there is only one `Apply Filters` button.

Test the dark mode for all of these screens.

### Step 14 — Write the component context file

The project rules make a context file for a new component necessary.

1. Make the file `docs/agents/components/date-range-dropdown.md`.
2. Use `docs/agents/components/quick-expense-modal.md` as the example of the structure.
3. Write these sections: Purpose, Entry point, Folder layout, State and data flow, UI notes, Common edit recipes.
4. Give the breakpoint value 1024 px in the UI notes section.

Open `AGENTS.md`.

1. Find the table with the title `Component Lookup Table`.
2. Add a row for `DateRangeDropdown`.
3. Set the path to `src/components/transactions/DateRangeDropdown/`.
4. Set the link to `docs/agents/components/date-range-dropdown.md`.

### Step 15 — Do the final checks

Run these commands. All commands must give no error.

```bash
npm run typecheck:all
npm run test
npm run format.fix
```

Then do a last review:

1. Remove all unused imports.
2. Remove all unused variables.
3. Make sure that each `.tsx` component file has 100 lines or less.
4. Make sure that each new color class has a dark mode class.
5. Make sure that no file uses a default export.

### Step 16 — Commit the work

1. Use the branch `claude/calendar-responsive-redesign-ttd1ce`.
2. Write a commit message in the conventional commit format.
3. Use the prefix `feat:`.
4. Push the branch with `git push -u origin claude/calendar-responsive-redesign-ttd1ce`.

Warning: do not commit a file with the name `plan.md`.

---

## Part 3 — The new folder structure

This is the structure after all the steps.

```text
src/hooks/
├── use-media-query.ts                   # NEW
└── use-media-query.test.ts              # NEW

src/components/transactions/DateRangeCalendarPanel/          # NEW folder
├── index.ts
├── DateRangeCalendarPanel.tsx           # the calendar and the footer
├── DateRangeCalendarPanel.utils.ts      # formatDateLabel
└── DateRangeFooter.tsx                  # MOVED from DateRangeDropdown/

src/components/transactions/DateRangeDropdown/
├── index.ts                             # no change
├── DateRangeDropdown.tsx                # CHANGED: popover or bottomsheet
├── DateRangeDropdown.utils.ts           # no change
├── useDateRangeDropdown.ts              # CHANGED: adds handleBack
├── DateRangeTrigger.tsx                 # NEW: the button, with forwardRef
├── DateRangePresetList.tsx              # NEW: the six preset items
├── DateRangeDesktopPanel.tsx            # NEW: the two panels at the side
├── DateRangeMobileSheet.tsx             # NEW: the two steps
└── DateRangeDropdownContent.tsx         # DELETED

src/components/transactions/mobile/MobileFilterBottomsheet/
├── FilterBottomsheetContent.tsx         # CHANGED: smaller
├── FilterBottomsheetContent.utils.ts    # NEW: options and helpers
├── FilterDateSection.tsx                # NEW: uses DateRangeCalendarPanel
├── FilterChipGroup.tsx                  # no change
├── AmountRangeInputs.tsx                # no change
└── MobileFilterBottomsheet.tsx          # CHANGED: import path only

docs/agents/components/date-range-dropdown.md                # NEW
AGENTS.md                                                    # CHANGED: one table row
```

---

## Part 4 — Things that you must not change

1. Do not change the type `DatePreset` in `src/lib/transactions.utils.ts`.
2. Do not change the type `DateFilterProps` in `src/lib/transactions.utils.ts`.
3. Do not change `src/hooks/useTransactionFilters.ts`.
4. Do not change the props of `DateRangeDropdown`.
5. Do not change `getPillLabel` or `getPresetLabel`.
6. Do not change the values in `PRESET_OPTIONS`.
7. Do not change the breakpoint in `src/hooks/use-mobile.tsx`.
8. Do not add a library to `package.json`.

---

## Part 5 — Open points

These points are not decided. Ask the user before you change them.

1. The mobile bottomsheet can have a preview of the selected date at the top. This plan does not add it.
2. The `Filters` bottomsheet has no `Custom Date` option. It has only `Custom` for a range. This plan keeps this difference.
3. The desktop calendar shows one month. Two months for a range are possible, but this plan keeps one month.
