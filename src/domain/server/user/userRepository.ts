import User from './user';
import UserId from './valueObject/userId';

export default interface IUserRepository {
  findByToken(userId: UserId): Promise<User>;

  findById(userId: UserId): Promise<User>;

  save(user: User): Promise<void>;
}
