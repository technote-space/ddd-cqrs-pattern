import Base from '$/shared/entity/base';
import UserId from './valueObject/userId';

export default class User extends Base {
  private _userId!: UserId;

  public get userId(): UserId {
    return this._userId;
  }

  public static reconstruct(userId: UserId): User {
    const instance = new this();
    instance._userId = userId;

    return instance;
  }

  public static create(): User {
    return User.reconstruct(UserId.create(null));
  }
}
