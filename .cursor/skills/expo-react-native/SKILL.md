---
name: expo-react-native
description: Build production-quality mobile interfaces using Expo and React Native.
---

# Expo React Native

Use Expo and React Native conventions first.

## Principles

- Prefer Expo-supported APIs.
- Use React Native primitives appropriately.
- Respect safe areas.
- Handle Android and iOS differences when necessary.
- Keep components platform-friendly.
- Avoid web-only APIs.
- Prefer native-feeling interactions.

## Implementation

Before adding a dependency, check whether Expo or React Native already provides the capability.

Use appropriate APIs for:

- Files
- Sharing
- Notifications
- Device behavior
- Permissions
- Navigation
- Platform-specific behavior

Do not introduce unnecessary native complexity.

## Output

Generated components should be:

- Reusable
- Typed
- Responsive
- Accessible
- Performant

Do not generate web React code when a React Native implementation is required.