import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('GetStatementOperation UseCase', () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersepositoryInMemory,
      statementsRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(usersepositoryInMemory, statementsRepositoryInMemory);
  });
  test('Should be able get statement operation', async () => {
    const user = await usersepositoryInMemory.create({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      type: "deposit" as OperationType,
      description: "any_description"
    });
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string
    });
    expect(statementOperation.type).toBe(deposit.type);
    expect(statementOperation.user_id).toBe(user.id);
  });
  test('Should not be able get statement operation if user not exists', async () => {

    expect(async () => {

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id: "any_user",
        statement_id: "any_deposit"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);

  });
  test('Should not be able get statement operation if statement operation not exists', async () => {
    expect(async () => {
      const user = await usersepositoryInMemory.create({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
      });

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "any_deposit"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });
});
