---
slug: snippets
title: Snippets the Team Reads
oneLiner: Glean pulls the email, parser rebuilds the page, cron pushes to Pages. 4 minutes every Monday 9AM.
status: live
shippedAt: 2026-04-15
tags: [glean, github-pages, cron, design-team]
screenshot: /screenshots/snippets.svg
links:
  - { label: "Snippets page (private)", url: "https://super-goggles-wwyeoqk.pages.github.io/" }
---

## Why I built it

The snippets email only delivers people you've pinned. Pinning all 26 of us in design is a chore most folks skip, so different teammates see different subsets and a lot of the writing goes unread. The email is for you. This page is the team's version of the same content. Single shared URL (private repo, no public access unless I add you as a contributor), complete by default, zero setup.

## What it is

A private webpage on GitHub Pages, gated to the dialpad org. Shows whoever actually posted that week, with their full snippet inline. The email keeps working as it always did. The page sits next to it.

## Zero ongoing work

A `launchd` cron on my laptop fires every Monday at 9 AM IST. It pulls the email snippets via Glean, parses each designer's section, regenerates the page, and pushes to GitHub. About 4 minutes end to end.

## Bonus

Highlight any text and add a private note, Google Docs style. Only you see them. Light by day, dark by night. This is just for me to make a note which lives in local storage so I am reminded to ask whoever whatever I need to.

## The /snippets-update command

Manual override I can hit any time. Useful before demos or if Monday's auto-run hiccups.

## Day to day

Nothing. The page updates while I make coffee. I open it, read what the team is thinking, leave notes on anything worth coming back to.
