# Portfolio content guide

## Purpose

Keep the portfolio useful to employers, honest about maturity, easy to update,
and safe to publish.

## Where content lives

| Content                                     | File                         |
| ------------------------------------------- | ---------------------------- |
| Name, positioning, biography, contact state | `src/data/profile.ts`        |
| Case studies and maturity labels            | `src/data/projects.ts`       |
| Skill groups and evidence mappings          | `src/data/skills.ts`         |
| Technical responsibilities                  | `src/data/experience.ts`     |
| Education and certification placeholders    | `src/data/certifications.ts` |
| Architecture-diagram source                 | `public/diagrams/*.mmd`      |

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

Replace contact placeholders only with details Thierry explicitly approves for
public release. Add real `mailto`, GitHub, and LinkedIn links together with
tests that verify the target, protocol, and accessible label.

Do not add a form backend until its privacy policy, spam handling, retention,
abuse controls, cost, and data residency have been reviewed.

## Education and certifications

Use official records. List completed courses only when verified. Badge links
must resolve to a public issuer page. Future certification interests are not
current credentials and must remain labelled as plans.

## Resume PDF

The web résumé is print-optimized. A downloadable PDF can be generated from the
browser after verified contact, education, and certification details are
complete. Review the resulting PDF for hidden metadata before committing it.

## Canonical URLs

Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS production origin at build
time. Update it when a custom domain becomes canonical and validate the
sitemap, alternate-language URLs, Open Graph image, and redirects.
