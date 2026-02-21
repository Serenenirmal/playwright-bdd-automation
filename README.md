# Playwright BDD Automation Framework

A complete Behavior-Driven Development (BDD) automation framework built with TypeScript, Playwright, and Cucumber for automating `https://www.saucedemo.com/`.

## 1. Setup Instructions

1.  Clone the repository.
2.  Ensure you have Node.js (v18+) installed.
3.  Copy `.env.example` to a new file named `.env` and configure your environment variables (default settings will work for the standard test run).
    ```bash
    cp .env.example .env
    ```

## 2. Install Dependencies

Install all required npm packages and the Playwright browsers:

```bash
npm install
npx playwright install
```

## 3. How to Run Tests

Execute the full suite of Cucumber scenarios:

```bash
npx cucumber-js
```

## 4. How to Change Browser/Headless Mode

You can configure the browser and execution mode by editing the `.env` file:

*   **Browser Selection**: Change the `BROWSER` variable. Supported values: `chromium`, `firefox`, `webkit`.
*   **Headless Mode**: Change the `HEADLESS` variable to `true` (running in background) or `false` (opens the browser UI).

Example `.env` configuration for UI viewing:
```env
BROWSER=chromium
HEADLESS=false
```

## 5. Assumptions Made

*   The required Node.js environment is available.
*   The target website (`https://www.saucedemo.com/`) is stable and accessible.
*   The PostgreSQL database utility is currently implemented as a functional placeholder; a real database instance matching the `.env` config is required for actual use.
*   The `tsconfig.json` paths and Cucumber configuration are structured specifically for this repository layout.

## 6. Locator Strategy for Adding "Sauce Labs Backpack"

**Primary Strategy (`data-test` attribute)**
The primary locatory strategy relies on the `data-test` attributes provided in the Saucedemo DOM. For the Backpack, the button explicitly uses:
`[data-test="add-to-cart-sauce-labs-backpack"]`

**Fallback Strategy (CSS Selector)**
If the custom `BasePage.ts` locator function encounters a selector that does not begin with `[data-test=`, it immediately falls back to a standard CSS selector. This guarantees flexibility if `data-test` attributes are temporarily missing or modified in the DOM.

## 7. Engineering Notes

### Why this framework structure?
The structure (`/features`, `/steps`, `/pages`, `/support`, `/testdata`) strictly separates concerns. BDD features define the "what," step definitions connect English to code, Page Objects handle the "how" of UI interaction, and support files manage infrastructure (config, DB, browser lifecycle). This modularity is crucial for maintainability.

### How does the wait strategy prevent flakiness?
This framework strictly avoids `Thread.sleep()` or similar hard waits. Instead, it relies 100% on Playwright's built-in auto-waiting mechanism. Playwright automatically waits for elements to be actionable (visible, stable, enabled) before performing actions like `click()` or `fill()`, completely eliminating race conditions and timing-related flakiness.

### How does the locator strategy improve stability?
Relying primarily on `data-test` attributes improves stability because these attributes are specifically meant for testing and are decoupled from CSS styling or fragile DOM structures (like XPath). The robust fallback mechanism further ensures resilience if the primary attribute fails.

### How would you scale to 50+ scenarios?
To scale gracefully:
1.  **Parallel Execution**: Configure Playwright and Cucumber to run tests in parallel across multiple workers.
2.  **Tagging**: Use Cucumber hooks and tags (`@regression`, `@smoke`) to selectively run subsets of tests.
3.  **Data Management Phase**: Implement API-level setup/teardown in hooks to bypass slow UI sequences for test prerequisite creation.

### How would you execute in CI/CD?
The framework includes a GitHub Actions workflow (`.github/workflows/test.yml`). On every push or pull request to the `main` branch, the CI pipeline automatically procures a Node environment, installs dependencies, installs Playwright browsers, and executes the test suite headless, subsequently archiving screenshot artifacts if failures occur.

### Two improvements with more time
1.  **API Integration**: Replace UI-based login steps with API authentication routines for non-login specific tests to drastically reduce overall execution time.
2.  **Allure Reporting**: Integrate Allure reports or Playwright's native HTML reporter to provide rich, visual insights, execution trends, and failure analysis rather than standard console output.

## 8. AI Usage Disclosure

*Note: AI assistance was utilized strictly for generating foundational boilerplate code (like tsconfig.json formatting) and assisting with standardizing the syntax of this README documentation. All structural architecture, Page Object Model design, and validation logic were authored manually according to SDET best practices.*
