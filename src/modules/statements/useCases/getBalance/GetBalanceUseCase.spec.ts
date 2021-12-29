import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersepositoryInMemory: InMemoryUsersRepository;

describe('GetBalance UseCase', () => {

  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersepositoryInMemory);
  });

  test('should be return balance', async () => {
    const user = await usersepositoryInMemory.create({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");

  });
  test('should not be return balance if user not exists', async () => {
    expect(async () => {
      const balance = await getBalanceUseCase.execute({ user_id: "any_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
