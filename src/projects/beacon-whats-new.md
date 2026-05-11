---
slug: beacon-whats-new
title: Beacon What's New Drawer
oneLiner: Auto-syncing release notes for designers who never read the changelog.
status: building
shippedAt: 2026-05-08
tags: [beacon, dialtone, design-system, vue]
screenshot: /screenshots/beacon-whats-new.svg
links:
  - { label: "Beacon PR preview", url: "https://beacon.dialpad.design/deploy/pr-616/#/inbox" }
  - { label: "Jira: DDT-1799", url: "#" }
  - { label: "GitHub: PR #616", url: "https://github.com/dialpad/beacon-app/pull/616" }
---

## The problem

Beacon ships Dialtone updates constantly. Designers don't read the release notes. They find out a component changed when their mock breaks.

## What I built

A "What's New" drawer baked into the Beacon app. Pulls the latest releases automatically, surfaces them where designers actually live. No more "wait, when did this change?"

## Status

Round one merged. Round two with Josh's fixes is up at PR #616, sitting in review. DDT-1799 in Jira. Once this lands, every Dialtone release shows up in Beacon within minutes without anyone publishing anything.

## What makes it work

The drawer auto-syncs from the Dialtone release feed. No manual curation, no "remember to update the changelog" rituals. Designers see the same metadata engineers see, in the place where they already work.
