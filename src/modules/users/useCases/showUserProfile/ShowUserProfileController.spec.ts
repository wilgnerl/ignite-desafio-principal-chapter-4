import request, { Response } from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
const userTest = {
  name: "any_name",
  email: "any_email",
  password: "any_password"
};

describe('Show User profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("api/v1/users").send(userTest);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  test("should not be able to show a profile without a user's token", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ` });

    expect(response.status).toBe(401);
  });

  test("should not be able to show the profile from an user", async () => {
    const { body }: Response = await request(app).post("/api/v1/sessions").send({
      email: userTest.email,
      password: userTest.password,
    });


    const { token } = body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", userTest.name);
  });
});

