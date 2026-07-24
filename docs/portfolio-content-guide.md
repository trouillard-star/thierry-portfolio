# Portfolio content guide

## Purpose

Keep the portfolio useful to employers, honest about maturity, easy to update,
and safe to publish.

## Where content lives

| Content                               | File                     |
| ------------------------------------- | ------------------------ |
| Name, positioning, biography, contact | `src/data/profile.ts`    |
| Case studies and maturity labels      | `src/data/projects.ts`   |
| Skill groups and evidence mappings    | `src/data/skills.ts`     |
| Technical responsibilities            | `src/data/experience.ts` |
| Education summary                     | `src/data/education.ts`  |
| Architecture-diagram source           | `public/diagrams/*.mmd`  |

Every user-visible change must be made in French and English in the same
commit.

## Evidence standard

Use the strongest accurate label:

- **Applied work:** grounded in a real operational workflow; not every described
  concept is necessarily deployed.
- **Prototype:** working exploration that still needs production validation.
- **Research:** investigation, data preparation, or experiment without a
  production claim.
- **Concept:** planned architecture or product idea, not an implemented product.

For each project, preserve context, problem, role, approach, architecture,
technology, security, testing, results, lessons, and current-status fields.
Results may describe a validated outcome or produced artifact. They must not
invent adoption, revenue, customer counts, precision rates, performance gains,
or uptime.

## Confidentiality checklist

Before publishing a project update:

- Replace company and customer names with role-based descriptions.
- Remove addresses, exact locations, internal identifiers, network ranges,
  hostnames, account numbers, project numbers, and private URLs.
- Never reproduce proprietary code or screenshots.
- Use synthetic or purpose-built demonstration data.
- Remove EXIF and document metadata from public files.
- Confirm that diagram topology is conceptual rather than an exact private
  network or system map.
- Run the confidential-information scan documented in the security audit.

## Contact details

GitHub is the verified public contact point. Add another contact path only with
Thierry’s explicit approval and tests that verify the target, protocol, and
accessible label.

Do not add a form backend until its privacy policy, spam handling, retention,
abuse controls, cost, and data residency have been reviewed.

## Education and qualifications

Keep the education summary factual. Add completed courses or credentials only
from official records, and require every badge link to resolve to a public
issuer page. Omit unverified items instead of publishing provisional copy.

## Resume PDF

The web résumé is print-optimized and can be saved as PDF directly from the
browser. Review any exported PDF for layout and hidden metadata before sharing
it.

## Canonical URLs

Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS production origin at build
time. Update it when a custom domain becomes canonical and validate the
sitemap, alternate-language URLs, Open Graph image, and redirects.
