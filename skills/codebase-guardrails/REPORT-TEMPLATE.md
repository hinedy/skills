# Report template

Contents: [Scoring rules](#scoring-rules) · [Plan mode](#plan-mode) · [Self-check](#self-check-before-finishing) · [Structure](#structure)

## Scoring rules

- **Cost**: the cost of the version the Gap recommends. When the Cost line names a trigger that isn't reached, use the lightest cost it lists; the fit, not the cost, carries the "not yet".
- **Recent**: the class items dated in the newest third of the evidence window's date range (the tally's dates; a sweep takes its last commit's date). Recent is "—" whenever prevented is 0. Say the cut-off date in the Evidence line. Why: a class that stopped recurring years ago needs no gate today, and one still landing does.
- **Severity**: ×2 when any item in the row's classes is a security bug, data loss or corruption, or a wrong number or date a user would trust; ×0.5 when every item is layout, styling, copy or docs text; ×1 otherwise. Rows with no items (signal rows, the Code-line path, greenfield Plan mode) are ×1. Why: ten misaligned buttons cost less than two wrong invoices.
- **Code-line path** (no usable history): each guardrail's count is the number of files matching its **Code** line (or the named proxy). Put it in Prevented, leave Recent and Signal "—", apply no cap, and say "Code-line path" in the Evidence line. Write the classes line as "Classes: none (Code-line path)", drop the cap from the Ranked note, and skip the self-check's class-count step.
- **Signal**: only for a guardrail with a prevented count of 0, a **raised** fit, and (in Audit mode) a verdict other than Met. It is the number of files matching its **Code** line (or the named proxy), capped at the median of the item counts per class (rounded up, new guardrails' classes included). Every other guardrail with no history shows "—" for signal and has a value of 0. Why: the roadmap can lift a forward-looking guardrail to the middle of the ranking, but a grep count must never outrank bugs that actually recurred, and a guardrail nobody needs yet must not rank at all.
- **Value** = (prevented + recent, or signal when prevented is 0) × fit weight × severity ÷ cost. In greenfield Plan mode, value = fit weight ÷ cost.
- **Sort** Met rows after every other verdict; their value stays visible as history but they are not work. Within each group, sort by value; break ties by higher prevented + recent, then lower cost, then catalog IDs (G) before new ones (N), then number.
- **Top three changes** come only from rows that aren't Met.
- **Live bugs come first.** They are listed before the top three changes, security bugs first, whatever their guardrail's rank. Why: rank measures how often a class recurred; a live bug is what to fix today.
- **New guardrails** (N1, N2, …) count in the scoreboard, the ranked table and the class sum.

## Plan mode

Plan mode reports in chat and uses the structure below with these changes:

- No verdicts: drop the Scoreboard, the Verdict column, the Evidence header line, each Details block's Evidence and Gap lines, and the Live bugs section. Put the stack-specific form on the Fit line.
- In greenfield, also drop the Recent and Severity columns and Severity lines. A Plan for existing code (a rewrite) keeps them, because step 2 gave it items.
- In greenfield, guardrails that apply "Always" keep an unchanged fit unless a roadmap line names their concern.
- **Required first.** Rows the catalog marks **Required** for this roadmap (G5 and G22 when roles vary per customer or become editable; G31 when two or more customers share one store) rank above every other row. Why: with no history, many rows tie, and Required is the catalog's own statement of what can't wait.
- Use the cost of the version you'd recommend.
- New guardrails may come from the roadmap: a risk the roadmap creates that no catalog entry covers gets an N row, citing the roadmap line.

## Self-check (before finishing)

- Re-sort the ranked table from its own columns, and confirm the order.
- Check each row's cost against its guardrail's Cost line, and each value against count, recent, weight, severity and cost.
- Check that "Classes: … in <K> classes across <rows> guardrails" matches the rows that have a prevented count.
- Check that no Met or Convention row has a live bug or a violating site named anywhere in the report.

## Structure

ALWAYS use this structure, in this order. Replace every `<…>`. Plan mode changes it as described under Plan mode above.

```markdown
# Guardrails audit: <repo or project name><, scope: <path> for a scoped audit>

**Stack:** <languages, frameworks, store>. **Parts:** <UI, server, package, docs, …; roles; customers; locales>.
**Roadmap:** <what's coming that changes fit, or "none found">.
**Evidence:** <source used; say if an issue tracker was unreachable>. <N> items (sweeps counted once), <first date> to <last date>: <C> in <K> classes, <O> one-off, <P> polish, <D> dropped<, of them <d> real fixes outside the scope — scoped audits only>. Recent: since <cut-off date>. <s> of the <C> class items were mapped from subject and file list alone, without reading the diff; <r> diffs read.

**Scoreboard:** <n> met · <n> convention · <n> partial · <n> missing · <n> N/A (new guardrails included)

## Ranked

Value = (prevented + recent, or signal when prevented is 0) × fit weight × severity ÷ cost. Signal cap (median items per class): <n>. Met rows sort last. Ties: higher prevented + recent, then lower cost, then G before N.

| Rank | ID | Guardrail | Verdict | Cost | Prevented | Recent | Signal | Fit | Severity | Value |
| :--: | -- | --------- | ------- | :--: | :-------: | :----: | :----: | --- | :------: | :---: |
| 1 | G<n> | <title><" (roadmap)" if it applies only on the roadmap> | <Convention/Partial/Missing> | <1–5> | <count> | <count or —> | <count or —> | <raised ×2 / unchanged ×1 / lowered ×0.5> | <×2 / ×1 / ×0.5> | <value> |
| <n> | G<n> | <title> | Met | <1–5> | <count> | <count> | — | <fit> | <severity> | <value> |
| — | G<n> | <title> | N/A | — | — | — | — | — | — | — |

Classes: <prevented counts summed> = <C from Evidence>, in <K> classes across <rows> guardrails.

## Live bugs

- `<path:line>`: <what goes wrong> (G<n>). <(reproduced) or (read from code)>. Security bugs first.
- From the earlier report, when one exists: `<path:line>`: <bug> — <still present / fixed / wrong>, with the evidence.

## Top three changes

1. **<change>** (G<n>, G<n>): <what to do>.
2. …
3. …

## Details

### G<n>. <title> — <verdict>

**Prevented (<count>, <r> recent):** "<subject>", "<subject>". When one guardrail holds several classes, list each: <class> (<count>): "<subject>". Mark a sweep: "(sweep, <n> commits)". Omit this line when the count is 0.
**Signal (<count>):** <what matched, or the proxy and why>. Only when the scoring rules give a signal.
**Fit:** <raised/unchanged/lowered>. <one-line reason, naming any cost condition or roadmap line>.
**Severity:** <×2 or ×0.5>: <the item that sets it>. Omit this line when ×1.
**Evidence:** <`path:line`, grep count or config line>.
**Gap:** <smallest change that closes the class, naming the stack's API, lint rule or config, marked "(unverified)" or "(repo-internal)" when not checked against docs>; or "none"; or "only a trap reaches Met: <trap>".

<one Details block per applicable guardrail, in rank order. A Met guardrail with no history gets one line instead: "G<n>. <title> — Met: <evidence>.">

## N/A

- G<n>. <title>: <one-line reason, or "out of scope">.

## New guardrails

<each in the catalog's form (Rule, Why, Applies when, History, Code, Check, Cost, Trap if one exists); or "none">

## Traps to avoid

- **<heavy version> (G<n>).** <why it fails here>.

## One-off

<count> real bugs with no second occurrence: <2–3 examples>. Security fixes: <hashes and subjects, or "none">.

## Polish

<count> fixes no guardrail would have prevented: <2–3 kinds>.
```
