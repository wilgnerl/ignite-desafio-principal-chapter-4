import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
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

    console.log(balance);

  });
});
