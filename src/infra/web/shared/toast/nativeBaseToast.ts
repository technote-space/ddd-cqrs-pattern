import type { IToast, ToastMethods } from '$/web/shared/toast';
import { useToast } from 'native-base';

export class NativeBaseToast implements IToast {
  public useToast(): ToastMethods {
    return useToast();
  }
}
