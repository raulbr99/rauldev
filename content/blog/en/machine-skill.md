---
title: machine-skill, one line in and a working 3D machine out
description: I described a truck air brake in one line and Claude Code built it in 3D, cut it open and broke it. The skill behind it is open source and it's called machine-skill.
date: 2026-11-05
tags: [claude-code, three-js, skills]
---

I described a truck air brake in one line. Claude Code built it in 3D, cut it open and broke it.

The skill behind it is open source. It's called [machine-skill](https://github.com/AirsupHQ/machine-skill).

![The air brake cut open, with every part labelled and the brake torque on the right](/blog/machine-skill/corte.jpg)

## How it works

You type something like `/machine a mechanical watch movement` and Claude builds a 3D simulation of it in a single HTML file, with three.js and no build step.

What it does:

- It looks up the real machine first and builds it to real size, with named parts.
- It uses real materials: steel, titanium, copper, brass, glass.
- It runs a small physics model, so every motion and every number on screen is calculated, and it shows you the equations.
- It lets you explode the machine, cut it open, look through it in x-ray, slow it down and break it.
- One command records a 28-second film, in 1080×1350 for the feed.

## My test

The line I gave it is the one at the top of the picture: an S-cam air drum brake on a truck drive axle, cut open, that breaks when the slack adjuster runs out of stroke.

It took about 50 minutes of Claude working on its own, counting the time it spent recording the film. The film is in [my post on X](https://x.com/sr_rauldev/status/2117274125848703025).

## Before you use it

It's MIT licensed. It runs in Claude Code, and other agents that read skills, like Codex or Cursor, can use it too. The authors say it plainly: the physics is "a small honest model, not CFD or FEA."

Their gallery has every machine running live: [airsup.ai/lab/skill](https://airsup.ai/lab/skill).

Which machine would you build with it?
