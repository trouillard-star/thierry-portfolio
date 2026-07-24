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
- Motion is progressive enhancement: core content remains available without
  script, and `prefers-reduced-motion` disables non-essential movement.

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
  them. They must be inspected on each live deployment. The current public
  Amplify origin was inspected and applies the configured header set.
- The local secret scanner is a defense-in-depth pattern scanner, not a
  replacement for a hosted secret-scanning service.
- A public repository cannot make a leaked historical secret private again.
  Future contributors must run the scan before every push.
- No claim is made that the site or its project descriptions have undergone
  independent security certification.

## External deployment status

The public production deployment is AWS Amplify app `d1g34b4b4uw0wu` in
`us-east-2`, connected only to `trouillard-star/thierry-portfolio` on `main`.
The verified live origin is
`https://main.d1g34b4b4uw0wu.amplifyapp.com`. Eighteen HTML routes, the custom
not-found response, canonical metadata, sitemap, robots policy, static assets,
and live response headers passed the remote verification script. The response
set includes CSP, HSTS for the current host, clickjacking protection,
MIME-sniffing protection, referrer policy, and permissions policy.

The public repository has Issues, Projects, secret scanning, push protection,
and Dependabot security updates enabled. The managed Sites fallback remains
owner-only, so anonymous access is not claimed for that host.

AWS was authenticated through a temporary Web login with root authority.
Operations were limited to the requested Amplify app and monthly budget. No
persistent access key, IAM user, AWS account identifier in source, or
unrequested AWS resource was created. The budget subscriber is configured, but
its address is intentionally omitted from source and reports. The temporary
session is closed after final deployment verification.
