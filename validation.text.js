// __tests__/validateEmail.test.js
import { it, expect, describe } from "vitest";
import { validateEmail } from "../validation.js";

describe("validateEmail", () => {
  // ✅ Valid Email Tests
  describe("Valid Email Addresses", () => {
    it("should return true for standard email format", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("should return true for email with dot in local part", () => {
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should return true for email with plus sign", () => {
      expect(validateEmail("user+tag@example.com")).toBe(true);
    });

    it("should return true for email with underscore", () => {
      expect(validateEmail("user_name@example.com")).toBe(true);
    });

    it("should return true for email with hyphen", () => {
      expect(validateEmail("user-name@example.com")).toBe(true);
    });

    it("should return true for email with numbers", () => {
      expect(validateEmail("user123@example.com")).toBe(true);
    });

    it("should return true for email with subdomain", () => {
      expect(validateEmail("user@sub.domain.com")).toBe(true);
    });

    it("should return true for email with mixed case", () => {
      expect(validateEmail("User@Example.com")).toBe(true);
    });

    it("should return true for email with new TLDs", () => {
      expect(validateEmail("user@example.io")).toBe(true);
      expect(validateEmail("user@example.tech")).toBe(true);
      expect(validateEmail("user@example.xyz")).toBe(true);
    });

    it("should return true for email with multiple subdomains", () => {
      expect(validateEmail("user@mail.sub.domain.com")).toBe(true);
    });

    it("should handle whitespace by trimming", () => {
      expect(validateEmail("  test@example.com  ")).toBe(true);
    });

    it("should return true for email with percent sign", () => {
      expect(validateEmail("user%name@example.com")).toBe(true);
    });
  });

  // ❌ Invalid Email Tests
  describe("Invalid Email Addresses", () => {
    it("should return false for empty string", () => {
      expect(validateEmail("")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(validateEmail(undefined)).toBe(false);
    });

    it("should return false for null", () => {
      expect(validateEmail(null)).toBe(false);
    });

    it("should return false for non-string input", () => {
      expect(validateEmail(123)).toBe(false);
      expect(validateEmail({})).toBe(false);
      expect(validateEmail([])).toBe(false);
      expect(validateEmail(true)).toBe(false);
    });

    it("should return false for email without @ symbol", () => {
      expect(validateEmail("userexample.com")).toBe(false);
    });

    it("should return false for email without domain part", () => {
      expect(validateEmail("user@")).toBe(false);
    });

    it("should return false for email without TLD", () => {
      expect(validateEmail("user@domain")).toBe(false);
    });

    it("should return false for email with spaces", () => {
      expect(validateEmail("user @example.com")).toBe(false);
      expect(validateEmail("user@ example.com")).toBe(false);
      expect(validateEmail("user@example .com")).toBe(false);
    });

    it("should return false for email with multiple @ symbols", () => {
      expect(validateEmail("user@domain@example.com")).toBe(false);
    });

    it("should return false for email with invalid special characters", () => {
      expect(validateEmail("user!name@example.com")).toBe(false);
      expect(validateEmail("user#name@example.com")).toBe(false);
      expect(validateEmail("user$name@example.com")).toBe(false);
    });

    it("should return false for email starting with dot", () => {
      expect(validateEmail(".user@example.com")).toBe(false);
    });

    it("should return false for email ending with dot", () => {
      expect(validateEmail("user@example.com.")).toBe(false);
    });

    it("should return false for email with consecutive dots", () => {
      expect(validateEmail("user..name@example.com")).toBe(false);
    });

    it("should return false for email with invalid TLD (too short)", () => {
      expect(validateEmail("user@example.c")).toBe(false);
    });

    it("should return false for email with TLD containing numbers", () => {
      expect(validateEmail("user@example.123")).toBe(false);
    });

    it("should return false for email with domain starting with dot", () => {
      expect(validateEmail("user@.example.com")).toBe(false);
    });

    it("should return false for email with domain ending with dot", () => {
      expect(validateEmail("user@example.com.")).toBe(false);
    });
  });

  // 🔍 Edge Cases
  describe("Edge Cases", () => {
    it("should handle minimum valid email length", () => {
      expect(validateEmail("a@b.c")).toBe(true);
    });

    it("should handle very long valid email", () => {
      const localPart = "a".repeat(60);
      const domain = "b".repeat(60);
      const email = `${localPart}@${domain}.com`;
      // Note: This might exceed typical max length but should still validate pattern
      expect(validateEmail(email)).toBe(true);
    });

    it("should handle email with hyphens in domain", () => {
      expect(validateEmail("user@my-domain.com")).toBe(true);
    });

    it("should handle email with numbers in domain", () => {
      expect(validateEmail("user@domain123.com")).toBe(true);
    });

    it("should handle email with all allowed special characters", () => {
      expect(validateEmail("user._%+-@example.com")).toBe(true);
    });

    it("should return false for email with unicode characters", () => {
      expect(validateEmail("üser@example.com")).toBe(false);
    });
  });

  // 📊 Parameterized Tests (Cleaner way to test multiple values)
  describe("Parameterized Tests", () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "user+tag@example.com",
      "user_name@example.com",
      "user-name@example.com",
      "user123@example.com",
      "user@sub.domain.com",
      "User@Example.com",
      "user@example.io",
      "user@example.tech",
      "  test@example.com  ", // trimmed
    ];

    it.each(validEmails)("should return true for valid email: %s", (email) => {
      expect(validateEmail(email)).toBe(true);
    });

    const invalidEmails = [
      ["", "Empty string"],
      [undefined, "Undefined"],
      [null, "Null"],
      [123, "Number"],
      ["userexample.com", "Missing @"],
      ["user@", "Missing domain"],
      ["user@domain", "Missing TLD"],
      ["user @example.com", "Space in local part"],
      ["user@ example.com", "Space in domain"],
      ["user!name@example.com", "Invalid character !"],
      ["user#name@example.com", "Invalid character #"],
      ["user@domain..com", "Double dot in domain"],
      [".user@example.com", "Starts with dot"],
      ["user@.com", "Domain starts with dot"],
      ["user@example.c", "TLD too short"],
      ["user@example.123", "TLD with numbers"],
      ["user@example.com.", "Ends with dot"],
    ];

    it.each(invalidEmails)(
      "should return false for invalid email: %s",
      (email) => {
        expect(validateEmail(email)).toBe(false);
      },
    );
  });
});
