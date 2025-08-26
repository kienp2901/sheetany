import { expect, test } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting cookies (middleware checks cookies)
    await page.context().addCookies([
      {
        name: 'auth_token',
        value: 'mock-jwt-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Mock the API client to return user data
    await page.addInitScript(() => {
      // Mock localStorage
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          email: 'kienpn@ctv.hocmai.vn',
          name: 'Admin User',
          picture: 'https://example.com/avatar.jpg',
        })
      );
      localStorage.setItem('auth_token', 'mock-jwt-token');
    });

    // Mock API responses for authentication
    await page.route('**/hocmaiadmin/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          data: [],
          total: 0,
        }),
      });
    });

    await page.goto('/students');
  });

  test('should display layout components correctly', async ({ page }) => {
    // Wait for the page to load and authentication to complete
    await page.waitForLoadState('networkidle');

    // Debug: Check what's actually on the page
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());

    // Check if we're actually on the students page
    await expect(
      page.getByRole('heading', { name: 'Tra cứu học sinh' })
    ).toBeVisible();

    // Check sidebar - use more specific selectors and be more defensive
    try {
      await expect(
        page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
      ).toBeVisible();
    } catch (error) {
      console.log(
        'HOCMAI EMS Admin heading not found, checking for alternative:',
        error
      );
      // Try alternative selectors - check if we're on mobile viewport
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 1024) {
        // On mobile, check for mobile header - use more specific selector
        await expect(
          page
            .locator('header.lg\\:hidden h1')
            .filter({ hasText: 'HOCMAI EMS' })
            .first()
        ).toBeVisible();
      } else {
        // On desktop, check for desktop header
        await expect(page.getByText('HOCMAI EMS Admin')).toBeVisible();
      }
    }

    // Check if sidebar is visible
    const sidebar = page.locator('aside').first();
    const isSidebarVisible = await sidebar.isVisible();
    console.log('Sidebar visible:', isSidebarVisible);

    if (isSidebarVisible) {
      await expect(
        sidebar.getByText('kienpn@ctv.hocmai.vn').first()
      ).toBeVisible();
      await expect(sidebar.getByText('Admin User').first()).toBeVisible();
    } else {
      // Sidebar might be hidden on mobile, check for mobile menu button
      // The mobile menu button is only visible on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('button[title="Mở menu"]')).toBeVisible();
      // Reset to desktop viewport
      await page.setViewportSize({ width: 1024, height: 768 });
    }

    // Check navigation menu - use role-based selectors
    await expect(
      page.getByRole('link', { name: 'Tra cứu học sinh' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tra cứu sản phẩm' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tra cứu đề thi' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Quản trị Admin' })
    ).toBeVisible();

    // Check logout button
    await expect(page.getByRole('button', { name: 'Đăng xuất' })).toBeVisible();

    // Check main header - use role-based selectors
    try {
      await expect(
        page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
      ).toBeVisible();
    } catch (error) {
      console.log(
        'HOCMAI EMS Admin heading not found, checking for alternative:',
        error
      );
      // Check viewport and use appropriate header
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 1024) {
        await expect(
          page
            .locator('header.lg\\:hidden h1')
            .filter({ hasText: 'HOCMAI EMS' })
            .first()
        ).toBeVisible();
      } else {
        await expect(page.getByText('HOCMAI EMS Admin')).toBeVisible();
      }
    }

    // Check for the appropriate description text based on viewport
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      // On mobile, the description text is not shown, so we just check that we're on a valid page
      // The mobile header should be visible
      await expect(
        page
          .locator('header.lg\\:hidden h1')
          .filter({ hasText: 'HOCMAI EMS' })
          .first()
      ).toBeVisible();
    } else {
      // On desktop, check for the full description
      await expect(
        page.getByText('Hệ thống quản trị tra cứu HOCMAI')
      ).toBeVisible();
    }
  });

  test('should navigate between pages correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check viewport size and handle mobile navigation if needed
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 1024;

    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }

    // Navigate to products page - use role-based selector
    await page.getByRole('link', { name: 'Tra cứu sản phẩm' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/products');
    await page.waitForLoadState('networkidle');

    // Debug: Check what's on the page
    console.log('Products page URL:', page.url());
    console.log('Products page title:', await page.title());

    // Check if we're on the products page
    await expect(
      page.getByRole('heading', { name: 'Tra cứu sản phẩm' })
    ).toBeVisible();
    await expect(
      page.getByText('Quản lý và tra cứu thông tin các sản phẩm khóa học')
    ).toBeVisible();

    // Navigate to exams page - use role-based selector
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu đề thi' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/exams');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Tra cứu đề thi' })
    ).toBeVisible();
    await expect(
      page.getByText('Tra cứu lịch sử làm bài theo ID đề thi và loại cuộc thi')
    ).toBeVisible();

    // Navigate to admin page - use role-based selector
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Quản trị Admin' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/admin');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Quản trị hệ thống' })
    ).toBeVisible();
    await expect(
      page.getByText('Theo dõi và quản lý toàn bộ hệ thống HOCMAI EMS')
    ).toBeVisible();

    // Navigate back to students page - use role-based selector
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu học sinh' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/students');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Tra cứu học sinh' })
    ).toBeVisible();
  });

  test('should handle mobile navigation correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile header is visible - use more specific selector to avoid multiple matches
    await expect(
      page.locator('header h1').filter({ hasText: 'HOCMAI EMS' }).first()
    ).toBeVisible();
    await expect(page.locator('button[title="Mở menu"]')).toBeVisible();

    // Open mobile sidebar
    await page.locator('button[title="Mở menu"]').click();

    // Check mobile sidebar is open - use role-based selectors
    await expect(page.getByText('Menu')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tra cứu học sinh' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tra cứu sản phẩm' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tra cứu đề thi' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Quản trị Admin' })
    ).toBeVisible();

    // Close mobile sidebar by clicking on a navigation link (which should close the sidebar)
    await page.getByRole('link', { name: 'Tra cứu học sinh' }).click();

    // Wait for navigation to complete and check mobile sidebar is closed
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Give time for the sidebar to close

    // Check mobile sidebar is closed - check if the sidebar has the -translate-x-full class
    // which means it's hidden
    const mobileSidebar = page
      .locator('aside.fixed.inset-y-0.left-0.z-50.w-80')
      .first();
    await expect(mobileSidebar).toHaveClass(/-translate-x-full/);
  });

  test('should show active navigation state', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check viewport size and handle mobile navigation if needed
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 1024;

    // Students page should be active - use first() to avoid multiple matches
    // Check for the active state classes that are actually used
    const studentsLink = page.locator('a[href="/students"]').first();
    await expect(studentsLink).toHaveClass(/bg-indigo-50/);
    await expect(studentsLink).toHaveClass(/text-indigo-700/);

    // Navigate to products page - handle mobile navigation if needed
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu sản phẩm' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/products');
    await page.waitForLoadState('networkidle');

    // Products page should be active - wait for the active state to be applied
    await page.waitForTimeout(2000);
    const productsLink = page.locator('a[href="/products"]').first();

    // Check if the active state is applied, if not, wait a bit more
    try {
      await expect(productsLink).toHaveClass(/bg-indigo-50/);
      await expect(productsLink).toHaveClass(/text-indigo-700/);
    } catch (error) {
      console.log('Products link not found, checking for alternative:', error);
      // Wait a bit more and try again
      await page.waitForTimeout(2000);
      await expect(productsLink).toHaveClass(/bg-indigo-50/);
      await expect(productsLink).toHaveClass(/text-indigo-700/);
    }

    // Navigate back to students page - handle mobile navigation if needed
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu học sinh' }).click();

    // Wait for navigation to complete and check URL
    await page.waitForURL('**/students');
    await page.waitForLoadState('networkidle');

    // Students page should be active again
    await expect(studentsLink).toHaveClass(/bg-indigo-50/);
    await expect(studentsLink).toHaveClass(/text-indigo-700/);
  });

  test('should handle navigation with invalid routes', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Try to navigate to a non-existent route
    await page.goto('/non-existent-route');

    // Wait for the page to load and check if we're redirected
    await page.waitForLoadState('networkidle');

    // Since the middleware doesn't handle invalid routes, we should still be on the invalid route
    // but the page should show some content (likely a 404 or the layout with no content)
    console.log('Current URL:', page.url());
    console.log('Current title:', await page.title());

    // Check if we're on the invalid route (which is expected behavior)
    // Use includes to check if the path is in the URL
    expect(page.url()).toContain('/non-existent-route');

    // The page shows a 404 error, so we need to check for 404 content
    // Check if we can see the 404 error message
    try {
      await expect(
        page.getByText('This page could not be found')
      ).toBeVisible();
      // If we see the 404 message, the test passes
      expect(true).toBe(true);
    } catch (error) {
      // If no 404 message, check if we can see any layout elements
      console.log('No 404 message, checking for alternative:', error);
      const validHeadings = ['HOCMAI EMS', 'HOCMAI EMS Admin'];

      let foundValidPage = false;
      for (const heading of validHeadings) {
        try {
          await expect(page.getByText(heading)).toBeVisible();
          foundValidPage = true;
          break;
        } catch (e) {
          // Continue checking other headings
          console.log('No valid heading found, checking for alternative:', e);
        }
      }

      // Test passes if we're on any valid page or if the layout is still visible
      expect(foundValidPage).toBe(true);
    }
  });

  test('should display user profile information correctly', async ({
    page,
  }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check user avatar - the image might be hidden on desktop, so check if it exists
    const userAvatar = page.locator('img[alt="Admin User"]').first();
    await expect(userAvatar).toBeAttached();

    // Check if the avatar is visible in the sidebar
    const sidebar = page.locator('aside').first();
    if (await sidebar.isVisible()) {
      await expect(userAvatar).toBeVisible();
    }

    // Check user name and email - the sidebar might be hidden on mobile, so check both locations
    const userNameElements = page.getByText('Admin User');
    const userEmailElements = page.getByText('kienpn@ctv.hocmai.vn');

    // At least one should be visible
    const userNameCount = await userNameElements.count();
    const userEmailCount = await userEmailElements.count();

    expect(userNameCount).toBeGreaterThan(0);
    expect(userEmailCount).toBeGreaterThan(0);

    // Check if any are visible
    let userNameVisible = false;
    let userEmailVisible = false;

    for (let i = 0; i < userNameCount; i++) {
      if (await userNameElements.nth(i).isVisible()) {
        userNameVisible = true;
        break;
      }
    }

    for (let i = 0; i < userEmailCount; i++) {
      if (await userEmailElements.nth(i).isVisible()) {
        userEmailVisible = true;
        break;
      }
    }

    expect(userNameVisible).toBe(true);
    expect(userEmailVisible).toBe(true);
  });

  test('should handle responsive design correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Wait for layout to adjust

    // On tablet, check for either the mobile or desktop header
    try {
      // Try mobile header first (tablet might show mobile layout)
      await expect(
        page.locator('header h1').filter({ hasText: 'HOCMAI EMS' }).first()
      ).toBeVisible();
    } catch (error) {
      console.log('No mobile header found, checking for alternative:', error);
      try {
        // Try desktop header
        await expect(
          page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
        ).toBeVisible();
      } catch (error2) {
        console.log(
          'No desktop header found, checking for alternative:',
          error2
        );
        // If neither works, check for any HOCMAI text
        await expect(page.getByText('HOCMAI EMS')).toBeVisible();
      }
    }

    // Test desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500); // Wait for layout to adjust

    // On desktop, the sidebar should be visible (desktop sidebar)
    const desktopSidebar = page.locator('aside.hidden.lg\\:flex').first();
    await expect(desktopSidebar).toBeVisible();

    // On desktop, check for the main heading
    try {
      await expect(
        page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
      ).toBeVisible();
    } catch (error) {
      console.log('No desktop header found, checking for alternative:', error);
      // Try alternative heading
      await expect(page.getByText('HOCMAI EMS Admin')).toBeVisible();
    }

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for layout to adjust

    // On mobile, the desktop sidebar should be hidden
    await expect(desktopSidebar).not.toBeVisible();

    // On mobile, check for the mobile header
    try {
      await expect(
        page.locator('header h1').filter({ hasText: 'HOCMAI EMS' }).first()
      ).toBeVisible();
    } catch (error) {
      console.log('No mobile header found, checking for alternative:', error);
      // Try alternative mobile header
      await expect(page.getByText('HOCMAI EMS')).toBeVisible();
    }
  });

  test('should maintain navigation state after page refresh', async ({
    page,
  }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check viewport size and handle mobile navigation if needed
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 1024;

    // Navigate to products page - handle mobile navigation if needed
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu sản phẩm' }).click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Tra cứu sản phẩm' })
    ).toBeVisible();

    // Refresh the page
    await page.reload();

    // Wait for the page to load after refresh
    await page.waitForLoadState('networkidle');

    // Should still be on products page
    await expect(
      page.getByRole('heading', { name: 'Tra cứu sản phẩm' })
    ).toBeVisible();

    // Navigate back to students page - handle mobile navigation if needed
    if (isMobile) {
      // On mobile, open the navigation menu first
      await page.locator('button[title="Mở menu"]').click();
      await page.waitForTimeout(500); // Wait for menu to open
    }
    await page.getByRole('link', { name: 'Tra cứu học sinh' }).click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Tra cứu học sinh' })
    ).toBeVisible();
  });
});
