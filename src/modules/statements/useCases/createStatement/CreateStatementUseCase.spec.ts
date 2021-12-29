import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('CreateStatement UseCase', () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersepositoryInMemory, statementsRepositoryInMemory);
  });

  test('should be able to create a deposit statement', async () => {
    const user = await usersepositoryInMemory.create({
      name: "any_name",
      password: "any_password",
      email: "any_email"
    });
    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      type: "deposit" as OperationType,
      description: "any_description"
    });

    console.log(deposit);

    expect(deposit).toHaveProperty("id");
    expect(deposit).toHaveProperty("user_id");
    expect(deposit).toHaveProperty("amount");
    expect(deposit.type).toBe("deposit");
    expect(deposit.user_id).toBe(user.id);


  });

  test('should be able to create a deposit statement', async () => {
    const user = await usersepositoryInMemory.create({
      name: "any_name",
      password: "any_password",
      email: "any_email"
    });
    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      type: "deposit" as OperationType,
      description: "any_description"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 5,
      type: "withdraw" as OperationType,
      description: "any_description"
    });

    expect(withdraw.type).toBe("withdraw");
    expect(withdraw).toHaveProperty("id");
    expect(withdraw).toHaveProperty("user_id");
    expect(withdraw).toHaveProperty("amount");


  });

  test('should not be able to create a statement if user not exists', async () => {
    expect(async () => {
      const deposit = await createStatementUseCase.execute({
        user_id: "any_id",
        amount: 10,
        type: "deposit" as OperationType,
        description: "any_description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
  test('should not be able to create a statement if user not exists', async () => {
    expect(async () => {
      const user = await usersepositoryInMemory.create({
        name: "any_name",
        password: "any_password",
        email: "any_email"
      });

      const withdraw = await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 5,
        type: "withdraw" as OperationType,
        description: "any_description"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
