# Luma UI Test Automation with Playwright

This project contains UI test automation for [Luma demo e-commerce site](https://magento.softwaretestingboard.com/) using **Playwright** and **TypeScript**.

The test suite validates core functionalities like product search, wishlist, shopping cart, and basic security checks (e.g., XSS input handling).

> Intended for interview code review.

---

## Project Structure

```
.
├── src
│   ├── tests/                  # Test files (grouped by feature)
│   ├── pages/                  # Page Object Model (POM) classes
│   ├── utils/
│   │   ├── SessionManager.ts   # Handles login sessions and storage state
│   │   ├── fixtures.ts         # Playwright custom fixtures
│   │   ├── credentials.ts      # Enum & user creds (uses dotenv)
│   │   └── storage/            # Saved session states per user
├── .env                        # Contains user passwords (committed for review purpose only - otherwise a security risk)
├── playwright.config.ts        # Playwright config
├── package.json
└── README.md                   # You’re reading this!
```

---

## Setup Instructions

### 1. Install Node.js (if not already installed)

Download and install the latest LTS version from: [https://nodejs.org/](https://nodejs.org/)

### 2. Clone the repository

```bash
git clone https://github.com/your-username/magento-playwright-tests.git
cd magento-playwright-tests
```

### 3. Install dependencies

```bash
npm install
```

This will install:

- `@playwright/test`
- `dotenv`

### 4. Install Playwright browsers

```bash
npx playwright install
```

### 5. User password file - `.env`

Nothing to do here, just a note that for the simplicity of the review the test user passwords have been commited
to GitHub for the sake of the review, but in a real project the file would be loaded form a secure storage like a password manager, a valut or GitHub secrets, depending on the security risk of the credentials.


### 6. Run tests

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test src/tests/ShoppingCart.test.ts
```

---

## Features Tested

- Product search by keyword and SKU
- Adding product to cart & verifying subtotal/shipping/discount/totals
- Wishlist functionality
- XSS input is not executed in search
- UI cleanup using `afterEach`
- Session reuse (no login repetition)

---

## Config Notes

- Configuration is defined in `playwright.config.ts`.
- Stored sessions are saved in `src/utils/storage/` per user type.
- Credentials are loaded securely via `.env` using the `dotenv` package (as a demonstration).

---

## Reviewer Notes

- This project is intentionally scoped for demonstration. Additional features (e.g., user registration, checkout) can be added similarly.
- Tests emphasize maintainability and clarity using POM, dynamic locators, and session reuse.

---

