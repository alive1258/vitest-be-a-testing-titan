// __tests__/hooks.test.js
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";

describe("Testing Hooks", () => {
  // Runs once before ALL tests in this describe block
  beforeAll(() => {
    console.log("🟢 beforeAll: Runs once before all tests");
  });

  // Runs once after ALL tests in this describe block
  afterAll(() => {
    console.log("🔴 afterAll: Runs once after all tests");
  });

  // Runs before EACH test
  beforeEach(() => {
    console.log("🟡 beforeEach: Runs before each test");
  });

  // Runs after EACH test
  afterEach(() => {
    console.log("🟣 afterEach: Runs after each test");
  });

  it("test 1", () => {
    console.log("🧪 Running test 1");
    expect(true).toBe(true);
  });

  it("test 2", () => {
    console.log("🧪 Running test 2");
    expect(true).toBe(true);
  });
});
