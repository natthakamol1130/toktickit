# Lab 1 — AI Use and Reflection

**LLM/agent used:** Antigravity (Gemini 3.6 Flash / Medium Thinking)

## Selected key prompts (6–10)
| # | Prompt (summarised) | What I did with the result |
|---|---------------------|----------------------------|
| 1 | Plan Lab 1 implementation and summarize the four GitHub Issues, dependencies, and required automated tests following the Git Flow branching model. | Reviewed the proposed implementation steps and approved the execution plan. |
| 2 | Set up the TokTickIT project foundation (Issue 1) with React, Vite, Bootstrap, Express, and Prisma, and write comprehensive README setup instructions. | Verified dependencies, initialized git repository and branch structure, and created PR #5 to lab1-staging. |
| 3 | Implement GET /api/health endpoint in Express backend returning HTTP 200 with `{ status: "ok", service: "TokTickIT API" }` and verify with Supertest (Issue 2). | Verified test passed 100%, committed changes to `feature/2-health-check`, and created PR #6. |
| 4 | Define Category model in Prisma schema, run migration, and implement idempotent database seeding using upsert for the 4 required categories (Issue 3). | Ran Prisma migrations against PostgreSQL, verified seed idempotency, and opened PR #7. |
| 5 | Implement GET /api/categories endpoint in Express backend returning categories in predictable ID order from PostgreSQL via Prisma (Issue 4). | Verified endpoint with Supertest in `categories.test.ts`. |
| 6 | Build Check System UI in React with Bootstrap handling idle, loading, success (Online + 4 categories), and error (Offline + message) states (Issue 4). | Implemented `App.tsx` and `api.ts`, connected frontend with backend API. |
| 7 | Write Vitest test suite for App component covering heading, success state, and offline error state (Issue 4). | Ran Vitest in client, confirming all 3 test cases passed. |
| 8 | Review peer partners' pull requests for Issues 1, 2, 3, and 4 with constructive feedback and record responses. | Provided review comments, suggested improvements (.gitignore, seed idempotency), and documented review records. |

## Reflection
Providing structured prompt contexts with explicit acceptance criteria, expected JSON response formats, and clear Git branch instructions allowed the agent to implement endpoints and test assertions accurately in one shot. When handling Windows PowerShell syntax nuances and database connection configurations, detailing the local environment parameters ensured that database migrations, seed scripts, and test suites executed reliably without errors.
