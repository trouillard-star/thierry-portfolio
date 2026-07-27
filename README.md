# Thierry Rouillard — Portfolio

A production-oriented bilingual portfolio documenting practical work in
software development, IT support, automation, systems architecture, security,
artificial intelligence, databases, and cloud deployment.

French is the primary language. Complete English routes are available under
`/en`.

Public production site:
<https://main.d1g34b4b4uw0wu.amplifyapp.com>

Owner-only managed fallback:
<https://thierry-rouillard-portfolio.beurkg.chatgpt.site>

Public source:
<https://github.com/trouillard-star/thierry-portfolio>

## Architecture

- Next.js 16 and TypeScript
- Static-first pages and typed content modules
- vinext build target for the managed Sites runtime
- Next static-export target for AWS Amplify Hosting
- Native theme and print controls on informational pages
- Native scroll reveals, pointer depth, ambient motion, and reading progress
- Full `prefers-reduced-motion` fallback
- Responsive editorial CV with a dedicated print layout
- Selective hydration for the NeuroLens 3D research lab
- Post-build removal of the unused Next.js client runtime from informational pages
- No database, authentication service, analytics, or contact backend

The decision and trade-offs are recorded in
[`docs/adr/001-portfolio-architecture.md`](docs/adr/001-portfolio-architecture.md).

## Local development

```bash
npm ci
npm run dev
```

Use the local URL printed by the development server.

## Quality commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test
npm run build:static
npm run links
npm run security:scan
npm audit
npm run verify:live -- https://main.d1g34b4b4uw0wu.amplifyapp.com
```

The current results are recorded in
[`docs/audits/test-report.md`](docs/audits/test-report.md).

## Content

Portfolio content is kept in typed modules:

- `src/data/profile.ts`
- `src/data/projects.ts`
- `src/data/skills.ts`
- `src/data/experience.ts`
- `src/data/education.ts`

Project diagrams have Mermaid source files under `public/diagrams`. See
[`docs/portfolio-content-guide.md`](docs/portfolio-content-guide.md) before
adding public details.

## Deployment

- Managed Sites deployment packages the `dist` worker output.
- AWS Amplify runs `npm run build:static` and publishes `out`.
- Security headers are defined for both targets.

See [`docs/deployment/aws-amplify.md`](docs/deployment/aws-amplify.md).

## Privacy

All case studies are anonymized. The repository must never contain employer
secrets, customer identities, exact private network details, source code from
private systems, access credentials, or private media.

Public contact is intentionally limited to the verified GitHub profile.

## License and use

The portfolio content describes Thierry Rouillard’s work and is not offered as
reusable customer data or as a representation of any employer. Third parties
may review the code for evaluation; reuse of personal content requires
permission.
