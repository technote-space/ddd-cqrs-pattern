import User from './user';
import UserId from './valueObject/userId';

export default interface IUserRepository {
  findById(userId: UserId): User;

  save(user: User): void;
}
