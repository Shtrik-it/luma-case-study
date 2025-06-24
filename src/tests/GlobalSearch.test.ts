import { test, expect } from "../utils/fixtures";

test("Customer can search for a product and get related results", async ({pages}) => {
    const { homePage } = pages;

    const searchTerm = 'watch';
    await homePage.searchProducts(searchTerm);
    await homePage.searchResultsContainKeyword(searchTerm);
});

test("Customer can search by SKU code and get the correct result", async ({pages}) => {
    const {homePage} = pages;

    const SKUCode = 'WJ02';
    const productName = 'Josie Yoga Jacket'
    await homePage.searchProducts(SKUCode);
    await expect(await homePage.linksSearchResult.first().textContent()).toContain(productName);
});

test("Customer can search for non-existing product and get a warning message", async ({pages}) =>{
    const {homePage} = pages;

    const searchTerm = 'AAAAAAA';
    const expectedMessage = 'Your search returned no results.';
    await homePage.searchProducts(searchTerm);
    const actualMessage = await homePage.getWarningMessageText();
    expect(actualMessage).toBe(expectedMessage);
});

test("Customer gets a warning when trying to search with less than 3 chars", async ({pages}) =>{
    const {homePage} = pages;

    const searchTerm = 'BB';
    const expectedMessage = 'Minimum Search query length is 3';
    await homePage.searchProducts(searchTerm);
    const actualMessage = await homePage.getWarningMessageText();
    expect(actualMessage).toBe(expectedMessage);
});

test("Customer input containing XSS vector does not trigger script execution", async ({pages}) =>{
    const {homePage} = pages;

    const attackVector = '<script>alert(1)</script>';
    let alertTriggered = false;

    const page = homePage.getPage();
    page.on('dialog', async (dialog) => {
        alertTriggered = true;
        await dialog.dismiss();
    });
  
    await homePage.searchProducts(attackVector);
    expect(alertTriggered).toBe(false);
})
