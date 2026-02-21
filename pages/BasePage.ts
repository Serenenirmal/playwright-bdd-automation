import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    // Generalized locator strategy: prefers data-test, falls back to css
    protected locator(cssOrDataTest: string) {
        if (cssOrDataTest.startsWith('[data-test=')) {
            return this.page.locator(cssOrDataTest); // If it's explicitly a data-test selector
        }
        // Assume it might be a data-test attribute value, or a CSS selector
        return this.page.locator(`[data-test="${cssOrDataTest}"], ${cssOrDataTest}`).first();
    }
}
