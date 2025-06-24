import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { WishListPage } from '../pages/WishlistPage';


export class PageObjects {
  readonly loginPage: LoginPage;
  readonly homePage: HomePage;
  readonly shoppingCartPage: ShoppingCartPage;
  readonly wishListPage: WishListPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.shoppingCartPage = new ShoppingCartPage(page);
    this.wishListPage = new WishListPage(page);
  }
}