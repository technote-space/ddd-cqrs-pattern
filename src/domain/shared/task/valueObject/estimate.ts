import type EstimateUnit from '$/shared/task/valueObject/estimateUnit';
import type EstimateValue from '$/shared/task/valueObject/estimateValue';
import type { ValidationError } from '@technote-space/vo-entity-ts/dist/valueObject';
import ValueObject from '@technote-space/vo-entity-ts/dist/valueObject';

type InputType = {
  value: EstimateValue;
  unit: EstimateUnit;
}

export default class Estimate extends ValueObject<InputType, InputType> {
  private _hours!: number;
  private _setHours = false;

  protected get symbol() {
    return Symbol();
  }

  public static getLabel(): string {
    return '作業見積';
  }

  public get hours(): number {
    if (!this._setHours) {
      this._setHours = true;
      if (this.input.unit.value === '日') {
        this._hours = this.input.value.value * 24;
      } else {
        this._hours = this.input.value.value;
      }
    }

    return this._hours;
  }

  public compare(value: this): number {
    const diff = this.hours - value.hours;
    if (diff < 0) return -1;
    if (diff > 0) return 1;
    return 0;
  }

  public getErrors(): ValidationError[] | undefined {
    return [
      ...(this.input.value.getErrors('estimateValue') ?? []),
      ...(this.input.unit.getErrors('estimateUnit') ?? []),
    ];
  }
}
