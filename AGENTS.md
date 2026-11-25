# School Publication Project Rules

## Tech Stack
- Astro (`.astro` components in `src/components/`, pages in `src/pages/`)
- TypeScript (`interface Props` on all components), scoped `<style>` CSS, minimal vanilla JS.

## Brand Design Tokens (Strict)
- **Colors**:
  - Navy (Ink / Primary): `#0F2342`
  - Paper (Background): `#FFFDF8`
  - Gold (Dark backgrounds / borders): `#FBBF24` and `#F59E0B`
  - Dark Gold (Labels/accents on `#FFFDF8` paper): `#8A6D1F`
  - Light Blue (Secondary tags/highlights): `#BFDBFE`
- **Fonts**:
  - Headlines, pull quotes, drop caps: `'Playfair Display', serif`
  - UI, navigation, kickers, bylines, body copy: `'Montserrat', sans-serif`

## Workflow Rules
1. Check existing CSS variables and components before writing new styles.
2. After any visual or layout change, inspect `http://localhost:4321` using the `browser` skill at desktop (`1440x900`) and mobile (`390x844`) viewports to fix spacing, contrast, or overflow issues.
