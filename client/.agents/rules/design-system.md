---
alwaysApply: true
---
---
description: Global visual and UX rules for the Career OS application
globs:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.css"
alwaysApply: true
---

# Career OS — Global Design System Rules

## 1. Design Direction

The application must combine:

- Minimal productivity software aesthetics inspired by Linear and Raycast
- Premium Apple-style visual polish
- Modern SaaS usability
- A calm, professional and developer-friendly personality

The product should feel:

- Minimal
- Premium
- Fast
- Organized
- Professional
- Modern
- Trustworthy

Avoid making the interface look like a generic startup dashboard.

---

## 2. Minimal-First Design

Prioritize clarity, hierarchy and whitespace over decoration.

Every visual element must have a functional purpose.

Do not add decorative elements simply to make a screen look more visually impressive.

Prefer:

- Clear hierarchy
- Clean spacing
- Simple surfaces
- Strong typography
- Subtle depth

Avoid:

- Visual clutter
- Excessive decoration
- Unnecessary gradients
- Excessive cards
- Redundant information

---

## 3. Color System

Use a restrained color palette.

The application should primarily use:

- Background
- Surface
- Elevated surface
- Primary text
- Secondary text
- Muted text
- Border
- Primary accent
- Success
- Warning
- Error

Use one main accent color throughout the application.

Accent colors must be reserved for:

- Primary actions
- Important states
- Active navigation
- Selected elements
- Important highlights

Do not allow the accent color to dominate the UI.

Never introduce random colors inside individual components.

All colors must come from centralized design tokens.

---

## 4. No Excessive Gradients

Do not use large or decorative gradients as a default design technique.

Avoid:

- Neon gradients
- Rainbow gradients
- Large gradient backgrounds
- Gradient text everywhere
- Gradient buttons everywhere

A subtle gradient may be used only when it improves the hierarchy or communicates a specific state.

---

## 5. Spacing and Whitespace

Whitespace is an intentional part of the design.

Use consistent spacing tokens instead of arbitrary spacing values.

Sections should have enough breathing room to remain visually distinct.

Do not fill empty areas just because space is available.

The interface should feel spacious rather than compressed.

---

## 6. Typography

Typography must create most of the visual hierarchy.

Use a clean modern sans-serif font.

Use a consistent hierarchy:

- Display
- Heading
- Subheading
- Body
- Caption
- Metadata

Prefer hierarchy through:

- Font size
- Font weight
- Line height
- Spacing

Do not rely on excessive colors to distinguish text.

Avoid using too many font weights.

---

## 7. Surface and Card Design

Cards must represent meaningful groups of information.

Appropriate uses include:

- Resume
- Applications
- Cover letters
- Email templates
- Recent activity
- Sync status
- Quick actions

Do not put every individual piece of content inside a card.

Prefer subtle borders and background contrast over heavy shadows.

Default visual depth should follow:

spacing → surface contrast → subtle border → soft shadow

---

## 8. Border Radius

Use a small, consistent radius scale.

Recommended values:

- Small: 8px
- Medium: 12px
- Large: 16px
- Extra Large: 20–24px

Do not randomly assign different border radii to individual components.

---

## 9. Shadows

Shadows should be subtle.

Avoid:

- Large dark shadows
- Heavy floating effects
- Excessive glow

Use shadows primarily for:

- Modals
- Bottom sheets
- Popovers
- Floating elements

Most normal content should rely on borders and surface contrast.

---

## 10. Visual Hierarchy

Every screen must have a clear hierarchy:

Page title
→ Context / description
→ Primary action
→ Main content
→ Secondary information

The user should understand the purpose of a screen within a few seconds.

---

## 11. Primary Actions

Every important screen should have one visually dominant primary action.

Examples:

- New Application
- Sync Resume
- Create Cover Letter
- Export PDF
- Prepare Email

Do not make multiple unrelated actions visually dominant at the same time.

---

## 12. Secondary Actions

Secondary actions should have lower visual emphasis.

Examples:

- Edit
- Delete
- Duplicate
- Share
- More

Prefer:

- Text buttons
- Ghost buttons
- Icon buttons
- Context menus

rather than making every action a filled primary button.

---

## 13. Workflow-Centered UI

The application is not a collection of independent CRUD screens.

Design the experience around the user's career workflow:

Job
→ Application
→ Resume
→ Cover Letter
→ Email
→ Apply

Features should feel connected.

When appropriate, allow information such as company and role to flow naturally between these steps.

---

## 14. States Are Mandatory

Data-driven components must account for appropriate states.

Consider:

- Loading
- Loaded
- Empty
- Error
- Offline
- Syncing
- Synced
- Failed

Never leave the user uncertain about whether an action succeeded.

For example:

Resume
✓ Synced just now

Resume
↻ Syncing...

Resume
⚠ Unable to sync

---

## 15. Animation

Animations must be subtle, fast and purposeful.

Appropriate animation:

- Fade
- Slide
- Scale
- Layout transitions
- Press feedback
- Modal transitions

Avoid:

- Excessive bouncing
- Constant floating animations
- Long transitions
- Decorative animation everywhere
- Animations that slow down workflows

Performance and responsiveness always take priority over visual effects.

---

## 16. Mobile-First Design

The primary experience is a smartphone.

Do not design a desktop dashboard and simply shrink it for mobile.

Use:

- Thumb-friendly controls
- Large enough touch targets
- Bottom navigation
- Stacked layouts
- Bottom sheets
- Contextual menus
- Proper keyboard handling

Tablet and larger layouts should expand naturally from the same component system.

---

## 17. Native UX Patterns

Respect familiar mobile interaction patterns.

Prefer established patterns for:

- Navigation
- Bottom sheets
- Modals
- Pull to refresh
- Swipe interactions
- File selection
- Sharing
- Keyboard interaction

Do not reinvent standard mobile behaviors without a clear reason.

---

## 18. Icons

Use one consistent icon system.

Prefer Lucide icons where available.

Icons should communicate function.

Do not use emojis as primary UI icons.

Do not mix multiple unrelated icon styles.

---

## 19. Accessibility

All interactive elements must have appropriate accessibility semantics.

Ensure:

- Sufficient color contrast
- Adequate touch targets
- Accessible labels
- Readable text
- Clear focus/pressed states
- Meaningful error messages

Do not communicate important information using color alone.

---

## 20. Responsive Layout

Never rely on fixed screen dimensions for core layouts.

Use:

- Flexbox
- Responsive spacing
- Dynamic sizing
- Content-driven layouts
- Safe area handling

Test layouts on:

- Small phones
- Large phones
- Tablets

Prevent:

- Text clipping
- Horizontal overflow
- Overlapping elements
- Buttons being pushed off-screen

---

## 21. Theme Architecture

Support light and dark themes from the beginning.

Do not hardcode theme-specific colors inside individual components.

Use semantic tokens such as:

- background
- surface
- text
- textMuted
- border
- accent

Theme switching should happen through the centralized design system.

---

## 22. Component Reusability

Build reusable components before creating screen-specific UI.

Prefer components such as:

- Button
- IconButton
- Card
- Badge
- Input
- SearchInput
- Modal
- BottomSheet
- EmptyState
- LoadingState
- ErrorState
- FileCard
- SectionHeader
- StatusIndicator

Do not duplicate nearly identical UI across multiple screens.

---

## 23. Design Tokens

All visual constants should be centralized.

Create a design system for:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Animation durations
- Component sizes

Do not repeatedly hardcode values throughout the application.

Bad:

backgroundColor: "#F7F7F7"

when the same color is used throughout the app.

Prefer semantic tokens.

---

## 24. Performance

The application must feel fast.

Avoid:

- Unnecessary re-renders
- Heavy animations
- Unoptimized images
- Inefficient lists
- Large unnecessary component trees
- Duplicate state

Prefer performant React Native patterns.

Do not sacrifice usability for visual effects.

---

## 25. File and Document UI

Documents are core to this product.

Resume and cover-letter interfaces should clearly communicate:

- File name
- File type
- Updated time
- Sync state
- Availability offline
- Preview availability
- Share/export actions

Documents should feel like important first-class objects in the application.

---

## 26. Avoid Generic Dashboard Design

Do not automatically use:

- Sidebar + 10 stat cards
- Giant graphs
- Excessive KPI cards
- Random dashboard widgets
- Huge hero sections

The interface should feel like a focused personal productivity application.

---

## 27. Content Density

Use medium information density.

The UI should not feel:

- Empty and overly spacious
- Dense and overwhelming

Prioritize the information most relevant to the current task and progressively reveal secondary information.

---

## 28. Consistency Rule

Once a UI pattern is established, reuse it.

Examples:

If one screen uses a certain:

- Button height
- Card radius
- Header style
- Section spacing
- Status indicator
- Modal style

other screens should use the same pattern unless there is a strong UX reason not to.

---

## 29. Do Not Overdesign

When deciding between two valid designs, choose the simpler one.

Prefer:

simple → clear → polished

over:

complex → decorative → impressive

The product should feel intentionally designed rather than visually overloaded.

---

## 30. Product Personality

The final UI personality should be:

"Quietly premium. Highly organized. Developer-friendly. Professional enough for career work. Fast enough to feel like a tool rather than a website."

Use the following mental reference:

Linear + Apple + modern SaaS

Do not copy any existing product directly.

Use these references only for principles, not imitation.