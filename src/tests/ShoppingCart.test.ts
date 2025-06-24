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
    await homePage.searchProducts(productName);
    await homePage.addProductToCart(productName);
    await homePage.clickShoppingCartLink();
    await page.waitForURL('**/cart/**');
    await page.waitForResponse(response =>
        response.url().includes('carts/mine/totals-information') &&
        response.status() === 200
      );

      // Step 1: Get all quantity inputs
      const qtyInputs = page.locator("//input[@title='Qty']");
      const count = await qtyInputs.count();
      
      let totalQuantity = 0;
      for (let i = 0; i < count; i++) {
        const value = await qtyInputs.nth(i).inputValue();
        totalQuantity += parseInt(value, 10);
      }
      
      // Step 2: Calculate expected shipping
      const flatRatePerItem = 5;
      const expectedShipping = (totalQuantity * flatRatePerItem).toFixed(2);
      
      // Step 3: Parse actual shipping
      const shippingText = await page.locator("//span[@data-th='Shipping']").textContent();
      const actualShipping = shippingText?.replace(/[^0-9.\-]/g, '');
      expect(actualShipping).toBe(expectedShipping);
      
      // Step 4: Parse subtotal
      const subtotalText = await page.locator("//span[@data-th='Subtotal']").textContent();
      const subtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') ?? '0');
      
      // Step 5: Check for discount (optional)
      let discount = 0;
      const discountLocator = page.locator("//td[@data-th='Discount']//span[@class='price']");
      if (await discountLocator.count() > 0) {
        const discountText = await discountLocator.textContent(); // e.g., -$41.80
        discount = parseFloat(discountText?.replace(/[^0-9.\-]/g, '') ?? '0');
      }
      
      // Step 6: Add subtotal + shipping - discount
      const shipping = parseFloat(actualShipping ?? '0');
      const expectedTotal = (subtotal + shipping + discount).toFixed(2);
      
      // Step 7: Compare with UI total
      const totalText = await page.locator("//td[@data-th='Order Total']//span").textContent();
      const actualTotal = totalText?.replace(/[^0-9.]/g, '');
      
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

