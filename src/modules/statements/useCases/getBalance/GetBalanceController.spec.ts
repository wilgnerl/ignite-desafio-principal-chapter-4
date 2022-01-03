import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let token: string;
const userTest = {
  name: "any_name",
  email: "any_email",
  password: "any_password"
};

describe('GetBalance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("api/v1/users").send(userTest);
    const response = await request(app).post("/api/v1/sessions").send(userTest);

    token = response.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("should not be able to get a balance from a non existent user", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer invalidtoken` });

    expect(response.status).toBe(401);
  });

  test("should be able to get the balance from an user", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });
});
