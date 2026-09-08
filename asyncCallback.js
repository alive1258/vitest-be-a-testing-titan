// asyncCallback.js

// Simple callback with delay - Add validation
export function fetchDataCallback(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }
  setTimeout(() => {
    callback(null, { id: 1, name: "John Doe" });
  }, 100);
}

// Callback with error handling
export function fetchDataWithError(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }
  setTimeout(() => {
    const error = new Error("Failed to fetch data");
    callback(error, null);
  }, 100);
}

// Multiple callbacks (success/error) - Add validation
export function fetchUser(id, onSuccess, onError) {
  if (typeof onSuccess !== "function" || typeof onError !== "function") {
    throw new TypeError("onSuccess and onError must be functions");
  }
  setTimeout(() => {
    if (id <= 0 || id === null || id === undefined) {
      onError(new Error("Invalid user ID"));
    } else {
      onSuccess({ id, name: `User ${id}` });
    }
  }, 100);
}

// Callback with multiple parameters - Add validation
export function calculateAsync(a, b, callback) {
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }
  setTimeout(() => {
    const result = a + b;
    callback(null, result);
  }, 50);
}
