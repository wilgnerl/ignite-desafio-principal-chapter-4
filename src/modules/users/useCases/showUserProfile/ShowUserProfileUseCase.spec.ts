import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('ShowUserProfile UseCase', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  test('Should be able show user profile', async () => {
    const { id } = await usersRepositoryInMemory.create({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    const userProfile = await showUserProfileUseCase.execute(id as string);
    expect(userProfile).toHaveProperty("id");
  });
  test('Should not be able show user profile if user not exists', async () => {

    expect(async () => {
      const userProfile = await showUserProfileUseCase.execute("any_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });
});
