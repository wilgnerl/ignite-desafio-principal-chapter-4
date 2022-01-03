import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
const userTest = {
  name: "any_name",
  email: "any_email",
  password: "any_password"
};

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("api/v1/users").send(userTest);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test('Should be able to create a session', async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: userTest.email,
      password: userTest.password
    });
    expect(response.body).toHaveProperty("token");
  });
  test('Should not be able to create a session if email is wrong', async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "",
      password: userTest.password
    });
    expect(response.body).toBe(401);
  });
  test('Should not be able to create a session if password is wrong', async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: userTest.email,
      password: ""
    });
    expect(response.body).toBe(401);
  });
});
