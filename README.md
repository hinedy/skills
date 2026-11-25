# Skills

Agent skills by hinedy, for engineers who want the agent to make the same good decision every time.

## Install

As a Claude Code plugin. Type these inside Claude Code:

```text
/plugin marketplace add hinedy/skills
/plugin install hinedy-skills@hinedy
```

Auto-update is off by default for marketplaces outside Anthropic's. To turn it on, run `/plugin`, open the **Marketplaces** tab, select `hinedy` and switch auto-update on. Or update by hand with `claude plugin update hinedy-skills@hinedy`.

Or with [skills.sh](https://skills.sh), for Claude Code and other agents. It copies the skill files into your setup; update them with `npx skills update`:

```bash
npx skills@latest add hinedy/skills
```

Add `--skill <name>` to install one skill. Pick one method; installing both loads every skill twice.

## Skills

- **[codebase-guardrails](docs/codebase-guardrails/README.md)**: finds the architecture decisions that make recurring bug classes impossible, in any stack or domain. Plans them for a new project, or audits existing code and ranks the three changes that buy the most. [Sample audit](docs/codebase-guardrails/sample-audit.md).

## Layout

- `skills/<name>/`: what gets installed. `SKILL.md` plus the reference files the agent reads.
- `docs/<name>/`: the page for people, with a sample output.
- `evals/<name>/`: test scenarios with expected behavior, for checking a change before release.

`docs/`, `evals/` and `assets/` aren't part of any skill: skills.sh skips them, and the plugin copies them with the repo but loads nothing from them.
- `assets/icon/`: the source of the plugin icon. To redraw `.claude-plugin/icon.png`, run `npm install --no-save playwright@1`, `npx playwright install chromium`, then `node assets/icon/render.cjs`. It needs network access for the font.

When a skill's guardrail list, modes or output format change, update its `docs/` page in the same commit; it repeats them for readers.

To release, bump `version` in `.claude-plugin/plugin.json`. Claude Code detects plugin updates by that string, so a change without a new version doesn't reach installed copies.

## License

MIT
