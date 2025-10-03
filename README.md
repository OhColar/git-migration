
# 🚀 Git Migration

Bulk transfer repositories from one GitHub organization to another using the GitHub REST API. The tool lists repositories in a source organization and transfers each to a destination organization, granting a known destination team ID during the transfer. Supports dry-run previews, pagination, basic retries and optional concurrency.

## 💡 Features
- Lists all repos from a source org and transfers them to a destination org.
- Grants a known destination team (team_ids) during each transfer.
- Dry-run mode to preview actions without making changes.
- Pagination-aware, with optional concurrency and simple retry/backoff.


## 📋 Prerequisites
- Node.js 18+ and npm installed.
- A GitHub Personal Access Token (classic) with scopes:
    - repo
    - admin:org
    - workflow (optional, if CI should run after transfer)
- If SAML SSO is enforced for either organization, authorize the token for those orgs.
- Admin permissions on the source repos and permission to transfer/create repos in the destination org.
- The numeric team ID from the destination org (team_ids applies to destination teams).

## 🟢 Quick start

#### Clone and install

2. `git clone https://github.com/OhColar/git-migration.git`

3. `cd git-migration`

4. `npm install`


#### Configure environment

Copy .env.example to .env and set values:

- GITHUB_TOKEN=ghp_xxx_classic_pat_with_repo_adminorg
- FROM_ORG=source-org-login
- TO_ORG=destination-org-login
- TEAM_ID=123456
- CONCURRENCY=5
- DRY_RUN=1

## 🧪 Perform a 'Dry run'
A dry run makes no changes or moves anything, it simple confirms the list of planned transfers in the consol output.

- Run `npm run dry`


## 🏃‍♂️ Live run (performs transfers)
A live run begins the migration and any errors are logged into the console.

- Update .env `DRY_RUN=0`
- Run `npm run live`


## 👾 Common issues and fixes
#### 403 or 422 errors:

- Missing privileges to transfer or create repos in the destination.
- Organization policy blocking repository transfers.
- Name conflicts at the destination; consider using new_name or skip.

#### 404 on GET:
- The token cannot see the repo (scopes, membership, or SAML authorization).

#### Team permissions:
- team_ids must be destination team IDs; confirm the numeric ID from the destination org.

## 🔒 Security
- Never commit real tokens. Use .env locally and a secrets manager in CI.
- Review organization policies; consider a least-privilege token for execution.
- Log only necessary metadata; avoid dumping sensitive data.

## ✏️  Contributing
- Open issues or pull requests with improvements, docs, or test enhancements.
- Keep the README and .env.example in sync with any new features or options.
