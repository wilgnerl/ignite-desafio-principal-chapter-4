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

export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

const depositTest = {
  user_id: null,
  type: OperationType.DEPOSIT,
  description: "Test Deposit",
  amount: 100,
};

const withdrawTest = {
  user_id: null,
  type: OperationType.DEPOSIT,
  description: "Test Deposit",
  amount: 100,
};

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("api/v1/users").send(userTest);
    const { body } = await request(app).post("/api/v1/sessions").send(userTest);
    token = body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  test("should not be able to create a statement without a valid token", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(depositTest)
      .set({ Authorization: `Bearer invalidtoken` });

    expect(response.status).toBe(401);
  });

  test("should not be able to make a withdraw without enough balance", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send(depositTest)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });

  test("should be able to make a deposit statement", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(depositTest)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  test("should be able to make a withdraw statement", async () => {
    await request(app)
      .post("/api/v1/statements/deposit")
      .send(depositTest)
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(withdrawTest)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });
});
