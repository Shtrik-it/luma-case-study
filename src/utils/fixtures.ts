import { test as base } from '@playwright/test';
import { SessionManager } from './SessionManager';
import { UserType } from './credentials';
import { PageObjects } from './PageObjects';

type MyFixtures = {
  pages: PageObjects;
};

export const test = base.extend<MyFixtures>({
  page: async ({}, use, testInfo) => {
    const userRoleMap: Record<string, UserType> = {
      Customer: UserType.CUSTOMER_USER,
      Manager: UserType.MANAGER_USER,
    };

    const matchedRole = Object.keys(userRoleMap).find(role =>
      testInfo.title.includes(role)
    );

    const userType = matchedRole ? userRoleMap[matchedRole] : UserType.NO_USER;
    console.log(`Setting up session for: ${userType}`);

    const context = await SessionManager.setupSession(userType);
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    await use(page);
    await context.close();
  },

  pages: async ({ page }, use) => {
    const pageObjects = new PageObjects(page);
    await use(pageObjects);
  },
});

export { expect } from '@playwright/test';
