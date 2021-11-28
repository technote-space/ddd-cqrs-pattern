import User from './user';
import UserId from './valueObject/userId';

export default interface IUserRepository {
  findById(userId: UserId): Promise<User>;

  save(user: User): Promise<void>;
}
