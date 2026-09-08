// __tests__/asyncCallback.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchDataCallback,
  fetchDataWithError,
  fetchUser,
  calculateAsync,
} from "./asyncCallback.js";

// Helper function to wait for async operations
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to promisify callback functions
const promisify = (fn) => {
  return new Promise((resolve, reject) => {
    fn((error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

describe("Testing Callback-based Async Functions", () => {
  // =============================================
  // SECTION 1: Testing with Promise Wrapper
  // =============================================
  describe("1. Using Promise wrapper (promisify)", () => {
    it("should fetch data using promise wrapper", async () => {
      const data = await promisify(fetchDataCallback);
      expect(data).toEqual({ id: 1, name: "John Doe" });
    });

    it("should handle errors using promise wrapper", async () => {
      await expect(promisify(fetchDataWithError)).rejects.toThrow(
        "Failed to fetch data",
      );
    });

    it("should handle success callback for valid user ID", async () => {
      const data = await promisify((callback) => {
        fetchUser(
          5,
          (result) => callback(null, result),
          (error) => callback(error),
        );
      });
      expect(data).toEqual({ id: 5, name: "User 5" });
    });

    it("should handle error callback for invalid user ID", async () => {
      await expect(
        promisify((callback) => {
          fetchUser(
            -1,
            (result) => callback(null, result),
            (error) => callback(error),
          );
        }),
      ).rejects.toThrow("Invalid user ID");
    });
  });

  // =============================================
  // SECTION 2: Testing with wait() Helper
  // =============================================
  describe("2. Using wait() helper with spies", () => {
    it("should call callback with correct arguments", async () => {
      const callback = vi.fn();
      fetchDataCallback(callback);
      await wait(150);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, {
        id: 1,
        name: "John Doe",
      });
    });

    it("should call error callback for invalid ID", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      fetchUser(-1, onSuccess, onError);
      await wait(150);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
    });

    it("should call success callback for valid ID", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      fetchUser(1, onSuccess, onError);
      await wait(150);

      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith({ id: 1, name: "User 1" });
    });

    it("should handle multiple callback calls", async () => {
      const callbacks = {
        first: vi.fn(),
        second: vi.fn(),
      };

      fetchDataCallback(callbacks.first);
      fetchDataCallback(callbacks.second);
      await wait(150);

      expect(callbacks.first).toHaveBeenCalledTimes(1);
      expect(callbacks.second).toHaveBeenCalledTimes(1);
      expect(callbacks.first).toHaveBeenCalledWith(null, {
        id: 1,
        name: "John Doe",
      });
      expect(callbacks.second).toHaveBeenCalledWith(null, {
        id: 1,
        name: "John Doe",
      });
    });
  });

  // =============================================
  // SECTION 3: Testing with vi.waitFor()
  // =============================================
  describe("3. Using vi.waitFor()", () => {
    it("should wait for callback to be called", async () => {
      const callback = vi.fn();
      fetchDataCallback(callback);

      await vi.waitFor(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null, {
          id: 1,
          name: "John Doe",
        });
      });
    });

    it("should wait for error callback to be called", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      fetchUser(-1, onSuccess, onError);

      await vi.waitFor(() => {
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
      });
    });

    it("should wait for success callback with valid ID", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      fetchUser(10, onSuccess, onError);

      await vi.waitFor(() => {
        expect(onError).not.toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith({ id: 10, name: "User 10" });
      });
    });

    it("should handle multiple async calls with vi.waitFor", async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      calculateAsync(2, 3, callback1);
      calculateAsync(10, 20, callback2);

      await vi.waitFor(() => {
        expect(callback1).toHaveBeenCalledWith(null, 5);
        expect(callback2).toHaveBeenCalledWith(null, 30);
      });
    });
  });

  // =============================================
  // SECTION 4: Testing with vi.useFakeTimers()
  // =============================================
  describe("4. Using fake timers (Best for performance)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should execute callback after delay using advanceTimersByTime", () => {
      const callback = vi.fn();
      calculateAsync(5, 3, callback);

      vi.advanceTimersByTime(50);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, 8);
    });

    it("should handle multiple async calls with fake timers", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      calculateAsync(2, 3, callback1);
      calculateAsync(10, 20, callback2);

      vi.advanceTimersByTime(50);

      expect(callback1).toHaveBeenCalledWith(null, 5);
      expect(callback2).toHaveBeenCalledWith(null, 30);
    });

    it("should run all timers with runAllTimers", () => {
      const callback = vi.fn();
      calculateAsync(5, 3, callback);

      vi.runAllTimers();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, 8);
    });

    it("should advance to next timer with advanceTimersToNextTimer", () => {
      const callback = vi.fn();
      calculateAsync(5, 3, callback);

      vi.advanceTimersToNextTimer();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, 8);
    });

    it("should handle sequential async calls with fake timers", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      calculateAsync(2, 3, callback1);
      vi.advanceTimersByTime(50);
      calculateAsync(10, 20, callback2);
      vi.advanceTimersByTime(50);

      expect(callback1).toHaveBeenCalledWith(null, 5);
      expect(callback2).toHaveBeenCalledWith(null, 30);
    });
  });

  // =============================================
  // SECTION 5: Combined Testing Approaches
  // =============================================
  describe("5. Combined approaches", () => {
    it("should handle success and error paths in same test", async () => {
      // Success path
      const successData = await promisify((callback) => {
        fetchUser(
          1,
          (result) => callback(null, result),
          (error) => callback(error),
        );
      });
      expect(successData).toEqual({ id: 1, name: "User 1" });

      // Error path
      await expect(
        promisify((callback) => {
          fetchUser(
            -1,
            (result) => callback(null, result),
            (error) => callback(error),
          );
        }),
      ).rejects.toThrow("Invalid user ID");
    });

    it("should test callback invocation with spies and fake timers", () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      fetchDataCallback(callback);

      vi.advanceTimersByTime(100);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, { id: 1, name: "John Doe" });

      vi.useRealTimers();
    });

    it("should handle error with both callback and promise", async () => {
      // Using callback with done pattern (wrapped in promise)
      const result = await new Promise((resolve, reject) => {
        fetchDataWithError((error, data) => {
          if (error) reject(error);
          else resolve(data);
        });
      }).catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Failed to fetch data");
        return { error: true };
      });

      expect(result).toEqual({ error: true });
    });
  });

  // =============================================
  // SECTION 6: Edge Cases and Error Scenarios
  // =============================================
  describe("6. Edge cases and error scenarios", () => {
    it("should throw error for undefined callback", () => {
      expect(() => fetchDataCallback(undefined)).toThrow(
        "callback must be a function",
      );
    });

    it("should throw error for null callback", () => {
      expect(() => fetchDataCallback(null)).toThrow(
        "callback must be a function",
      );
    });

    it("should throw error for non-function callback", () => {
      expect(() => fetchDataCallback(123)).toThrow(
        "callback must be a function",
      );
      expect(() => fetchDataCallback("string")).toThrow(
        "callback must be a function",
      );
      expect(() => fetchDataCallback({})).toThrow(
        "callback must be a function",
      );
    });

    it("should handle null user ID as invalid", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      fetchUser(null, onSuccess, onError);
      await wait(150);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
    });

    it("should handle undefined user ID as invalid", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      fetchUser(undefined, onSuccess, onError);
      await wait(150);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
    });

    it("should handle very large numbers", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      fetchUser(Number.MAX_SAFE_INTEGER, onSuccess, onError);
      await wait(150);

      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith({
        id: Number.MAX_SAFE_INTEGER,
        name: `User ${Number.MAX_SAFE_INTEGER}`,
      });
    });

    it("should handle zero ID as invalid", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      fetchUser(0, onSuccess, onError);
      await wait(150);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
    });

    it("should handle negative ID as invalid", async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      fetchUser(-5, onSuccess, onError);
      await wait(150);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Invalid user ID"));
    });

    it("should throw error for invalid onSuccess callback", () => {
      expect(() => fetchUser(1, null, () => {})).toThrow(
        "onSuccess and onError must be functions",
      );
    });

    it("should throw error for invalid onError callback", () => {
      expect(() => fetchUser(1, () => {}, null)).toThrow(
        "onSuccess and onError must be functions",
      );
    });
  });

  // =============================================
  // SECTION 7: Performance Testing
  // =============================================
  describe("7. Performance testing", () => {
    it("should handle multiple concurrent callbacks", async () => {
      const promises = [];
      const totalCalls = 10;

      for (let i = 0; i < totalCalls; i++) {
        promises.push(
          promisify((callback) => {
            fetchDataCallback(callback);
          }),
        );
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(totalCalls);
      results.forEach((result) => {
        expect(result).toEqual({ id: 1, name: "John Doe" });
      });
    });

    it("should measure callback execution time", async () => {
      const startTime = Date.now();

      await promisify((callback) => {
        fetchDataCallback(callback);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(100);
    });

    it("should handle 100 concurrent callbacks", async () => {
      const promises = [];
      const totalCalls = 100;

      for (let i = 0; i < totalCalls; i++) {
        promises.push(
          promisify((callback) => {
            fetchDataCallback(callback);
          }),
        );
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(totalCalls);
    });
  });
});
