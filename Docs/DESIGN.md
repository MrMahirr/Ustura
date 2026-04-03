```markdown
# Design System Strategy: The Modern Grooming Editorial

## 1. Overview & Creative North Star: "The Obsidian Atelier"
This design system is built to transform a utility—booking a haircut—into a high-end editorial experience. Our Creative North Star is **"The Obsidian Atelier."** We reject the cluttered, utility-first layouts of standard booking apps in favor of a spatial, rhythmic experience that mirrors the precision of a master barber’s blade.

To break the "template" look, we utilize **Intentional Asymmetry**. Headers are rarely centered; they are weighted to the left with significant whitespace (using `spacing.20` and `spacing.24`) to create a sense of luxury and breathing room. Elements should overlap—an image might break the container of a surface, or a display headline might bleed into a secondary section—to create a sense of depth and custom craftsmanship.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, tonal blacks and a singular, authoritative gold accent. 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. We define boundaries through tonal shifts. For example, a `surface-container-low` section should sit directly against a `surface` background. The eye should perceive the change in depth through color, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#131318) for the main background.
- **Sectional Layer:** `surface-container-low` (#1B1B20) for grouping related content blocks.
- **Interactive Layer:** `surface-container-highest` (#35343A) for cards or interactive elements that need to "pop."

### Glass & Gradient Rule
To avoid a flat, "digital" feel, use **Glassmorphism** for floating elements (like a sticky navigation bar or a booking summary). Use `surface` at 80% opacity with a `20px` backdrop-blur. 
For Primary CTAs, do not use a flat hex. Apply a subtle linear gradient from `primary` (#E6C364) to `primary-container` (#C9A84C) at a 45-degree angle to simulate the sheen of polished brass.

---

## 3. Typography: The Sophisticated Voice
Typography is our primary tool for establishing authority. We pair the heritage of a serif with the clinical precision of a sans-serif.

*   **Display & Headlines (Noto Serif):** Use `display-lg` for hero statements. These should be treated as "Art Elements." Letter spacing should be slightly tight (-2%) to feel modern and aggressive.
*   **Titles & Body (Manrope):** Use `title-lg` for navigation and `body-md` for information. Manrope provides a clean, technical counterpoint to the serif, ensuring the "masculine" aesthetic remains modern and not "dated."
*   **Labels:** Use `label-md` in all-caps with `0.1rem` letter spacing for "Utility" text (e.g., "PRICE," "DURATION," "BARBER").

---

## 4. Elevation & Depth: Tonal Layering
We do not use standard Material Design drop shadows. We use light.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a "recessed" look, or a `surface-container-high` card on a `surface` background for a "raised" look.
*   **Ambient Shadows:** For floating modals, use an extra-diffused shadow: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5)`. The shadow must never look grey; it must look like a natural occlusion of light.
*   **The Ghost Border Fallback:** If a divider is mandatory for accessibility, use the `outline-variant` token at **15% opacity**. A 100% opaque border is a failure of the system's elegance.

---

## 5. Components

### Primary Buttons
- **Shape:** `rounded-sm` (0.125rem) for a sharp, tailored look.
- **Style:** Gradient fill (`primary` to `primary-container`). Text is `on-primary` (#3D2E00), bold, and centered.
- **Interaction:** On hover, the button should subtly scale (1.02x) and increase the shadow diffusion.

### Reservation Cards
- **Forbid Dividers:** Do not separate the barber's name from the time slot with a line. Use `spacing.4` of vertical whitespace or a subtle background shift to `surface-container-high`.
- **Imagery:** Barber profile photos and hairstyle examples should be high-contrast, desaturated (0.8 saturation), and use `rounded-md`.

### Input Fields
- **Style:** Underline-only or ghost-style. 
- **Active State:** When focused, the label (using `label-sm`) shifts to the `primary` gold, and the bottom "Ghost Border" increases to 2px width in `primary`.

### Time-Slot Chips
- **Unselected:** `surface-container-highest` background with `on-surface-variant` text.
- **Selected:** `primary` background with `on-primary` text. No borders.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Whitespace:** Use `spacing.16` or `spacing.20` between major sections. Luxury is defined by the space you *don't* use.
*   **Use High-End Imagery:** Only use photography with deep shadows and clear focal points.
*   **Intentional Asymmetry:** Offset your text blocks. If an image is on the right, let the headline overlap its left edge by `1rem`.

### Don't:
*   **No Rounded Corners:** Avoid `rounded-xl` or `rounded-full` (except for profile avatars). This is a "Sharp" system; use `sm` or `none` for a masculine, architectural feel.
*   **No High-Contrast Borders:** Never use a white or light-grey border. It breaks the "Obsidian" immersion.
*   **No Generic Icons:** Avoid thick, bubbly icons. Use thin-stroke (1px) linear icons that match the `on-surface-variant` color.

---

## 7. Signature Interaction: The "Gilded" Hover
Whenever a user interacts with a secondary element (a list item or a ghost button), use a transition that shifts the text color from `on-surface` to `primary` while a subtle 2px-wide "gold thread" (a `primary` color line) expands from the center-outward at the bottom of the element. This reinforces the "tailored" feel of the system.