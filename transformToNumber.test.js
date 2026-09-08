import { it, expect } from "vitest";
import { add } from "./match.js";

it("should return a number if numeric string is provide", () => {
  //arrange
  const stringNumber = "2";

  //action
  const result = transformToNumber(stringNumber);
  //assertion
  expect(result).toBeTypeOf("number");
  expect(isNaN(result)).toBe(true);
});
