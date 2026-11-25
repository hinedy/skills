# Guardrails audit: sample

> **Fictional example.** The app, paths and commits are invented to show the output of an Audit run. A real report covers every guardrail; this one shows 12 and one new guardrail.

**Stack:** TypeScript, React + TanStack Query web client, Node/Express API, Postgres. **Parts:** UI, server, store; three roles; one customer region; English only.
**Roadmap:** a public API for accounting integrations next quarter; an EU region with a German UI after that.
**Evidence:** fix commits. 120 items (sweeps counted once): 58 in 10 classes, 5 one-off, 36 polish, 21 dropped (e.g. "add bug report template", "rename fix-up script"). 31 of the 58 class items were mapped from subject and file list alone; 24 diffs read.

**Scoreboard:** 1 met · 0 convention · 7 partial · 4 missing (N1 included) · 1 N/A

## Ranked

Value = (prevented, or signal when 0) × fit weight ÷ cost. Signal cap (median items per class): 6. Met rows sort last. Ties: higher prevented, then lower cost, then G before N. Signal applies only to raised guardrails with no history.

| Rank | ID  | Guardrail                                     | Verdict | Cost | Prevented | Signal | Fit          | Value |
| :--: | --- | --------------------------------------------- | ------- | :--: | :-------: | :----: | ------------ | :---: |
|  1   | G23 | Text and layout are ready for other languages | Missing |  1   |     0     |   6    | raised ×2    | 12.0  |
|  2   | G3  | Invalid calls can't be written                | Partial |  1   |     9     |   —    | unchanged ×1 |  9.0  |
|  3   | N1  | Money is stored as integer minor units        | Missing |  2   |    12     |   —    | unchanged ×1 |  6.0  |
|  4   | G12 | Writes are safe to retry                      | Missing |  2   |     6     |   —    | raised ×2    |  6.0  |
|  5   | G17 | Vendor code sits behind an owned seam         | Partial |  1   |     5     |   —    | unchanged ×1 |  5.0  |
|  6   | G2  | One error shape, translated in one place      | Partial |  1   |     4     |   —    | unchanged ×1 |  4.0  |
|  7   | G24 | Tenant context comes from one provider        | Missing |  1   |     2     |   —    | raised ×2    |  4.0  |
|  8   | G10 | Writes declare what they make stale           | Partial |  2   |     7     |   —    | unchanged ×1 |  3.5  |
|  9   | G1  | Types at a boundary come from its contract    | Partial |  2   |     6     |   —    | unchanged ×1 |  3.0  |
|  10  | G6  | Each error is reported exactly once           | Partial |  1   |     3     |   —    | unchanged ×1 |  3.0  |
|  11  | G19 | Critical flows are tested end to end in CI    | Partial |  2   |     4     |   —    | unchanged ×1 |  2.0  |
|  12  | G7  | Multi-step processes have explicit states     | Met     |  2   |     0     |   —    | unchanged ×1 |  0.0  |
|  —   | G21 | Separately shipped apps have separate entries | N/A     |  —   |     —     |   —    | —            |   —   |

Classes: 9 + 12 + 6 + 5 + 4 + 2 + 7 + 6 + 3 + 4 = 58, in 10 classes across 10 guardrails.

## Live bugs

- `api/src/lib/http.ts:9`: no timeout on outbound calls; one slow provider hangs requests (G12). (read from code)
- `web/src/features/invoices/hooks/use-invoice.ts:22`: a caller's `enabled: true` fires the query with an empty id (G3). (reproduced)

## Top three changes

1. **One lint change** (G23, G17, G3, G24): start/end instead of left/right, vendor import restrictions, no `?? ''` in query keys, no currency or locale literals in features.
2. **Money as integer cents** (N1), before the EU region multiplies the rounding paths.
3. **Idempotent writes** (G12), before the public API ships.

## Details

### G23. Text and layout are ready for other languages — Missing

**Signal (6):** 34 files use left/right utilities (`ml-`, `pr-`, `left-`) and none use start/end; inline strings in every feature. Capped at 6.
**Fit:** raised. The EU region ships a German UI.
**Evidence:** `grep -rlE '\b(ml|mr|pl|pr|left|right)-' web/src | wc -l` → 34; no message catalog; `web/index.html:2` hard-codes `lang="en"`.
**Gap:** a lint rule rejecting left/right utilities, plus the codemod to start/end. The message catalog waits until German is scheduled.

### G3. Invalid calls can't be written — Partial

**Prevented (9):** "stop invoice query firing with empty id", "guard customer fetch before selection", "don't load line items for a draft with no id".
**Fit:** unchanged. The roadmap adds no new client screens that change this.
**Evidence:** 14 `id ?? ''` placeholders in query keys (`grep -rn "?? ''" web/src/features | wc -l`). `web/src/features/invoices/hooks/use-invoice.ts:22` sets `enabled: options?.enabled ?? Boolean(id)`, so a caller passing `enabled: true` overrides the id check.
**Gap:** `queryOptions` factories using `skipToken` (`queryFn: id ? () => getInvoice(id) : skipToken`); remove the `enabled` option from the hook signatures.

### N1. Money is stored as integer minor units — Missing

**Prevented (12):** "invoice total off by a cent", "tax rounding differs between PDF and screen", "discount of 0.1 shows 0.09999".
**Fit:** unchanged. Every region keeps the problem.
**Evidence:** `invoices.total` and `line_items.amount` are `float8` (`api/migrations/0003_invoices.sql:7`); totals summed with `+` in `web/src/features/invoices/lib/totals.ts:12`.
**Gap:** `bigint` cents in the database, one `Money` module for arithmetic and rounding, and formatting through G11.

### G12. Writes are safe to retry — Missing

**Prevented (6):** "duplicate invoice on double click", "payment recorded twice after timeout", "webhook replay creates second customer".
**Fit:** raised. Integrations will retry by design.
**Evidence:** `api/src/routes/invoices.ts:48` inserts with no idempotency key; `invoices` has no unique constraint on `(customer_id, number)`. `api/src/lib/http.ts:9` creates the outbound client with no timeout.
**Gap:** an `Idempotency-Key` header stored for 24 h on `POST /invoices` and `POST /payments`; a unique constraint on `(customer_id, number)`; a 10 s timeout on the outbound client.

### G17. Vendor code sits behind an owned seam — Partial

**Prevented (5):** "migrate charts v2→v3", "fix toast props after upgrade", "replace deprecated date-picker API".
**Fit:** unchanged. No new vendors are planned.
**Evidence:** a `web/src/ui/` layer exists, but 19 feature files import the chart, toast and date-picker packages directly. No `no-restricted-imports` rule in `eslint.config.js`.
**Gap:** a `no-restricted-imports` rule for those three packages outside `web/src/ui/`; move the 19 imports.

### G2. One error shape, translated in one place — Partial

**Prevented (4):** "show the API's validation message", "map 409 to the invoice number field".
**Fit:** unchanged. The public API reuses the same error shape.
**Evidence:** the API returns `{ code, message, fields }` everywhere (`api/src/middleware/errors.ts:12`). The client has `toUserMessage()` but no form adapter; 11 forms call `setError` by hand.
**Gap:** one `applyServerErrors(form, error)` in `web/src/lib/errors.ts`, used by the 11 forms.

### G24. Tenant context comes from one provider — Missing

**Prevented (2):** "use account currency on totals", "remove hard-coded USD".
**Fit:** raised. The EU region needs EUR, `de-DE` formats and a Monday week start.
**Evidence:** 9 `'USD'` and 6 `'en-US'` literals in `web/src/features`; no settings hook.
**Gap:** a `useAccountSettings()` hook backed by `GET /account/settings`; replace the 15 literals.

### G10. Writes declare what they make stale — Partial

**Prevented (7):** "refresh customer balance after payment", "stale invoice list after void".
**Fit:** unchanged. The domain count stays the same.
**Evidence:** key factories exist for invoices and customers (`web/src/features/*/keys.ts`); 23 hand-written `invalidateQueries` calls, 5 with literal keys.
**Gap:** `meta.invalidates` on each mutation, applied by one `MutationCache` `onSuccess`.

### G1. Types at a boundary come from its contract — Partial

**Prevented (6):** "allow null due_date", "send amount as string".
**Fit:** unchanged. The public API makes the schema more important, not less, but adds no new drift on the client side.
**Evidence:** the API publishes `openapi.yaml`; the client ignores it and declares response types per call in `web/src/api/*.ts`.
**Gap:** generate types with `openapi-typescript` in a `gen:api` script; CI fails when the output differs from the committed file.

### G6. Each error is reported exactly once — Partial

**Prevented (3):** "duplicate error toast on save".
**Fit:** unchanged.
**Evidence:** a global `MutationCache` `onError` toasts; 7 mutations also toast in their own `onError`.
**Gap:** a `meta.silent` opt-out; remove the 7 local error toasts.

### G19. Critical flows are tested end to end in CI — Partial

**Prevented (4):** regressions in "send invoice" and "record payment".
**Fit:** unchanged.
**Evidence:** 6 Playwright specs in `e2e/`; `.github/workflows/ci.yml` doesn't run them. No accessibility checks.
**Gap:** a CI job running the specs per role, with `@axe-core/playwright` on each page visited.

G7. Multi-step processes have explicit states — Met: invoice status is a Postgres enum, and `api/src/domain/invoice-status.ts:5` rejects transitions outside its table.

## N/A

- G21. Separately shipped apps have separate entries: one shipped app.

## New guardrails

### N1. Money is stored as integer minor units

**Rule.** Amounts are integers in the currency's minor unit (cents), with the currency code beside them. One module does arithmetic and rounding; display goes through G11.
**Why.** Binary floats can't represent most decimal amounts, so sums and tax drift by a cent and differ between places that round differently.
**Applies when.** The code stores or computes money.
**History.** "off by a cent", "rounding differs between X and Y".
**Code.** `float`/`double`/`real` columns or types for amounts; `+` on amounts outside one module.
**Check.** Column types for amounts; count arithmetic on amounts outside the money module.
**Cost.** 2.
**Trap (4).** A decimal library threaded through every layer when integers suffice.

## Traps to avoid

- **Runtime-parsing every response (G1).** Generated types cover it; parse only webhook input.
- **A key dependency graph (G10).** Invalidating a whole domain is cheap.
- **A feature-flag platform (G25).** No customer needs different behavior yet.

## One-off

5 real bugs with no second occurrence: "credit note total ignores tax-exempt lines", "CSV export drops the last row". Security fixes: `4be21c0` "password reset link stays valid after use".

## Polish

36 fixes no guardrail would have prevented: copy, one-off spacing, icon swaps.
