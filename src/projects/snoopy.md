---
slug: snoopy
title: Snoopy
oneLiner: A research pipeline that turns structured product analytics into readable briefs.
status: live
shippedAt: 2026-02-23
tags: [python, analytics, research, automation]
previewLabel: Project link
links:
  - { label: "Project link", url: "#" }
---

## What it is

A reusable Python research toolkit. It collects the relevant analytics, calculates the important measures, checks the result for obvious problems, and asks a language model to turn the structured output into a readable brief.

## Why I built it this way

The core rule is simple: code does the maths; the language model does the writing. That keeps exact values intact while still producing something a designer or product manager can understand quickly.

## The pipeline

1. Gather the required data.
2. Calculate funnels, rates, and comparisons in code.
3. Check the output before anything is written.
4. Add the context needed to interpret the numbers.
5. Produce a concise brief and save it for later.

## What's portable

The same shape works for many research questions. Change the input, calculation, and prompt while keeping the verification and reporting workflow intact.
