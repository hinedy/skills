# Codebase Guardrails

An agent skill that finds the architecture decisions that make recurring bug classes impossible, in any stack or product domain.

Most fix logs repeat themselves. The same kind of bug comes back under a different feature name, and each fix closes one instance while the class stays open. This skill groups the fixes into classes, maps each class to the decision that would have made it impossible to write, scores what that decision costs, and tells you which three changes buy the most.

Install it with the rest of the collection ([how](../../README.md#install)), or on its own:

```bash
npx skills@latest add hinedy/skills --skill codebase-guardrails
```

## Try it

- "Audit this repo against the guardrails."
- "We're starting a new service. Which guardrails should we decide now?"
- "Look at our fix history. What keeps breaking, and what would stop it?"

## What you get

Two modes, picked from your request:

- **Plan**, for a new project or a rewrite: which guardrails apply, what each costs, and which to decide up front. Given in chat.
- **Audit**, for existing code: a verdict for every guardrail (Met, Convention, Partial, Missing, N/A) with `path:line` evidence and the smallest change that closes the gap. Written to `guardrails-audit.md` at the repo root, or wherever you ask.

Both end with a ranked table:

| Rank | ID  | Guardrail                                     | Verdict | Cost | Prevented | Signal | Fit          | Value |
| :--: | --- | --------------------------------------------- | ------- | :--: | :-------: | :----: | ------------ | :---: |
|  1   | G23 | Text and layout are ready for other languages | Missing |  1   |     0     |   6    | raised ×2    | 12.0  |
|  2   | G3  | Invalid calls can't be written                | Partial |  1   |     9     |   —    | unchanged ×1 |  9.0  |
|  3   | N1  | Money is stored as integer minor units        | Missing |  2   |    12     |   —    | unchanged ×1 |  6.0  |

**Prevented** counts past fixes the guardrail would have stopped. **Signal** counts files showing the guardrail's warning signs, only for guardrails the roadmap raises and that have no history yet; it's capped so it can't outrank real recurring bugs. **N1** is a guardrail the skill wrote because no catalog entry covered that class.

The ranked changes repeat from run to run; the live bugs are a sample. In testing, two runs on the same repo shared about 1 in 6 of the bugs they found, so re-run or re-check before treating the list as complete.

Right after the table come the live bugs it found (security bugs first) and the top three changes, then the details for each guardrail, any new guardrails, the heavy versions to avoid, one-off bugs (security fixes named) and the count of polish fixes no architecture would have prevented. Guardrails already rated Met sort to the bottom. See the full [sample audit](sample-audit.md).

## How it works

A **bug class** is two or more fixes with one root cause. Each class points to a missing **guardrail**: a rule that lint, the type checker, CI or the structure of the code (a constraint, an enum) enforces. The skill gathers evidence from fix commits, an issue tracker or the code itself, so it works on squashed repos and greenfield projects too. It maps classes to guardrails, scores each on a 1–5 cost scale, and raises or lowers it against your roadmap. It then translates the rule into your stack's own mechanism, from current docs, and recommends the light version unless the evidence shows the heavy one pays.

## The guardrails

**A. Boundaries**
- G1. Types at a boundary come from its contract
- G2. One error shape, translated in one place
- G3. Invalid calls can't be written
- G4. Outside input is parsed where it enters
- G29. Each output format has one escaper

**B. Access**
- G5. One capability manifest, decided by the authority

**C. Lifecycle and state**
- G6. Each error is reported exactly once
- G7. Multi-step processes have explicit states
- G8. Dialogs and drawers own their lifecycle
- G9. Session state can't outlive the session
- G10. Writes declare what they make stale
- G11. Formatting and time come from one module

**D. Data and concurrency**
- G12. Writes are safe to retry
- G13. Schema changes go expand, then contract
- G30. Updates write only the fields they change

**E. Interface (UI only)**
- G14. Design values are tokens, and raw values fail lint
- G15. Layout primitives own spacing, and data components own their loading state
- G16. Text is never assumed short, Latin or left-to-right

**F. Dependencies**
- G17. Vendor code sits behind an owned seam
- G18. Hard problems use maintained code

**G. Verification and tooling**
- G19. Critical flows are tested end to end in CI
- G20. CI is the authority, and local hooks stay small
- G21. Separately shipped apps have separate entries
- G22. The authority owns meaning

**H. Forward-looking**
- G23. Text and layout are ready for other languages
- G24. Tenant and deployment context come from one provider
- G25. Per-customer behavior is a flag

**I. Published packages and docs**
- G26. Public API types are pinned by tests
- G27. The package is checked as consumers install it
- G28. Code in the docs compiles, and links resolve, in CI

Each guardrail in [`GUARDRAILS.md`](../../skills/codebase-guardrails/GUARDRAILS.md) carries its rule, why it matters, when it applies, how its absence shows up in history and in code, how to check it, its cost, and the heavy version to avoid.
