import type { User as UserModel } from '@/server/shared/database/mysql';
import User from '$/shared/user/user';
import Token from '$/shared/user/valueObject/token';
import UserId from '$/shared/user/valueObject/userId';

export type { UserModel };

export default class NotionMapper {
  public static toEntity(data: UserModel): User {
    return User.reconstruct(
      UserId.create(data.id),
      Token.create(data.token),
    );
  }
}
