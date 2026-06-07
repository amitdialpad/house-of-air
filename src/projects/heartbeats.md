---
slug: heartbeats
title: Heartbeats
oneLiner: A quiet daily writing page. Write the update, hit Done, Markdown lands in a private repo.
status: live
shippedAt: 2026-06-06
tags: [github-pages, writing, markdown, private-repo, workflow]
previewLabel: GitHub Pages
links:
  - { label: "Live Heartbeats page", url: "https://amitdialpad.github.io/heartbeats/" }
  - { label: "GitHub repo", url: "https://github.com/amitdialpad/heartbeats" }
---

## Why I built it

Daily updates were getting scattered across chat, meetings, and half-remembered threads. I needed a calmer way to end the day: write the useful context once, send it where it needs to go, and keep a durable record.

## What it is

A static GitHub Pages app that opens directly into a writing surface. No dashboard first. No form fields. No status ceremony. Write the note in plain language, add screenshots or links if needed, then press **Done**.

## How it works

The public page is only the app shell. The actual updates live in a separate private repo as Markdown files. The browser publishes through the GitHub Contents API using a fine-grained token, so the workflow stays simple without needing a backend.

## Why it matters

The habit is the product. It gives Josh a clear async read, gives me a place to state decisions or concerns cleanly, and keeps the important context from dissolving in Slack.
