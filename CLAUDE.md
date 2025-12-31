## Agent Workflow
When a prompt asks to add a feature, fix a bug, or add tests:
1) Review the relevant files and ensure full understanding.
2) Ask if the task requires creating a plan file and if yes continue with step 2.
3) Write the plan in `plan.md` before changing any code.
4) Break the plan into small, verifiable steps.
5) Remove ambiguities and assumptions; make the plan explicit by asking questions from the user if you are uncertain.
6) Share the plan and wait for user feedback before implementation.

Make sure you use the frontend-developer subagent for frontend development.

@AGENTS.md