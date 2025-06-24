import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  //--------------------------------- LOCATORS ---------------------------------//
  private readonly fieldSearch: Locator;
  public readonly linksSearchResult: Locator;
  private readonly textSearchedTerm: Locator;
  private readonly textWarningMessage: Locator;
  private readonly textSuccessMessage: Locator;
  private readonly linkShoppingCart: Locator;

  constructor(page: Page) {
    super(page);

    this.fieldSearch = page.locator("#search");
    this.linksSearchResult = page.locator("//div[contains(@class,'products-grid')]//a[@class='product-item-link']");
    this.textSearchedTerm = page.locator("//h1[@class='page-title']");
    this.textWarningMessage = page.locator("//div[@class='message notice']/div");
    this.textSuccessMessage = page.locator("//div[contains(@data-bind,'message.text')]");
    this.linkShoppingCart = page.locator("text=shopping cart");
  }

  //--------------------------------- ACTIONS ----------------------------------//
  async searchProducts(searchTerm: string) {
    await this.fill(this.fieldSearch, searchTerm);
    await this.fieldSearch.press('Enter');
    await expect(this.textSearchedTerm).toContainText(searchTerm);
  }

  async searchResultsContainKeyword(keyword: string) {
    const count = await this.linksSearchResult.count();
    for (let i = 0; i < count; i++) {
        const text = await this.linksSearchResult.nth(i).textContent();
        expect(text?.toLowerCase()).toContain(keyword);
    }
  }

  async getWarningMessageText(): Promise<string>{
    await this.textWarningMessage.waitFor({ state: 'visible', timeout: 2000 });
    const text = await this.textWarningMessage.textContent();
    return text?.trim() ?? '';
  }

  async getSuccessMessageText(): Promise<string>{
    await this.textSuccessMessage.waitFor({state: 'visible', timeout: 5000});
    const text = await this.textSuccessMessage.textContent();
    return text?.trim() ?? '';
  }

  async addProductToCart(productName: string) {
    await this.hover(this.linksSearchResult.filter({ hasText: productName }));

    const addToCartButton = this.page.locator(`//a[normalize-space()='${productName}']/ancestor::li//button[@title='Add to Cart']`);
    await this.click(addToCartButton);
  }

  async addProductToWishList(productName: string){
    await this.hover(this.linksSearchResult.filter({ hasText: productName }))

    const addToWishListButton = this.page.locator(`//a[normalize-space()='${productName}']/ancestor::li//a[@title='Add to Wish List']`);
    await this.click(addToWishListButton)
  }

  async clickShoppingCartLink(){
    await this.click(this.linkShoppingCart);
  }
}