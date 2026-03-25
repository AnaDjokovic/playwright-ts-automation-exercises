<p align="center">
  <img src="https://automationexercise.com/static/images/home/logo.png" alt="QA Automation Exercises Banner" width="500"/>
</p>

<h1 align="center">QA Automation Exercises - Playwright</h1>

## Architecture Overview

This project implements a robust test automation framework for [Automation Exercise](https://automationexercise.com/) website using **Playwright** with **TypeScript**. The architecture follows the **Page Object Model (POM)** pattern for maintainability and scalability.

### Test Framework Architecture

```
┌─────────────────────┐
│  Test Specs         │  (E2E + API tests)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Page Objects       │  (UI interactions)
│  API Helpers        │  (API requests)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Base Classes       │  (Common functionality)
│  Fixtures           │  (Test setup/teardown)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Playwright         │  (Browser automation)
└─────────────────────┘
```

### Key Features

- **Page Object Model** - Clean separation of UI interactions and test logic
- **Fixture-based Setup** - Automatic page object and data injection
- **API Integration** - Tests can use both UI and API for setup/teardown
- **Test Isolation** - Each test uses unique data (UUID-based emails)
- **Multi-browser Testing** - Chromium and Firefox execution
- **Tagged Execution** - Filter tests by @smoke or @regression tags
- **Failure Screenshots** - Automatic screenshot capture on test failure

### Project Structure

```
playwright-automation-exercises/
├── tests/
│   ├── api/
│   │   ├── helpers/
│   │   │   ├── data.helper.ts           # Test data generation (UUID emails)
│   │   │   ├── function.helper.ts       # Utility functions
│   │   │   └── https.helper.ts          # API request wrapper
│   │   └── specs/
│   │       ├── loginValidation.spec.ts
│   │       ├── registration.spec.ts
│   │       ├── products.list.spec.ts
│   │       └── products.search.spec.ts
│   │
│   └── e2e/
│       ├── fixtures.ts                  # Playwright fixtures (page objects, user data)
│       ├── helpers/
│       │   ├── BasePage.ts              # Base class for all page objects
│       │   └── data.helper.ts           # E2E test data (categories, brands)
│       ├── pageObjects/
│       │   ├── CartPage.ts
│       │   ├── HomePage.ts
│       │   ├── LoginPage.ts
│       │   ├── RegistrationPage.ts
│       │   ├── ProductsPage.ts
│       │   └── ProductDetailsPage.ts
│       └── specs/
│           ├── homePageValidation.spec.ts
│           ├── loginValidation.spec.ts
│           ├── registrationValidation.spec.ts
│           ├── cartPageValidation.spec.ts
│           ├── productsPageValidation.spec.ts
│           └── productDetailsPageValidation.spec.ts
│
├── playwright.config.ts                 # Playwright configuration
├── package.json                         # NPM scripts & dependencies
├── tsconfig.json                        # TypeScript configuration
└── README.md
```

### Test Coverage

| Area | Test Count | Tags |
|------|-----------|------|
| **Home Page** | 6 tests | @smoke, @regression |
| **Login** | 6 tests | @smoke, @regression |
| **Registration** | 4 tests | @smoke, @regression |
| **Products** | 3 tests | @regression |
| **Cart** | 2 tests | @smoke, @regression |
| **Product Details** | 2 tests | @smoke, @regression |
| **API - Login** | 6 tests | @smoke, @regression |
| **API - Registration** | 5 tests | @smoke, @regression |
| **API - Products** | 5 tests | @smoke, @regression |
| **Total** | **39 tests** | |

## Requirements

- [Node.js](https://nodejs.org/en/download) >= 18
- [npm](https://www.npmjs.com/) package manager

## Installation & Setup

Follow the steps below to set up the project locally:

1. Clone the Repository

```
git clone https://github.com/AnaDjokovic/qa-automation-exercises-task
```

2. Navigate to the project directory

```
cd qa-automation-exercises-task
```

3. Install dependencies

```
npm install
```

4. Install Playwright browsers (for more info go [here](https://playwright.dev/docs/intro))

```
npx playwright install
```

## Test Plan Document

A detailed Test Plan (PDF) is included in the project root:

**Test Plan - Automation Exercise.pdf**

It describes the testing scope, strategy, scenarios, environment setup, test data, and all functional areas covered by both manual and automated tests.

## Usage

### Available Scripts

All scripts are defined in `package.json` and can be run with `npm run <script>`.

#### Run All Tests

```bash
npm run test                    # Run all tests (E2E + API)
```

#### Run Tests by Type

```bash
npm run test:e2e               # Run all E2E tests (Chrome + Firefox)
npm run test:api               # Run all API tests
```

#### Run Tests by Tag

```bash
npm run test:smoke             # Run only @smoke tests (fast)
npm run test:regression        # Run only @regression tests (thorough)
```

#### Debug & Development

```bash
npx playwright test --debug    # Run tests in debug mode
npx playwright test --headed   # Run tests with visible browser
```

### Test Tags

Tests are tagged for selective execution:

| Tag | Purpose | Execution Time |
|-----|---------|---|
| `@smoke` | Quick sanity checks | ~5-10 min |
| `@regression` | Full test coverage | ~15-20 min |

**Example:**
```bash
npm run test:smoke             # Fast feedback
npm run test:regression        # Complete validation
npm run test                   # All tests
```

### Browsers

E2E tests run on:
- **Chromium** (default)
- **Firefox** (configured)

API tests run headless by default.

You can modify browser settings in `playwright.config.ts` → `projects` section.

## Code Quality Tools

The project uses ESLint and Prettier to maintain clean and consistent code style.

### Run ESLint

```bash
npm run lint
```

### Run Prettier formatting

```bash
npm run format
```

You can customize rules in:
- `.eslintrc.mjs`
- `.prettierrc`

## Implementation Details

### Page Object Model (POM)

All page objects extend `BasePage` and implement UI interactions as reusable methods

### Fixture-based Setup

Tests use Playwright fixtures for automatic page object and test data injection

### Test Isolation & Data Management

- **UUID-based Emails** - Each test generates unique email (no collisions)
- **Per-test Setup/Teardown** - Each test gets fresh data via fixtures
- **API-based Cleanup** - Tests clean up after themselves
- **Parallel-safe** - Tests can run concurrently without interference

## Best Practices Implemented

✅ **Page Object Model** - Separation of UI interactions and test logic
✅ **DRY Principle** - Reusable page objects and helper methods
✅ **Test Data Management** - Centralized, unique data generation
✅ **Type Safety** - Full TypeScript for better IDE support
✅ **Fail-fast** - Screenshots and traces on failure
✅ **Explicit Waits** - Proper element state handling
✅ **Atomic Methods** - Single-responsibility methods in page objects
✅ **Test Isolation** - No test dependencies or shared state
✅ **CI/CD Ready** - Configured for headless execution

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Playwright** | ^1.56.1 | Browser automation |
| **TypeScript** | ^5.9.3 | Type-safe code |
| **Node.js** | >=18 | Runtime |
| **ESLint** | ^9.39.1 | Code quality |
| **Prettier** | ^3.6.2 | Code formatting |

## Configuration Files

- **`playwright.config.ts`** - Playwright configuration (browsers, timeouts, reporters)
- **`tsconfig.json`** - TypeScript compiler options
- **`package.json`** - NPM scripts and dependencies
- **`.eslintrc.mjs`** - ESLint rules
- **`.prettierrc`** - Prettier formatting rules

## CI/CD Integration

The project is configured for CI/CD pipelines:

- ✅ Headless mode enabled
- ✅ Single worker for stability
- ✅ HTML reports generation
- ✅ Screenshot on failure
- ✅ Trace recording for debugging
- ✅ Retries on transient failures

## Troubleshooting

### Tests timing out?
- Increase timeout in `playwright.config.ts`
- Check network connectivity

### Missing browsers?

```bash
npx playwright install
```

### Type errors in IDE?
```bash
npm run lint
```

## Notes

- Tests use **TypeScript** for type safety and better IDE support
- All page objects extend `BasePage` for consistent navigation and ad blocking
- Tests are **re-runnable** on failure (configured via Playwright retries)
- **Screenshots** captured automatically on test failure
- **Traces** recorded for failed tests for debugging
- You can change execution mode in `playwright.config.ts`
- Tests are designed to run in **parallel** (each test has isolated data)

```
## Owner

Project implemented by **Ana Markovic**.
