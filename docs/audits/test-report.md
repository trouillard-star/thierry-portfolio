# Test and quality report

Audit date: 2026-07-24  
Target: production static export and managed Sites worker

## Accepted results

| Check                                    | Result                                                       |
| ---------------------------------------- | ------------------------------------------------------------ |
| Prettier                                 | Passed                                                       |
| ESLint                                   | Passed                                                       |
| TypeScript                               | Passed with `tsc --noEmit`                                   |
| Next.js static export                    | Passed; 22 pages generated                                   |
| vinext managed-runtime build             | Passed; 19 application routes prerendered                    |
| Node test suite                          | Passed; 4/4 tests                                            |
| Static internal-link check               | Passed; 21 HTML pages inspected                              |
| Dependency audit                         | Passed; 0 known npm vulnerabilities                          |
| Credential and confidential-pattern scan | Passed                                                       |
| Browser console                          | No application errors on a fresh production run              |
| Mobile viewport                          | No horizontal overflow at a 390 × 844 viewport               |
| Tablet viewport                          | Two-column project grid and no horizontal overflow at 768 px |
| Theme control                            | Passed in the in-app browser                                 |
| French/English navigation                | Passed in the in-app browser                                 |
| Managed Sites deployment                 | Version 3 succeeded; production screenshot inspected         |

## Lighthouse production audit

The audit ran against the generated `out` directory through the local static
preview server.

| Category       | Score |
| -------------- | ----: |
| Performance    |    93 |
| Accessibility  |   100 |
| Best practices |   100 |
| SEO            |   100 |

Observed measurements included a cumulative layout shift of `0`, total blocking
time of `50 ms`, and no console errors. Lighthouse estimated the largest
contentful paint at `3.2 s` under its simulated conditions.

## Failures found and corrected

1. The initial starter runtime was incompatible with PowerShell environment
   variable syntax. `cross-env` now makes all npm scripts portable.
2. The first static build required explicit static metadata routes. The robots
   and sitemap handlers are now forced static.
3. The initial dependency tree reported 17 vulnerabilities. Framework and
   Cloudflare packages were upgraded, unused database packages were removed,
   and transitive packages were pinned to fixed releases. The final audit
   reports zero vulnerabilities.
4. Generated HTML initially exposed absolute local font paths. Hosted fonts
   were replaced by privacy-preserving system font stacks.
5. The first production Lighthouse run scored 91/96/96/100. It found six small
   low-contrast project indices, accessible names that omitted visible text,
   and static-host-incompatible Next.js route prefetch requests. Contrast and
   accessible names were corrected, and ordinary HTML links now provide robust
   document navigation on generic static hosts.
6. Lighthouse successfully wrote its JSON reports, but its Windows Chrome
   launcher returned `EPERM` while removing its own temporary directory after
   Chrome exited. The report was parsed and validated independently; this is a
   local cleanup defect, not a site test failure.

## Limitations

- Tests verify rendered content, routing, browser behavior, accessibility
  automation, and security-oriented invariants; they do not constitute
  penetration testing.
- Lighthouse scores are point-in-time laboratory measurements and may vary.
- English copy was checked structurally and in-browser but has not received
  independent human translation review.
- The disabled contact form intentionally sends no data. End-to-end message
  delivery is therefore not applicable.
- AWS Amplify headers, build logs, and live URLs must be verified only after an
  authenticated deployment exists.
