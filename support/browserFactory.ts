import { chromium, firefox, webkit, Browser, Page } from '@playwright/test';
import { config } from '../config/env';

export class BrowserFactory {
    static browser: Browser;

    static async initBrowser() {
        const headless = config.headless;
        // Optionally define a slowMo parameter via env, or default it if not headless
        const slowMo = process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : (headless ? 0 : 500);

        const launchOptions = { headless, slowMo };

        switch (config.browser.toLowerCase()) {
            case 'firefox':
                this.browser = await firefox.launch(launchOptions);
                break;
            case 'webkit':
                this.browser = await webkit.launch(launchOptions);
                break;
            case 'chromium':
            default:
                this.browser = await chromium.launch(launchOptions);
                break;
        }
    }

    static async getPage(): Promise<Page> {
        if (!this.browser) {
            await this.initBrowser();
        }
        const context = await this.browser.newContext();
        const page = await context.newPage();
        return page;
    }

    static async closePage(page: Page) {
        if (page) {
            await page.close();
            const context = page.context();
            if (context) {
                await context.close();
            }
        }
    }

    static async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
