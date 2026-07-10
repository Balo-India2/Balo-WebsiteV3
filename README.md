# Balo Website V3

A modern website built with React, TypeScript, TanStack Router/Start, and Tailwind CSS — connected to Supabase for backend services.

## Table of Contents

- [Development](#development)
- [CI/CD Overview](#cicd-overview)
- [GitHub Actions Workflows](#github-actions-workflows)
  - [CI — Lint, Build & CVE Scan](#1-ci--lint-build--cve-scan)
  - [Deploy to S3](#2-deploy-to-s3)
  - [Changelog Automation](#3-changelog-automation)
  - [Release — Versioning & GitHub Packages](#4-release--versioning--github-packages)
- [Required Secrets & Variables](#required-secrets--variables)
- [Branch Strategy](#branch-strategy)
- [Conventional Commits](#conventional-commits)
- [Docker](#docker)

---

## Development

### Prerequisites

- Node.js 20+
- npm

### Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Format
npm run format
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

---

## CI/CD Overview

```
┌──────────┐    push     ┌──────────────────┐   auto-tag   ┌─────────────────────┐
│  feature │──────────►  │     develop       │─────────────►│       main          │
│  branch  │  (PR)       │  changelog.yml    │              │  release.yml        │
└──────────┘             │  (git-cliff)      │              │  deploy-s3.yml      │
                         └──────────────────┘              │  (GHCR + S3)        │
                                                           └─────────────────────┘
                         ─────────────────────────────────────────────────────────
                         ci.yml runs on every push/PR to develop & main
```

---

## GitHub Actions Workflows

### 1. CI — Lint, Build & CVE Scan

**File:** `.github/workflows/ci.yml`  
**Triggers:** Push or PR to `main` / `develop`

| Job | Description |
|-----|-------------|
| `lint-and-build` | Installs deps, runs ESLint, builds the project, uploads `dist/` artifact |
| `security-audit` | Runs `npm audit --audit-level=high`; uploads audit report as artifact |

The build job uploads the compiled output as a workflow artifact named `dist` (retained 7 days).  
The audit job uploads an `npm-audit.json` report (retained 30 days).

---

### 2. Deploy to S3

**File:** `.github/workflows/deploy-s3.yml`  
**Triggers:** Push to `main`, or manual dispatch (`workflow_dispatch`)

Steps performed:
1. Build project with production environment variables.
2. Sync `dist/` to the S3 bucket using `aws s3 sync --delete`.
   - Non-HTML assets get `Cache-Control: public,max-age=31536000,immutable`.
   - HTML files get `Cache-Control: no-cache, must-revalidate`.
3. *(Optional)* Invalidate CloudFront distribution cache.

#### Required Secrets for S3 Deployment

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM secret access key |
| `AWS_REGION` | AWS region (default: `us-east-1`) |
| `S3_BUCKET_NAME` | Target S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | *(Optional)* CloudFront distribution to invalidate |

#### Minimum IAM Policy for the Deployment User

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

#### S3 Bucket Static Website Hosting

1. Enable **Static website hosting** in the bucket properties.
2. Set the **Index document** to `index.html` and **Error document** to `index.html` (for SPA routing).
3. Configure the bucket policy to allow public read access, or use a CloudFront distribution with OAC.

---

### 3. Changelog Automation

**File:** `.github/workflows/changelog.yml`  
**Triggers:** Push to `develop` (skips commits with `[skip ci]`)

Uses [git-cliff](https://git-cliff.org) to parse [Conventional Commits](#conventional-commits) and regenerate `CHANGELOG.md`.  
Configuration lives in `cliff.toml` at the repository root.

The bot commits `CHANGELOG.md` back to `develop` with the message:
```
chore(changelog): update CHANGELOG [skip ci]
```

---

### 4. Release — Versioning & GitHub Packages

**File:** `.github/workflows/release.yml`  
**Triggers:** Push to `main`

#### Semantic Versioning Logic

The workflow inspects conventional commit messages since the last tag and bumps the version automatically:

| Commit type | Version bump |
|-------------|--------------|
| `feat!` / `BREAKING CHANGE` | **Major** (x+1.0.0) |
| `feat:` | **Minor** (0.x+1.0) |
| `fix:`, `perf:`, `refactor:`, `revert:` | **Patch** (0.0.x+1) |
| Anything else (`chore`, `docs`, `style`) | No release |

#### Steps

1. Determine the next version using the logic above.
2. Generate release notes with git-cliff.
3. Bump `version` in `package.json` (without git tag).
4. Commit the version bump and push an annotated git tag.
5. Create a GitHub Release with the generated notes.
6. Build a Docker image and push to **GitHub Container Registry (GHCR)**.

#### GitHub Container Registry (GHCR)

Images are published to:
```
ghcr.io/balo-india2/balo-websitev3:<version>
ghcr.io/balo-india2/balo-websitev3:<major>.<minor>
ghcr.io/balo-india2/balo-websitev3:latest
```

To pull a published image:
```bash
docker pull ghcr.io/balo-india2/balo-websitev3:latest
docker run -p 8080:80 ghcr.io/balo-india2/balo-websitev3:latest
```

---

## Required Secrets & Variables

Set these in **Settings → Secrets and Variables → Actions** of the repository.

### Repository Secrets

| Secret | Used by | Description |
|--------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | deploy-s3 | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | deploy-s3 | AWS IAM secret key |
| `AWS_REGION` | deploy-s3 | AWS region (e.g. `ap-south-1`) |
| `S3_BUCKET_NAME` | deploy-s3 | S3 bucket name for the website |
| `CLOUDFRONT_DISTRIBUTION_ID` | deploy-s3 | *(Optional)* CloudFront distribution ID |
| `VITE_SUPABASE_URL` | ci, deploy-s3, release | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ci, deploy-s3, release | Supabase anon/publishable key |

> **Note:** `GITHUB_TOKEN` is automatically provided by GitHub Actions for GHCR publishing and creating releases.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — every push triggers a release, GHCR publish, and S3 deploy |
| `develop` | Integration — every push regenerates `CHANGELOG.md` |
| `feature/*` | Feature branches — open PRs against `develop` |
| `fix/*` | Bug-fix branches — open PRs against `develop` |

### Workflow

```
feature/my-feature  →  PR  →  develop  →  PR  →  main
                                ↓                    ↓
                           changelog.yml        release.yml
                                                deploy-s3.yml
```

---

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to drive automated changelog generation and semantic versioning.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description | Version bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `perf` | Performance improvement | Patch |
| `refactor` | Code refactoring | Patch |
| `revert` | Revert a previous commit | Patch |
| `docs` | Documentation only | None |
| `style` | Formatting, missing semicolons | None |
| `test` | Adding/updating tests | None |
| `chore` | Maintenance tasks | None |
| `ci` | CI/CD changes | None |

### Breaking Changes

Append a `!` after the type to signal a breaking change (triggers a **Major** bump):

```
feat!: drop support for Node 18

BREAKING CHANGE: Node 20 is now the minimum required version.
```

### Examples

```
feat(auth): add OAuth login with GitHub
fix(header): correct mobile navigation overflow
perf(images): lazy-load hero images
chore(deps): update tailwindcss to v4.2
docs: update deployment instructions
```

---

## Docker

### Building Locally

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://<ref>.supabase.co \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key> \
  -t balo-website .

docker run -p 8080:80 balo-website
# Visit http://localhost:8080
```

### nginx Configuration

The container uses a custom nginx configuration (`docker/nginx.conf`) that:
- Enables gzip compression for text assets.
- Sets aggressive caching for static assets (JS/CSS/images).
- Disables caching for HTML files.
- Serves `index.html` as the fallback for all routes (SPA routing support).
