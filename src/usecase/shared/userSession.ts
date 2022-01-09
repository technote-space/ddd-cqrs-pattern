import type UserId from '$/shared/user/valueObject/userId';

export type UserSession = {
  userId: UserId;
}

export type UserJwtPayload = {
  userId: string;
  dbType: string;
}
