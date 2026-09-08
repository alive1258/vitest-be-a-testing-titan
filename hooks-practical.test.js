// __tests__/hooks-practical.test.js
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

// Mock Database
class Database {
  constructor() {
    this.data = [];
    this.connected = false;
  }

  connect() {
    this.connected = true;
    return Promise.resolve();
  }

  disconnect() {
    this.connected = false;
    return Promise.resolve();
  }

  save(item) {
    this.data.push(item);
    return Promise.resolve(item);
  }

  findAll() {
    return Promise.resolve(this.data);
  }

  clear() {
    this.data = [];
    return Promise.resolve();
  }
}

// Mock API Client
class APIClient {
  async fetchUser(id) {
    if (id === 404) {
      throw new Error("User not found");
    }
    return { id, name: `User ${id}` };
  }

  async createUser(data) {
    if (!data.name) {
      throw new Error("Name is required");
    }
    return { id: 123, ...data };
  }
}

describe("Database Operations with Hooks", () => {
  let db;
  let apiClient;

  // Setup once before all tests
  beforeAll(async () => {
    db = new Database();
    apiClient = new APIClient();
    await db.connect();
    console.log("✅ Database connected");
  });

  // Cleanup once after all tests
  afterAll(async () => {
    await db.disconnect();
    console.log("❌ Database disconnected");
  });

  // Setup before each test
  beforeEach(async () => {
    await db.clear();
    console.log("🧹 Database cleared for test");
  });

  // Cleanup after each test
  afterEach(async () => {
    // Any per-test cleanup
    console.log("📝 Test completed");
  });

  it("should save and retrieve data", async () => {
    const item = { id: 1, name: "Test Item" };
    await db.save(item);
    const results = await db.findAll();
    expect(results).toContainEqual(item);
  });

  it("should handle multiple items", async () => {
    await db.save({ id: 1, name: "Item 1" });
    await db.save({ id: 2, name: "Item 2" });
    const results = await db.findAll();
    expect(results).toHaveLength(2);
  });

  describe("API Operations", () => {
    // Nested hooks - runs only for tests in this describe block
    beforeAll(() => {
      console.log("🟢 API beforeAll - runs once for API tests");
    });

    afterAll(() => {
      console.log("🔴 API afterAll - runs once for API tests");
    });

    beforeEach(() => {
      console.log("🟡 API beforeEach - runs before each API test");
    });

    afterEach(() => {
      console.log("🟣 API afterEach - runs after each API test");
    });

    it("should fetch user by ID", async () => {
      const user = await apiClient.fetchUser(1);
      expect(user).toEqual({ id: 1, name: "User 1" });
    });

    it("should handle user not found", async () => {
      await expect(apiClient.fetchUser(404)).rejects.toThrow("User not found");
    });

    it("should create a new user", async () => {
      const user = await apiClient.createUser({ name: "Alice" });
      expect(user).toHaveProperty("id");
      expect(user.name).toBe("Alice");
    });

    it("should validate user creation", async () => {
      await expect(apiClient.createUser({})).rejects.toThrow(
        "Name is required",
      );
    });
  });
});
