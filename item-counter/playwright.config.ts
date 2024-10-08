import { defineConfig, devices } from "@playwright/test";

const frontendPort = 8080;
const frontEndUrl = `http://localhost:${frontendPort}`;

const backendPort = 7070;
const backEndUrl = `http://localhost:${backendPort}`;

export default defineConfig({
	// Look for test files in the "test" directory, relative to this configuration file.
	testDir: "test",

	// Run all tests in parallel.
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: !!process.env.CI,

	// Don't retry on failure.
	retries: 0,

	// Reporter to use
	reporter: [
		// Console output
		["line"],
		// JUnit XML report file output for CI
		["junit", { outputFile: "test-results/junit-report.xml" }],
	],

	use: {
		// Base URL to use in actions like `await page.goto('/')`.
		baseURL: frontEndUrl,

		// Collect trace when retrying the failed test.
		trace: "on-first-retry",

		// Generate screenshots when a test fails
		screenshot: "only-on-failure",
	},
	// Configure projects for major browsers.
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	// Run your local dev server before starting the tests.
	webServer: [
		// Run the local azure service
		{
			command: "npm run start:server",
			url: backEndUrl,
			reuseExistingServer: !process.env,
		},
		// Run front-end dev server
		{
			command: "npm run start",
			url: frontEndUrl,
			reuseExistingServer: !process.env.CI,
		},
	],
});
