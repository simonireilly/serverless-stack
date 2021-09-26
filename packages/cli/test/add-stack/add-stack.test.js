const { runAddStackCommand, clearBuildOutput } = require("../helpers");

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

beforeEach(async () => {
  await clearBuildOutput(__dirname);
});

afterAll(async () => {
  await clearBuildOutput(__dirname);
});

/**
 * Test that the add-cdk command ran successfully
 */
describe("add-stack", () => {});
test("add-stack", async () => {
  const result = await runAddStackCommand(__dirname);

  expect(result).toMatch(
    /npm install --save-exact @aws-cdk\/aws-s3@\d+.\d+.\d+ @aws-cdk\/aws-iam@\d+.\d+.\d+/
  );
});
