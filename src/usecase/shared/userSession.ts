import type UserId from '$/server/user/valueObject/userId';

export type UserSession = {
  userId: UserId;
}

export type UserJwtPayload = {
  userId: string;
}
