# AWS Amplify deployment

## Target architecture

```text
GitHub main branch
      │
      ▼
AWS Amplify build
  npm ci
  npm run build:static
      │
      ▼
Static output in out/
      │
      ▼
Amplify CDN + managed HTTPS
```

The portfolio requires no database, API, Lambda function, authentication
service, storage bucket, or paid contact backend.

## Current production deployment

| Setting              | Verified value                                                 |
| -------------------- | -------------------------------------------------------------- |
| Public URL           | `https://main.d1g34b4b4uw0wu.amplifyapp.com`                   |
| AWS region           | `us-east-2`                                                    |
| Amplify application  | `thierry-portfolio` / `d1g34b4b4uw0wu`                         |
| Repository           | `https://github.com/trouillard-star/thierry-portfolio`         |
| Branch               | `main` / `PRODUCTION`                                          |
| Automatic deployment | Enabled                                                        |
| Canonical URL input  | `NEXT_PUBLIC_SITE_URL` is set to the public Amplify origin     |
| Custom not-found     | Unknown routes redirect to the generated bilingual `/404.html` |
| Budget               | `thierry-portfolio-monthly`, 5 USD monthly                     |
| Alerts               | Forecasted 50%, forecasted 80%, and actual 100%                |
| Custom domain        | Not configured; no domain was purchased                        |

The notification subscriber is configured and verified through AWS Budgets.
Its address is intentionally not stored in the repository or this document.
Budget notifications warn about spend; they do not automatically stop the
application or prevent additional charges.

## Preconditions

1. GitHub repository is created and contains the reviewed `main` branch.
2. AWS CLI identity is verified with `aws sts get-caller-identity`.
3. AWS region is explicitly verified; the expected region is `us-east-2`.
4. Existing Amplify applications are listed to avoid duplicates.
5. `NEXT_PUBLIC_SITE_URL` is set to the final verified HTTPS origin.
6. The AWS budget notification email is supplied at action time and is not
   committed.

## Resources expected

- One AWS Amplify application
- One Amplify branch connected to GitHub `main`
- Managed build and CDN deployments
- One AWS Budgets cost budget with email notifications, if permission allows

No domain will be purchased automatically.

## Build configuration

`amplify.yml` uses a reproducible install:

```text
npm ci
npm run build:static
publish out/
```

The Node.js version must satisfy the `engines` range in `package.json`.

## Deployment process

1. In AWS Amplify Hosting, choose **Deploy an app** and select GitHub.
2. Authorize the AWS Amplify GitHub App for only the portfolio repository.
3. Select the reviewed repository and `main` branch.
4. Confirm region `us-east-2`.
5. Confirm that the detected build configuration matches `amplify.yml`.
6. Add `NEXT_PUBLIC_SITE_URL` with the final Amplify origin after the first URL
   is assigned, then redeploy once.
7. Verify the deployment status and request the live homepage and important
   routes over HTTPS.

If GitHub authorization is required, the minimum human action is to approve the
AWS Amplify GitHub App for the single portfolio repository. Do not grant access
to every repository.

## Verification

Verify:

- homepage, `/en/`, résumé, evidence, and all 12 project-language routes return
  HTTP 200;
- assets and `og.png` load;
- French and English switches resolve correctly;
- security headers are present;
- sitemap and robots endpoints contain the production origin;
- generated content contains no secret patterns or local paths;
- the browser console contains no application errors.

The repeatable live command is:

```bash
npm run verify:live -- https://main.d1g34b4b4uw0wu.amplifyapp.com
```

It validates all 18 public HTML routes, both languages, the custom not-found
behavior, framework-runtime removal, and confidential-pattern invariants.

## Rollback

Amplify keeps deployment history. To roll back:

1. Open the Amplify app and branch deployment history.
2. Select the last verified successful deployment.
3. Choose **Redeploy this version**.
4. Re-run the HTTP, route, asset, language, and header verification checks.

For source rollback, revert the responsible Git commit on a review branch,
validate it locally, merge to `main`, and let Amplify create a new deployment.
Do not rewrite published Git history.

## Troubleshooting

- **Install fails:** confirm the Node version and that `package-lock.json` is
  committed; use `npm ci`, not a mutable install.
- **Build fails:** reproduce with `npm run build:static`; inspect the first
  application error before changing Amplify settings.
- **Routes return 404:** confirm `trailingSlash` static output and that the
  complete `out` folder is the artifact directory.
- **Wrong canonical URL:** set `NEXT_PUBLIC_SITE_URL` and rebuild.
- **Missing headers:** confirm `customHttp.yml` is at the repository root and
  inspect the live response.
- **GitHub connection fails:** review the GitHub App installation and grant only
  this repository.

## Cost considerations

Amplify Hosting generally charges for build minutes, data storage, and data
transfer after any applicable free-tier allowances. Pricing and free-tier terms
change; verify the current AWS pricing page before ongoing use. A small static
portfolio should have a modest footprint, but it is not guaranteed to remain
free.

An AWS Budget sends alerts; it does not itself prevent charges. Avoid frequent
unnecessary builds and large media assets.

## Budget preparation

Versioned budget inputs are under `infra/aws`. After authentication:

```powershell
$PortfolioAccountId = aws sts get-caller-identity --query Account --output text
$PortfolioBudgetEmail = Read-Host "Budget notification email"
aws budgets create-budget --account-id $PortfolioAccountId --budget file://infra/aws/budget.json
aws budgets create-notification --account-id $PortfolioAccountId --budget-name thierry-portfolio-monthly --notification file://infra/aws/notification-50.json --subscribers SubscriptionType=EMAIL,Address=$PortfolioBudgetEmail
aws budgets create-notification --account-id $PortfolioAccountId --budget-name thierry-portfolio-monthly --notification file://infra/aws/notification-80.json --subscribers SubscriptionType=EMAIL,Address=$PortfolioBudgetEmail
aws budgets create-notification --account-id $PortfolioAccountId --budget-name thierry-portfolio-monthly --notification file://infra/aws/notification-100.json --subscribers SubscriptionType=EMAIL,Address=$PortfolioBudgetEmail
```

The account identifier and email remain shell variables and are never written
to the repository.

## Cleanup

To stop ongoing hosting:

1. Disconnect or delete the Amplify branch.
2. Delete the Amplify application after confirming no custom domain or desired
   deployment remains attached.
3. Delete the `thierry-portfolio-monthly` budget if it is no longer useful.
4. Remove the repository authorization from the AWS Amplify GitHub App if no
   other deployment uses it.
5. Verify the AWS console and cost explorer rather than assuming deletion is
   instantaneous or complete.

Use exact application and budget identifiers from authenticated read-only list
commands. Never run deletion commands with guessed identifiers.

## Custom-domain readiness

Possible future names include `thierryrouillard.ca`,
`thierryrouillard.dev`, or another selected domain. No purchase is authorized.

Checklist:

- select and purchase the domain manually;
- associate it with the existing Amplify app;
- configure the exact DNS records Amplify provides;
- wait for certificate validation and managed HTTPS;
- redirect `www` consistently to the chosen canonical host (or the reverse);
- set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin;
- redeploy and validate sitemap, alternate URLs, Open Graph tags, and redirects;
- enable HSTS `preload` only when all included subdomains are ready.
