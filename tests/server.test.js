const request = require("supertest");
const app = require("../server");

describe("Nova-App endpoints", () => {
  test("GET / returns a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/NOVA-APP/);
  });

  test("GET /health returns 200 and a healthy message", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/healthy/i);
    expect(res.body).toHaveProperty("uptime");
  });

  test("GET /version returns app metadata with commit and build time", async () => {
    const res = await request(app).get("/version");
    expect(res.statusCode).toBe(200);
    expect(res.body.app).toBe("nova-app");
    expect(res.body).toHaveProperty("commit");
    expect(res.body).toHaveProperty("builtAt");
  });
});