# Riuh Merekah Dashboard Design System

> White engineering blueprint adapted from the supplied Visitors reference.

## Direction

Light, flat, precise, and geometric. Use a bright white canvas, a restrained grayscale structure, and lavender only for primary actions and selected states. Surfaces are separated by hairline borders and subtle tinting rather than heavy elevation.

## Tokens

- Carbon `#181925`: primary text
- Paper White `#ffffff`: primary surfaces
- Linen `#fafafa`: subtle section bands
- Mist `#f5f5f5`: secondary surfaces and controls
- Fog `#e8e8e8`: borders and dividers
- Ash `#999999`: muted text
- Graphite `#666666`: secondary text
- Lavender `#918df6`: primary action and selected state
- Iris `#9580ff`: compact secondary-emphasis action only
- Mint `#33c758` with Mint Wash `#def6e4`: positive state
- Amber `#ffa600`: warning or neutral emphasis
- Sky `#2c78fc`: informational category
- Magenta `#d6409f`: guest/profile category
- Ember `#ff3e00`: destructive or negative state

Use a single geometric humanist sans family, preferably Inter. Weights are 400, 500, 600, and 700. Use tight negative tracking throughout. UI type ranges from 12px to 24px; reserve 36px and above for page-level display content.

Spacing follows a 4px base unit: 4, 8, 12, 16, 20, 24, 32, 48, and 64px. Dashboard density is comfortable. Use 16px cards, 8px inputs, 24px tables, and full pills for buttons, chips, and tags.

## Components

- Primary buttons: lavender fill, tinted white text, pill radius, 14px/500, compact padding, subtle one-pixel shadow.
- Ghost buttons: Mist fill or transparent, Graphite text, pill radius, no dramatic elevation.
- Navigation: Carbon active text, Ash inactive text, lavender selected treatment.
- Cards and panels: Paper White, one-pixel Fog border, 16px radius. Prefer no shadow; dashboard focus panels may use a very soft layered shadow.
- Tables: white, Fog gridlines, 24px outer radius, 12 to 14px type, no decorative row striping.
- Inputs: Mist or white fill, Fog border, 8px radius, lavender focus ring.
- Positive metrics: Mint text only when paired with Mint Wash.

## Layout

Use a familiar sidebar, top bar, and scrolling content area. Maintain predictable grids and structural responsive behavior. Main content should have generous breathing room while dense data components remain compact. At narrow widths, collapse navigation and stack content without fluid display typography.

## Motion

Use 150 to 250ms state transitions with an ease-out curve. Animate opacity and transforms only. Respect `prefers-reduced-motion`. Motion communicates state and never delays task completion.

## Rules

- Never use pure black for text.
- Never use gradient text, decorative glass, or heavy shadows.
- Do not use lavender for body copy or decoration.
- Do not use multiple accents within one component.
- Keep every button, chip, badge, and tag pill-shaped.
- Preserve standard focus, hover, active, disabled, loading, and error states.
