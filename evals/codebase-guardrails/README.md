# codebase-guardrails evals

Each `.json` file is one scenario in Anthropic's suggested eval shape (`skills`, `query`, `files`, `expected_behavior`), plus two added fields: `repos` pins the repo and commit so a run can be repeated, and `known_bugs` lists live bugs that earlier runs found in that commit, each with a `status` (reproduced, verified in the clone, or only read from code), so a run's recall can be measured. Security bugs in `known_bugs` give only their kind and guardrail, with details withheld until disclosed; grade those by kind and guardrail. There is no runner: start a fresh session with the skill installed, clone the repo at the pinned commit, send the query, and grade the report line by line.

| File | Repo | What it covers |
| --- | --- | --- |
| `audit-with-history.json` | maybe (Rails), healthchecks (Django) | A full audit: tally, verdicts, scoring, section order, bug recall |
| `library-with-docs.json` | zustand (TypeScript library) | Published package and docs: G26–G28 |
| `cli-tool.json` | go-task (Go CLI) | N/A rules without a UI, G27 for binaries |
| `frontend-scoped.json` | mealie (Vue/Nuxt frontend) | A scoped audit ("audit the frontend") |
| `cli-no-history.json` | hexyl (Rust CLI, one-commit clone) | The no-history branch: evidence from Code lines |
| `plan-greenfield.json` | none (no code) | Plan mode for a new project |

## Results

Graded by an independent agent that started with no context from the skill's development and wrote its grades before seeing any earlier ones. Full line-by-line grading: [`independent-grading.md`](independent-grading.md). Its comparison section compares against an earlier self-grading by the skill's author, since removed from this README because the independent grading found it too generous.

| Run | Eval | First run (earlier skill versions) | Re-run (version of 2026-11-25) |
| --- | --- | :---: | :---: |
| maybe | audit-with-history | 5 / 10 | 6 / 10 |
| healthchecks | audit-with-history | 2 / 10 | 7 / 10 |
| zustand | library-with-docs | 4 / 7 | 6 / 7 |
| go-task | cli-tool | 6 / 8 | 5 / 8 |
| mealie | frontend-scoped | 6 / 8 | 8 / 8 |
| hexyl | cli-no-history | — | 5 / 5 |
| greenfield | plan-greenfield | — | 5 / 7 |

Each score counts the `expected_behavior` lines the eval had when that run was graded. Lines added since (bug recall, among others) haven't been graded yet, so some files now have more lines than the totals above.

Lines a saved report can't show (the path given in chat, `GUARDRAILS.md` left unedited) count as "can't tell", not as passes.

**What the grading found**

- **The ranking repeats; the live bugs don't.** Between two runs of the same repo, two of the top three changes repeat and the largest classes move by 10–30%. Only 5 of 30 distinct live bugs appeared in both runs, and at least 8 bugs found by just one run are real. One run is a sample of the bugs, not a list of them. The `known_bugs` lists now measure this.
- **Fixed by the re-run version:** inventing guardrails the catalog already had, section order, Met rows sorting first, sweeps counted per commit, signals on guardrails that weren't raised.
- **Fixed after the re-runs** (not yet re-tested): Convention given despite named violations, stretching "Applies when" by analogy (go-task's prompts as dialogs), argument reads missing from G4, Plan mode's template and tie-breaking, the diff limit, scoring with no history, and re-checking earlier live bugs.

## Catalog candidates for v0.2

- **Tenant data isolation.** The greenfield run flagged it as the biggest multi-tenant risk with no catalog entry. History so far: one-off fixes in maybe (`39d57a1`, a cross-family data leak) and mealie (`622abec4`, lookups scoped to the caller's group). Two repos, but no recurring class yet.

## Caveats

- `cli-tool.json` and `frontend-scoped.json` were written after reading the first go-task and mealie runs, so their first-run scores are weak evidence.
- "Independent" means a separate agent with no context from the skill's development, but the same model, working from a brief the author wrote.
- Each scenario has run at most twice, on one model. No run without the skill has been made for comparison, and no run on a smaller model.
