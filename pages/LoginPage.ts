import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    private readonly usernameInput = '[data-test="username"]';
    private readonly passwordInput = '[data-test="password"]';
    private readonly loginButton = '[data-test="login-button"]';
    private readonly errorMessage = '[data-test="error"]';

    async login(username: string, password: string) {
        await this.locator(this.usernameInput).fill(username);
        await this.locator(this.passwordInput).fill(password);
        await this.locator(this.loginButton).click();
    }

    async verifyErrorMessageVisible() {
        await expect(this.locator(this.errorMessage)).toBeVisible();
    }

    async verifyOnLoginPage() {
        await expect(this.locator(this.loginButton)).toBeVisible();
    }
}
