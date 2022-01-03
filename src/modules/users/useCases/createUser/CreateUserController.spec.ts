import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
const userTest = {
  name: "any_name",
  email: "any_email",
  password: "any_password"
};

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  test("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send(userTest);

    expect(response.status).toBe(201);
  });
});
