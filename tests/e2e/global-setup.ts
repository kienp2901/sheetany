import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  if (!baseURL) {
    throw new Error('Base URL is not configured');
  }

  // Start the application if it's not already running
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Try to access the application
    await page.goto(baseURL);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    console.log('✅ Application is running and accessible');
  } catch (error) {
    console.error('❌ Application is not accessible:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
