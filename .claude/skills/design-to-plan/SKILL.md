---
name: design-to-plan
description: >-
  Review a Pencil .pen design and write a step-by-step implementation plan in
  ASD-STE 100 for a weaker model. Uses the .pen file open in the Pencil canvas;
  if none is open, uses the repo .pen when there is exactly one, otherwise asks
  which file and frame. Writes only plan.md. Do not implement the plan. Use when
  the user asks to review a Pencil/pen.dev frame, turn a design into a plan,
  write an STE-100 implementation plan, or runs /design-to-plan.
---

# Design to plan

Review a Pencil frame against the current codebase. Write `plan.md` at the repo root. Stop. Do not implement. Do not edit application source. Do not commit `plan.md`.

## .pen file

Never `Read` or `Grep` a `.pen` file. Use Pencil MCP only. Call `search_tool` first and use the returned schemas.

Resolve the file in this order:

1. `pencil__get_app_state` with no arguments. If a canvas is active, use that path.
2. If the canvas is closed, list `*.pen` at the repo root (not `*.lib.pen` unless the user names it). If exactly one remains, use it and tell the user to open it in Pencil when `execute` fails with "a file needs to be open".
3. If zero or many `.pen` files remain, ask which file and which frame. Do not guess.

If MCP cannot read the open file, tell the user to open it in the Pencil editor this session is connected to. Do not invent the layout.

## Design

1. Find the named frame (`Get` visitor on `name`, type, id, width, height).
2. `Get(id, { depth })` on the frame, then on header, main, and side regions until every label, action, and measurement is known.
3. `TakeScreenshot([id])` of the frame. Treat the screenshot as the visual source; treat the tree as the structure source.
4. List every UI element: copy, icons, layout, spacing, breakpoints.

## Code

Read the page, routes, types, services, hooks, and components the frame would touch. Reuse existing pieces. Do not plan new APIs, fields, or entities the product does not have.

## Questions

Ask instead of guessing. Typical gaps: desktop vs mobile this round, click vs existing Edit/overflow actions, and design features with no API (accounts, skip, reminders). Put unanswered product calls in the plan only after the user answers. Features with no backend go in **Out of scope** with a one-line reason. Do not fake them.

## `plan.md` (ASD-STE 100)

Write for a weaker model that will implement later. One command per numbered step. Active voice. Imperative in procedures. Use **must** for requirements. Do not use should, would, could, or contractions. Name the file and symbol. Do not use "it" without a noun.

Required sections:

1. **Identification** — table: feature, frame id/name, branch, audience = implementation model.
2. **Purpose** — what the user can do after the work.
3. **Scope** — in scope; out of scope with reasons.
4. **Current system** — routes, data, files to reuse.
5. **Required system** — layout, copy, navigation, empty/loading/error, dark mode.
6. **Limitations** — project rules that apply (100-line `.tsx` components, named exports, TanStack Query, RHF+Zod, design tokens, `Card`, no raw hex).
7. **Procedure** — ordered steps. Each step: files to change/add, exact behavior, what not to do.
8. **File list** — change / add / do not add.
9. **Copy map** — design label → code field or "omit".
10. **Acceptance checklist** — browser and `npm run typecheck:all` / `npm run test`.
11. **Notes for the model** — reuse, CSS breakpoints not `useIsMobile()` flash, stopPropagation on row menus.

Match design labels and spacing. Prefer `lg:` when the rest of the app treats desktop as `lg`.

After writing `plan.md`, summarize the design, the scope cuts, and that implementation is not part of this skill.
