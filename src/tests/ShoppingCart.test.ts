import { test, expect } from "../utils/fixtures";

test("Customer can add an item into the shopping cart", async ({pages}) =>{
    const {homePage, shoppingCartPage} = pages;

    const productName = 'Zing Jump Rope';
    const notification = `You added ${productName} to your shopping cart.`;
    await homePage.searchProducts(productName);
    await homePage.addProductToCart(productName);

    const actualMessage = await homePage.getSuccessMessageText();
    expect(actualMessage).toBe(notification);

    await homePage.clickShoppingCartLink();
    await expect(shoppingCartPage.getProductByTitle(productName)).toBeVisible();
});

test("Customer gets a flat rate of 5% added for each product in the cart", async ({pages, page}) =>{
    const {homePage, shoppingCartPage} = pages;

    const productName = 'Zing Jump Rope';
    const flatRatePerItem = 5;
    await homePage.searchProducts(productName);
    await homePage.addProductToCart(productName);
    await homePage.clickShoppingCartLink();
    await page.waitForURL('**/cart/**');
    await page.waitForResponse(response =>
        response.url().includes('carts/mine/totals-information') &&
        response.status() === 200
      );
      
    const totalQty = await shoppingCartPage.getTotalQuantity();
    const expectedShipping = (totalQty * flatRatePerItem).toFixed(2);
    const actualShipping = (await shoppingCartPage.getShipping()).toFixed(2);
    expect(actualShipping).toBe(expectedShipping);

    const subtotal = await shoppingCartPage.getSubtotal();
    const discount = await shoppingCartPage.getDiscount();

    const expectedTotal = (subtotal + parseFloat(expectedShipping) + discount).toFixed(2);
    const actualTotal = (await shoppingCartPage.getOrderTotal()).toFixed(2);
    expect(actualTotal).toBe(expectedTotal);
});

//cleanup
test.afterEach(async ({ page }) => {
  const removeButtonLocator = page.locator("//a[contains(@class,'action-delete')]");

  const count = await removeButtonLocator.count();
  if (count === 0) {
    return;
  }

  console.log(`Cleaning up ${count} item(s) from shopping cart...`);

  while (await removeButtonLocator.count() > 0) {
    await removeButtonLocator.first().click();
  }
  console.log('Shopping cart cleared');
});

