import { When, Then } from '@cucumber/cucumber';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as checkoutData from '../testdata/checkout.json';

let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

When('I add {string} to the cart', async function (productName: string) {
    inventoryPage = new InventoryPage(this.page);
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.verifyCartBadgeUpdates(); // Validate cart badge updates right away
});

When('I checkout with valid customer details', async function () {
    inventoryPage = new InventoryPage(this.page);
    cartPage = new CartPage(this.page);
    checkoutPage = new CheckoutPage(this.page);

    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fetch valid customer details from JSON
    const customer = checkoutData.validCustomer;

    await checkoutPage.fillCustomerDetails(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.submitCheckout();
});

Then('I should see the order confirmation page', async function () {
    checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.verifyOrderConfirmation();
});
