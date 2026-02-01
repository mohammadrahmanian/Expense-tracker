## Agent Workflow

When a prompt asks to add a feature, fix a bug, or add tests:

1. Review the relevant files and ensure full understanding
2. For non-trivial tasks, write a plan in `plan.md` before changing code
3. Break the plan into small, verifiable steps
4. Ask clarifying questions to remove ambiguities
5. Share the plan and wait for user approval before implementation
6. Use git convention naming for branches (e.g., `feat/add-export`, `fix/login-error`)
7. Never commit `plan.md` to the repository
8. Once done with a task implementation, run the typecheck command to ensure no type errors: `npm run typecheck:all`
9. Make sure to clean up the unused imports, variables, and code and leave no tech debts behind when the task is done.

Use the **frontend-developer** subagent for frontend development tasks.

---

## Documentation

The codebase documentation is modular. Load only what you need:

| When you need to... | Read |
|---------------------|------|
| Understand the project | `docs/agents/overview.md` |
| Find where code belongs | `docs/agents/architecture.md` |
| Error / Exception Tracking | `docs/agents/error-exception-tracking.md` |
| Add a new feature | `docs/agents/adding-features.md` |
| Follow code style | `docs/agents/coding-conventions.md` |
| Avoid common mistakes | `docs/agents/anti-patterns.md` |
| Understand business logic | `docs/agents/business-knowledge.md` |
| Manage state | `docs/agents/state-management.md` |
| Build forms | `docs/agents/form-handling.md` |
| Write tests | `docs/agents/testing.md` |
| Optimize performance | `docs/agents/performance.md` |
| Deploy the app | `docs/agents/deployment.md` |

For quick reference and essential rules, see `AGENTS.md`.