---
alwaysApply: true
---
---
description: React Native architecture and code organization rules for the Career OS application
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
alwaysApply: true
---

# Architecture Rules

## Core Principle

Build the application as a maintainable product, not as a collection of generated screens.

Prefer simple architecture over premature abstraction.

---

## Folder Structure

Keep responsibilities separated.

Preferred structure:

app/
components/
  ui/
  forms/
  documents/
  applications/
features/
  resume/
  applications/
  cover-letters/
  emails/
lib/
hooks/
services/
types/
constants/
utils/

Adjust the structure when the actual project requires it, but preserve separation of responsibility.

---

## Components

Components should have one primary responsibility.

Prefer:

ResumeCard
SyncStatus
TemplateCard
ApplicationCard

over giant components containing many unrelated responsibilities.

Avoid components larger than necessary.

When a screen becomes difficult to understand, extract meaningful components.

---

## Reuse

Before creating a new component, check whether an existing component can be reused.

Do not duplicate:

- Buttons
- Inputs
- Cards
- Headers
- Status indicators
- Modals
- Empty states
- Loading states

Create shared components when the same UI pattern appears multiple times.

---

## Business Logic

Keep business logic out of presentation components when practical.

UI components should primarily handle:

- Rendering
- Interaction
- Display state

Business logic should live in:

- Hooks
- Services
- Utilities
- Feature modules

---

## API / Service Layer

Do not call external APIs directly from many unrelated components.

Centralize API interaction inside service modules.

Example:

services/
  resumeService.ts
  templateService.ts
  applicationService.ts

Components should consume a clean interface instead of knowing backend details.

---

## Types

Use TypeScript throughout the application.

Create explicit types for important domain objects.

Examples:

Resume
Application
CoverLetterTemplate
EmailTemplate
Document
SyncStatus

Avoid unnecessary `any`.

Do not use type assertions to hide real type problems.

---

## State Management

Use the smallest appropriate state solution.

Prefer:

Local state
→ component state

Shared feature state
→ custom hooks / context where appropriate

Server state
→ dedicated server-state patterns when needed

Do not introduce a global state library until there is an actual requirement.

---

## Data Flow

Prefer predictable one-directional data flow.

Avoid deeply tangled state dependencies.

Keep ownership of state clear.

A component should know:

- Where its data comes from
- Who can modify it
- What happens after modification

---

## Environment Variables

Secrets and configuration must never be hardcoded into application code.

Never expose privileged backend credentials in the mobile client.

Public client configuration and sensitive server credentials must remain separate.

---

## Error Handling

Handle errors at the appropriate layer.

Services should return or throw meaningful errors.

UI should convert those errors into user-friendly states.

Never render raw backend errors directly.

---

## Async Operations

Every meaningful asynchronous operation should consider:

Idle
→ Loading
→ Success
→ Error

For synchronization workflows also consider:

Offline
→ Waiting
→ Syncing
→ Synced
→ Failed

---

## File Handling

File operations should be centralized where practical.

Examples:

- Download
- Cache
- Preview
- Share
- Export
- Delete

Do not implement file handling separately inside every screen.

---

## Performance

Avoid unnecessary rendering.

Use memoization only when it solves an observed or likely performance issue.

Do not blindly wrap every component in memoization.

For lists:

- Use virtualization
- Use stable keys
- Avoid expensive inline calculations
- Avoid unnecessary nested lists

---

## Dependencies

Do not install a library for functionality that can be implemented simply with existing project tools.

Before adding a dependency:

1. Check whether the feature already exists in Expo or React Native.
2. Check whether an existing dependency can solve it.
3. Add a dependency only when it provides meaningful value.

Do not introduce duplicate libraries for the same purpose.

---

## Styling

Use the project's centralized design system.

Do not scatter arbitrary colors, spacing values, radii or typography values throughout components.

Prefer semantic design tokens.

---

## Theme

All UI must support the application's theme architecture.

Components must not assume light mode or dark mode.

Do not use hardcoded theme-specific colors inside reusable components.

---

## Naming

Use clear names.

Components:

PascalCase

Functions:

camelCase

Constants:

camelCase or UPPER_SNAKE_CASE depending on project convention

Types:

PascalCase

Do not use cryptic abbreviations.

---

## Comments

Write comments only when they provide useful context.

Do not comment obvious code.

Prefer self-explanatory code.

Good:

// Preserve the cached resume when the network is unavailable.

Bad:

// Set loading to true.

---

## Generated Code

Never generate placeholder architecture that will need to be rewritten immediately.

Do not create:

- Fake API layers with no purpose
- Unused abstractions
- Empty services
- Dozens of premature utility files
- Mock features without a reason

Build only what the current phase requires while keeping future extension points clean.

---

## Existing Code

Before modifying an existing feature:

1. Inspect the relevant files.
2. Understand existing patterns.
3. Reuse existing components and utilities.
4. Make the smallest coherent change.

Do not rewrite working architecture unnecessarily.

---

## Quality Rule

Generated code must be:

- Type-safe
- Readable
- Reusable
- Maintainable
- Performant
- Consistent with the project architecture

Prefer boring, predictable engineering over clever abstractions.