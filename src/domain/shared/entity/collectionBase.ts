import type { ValidationErrors } from '$/shared/exceptions/validation';
import type Base from './base';
import ValidationException from '$/shared/exceptions/validation';

export default function CollectionBase<T extends Base>() {
  interface CollectionBaseStatic<T extends CollectionBase> {
    new(): T;
  }

  abstract class CollectionBase {
    private static _isCreating = false;
    private _collections!: T[];

    // create メソッドの this コンテキストのせいで protected にはできない
    /**
     * @deprecated create 経由で生成
     */
    public constructor() {
      if (!CollectionBase._isCreating) {
        throw new Error();
      }
    }

    public get collections(): T[] {
      return this._collections;
    }

    public validate(): void | never {
      const errors = this.collections.reduce((acc, item, index) => ({
        ...acc,
        ...Object.fromEntries(Object.entries(item.getErrors()).map(([key, value]) => [`${index}: ${key}`, value])),
      }), {} as ValidationErrors);

      if (Object.keys(errors).length) {
        throw new ValidationException(errors);
      }
    }

    public static create<C extends CollectionBase>(this: CollectionBaseStatic<C>, collections: T[]): C {
      CollectionBase._isCreating = true;
      const instance = new this();
      CollectionBase._isCreating = false;

      instance._collections = collections;
      Object.seal(instance._collections);

      return instance;
    }
  }

  return CollectionBase;
}
