import { it, expect } from "vitest";
import { add } from "./match.js";

it("should add numbers correctly", () => {
  //arrange
  const numbers = [1, 2, 3, 4, 5];
  const ecpectedResult = numbers.reduce((acc, curr) => acc + curr, 0);
  //action
  const result = add(numbers);
  //assertion
  expect(result).toBe(ecpectedResult);
});

it("it should provide Nan if at lests one invalid numbewr is prtovide add numbers correctly", () => {
  //arrange
  const numbers = [1, 2, "invalid", 4, 5];
  //   const ecpectedResult = numbers.reduce((acc, curr) => acc + curr, 0);
  //action
  const result = add(numbers);
  //assertion
  expect(result).toBeNaN();
});

it("it should provide provide correct sum if an arry numeric string is provide", () => {
  //arrange
  const numbers = ["2", "3"];
  const ecpectedResult = numbers.reduce((acc, curr) => +acc + +curr, 0);
  //action
  const result = add(numbers);
  //assertion
  expect(result).toBe(ecpectedResult);
});

it("it should throw an erro if no argument id passed", () => {
  const resultFun = () => {
    add();
  };

  expect(resultFun).toThrow();
});

it("it should throw an erro if multiple argument is provide", () => {
  const resultFun = () => {
    add(1, 2, 3);
  };

  expect(resultFun).toThrow();
});
