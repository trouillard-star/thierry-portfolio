# Environment audit

Audit date: 2026-07-24  
Workspace: local portfolio project on Windows  
Intended AWS region: `us-east-2` (must still be verified after authentication)

## Summary

The workspace was empty and was safe to initialize. No existing application files,
Git history, remotes, credentials, customer data, or confidential source material
were present.

| Area                      | Result                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| Operating environment     | Windows / PowerShell                                               |
| Node.js                   | `v24.14.0`                                                         |
| npm                       | `11.9.0`                                                           |
| Git                       | `2.53.0.windows.2`                                                 |
| Initial Git state         | Not a repository; initialized on `main`                            |
| GitHub CLI                | `2.96.0`; installed with Windows Package Manager                   |
| GitHub authentication     | Verified as `trouillard-star`                                      |
| AWS CLI                   | `2.36.7`; installed with Windows Package Manager                   |
| AWS identity              | Temporary Web login verified; root authority                       |
| AWS region                | `us-east-2` verified                                               |
| pnpm                      | Available through npm/corepack command surface (`11.9.0` reported) |
| Yarn                      | Not installed                                                      |
| Bun                       | Not installed                                                      |
| Browser engine for audits | Microsoft Edge and Google Chrome detected                          |

## Commands executed

```text
Get-Location
rg --files
git status -sb
git remote -v
node --version
npm --version
git --version
gh --version
gh auth status
aws --version
aws sts get-caller-identity --output json
aws configure get region
winget install --id GitHub.cli
winget install --id Amazon.AWSCLI
```

## Findings and actions

- The project could be initialized without overwriting user work.
- The local preview is available during implementation.
- GitHub and AWS identities were verified before external resources were
  inspected or created.
- No authentication token, AWS account identifier, secret, or private URL is
  written to this report.
- Package vulnerabilities reported during initial dependency installation were
  remediated. The final dependency audit reports zero known vulnerabilities.

## Limitations

GitHub and AWS authentication were completed by the account owner. The AWS
session is temporary but has root authority; only the requested budget and
Amplify APIs should be used. No persistent access key or IAM user was created.
