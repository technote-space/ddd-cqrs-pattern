import type IDatabase from '$/server/shared/database';
import type IUserRepository from '$/server/user/userRepository';
import { singleton, inject } from 'tsyringe';
import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import UserId from '$/server/user/valueObject/userId';

type DatabaseType = {
  id: string;
  ユーザー識別子: string;
};

@singleton()
export default class UserNotionRepository implements IUserRepository {
  public constructor(
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async findById(userId: UserId): Promise<User> {
    const response = await this.database.find<DatabaseType>('users', userId.value);
    if (!response) {
      throw new Error('指定されたユーザーは存在しません');
    }

    return User.reconstruct(
      UserId.create(response.id),
      Token.create(response.ユーザー識別子),
    );
  }

  public async findByToken(token: Token): Promise<User> {
    const response = await this.database.search<DatabaseType>('users', {
        filter: [
          {
            property: 'ユーザー識別子',
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
      throw new Error('指定されたユーザーは存在しません');
    }

    const user = response.results[0];
    return User.reconstruct(
      UserId.create(user.id),
      Token.create(user.ユーザー識別子),
    );
  }

  public async save(user: User): Promise<void> {
    const data = {
      ユーザー識別子: user.token.value,
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
