import Text from '$/shared/valueObject/text';
import { TestText, TestBase } from './base.spec';
import CollectionBase from './collectionBase';

class TestCollectionBase extends CollectionBase<TestBase>() {
}

class TestBaseWithCollection extends TestBase {
  private tests!: TestCollectionBase;

  public static createWithCollection(text3: Text, text4: Text, tests: TestCollectionBase): TestBase {
    const instance = TestBase.create(text3, text4) as TestBaseWithCollection;
    instance.tests = tests;

    return instance;
  }
}

describe('Entity CollectionBase', () => {
  describe('validate', () => {
    it('should not throw error', () => {
      expect(TestCollectionBase.create([
        TestBase.create(TestText.create(1), TestText.create('1')),
        TestBase.create(TestText.create(2), TestText.create('2')),
      ]).validate()).toBeUndefined();
    });

    it('should return validation errors', () => {
      const errors = TestCollectionBase.create([
        TestBase.create(TestText.create(1), TestText.create('1')),
        TestBase.create(TestText.create(2), TestText.create('')),
        TestBase.create(TestText.create(''), TestText.create('')),
      ]).validate();

      expect(errors).not.toBeUndefined();
      expect(errors).toEqual({
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

describe('Entity Base with collection', () => {
  describe('getErrors', () => {
    it('should return empty', () => {
      expect(TestBaseWithCollection.createWithCollection(
        TestText.create(1),
        TestText.create('1'),
        TestCollectionBase.create([]),
      ).getErrors()).toEqual({});
    });

    it('should return validation errors', () => {
      const errors = TestBaseWithCollection.createWithCollection(
        TestText.create(''),
        TestText.create(''),
        TestCollectionBase.create([
          TestBase.create(TestText.create(1), TestText.create('1')),
          TestBase.create(TestText.create(2), TestText.create('')),
          TestBase.create(TestText.create(''), TestText.create('')),
        ])).getErrors();

      expect(errors).not.toBeUndefined();
      expect(errors).toEqual({
        text3: {
          errors: ['値を指定してください'],
          name: 'test',
        },
        text4: {
          errors: ['値を指定してください'],
          name: 'test',
        },
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
});
