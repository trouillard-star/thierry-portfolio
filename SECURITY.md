# Security policy

## Supported surface

The portfolio is a static-first public website. It has no database, sign-in,
contact-processing backend, tracking script, or user-upload capability.

## Reporting a concern

Public security contact information is not yet verified. Until it is added, do
not include vulnerability details in a public issue. Use the repository’s
private security-advisory feature when available.

## Public-repository boundaries

Never commit or publish:

- passwords, access keys, tokens, cookies, private keys, or `.env` files;
- AWS account identifiers or private deployment URLs;
- customer or employee identities;
- internal IP addresses, hostnames, VPN profiles, or exact network topology;
- proprietary source code, database exports, media, screenshots, or reports;
- personal documents, transcripts, or badges containing unreviewed metadata.

## Design controls

- Static pages minimize the remotely exploitable surface.
- Contact fields are disabled and transmit nothing.
- External links are added only after verification.
- CSP, HSTS, clickjacking, MIME-sniffing, referrer, and permissions headers are
  configured for supported hosting targets.
- Dependencies and generated output are scanned before public release.

## Known limitations

- The CSP allows inline script and style because the current framework emits
  inline bootstrap content. Moving to hashes or nonces would require a
  deployment-specific response layer.
- HSTS is effective only over HTTPS and should be enabled with `preload` only
  after all intended subdomains are HTTPS-ready.
- Static security headers must be verified on every hosting provider; committed
  configuration alone does not prove they are active.
- The site makes no claim of independent penetration testing or certification.
