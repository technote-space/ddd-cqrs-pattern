import type EstimateUnit from '$/server/task/valueObject/estimateUnit';
import type EstimateValue from '$/server/task/valueObject/estimateValue';
import type { ValidationError } from '$/shared/valueObject/base';
import Base from '$/shared/valueObject/base';

type InputType = {
  value: EstimateValue;
  unit: EstimateUnit;
}

export default class Estimate extends Base<InputType, InputType>() {
  private _hours!: number;
  private _setHours = false;

  public getName(): string {
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

  public validate(): ValidationError[] | undefined {
    return [
      ...(this.input.value.validate() ?? []),
      ...(this.input.unit.validate() ?? []),
    ];
  }
}
