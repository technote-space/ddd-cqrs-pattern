import type IDatabase from '$/server/shared/database';
import type User from '$/shared/user/user';
import type IUserRepository from '$/shared/user/userRepository';
import type Token from '$/shared/user/valueObject/token';
import type UserId from '$/shared/user/valueObject/userId';
import type { DatabaseType } from './mapper';
import { singleton, inject } from 'tsyringe';
import NotFound from '$/shared/exceptions/domain/notFound';
import Mapper from './mapper';

@singleton()
export default class NotionUserRepository implements IUserRepository {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findById(userId: UserId): Promise<User> {
    const response = await this.database.find<DatabaseType>('users', userId.value);
    if (!response) {
      throw new NotFound('ユーザー', 'users', userId.value);
    }

    return Mapper.toEntity(response);
  }

  public async findByToken(token: Token): Promise<User | null> {
    const response = await this.database.search<DatabaseType>('users', {
        filter: [
          {
            property: 'token',
            condition: {
              text: {
                equals: token.value,
              },
            },
          },
        ],
      },
    );
    if (!response.results.length) {
      return null;
    }

    const user = response.results[0];
    return Mapper.toEntity(user);
  }

  public async save(user: User): Promise<void> {
    const data = {
      token: user.token.value,
    };

    if (user.userId.isSetId()) {
      await this.database.update<DatabaseType>('users', {
        id: user.userId.value,
        ...data,
      });
    } else {
      const result = await this.database.create<DatabaseType>('users', data);
      user.userId.setGeneratedId(result.id);
    }
  }
}
