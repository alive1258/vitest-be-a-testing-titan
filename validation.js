// __tests__/validateEmail.test.js
import { it, expect, describe } from "vitest";
import { validateEmail } from "../validation.js";

describe("validateEmail", () => {
  it("should return true for valid email addresses", () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "user+tag@example.com",
      "user_name@example.com",
      "user-name@example.com",
      "user123@example.com",
      "user@sub.domain.com",
      "User@Example.com",
    ];

    for (const email of validEmails) {
      expect(validateEmail(email)).toBe(true);
    }
  });

  it("should return false for invalid email addresses", () => {
    const invalidEmails = [
      "",
      undefined,
      null,
      123,
      "userexample.com",
      "user@",
      "user@domain",
      "user @example.com",
      "user@ example.com",
      "user!name@example.com",
      "user#name@example.com",
      ".user@example.com",
      "user@.com",
      "user@example.c",
      "user@example.com.",
    ];

    for (const email of invalidEmails) {
      expect(validateEmail(email)).toBe(false);
    }
  });

  it("should handle whitespace by trimming", () => {
    expect(validateEmail("  test@example.com  ")).toBe(true);
  });

  it("should return false for non-string inputs", () => {
    expect(validateEmail(123)).toBe(false);
    expect(validateEmail({})).toBe(false);
    expect(validateEmail([])).toBe(false);
    expect(validateEmail(true)).toBe(false);
  });
});
