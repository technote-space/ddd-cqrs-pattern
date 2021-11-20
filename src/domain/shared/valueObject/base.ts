/* eslint-disable @typescript-eslint/no-non-null-assertion */
// to avoid "Static members cannot reference class type parameters." error
export default function Base<Input, Output, Inner = Output>() { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  interface BaseStatic<T extends Base> {
    new(): T;
  }

  abstract class Base {
    private _input!: Input;
    private _setInner = false;
    private _inner?: Inner;
    private _setOutput = false;
    private _output?: Output;

    // create メソッドの this コンテキストのせいで protected にはできない
    // protected constructor() {
    // }

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
      const instance = new this();
      instance._input = value;

      return instance;
    }
  }

  return Base;
}

