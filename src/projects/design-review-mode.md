---
slug: design-review-mode
title: Design Review Mode
oneLiner: Figma-style comments for live browser prototypes: point, click, comment, and share.
status: paused
shippedAt: 2026-02-08
tags: [vue, design-review, prototypes]
links:
  - { label: "Project link", url: "#" }
---

## Why I built it

Browser prototypes are useful because the artifact behaves like the real thing, but they do not naturally come with the convenient point-and-comment review flow people expect from design tools.

## What it is

A lightweight review layer for a live prototype. A reviewer turns on comment mode, clicks an element, leaves a note, and sees numbered markers in context. The designer can revisit the same review and track which notes are still open.

## Design constraints

The review controls sit above the prototype without changing its layout. Comments are grouped into one shareable update, and the review state remains separate from the prototype itself.

## Current state

The interaction works as a prototype. The project is paused while I decide whether it belongs as a standalone tool or as part of a broader publishing workflow.
