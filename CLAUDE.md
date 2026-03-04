# CLAUDE.md — Cafe Aroma Project Guide

This file documents the project structure, development workflows, and conventions for AI assistants working on this repository.

## Project Overview

**Cafe Aroma** is a static marketing website for a specialty coffee café in Tokyo, Japan. The site is written in Japanese and targets local customers. It is a pure front-end project with no backend, no database, and no JavaScript framework.

**Live repository:** https://github.com/kuwajimahideharu/cafe-aroma

**Technology stack:**
- HTML5 (single-page, semantic markup)
- Tailwind CSS v4 (locally compiled — no CDN)
- Vanilla JavaScript (no frameworks, no build bundler)
- Node.js tooling only for CSS compilation and favicon generation

---

## Repository Structure

```
cafe-aroma/
├── index.html               # Entire site — all content lives here (595 lines)
├── css/
│   └── style.css            # Compiled & minified Tailwind output (DO NOT edit directly)
├── src/
│   └── input.css            # Tailwind CSS source — edit this for styles
├── js/
│   └── main.js              # All client-side JavaScript (236 lines)
├── images/                  # Local image assets
│   ├── hero.jpg             # Hero background (~588KB)
│   ├── concept.jpg          # Concept section image
│   ├── gallery-*.jpg        # 6 gallery photos
│   ├── favicon.jpg          # Source favicon image
│   ├── favicon-16.png       # Generated favicon (16×16)
│   ├── favicon-32.png       # Generated favicon (32×32)
│   └── apple-touch-icon.png # Generated favicon (180×180)
├── scripts/
│   └── generate-favicon.js  # Favicon generation script (uses sharp)
├── package.json
└── package-lock.json
```

**Key principle:** This is a single-page site. All HTML content is in `index.html`. There are no partials, templates, or component files.

---

## Development Commands

```bash
# Install dependencies (first time only)
npm install

# Watch mode — rebuilds css/style.css whenever src/input.css or HTML/JS changes
npm run dev

# Production build — generates minified css/style.css
npm run build

# Regenerate favicon variants from images/favicon.jpg
npm run favicon
```

**Always run `npm run build` before committing** if you changed anything in `src/input.css`, `index.html`, or `js/main.js` — the compiled `css/style.css` must be committed alongside source changes.

---

## CSS Conventions

### Tailwind v4 Setup

The project uses **Tailwind CSS v4** with a local CLI build (not the CDN). The source file is `src/input.css`.

```css
@import "tailwindcss";

@theme {
  --color-brand-dark: #4a3b32;    /* Dark brown — primary text/nav */
  --color-brand-light: #8c7b70;   /* Taupe — secondary text */
  --color-brand-accent: #c9a66b;  /* Gold — accents, buttons, focus rings */
  --color-brand-bg: #fdfbf7;      /* Cream — site background */
  --font-sans: "Noto Sans JP", sans-serif;
  --font-serif: "Shippori Mincho", serif;
}
```

**Custom CSS classes** (defined in `src/input.css`):

| Class | Purpose |
|---|---|
| `.hero-bg` | Hero section with background image + overlay |
| `.skip-link` | Accessibility skip-to-content link (visible on focus) |
| `.scroll-reveal` | Elements that fade in on scroll (JS adds `.revealed`) |
| `.gallery-item` | Hover zoom effect (scale 1.08) |
| `.review-stars` | Gold star ratings |
| `.btn-loading` | Disabled appearance during form submission |
| `.spinner` | CSS animated loading spinner |
| `.nav-link.active` | Active section indicator in nav |

### Adding Styles

1. Prefer **Tailwind utility classes** directly in `index.html`.
2. For shared, reusable patterns add a custom class to `src/input.css`.
3. **Never edit `css/style.css` directly** — it is generated output.
4. After editing `src/input.css`, run `npm run build` to regenerate output.

### Tailwind Source Scanning

Tailwind scans these paths to determine which classes to include:
```css
@source "../index.html";
@source "../js/**/*.js";
```

If you add new files that use Tailwind classes, add a corresponding `@source` directive.

---

## JavaScript Conventions

All JavaScript lives in `js/main.js`. It uses **vanilla ES6+** with no framework or bundler.

### Modules / Features

The file is organized into self-contained blocks with comment headers:

1. **Mobile menu toggle** — hamburger menu with Escape key support and ARIA
2. **Smooth scroll** — intercepts `a[href^="#"]` clicks
3. **Header scroll effect** — adds shadow + background on scroll > 50px
4. **Formspree contact form** — AJAX POST with loading state and error handling
5. **Active navigation** — Intersection Observer updates `.nav-link.active`
6. **Hero fade-in** — staggered animation for `.animate-fade-in-up` elements
7. **Back-to-top button** — show/hide + smooth scroll
8. **Scroll reveal** — Intersection Observer reveals `.scroll-reveal` elements

### Conventions

- Use `document.addEventListener('DOMContentLoaded', ...)` for initialization.
- Use `IntersectionObserver` for scroll-based effects (do not use scroll event listeners for performance).
- Keep all DOM manipulation within `js/main.js` — no inline `onclick` attributes in HTML.
- ARIA attributes (`aria-expanded`, `aria-label`) must be updated alongside visual changes.

---

## HTML Conventions

### Page Sections

The site has 9 major sections in order:

| Section | `id` | Content |
|---|---|---|
| Header | `header` | Fixed navigation |
| Hero | `hero` | Full-bleed background image + CTA |
| Concept | `concept` | Brand story + image |
| Gallery | `gallery` | 3×2 photo grid |
| Menu | `menu` | Coffee/food items with prices |
| Reviews | `reviews` | 3 customer testimonials |
| Shop Info | `shop-info` | Address, hours, Google Maps |
| Contact | `contact` | Formspree form |
| Footer | `footer` | Links, hours summary, social |

### Language & Content

- All user-facing content is in **Japanese**.
- Comments in HTML and JS may be in Japanese or English.
- Prices use the `¥` symbol (e.g., `¥550`).
- Phone numbers use Japanese format: `03-XXXX-XXXX`.
- Postal codes use Japanese format: `〒150-0000`.

### Accessibility Requirements

- All images must have descriptive `alt` attributes (in Japanese where appropriate).
- Interactive elements must have appropriate `aria-*` attributes.
- The skip link (`#main-content`) must remain at the top of `<body>`.
- Focus indicators use the gold accent color (`--color-brand-accent`).
- Maintain `:focus-visible` styles — do not remove `outline: none` without a replacement.

### SEO / Meta Tags

The `<head>` includes:
- Open Graph Protocol (OGP) tags for social sharing
- Twitter Card meta tags
- JSON-LD structured data (`CafeOrCoffeeShop` schema)
- Canonical URL

When updating business information, update it in **all three places**: visible content, OGP meta tags, and JSON-LD.

---

## Images

- All images are stored locally in `/images/`. Do not link to external image hosts.
- Images should be reasonably compressed before adding (hero.jpg is ~588KB, which is acceptable for a hero).
- Favicons are generated from `images/favicon.jpg` using `npm run favicon`. Do not edit favicon PNGs directly.
- Gallery images follow the naming convention `gallery-{description}.jpg`.

---

## External Integrations

### Formspree (Contact Form)

- Endpoint: `https://formspree.io/f/xbddjzvr`
- Fields: `name`, `email`, `message`
- **Important:** The first submission to a new Formspree endpoint requires activation via an email confirmation link sent to the site owner.

### Google Maps

- An `<iframe>` embed is used in the shop info section.
- The embed URL is hardcoded. Update it if the location changes.

### Google Fonts

- Loaded via `<link>` in `<head>`.
- Fonts: **Noto Sans JP** (400, 500, 700) and **Shippori Mincho** (400, 600).

---

## Known TODOs

The codebase has inline TODO comments marking content that must be replaced before going live:

- **Line ~546 in `index.html`:** Replace placeholder address and phone number with real values.
- **Lines ~559–577 in `index.html`:** Replace `#` placeholder URLs with actual social media profile URLs (Instagram, X/Twitter, Facebook).
- **Formspree ID:** Confirm `xbddjzvr` is the correct production endpoint.

---

## Git Workflow

- The main branch is `main`.
- Feature/AI branches follow the pattern: `claude/<session-id>`.
- Commit messages may be in Japanese (following the existing style).
- **Always commit `css/style.css`** when modifying CSS source or any file that affects Tailwind class usage.

---

## What This Project Is NOT

To avoid over-engineering, be aware of what is intentionally absent:

- No JavaScript framework (React, Vue, etc.)
- No TypeScript
- No test suite
- No CI/CD pipeline
- No backend / API server
- No database
- No environment variables / `.env` files
- No CSS preprocessor (SCSS, etc.) — Tailwind only
- No bundler (Webpack, Vite, etc.) — Tailwind CLI only
