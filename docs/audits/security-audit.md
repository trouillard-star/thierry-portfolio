# Security and confidentiality audit

Audit date: 2026-07-24  
Scope: source, generated site, public-repository readiness, and hosting
configuration

## Outcome

The reviewed source is suitable for publication as an anonymized portfolio.
Automated scanning found no credentials, private keys, access tokens, private
network addresses, local filesystem paths, customer names, or private media in
the publishable source. `npm audit` reports zero known vulnerabilities.

## Controls present

- Static-first architecture with no database, login, upload, analytics, or
  contact-processing service.
- Contact fields are disabled and submit no data.
- No cookies are created by the application; a cookie banner would therefore
  be misleading and is not included.
- Only the color-theme preference is stored locally in the browser.
- Every project uses anonymized context and an explicit maturity label.
- Environment files, build output, audit output, Wrangler state, certificates,
  and TypeScript build state are excluded from Git.
- Security headers specify CSP, HSTS, clickjacking protection, MIME-sniffing
  protection, a restrictive referrer policy, and a restrictive permissions
  policy.
- HSTS is intentionally limited to the current host. `includeSubDomains` and
  `preload` are not enabled without verified control of every subdomain.
- Downloadable Mermaid files are served as plain text and attachments.
- Source maps and local machine paths are not exposed by the static export.

## Public-repository review

The repository contains portfolio source, anonymized case-study content,
generic architecture diagrams, documentation, tests, and infrastructure
templates. It does not contain the generated production directories, audit
JSON, credentials, AWS account identifiers, deployment tokens, or employer
source code.

Verified professional contact details, social profiles, certification IDs,
transcripts, and education documents remain omitted until the owner can provide
and approve them. Their absence is visible in the interface.

## Dependency remediation

The starter dependency tree reported 17 vulnerabilities. The framework and
runtime packages were upgraded, unused database dependencies were removed, and
patched transitive versions were selected. The final package audit reports:

```text
0 vulnerabilities
```

## Known limitations and residual risk

- The CSP permits inline script and inline style because the generated framework
  output and the early theme bootstrap require them. A deployment-specific
  nonce or hash policy would be stronger.
- Security headers committed in files are not proof that every host applies
  them. They must be inspected on each live deployment.
- The local secret scanner is a defense-in-depth pattern scanner, not a
  replacement for a hosted secret-scanning service.
- A public repository cannot make a leaked historical secret private again.
  Future contributors must run the scan before every push.
- No claim is made that the site or its project descriptions have undergone
  independent security certification.

## External deployment status

The managed Sites build was published with owner-only access. Its application
content requires a valid ChatGPT owner session, so anonymous access is not
claimed. GitHub and AWS sessions were not authenticated during the audit. No
public GitHub repository or AWS resource was created without verified identity.
AWS region `us-east-2` remains an intended value rather than a verified account
setting until authentication.
