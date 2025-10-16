import request from "supertest";

import app from "../../test/test-server";

describe("GET /api/products/barcode/:barcode", () => {
  it("returns product for known barcode", async () => {
    const response = await request(app).get(
      "/api/products/barcode/012345678901"
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: "1",
      barcode: "012345678901",
    });
  });

  it("returns 404 for unknown barcode", async () => {
    const response = await request(app).get(
      "/api/products/barcode/000000000000"
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "PRODUCT_NOT_FOUND" });
  });

  it("validates barcode format", async () => {
    const response = await request(app).get("/api/products/barcode/invalid");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_BARCODE");
  });
});
