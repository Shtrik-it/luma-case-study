import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishListPage extends BasePage {

  //--------------------------------- LOCATORS ---------------------------------//
  private readonly linksWishList: Locator;

  constructor(page: Page) {
    super(page);

    this.linksWishList = page.locator("//div[contains(@class,'products-grid')]//a[@class='product-item-link']");
  }

  //--------------------------------- ACTIONS ---------------------------------//

  getProductByTitle(productTitle: string): Locator{
    return this.page.locator(`//a[contains(text(),'${productTitle}') and @title='${productTitle}']`);
  }

  async removeProductFromWishList(productName: string) {
    await this.hover(this.linksWishList.filter({ hasText: productName }));

    const removeFromWishListButton = this.page.locator(`//a[normalize-space()='${productName}']/ancestor::li//a[@title='Remove Item']`);
    await this.click(removeFromWishListButton);
  }
}