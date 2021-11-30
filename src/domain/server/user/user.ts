import type Token from './valueObject/token';
import Base from '$/shared/entity/base';
import UserId from './valueObject/userId';

export default class User extends Base {
  private _userId!: UserId;
  private _token!: Token;

  public get userId(): UserId {
    return this._userId;
  }

  public get token(): Token {
    return this._token;
  }

  public static reconstruct(userId: UserId, token: Token): User {
    const instance = new this();
    instance._userId = userId;
    instance._token = token;

    return instance;
  }

  public static create(token: Token): User {
    const instance = User.reconstruct(UserId.create(null), token);
    instance.validate();

    return instance;
  }
}
