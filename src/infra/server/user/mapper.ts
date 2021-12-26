import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import UserId from '$/server/user/valueObject/userId';

export type DatabaseType = {
  id: string;
  token: string;
};

export default class Mapper {
  public static toEntity(data: DatabaseType): User {
    return User.reconstruct(
      UserId.create(data.id),
      Token.create(data.token),
    );
  }
}
