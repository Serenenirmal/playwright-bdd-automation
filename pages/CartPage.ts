import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    private readonly checkoutButton = '[data-test="checkout"]';

    async proceedToCheckout() {
        await this.locator(this.checkoutButton).click();
    }
}
