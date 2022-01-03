import TagId from '$/shared/tag/valueObject/tagId';
import TagName from '$/shared/tag/valueObject/tagName';
import Tag from './tag';
import Tags from './tags';

describe('Tags', () => {
  it('new によるインスタンスの生成はできない', () => {
    expect(() => new Tags()).toThrow();
  });

  it('コレクションに直接追加できない', () => {
    const tags = Tags.create([]);
    expect(() => tags.collections.push(Tag.reconstruct(TagId.create('test'), TagName.create('テスト')))).toThrow();
  });

  describe('addTag', () => {
    it('重複しない名前のタグを追加したときにコレクションに追加される', () => {
      const tags = Tags.create([Tag.reconstruct(TagId.create('test'), TagName.create('テスト'))]);
      const added = tags.addTag(TagName.create('追加'));

      expect(tags.collections).toHaveLength(1);
      expect(added.collections).toHaveLength(2);
    });

    it('重複した名前のタグを追加したときにコレクションに追加されない', () => {
      const tags = Tags.create([Tag.reconstruct(TagId.create('test'), TagName.create('テスト'))]);
      const added = tags.addTag(TagName.create('テスト'));

      expect(tags.collections).toHaveLength(1);
      expect(added.collections).toHaveLength(1);
    });
  });

  describe('removeTag', () => {
    it('コレクションに存在する名前のタグを指定したときにコレクションから削除される', () => {
      const tags = Tags.create([Tag.reconstruct(TagId.create('test'), TagName.create('テスト'))]);
      const removed = tags.removeTag(TagName.create('テスト'));

      expect(tags.collections).toHaveLength(1);
      expect(removed.collections).toHaveLength(0);
    });

    it('コレクションに存在しない名前のタグを指定したときに何も起きない', () => {
      const tags = Tags.create([Tag.reconstruct(TagId.create('test'), TagName.create('テスト'))]);
      const removed = tags.removeTag(TagName.create('あああ'));

      expect(tags.collections).toHaveLength(1);
      expect(removed.collections).toHaveLength(1);
    });
  });
});
