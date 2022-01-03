import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let token: string;
let operationId: string;
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

describe('GetOperation Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("api/v1/users").send(userTest);
    const { body } = await request(app).post("/api/v1/sessions").send(userTest);

    token = body.token;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send(depositTest)
      .set({ Authorization: `Bearer ${token}` });

    operationId = response.body.id;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test("shouldn't be able to get a statement operation from a non existent user", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/${operationId}`)
      .set({ Authorization: `Bearer invalidToken` });

    expect(response.status).toBe(401);
  });
});
