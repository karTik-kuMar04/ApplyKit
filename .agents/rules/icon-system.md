---
trigger: always_on
---

---
description: Custom SVG icon system for the Career OS application
---

# Icon System

## Core Requirement

Do not use Lucide React or another third-party icon library for application UI icons.

The application must use a custom SVG-based icon system.

## Implementation

Use SVG icons through React Native SVG-compatible components.

Prefer:

components/
  ui/
    icons/
      HomeIcon.tsx
      ResumeIcon.tsx
      ApplicationIcon.tsx
      TemplateIcon.tsx
      SettingsIcon.tsx
      EmailIcon.tsx
      CoverLetterIcon.tsx
      SyncIcon.tsx
      ShareIcon.tsx
      DownloadIcon.tsx
      PlusIcon.tsx
      MoreIcon.tsx
      ArrowRightIcon.tsx
      CheckIcon.tsx
      ErrorIcon.tsx
      SearchIcon.tsx

Use a consistent icon API:

<Icon size={24} color={...} />

Icons must support theme-aware colors and configurable size.

## Visual Style

Icons should feel:

- Realistic
- Refined
- Professional
- Slightly dimensional where appropriate
- Consistent with the premium SaaS design language

Do not mix radically different icon styles.

Avoid:

- Cartoon icons
- Emoji
- Random icon packs
- Excessive gradients
- Excessive 3D effects
- Inconsistent stroke widths

## SVG Quality

SVG paths must be clean and optimized.

Avoid unnecessarily complex SVG structures.

Prefer reusable SVG components.

Keep viewBox values consistent.

Icons should scale cleanly at:

- 16px
- 20px
- 24px
- 32px
- 48px

## Accessibility

Icons that communicate an action must have accessible labels when they are interactive and do not have visible accompanying text.

Decorative icons should not unnecessarily be exposed to screen readers.

## Existing Icons

Before creating a new icon:

1. Check whether the icon already exists in the custom icon system.
2. Reuse an existing icon if appropriate.
3. Only create a new SVG icon when necessary.

## Library Removal

Do not introduce a replacement icon library.

Once all Lucide usages have been removed, remove the Lucide dependency from package.json if it is no longer required elsewhere.