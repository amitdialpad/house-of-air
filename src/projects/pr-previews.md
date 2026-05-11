---
slug: pr-previews
title: PR Previews That Don't Die
oneLiner: Daily cron refreshes a hidden marker so deploys never hit the 14-day cull.
status: live
shippedAt: 2026-05-01
tags: [cron, github-api, zsh, skills, automation]
screenshot: /screenshots/pr-previews.svg
links:
  - { label: "/extend skill", url: "#" }
---

## The problem

Prototype PR previews get killed after 14 days. The cleanup workflow removes the deploy folder and the URL goes 404. Painful when prototypes live 3 to 6 months and PMs ask for the link. Especially tiring when you work in a different timezone. Your PM or ENG pings you at 2AM saying the preview link from Beacon is dead and you cannot do anything till next morning. I never want that situation to come up.

## What I built

A tiny automation that runs on my laptop daily at 2 PM. It scans every open PR I authored, finds anything getting close to the 14 day cutoff, and refreshes the PR description with a hidden HTML comment marker. GitHub sees activity, the cleanup never marks it stale, the preview URL keeps working forever.

## Zero footprint

No new commits. No new comments on the PR thread. No labels added or removed. No CI rebuilds. The marker is invisible in the rendered Markdown.

## The /extend command

Manual override I can hit anytime. `/extend` refreshes anything stale right now (panic button before a demo). `/extend all` refreshes everything. `/extend status` shows me what last night's run touched.

## Day to day

Nothing. macOS banner pops up at 2 PM if anything got refreshed, otherwise silence. My preview URLs stay alive without me thinking about it.
