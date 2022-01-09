import type IUserRepository from '$/server/user/userRepository';
import type User from '$/shared/user/user';
import type Token from '$/shared/user/valueObject/token';
import type UserId from '$/shared/user/valueObject/userId';
import type { UserModel } from './mySqlMapper';
import type { PrismaClient } from '@/server/shared/database/mysql';
import { singleton, inject } from 'tsyringe';
import NotFound from '$/shared/exceptions/domain/notFound';
import MySqlMapper from './mySqlMapper';

@singleton()
export default class MySqlUserRepository implements IUserRepository {
  public constructor(
    @inject('PrismaClient') private client: PrismaClient,
  ) {
  }

  public async findById(userId: UserId): Promise<User> {
    const user = await this.client.user.findFirst({
      where: {
        id: Number(userId.value),
      },
    });

    if (!user) {
      throw new NotFound('ユーザー', 'users', userId.value);
    }

    return MySqlMapper.toEntity(user);
  }

  public async findByToken(token: Token): Promise<User | null> {
    const user = await this.client.user.findFirst({
      where: {
        token: token.value,
      },
    });

    if (!user) {
      return null;
    }

    return MySqlMapper.toEntity(user);
  }

  private async store(user: User): Promise<UserModel> {
    const data = {
      token: user.token.value,
    };

    if (user.userId.isSetId()) {
      return this.client.user.update({
        data,
        where: {
          id: Number(user.userId.value),
        },
      });
    } else {
      return this.client.user.create({
        data,
      });
    }
  }

  public async save(user: User): Promise<User> {
    return MySqlMapper.toEntity(await this.store(user));
  }
}
