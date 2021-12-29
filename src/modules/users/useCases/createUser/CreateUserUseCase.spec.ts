import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('CreateUser UseCase', () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  test('should be able to create user', async () => {
    const user = await createUserUseCase.execute({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe("any_email@mail.com");
  });
  test('should not be able to create user if user already exists', async () => {
    await createUserUseCase.execute({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    expect(async () => {

      await createUserUseCase.execute({
        name: "any_name2",
        email: "any_email@mail.com",
        password: "any2_password"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
