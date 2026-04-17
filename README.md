# jamietowater.github.io

## Project structure

### HTML
- `index.html`: page structure and content.

### CSS (load order matters)
- `assets/css/base.css`: fonts, reset, CSS variables, global body/scrollbar styles.
- `assets/css/utilities.css`: keyframe animations, reveal transitions, delay utilities, status bar.
- `assets/css/components.css`: cursor, nav, buttons, project cards, timeline, form inputs, contact links.
- `assets/css/layout.css`: hero, about, projects grid, skills, interests, contact, footer section layouts.
- `assets/css/sphere.css`: interactive sphere, labels, popup, and all sphere-specific styles.
- `assets/css/responsive.css`: tablet/mobile breakpoints.

### JavaScript
- `assets/js/ui.js`: cursor tracking, nav scroll state, typewriter effect, card toggle, icon reveals, clock, hero tilt.
- `assets/js/hero.js`: hero canvas particle animation and print-head system.
- `assets/js/sphere.js`: interactive sphere rotation, label positioning, and popup connector behavior.
- `assets/js/forms.js`: contact form success message handling and local-file safety guard.

## Quick maintenance tips
- **Layout updates**: edit `layout.css` for section layouts, `components.css` for UI elements, `sphere.css` for interactive sphere.
- **Animation tweaks**: animations live in `utilities.css`, sphere animations in `sphere.css`.
- **Responsive behavior**: all media queries in `responsive.css`.
- **Interactive behavior**: split by feature across JavaScript files (`ui.js`, `hero.js`, `sphere.js`, `forms.js`).
- **Finding styles**: each section name in the CSS files clearly marks where that section's styles live.