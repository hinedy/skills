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
- **Fixed after the re-runs** (not yet re-tested): Convention given despite named violations, stretching "Applies when" by analogy (go-task's prompts as dialogs), argument reads missing from G4, Plan mode's template and tie-breaking, the diff limit, scoring with no history, and re-checking earlier live bugs. In v0.2, after the baseline below: the Recent and Severity columns, G31, and the open pass.

## Baseline: the same task without the skill

Each repo was also audited by a fresh session with no skill, on the same model and pinned commit, asked the eval's query with "against the guardrails" removed (for example "Audit this repo. What keeps breaking, and what would stop it?"). A grader checked every claimed bug in the clone and scored both reports against a rubric written before either was read: verified and false bugs, the top three changes (grounded, specific, proportionate, aimed at a class that recurred), wrong claims, and which report a tech lead would rather act on. The skill reports are the re-runs above.

| Repo | Verified bugs (skill / baseline) | Top three (skill / baseline) | Preferred |
| --- | :---: | :---: | --- |
| maybe | 3 / 1 | 11 / 12 | skill, narrowly |
| healthchecks | 4 / 3 | 12 / 12 | skill, narrowly |
| zustand | 0 / 3 | 12 / 11 | baseline |
| go-task | 2 / 1 | 12 / 12 | tie |
| mealie | 3 / 2 | 11 / 12 | baseline |
| hexyl | 5 / 8 | 9 / 9 | baseline |
| greenfield | — | 8 / 9 | baseline, clearly |
| **Total** | **17 / 18** | **75 / 77 of 78** | **skill 2, baseline 4, tie 1** |

Neither arm reported a false bug or a claim the grader found wrong. Of 30 verified bugs, 6 were found by both.

- **The skill's edge is security:** 5 live security bugs against about 1, and every security bug in maybe came only from the skill. Its escaping and input-parsing rules find what a plain read passes over.
- **No edge on total bugs or on recommendation quality:** the model already writes grounded, specific fixes without it.
- **The baseline did better in three places,** each targeted by a v0.2 change (not yet re-tested):
  - It weighted recent history and harm. The skill ranked by all-time class size, so docs links (zustand) and layout overflow (mealie) topped its list. v0.2 adds the Recent and Severity columns.
  - It read the code openly where history was thin: hexyl, 8 bugs to 5. v0.2 adds the open pass.
  - It put tenant isolation first for the multi-tenant plan, and the catalog had no entry for it. v0.2 adds G31, Required once customers share a store. Its history so far: one-off fixes in maybe (`39d57a1`, a cross-family data leak) and mealie (`622abec4`, lookups scoped to the caller's group).

Bugs either arm found, checked by the grader, are now in `known_bugs`, so recall no longer favours the skill's own finds.

Caveats for this comparison: one run per arm; the grader was a session that had followed the skill's development, and the guardrail IDs make the skill's reports recognisable, so the grading wasn't blind; the skill reports predate the fixes listed above; four baseline clones couldn't fetch old diffs that the skill runs could; the hexyl and healthchecks bugs were checked by reading code, with no Rust or Python toolchain to run them.

## Caveats

- `cli-tool.json` and `frontend-scoped.json` were written after reading the first go-task and mealie runs, so their first-run scores are weak evidence.
- "Independent" means a separate agent with no context from the skill's development, but the same model, working from a brief the author wrote.
- Each scenario has run at most twice with the skill and once without it, on one model. No run on a smaller model.
