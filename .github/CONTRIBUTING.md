# Contributing to HOCMAI EMS Admin

Thank you for your interest in contributing to HOCMAI EMS Admin! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following the guidelines below
5. **Test your changes** thoroughly
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hocmai-ems-admin.git
cd hocmai-ems-admin

# Install dependencies
npm install

# Setup Husky hooks
npm run prepare

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run storybook` - Start Storybook
- `npm run commit` - Interactive commit with conventional commits

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional components with hooks
- Use proper TypeScript types and interfaces

### React Components

- Use functional components with hooks
- Follow naming conventions: PascalCase for components
- Keep components focused and single-responsibility
- Use proper prop types and interfaces
- Implement proper error boundaries

### CSS/Styling

- Use Tailwind CSS for styling
- Follow utility-first approach
- Use CSS modules for component-specific styles when needed
- Maintain responsive design principles

### File Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── lib/          # Utility functions and configurations
├── types/        # TypeScript type definitions
└── styles/       # Global styles and CSS modules
```

## Testing

### Unit Tests

- Write tests for all new functionality
- Use Jest and React Testing Library
- Aim for >80% code coverage
- Test both success and error scenarios

### E2E Tests

- Use Playwright for end-to-end testing
- Test critical user flows
- Ensure cross-browser compatibility

### Running Tests

```bash
# Run all tests
npm run test:all

# Run unit tests only
npm run test

# Run E2E tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Pull Request Process

### Before Submitting

1. **Ensure tests pass** locally
2. **Run linting** and fix any issues
3. **Update documentation** if needed
4. **Squash commits** into logical units
5. **Use conventional commit messages**

### PR Guidelines

- **Title**: Use conventional commit format
- **Description**: Clearly describe changes and motivation
- **Linked Issues**: Reference related issues
- **Screenshots**: Include for UI changes
- **Testing**: Describe how you tested changes

### Review Process

1. **Automated checks** must pass (CI, linting, tests)
2. **Code review** by maintainers
3. **Address feedback** and make requested changes
4. **Maintainer approval** required for merge

## Issue Reporting

### Bug Reports

- Use the bug report template
- Provide clear reproduction steps
- Include environment details
- Add screenshots if applicable

### Feature Requests

- Use the feature request template
- Explain the problem and proposed solution
- Consider implementation complexity
- Discuss with maintainers first

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read it and ensure your contributions align with our community standards.

## Getting Help

- **Documentation**: Check the main README and project docs
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Maintainers**: Tag maintainers for urgent issues

## Recognition

Contributors will be recognized in:

- Project README
- Release notes
- GitHub contributors page
- Project documentation

Thank you for contributing to HOCMAI EMS Admin! 🚀
