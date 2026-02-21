import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    private readonly cartBadge = '[data-test="shopping-cart-badge"]';
    private readonly cartLink = '[data-test="shopping-cart-link"]';

    async addProductToCart(productName: string) {
        // Convert product name to valid data-test format (e.g. Sauce Labs Backpack -> add-to-cart-sauce-labs-backpack)
        const formattedProductName = productName.toLowerCase().replace(/\s+/g, '-');
        const addToCartButton = `[data-test="add-to-cart-${formattedProductName}"]`;
        await this.locator(addToCartButton).click();
    }

    async verifyCartBadgeUpdates() {
        await expect(this.locator(this.cartBadge)).toBeVisible();
        const badgeText = await this.locator(this.cartBadge).textContent();
        expect(Number(badgeText)).toBeGreaterThan(0);
    }

    async goToCart() {
        await this.locator(this.cartLink).click();
    }

    async verifyInventoryLoaded() {
        await expect(this.locator('[data-test="inventory-list"]')).toBeVisible();
    }
}
