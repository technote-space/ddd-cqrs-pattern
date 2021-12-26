import type ValidationException from '$/shared/exceptions/domain/validation';
import Text from '$/shared/valueObject/text';
import Base from './base';

export class TestText extends Text {
  getName(): string {
    return 'test';
  }

  protected getValidationMaxLength(): number | undefined {
    return 5;
  }
}

export class TestBase extends Base {
  private text1?: Text;
  private text2?: Text;
  private text3!: Text;
  private text4!: Text;

  public static reconstruct(text1: Text, text2: Text, text3: Text, text4: Text): TestBase {
    const instance = new this();
    instance.text1 = text1;
    instance.text2 = text2;
    instance.text3 = text3;
    instance.text4 = text4;

    return instance;
  }

  public static create(text3: Text, text4: Text): TestBase {
    const instance = new this();
    instance.text3 = text3;
    instance.text4 = text4;

    return instance;
  }

  public _checkNotEmpty(property: string): void | never {
    this.checkNotEmpty(property);
  }
}

describe('Entity Base', () => {
  describe('validate', () => {
    it('should not throw error', () => {
      expect(() => TestBase.create(TestText.create(1), TestText.create('1')).validate()).not.toThrow();
    });

    it('should throw error 1', () => {
      let error: ValidationException | undefined;
      try {
        TestBase.create(TestText.create(1), TestText.create('')).validate();
      } catch (e) {
        error = e as ValidationException;
      }

      expect(error).not.toBeUndefined();
      expect(error?.message).toBe('バリデーションエラーが発生しました');
      expect(error?.errors).toEqual({
        test: ['値を指定してください'],
      });
    });

    it('should throw error 2', () => {
      let error: ValidationException | undefined;
      try {
        TestBase.reconstruct(TestText.create(1), TestText.create(''), TestText.create(1), TestText.create('abcdef')).validate();
      } catch (e) {
        error = e as ValidationException;
      }

      expect(error).not.toBeUndefined();
      expect(error?.message).toBe('バリデーションエラーが発生しました');
      expect(error?.errors).toEqual({
        test: ['値を指定してください', '5文字より短く入力してください'],
      });
    });
  });

  describe('checkNotEmpty', () => {
    it('should not throw error', () => {
      const test = TestBase.reconstruct(TestText.create(1), TestText.create(0), TestText.create(1), TestText.create(0));
      expect(() => test._checkNotEmpty('text1')).not.toThrow();
      expect(() => test._checkNotEmpty('text3')).not.toThrow();
    });

    it('should throw error', () => {
      const test = TestBase.reconstruct(TestText.create(1), TestText.create(''), TestText.create(1), TestText.create(''));
      expect(() => test._checkNotEmpty('text2')).toThrow();
      expect(() => test._checkNotEmpty('text4')).toThrow();
      expect(() => test._checkNotEmpty('text5')).toThrow();
    });
  });
});
