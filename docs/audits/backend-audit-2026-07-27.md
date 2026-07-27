# Backend and runtime audit

- Audit date: 2026-07-27
- Scope: managed Worker runtime, static export, dependency security, build
  portability, live verification, and automated quality controls

## Outcome

The portfolio remains intentionally static-first: it has no database, form
processor, analytics collector, upload service, or server mutation. The
remaining managed runtime is now read-only, dependency-clean, portable from a
public clone, and covered by explicit regression tests.

## Findings corrected

1. `react-server-dom-webpack` 19.2.6 was affected by a high-severity
   denial-of-service advisory. React, React DOM, and the RSC runtime were
   upgraded together to 19.2.8.
2. The previous Next.js ESLint preset pulled a vulnerable legacy glob expansion
   chain. The lint stack was replaced with ESLint 10, TypeScript ESLint, React
   Hooks rules, and the focused Next.js plugin. The final dependency audit
   reports zero known vulnerabilities.
3. `vite.config.ts` imported `.openai/hosting.json` statically even though the
   folder is intentionally excluded from the public repository. A clean clone
   could therefore fail before compilation. Local hosting metadata is now
   optional and validated at runtime; a build without the file passes.
4. The Worker retained an unused image-optimization endpoint and undeclared
   runtime bindings despite the site not using Next Image. The dead route and
   bindings were removed.
5. The public portfolio has no server mutations, but the Worker previously
   delegated every HTTP method to the framework. It now accepts only `GET` and
   `HEAD`; all mutating methods receive `405 Method Not Allowed` with
   `Cache-Control: no-store`.
6. An unused authentication helper from the original starter remained in the
   source tree. It was removed to keep the public architecture aligned with the
   documented no-authentication design.
7. The live verification script omitted the report-automation project, had no
   request timeout, and did not verify security headers. It now checks every
   declared project, uses bounded requests, and validates the production header
   baseline.
8. The static-runtime optimization also omitted report-automation and removed
   the JavaScript required by that demonstration on AWS. The project lists are
   now parity-tested so every interactive route retains its runtime.
9. The managed Worker did not apply the security headers declared for the
   static host. The Worker now adds the same CSP, HSTS, permissions, referrer,
   MIME-sniffing, and framing protections to every response.
10. The on-demand NeuroLens WebGL module was the only asset above the generic
    Vite warning threshold. It remains isolated behind a lazy import and is not
    shipped with informational pages. The build threshold now documents that
    deliberate boundary instead of reporting a misleading global-bundle warning.

## Accepted validation

| Check                                       | Result                        |
| ------------------------------------------- | ----------------------------- |
| Portable build without local Sites metadata | Passed                        |
| Managed vinext build                        | Passed; 23 routes prerendered |
| Next.js static export                       | Passed; 26 pages generated    |
| ESLint 10                                   | Passed                        |
| TypeScript strict check                     | Passed                        |
| Prettier                                    | Passed                        |
| Node regression suite                       | Passed; 11/11                 |
| Internal link validation                    | Passed; 25 HTML pages         |
| Confidential-pattern scan                   | Passed                        |
| npm dependency audit                        | Passed; 0 vulnerabilities     |
| Mutating HTTP method rejection              | Passed                        |
| Project/live-check parity                   | Passed                        |

## Residual considerations

- The NeuroLens WebGL asset is intentionally substantial, but it is fetched
  only for the interactive 3D experience and remains separately cacheable.
- The CSP still permits inline framework scripts and styles. Removing that
  allowance would require deployment-specific nonces or hashes.
- Automated checks reduce regressions but do not replace an independent
  penetration test.
