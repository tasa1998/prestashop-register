# PrestaShop Demo – Register Tests

Automated tests for the Register (Create account) functionality of the
PrestaShop demo (https://demo.prestashop.com/), built with Playwright and
TypeScript.

## Prerequisites

- Node.js 18 or newer
- Git

## Setup

```bash
git clone https://github.com/tasa1998/prestashop-register.git
cd prestashop-register
npm install
npx playwright install chromium
```

## Running the tests

```bash
npx playwright test              # run all tests (headless)
npx playwright test --headed     # run with a visible browser
npx playwright test --ui         # Playwright UI mode (best for debugging)
npx playwright show-report       # open the last HTML report
```

## Project structure

```
├── pages/
│   └── RegisterPage.ts      Page Object: locators and actions for the registration form
├── tests/
│   └── register.spec.ts     Test scenarios
├── utils/
│   └── testData.ts          Test data builder
├── playwright.config.ts
└── README.md
```

## Notes about the demo

The demo renders the shop inside an iframe (`iframe[name="framelive"]`), so all
shop elements are located through `page.frameLocator(...)`. The demo starts
slowly and its data persists between sessions, so the timeout is set to 90
seconds and every test uses a unique email.

## Scenarios and why I chose them

| # | Scenario | Why |
| --- | --- | --- |
| 1 | Register with valid data | Happy path, the core business flow |
| 2 | Privacy consent not accepted | Mandatory legal consent must block registration |
| 3 | Terms and conditions not accepted | Separate mandatory checkbox |
| 4 | Required fields empty | Validation of mandatory data |
| 5 | Invalid email formats (5 cases) | Input validation on the main identifier |
| 6 | Email already used | Server-side rule that prevents duplicate accounts |

I chose these scenarios to cover the happy path, browser-side validation and the
server-side rule for duplicate emails. I prefer a few meaningful scenarios over
many shallow ones. Ideas for further coverage are listed in the last section.


Notes on approach:
- Page Object Model keeps locators out of the tests.
- Unique email per test keeps tests independent.
- No fixed waits, only Playwright auto-waiting.

## What I would improve in a real project


1. Use a stable test environment instead of the public demo, so test data is predictable.
2. Create preconditions through an API instead of the UI. For example, the
   "email already used" test registers a user through the form first, which is slow.
3. Add a CI pipeline (GitHub Actions) that runs on every pull request.
4. Cover more cases: password rules, birthdate, special characters, long inputs.
5. Run the tests on more browsers (Firefox, WebKit) and on a mobile viewport,
   since at the moment only desktop Chromium is covered.