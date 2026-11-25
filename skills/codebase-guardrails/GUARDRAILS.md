# Guardrail catalog

Architecture decisions that make whole **bug classes** impossible to write. Rules name no framework and no product domain; examples in parentheses span stacks. Step 4 of the skill translates each rule into the project's stack.

## Index

| ID  | Guardrail                                                   | Applies when                                    |
| --- | ----------------------------------------------------------- | ----------------------------------------------- |
| G1  | Types at a boundary come from its contract                  | Separately built parts exchange data            |
| G2  | One error shape, translated in one place                    | Errors cross a boundary                         |
| G3  | Invalid calls can't be written                              | Always                                          |
| G4  | Outside input is parsed where it enters                     | The program reads input it doesn't control      |
| G5  | One capability manifest, decided by the authority           | Roles, plans or deployment modes gate features  |
| G6  | Each error is reported exactly once                         | Always                                          |
| G7  | Multi-step processes have explicit states                   | A process has three or more states              |
| G8  | Dialogs and drawers own their lifecycle                     | The UI has dialogs, drawers or sheets           |
| G9  | Session state can't outlive the session                     | Sign-in, or a server serving several users      |
| G10 | Writes declare what they make stale                         | The code caches data it can also change         |
| G11 | Formatting and time come from one module                    | Dates, money or quantities are shown or computed |
| G12 | Writes are safe to retry                                    | Writes or external calls cross a network/queue  |
| G13 | Schema changes go expand, then contract                     | A store or published API changes shape          |
| G14 | Design values are tokens, and raw values fail lint          | UI                                              |
| G15 | Layout primitives own spacing; data components own loading | UI                                              |
| G16 | Text is never assumed short, Latin or left-to-right         | The code renders user data                      |
| G17 | Vendor code sits behind an owned seam                       | Always                                          |
| G18 | Hard problems use maintained code (decision)                | Always                                          |
| G19 | Critical flows are tested end to end in CI                  | Always                                          |
| G20 | CI is the authority, and local hooks stay small             | Always                                          |
| G21 | Separately shipped apps have separate entries               | Two or more apps (one image = one app)          |
| G22 | The authority owns meaning                                  | A client renders data a server computes         |
| G23 | Text and layout are ready for other languages               | Text aimed at end users                          |
| G24 | Tenant and deployment context come from one provider        | Two or more customers, regions or deployments   |
| G25 | Per-customer behavior is a flag (decision)                  | Customers need different behavior               |
| G26 | Public API types are pinned by tests                        | A published package                             |
| G27 | The package is checked as consumers install it              | A published package, binary or container image  |
| G28 | Code in the docs compiles, and links resolve, in CI         | Docs with code examples or links                |
| G29 | Each output format has one escaper                          | Output built for HTML, shell, regex, SQL, files |
| G30 | Updates write only the fields they change                   | Existing records are updated                    |
| G31 | Tenant data is scoped where it's stored                     | Two or more customers share one store           |

## Fields

Each guardrail has these fields:

- **Rule**: the decision.
- **Why**: the failure it prevents. Use it to judge cases the rule doesn't name.
- **Applies when**: the part of the system it needs. Without that part the verdict is N/A.
- **History**: how its absence reads in fix commits, issues and incident notes.
- **Code**: how its absence reads in code, for repos with little or no history.
- **Check**: what to measure for the verdict.
- **Cost**: weight on the scale below, with the trigger that raises it.
- **Trap** (when a heavy version exists): the heavy version, scored, and why it fails.

## Cost scale

| Score | Meaning                                                        |
| :---: | -------------------------------------------------------------- |
|   1   | Under a day. Do it now.                                        |
|   2   | Days. Do it the next time the area changes.                    |
|   3   | Do it only when the trigger in the guardrail is reached.       |
|   4   | Over-engineering for a team under ~10. Needs proof it pays.    |
|   5   | Over-engineering. Never.                                       |

## Principles

- **Enforced beats documented.** Always pick the guardrail that the type checker, lint or CI enforces over one that lives in docs, at equal cost. Why: docs bind only people who read them; a gate binds every contributor, agents included.
- **Light first.** Recommend the lightest version the guardrail lists. Recommend a heavier one only when its trigger is reached or the evidence shows the light one already failed. Why: the light version closes most of the class, and the heavy version's maintenance outlives the bugs it prevents.
- **One owner per concern.** Most rules below apply this: one place defines the concern, everything else consumes it. Why: two owners drift, and the drift is the bug.
- **Defaults aren't gaps.** Never report the framework's default or its recommended pattern as missing. Why: replacing it adds a custom layer that fights every upgrade.

## Reading the history

- **Drop** what isn't a bug fix: "add bug report template"; a fix word naming a script or tool ("add fix script"); version and `fix(deps)` bumps; lint rollouts and lint/type-warning follow-ups (when that checker isn't in CI, cite their count under G20 instead); a feature whose subject only closes an issue ("Add X. Fixes #905"); test edits that follow an intended change.
- **Keep** a tool's config breaking after that tool is updated: it's a fix, under G17.
- **Reverts and bundles.** A revert of a fix is a second item in that fix's class; a revert of something that wasn't a fix is dropped. A bundled commit ("Round 3 bug fixes") is polish.
- **Sweeps.** Commits within 7 days with the same root cause that touch overlapping files or the same component (one module, file group or UI component, never a feature launch or release) are one item; note the commit count. Why: one bug found once and fixed in many places doesn't keep coming back.
- **When the subject hides the area,** list the files: `git show --name-only --format= <hash>` (cheap, also in a blobless clone). **When the files hide the cause,** read the diff: `git show <hash>`. Read at least 10 and at most 30 diffs, spent on the largest classes first; stop at 30 even if more look useful, and report the number read. Why: subjects alone misplace items, but reading every diff costs more than the classes are worth.

## Reading an entry

- **Met with no gap.** Use the lightest cost the guardrail lists.
- **Conditional costs.** When a Cost line depends on a condition ("3 before a second such process exists"), check the condition against the step-1 profile, use that cost, and name the condition in the fit reason.
- **Code lines that don't fit the stack.** When a Code line has no equivalent in this stack, count the nearest proxy and name it in the report.
- **History thresholds.** Step 2's two-fix threshold decides what counts as a class; a History line only describes what the fixes look like.
- **A class that fits two guardrails.** Map it to the one whose Rule names the root cause; then the one whose Code line you can cite in this repo; then the lower ID.
- **A trigger already reached.** Use the cost that applies after the trigger; the fit stays unchanged.
- **(decision) in the index.** Nothing can lint these; step 5 rates them Met when the rule is followed everywhere.
- **IDs out of order.** G29, G30 and G31 were added later; they're filed under their topic sections (A, D and B) so earlier IDs stay stable.

---

## A. Boundaries

### G1. Types at a boundary come from its contract

**Rule.** Generate the types for every external boundary (HTTP API, database, message topic, config file) from that boundary's schema (OpenAPI, GraphQL, protobuf, SQL, JSON Schema). Add runtime parsing only at a boundary that has drifted once, or that takes untrusted input.
**Why.** Hand-copied types are correct on the day they're written and drift silently after; the compiler can't flag a change it never saw.
**Applies when.** Two separately built components exchange data.
**History.** "match the real response shape", "allow null for field", "send X as string", a cast that relaxes a payload type.
**Code.** Response shapes declared per call site; a length limit duplicated as a constant on both sides.
**Check.** Is there a schema and a generation step, or does each call declare its own shape?
**Cost.** 2 when the other side publishes a schema; 3 when it must add one first.
**Trap (4).** Runtime-parsing every trusted response. It duplicates the generated types and costs time on every call.

### G2. One error shape, translated in one place

**Rule.** Each boundary returns one error shape (`{ code, message, fields[] }`). One adapter maps it to what the caller needs (form-field errors, exit codes, retry decisions); one function picks the message a person sees.
**Why.** When each caller parses errors itself, each one handles a different subset, and users see raw codes or generic failures.
**Applies when.** Errors cross a boundary.
**History.** "surface the backend message", repeated per feature; "attribute the 409 to field X".
**Code.** Status codes and error-body fields parsed at many call sites.
**Check.** Count the sites that parse error bodies outside the adapter.
**Cost.** 1.

### G3. Invalid calls can't be written

**Rule.** Required inputs are required in the type. Deferred work (a lazy query, a scheduled job, a background fetch) with a missing input is skipped by construction: the library's skip sentinel, or a type that can't be built without the input. Never a boolean flag a caller can override.
**Why.** A flag guards only the callers that remember it; a type guards every caller, including the next one.
**Applies when.** Always.
**History.** "stop X firing with an empty id", "guard against undefined before calling".
**Code.** Placeholders passed to satisfy a signature (`id ?? ''`, `user_id or 0`, `Optional.orElse("")`); `enabled`/`skip` flags a caller can set to true.
**Check.** Count the placeholders and the overridable guards.
**Cost.** 1.

### G4. Outside input is parsed where it enters

**Rule.** Input the program doesn't control (URL parameters, CLI arguments, environment variables, form posts, webhook bodies, file imports) is parsed once, at the edge, into a typed value with defaults. Code past the edge never reads raw strings. Links are built by path builders, never string literals.
**Why.** A raw read deep in the code fails at the moment of use, far from the input that caused it; a parse at the edge fails at the door with a clear message.
**Applies when.** The program reads input it doesn't control.
**History.** "validate ?tab param", "crash on missing env var", "deep link lands on wrong view".
**Code.** Raw reads (`params.get`, `process.env.X`, `os.environ[...]`, `argv[n]`) spread through the code; literal paths in links.
**Check.** Count raw reads outside the parsing module, separately for each source: arguments (`argv`, flag libraries' positional args), working-directory reads, environment variables, request parameters and file imports. Count literal paths in links.
**Cost.** 1 for config and environment; 2 for routes, URLs, provider responses and file imports.
**Trap (4).** Switching framework or router to get typed input. The parse module gets the same result.

### G29. Each output format has one escaper

**Rule.** Each target format (HTML, shell, regex, SQL, file names, URLs, chat markup) is escaped by one function for that format, applied where the output is built. Never reuse another format's escaper, and never opt out of escaping without the format's own escaper in its place.
**Why.** An escaper for the wrong format looks safe and isn't; each hand-written escape covers a different subset, and an opt-out is an injection or a broken output waiting for the first unusual character.
**Applies when.** The code builds output for HTML, a shell, a regex, SQL, file names or another format with special characters.
**History.** "fix double escaping", "escape X in the shell integration", "sanitize invalid characters in file names", "block stored HTML injection".
**Code.** Raw-output opt-outs (`|safe`, `v-html`, `innerHTML`, `dangerouslySetInnerHTML`); escaping written by hand; string concatenation into shell, regex or SQL.
**Check.** Count opt-outs and hand-written escapes outside the per-format escapers.
**Cost.** 1.

---

## B. Access

### G5. One capability manifest, decided by the authority

**Rule.** Each entry point (route, endpoint, command) declares its required capability (role, plan or deployment mode) once, where it's defined. Menus, command lists and the access test matrix are derived from those declarations. The authority (the server) decides; clients display what it reports.
**Why.** Every extra list that names entry points is a place where a gate gets missed, and a client copy of the role matrix is wrong the day roles change.
**Applies when.** Roles, permission levels, plans or deployment modes gate what users can do.
**History.** "hide X from role Y" twice or more; "align menu with route guard".
**Code.** Two or more lists naming the same entry points; a client copy of the role matrix.
**Check.** Count the lists. Is there a test that runs every role against every entry point?
**Cost.** 2. **Required** once roles vary per customer or become editable.
**Trap (4).** A policy engine (rules, conditions, inheritance) before roles are dynamic. It's a second authority that drifts from the server.

---

### G31. Tenant data is scoped where it's stored

**Rule.** Tenant-owned data is scoped in one place: the store (row-level security, the tenant key in unique and foreign keys) or one data-access layer (a scoped repository, a default scope), never in each query. The tenant comes from the authenticated session, never from client input. Jobs, caches, files and search indexes carry the tenant key.
**Why.** A query that forgets its tenant filter shows one customer's data to another, and it passes review because the missing line is invisible. G24 covers per-tenant settings and G9 covers session state; this rule covers data access.
**Applies when.** Two or more customers (organizations, workspaces, households, accounts) share one store.
**History.** "scope X to the current org", "user could see another workspace's Y", "add group check to Z".
**Code.** Queries on tenant-owned tables that bypass the scoping layer; a tenant id read from request parameters or the body; cache keys or file paths without the tenant key.
**Check.** Is scoping enforced by the store or one layer? Count tenant-owned queries that bypass it. Is there a test that requests each endpoint as another tenant and expects not-found?
**Cost.** 2 while tenant-owned tables are young; 3 once they hold production data. **Required** once two or more customers share one store.
**Trap (4).** A database or schema per tenant at launch. Migrations, pooling and reporting multiply per tenant before any customer needs physical separation.

---

## C. Lifecycle and state

### G6. Each error is reported exactly once

**Rule.** One layer owns generic error reporting (a global handler, middleware, a top-level catch), with a typed opt-out for callers that handle the error themselves. Context-specific effects (a success message naming the record, a redirect, a compensating action) stay at the call site. In services, log or rethrow, never both.
**Why.** Two reporters produce duplicate toasts and duplicate alerts; zero reporters produce silent failures. Exactly one owner rules out both.
**Applies when.** Always.
**History.** "prevent duplicate error toasts", "error logged three times", "alert fired twice".
**Code.** A global handler and local handlers reporting the same failure; or a catch or rejection handler that does nothing, or only calls an optional callback.
**Check.** Is there one owner? Count the callers that also report what it reports, and the handlers that swallow errors.
**Cost.** 1.
**Trap (3).** Moving context-specific success handling into the global layer. The global layer lacks the context the message needs.

### G7. Multi-step processes have explicit states

**Rule.** A process with three or more states (a wizard, an order, a job, a sync) holds one state value with named states and allowed transitions (`editing(step) | submitting | failed(step)`, or a status enum plus a transition table).
**Why.** Independent flags allow combinations that mean nothing (`isDone && isSubmitting`), and every such combination is a bug waiting for its timing.
**Applies when.** A process has three or more states.
**History.** "skips a step after upgrade", "stuck in submitting", "status went from X back to Y".
**Code.** Two or more flags per process, changed from different places.
**Check.** Count the flags per process. Are transitions checked anywhere?
**Cost.** 2. 3 before a second such process exists.
**Trap (5).** A state-machine library for one process. A reducer and a transition table cover it.

### G8. Dialogs and drawers own their lifecycle

**Rule.** One abstraction owns a dialog's (or drawer's, or sheet's) open state, its content state, the reset after it closes, and staying open while work is pending. The markup is small composable parts the feature fills in.
**Why.** Each hand-wired dialog re-solves exit animation, reset timing and pending state, and each solves a different subset.
**Applies when.** The UI has dialogs, drawers or sheets.
**History.** "keep content through exit animation", "reset form after close", flicker on confirm.
**Code.** Each dialog wiring open, reset and pending state by hand.
**Check.** Is there a shared hook or component? Count the dialogs that hand-wire it.
**Cost.** 2.
**Trap (4).** One config component taking schema, defaults, handlers and boolean flags as props. It gains a flag for every new case.

### G9. Session state can't outlive the session

**Rule.** Every path that ends a session (logout, expiry, revocation, account switch) calls one function that clears credentials and every cache. Servers hold no mutable state at module level across requests.
**Why.** One missed exit path is enough to show user A's data to user B.
**Applies when.** Users sign in, or a server handles requests from more than one user.
**History.** "purge cache on logout", "saw another user's data", "stale profile after switch".
**Code.** Two or more logout paths; module-level caches keyed without user or tenant.
**Check.** Is there exactly one clear function, and does every exit call it?
**Cost.** 1. 3 for remounting state per user or tenant, triggered by in-app switching.

### G10. Writes declare what they make stale

**Rule.** Cache keys come from one factory per domain. Each write declares what it invalidates, other domains included, and one place applies it. Invalidating a whole domain is fine.
**Why.** Hand-written invalidation at each write site misses the cross-domain dependency nobody remembered.
**Applies when.** The code caches data it can also change.
**History.** "refresh X after Y", "stale list after edit".
**Code.** Invalidation calls with literal keys at many sites.
**Check.** Count invalidation sites and literal keys.
**Cost.** 2.
**Trap (4).** A dependency graph of keys. Broad invalidation is cheap and never misses.

### G11. Formatting and time come from one module

**Rule.** Dates, numbers, currency and units are formatted through one module that reads the active locale and tenant settings (G24). The clock is injected or read at use, never captured at module load. Store instants in UTC; store calendar dates as dates, never midnight timestamps.
**Why.** A midnight timestamp shifts a day when it crosses a timezone, and a format pattern copied into ten files changes in only nine.
**Applies when.** The code shows or computes dates, money or quantities.
**History.** "off by one day", "midnight drift", "wrong currency".
**Code.** Format patterns and locale literals across features; `now()` at module scope.
**Check.** Count format calls and locale literals outside the module.
**Cost.** 1.
**Trap (3).** A date-only type everywhere before day-boundary bugs recur. It taxes every date for a bug that may not return.

---

## D. Data and concurrency

### G12. Writes are safe to retry

**Rule.** Every retryable write (by a client, a queue or a double click) is idempotent: an idempotency key, a unique constraint, or an upsert. Every external call has a timeout; retries stop after 3–5 attempts with backoff.
**Why.** Networks deliver some requests twice and some never; without idempotency the first makes duplicates, and without timeouts the second hangs the caller.
**Applies when.** Writes or external calls cross a network or a queue.
**History.** "duplicate record on retry", "charged twice", "double submit", "request hangs".
**Code.** Inserts with no unique constraint behind a retrying caller; calls without a timeout.
**Check.** Do retried writes carry a key or constraint? Do all external calls set timeouts?
**Cost.** 1 for timeouts and submit locks; 2 for idempotency keys.
**Trap (4).** Distributed transactions or a saga framework for a handful of writes.

### G13. Schema changes go expand, then contract

**Rule.** A breaking schema change ships in steps: add the new shape, write both, move readers, then remove the old shape in a later release. Migrations run in CI against production-like data.
**Why.** During a deploy, old and new code run at once; a one-step rename breaks whichever version reads the missing shape.
**Applies when.** A persistent store or a published API changes shape.
**History.** "hotfix migration", "column missing in prod", "old clients broke after deploy".
**Code.** Migrations that add and drop in one release; no migration step in CI.
**Check.** Do recent migrations rename or drop in the release that adds? Does CI run them?
**Cost.** 2.

### G30. Updates write only the fields they change

**Rule.** An update names the fields it changes (`update_fields`, a PATCH body, `UPDATE … SET col`), or checks a version. It never saves the whole record from a copy read earlier.
**Why.** A full save from a stale copy writes back every field someone else changed in the meantime: a disabled flag re-enabled, a scheduled date undone, an image dropped.
**Applies when.** Existing records are updated by more than one path (users, workers, API clients).
**History.** "only update specific fields", "X lost after saving", "race condition in concurrent updates".
**Code.** A full-record save after a read in a handler or worker; a client sending the whole object back on edit.
**Check.** Count full-record saves on records that more than one path writes.
**Cost.** 1.
**Trap (4).** Optimistic locking on every table, before lost updates recur.

---

## E. Interface (UI only)

### G14. Design values are tokens, and raw values fail lint

**Rule.** Color, type, spacing, radius and stacking order are tokens with semantic names. Contrast for every foreground/background pair is computed in CI and fails below WCAG AA: 4.5:1 for normal text, 3:1 for large text. Lint rejects raw values in feature code.
**Why.** A raw value is invisible to a theme change and to a contrast check, so it breaks in the one theme nobody looked at.
**Applies when.** The codebase has a UI.
**History.** "raise contrast", "replace raw color with token", "z-index fight".
**Code.** Hex values, arbitrary sizes and hand-set stacking order in features.
**Check.** Is there a contrast gate? Lint rules for raw values?
**Cost.** 1 for the contrast gate; 2 for lint.
**Trap (3).** Regex lint over class strings. It misfires on composed classes; use the styling tool's own rules.

### G15. Layout primitives own spacing, and data components own their loading state

**Rule.** A page primitive owns outer padding and vertical rhythm; pages never set their own. A data component ships its own loading placeholder in its own shape.
**Why.** Spacing repeated per page drifts page by page, and a placeholder built apart from its component stops matching it, so the page jumps on load.
**Applies when.** The codebase has a UI.
**History.** "double padding", "page jumps on load", "skeleton doesn't match".
**Code.** Page roots repeating spacing; placeholders assembled per page.
**Check.** Is there a page primitive? Count pages that hand-build placeholders.
**Cost.** 2.
**Trap (4).** Lint that inspects page structure. It's brittle; the primitive and review cover it.

### G16. Text is never assumed short, Latin or left-to-right

**Rule.** Shared fixtures include a 200-character name, an unbroken 80-character string, 0, 1 and 10,000 items, and Arabic and CJK text. Truncation primitives exist before the first feature needs them.
**Why.** Real data is longer and stranger than demo data, and each component that hand-rolls truncation fails differently.
**Applies when.** The code renders user data, including CLIs and reports.
**History.** "ellipsize long names", "overflow on narrow screens".
**Code.** Truncation hand-rolled per component; fixtures with only short names.
**Check.** Is there a shared worst-case fixture? Count hand-rolled truncation.
**Cost.** 1.

---

## F. Dependencies

### G17. Vendor code sits behind an owned seam

**Rule.** Feature code imports the project's wrapper, never the vendor package, for UI kits, charts, date pickers, notifications, HTTP clients, ORMs and SDKs. A lint import restriction enforces it. Upgrade one major dependency per change.
**Why.** A vendor's breaking change lands in every importing file; behind a seam it lands in one.
**Applies when.** Always.
**History.** "migrate X v3→v4", "replace deprecated API", "fix props after upgrade", fixes after toolchain and dev-dependency bumps.
**Code.** Direct vendor imports across features.
**Check.** Is there an import restriction? Count vendor imports outside the wrapper layer.
**Cost.** 1.
**Trap (4).** Re-wrapping every prop of a component already copied into the project. The copy already is the seam.

### G18. Hard problems use maintained code

**Rule.** Use a maintained implementation, behind a seam (G17), for comboboxes, date pickers, data grids, rich text, parsers, date math, crypto and authentication.
**Why.** These have hundreds of edge cases (focus, locale, timezones, security) that a bespoke version rediscovers one bug at a time.
**Applies when.** Always.
**History.** Repeated fixes to one hand-built component for focus, matching, sizing or edge cases. The hand-built component is the root cause, so these are one class even when the symptoms differ.
**Code.** Hand-written versions of the list above.
**Check.** Which hand-built components have the most fix commits?
**Cost.** 1 at project start. 3 to replace one that has stabilized; trigger: a requirement it can't meet.

---

## G. Verification and tooling

### G19. Critical flows are tested end to end in CI

**Rule.** End-to-end tests of critical flows, per role, run in CI on every merge. UIs add automated accessibility checks on every page those tests visit.
**Why.** Tests outside CI stop running within weeks, and the regressions they'd catch ship.
**Applies when.** Always; accessibility checks with a UI.
**History.** Regressions in flows nobody re-tested; most UI polish fixes.
**Code.** E2E tests that exist but aren't in the pipeline.
**Check.** Do they run in CI? Are accessibility checks wired in?
**Cost.** 2. 3 for a component catalog (trigger: two products share a UI kit).
**Trap (4).** Visual snapshots across platforms for a team under ~10. They flake across operating systems and need an owner.

### G20. CI is the authority, and local hooks stay small

**Rule.** Every gate runs in CI on the whole repo, from clean. Branch protection lives on the server. Local hooks only format and lint staged files.
**Why.** Local hooks can be skipped and caches can hide errors; only a clean server run is the same for everyone.
**Applies when.** Always.
**History.** Fixes to hook scripts, "force full type-check", "cache hid an error".
**Code.** Hook scripts over ~20 lines; rules enforced only locally.
**Check.** Count hook lines. Does any hook do what a server rule should? Does each gate the repo's config or docs imply (type check, lint, tests) actually run in CI? Branch protection needs host access; if it isn't visible, rate the gates in the repo and say so.
**Cost.** 1.

### G21. Separately shipped apps have separate entries

**Rule.** Each thing that ships separately (marketing site, app, embeddable widget, worker, CLI) has its own entry point and bootstrap, sharing code only through explicit packages or tokens.
**Why.** A shared entry couples their styles, globals and bundle size, so a change for one breaks the other.
**Applies when.** One repo ships two or more apps. Processes shipped in one image (a web server and its workers) count as one app.
**History.** "styles leaking into Y", "worker imports browser code".
**Code.** One app importing another's entry, global styles or bootstrap.
**Check.** Does any app import another's entry?
**Cost.** 2.

### G22. The authority owns meaning

**Rule.** The side that owns the data returns display-ready, typed shapes for anything computed (balances, diffs, allowed transitions, `allowedActions` per record). Consumers never re-derive them.
**Why.** A rule re-derived on the client is a second copy of business logic, and it diverges on the first change.
**Applies when.** A client renders data a server computes.
**History.** "disable invalid transition" fixed on the client; "print the diff instead of raw JSON".
**Code.** Client code branching on value shape (`typeof`, `isArray`) or re-implementing server rules.
**Check.** Count client-side re-derivations of server rules.
**Cost.** 2, as a request to the other side. **Required** with G5 once permissions vary per customer.

---

## H. Forward-looking (absent from history until it's expensive)

### G23. Text and layout are ready for other languages

**Rule.** User-facing text goes through a message catalog; a constants module is enough until a second locale ships. Layout uses logical directions (start/end, never left/right), enforced by lint. Direction-dependent icons flip under right-to-left. The document's language and direction come from the locale. Services return error codes, never prose.
**Why.** Each left/right and each inline string is one more fix on the day a new language ships; lint stops the count growing today.
**Applies when.** The product has text aimed at end users. Messages read only by developers (logs, library warnings) don't count.
**History.** None until a new locale is announced; then dozens of fixes at once.
**Code.** Inline strings; physical directions outnumbering logical ones; fixed language attribute.
**Check.** Ratio of physical to logical direction utilities; is there a catalog?
**Cost.** 1 for the logical-direction lint; 2 for the catalog. Trigger: a second locale on the roadmap.

### G24. Tenant and deployment context come from one provider

**Rule.** Everything that varies per customer or deployment (currency, locale, timezone, week start, region, branding, product name, regional data sources) comes from one settings provider. Feature code never hard-codes a country, currency, locale or company name.
**Why.** Each hard-coded value is a fix for the second customer, and their number grows with every feature built first.
**Applies when.** The product has, or plans, two or more customers, regions or deployments.
**History.** "use the org currency", "remove region name", "make X configurable".
**Code.** Country names, currency codes, locale literals and brand names outside the settings layer.
**Check.** Grep for them. Is there one settings provider?
**Cost.** 1 while hard-coded values are under ~10; 2 above that. Trigger: a second customer or region.

### G25. Per-customer behavior is a flag

**Rule.** Behavior that differs between customers is a flag read from tenant settings, never a fork, branch or per-customer build.
**Why.** Each fork multiplies every later fix by the number of customers.
**Applies when.** Customers need different behavior.
**History.** "hide X for client Y", per-client branches.
**Code.** Environment variables or build targets per customer.
**Check.** Is there a flag source? How are customer differences built?
**Cost.** 3. Trigger: the second customer who needs different behavior.
**Trap (4).** A flag platform before that customer exists.

---

## I. Published packages and docs

### G26. Public API types are pinned by tests

**Rule.** The types a package exports are asserted by type-level tests that fail when an inferred type widens, narrows or turns into `any`. The public surface is the set of exports, and nothing outside it is reachable.
**Why.** Consumers compile against the types, not the runtime; a widened type passes every runtime test and breaks every consumer's build or inference.
**Applies when.** A published package: a library, SDK or CLI that others install.
**History.** "fix type inference for X", "restore generic", "type regression in v4.2", "remove accidental any".
**Code.** Type tests that only check that code compiles, with no exact-type assertions; `any` in exported signatures.
**Check.** Are there exact-type assertions on the main exports? Does CI run them?
**Cost.** 2.
**Trap (4).** Snapshotting the whole generated declaration file. Every harmless change breaks it, and people learn to update it without reading.

### G27. The package is checked as consumers install it

**Rule.** CI builds the package, then checks the built artifact the way a consumer meets it: the exports map, each module format, the type declarations for each entry, and a smoke import from a clean project.
**Why.** The source can be correct while the published shape is broken; a missing export condition or a wrong declaration path only shows up after install.
**Applies when.** A published package, or a released binary or container image.
**History.** "fix exports map", "fix ESM/CJS import", "types not found for subpath", "missing file in published package".
**Code.** No step in CI that inspects the built output; the package's file list maintained by hand.
**Check.** Does CI inspect the built artifact, or only the source?
**Cost.** 1.

### G28. Code in the docs compiles, and links resolve, in CI

**Rule.** Code examples in the docs are type-checked or run against the current source, and links are checked, on every pull request, not only after merge.
**Why.** Docs drift silently with every API change; a wrong example teaches every reader the bug.
**Applies when.** The repo has docs with code examples or links.
**History.** "fix example in docs", "update snippet to new API", "fix broken link".
**Code.** Code fences that nothing compiles; a docs build that runs only on the main branch.
**Check.** Does any CI job compile the examples or check links on pull requests?
**Cost.** 2.
**Trap (4).** Rewriting the docs into a framework that executes every page. Checking the code fences gets most of the benefit.

---

## Outside every guardrail

Copy typos, grammar, one-off spacing and small product tweaks are **polish**. A real bug with no second occurrence is a **one-off**, not polish; report it, and name security fixes. No architecture prevents them; G19 catches them sooner. Count them; never map them. Wrong code or dead links in docs aren't polish: map them to G28.
