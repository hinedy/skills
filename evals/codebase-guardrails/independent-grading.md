# Independent grading: codebase-guardrails dry runs

Graded against the current eval files and the current `SKILL.md`, `GUARDRAILS.md` and `REPORT-TEMPLATE.md`. Written before opening `README.md`.

## Grading policy

- **Pass / Miss / Can't tell**, one line of evidence each. `Lnn` is a line number in the graded report.
- **Compound lines with a half that the report file can't show** ("gives the path in chat", "Does not edit GUARDRAILS.md"): Can't tell when the checkable half passes; Miss when the checkable half fails.
- **Live-bug markers**: lenient. A prose "Reproduced with …" counts as marked; no marker at all is a Miss.
- **Value line (audit 7)**: read as arithmetic on the row's own displayed inputs, plus the tie order. Whether a signal should exist at all is graded under audit 6 only, so one error isn't counted twice.
- **Old skill versions** (zustand, healthchecks, go-task, mealie predate parts of the catalog, e.g. G29/G30): graded against current expectations anyway, as asked. Version artifacts are named where they cause a Miss.
- Recomputed in the clones: fix-commit grep totals (maybe 280, healthchecks 761, go-task 495, zustand 355, mealie `-- frontend` 682; all match the reports), healthchecks sweep dates, go-task argument reads, zustand lint/bump commits in the top 300, and three live bugs (a maybe security bug whose details are withheld, maybe `DestroyJob`, mealie unawaited `validate()`), all confirmed.

## Summary

| Run | Eval | Pass | Miss | Can't tell | Passed / total |
| --- | ---- | :--: | :--: | :--------: | :------------: |
| maybe | audit-with-history | 5 | 3 | 2 | 5 / 10 |
| healthchecks | audit-with-history | 2 | 6 | 2 | 2 / 10 |
| go-task | cli-tool | 6 | 2 | 0 | 6 / 8 |
| mealie | frontend-scoped | 6 | 2 | 0 | 6 / 8 |
| zustand | library-with-docs | 4 | 3 | 0 | 4 / 7 |
| **All** | | **23** | **16** | **4** | **23 / 43** |

## maybe → audit-with-history.json (5 / 10)

1. **Can't tell.** Audit mode (Verdict column, Live bugs) and the file is `guardrails-audit.md` at the clone root (`git status`: `?? guardrails-audit.md`); "gives the path in chat" isn't visible in a file.
2. **Pass.** L5: grep run, "all 280 matches (fewer than 300 exist)", recomputed 280; sweeps noted per item (e.g. L104 "sweep, 3 commits"); 128 + 85 + 29 + 20 = 262 = items.
3. **Pass.** Classes are named by cause: "stale references left after a rename" (L104), "provider responses read raw with nullable fields" (L62), N2/N3 are cause-level.
4. **Pass.** Every Details block and the G25 one-liner carry path:line or grep counts (e.g. L57, L64, L251).
5. **Miss.** G10 is rated Convention (L40, L221) while L224 names two hand-assembled key sites outside `build_cache_key` and the Gap (L225) routes them through it: violations with compliant sites in the majority is Partial, not Convention. Other verdicts hold (G7 Met on AASM structure, G23 Missing at 131 physical vs 0 logical).
6. **Pass.** No roadmap (L4), so no raised fit; every zero-history row shows "—" and 0 (L33–45).
7. **Pass.** All 31 values recomputed correct (e.g. G18 7/3 = 2.33, G28 3/2 = 1.5). Ties correct: G12/G17 by number, G27 before N1 (G before N), value-2 group G5, G13, N3 (prevented 4) before G2 (prevented 2), zero rows by cost.
8. **Miss.** Order is Ranked (L9) → Details (L51) → N/A → New guardrails → Top three (L293) → Live bugs (L299). Both should follow Ranked, Live bugs first.
9. **Miss.** G7 (Met) is rank 18 (L32), above 12 non-Met rows (ranks 19–30). The top-three half passes: G11, G22, G4, G16 are all non-Met.
10. **Can't tell.** The report keeps N1–N3 in its own "New guardrails" (L258), consistent with not editing the catalog, but the file can't show what was edited.

## healthchecks → audit-with-history.json (2 / 10)

1. **Can't tell.** File at the clone root; chat not visible.
2. **Miss.** Capped at 300 (L5, from 761, recomputed). But sweeps were not counted once: L5 admits 22 of N1's 28 items are one sweep, and `git log` shows all 22 "use Flip.new_status" commits on 2024-04-12, plus a 5-commit "not disclose check's code" sweep on 2024-04-19..22. 300 commits became 300 items. There is also no one-off bucket: 159 + 54 + 87 = 300, with 16 real one-off bugs filed as polish (L374).
3. **Pass.** Classes are cause-level ("Inbound email parsed at each consumer", "schedule display copied per template", L56, L63). The G4 "field-level input edge cases (16)" class is a loose grab bag.
4. **Miss.** G29 and G30 have no row (31 ranked + 3 N/A = 34, against 30 + 6 N = 36). Their classes sit under N2 "Each output format has one escaper" (L156) and N3 "Writes to existing rows name their fields" (L113), which duplicate them. Version artifact, still a miss.
5. **Miss.** G18 (L279) and G25 (L263, "The rule is followed, but nothing enforces it") are (decision) guardrails followed everywhere, so Met; both are rated Partial. G6 (L181, all swallows narrow, "Nothing enforces") has no violations, so Convention, not Partial. The report has no Convention verdict at all (L7).
6. **Miss.** Signals given to 8 rows with fit "unchanged" (G23, G16, G13, G8, G9, G20, G15, G25; L19–43), including Met G9 (signal 2, value 2, L35). Under the current rules all should show "—" and 0. The cap is also wrong: L11 says 31; the median of the 24 class sizes is 5.
7. **Pass.** On each row's own inputs the values are right (G23 31/3 = 10.33, N3 10/2 = 5 before G24 5/1 = 5 by prevented, G7 3/3 = 1 before G1, G22, N6). Class sum L50 recomputed: 159 over 21 rows.
8. **Miss.** Top three (L351) and Live bugs (L357) come after New guardrails; Top three precedes Live bugs.
9. **Miss.** G9 (Met) at rank 21 and G3 (Met) at rank 30 sit above non-Met rows (G5…G25, G18). The top-three picks (N1, G11, N2, G4, G1, N3, N4) are all non-Met.
10. **Can't tell.** New guardrails kept in the report (L287); edits not visible.

## go-task → cli-tool.json (6 / 8)

1. **Pass.** L266–271: G5, G8, G9, G22, G25 N/A, each with a one-line reason.
2. **Miss.** L269 marks G12 N/A ("remote Taskfiles are reads (their timeouts sit under N7)"). No remote-fetch timeout is checked anywhere; N7's evidence (L124) covers checksum exits only.
3. **Pass.** G27 on released binaries (L64–69); G28 on the docs site (L78–83).
4. **Pass.** G16 is ranked and Missing (L38, L216–220), with a worst-case `--list` fixture gap.
5. **Miss.** L75 checks the working directory (6 `os.Getwd` sites) and environment reads, but not arguments: no count of `pflag.Args()`/`os.Args` reads, which exist in `args/args.go:17`, `internal/flags/flags.go:97` and `internal/complete/complete.go:10,15` (checked in the clone). The cited `flags.go:203-219` is env-var color detection.
6. **Pass.** UI gaps target the website only: G14 contrast check in the `website` job (L214), G23 stylelint for the docs site (L232); the CLI gets golden tests (L104, L220), not UI mechanisms.
7. **Pass** (lenient). The one live bug says "Reproduced with `WithInteractive(true)` …" (L375), not the template's `(reproduced)` tag.
8. **Pass.** L5: 202 + 23 + 32 + 28 = 285 = items; class sum L53 recomputed 202 over 21 rows.

## mealie → frontend-scoped.json (6 / 8)

1. **Pass.** L5 cites `git log --no-merges -- frontend`; its 682 matches equal my recount with `-- frontend` (unscoped differs). Other commands aren't shown, so "every" rests on this one.
2. **Pass.** L5: "7 of them out of scope: backend root cause", counted in dropped; L342 still names three out-of-scope security fixes (c738a047, 622abec4, fb221afa).
3. **Pass.** `guardrails-audit.md` at the clone root.
4. **Pass.** G8 (L116–121), G10 (L123–128), G14 (L81–86), G15 (L193–198), G16 (L53–58), G23 (L74–79): all verdicts with path:line or counts.
5. **Pass.** G28 N/A: "the docs site lives in `docs/`, outside the requested frontend scope" (L259). Wording, not the literal "(out of scope)" tag.
6. **Pass.** 135 + 82 + 48 + 28 = 293 = items (L5); class sum L49 recomputed 135 over 22 rows.
7. **Miss.** L246: the client re-implementation of the recipe-edit rule is under G22 as evidence, but "The two fixes it caused are counted under G5 (lower ID)". G22 shows 0 prevented (L43).
8. **Miss.** None of the seven live bugs (L324–330) says reproduced or read from code.

## zustand → library-with-docs.json (4 / 7)

1. **Pass.** L3: "a published npm package with nine subpath entries …, a docs site (`docs/`)".
2. **Miss.** G26, G27 and G28 have no row and no N/A entry (L14–45). Their classes went to new guardrails N1 (types), N2 (package shape), N3 (doc code) and N4 (links). Doc code and dead links were kept out of polish, but mapped to N3/N4, not G28.
3. **Pass.** L200: "G23: N/A. Text is English developer docs and console warnings".
4. **Pass.** G9 applies because "SSR … is a supported use, where a module-level store is shared by every request a server handles" (L152).
5. **Miss.** "examples: fix prettier / lint" (307c025), a lint follow-up, is counted in the N7 class (L95). The 16 drops are not itemized, so I can't check the rest.
6. **Miss.** The report is at `docs/guardrails-audit.md` (`git status`: `?? docs/guardrails-audit.md`), not the repo root.
7. **Pass.** Ties recomputed: N2 before N4 at 33 (equal prevented and cost, by number); G3, G6, G9 at value 1 by number. No G-vs-N tie occurs, so that part passes vacuously.

## 1. Expectations I think are badly written

- **"…and gives the path in chat" (audit 1, library 6) and "Does not edit GUARDRAILS.md" (audit 10).** A report file can't show either. Grade them from the transcript, or check a hash of the installed `GUARDRAILS.md` before and after the run.
- **Audit 6 and audit 7 overlap.** A row with a wrong signal fails 6 and, read strictly, fails 7 too. Read loosely, 7 passes on wrong inputs. Say that 7 checks arithmetic on displayed inputs, or fold the signal rule into 7.
- **Library 7 only tests order.** It can pass with wrong values, and on zustand its "G before N" clause has no case to test. It should also say "each value equals prevented × weight ÷ cost".
- **The sum lines in cli-tool 8 and frontend 6 drop "counts sweeps once".** Healthchecks-style per-commit counting would pass them, because the sum still adds up.
- **Audit 2 bundles four checks** (grep, cap, sweeps, sum). It fails as one line for any of them, which hides what broke. Split it.
- **Audit 9 bundles Met sorting with top-three selection**; both healthchecks and maybe pass one half and fail the other.
- **Audit 3, "Groups fixes by root cause, not by feature", is subjective.** A grab-bag class like healthchecks' "field-level input edge cases" passes. A testable form: "each class name states a cause, and no class name is a feature or page name".
- **Frontend 7 asserts G22 over G5, but the catalog doesn't clearly settle it.** G5's Rule ("clients display what it reports") and Code line ("a client copy of the role matrix") name the same cause as G22's Rule. If both Rules name it, the catalog's tie-break falls to the lower ID, G5, which is what mealie did. Either sharpen G5 to the manifest itself, or drop this line. It was also written after reading the run.
- **cli-tool 5 is written for go-task's own history** (working directory, arguments, env). It's fine as a case test but won't generalize to another CLI.
- **cli-tool 6, "UI mechanisms only for the docs site", is vague.** It doesn't say whether golden output tests or truncation fixtures for CLI output count as UI mechanisms.
- **cli-tool 7 and frontend 8 don't say whether the literal `(reproduced)` tag is required** or prose is enough.
- **Missing expectations:**
  - Every catalog ID appears as a row or as N/A.
  - No new guardrail duplicates a catalog entry.
  - The signal cap is the median of the class sizes.
  - A One-off section exists and names security fixes.
  - Zero-history rows show "—", not "0".
  - The scoreboard has all four verdict counts.
  - Met sorting for the non-audit evals.

## 2. Problems in the reports that no expectation catches

- **New guardrails duplicate catalog entries**, so G29/G30 (and in zustand G26–G28) vanish from the ranking:
  - healthchecks N2 = G29, N3 = G30.
  - go-task N4 = G29.
  - mealie N1 = G29 (raw HTML sinks), N4 = G30 (whole-object PUT).
  - zustand N1–N4 = G26–G28.
  
  This is a version artifact, but only audit-with-history line 4 catches it, and only for healthchecks.
- **Met rows are not sorted last** in go-task (N3 rank 5, G10 rank 18), mealie (N1 rank 7, G24 rank 25) and zustand (G19 rank 11). Their evals don't test this.
- **Top three and Live bugs come after New guardrails** in all five reports, including maybe, the latest version.
- **Signal caps are wrong:** mealie says 6 (I count 28 classes, not the 29 in L5, median 4); zustand says 62, "the highest prevented count" (median 8); healthchecks says 31 (median 5). maybe (5) and go-task (6) are consistent with their numbers.
- **Zero-history rows show "0" in the Signal column** instead of "—" (go-task L36–45, mealie L37–44, zustand L31–33).
- **No Convention verdicts in four reports.** Several are clearly followed-but-unenforced: go-task G11 "followed by convention, not enforced" (L207) and zustand G13 "follows it by convention" (L174) are rated Partial.
- **zustand counted no sweeps (300 commits, 300 items), has no One-off bucket or section, files real bugs as polish** ("one-off test and log-message tweaks", L303), has no `## N/A` heading (N/A bullets run on after G21 at L191), and gives signals to unchanged-fit rows (G2, G3, G6, G9, G1).
- **healthchecks never names the "not disclose check's code" sweep** (5 integrations leaking the check's ping code) as a security fix, and has no One-off section. Its G23 cost of 3 isn't on G23's Cost line (1 or 2).
- **go-task N2 ranks first only because of a self-written trigger.** Its raised fit (×2) comes from a trigger the report wrote into N2's own Cost line (L294). Unchanged, it would score 13.5 and rank 4th. Also, "fix: remove debug line" is counted as a real one-off bug (L386).
- **mealie G22 is rated Missing with 0 prevented** while its own evidence says two fixes came from it (L246).
- **No report gives the template's "<s> of the C class items were mapped from subject alone" figure** in the Evidence line.
- **Live bugs I spot-checked are real:**
  - maybe: a missing authorization check (security; details withheld until disclosed).
  - maybe `DestroyJob` writes `scheduled_for_deletion`, which `accounts` lacks (only `plaid_items` keeps it), so the failure applies to account deletion as stated.
  - mealie `households/index.vue:188` tests an unawaited `validate()`.

## Comparison with the author's grades (README.md, read after the above)

| Run | Author | Me | Lines in dispute |
| --- | :----: | :--: | --- |
| maybe | 8 / 10 | 5 / 10 | 1, 5, 10 |
| healthchecks | 5 / 10 | 2 / 10 | 1, 4, 10 |
| go-task | 7 / 8 | 6 / 8 | 5 |
| mealie | 6 / 8 | 6 / 8 | none |
| zustand | 4 / 7 | 4 / 7 | 5 and 7 (they swap, so the total is the same) |

Line by line:

- **maybe 1, healthchecks 1 (path in chat).** Author: Pass. Me: Can't tell.
  - The author saw the session, so the author is probably right about the chat half.
  - My grade follows the brief: judge only what the report file shows.
  - For healthchecks the author passes on "report at the repo root" alone and ignores the chat half.
- **maybe 10, healthchecks 10 (no edit to GUARDRAILS.md).** Author: Pass. Me: Can't tell.
  - Same reason. No artifact in the eval records this, so the author's Pass is an assertion, not evidence.
  - A hash of the catalog taken before and after the run would settle it.
- **maybe 5 (verdict rules).** Author: Pass, listing "G8 and G10 Convention". Me: Miss.
  - I think I'm right. The report's own G10 evidence (L224) names two cache-key sites hand-assembled outside `build_cache_key`, and its Gap (L225) routes them through the factory.
  - Convention requires no violations. With violations and compliant sites in the majority, the tree gives Partial.
  - This is an execution miss in the latest version, not a _later rule_.
- **healthchecks 4 (every applicable guardrail has a verdict with evidence).** Author: Pass. Me: Miss.
  - G29 and G30 are absent from the table. Their classes sit under N2 and N3, which repeat the catalog titles.
  - The author reads the line as "every row shown has evidence". I read "every applicable guardrail" as every catalog ID that applies.
  - I think mine is the line's plain meaning. The miss is _later rule_ (the catalog lacked G29/G30 then), but it is still a miss against current expectations, which is how the README says it grades.
- **go-task 5 (G4 against working directory, arguments and env).** Author: Pass, citing "`os.Getwd` (6 sites) and env reads". Me: Miss.
  - The author's own evidence names two of the three inputs.
  - The report has no count of argument reads, although `pflag.Args()` and `os.Args` are read in four non-test files.
  - I think I'm right, and it's a skill-execution miss, not a later rule.
- **zustand 5 (drops scripts, bumps, lint rollouts).** Author: Pass. Me: Miss.
  - "examples: fix prettier / lint" (307c025), a lint/format follow-up that the catalog says to drop, is listed as a class item under N7 (L95).
  - The author may be right that the script commit, the bumps and the eslint rollout were dropped, but the report doesn't itemize the 16 drops. One visible misfile is enough to fail "Drops …".
- **zustand 7 (tie order).** Author: Miss ("N2 and N4 left in arbitrary order"). Me: Pass.
  - The output order N2 then N4 is what the rule gives: equal value, prevented and cost, both N, so by number.
  - The author grades intent: the report's header (L11) states only "higher prevented first", so the order wasn't derived from the full rule.
  - The expectation tests the order, and the order is correct, so I'd keep Pass and note that it passes by luck.

Where we agree but I'd describe it differently:

- **"Every miss traces to a rule added after that run" (README L30) doesn't hold.** maybe 5 (G10) and go-task 5 (G4 arguments) are misses the rules at the time already covered.
  - The healthchecks verdict misses on G18 and G25 are borderline. The (decision) marker may postdate that run, so I can't call them.
  - The claim also leans on version history that the reports can't show. The README gives no evidence for when each rule landed.
- **The README's v0.2 gaps leave out the shared failures.** All five reports, including the latest (maybe), fail section order. Three of the four runs whose evals don't test it also fail Met sorting. That is worth a dedicated expectation in every eval, not only audit-with-history.
- **mealie 7 (G5 vs G22) is labeled _later rule_ ("old lower-ID tie-break"), but the lower-ID tie-break is still in the current catalog.** It's the third step under "A class that fits two guardrails", and G5's Rule and Code line name a client copy of the role matrix too. Unless G5's wording changes, a re-run can reach G5 again by the current rules.

## Re-runs on the current version (2026-11-25)

Seven re-runs, under `scratchpad/rerun/`, graded with the policy above: Can't tell for an unverifiable half when the checkable half passes, lenient live-bug markers, and value lines graded on arithmetic and tie order.

Eval files re-read. `cli-no-history.json` now pins hexyl and `plan-greenfield.json` names editable roles. `audit-with-history.json` has no new line: its signal line is still line 6, unchanged since the first grading. The skill files are unchanged since the first runs (all dated 2026-11-24 21:38).

Recomputed or checked in the clones:
- All class sums, item totals, values, tie orders and catalog coverage.
- The healthchecks sweeps and the zustand drop list (`_work/zustand/tally.txt`).
- go-task's remote timeout (`setup.go:76`, default 10 s at `internal/flags/flags.go:169`) and escaper.
- Six live bugs: a maybe security bug (details withheld), the go-task glob escaper, mealie's single toast, hexyl's hex `--block-size` and `.deb` description, and the hexyl read loop.
- Four first-run bugs that the re-runs no longer list, all still present in the code:
  - maybe: a security bug (details withheld), and the Plaid lock overwrite.
  - zustand: `persist` returning before `api.persist` is set.
  - go-task: the post-prompt `FastCompiledTask` recompile.

### Summary

| Run | Eval | Pass | Miss | Can't tell | Passed / total | Earlier |
| --- | ---- | :--: | :--: | :--------: | :------------: | :-----: |
| maybe | audit-with-history | 6 | 2 | 2 | 6 / 10 | 5 / 10 |
| healthchecks | audit-with-history | 7 | 1 | 2 | 7 / 10 | 2 / 10 |
| zustand | library-with-docs | 6 | 0 | 1 | 6 / 7 | 4 / 7 |
| go-task | cli-tool | 5 | 3 | 0 | 5 / 8 | 6 / 8 |
| mealie | frontend-scoped | 8 | 0 | 0 | 8 / 8 | 6 / 8 |
| hexyl | cli-no-history | 5 | 0 | 0 | 5 / 5 | — |
| greenfield | plan-greenfield | 5 | 1 | 1 | 5 / 7 | — |
| **All seven** | | **42** | **7** | **6** | **42 / 55** | |
| **The five re-graded** | | **32** | **6** | **5** | **32 / 43** | **23 / 43** |

### maybe → audit-with-history (6 / 10)

1. **Can't tell.** The report is `guardrails-audit.md` at the clone root; whether the path was given in chat isn't visible.
2. **Pass.** L5: 280 matches (I recount 280), "sweeps counted once". 129 + 83 + 42 + 20 = 274 items.
3. **Pass.** Classes are named by cause: "provider response fields missing or null", "CSV import values not parsed at the door" (L75).
4. **Pass.** All 30 catalog IDs are present (32 rows + 2 N/A = 34 = 30 + 4 N). Every block and one-liner has path:line or counts (L247–251 included).
5. **Miss.** G30 is rated Met (L250) on `Enrichable` locks "and strong params". But `app/models/plaid_entry/processor.rb:15-19` assigns `amount`, `currency` and `date` with no lock check (checked in the clone), the lost-update bug the first run reported. G22 is Met (L247) while `sankey_chart_controller.js:112,201` still formats money in the browser. Neither verdict rests on enforcement.
6. **Pass.** No roadmap and no raised fit; every zero-history row shows "—" and 0.
7. **Miss.** Values and the non-Met ties are right (e.g. G4 16/2 = 8 before G17 8/1 = 8 on prevented; G8 before N1). In the Met group, though, G7 (cost 2, L43) sits above G9 and G30 (cost 1, L44–45), which breaks "then lower cost".
8. **Pass.** Ranked → Live bugs (L52, all three security) → Top three (L58) → Details.
9. **Pass.** All five Met rows are last (L42–46). Top three are G11, G4 and G17, all non-Met.
10. **Can't tell.** New guardrails stay in the report; edits to the catalog aren't visible.

### healthchecks → audit-with-history (7 / 10)

1. **Can't tell.** File at the root; chat not visible.
2. **Pass.** 300 fix commits plus 16 CHANGELOG entries (L5). The 22-commit `Flip.new_status` sweep counts once (L148), and so does the 5-commit "disclose" sweep (L280). 86 + 41 + 30 + 115 = 272 items.
3. **Pass.** Classes are causes: "inbound email bodies parsed ad hoc" and "per-transport schedule formatting" (L71, L78).
4. **Pass.** G29 and G30 are now rows (L17, L25), with all 30 IDs present (31 + 3 = 34 = 30 + 4 N). One-liners carry evidence (L195–219).
5. **Miss.** Two Convention verdicts name violations:
   - G17 is Convention (L111) while `cronsim` and `oncalendar` are imported in 4 modules each outside `hc/lib` (L115).
   - G2 is Convention while "4 sites build it inline" (L195).

   With violations and compliant sites in the majority, the tree gives Partial.
6. **Pass.** No signals; the cap of 4 is correct (median of the 22 class sizes, recomputed).
7. **Pass.** All values and tie orders recomputed correct (e.g. N1 4/2 = 2 before G30, N2 and N4 at 2/1; Met G3, G9, G15, G25 by cost).
8. **Pass.** Live bugs (L52, the security item first) and Top three (L61) come right after Ranked.
9. **Pass.** Met rows are last (L42–45); the top three are G4, G11 and G29.
10. **Can't tell.**

### zustand → library-with-docs (6 / 7)

1. **Pass.** L3: published npm package with subpath entries, docs site, example apps.
2. **Pass.** G26, G27 and G28 are ranked 3rd, 2nd and 1st (L15–17). Wrong doc code (52) and dead links (28) go to G28 (L64), not polish.
3. **Pass.** L181: "G23. Localization: only developer-facing console messages."
4. **Pass.** L3 and L147: G9 applies "through consumers' SSR servers".
5. **Pass.** In `_work/zustand/tally.txt` these are `dropped`:
   - 307c025 "examples: fix prettier / lint" (counted in a class last time);
   - 234a948 and f689d78 (lint rollouts);
   - 08ec944 and 07b32d6 ("fix" scripts);
   - b06a8a0 (`fix(deps)`);
   - e7d4593 (a revert of a bump).

   Borderline: fa04478 "chore(immer): fix security issue", a peer-range bump, is kept as a one-off security fix.
6. **Can't tell.** Now at the repo root (`?? guardrails-audit.md`); chat not visible.
7. **Pass.** G4 before G17 (both 6, cost 1, by number); G7 before G18 (both 0.67, prevented 2, cost 3); Met N2 3, then by cost.

### go-task → cli-tool (5 / 8)

1. **Miss.** G5, G9 and G25 are N/A with reasons (L212–216), but G8 is applied to "terminal prompts" (L26, L142) and G22 to the completion engine (L35, L201). G8's Applies when needs dialogs, drawers or sheets; G22's needs a client rendering server-computed data. Both are stretched to avoid a new guardrail.
2. **Pass.** G12 is applied and its timeouts checked: "Remote reads run under `context.WithTimeout` (`setup.go:76`, default 10s …), and `noctx` lint enforces contexts" (L204). Confirmed in the clone.
3. **Pass.** G27 for GoReleaser artifacts (L72–77); G28 for the VitePress site (L79–84).
4. **Pass.** G16 Partial (L183–187).
5. **Miss.** G4's evidence (L104) covers env reads and `.taskrc`. Working-directory context moved into N1's class (L67, L69), and there is still no count of `os.Args`/`pflag.Args()` reads.
6. **Miss.** The G8 gap recommends a dialog-lifecycle mechanism for the CLI's prompts (`Confirm` on `input.Prompter`, L147). The change itself is sensible, but it is G8's UI mechanism applied to the CLI, which this line forbids. Line 1 also penalizes it; see the notes below.
7. **Pass.** Both live bugs end "(reproduced)" (L54–55). I confirmed the 4-character `escape` (`internal/execext/exec.go:89-95`) and the `continue` on error (`internal/fingerprint/glob.go:17-19`).
8. **Pass.** 190 + 27 + 44 + 30 = 291; class sum L50 recomputed 190 over 18 rows.

### mealie → frontend-scoped (8 / 8)

1. **Pass.** L5: `git log --no-merges -- frontend`.
2. **Pass.** L5 counts 17 real out-of-scope fixes in dropped. L305 names the out-of-scope security fixes (622abec4, fb221afa, c738a047, 55166104, …) and the in-scope ones in classes.
3. **Pass.** `guardrails-audit.md` at the clone root.
4. **Pass.** G8 (L94–100), G10 (L214–219), G14 (L109–114), G15 (L221–226), G16 (L65–70) and G23 (L79–84), each with counts or path:line.
5. **Pass.** G13, G27 and G28 are "out of scope" (L257, L260, L261).
6. **Pass.** 142 + 70 + 52 + 31 = 295; class sum L49 recomputed 142 over 24 rows. The tally matches: 142 class, 70 one-off, 52 polish, 31 dropped, plus 5 sweep lines.
7. **Pass.** L174: "permission re-derived on the client (3)" under G22; G5 keeps only route-middleware and menu fixes (L181).
8. **Pass.** Each live bug ends "(… read from code.)" (L53–55).

### hexyl → cli-no-history (5 / 5)

1. **Pass.** L193–203: G5, G8, G9, G10, G14, G15, G21, G22, G24 and G25 are N/A, each with a reason. G1, G12 and G30 are also N/A (L192, L197, L204).
2. **Pass.** G16 is Missing (L118–123).
3. **Pass.** L5: 1 commit, 17 CHANGELOG bugfix entries (under 20), tracker not consulted; "each guardrail's Code line is the evidence, and Prevented counts files matching the Code line".
4. **Pass.** L85: 6 hand-parsed `String` args, `NO_COLOR` at `main.rs:369`, `HEXYL_COLOR_*` at `colors.rs:22`.
5. **Pass.** No UI mechanism. G14 and G15 are N/A; the gaps are clap value parsers, typed builder arguments, cargo lints and a C-identifier escaper.

Outside the eval:
- L46 says "16 classes across 17 guardrails"; 16 guardrails have counts (sum 21, recomputed).
- G23 takes cost 3 (L156), which isn't on G23's Cost line (1 or 2), as healthchecks did before.
- Its live bugs are real:
  - a hex `--block-size` returns `Ok(())` at `main.rs:301-307` with no output;
  - `CICD.yml:299` ships "A command-line benchmarking tool" as the `.deb` description;
  - `lib.rs:715,725` drop read errors.

### greenfield → plan-greenfield (5 / 7)

1. **Can't tell.** Plan mode was chosen (no Verdict column, no Live bugs), and L1 says the reply was saved from chat. That no file was written can't be seen from the saved copy.
2. **Pass.** L9: "The project is greenfield, so there are no commits, issues or code."
3. **Pass.** Every value is weight ÷ cost (2/1 = 2, 1/1 = 1, 2/2 = 1, 1/2 = 0.5). At 1.0, the cost-1 unchanged rows precede the cost-2 raised rows, as "lower cost" requires.
4. **Pass.** G23 (L42, L64), G24 (L24) and G5 (L34, L62, citing "roles each customer can edit") are raised.
5. **Pass.** G25 is N/A (L73), not raised.
6. **Pass.** Light versions are named (L66, "light version"; L56 "constants" → catalog). There are 10 traps (L84–93).
7. **Miss.** The Verdict column, Gap and Live bugs are gone. But the Evidence header line stays (L9), and the Scoreboard assigns verdicts ("25 missing", L11). The run itself lists "drop the Evidence parts" as ambiguous (L114).

### Earlier vs re-run, same repo

**Improved:**
- Catalog coverage is complete in all five re-graded repos. G26–G28 (zustand) and G29/G30 (healthchecks, go-task, mealie) are used instead of re-invented. Mapping onto catalog guardrails is mostly fixed now.
- Section order and Met-last sorting pass in all five; every report failed both before.
- healthchecks counts sweeps once (300 → 272 items) and keeps a One-off bucket that names the "disclose" sweep as security.
- Signals are given only to raised fits, and the caps are medians (maybe 5, healthchecks 4, mealie 3).
- Zero-history rows show "—"; Convention verdicts exist; the "s of C" figure is in every Evidence line.
- zustand's report moved to the repo root and its lint/script commits are now dropped.
- mealie maps permission re-derivation to G22 and marks every live bug.
- go-task applies G12 with the real 10 s remote timeout, instead of N/A.

**Regressed:**
- **go-task N/A discipline (6/8 → 5/8).** Avoiding new guardrails pushed classes into catalog IDs whose Applies when doesn't hold: completion scripts into G22, terminal prompts into G8. The first run's N3 and its own prompt class were better fits.
- **Verified live bugs drop out between runs.** Each of these is still in the code at the pinned commit:
  - maybe: a security bug (details withheld), the `DestroyJob` column, the Plaid lock overwrite (the impersonation-log FK was not checked).
  - zustand: the `persist` early return.
  - go-task: the post-prompt `FastCompiledTask`.
  - mealie: the unawaited `validate()` at `households/index.vue:188`.
- **maybe now rates G30 Met** over the very overwrite the first run reported as a live bug.

**Stayed broken:**
- **Convention given despite named violations:** maybe G10 last time; healthchecks G17 and G2 now. zustand rates N1 Convention with "two sites still branch on their own" (L108).
- go-task G4 still doesn't count argument reads.
- Tie order slips once per run (maybe's Met group).
- Costs not on the Cost line: G23 = 3 in hexyl, healthchecks before.
- **A new guardrail overlapping a catalog clause:** mealie N1 "one deduplicating cache keyed by stable keys" restates G10's "cache keys come from one factory per domain". The first run put those fixes under G10.
- zustand read 40 diffs, over the 30-diff cap (L5).

**Run-to-run variance.** The ranking is stable; live bugs are not.

- **Top three changes.** Two of three repeat in each repo:
  - maybe: G11 and G4.
  - healthchecks: G4 and G11.
  - zustand: all three, as the same areas (types, package shape, docs).
  - go-task: variable precedence and G27.
  - mealie: G16 and G17; G23 was folded into the first run's #2.
- **Largest-class counts move 10–30%:**
  - maybe G4 19 → 16, G11 16 → 12;
  - healthchecks G4 31 → 21, after sweeps;
  - zustand G26 42 → 29, docs 95 → 87;
  - go-task variable class 27 → 31, G4 28 → 20.
  - Classes also change homes: maybe's "stale references" class went from G19 (10) to N1 (8), and its sign-classifier class (N3, 4) mostly became G22 (3).
- **Live bugs barely overlap:**

  | Repo | First run | Re-run | Same bug |
  | --- | :--: | :--: | --- |
  | maybe | 9 | 3 | 2 (both security; details withheld) |
  | healthchecks | 4 | 4 | 1 (curl timeout); plus 1 same class at different sites (full `save()`) |
  | zustand | 2 | 0 | 0 |
  | go-task | 1 | 2 | 0 |
  | mealie | 7 | 3 | 2 (a security bug, details withheld; `QueryFilterBuilder` date); plus 1 restated (generic toast) |

  - Across the five repos that is 23 + 12 bugs, with 5 found by both runs: about 17% of the 30 distinct bugs.
  - At least 8 of the 25 bugs only one run found are verified real and still present.
  - One first-run bug was mis-described: mealie's "two toasts" is one reactive toast, overwritten (`composables/use-toast.ts:13-34`), as the re-run says.
  - A single run therefore finds a sample of the live bugs, not the set. The scores above don't measure that, because no eval line checks recall.

### Skill problems to fix first, ranked, as rule changes

1. **Make live-bug finding repeatable and tie it to verdicts.**
   - **Baseline carry-forward (SKILL.md step 5).** "When an earlier `guardrails-audit*.md` exists, re-check each of its Live bugs and list it as still present, fixed, or wrong, with evidence." The skill already keeps the old report as a baseline but never reads it.
   - **Met excludes live bugs (step 5 tree).** "A guardrail with a live bug, or with any site named in its Evidence or Gap that violates the rule, can't be Met or Convention."
   - This would have stopped maybe's G30 Met, and healthchecks' G17/G2 and zustand's N1 Convention. It is the largest single source of wrong verdicts across both rounds.
2. **Close the Convention loophole in wording.** In the step-5 tree, put "Any violations?" before "Enforced?". Add to the template: "Convention: zero violating sites found; say the count was 0." Today three runs out of seven cite violations and still write Convention.
3. **Make Applies when literal, and say what to do when nothing fits.** Add to GUARDRAILS.md "Reading an entry": "Applies when is a precondition, not an analogy. A terminal prompt isn't a dialog (G8); a shell script calling its own binary isn't a client of a server (G22). If no guardrail's Applies when holds, write a new guardrail." This stops the over-correction seen in go-task now that duplicate N-guardrails are gone.
4. **Spell out the CLI inputs in G4's Check.** "Count raw reads of argv, the working directory and environment variables outside the parse module, each separately." go-task missed arguments twice.
5. **Give Plan mode its own template variant.**
   - No Scoreboard verdicts and no Evidence header in Plan mode.
   - In greenfield, "Always" guardrails take fit unchanged.
   - A **Required** guardrail (G5 and G22 when roles vary per customer) ranks above every non-Required row.
   - New guardrails are allowed in Plan mode from the roadmap alone. The greenfield run couldn't add tenant data isolation, which the catalog lacks.
   - The greenfield run raised all of these as blocking (L109–113).
6. **Add a mechanical self-check to step 6's Done when.** "Re-sort the table from its own columns (Met last, then value, prevented, cost, G before N, number). Check that every cost appears on its guardrail's Cost line or the Reading-an-entry rules, and that the 'classes across guardrails' count matches the rows with a non-zero count." This would catch maybe's Met-group order, G23 = 3 in hexyl, and hexyl's "16 across 17".
7. **Enforce the 30-diff cap or raise it.** zustand read 40 and said so. Either cap it hard or state the cap per 100 items. The mapped-from-subject share (101/129, 69/86, 151/181, 190/190, 123/142) shows most mapping is from subjects alone, which is where class placement drifts between runs.

### Notes on the evals from this round

- **cli-tool lines 1 and 6 double-penalize one decision (G8 on prompts).** Line 6 should say which mechanisms count as UI (tokens, contrast, layout primitives, dialog components), or be dropped in favour of line 1.
- **cli-tool line 1 should also list G12 as applying,** since line 2 requires it. A run that marks G12 N/A fails only line 2 today.
- **No eval line measures live-bug recall or stability.** Given the overlap above, add to audit-with-history: "Lists as live bugs at least the known ones" (the verified set per repo, kept in the eval file), or a stability check across two runs.
- **plan-greenfield line 7 is ambiguous about the Evidence header and the Scoreboard,** and the run flagged it. Decide in the template (fix 5) and then grade against it.
