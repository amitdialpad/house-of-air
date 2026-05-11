---
slug: beacon-brief
title: Beacon Brief
oneLiner: A weekly newsletter on Beacon releases. Auto-written, auto-sent, 25 designers on the list.
status: live
shippedAt: 2026-04-12
tags: [github-actions, claude-haiku, gmail, design-team, weekly]
screenshot: /screenshots/beacon-brief.svg
links:
  - { label: "Beacon Brief page", url: "https://amitdialpad.github.io/design-pair-sessions/#beacon-brief" }
  - { label: "GitHub repo", url: "https://github.com/amitdialpad/design-pair-sessions" }
---

## Why I built it

Beacon (our design system) ships constantly. Designers don't read changelogs. By the time a component change matters, somebody's mock is already broken and there's a Slack thread about it.

## What it is

A weekly newsletter. Plain English. What changed in Beacon, why a designer should care, who to ask if you want to use it. Lands in your inbox at 10 AM IST every Monday. The same content is mirrored to a public page on the site.

## How it works

A GitHub Action wakes up Monday morning. It pulls the past week of Beacon releases (auto-synced into the repo from the beacon-app release feed), reads any notes I added on Wednesday, and asks Claude Haiku to turn it into a friendly brief. Bolded headline first, plain language body, version as a muted footnote. The brief commits itself to `docs/index.md` and emails out to a list of 25 designers via BCC.

## Zero ongoing work

I sometimes drop a sentence into `weekly-notes.md` on Wednesday if something needs human framing. Otherwise the brief writes itself. If anything fails, an email comes to my address. If everything works, I see the same email everyone else does on Monday.

## Day to day

Nothing. I read it like everyone else.
