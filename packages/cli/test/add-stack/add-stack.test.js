const { runAddStackCommand, clearBuildOutput } = require("../helpers");
const path = require("path");
const { removeSync } = require("fs-extra");

beforeEach(async () => {
  await clearBuildOutput(__dirname);
});

afterEach(async () => {
  removeSync(path.join(__dirname, "configurable", "ApiStack.js"));
});

afterAll(async () => {
  await clearBuildOutput(__dirname);
});

describe("add-stack", () => {
  test("creates a new named stack", async () => {
    const result = await runAddStackCommand(__dirname, "ApiStack");

    expect(result).toMatch(
      /Stack created, import it in configurable\/index.js to deploy/
    );
  });
  test("fails when stack already exists", async () => {
    const result = await runAddStackCommand(__dirname, "ApiStack");

    expect(result).toMatch(
      /Stack created, import it in configurable\/index.js to deploy/
    );
  });
});
