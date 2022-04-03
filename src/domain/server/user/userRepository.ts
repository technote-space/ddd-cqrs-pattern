import type User from '$/shared/user/user';
import type Token from '$/shared/user/valueObject/token';
import type UserId from '$/shared/user/valueObject/userId';

export default interface IUserRepository {
  findByToken(token: Token): Promise<User | null>;

  findById(userId: UserId): Promise<User>;

  save(user: User): Promise<User>;
}
