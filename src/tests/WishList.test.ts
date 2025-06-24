import { test, expect } from "../utils/fixtures";


test("Customer can add an item into the wishlist", async ({ pages }, testInfo) =>{
    const {homePage, wishListPage} = pages;

    const productName = 'Zing Jump Rope';
    testInfo.attach('productName', { body: productName });
    const notification = `${productName} has been added to your Wish List. Click here to continue shopping.`;
    await homePage.searchProducts(productName);
    await homePage.addProductToWishList(productName);

    const actualMessage = await homePage.getSuccessMessageText();
    expect(actualMessage).toBe(notification);

    await expect(wishListPage.getProductByTitle(productName)).toBeVisible();
});

//cleanup
test.afterEach(async ({ pages }, testInfo) => {
    const {wishListPage} = pages
    const attachment = testInfo.attachments.find(a => a.name === 'productName');

    if (attachment?.body) {
        const productName = attachment.body.toString();
        await wishListPage.removeProductFromWishList(productName);
      }
});