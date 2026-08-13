---
name: mobile-performance
description: Keep the Career OS React Native application fast, responsive and memory-efficient.
---

# Mobile Performance

Performance is a product feature.

## Rendering

Avoid unnecessary re-renders.

Use stable props and callbacks where they provide measurable value.

Do not overuse memoization without a reason.

## Lists

For large collections:

- Use FlatList or FlashList.
- Use stable keys.
- Avoid rendering unnecessary off-screen content.
- Avoid expensive calculations inside render.

## Images and Documents

Avoid loading unnecessarily large assets.

Use appropriate caching.

Do not repeatedly download the same document when a valid cached copy exists.

## Animation

Prefer performant native-driven animation solutions.

Animations must never block user interaction.

Keep transitions short and purposeful.

## Async Work

Do not block the entire interface for background operations.

Show contextual loading states.

Keep cached content usable whenever possible.

## Network

Avoid unnecessary requests.

Prefer:

- Caching
- Reusing existing data
- Debouncing user-triggered searches
- Refreshing only when required

## General Rule

Do not prematurely optimize everything.

First create correct, clean code.

Optimize areas that affect:

- Startup
- Scrolling
- Navigation
- File previews
- Synchronization
- Large lists