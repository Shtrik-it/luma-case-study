import { BrowserContext, chromium, Page, Browser } from '@playwright/test';
import { UserType, userCredentials } from './credentials';
import { LoginPage } from '../pages/LoginPage';
import * as fs from 'fs';
import * as path from 'path';

export class SessionManager {

  public static async setupSession(userType: UserType): Promise<BrowserContext> {
    const sessionPath = this.getSessionFilePath(userType);
    const browser = await chromium.launch({ headless: process.env.CI ? true : false });

    if (fs.existsSync(sessionPath)) {
      console.log(`Trying to reuse session for ${userType}`);
      const context = await browser.newContext({ storageState: sessionPath });

      const { username } = userCredentials[userType];
      const isValid = await this.validateSession(context, userType, username);

      if (isValid) {
        console.log(`Reused valid session for ${userType}`);
        return context;
      }

      console.warn(`Invalid session — deleting and re-logging in.`);
      fs.unlinkSync(sessionPath);
      await context.close();
    }

    return await this.createNewSession(userType, browser);
  }

  private static async validateSession(
    context: BrowserContext,
    userType: UserType,
    username: string
  ): Promise<boolean> {
    const page = await context.newPage();
    await page.goto("");

    const loginPage = new LoginPage(page);
    const loggedIn = await loginPage.isUserLoggedIn(username);
    return loggedIn;
  }

  private static async createNewSession(
    userType: UserType,
    browser: Browser,
  ): Promise<BrowserContext> {
    const context = await (await browser).newContext();
    const page = await context.newPage();

    const { email, password, username } = userCredentials[userType];
    const loginPage = new LoginPage(page);
    await page.goto("");
    await loginPage.login(email, password, username);

    await this.saveSession(context, userType);
    console.log(`New session created and saved for ${userType}`);
    return context;
  }

  private static async saveSession(context: BrowserContext, userType: UserType): Promise<void> {
    const sessionFilePath = this.getSessionFilePath(userType);
    await context.storageState({ path: sessionFilePath });
    console.log(`Session saved: ${sessionFilePath}`);
  }

  private static getSessionFilePath(userType: UserType): string {
    const dir = path.join(__dirname, 'storage');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return path.join(dir, `${userType}.json`);
  }
}
