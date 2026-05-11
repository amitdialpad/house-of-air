---
slug: design-review-mode
title: Design Review Mode
oneLiner: Figma-style design reviews for live browser prototypes. Point, click, comment, post to the GitHub PR. No Figma, no meetings, no backend.
status: paused
shippedAt: 2026-02-08
tags: [vue, dialtone, github-api, design-review, prototypes]
screenshot: /screenshots/design-review-mode.svg
links:
  - { label: "design-studio PR #221", url: "https://github.com/dialpad/design-studio/pull/221" }
---

## Why I built it

Design work used to live in Figma. Figma had an amazing review workflow built in. Anyone could click into a frame, leave comments, and designers could reply inline. That whole thread of feedback sat right next to the design.

Then design work moved into the browser. We prototype directly in Vue, in design-studio, with Claude. The browser-first rhythm is faster and the artifacts are real. But the Figma review workflow doesn't come with it. No built-in way for a reviewer to point at an element and leave a comment.

I built Design Review Mode to put that back. Same review affordances Figma gave us, working on top of a live browser prototype.

## What it is

A review mode that sits on top of any design-studio prototype. The reviewer opens a special link. The URL carries a `reviewSession` ID that matches a hidden marker embedded in the PR description. Press `C` to enter comment mode, then click any element on the page to drop a comment. Comments appear as numbered red pins. "Update PR" posts all of them in one batch to the PR. The post is both readable markdown and hidden structured JSON inside an HTML comment. The designer can later re-open the same link and see the reviewer's pins as read-only markers (red = unresolved, green = resolved).

## How it stays clean

Every constraint was deliberate:

1. **Git is the source of truth.** The GitHub PR is the database. No backend, no servers, no paid services.
2. **No iframes, no Chrome extensions.** Everything runs inside the prototype, inside the browser, talking to GitHub's API.
3. **No layout reflow.** The review UI is a fixed-position overlay. The prototype stays full-width.
4. **Authenticated as the reviewer.** Fine-grained GitHub PAT, repo-scoped, stored in localStorage. Comments appear as Josh (or whoever's reviewing), not as a bot.
5. **Activation is a guardrail.** Review mode doesn't turn on with `?review=1`. It only activates when a URL `reviewSession` value matches one embedded in the PR description by the `/design-pr` skill. Casual link-sharing can't accidentally enable it.
6. **Dialtone only.** Every component, every token. The review UI looks like it belongs.

## What's built

Steps 1 through 9 of Phase 2 are done. All of the review surface. Comment markers, the composer, smart positioning for fixed vs scrolling elements, modal detection, localStorage draft persistence, batched submission, read-only mode for the designer side, resolve/unresolve with visual state, a bottom pill that doubles as session info and toast surface. 3,967 lines across 13 files. Live on the PR preview at design-studio #221.

## Why it's paused

Phase 1 (the `/design-pr` skill that automates PR creation with the matching reviewSession marker) hasn't shipped yet. The review mode itself works end-to-end. You can test it today by appending `?reviewSession=test` to any prototype route on the PR preview. Rolling it out properly needs Step 10 to land. Currently sitting at "build-paused" on GitHub waiting for that piece.

## Day to day

Demo-able right now, not yet in anyone's actual review rhythm. When Step 10 ships and a designer runs `/design-pr` to start an async review, the flow becomes end-to-end and the tool lands in the team's hands.
