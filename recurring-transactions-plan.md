# Recurring Transactions Page - Implementation Plan

## Overview
Create a dedicated page to manage all recurring transactions with the ability to view, edit, deactivate, and delete them. Each transaction shows when it will next occur based on its recurrence frequency.

## Page Information
- **Route**: `/recurring-transactions`
- **Navigation**: Add to sidebar navigation menu
- **Layout**: Uses `DashboardLayout` component
- **Access**: Protected route (requires authentication)

---

## UI/UX Design (Low-Fidelity Mockup)

### Desktop View
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Recurring Transactions                                                  │
│  Manage your automated income and expense schedules                      │
│                                                                           │
│  ┌──────────────────────────────────────────┐  ┌──────────────────────┐ │
│  │ [Search icon] Search recurring trans...  │  │ [Filter] All Types ▾ │ │
│  └──────────────────────────────────────────┘  └──────────────────────┘ │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ ACTIVE RECURRING TRANSACTIONS (4)                      [+] Add New   ││
│  ├─────────────────────────────────────────────────────────────────────┤│
│  │                                                                       ││
│  │ ┌───────────────────────────────────────────────────────────────┐   ││
│  │ │ [Icon] Monthly Salary              [INCOME] [Active]     [...]│   ││
│  │ │        Work - Payroll                                          │   ││
│  │ │        $5,000.00                                               │   ││
│  │ │        Every MONTHLY • Next: Dec 1, 2025 (in 2 days)          │   ││
│  │ └───────────────────────────────────────────────────────────────┘   ││
│  │                                                                       ││
│  │ ┌───────────────────────────────────────────────────────────────┐   ││
│  │ │ [Icon] Rent Payment               [EXPENSE] [Active]     [...]│   ││
│  │ │        Household - Housing                                     │   ││
│  │ │        $1,200.00                                               │   ││
│  │ │        Every MONTHLY • Next: Dec 5, 2025 (in 6 days)          │   ││
│  │ └───────────────────────────────────────────────────────────────┘   ││
│  │                                                                       ││
│  │ ┌───────────────────────────────────────────────────────────────┐   ││
│  │ │ [Icon] Gym Membership            [EXPENSE] [Active]     [...]│   ││
│  │ │        Health - Fitness                                        │   ││
│  │ │        $50.00                                                  │   ││
│  │ │        Every MONTHLY • Next: Dec 15, 2025 (in 16 days)        │   ││
│  │ └───────────────────────────────────────────────────────────────┘   ││
│  │                                                                       ││
│  │ ┌───────────────────────────────────────────────────────────────┐   ││
│  │ │ [Icon] Coffee Subscription       [EXPENSE] [Active]     [...]│   ││
│  │ │        Food - Beverages                                        │   ││
│  │ │        $25.00                                                  │   ││
│  │ │        Every WEEKLY • Next: Dec 2, 2025 (in 3 days)           │   ││
│  │ └───────────────────────────────────────────────────────────────┘   ││
│  │                                                                       ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ INACTIVE RECURRING TRANSACTIONS (1)                                  ││
│  ├─────────────────────────────────────────────────────────────────────┤│
│  │                                                                       ││
│  │ ┌───────────────────────────────────────────────────────────────┐   ││
│  │ │ [Icon] Old Subscription          [EXPENSE] [Inactive]   [...]│   ││
│  │ │        Entertainment - Streaming                               │   ││
│  │ │        $15.00                                                  │   ││
│  │ │        Every MONTHLY • Deactivated                             │   ││
│  │ └───────────────────────────────────────────────────────────────┘   ││
│  │                                                                       ││
│  └─────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────────────────┐
│ Recurring Transactions          │
│ Manage automated schedules      │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Search] Search...          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [Filter] All Types        ▾ │ │
│ └─────────────────────────────┘ │
│                                 │
│ ACTIVE (4)         [+] Add New  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Icon] Monthly Salary  [...]│ │
│ │        INCOME • Active       │ │
│ │        $5,000.00             │ │
│ │        Monthly               │ │
│ │        Next: Dec 1 (2 days)  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Icon] Rent Payment    [...]│ │
│ │        EXPENSE • Active      │ │
│ │        $1,200.00             │ │
│ │        Monthly               │ │
│ │        Next: Dec 5 (6 days)  │ │
│ └─────────────────────────────┘ │
│                                 │
│ INACTIVE (1)                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Icon] Old Sub         [...]│ │
│ │        EXPENSE • Inactive    │ │
│ │        $15.00                │ │
│ │        Monthly • Deactivated │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+] FAB                         │
└─────────────────────────────────┘
```

### Dropdown Menu (Actions)
```
┌────────────────────────┐
│ [Edit icon] Edit       │
│ [Toggle] Deactivate    │ (or "Activate" if inactive)
│ [Trash] Delete         │
└────────────────────────┘
```

---

## Features & Functionality

### 1. **Display Recurring Transactions**
- Show all recurring transactions grouped by status (Active/Inactive)
- Display transaction information:
  - Title
  - Type badge (Income/Expense with color coding)
  - Status badge (Active/Inactive)
  - Amount (formatted with currency)
  - Category name and icon
  - Recurrence frequency (Daily/Weekly/Monthly/Yearly)
  - Next occurrence date with relative time ("in X days")
  - For inactive: Show "Deactivated" instead of next date

### 2. **Search & Filter**
- **Search**: Real-time search by transaction title
- **Type Filter**: Filter by All/Income/Expense
- **Category Filter**: Filter by specific category
- **Status Filter**: Show All/Active/Inactive only

### 3. **Actions**
Each recurring transaction has three actions via dropdown menu:
- **Edit**: Open transaction form pre-filled with current data
- **Toggle Status**: Activate/Deactivate the recurring schedule
- **Delete**: Remove the recurring transaction (with confirmation)

### 4. **Add New Recurring Transaction**
- Button in header ("+ Add New")
- Floating Action Button (FAB) on mobile
- Opens a form (can reuse/adapt TransactionForm) with recurring-specific fields:
  - Title (required)
  - Amount (required)
  - Type: Income/Expense (required)
  - Category (required)
  - Recurrence Frequency: Daily/Weekly/Monthly/Yearly (required)
  - Start Date (date field - when recurrence begins)
  - Description (optional)
  - End Date (optional - when recurrence should stop)
- Form automatically sets `isRecurring: true` when submitting
- Uses `POST /api/transactions` endpoint with recurring payload

### 5. **Next Occurrence Display**
The `nextOccurrence` field is provided by the API - no calculation needed.

Display the date with relative time formatting:
- "Tomorrow", "in 3 days", "in 2 weeks", "in 1 month", etc.
- Use `date-fns` for formatting and relative time calculation
- For inactive transactions: Show "Deactivated" instead of next occurrence date

### 6. **Empty States**
- When no recurring transactions exist at all
- When no active recurring transactions
- When no inactive recurring transactions
- When search/filter returns no results

### 7. **Loading States**
- Skeleton loaders while fetching data
- Loading indicators for actions (edit, delete, toggle)

---

## Technical Implementation

### 1. **Files to Create**
- `src/pages/RecurringTransactions.tsx` - Main page component
- (Optional) `src/components/recurring/RecurringTransactionCard.tsx` - Card component for each transaction

### 2. **Files to Modify**
- `src/App.tsx` - Add new route
- `src/components/layouts/DashboardLayout.tsx` - Add navigation item
- `src/services/api.ts` - Add API methods for recurring transactions
- `src/types/index.ts` - Add RecurringTransaction type

### 3. **New Type Additions**
Based on the Swagger API schema:

```typescript
export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string; // ISO date-time string
  startDate: string; // ISO date-time string - when the recurrence started
  endDate?: string; // ISO date-time string - optional end date for recurrence
  isActive: boolean; // For deactivating recurring schedules
  description?: string; // Optional description
  nextOccurrence: string; // ISO date-time string - Provided by API
  categoryId: string;
  category?: Category; // Populated via join
  recurrenceFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}
```

**Note**: The API returns ISO date-time strings, so we'll need to convert them to Date objects in the frontend.

### 4. **API Methods to Add**
Based on the Swagger documentation:

**Existing Endpoints:**
- `GET /api/recurring-transactions` - Returns object with `recurringTransactions` array
- `POST /api/transactions` - Create transaction (can create recurring by passing `isRecurring: true` and `recurrenceFrequency`)
- `PUT /api/recurring-transactions/{id}` - Update recurring transaction (204 response)
- `DELETE /api/recurring-transactions/{id}` - Delete recurring transaction (204 response)
- `POST /api/recurring-transactions/{id}/toggle` - Toggle active/inactive status (204 response, requires `active` in body)

**API Methods to Implement in Frontend:**
```typescript
// New service: recurringTransactionsService
export const recurringTransactionsService = {
  // Get all recurring transactions
  getAll: async (): Promise<RecurringTransaction[]> => {
    const response = await apiClient.get<{ recurringTransactions: RecurringTransaction[] }>(
      "/recurring-transactions"
    );
    return response.data.recurringTransactions;
  },

  // Create new recurring transaction (uses /transactions endpoint)
  create: async (data: Partial<RecurringTransaction>): Promise<Transaction> => {
    const payload = {
      ...data,
      isRecurring: true, // Mark as recurring
      recurrenceFrequency: data.recurrenceFrequency, // Required for recurring
    };
    const response = await apiClient.post<Transaction>("/transactions", payload);
    return response.data;
  },

  // Update recurring transaction (dedicated endpoint)
  update: async (id: string, data: Partial<RecurringTransaction>): Promise<void> => {
    await apiClient.put(`/recurring-transactions/${id}`, data);
    // Returns 204 No Content
  },

  // Delete recurring transaction (dedicated endpoint)
  // Note: This keeps existing generated transactions per user requirement
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/recurring-transactions/${id}`);
    // Returns 204 No Content
  },

  // Toggle active/inactive status (dedicated endpoint)
  toggleStatus: async (id: string, active: boolean): Promise<void> => {
    await apiClient.post(`/recurring-transactions/${id}/toggle`, { active });
    // Returns 204 No Content
  },
};
```

**Notes:**
- **READ**: GET returns `{ recurringTransactions: RecurringTransaction[] }` object, not array directly
- **CREATE**: Uses `POST /api/transactions` with `isRecurring: true` and `recurrenceFrequency` in payload
- **UPDATE**: Uses dedicated `PUT /api/recurring-transactions/{id}` endpoint (204 response)
- **DELETE**: Uses dedicated `DELETE /api/recurring-transactions/{id}` endpoint (204 response)
- **TOGGLE**: Uses dedicated `POST /api/recurring-transactions/{id}/toggle` endpoint with `{ active: boolean }` body (204 response)

### 5. **Component Structure**
```
RecurringTransactions (Page)
├── DashboardLayout
│   ├── Page Header (Title + Description)
│   ├── Filters Section
│   │   ├── Search Input
│   │   ├── Type Filter Dropdown
│   │   └── Category Filter Dropdown
│   ├── Active Section
│   │   ├── Section Header ("ACTIVE (count)" + Add Button)
│   │   └── RecurringTransactionCard[] (map active transactions)
│   ├── Inactive Section
│   │   ├── Section Header ("INACTIVE (count)")
│   │   └── RecurringTransactionCard[] (map inactive transactions)
│   └── FloatingActionButton (mobile only)
```

### 6. **State Management**
```typescript
const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [typeFilter, setTypeFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
const [categoryFilter, setCategoryFilter] = useState<string>("all");
const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | undefined>();
const [isLoading, setIsLoading] = useState(false);
```

### 7. **Helper Functions**
```typescript
// Get relative time string from nextOccurrence date (provided by API)
const getRelativeTime = (date: Date): string // "in 3 days", "tomorrow", etc.

// Filter recurring transactions
const filterTransactions = (): RecurringTransaction[]

// Group by status
const activeTransactions = recurringTransactions.filter(t => t.isActive === true)
const inactiveTransactions = recurringTransactions.filter(t => t.isActive === false)
```

---

## UI Components to Use

### Existing Components
- `DashboardLayout` - Page wrapper
- `Card`, `CardHeader`, `CardContent` - Transaction cards
- `Badge` - Type and status badges
- `Button` - Action buttons
- `Input` - Search input
- `Select` - Filter dropdowns
- `DropdownMenu` - Actions menu (Edit/Toggle/Delete)
- `Dialog` - Transaction form modal
- `FloatingActionButton` - Mobile add button
- `TransactionForm` - Reuse existing form
- Iconify icons for categories

### New Components (if needed)
- `RecurringTransactionCard` - Optional dedicated card component

---

## Color Coding

### Type Badges
- **Income**: Green background (`bg-green-100 text-green-800`)
- **Expense**: Red background (`bg-red-100 text-red-800`)

### Status Badges
- **Active**: Blue background (`bg-blue-100 text-blue-800`)
- **Inactive**: Gray background (`bg-gray-100 text-gray-800`)

### Icons
- Income: `ArrowUpRight` (Lucide)
- Expense: `ArrowDownLeft` (Lucide)
- Category icons: Use Iconify icons based on category

---

## User Interactions

### 1. **Toggle Status Flow**
1. User clicks "Deactivate" from dropdown
2. Show confirmation dialog: "Deactivate this recurring transaction? It will stop creating new transactions."
3. If confirmed, update `isActive = false`
4. Move card to "Inactive" section
5. Show success toast: "Recurring transaction deactivated"

### 2. **Delete Flow**
1. User clicks "Delete" from dropdown
2. Show confirmation dialog: "Delete this recurring transaction? This cannot be undone."
3. If confirmed, call delete API
4. Remove card from list
5. Show success toast: "Recurring transaction deleted"

### 3. **Edit Flow**
1. User clicks "Edit" from dropdown
2. Open TransactionForm dialog with pre-filled data
3. User makes changes and saves
4. Update card in place
5. Show success toast: "Recurring transaction updated"

---

## Responsive Design

### Desktop (lg+)
- Two-column layout with sidebar
- Full-width search and filters in a row
- Cards displayed with full details
- Dropdown menu for actions

### Tablet (md)
- Sidebar collapses
- Search and filters stack vertically
- Cards maintain full details
- Dropdown menu for actions

### Mobile (sm)
- Bottom tab bar navigation
- Search and filters stack vertically
- Compact card layout with essential info
- Floating Action Button for adding
- Dropdown menu for actions

---

## Error Handling

### API Errors
- Failed to load: Show error toast + retry button
- Failed to update: Show error toast + keep previous state
- Failed to delete: Show error toast + keep item in list

### Empty States
- No recurring transactions:
  ```
  [Icon] No Recurring Transactions
  You haven't set up any recurring transactions yet.
  [+ Create Your First Recurring Transaction]
  ```

### Search/Filter No Results
- Show: "No recurring transactions match your filters"
- Provide "Clear Filters" button

---

## Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management for modals
- Screen reader announcements for status changes
- Color contrast compliance (WCAG AA)

---

## Testing Scenarios

1. Display all recurring transactions correctly
2. Search filters transactions by title
3. Type filter shows only Income/Expense
4. Category filter works correctly
5. Status filter shows Active/Inactive
6. Next occurrence calculates correctly for all frequencies
7. Relative time displays correctly
8. Edit opens form with correct data
9. Toggle status moves card between sections
10. Delete removes transaction after confirmation
11. Add new creates recurring transaction
12. Mobile responsive layout works
13. Empty states display correctly
14. Error handling works as expected

---

## Future Enhancements (Out of Scope for This Iteration)

- Skip next occurrence
- Modify single occurrence
- Set end date for recurring schedule
- History of generated transactions from this schedule
- Pause temporarily (vs deactivate)
- Bulk actions (activate/deactivate multiple)
- Export recurring schedule
- Push/email notifications before next occurrence

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Add RecurringTransaction type to types/index.ts
- [ ] Add recurringTransactionsService to services/api.ts
- [ ] Add route to App.tsx
- [ ] Add navigation item to DashboardLayout
- [ ] Create RecurringTransactions.tsx page file

### Phase 2: Core UI
- [ ] Implement page layout with DashboardLayout
- [ ] Create search and filter UI
- [ ] Implement transaction card display
- [ ] Add active/inactive grouping
- [ ] Style with Tailwind classes

### Phase 3: Functionality
- [ ] Load recurring transactions from API
- [ ] Implement search filtering
- [ ] Implement type/category/status filtering
- [ ] Display nextOccurrence with relative time formatting
- [ ] Add empty states

### Phase 4: Actions
- [ ] Create RecurringTransactionForm component (or adapt TransactionForm)
- [ ] Implement edit action (uses PUT /recurring-transactions/{id})
- [ ] Implement toggle status with confirmation (uses POST /recurring-transactions/{id}/toggle with { active: boolean })
- [ ] Implement delete with confirmation (uses DELETE /recurring-transactions/{id})
- [ ] Add "Add New" functionality (uses POST /transactions with isRecurring: true)
- [ ] Add FloatingActionButton for mobile

### Phase 5: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test responsive design
- [ ] Add accessibility features
- [ ] Test all user flows

---

## User Feedback & Clarifications

1. ✅ **Next Occurrence**: Provided by API, no calculation needed
2. ✅ **New Type**: Create separate `RecurringTransaction` type (not extending Transaction)
3. ✅ **Inactive Transactions**: Visible by default
4. ✅ **Transaction History**: Not in this iteration
5. ✅ **Skip Occurrence**: Not in this iteration
6. ✅ **Delete Behavior**: Keep existing transactions when recurring schedule is deleted
7. ✅ **Next Occurrence Limit**: No limit on how far in advance to show
8. ✅ **Notifications**: Not in this iteration

## API Schema Analysis (from Swagger)

**Recurring Transaction Schema** (`def-1`):
```json
{
  "id": "string",
  "title": "string",
  "amount": "number",
  "date": "string (date-time)",
  "startDate": "string (date-time)",
  "endDate": "string (date-time)",
  "isActive": "boolean",
  "description": "string",
  "nextOccurrence": "string (date-time)",
  "categoryId": "string",
  "recurrenceFrequency": "DAILY | WEEKLY | MONTHLY | YEARLY",
  "type": "INCOME | EXPENSE"
}
```

**Available Endpoints:**
- `GET /api/recurring-transactions` - Returns `{ recurringTransactions: RecurringTransaction[] }` (200 response)
- `POST /api/transactions` - Create transaction (pass `isRecurring: true` + `recurrenceFrequency` for recurring)
- `PUT /api/recurring-transactions/{id}` - Update recurring transaction (204 response)
- `DELETE /api/recurring-transactions/{id}` - Delete recurring transaction (204 response)
- `POST /api/recurring-transactions/{id}/toggle` - Toggle status (204 response, body: `{ active: boolean }`)

**CRUD Strategy:**
- **READ**: `GET /api/recurring-transactions` returns `{ recurringTransactions: [] }`
- **CREATE**: `POST /api/transactions` with `isRecurring: true` and `recurrenceFrequency`
- **UPDATE**: `PUT /api/recurring-transactions/{id}` (dedicated endpoint, 204 response)
- **DELETE**: `DELETE /api/recurring-transactions/{id}` (dedicated endpoint, 204 response)
- **TOGGLE**: `POST /api/recurring-transactions/{id}/toggle` with `{ active: boolean }` (dedicated endpoint, 204 response)

---

## Summary

This implementation creates a comprehensive Recurring Transactions management page with:
- ✅ Clear visualization of all recurring transactions
- ✅ Active/Inactive status management
- ✅ Next occurrence date calculation and display
- ✅ Full CRUD operations (Create via form, Read, Update, Delete)
- ✅ Search and filter capabilities
- ✅ Responsive design for mobile and desktop
- ✅ Consistent with existing app design patterns
- ✅ Reuses existing components (TransactionForm, DashboardLayout, etc.)
- ✅ Follows UI/UX best practices