---
title: The Claude Code advisor "trick", checked
description: A viral post sold a Sonnet, Haiku and Opus setup in Claude Code as something Anthropic had just shared. I checked it against the docs and ran the command. Most of it is real; some of it isn't.
date: 2026-11-05
tags: [claude-code, ai, agents]
---

A post went viral this week presenting a Claude Code "goldmine" as something Anthropic had just shared: Sonnet runs the session, Haiku subagents search the repo, and Opus reviews as an advisor. I checked it against the official docs and ran the command. Most of it holds up; some of it doesn't.

## What's real

The command works:

```bash
claude --model sonnet --advisor opus
```

The `--advisor` flag isn't listed in `claude --help`, and the docs say so. But inside the session, `/advisor` answers with the model acting as advisor.

The advisor has to be at least as capable as the main model. Try `--advisor haiku` on Sonnet and Claude Code refuses:

```text
"haiku" cannot advise "claude-sonnet-5-5" (the advisor must be at least as capable as the main model). The advisor will not be used for the main model.
```

Haiku subagents exist too: you set `model: haiku` in a subagent's frontmatter. The built-in Explore subagent, though, runs on your session's model, not Haiku.

## What's off

- **It isn't new.** Anthropic published ["The advisor strategy"](https://claude.com/blog/the-advisor-strategy) on April 9, and the advisor has been in the [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) since version 2.1.117, in April.
- **Opus doesn't step in at "three fixed moments".** According to the [docs](https://code.claude.com/docs/en/advisor), Claude tends to consult before committing to an approach, when an error keeps recurring and before declaring a task done, but the timing is "model-driven rather than rule-based".
- **The audit subagent may not see your changes.** With `isolation: worktree`, its copy of the repo is branched from your default branch, not from your session's HEAD ([subagent docs](https://code.claude.com/docs/en/sub-agents)). Unless you change that, its copy doesn't have the diff it's meant to check.
- **"JEV" isn't Anthropic.** It's Jev, a product from [TypeSafe](https://typesafe.ai/), added to the prompt as step five.
- **Cheaper than Opus all session, not free.** Every advisor call processes the whole conversation, uncached. On startup Claude Code itself warns it "may use more tokens". The docs say pairing a faster main model with a stronger advisor typically costs less than running the stronger model throughout.

## Two more details

- The advisor only works with the Anthropic API: not on Bedrock, Vertex or Foundry.
- It's turned off if you have `DISABLE_TELEMETRY` set.

## What I tested and what I didn't

I ran the command, `/advisor` and the Haiku refusal. The consultation timing, the worktree base and the cost come from the docs: I haven't measured a real task with the advisor.

Have you tried it? Which pairing are you running?
