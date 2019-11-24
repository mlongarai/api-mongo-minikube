const app = require("../../src/app");
const supertest = require("supertest");
const req = supertest(app);
const dbHandler = require("../db-handler");

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("Post Endpoints - datacenter-1", () => {
  it("should create datacenter-1", async () => {
    const response = await req.post("/configs").send({
      name: "datacenter-1",
      metadata: {
        monitoring: {
          enabled: "true"
        },
        limits: {
          cpu: {
            enabled: "false",
            value: "300m"
          }
        }
      }
    });
    expect(response.statusCode).toEqual(201);
  });
});

describe("Post Endpoints - datacenter-2", () => {
  it("should create datacenter-2", async () => {
    const response = await req.post("/configs").send({
      name: "datacenter-2",
      metadata: {
        monitoring: {
          enabled: "true"
        },
        limits: {
          cpu: {
            enabled: "true",
            value: "250m"
          }
        }
      }
    });
    expect(response.status).toBe(201);
  });
});

it("List endpoint", async () => {
  try {
    const response = await req.get("/configs");
    expect(response.status).toBe(200);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
});

it("Create endpoint", async done => {
  try {
    const response = await req.post("/configs").send({
      name: "datacenter-1",
      metadata: {
        monitoring: {
          enabled: "true"
        },
        limits: {
          cpu: {
            enabled: "false",
            value: "300m"
          }
        }
      }
    });
    expect(response.status).toBe(201);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});

it("Get endpoint", async done => {
  try {
    const response = await req.get("/configs/datacenter-1");
    expect(response.status).toBe(200);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});

it("Update endpoint", async done => {
  try {
    const res = await req.put("/configs/datacenter-1").send({
      name: "datacenter-1",
      metadata: {
        monitoring: {
          enabled: "false"
        },
        limits: {
          cpu: {
            enabled: "false",
            value: "300m"
          }
        }
      }
    });
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});

it("Delete endpoint", async done => {
  try {
    const response = await req.delete("/configs/datacenter-1");
    expect(response.status).toBe(200);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});

it("Query example-1", async done => {
  try {
    const response = await req.get("/search?metadata.monitoring.enabled=true");
    expect(response.status).toBe(200);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});

it("Query example-2", async done => {
  try {
    const response = await req.get("/search?metadata.limits.cpu.enabled=true");
    expect(response.status).toBe(200);
  } catch (err) {
    expect(err.message).toMatch("code 400" || "code 404" || "code 500");
  }
  done();
});
