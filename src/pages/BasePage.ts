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

  async fillUsingJS(selector: string, inputValue: string) {
    const locator = this.page.locator(selector);
    await locator.waitFor();
  
    await locator.evaluate((el, value) => {
      (el as HTMLInputElement).value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, inputValue);
  
    console.debug(`Filled input field '${selector}' with value (via JS): '${inputValue}'`);
  }

  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForTimeout(1000); // TODO: Refactor when possible
      return await this.page.locator(selector).isVisible();
    } catch (e) {
        console.error('Element is not visible by selector: ' + {selector} + 'Error: ' + e)
      return false;
    }
  }

  async getText(element: Locator) {
    await element.waitFor();
    return await element.innerText();
  }

  async waitToDisappear(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: "detached", timeout: 15000 });
  }

  async waitToAppear(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: "attached", timeout: 15000 });
  }
}
