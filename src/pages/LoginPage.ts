import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  //--------------------------------- LOCATORS ---------------------------------//
  private readonly linkSignIn: Locator;
  private readonly fieldEmail: Locator;
  private readonly fieldPassword: Locator;
  private readonly buttonSignIn: Locator;
  private readonly textWelcomeUser: Locator;
  private readonly buttonAgreePrivacy: Locator;
  private readonly buttonConsent: Locator;

  constructor(page: Page) {
    super(page);

    this.linkSignIn = page.locator("(//a[contains(text(),'Sign In')])[1]");
    this.fieldEmail = page.locator("#email");
    this.fieldPassword = page.locator("(//input[@id='pass'])[1]");
    this.buttonSignIn = page.locator("(//button[@id='send2'])[1]");
    this.textWelcomeUser = page.locator("(//span[@class='logged-in'])[1]");
    this.buttonAgreePrivacy = page.locator('#accept-btn')
    this.buttonConsent = page.locator("//p[text()='Consent']")
  }

  //--------------------------------- ACTIONS ---------------------------------//
  async login(email: string, password: string, username: string): Promise<void> {
    await this.giveConcentIfAppears();
    await this.acceptCookiesIfAppear();
    await this.click(this.linkSignIn);
    await this.fill(this.fieldEmail, email);
    await this.fill(this.fieldPassword, password);
    await this.click(this.buttonSignIn);
    await this.page.waitForLoadState('load');

    await expect(this.isUserLoggedIn(username)).toBeTruthy();
  }

  public async isUserLoggedIn(username: string): Promise<boolean> {
    try {
      const isPresent = await this.textWelcomeUser.isVisible({ timeout: 1000 }).catch(() => false);
      if (!isPresent) return false;
  
      await expect(this.textWelcomeUser).toContainText(username);
      return true;
    } catch {
      return false;
    }
  }
  

  public async acceptCookiesIfAppear(){
    if (await this.buttonAgreePrivacy.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.click(this.buttonAgreePrivacy);
    }
  }

  public async giveConcentIfAppears(){
    if (await this.buttonConsent.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.click(this.buttonConsent);
    }
  }

}
