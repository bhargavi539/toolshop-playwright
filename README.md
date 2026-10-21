# toolshop-playwright

Playwright + TypeScript test automation framework with UI, API, and combined E2E tests, fixtures, and GitHub Actions CI.

App under test: [Practice Software Testing](https://practicesoftwaretesting.com) (API: https://api.practicesoftwaretesting.com).

## Status

- Done: API login setup (with create-user fallback), API tests for login and product list
- Planned: more API tests, UI tests, E2E tests, GitHub Actions workflow

## Setup

```powershell
npm install
npx playwright install
Copy-Item .env.example .env
```

Then open `.env` and fill in `USER_EMAIL` and `USER_PASSWORD` (a test account is created automatically if it doesn't exist).

## Run the tests

```powershell
npx playwright test --project=api
npx playwright show-report
```