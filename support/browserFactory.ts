import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import { config } from '../config/env';

export class BrowserFactory {
    static browser: Browser;
    static context: BrowserContext;
    static page: Page;

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
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        return this.page;
    }

    static async closePage() {
        if (this.page) {
            await this.page.close();
        }
        if (this.context) {
            await this.context.close();
        }
    }

    static async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
