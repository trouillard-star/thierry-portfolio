# ADR 001: Portfolio architecture

- Status: accepted
- Date: 2026-07-24

## Context

The portfolio must be bilingual, accessible, inexpensive to operate, easy to
maintain, compatible with AWS Amplify, and publishable through the managed Sites
runtime. Its content is informational, so a database and application backend
would add risk and cost without providing meaningful value.

## Decision

Use a static-first Next.js 16 application written in TypeScript, built through
the vinext adapter for the managed runtime and through Next static export for
AWS Amplify. Content lives in typed modules under `src/data`. Server components
render the content; a very small client component handles the colour-theme and
mobile-navigation preferences.

The site has French-first public routes, an English route group, individual
bilingual project case studies, résumé and evidence pages, and generated
metadata routes. Contact is a safe mail link rather than a paid or stateful
backend.

## Why not Astro

Astro was the preferred initial candidate and would be a strong fit. The
selected managed publishing workflow supplies and supports a vinext project
surface, so Next static export provides the same static-first operating model
while preserving that deployment compatibility. This is a deployment
constraint, not a claim that Next is universally superior.

## Consequences

### Positive

- Static pages are cacheable and inexpensive to host.
- Typed data keeps content separate from presentation.
- Almost all pages ship without feature-specific client state.
- The same repository can target AWS Amplify and the managed Sites runtime.
- No public API, database, authentication service, or paid contact backend is
  required.

### Trade-offs

- Two build targets must remain healthy.
- Theme preference requires a small client-side script.
- Canonical production URLs must be updated when the final domain is chosen.
- Contact remains intentionally limited until verified public details exist.

## Security and accessibility

The architecture minimizes attack surface by avoiding dynamic inputs and
server-side persistence. Security headers are versioned with the application.
Semantic landmarks, keyboard navigation, visible focus, reduced-motion support,
structured headings, and WCAG-conscious colour tokens are design-system
requirements rather than after-the-fact additions.
