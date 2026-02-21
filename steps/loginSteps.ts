import { Given, Then, When } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { config } from '../config/env';
import * as usersData from '../testdata/users.json';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

// Scenario: Negative login
Given('I attempt login with invalid credentials', async function () {
    loginPage = new LoginPage(this.page);
    await loginPage.navigate(config.baseURL);
    await loginPage.login(usersData.invalidUser.username, usersData.invalidUser.password);
});

Then('I should see an authentication error message', async function () {
    await loginPage.verifyErrorMessageVisible();
});

Then('I should remain on the login page', async function () {
    await loginPage.verifyOnLoginPage();
});

// Used in checkout.feature
Given('I login as {string}', async function (usernameType: string) {
    loginPage = new LoginPage(this.page);
    inventoryPage = new InventoryPage(this.page);

    await loginPage.navigate(config.baseURL);

    // Default to standard_user if not specified
    let username = usersData.validUser.username;
    let password = usersData.validUser.password;

    if (usernameType !== 'standard_user' && (usersData as any)[usernameType]) {
        username = (usersData as any)[usernameType].username;
        password = (usersData as any)[usernameType].password;
    }

    await loginPage.login(username, password);

    // Implicitly validate login success by checking inventory loaded
    await inventoryPage.verifyInventoryLoaded();
});
