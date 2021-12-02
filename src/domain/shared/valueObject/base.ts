/* eslint-disable @typescript-eslint/no-non-null-assertion */
// to avoid "Static members cannot reference class type parameters." error
import InvalidUsage from '$/shared/exceptions/domain/invalidUsage';

export default function Base<Input, Output, Inner = Output>() { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  interface BaseStatic<T extends Base> {
    new(): T;
  }

  abstract class Base {
    private static _isCreating = false;
    private _input!: Input;
    private _setInner = false;
    private _inner?: Inner;
    private _setOutput = false;
    private _output?: Output;

    // create メソッドの this コンテキストのせいで protected にはできない
    /**
     * @deprecated create 経由で生成
     */
    public constructor() {
      if (!Base._isCreating) {
        throw new InvalidUsage('create経由で生成してください');
      }
    }

    protected reconstruct(value: Input): void {
      this._input = value;
      this._setInner = false;
      this._setOutput = false;
    }

    protected fromInput(): Inner {
      return this.input as never;
    }

    protected toOutput(): Output {
      return this.inner as never;
    }

    protected get input(): Input {
      return this._input!;
    }

    protected get inner(): Inner {
      if (!this._setInner) {
        this._setInner = true;
        this._inner = this.fromInput();
      }

      return this._inner!;
    }

    public get value(): Output {
      if (!this._setOutput) {
        this._setOutput = true;
        this._output = this.toOutput();
        Object.freeze(this._output);
        Object.seal(this._output);
      }

      return this._output!;
    }

    public equals(value: this): boolean {
      return this.compare(value) === 0;
    }

    public abstract compare(value: this): number;

    public abstract getName(): string;

    public abstract validate(): string[] | undefined;

    public static create<T extends Base>(this: BaseStatic<T>, value: Input): T {
      Base._isCreating = true;
      const instance = new this();
      Base._isCreating = false;

      instance._input = value;

      return instance;
    }
  }

  return Base;
}

