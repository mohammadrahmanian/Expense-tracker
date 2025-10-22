## Agent Workflow
When a prompt asks to add a feature, fix a bug, or add tests:
1) Review the relevant files and ensure full understanding.
2) Write the plan in `plan.md` before changing any code.
3) Break the plan into small, verifiable steps.
4) Remove ambiguities and assumptions; make the plan explicit.
5) If unsure, ask clarifying questions instead of guessing.
6) Share the plan and wait for user feedback before implementation.

Make sure you use the frontend-engineer skill for frontend development.

## Business Knowledge
- When I ask you to make adjustments on the Dashboard, review the file at "src/pages/Dashboard.tsx" first
- When I ask you to make adjustments on the Transactions page, review the file at "src/pages/Transactions.tsx" first
- When I ask you to make adjustments on the Reports page, review the file at "src/pages/Reports.tsx" first
- When I ask you to make adjustments on the Categories page, review the file at "src/pages/Categories.tsx" first
- When I ask you to make adjustments on the More page, review the file at "src/pages/More.tsx" first
- When I ask you to make adjustments on the Recurring Transactions page, review the file at "src/pages/RecurringTransactions.tsx" first
- When you want to use the Playwright MCP server, open the "http://localhost:8080" address. The app is running there. If you need to login, use the credentials UI_TEST_EMAIL as username and UI_TEST_PASSWORD as password from the environment variables.
- There is a core component called the quick expense modal located at "./src/components/ui/quick-expense-modal.tsx". This modal's responsibility is to give a quick way of tracking expenses to the user. The quick expense modal has three predefined categories: Food, Health, Household. When a user adds a transaction using one of these categories but doesn't have the category defined, the modal creates the category first and then creates the transaction.