import type { Props } from '$/web/pages';
import type { IAuth } from '$/web/shared/auth';

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth) => {
  console.log(props);
  const user = auth.useUser();
  console.log(user);

  return {
    user,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
