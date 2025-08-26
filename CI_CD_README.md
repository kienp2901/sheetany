# CI/CD & Development Workflow

## Overview

This project uses GitHub Actions for Continuous Integration/Continuous Deployment (CI/CD) and Husky for Git hooks to ensure code quality.

## CI/CD Workflows

### 1. Continuous Integration (CI.yml)

- **Trigger**: Push to `main`/`develop` branches and Pull Requests
- **Actions**:
  - Checkout code
  - Setup Node.js (18.x, 20.x)
  - Install dependencies
  - Run ESLint
  - Run Jest tests
  - Build project
  - Upload test coverage to Codecov

### 2. Checkly Monitoring (checkly.yml)

- **Trigger**: Push to `main` branch
- **Actions**:
  - Run Checkly checks
  - Deploy monitoring checks
- **Required Secrets**:
  - `CHECKLY_API_KEY`
  - `CHECKLY_ACCOUNT_ID`

### 3. Crowdin Translation Sync (crowdin.yml)

- **Trigger**: Changes in `src/locales/` or manual dispatch
- **Actions**:
  - Upload source files to Crowdin
  - Download translations
  - Commit changes back to repository
- **Required Secrets**:
  - `CROWDIN_PERSONAL_TOKEN`

### 4. Release Automation (release.yml)

- **Trigger**: New version tags (v\*)
- **Actions**:
  - Run tests and build
  - Generate changelog
  - Create GitHub release
  - Publish release notes

### 5. Dependency Updates (update-deps.yml)

- **Trigger**: Weekly (Monday 9:00 AM UTC) or manual dispatch
- **Actions**:
  - Check for outdated packages
  - Update dependencies
  - Create Pull Request for review

## Git Hooks (Husky)

### Pre-commit Hook

- Runs ESLint and tests before each commit
- Prevents commits with linting errors or failing tests
- Ensures code quality standards

### Commit Message Hook

- Validates commit messages using Conventional Commits
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore, ci, build, revert

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Husky

```bash
npm run prepare
```

### 3. Configure Secrets

Add the following secrets to your GitHub repository:

- `CHECKLY_API_KEY`: Your Checkly API key
- `CHECKLY_ACCOUNT_ID`: Your Checkly account ID
- `CROWDIN_PERSONAL_TOKEN`: Your Crowdin personal token
- `CODECOV_TOKEN`: Your Codecov token (optional)

### 4. Update Configuration Files

- Update `.github/FUNDING.yml` with your sponsorship links
- Update `.github/dependabot.yml` with your GitHub username
- Customize workflow files as needed

## Development Workflow

### Making Commits

1. Use conventional commit format: `feat: add new feature`
2. Or use interactive commit: `npm run commit`

### Before Pushing

- Ensure all tests pass: `npm run test`
- Check linting: `npm run lint`
- Fix any issues: `npm run lint:fix`

### Creating Releases

1. Create and push a new tag: `git tag v1.0.0 && git push origin v1.0.0`
2. GitHub Actions will automatically create a release

## Troubleshooting

### Husky Hooks Not Working

- Ensure Husky is installed: `npm run prepare`
- Check file permissions on hook files
- Verify `.huskyrc` configuration

### CI/CD Failures

- Check GitHub Actions logs for specific error details
- Ensure all required secrets are configured
- Verify workflow file syntax

### Dependency Update Issues

- Review Dependabot configuration
- Check for breaking changes in major version updates
- Test updates locally before merging

## Best Practices

1. **Always run tests locally** before pushing
2. **Use conventional commits** for better changelog generation
3. **Review dependency updates** carefully
4. **Monitor CI/CD pipeline** for failures
5. **Keep secrets secure** and rotate regularly

## Support

For issues with CI/CD or development workflow:

1. Check GitHub Actions logs
2. Review this documentation
3. Create an issue in the repository
4. Contact the development team
