import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public getPage(): Page {
    return this.page;
  }

  async click(element: Locator) {
    await element.waitFor();
    await element.click();
    console.debug(`Clicked on element: ${element}`);
  }

  async fill(element: Locator, inputValue: string) {
    await element.waitFor();
    await element.fill(inputValue);
    console.debug(`Filled input field '${element}' with value: '${inputValue}'`);
  }

  async tickCheckbox(selector: string) {
    await this.page.locator(selector).waitFor();
    await this.page.locator(selector).check();
    await expect(this.page.locator(selector)).toBeChecked();
    console.debug(`Ticked checkbox '${selector}`);
  }

  async selectFromDropdown(selector: string, dropdownOptionText: string) {
    const dropdown = this.page.locator(selector);
    await dropdown.waitFor();
    await dropdown.focus();
    await dropdown.selectOption({ label: dropdownOptionText });
    console.debug(`Selected value '${dropdownOptionText}' from dropdown: '${selector}'`);
  }

  async hover(element: Locator){
    await element.waitFor();
    await element.hover();
    console.debug(`Hovered over element: ${element}`)
  }
}
