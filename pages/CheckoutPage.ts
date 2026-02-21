import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    private readonly firstNameInput = '[data-test="firstName"]';
    private readonly lastNameInput = '[data-test="lastName"]';
    private readonly postalCodeInput = '[data-test="postalCode"]';
    private readonly continueButton = '[data-test="continue"]';
    private readonly finishButton = '[data-test="finish"]';
    private readonly completeHeader = '[data-test="complete-header"]';

    async fillCustomerDetails(firstName: string, lastName: string, postalCode: string) {
        await this.locator(this.firstNameInput).fill(firstName);
        await this.locator(this.lastNameInput).fill(lastName);
        await this.locator(this.postalCodeInput).fill(postalCode);
    }

    async submitCheckout() {
        await this.locator(this.continueButton).click();
        await this.locator(this.finishButton).click();
    }

    async verifyOrderConfirmation() {
        await expect(this.locator(this.completeHeader)).toBeVisible();
        await expect(this.locator(this.completeHeader)).toHaveText(/THANK YOU FOR YOUR ORDER/i);
    }
}
