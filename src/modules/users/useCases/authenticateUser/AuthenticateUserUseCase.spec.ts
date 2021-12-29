import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { hash } from 'bcryptjs';
import 'dotenv/config';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe('AuthenticateUser UseCase', () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
  });

  test('should not be able authenticate user if password is wrong', async () => {

    expect(async () => {

      const user = await userRepositoryInMemory.create({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
      });

      const authenticateUser = await authenticateUserUseCase.execute({
        email: user.email as string,
        password: ""
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  });
  test('should not be able authenticate user if user not exists', async () => {
    expect(async () => {
      const authenticateUser = await authenticateUserUseCase.execute({
        email: "",
        password: "any_passoword"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
