---
name: staff-review
description: >-
  Review the current branch as a staff frontend engineer against `plan.md`.
  Compare the implementation to the plan, then write findings (severity, file,
  what’s wrong, how to fix) only in `REVIEW.md`. Do not change application
  source. Use when the user asks for a staff review against the plan, to compare
  the branch to `plan.md`, to write `REVIEW.md`, or runs `/staff-review`.
---

# Staff review

Read `plan.md`. Diff the branch. Compare the implementation to the plan. Write `REVIEW.md` at the repo root. Stop.

Do not edit application source. Do not implement fixes. Do not commit. Do not restore files. Overwrite `REVIEW.md` if it already exists.

If `plan.md` is missing, stop and say so.

## Gather

1. Read `plan.md` in full (purpose, scope in/out, required system, procedure, file list, copy map, acceptance checklist).
2. `git status --short` and `git diff --stat HEAD`. Include untracked files that the plan added.
3. Read every changed and new file the plan names. Read call sites (routes, list click handlers, dialogs) even if they look untouched.
4. Confirm omitted design items are actually absent (no fake Account, Skip, History, reminders).

Do not review unrelated dirty files (for example a `.pen` live-sync diff) as product defects. If a non-plan file is modified, note it as **do not land** unless the user asked for that change.

## Compare

Check each plan requirement. Mark pass or fail. Failures become findings.

Also check staff-level defects the plan implies but does not spell out: loading chrome that is clickable before data exists, date helpers that skip `startOfDay`, keyboard access on clickable rows, pending state on header actions, 100-line `.tsx` limit, dark mode on new surfaces, duplicate mounted forms, `stopPropagation` on overflow menus, route order (`new` before `:id`).

Do not invent issues to fill space. Do not re-open Out of scope items as bugs.

## `REVIEW.md`

```markdown
# Review: <feature name from plan.md>

**Reviewer:** staff frontend
**Scope:** <branch / uncommitted files>, checked against `plan.md`
**Verdict:** <ship / fix-then-ship / blocked> in 2–4 sentences.

## Summary

What landed. What matches the plan. Dominant risks.

## Findings

### F1 — <title>
**Severity:** bug | suggestion | nit
**Plan:** <section or step>
**File:** path:line

**What is wrong**
...

**How to fix**
Concrete steps or a short patch. Not “consider refactoring.”

## Plan checklist

| Requirement | Status |
| --- | --- |
| ... | Pass / Fail (Fx) |

## Recommended fix order
1. ...
```

Severity:

- **bug** — wrong behavior, broken a11y for a primary action, incorrect date/count, interactive skeleton, plan requirement failed.
- **suggestion** — pending disabled states, keyboard on row click, visual contract gaps.
- **nit** — copy, token polish, extra file in git status (`.pen`), allowed extra extract.

Every finding must include a fix. End with typecheck/test commands from the plan.

After writing the file, give the user the verdict, the must-fix IDs, and the path `REVIEW.md`.
