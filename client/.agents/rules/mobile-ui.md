---
alwaysApply: true
---
---
description: Mobile UX and React Native UI rules for the Career OS application
globs:
  - "**/*.tsx"
  - "**/*.jsx"
  - "app/**/*"
  - "components/**/*"
alwaysApply: true
---

# Mobile UI Rules

## Platform

This is a mobile-first React Native / Expo application.

Design for phones first. Tablet layouts should expand from the phone layout rather than using a separate desktop design.

Do not design web-style dashboards inside the mobile application.

---

## Layout

Prefer:

- Flexbox
- Safe area aware layouts
- Content-driven sizing
- ScrollView for normal content
- FlatList or FlashList for long lists
- Bottom sheets for contextual actions
- Native navigation patterns

Avoid:

- Fixed screen heights
- Absolute positioning for primary layouts
- Hardcoded device dimensions
- Horizontal overflow
- Content positioned relative to the physical screen size

---

## Touch Targets

Interactive controls must be comfortably tappable.

Prefer a minimum effective touch target of approximately 44x44 points.

Do not create tiny icon-only buttons without sufficient touch area.

---

## Navigation

Navigation must remain simple and predictable.

Primary navigation should expose only the most important destinations.

Use contextual navigation for secondary features.

Avoid creating a separate navigation item for every feature.

---

## Screen Structure

A typical screen should follow:

Header
→ Context
→ Primary action
→ Main content
→ Secondary content

Do not introduce unnecessary headers, toolbars or duplicated titles.

---

## Buttons

Use a small, consistent button hierarchy:

1. Primary
2. Secondary
3. Ghost
4. Destructive

Do not create a new button style for every screen.

Buttons must clearly communicate:

- Default
- Pressed
- Disabled
- Loading

---

## Inputs

Inputs must have:

- Clear labels
- Useful placeholders
- Proper keyboard type
- Validation feedback
- Focus state
- Disabled state
- Error state

Never rely only on placeholder text as the field label.

---

## Forms

Forms should be easy to complete one-handed.

Group related fields together.

Avoid unnecessarily long forms.

For application-related forms, preserve user-entered data when navigating between steps.

---

## Modals and Sheets

Use modals or bottom sheets for:

- Short forms
- Confirmation
- Contextual actions
- Quick selection
- Filtering

Do not use modals for large primary workflows when a normal screen is more appropriate.

---

## Lists

Lists should have:

- Clear row hierarchy
- Consistent row height
- Appropriate separators or spacing
- Visible primary information
- Secondary metadata with lower emphasis
- Clear press feedback

Use virtualization for large lists.

Never render hundreds of complex list items unnecessarily.

---

## Loading

Prefer contextual loading indicators.

Examples:

- Skeleton for content loading
- Spinner inside a button during an action
- Progress indicator for uploads
- Sync status for files

Avoid blocking the entire screen for small background operations.

---

## Empty States

Empty states must explain:

1. What is empty
2. Why it matters
3. What the user can do next

Example:

"No cover letters yet"

"Create a reusable template for your next application."

[Create Template]

---

## Error States

Errors must be understandable and actionable.

Avoid technical messages such as:

"Network request failed"

Prefer:

"Couldn't sync your resume"

"Check your connection and try again."

[Retry]

Do not expose raw API errors to users.

---

## Offline State

The application must gracefully handle offline usage.

Clearly distinguish:

- Locally available
- Syncing
- Synced
- Waiting for connection
- Sync failed

Offline mode should not make cached content disappear.

---

## Keyboard

Handle the mobile keyboard correctly.

Ensure focused inputs are visible.

Avoid buttons and fields being hidden behind the keyboard.

Use keyboard-aware layouts where appropriate.

Dismiss the keyboard when appropriate after submitting or completing a field.

---

## Safe Areas

Respect device safe areas.

Do not place content behind:

- Notches
- Dynamic Island
- Home indicator
- System UI

Use Expo / React Native safe-area APIs correctly.

---

## Accessibility

Every interactive element must have:

- Accessible label where necessary
- Appropriate role
- Meaningful state
- Sufficient contrast

Do not communicate important status information using color alone.

---

## Feedback

User actions should have immediate feedback.

Examples:

Tap → pressed state

Save → loading → success

Sync → syncing → synced

Delete → confirmation → removed

Export → progress → completed

---

## Animation

Animation should improve understanding.

Use short transitions and native-feeling motion.

Do not delay interactions with unnecessary animation.

Avoid decorative animations inside ordinary productivity screens.

---

## Documents

Documents are first-class objects.

Resume and cover-letter UI should clearly show:

- Name
- Type
- Updated time
- Sync state
- Preview
- Share
- Export

The user should immediately know which document is current.

---

## Mobile Design Principle

The application should feel like a native productivity tool.

It should never feel like a website squeezed into a phone.