# Contributing

This is a personal portfolio. Contributions should improve accuracy,
accessibility, security, maintainability, or presentation without inventing
experience.

## Before editing

1. Read `docs/portfolio-content-guide.md`.
2. Keep user-visible content bilingual, with Canadian French first.
3. Keep code, identifiers, commit messages, and technical documentation in
   English.
4. Confirm that no customer, employer, network, credential, or private-source
   detail will be exposed.

## Content rules

- Distinguish applied work, prototypes, research, and concepts.
- Do not add fake testimonials, employment history, certifications, metrics, or
  skill ratings.
- Do not describe Thierry as a senior developer without objective evidence.
- Add verifiable links only after opening and validating the target.
- Use a visible “to be confirmed” state when source information is unavailable.

## Development

```bash
npm ci
npm run dev
```

Before proposing a change:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run test
npm run build:static
```

Update the relevant audit or architecture record when behaviour, dependencies,
deployment, or security posture changes.

## Commits

Use concise English Conventional Commit messages, for example:

```text
feat: add bilingual project evidence
fix: improve project navigation contrast
docs: update Amplify rollback procedure
```
