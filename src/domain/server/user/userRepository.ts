import User from '$/shared/user/user';
import UserId from '$/shared/user/valueObject/userId';

export default interface IUserRepository {
  findByToken(userId: UserId): Promise<User | null>;

  findById(userId: UserId): Promise<User>;

  save(user: User): Promise<User>;
}
