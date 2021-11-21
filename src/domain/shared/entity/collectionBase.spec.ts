import type ValidationException from '$/shared/exceptions/validation';
import { TestText, TestBase } from './base.spec';
import CollectionBase from './collectionBase';

class TestCollectionBase extends CollectionBase<TestBase>() {
}

describe('Entity CollectionBase', () => {
  describe('validate', () => {
    it('should not throw error', () => {
      expect(() => TestCollectionBase.create([
        TestBase.create(TestText.create(1), TestText.create('1')),
        TestBase.create(TestText.create(2), TestText.create('2')),
      ]).validate()).not.toThrow();
    });

    it('should throw error', () => {
      let error: ValidationException | undefined;
      try {
        TestCollectionBase.create([
          TestBase.create(TestText.create(1), TestText.create('1')),
          TestBase.create(TestText.create(2), TestText.create('')),
          TestBase.create(TestText.create(''), TestText.create('')),
        ]).validate();
      } catch (e) {
        error = e as ValidationException;
      }

      expect(error).not.toBeUndefined();
      expect(error?.message).toBe('バリデーションエラーが発生しました');
      expect(error?.errors).toEqual({
        '1: text4': {
          errors: ['値を指定してください'],
          name: 'test',
        },
        '2: text3': {
          errors: ['値を指定してください'],
          name: 'test',
        },
        '2: text4': {
          errors: ['値を指定してください'],
          name: 'test',
        },
      });
    });
  });

  it('should throw error if call constructor directory', () => {
    expect(() => new TestCollectionBase()).toThrow();
  });
});
