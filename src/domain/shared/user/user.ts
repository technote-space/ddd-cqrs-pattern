import type Token from './valueObject/token';
import Entity from '@technote-space/vo-entity-ts/dist/entity';
import UserId from './valueObject/userId';

export default class User extends Entity {
  public constructor(
    public readonly userId: UserId,
    public readonly token: Token,
  ) {
    super();
  }

  public equals(other: User): boolean {
    return this.userId.equals(other.userId);
  }

  public static create(token: Token): User {
    return User._create(UserId.create(null), token);
  }

  public static reconstruct(userId: UserId, token: Token): User {
    return User._reconstruct(userId, token);
  }
}
