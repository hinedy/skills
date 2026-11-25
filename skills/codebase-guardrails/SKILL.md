---
name: codebase-guardrails
description: Finds the architecture guardrails that make recurring bug classes impossible, for any stack or product domain. Use when asked what keeps breaking, when mining fix history or issues for root causes, when deciding architecture up front for a new project or rewrite, or when auditing a codebase against guardrails.
license: MIT
compatibility: Needs git for history mining. Network access lets step 4 check current framework docs.
---

A bug that keeps coming back belongs to a **bug class**: two or more fixes with one root cause. Each class points to a missing **guardrail**, a decision that makes the class impossible to write. Fixing bugs one at a time leaves the class open; the guardrail closes it. The catalog is [`GUARDRAILS.md`](GUARDRAILS.md): its index is enough for step 1, and steps 2–5 read the full entries and its "Reading the history" and "Reading an entry" rules. The report format and scoring rules are in [`REPORT-TEMPLATE.md`](REPORT-TEMPLATE.md).

Pick the mode:

```
Is the request about code that exists?
├─ no  → Plan: steps 1–4, then 6; report in chat
└─ yes → Does it ask where the code stands, or what to fix?
         ├─ yes → Audit: steps 1–6; report to a file
         └─ no  → Plan
```

## 1. Profile the codebase

Mark which parts exist now and which the roadmap adds: UI, server, persistent store, queue, CLI, published package, binary or container image, docs site, more than one shipped app, more than one role, more than one customer, more than one locale. Read the roadmap (product docs, planning notes, project memory) and note the stack. When the request names part of the repo ("audit the frontend"), profile only that part, and mark guardrails that need a part outside it "N/A (out of scope)". When a part exists only in consumers' apps (a library used on servers), mark the guardrail as applying and say why.
Why: a guardrail for a part the code doesn't have is noise in the report, and a part the roadmap adds is where guardrails are cheapest, before the code exists.
**Done when** every guardrail in the index is marked applies or N/A, each N/A has a one-line reason, guardrails that apply only on the roadmap carry the "(roadmap)" marker, and the stack is named.

## 2. Gather evidence

Use the 300 most recent commits (or items) from the first source that has 20 or more, and add the later sources if they exist. For a scoped request, add `-- <path>` to every `git log`.

```
Fix commits ≥20?  git log --no-merges --format='%h %ad %s' --date=short | grep -iwE '(fix|fixes|fixed|hotfix|revert|bug)' | head -300
├─ yes → use them; add a bug log, issue labels or postmortems if reachable (say so if not)
└─ no  → Issue tracker, bug log or incident notes with ≥20 items?
         ├─ yes → use them, plus churn: git log --format= --name-only | sort | uniq -c | sort -rn | head -30
         └─ no  → Code exists?
                  ├─ yes → each guardrail's Code line is the evidence; count matches, not fixes
                  └─ no  → greenfield: skip step 2; in step 3, write new guardrails for roadmap risks the catalog lacks
```

If an earlier `guardrails-audit*.md` exists, re-check each of its live bugs at the current code and mark it still present, fixed, or wrong.

Apply the catalog's **Reading the history** rules (drops, sweeps, reverts, when to read a diff), then sort each item into one bucket:

- **class**: two or more items with one root cause. Name the class by its cause, never by feature: "query fired with an empty id on the orders page" and "the same on the settings page" are one class, "missing-id queries", not "orders bugs".
- **one-off**: a real bug with no second item. Name any security fix.
- **polish**: see the catalog's last section.
- **dropped**: not a fix, or (scoped audits) a real fix outside the scope; still name security fixes.

Keep a tally outside the repo, one `hash date bucket guardrail` line per item (a sweep takes its last commit's date; guardrail blank for one-off, polish and dropped). The dates give the report its Recent column.
Why: grouping by feature hides the pattern that the guardrail closes.
**Done when** each class has a count and 2–4 example subjects, and classes plus one-off plus polish plus dropped add up to the total.

## 3. Map classes to guardrails

Match each class to a guardrail by its **Rule**, **History** or **Code** line; one guardrail may hold several classes. A guardrail's **Applies when** is a precondition, not an analogy: a terminal prompt isn't a dialog, and a script calling its own binary isn't a client. A class that matches none gets a new guardrail (N1, N2, …) in the catalog's form, written into the report under "New guardrails". Never edit `GUARDRAILS.md`: it's an installed file, and the next update overwrites it.
**Done when** every class has a guardrail ID, and every applicable guardrail has a prevented count (zero is valid).

## 4. Fit forward and translate

For every applicable guardrail, set the fit:

```
Roadmap reaches the trigger in its Cost line,
or a roadmap item falls within its Applies when?  → raised    (weight ×2; cite the roadmap line)
Pain it prevents gone in the coming product?      → lowered   (weight ×0.5)
Otherwise (no roadmap, no trigger, or reached)    → unchanged (weight ×1)
```

Then translate the rule into the stack's mechanism. When the framework already ships a mechanism, recommend it over a custom layer, because a custom layer is code the team maintains and the framework's is not. Choose the version by the catalog's **Light first** principle. With network access, fetch the current docs for the mechanisms in the top three changes and in live-bug fixes; mark every other mechanism "(unverified)", and the repo's own code "(repo-internal)".
**Done when** every applicable guardrail has a fit with a one-line reason and a stack-specific form that is verified, "(unverified)" or "(repo-internal)".

## 5. Audit (Audit mode only)

Run every applicable guardrail's **Check**, including those with zero history, and assign a verdict:

```
Does code implement the rule anywhere?
├─ no  → Missing
└─ yes → Any violations? (a live bug, or a violating site named anywhere in the report, counts)
         ├─ none → Enforced by lint, the type checker, CI, or a structure that makes
         │         the violation unwritable (a constraint, an enum, a server-owned shape)?
         │         Or a (decision) guardrail?
         │         ├─ yes → Met
         │         └─ no  → Convention (state "0 violating sites"; the gap is the gate)
         └─ some → Compliant sites outnumber violations?
                   ├─ yes → Partial
                   └─ no  → Missing
```

Every verdict cites evidence: `path:line`, a grep count or a config line. A verdict without evidence is a guess; go look. Before writing a gap, confirm the current state isn't the framework's default or its recommended pattern. Then state the **gap**: the smallest change that closes the class. If only a trap would reach Met, say so and keep the verdict.

Then make the **open pass**: read for bugs the catalog doesn't name. With history, read the 10 source files most touched by step 2's fix commits, skipping any manifest (`package.json`, `go.mod`) the filter leaves in; for a scoped audit, add `-- <path>` to both git commands:

```
git log --no-merges --format='%h %s' | grep -iwE '(fix|fixes|fixed|hotfix|revert|bug)' | head -300 | cut -d' ' -f1 \
  | xargs git show --name-only --format= | sed '/^$/d' \
  | grep -viE '(^|/)(tests?|spec|__tests__|docs?)/|[._-](test|spec)s?\.|(^|/)test_|changelog|\.(md|mdx|lock|snap)$|-lock\.|\.sum$' \
  | sort | uniq -c | sort -rn | head -10
```

With no history, read the entry points (argument parsing, request handlers, the main read loop) plus the largest source files, up to 10 in all. Report each bug found under Live bugs, with its guardrail ID or "(outside catalog)".
Why: the catalog finds what its Check lines measure, and a plain read finds bugs no catalog entry names.
**Done when** every guardrail has a verdict, evidence and a gap (or "none"), and every file in the open pass has been read.

## 6. Report

Score, sort and fill [`REPORT-TEMPLATE.md`](REPORT-TEMPLATE.md) exactly: every section, every column, in its order, following its scoring rules.

In Audit mode, write to the user's path, or to `guardrails-audit.md` at the repo root if none is given (also for scoped audits; `guardrails-audit-YYYY-MM-DD.md` if that file exists, because the old report is the baseline the new one is compared against), and give the path in chat. In Plan mode, give the report in chat, following the template's Plan mode rules.
**Done when** every template section is filled and the template's self-check passes.
