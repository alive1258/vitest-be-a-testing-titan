// transformToNumber.test.js
import { it, expect, describe } from "vitest";
import { transformToNumber } from "./transformToNumber.js";

describe("transformToNumber", () => {
  it("should return a number if numeric string is provided", () => {
    const stringNumber = "2";
    const result = transformToNumber(stringNumber);

    expect(result).toBeTypeOf("number");
    expect(result).toBe(2);
    expect(Number.isNaN(result)).toBe(false);
  });

  it("should return NaN if non-numeric string is provided", () => {
    const stringNumber = "hello";
    const result = transformToNumber(stringNumber);

    expect(result).toBeTypeOf("number");
    expect(result).toBeNaN();
  });

  it("should handle empty string", () => {
    const stringNumber = "";
    const result = transformToNumber(stringNumber);

    expect(result).toBeTypeOf("number");
    expect(result).toBe(0);
  });

  it("should handle undefined", () => {
    const result = transformToNumber(undefined);

    expect(result).toBeTypeOf("number");
    expect(result).toBeNaN();
  });

  it("should handle null", () => {
    const result = transformToNumber(null);

    expect(result).toBeTypeOf("number");
    expect(result).toBe(0); // null converts to 0 with unary plus
  });
});
