const RECURRING_LIST_PATH = "/recurring-transactions";

/**
 * Resolve where Back / Cancel / Save must return to from the recurring form page.
 *
 * `from` arrives as React Router location state, so it is untrusted input: only the
 * list and the detail page of the record being edited are allowed. Anything else
 * (an external URL, another app path, a detail path for a different id) falls back
 * to the list to avoid an open redirect. Create mode passes no `editId`, so it can
 * only ever resolve to the list.
 */
export function getRecurringFormReturnTo(
  from: unknown,
  editId: string | undefined,
): string {
  if (from === RECURRING_LIST_PATH) return from;
  if (
    typeof from === "string" &&
    editId &&
    from === `${RECURRING_LIST_PATH}/${editId}`
  ) {
    return from;
  }
  return RECURRING_LIST_PATH;
}
