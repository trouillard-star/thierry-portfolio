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
| Motion preferences                       | Reduced-motion fallback present and tested                   |
| Redesigned CV                            | Desktop and mobile captures inspected; print styles retained |
| Live Amplify route check                 | 18 HTML routes, assets, metadata, headers, and 404 passed    |
| Managed Sites deployment                 | Version 4 prepared from the final source state               |

## Lighthouse production audit

Audits ran against the generated `out` directory and the public AWS Amplify
origin. The homepage and redesigned CV were also audited independently after
the advanced motion layer was added.

| Target                         | Performance | Accessibility | Best practices | SEO |
| ------------------------------ | ----------: | ------------: | -------------: | --: |
| Public AWS Amplify homepage    |         100 |           100 |            100 | 100 |
| Local motion-enhanced homepage |         100 |           100 |            100 | 100 |
| Local redesigned bilingual CV  |         100 |           100 |            100 | 100 |

The public audit measured a `1.2 s` largest contentful paint, `0 ms` total
blocking time, `0` cumulative layout shift, and no console errors. After the CV
and interaction redesign, both local mobile audits remained at 100 in all four
categories with a `1.3 s` largest contentful paint, `0 ms` total blocking time,
and `0` cumulative layout shift.

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
7. The first live Amplify audit scored 88 for performance because the static
   export still referenced an unused framework browser runtime. The
   post-generation step now removes those script references, Flight payloads,
   preloads, and unused chunks. The current build removes `1117 KiB` from 21
   HTML documents and the live performance score is 100.
8. The original CV was structurally complete but visually flat. It was rebuilt
   as a responsive editorial document with a masthead, verified-fact summary,
   applied-experience timeline, compact skill matrix, print layout, and direct
   evidence link.
9. The original interface had limited motion. A native progressive-enhancement
   layer now provides scroll reveals, pointer-responsive depth, ambient light,
   system-node motion, and a reading-progress indicator. It adds no animation
   dependency and yields immediately to `prefers-reduced-motion`.

## Limitations

- Tests verify rendered content, routing, browser behavior, accessibility
  automation, and security-oriented invariants; they do not constitute
  penetration testing.
- Lighthouse scores are point-in-time laboratory measurements and may vary.
- English copy was checked structurally and in-browser but has not received
  independent human translation review.
- The disabled contact form intentionally sends no data. End-to-end message
  delivery is therefore not applicable.
- Pointer-responsive depth is available only on fine-pointer devices; touch
  devices retain the same content and hierarchy without hover dependence.
- AWS Amplify measurements are point-in-time results and should be rerun after
  future dependency, content, or hosting changes.
