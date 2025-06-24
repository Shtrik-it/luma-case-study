import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShoppingCartPage extends BasePage {

  //--------------------------------- LOCATORS ---------------------------------//

  constructor(page: Page) {
    super(page);
  }

  //--------------------------------- ACTIONS ---------------------------------//

  getProductByTitle(productTitle: string): Locator{
    return this.page.locator(`//table[@id='shopping-cart-table']//a[contains(text(),'${productTitle}')]`);
  }
}