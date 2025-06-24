import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShoppingCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //--------------------------------- LOCATORS ---------------------------------//
  private readonly qtyInputs = this.page.locator("//input[@title='Qty']");
  private readonly shippingLocator = this.page.locator("//span[@data-th='Shipping']");
  private readonly subtotalLocator = this.page.locator("//span[@data-th='Subtotal']");
  private readonly discountLocator = this.page.locator("//td[@data-th='Discount']//span[@class='price']");
  private readonly totalLocator = this.page.locator("//td[@data-th='Order Total']//span");
  public readonly buttonRemoveItem = this.page.locator("//a[contains(@class,'action-delete')]");

  //--------------------------------- ACTIONS ---------------------------------//
  getProductByTitle(productTitle: string): Locator {
    return this.page.locator(`//table[@id='shopping-cart-table']//a[contains(text(),'${productTitle}')]`);
  }

  async getTotalQuantity(): Promise<number> {
    const count = await this.qtyInputs.count();
    let total = 0;
    for (let i = 0; i < count; i++) {
      const value = await this.qtyInputs.nth(i).inputValue();
      total += parseInt(value, 10);
    }
    return total;
  }
  
  async getNumericValue(locator: Locator): Promise<number> {
    const text = await locator.textContent();
    return parseFloat(text?.replace(/[^0-9.\-]/g, '') ?? '0');
  }
  
  async getShipping(): Promise<number> {
    return this.getNumericValue(this.shippingLocator);
  }
  
  async getSubtotal(): Promise<number> {
    return this.getNumericValue(this.subtotalLocator);
  }
  
  async getDiscount(): Promise<number> {
    if (await this.discountLocator.count() > 0) {
      return this.getNumericValue(this.discountLocator);
    }
    return 0;
  }
  
  async getOrderTotal(): Promise<number> {
    return this.getNumericValue(this.totalLocator);
  }
}
