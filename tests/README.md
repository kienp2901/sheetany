# Testing Guide for HOCMAI EMS Admin

This project includes comprehensive testing setup with both **End-to-End (E2E)** tests using Playwright and **Integration** tests using Jest.

## 🏗️ Test Structure

```
tests/
├── e2e/                    # End-to-End tests with Playwright
│   ├── auth.spec.ts       # Authentication flow tests
│   ├── students.spec.ts   # Students page tests
│   ├── navigation.spec.ts # Navigation and layout tests
│   ├── global-setup.ts    # Global setup for E2E tests
│   └── playwright.config.ts # Playwright configuration
├── integration/            # Integration tests with Jest
│   ├── api.test.ts        # API client tests
│   ├── auth-context.test.tsx # Auth context tests
│   ├── components.test.tsx # Component tests
│   ├── jest.config.js     # Jest configuration
│   └── setup.ts           # Jest setup file
└── README.md              # This file
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
npm run test:e2e:install
```

### Run All Tests

```bash
# Run integration tests
npm run test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 🧪 Integration Tests (Jest)

Integration tests focus on testing individual components, hooks, and utilities in isolation.

### Features

- **Component Testing**: Test React components with React Testing Library
- **Hook Testing**: Test custom hooks and context providers
- **API Testing**: Test API client functions with mocked responses
- **Coverage**: Generate coverage reports for code quality
- **TypeScript Support**: Full type checking in tests
- **Mocking**: Comprehensive API and external dependency mocking

### Run Integration Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with verbose output
npm run test -- --verbose
```

### Test Examples

```typescript
// Testing a component
test('should render search bar correctly', () => {
  render(<SearchBar placeholder="Test" onSearch={jest.fn()} />);
  expect(screen.getByPlaceholder('Test')).toBeVisible();
});

// Testing API calls
test('should fetch students successfully', async () => {
  const mockStudents = [{ id: 1, name: 'Test' }];
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: mockStudents, total: 1 })
  });

  const result = await apiClient.getStudents();
  expect(result.data).toEqual(mockStudents);
});

// Testing custom hooks
test('should provide authentication context', () => {
  const TestComponent = () => {
    const { user, isAuthenticated } = useAuth();
    return (
      <div>
        <span data-testid="user">{user?.email}</span>
        <span data-testid="status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      </div>
    );
  };

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByTestId('status')).toHaveTextContent('logged-out');
});
```

## 🌐 End-to-End Tests (Playwright)

E2E tests simulate real user interactions across the entire application.

### Features

- **Cross-browser Testing**: Test on Chromium, Firefox, WebKit
- **Mobile Testing**: Test responsive design on mobile devices
- **Visual Testing**: Screenshots and videos on test failures
- **Network Mocking**: Mock API responses for consistent testing
- **Performance Testing**: Measure page load times and interactions
- **Accessibility Testing**: Built-in accessibility checks

### Run E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npm run test:e2e -- tests/e2e/auth.spec.ts

# Run tests with specific browser
npm run test:e2e -- --project=chromium
```

### Test Examples

```typescript
// Testing user authentication
test('should login successfully', async ({ page }) => {
  await page.goto('/auth/signin');
  await expect(page.getByText('HOCMAI EMS Admin')).toBeVisible();

  // Mock API responses
  await page.route('**/loginGoogle', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ token: 'mock-token' }),
    });
  });

  // Simulate login
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'mock-token');
  });

  await expect(page).toHaveURL('/students');
});

// Testing responsive design
test('should display mobile menu on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/students');

  // Check if mobile menu button is visible
  await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();

  // Click menu button
  await page.getByRole('button', { name: /menu/i }).click();

  // Check if sidebar is visible
  await expect(page.locator('aside')).toBeVisible();
});

// Testing data table functionality
test('should paginate through student data', async ({ page }) => {
  await page.goto('/students');

  // Wait for data to load
  await page.waitForSelector('[data-testid="student-row"]');

  // Check pagination controls
  await expect(page.getByRole('button', { name: /next/i })).toBeVisible();

  // Click next page
  await page.getByRole('button', { name: /next/i }).click();

  // Verify page change
  await expect(page.getByText('Page 2')).toBeVisible();
});
```

## 🔧 Configuration

### Jest Configuration

The Jest configuration (`tests/integration/jest.config.js`) includes:

- Next.js integration
- TypeScript support
- React Testing Library setup
- Coverage thresholds (70%)
- Module path mapping
- Environment setup for DOM testing
- Mock service worker integration

### Playwright Configuration

The Playwright configuration (`tests/e2e/playwright.config.ts`) includes:

- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device testing
- Screenshot and video capture
- Network mocking capabilities
- Global setup for application health checks
- Performance monitoring
- Accessibility testing

## 📱 Test Coverage

### Integration Tests Coverage

- **Components**: Layout, SearchBar, DataTable, Modal, Button, Card
- **Hooks**: useAuth hook và AuthProvider
- **API**: API client functions và error handling
- **Utilities**: Helper functions và data transformations
- **Context**: Authentication context và state management

### E2E Tests Coverage

- **Authentication Flow**: Login, logout, session management
- **Navigation**: Page routing, sidebar, mobile responsiveness
- **Student Management**: Search, view details, pagination
- **Product Management**: List, search, export functionality
- **Exam Management**: Contest type selection, history viewing
- **Admin Management**: CRUD operations, dashboard
- **Cross-browser Compatibility**: Chrome, Firefox, Safari
- **Mobile Experience**: Responsive design và touch interactions

## 🚨 Common Issues & Solutions

### Integration Tests

1. **Module not found errors**
   - Ensure Jest configuration has correct module mapping
   - Check that all dependencies are installed
   - Verify TypeScript path aliases

2. **Component rendering issues**
   - Verify all required mocks are in place
   - Check that test environment supports React 18+
   - Ensure proper provider wrapping

3. **API mocking problems**
   - Check mock service worker setup
   - Verify fetch mock implementation
   - Ensure proper response format

### E2E Tests

1. **Application not starting**
   - Ensure `npm run dev` works locally
   - Check Playwright configuration baseURL
   - Verify environment variables

2. **Network timeouts**
   - Increase timeout values in Playwright config
   - Verify API mocking is working correctly
   - Check network conditions

3. **Browser installation issues**
   - Run `npm run test:e2e:install`
   - Check system requirements for browsers
   - Verify browser compatibility

4. **Test flakiness**
   - Add proper wait conditions
   - Use stable selectors
   - Implement retry logic for flaky operations

## 📊 Test Reports

### Jest Coverage Report

After running `npm run test:coverage`, view the coverage report:

- Open `coverage/lcov-report/index.html` in your browser
- Check coverage thresholds are met (70% minimum)
- Review uncovered lines and add tests
- Export coverage data for CI/CD

### Playwright Report

After running E2E tests, view the HTML report:

- Open `playwright-report/index.html` in your browser
- Review test results, screenshots, and traces
- Analyze test performance metrics
- Debug failed tests with detailed logs

### Test Results

```bash
# View test results summary
npm run test -- --verbose

# Generate coverage report
npm run test:coverage

# View E2E test results
npm run test:e2e -- --reporter=html
```

## 🧹 Maintenance

### Regular Tasks

- Update test dependencies quarterly
- Review and update test data as application evolves
- Monitor test execution times and optimize slow tests
- Update mocks when API contracts change
- Review and update test coverage thresholds

### Best Practices

- Keep tests focused and atomic
- Use descriptive test names
- Mock external dependencies consistently
- Maintain test data fixtures
- Regular test execution in CI/CD pipeline
- Use data-testid attributes for stable selectors
- Implement proper cleanup in tests

### Test Data Management

```typescript
// Create reusable test data
export const mockStudents = [
  { idStudent: '1', idOriginal: 'ST001', email: 'student1@test.com', name: 'Student One' },
  { idStudent: '2', idOriginal: 'ST002', email: 'student2@test.com', name: 'Student Two' }
];

// Use in tests
test('should display student list', () => {
  render(<StudentList students={mockStudents} />);
  expect(screen.getByText('Student One')).toBeVisible();
});
```

## 🔗 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📝 Contributing

When adding new features:

1. Write integration tests for new components/hooks
2. Add E2E tests for critical user flows
3. Update this README with new test information
4. Ensure all tests pass before submitting PR
5. Maintain test coverage above 70%
6. Add proper error handling tests
7. Test responsive design for new components

## 🚀 Performance Testing

### Load Testing

```bash
# Test application performance
npm run test:e2e -- --project=chromium --grep "performance"
```

### Memory Testing

```bash
# Check for memory leaks
npm run test:e2e -- --project=chromium --grep "memory"
```

## 🔒 Security Testing

### Authentication Tests

- Test unauthorized access attempts
- Verify token validation
- Check session management
- Test logout functionality

### Input Validation Tests

- Test malicious input handling
- Verify XSS protection
- Check CSRF protection
- Test SQL injection prevention

---

**Happy Testing! 🎯**

This testing suite ensures the HOCMAI EMS Admin application is robust, reliable, and user-friendly across all platforms and scenarios.
