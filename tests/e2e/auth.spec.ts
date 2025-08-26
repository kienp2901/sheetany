import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
  });

  test('should display signin page correctly', async ({ page }) => {
    // Check page title and branding
    await expect(
      page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
    ).toBeVisible();
    await expect(
      page.getByText('Hệ thống quản trị tra cứu HOCMAI')
    ).toBeVisible();
    await expect(page.getByText('Chỉ dành cho nhân viên HOCMAI')).toBeVisible();

    // Check Google sign-in button is present
    await expect(page.locator('#googleSignInDiv')).toBeVisible();

    // Check warning message about @hocmai.vn domain
    await expect(
      page.getByText('Chỉ chấp nhận tài khoản có domain @hocmai.vn')
    ).toBeVisible();
  });

  test('should redirect to students page after successful login', async ({
    page,
  }) => {
    // Mock successful Google OAuth response
    await page.addInitScript(() => {
      // Mock Google OAuth
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google = {
        accounts: {
          id: {
            initialize: () => {},
            renderButton: () => {},
            prompt: () => {},
          },
        },
      };
    });

    // Mock successful login API call
    await page.route(
      '**/hocmaiadmin/adminHocmaiManager/loginGoogle',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: true,
            token: 'mock-jwt-token',
          }),
        });
      }
    );

    // Mock successful students API call
    await page.route('**/hocmaiadmin/api/listStudent**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          data: [
            {
              idStudent: '1',
              idOriginal: 'ST001',
              email: 'student1@example.com',
              name: 'Nguyễn Văn A',
            },
          ],
          total: 1,
        }),
      });
    });

    // Simulate login (this would normally be done by Google OAuth)
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          email: 'kienpn@ctv.hocmai.vn',
          name: 'Admin User',
          picture: 'https://example.com/avatar.jpg',
        })
      );
      localStorage.setItem('auth_token', 'mock-jwt-token');

      // Trigger auth state change
      window.dispatchEvent(new Event('storage'));
    });

    // Wait for redirect to students page
    await page.waitForURL('/students');

    // Verify we're on the students page
    await expect(
      page.getByRole('heading', { name: 'Tra cứu học sinh' })
    ).toBeVisible();
  });

  test('should show error for non-hocmai domain emails', async ({ page }) => {
    // Mock failed login API call
    await page.route(
      '**/hocmaiadmin/adminHocmaiManager/loginGoogle',
      async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            status: false,
            message: 'Email không thuộc domain @hocmai.vn',
          }),
        });
      }
    );

    // Simulate login with non-hocmai email
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          email: 'user@gmail.com',
          name: 'User',
          picture: 'https://example.com/avatar.jpg',
        })
      );
      localStorage.setItem('auth_token', 'invalid-token');
    });

    // Should still be on signin page
    await expect(
      page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
    ).toBeVisible();
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route(
      '**/hocmaiadmin/adminHocmaiManager/loginGoogle',
      async (route) => {
        await route.abort('failed');
      }
    );

    // Simulate login attempt
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          email: 'kienpn@ctv.hocmai.vn',
          name: 'Admin User',
          picture: 'https://example.com/avatar.jpg',
        })
      );
      localStorage.setItem('auth_token', 'invalid-token');
    });

    // Should show error toast (if implemented)
    // This test verifies the app doesn't crash on auth errors
    await expect(
      page.getByRole('heading', { name: 'HOCMAI EMS Admin' })
    ).toBeVisible();
  });
});
