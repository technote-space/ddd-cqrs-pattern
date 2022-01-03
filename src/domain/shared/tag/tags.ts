import CollectionBase from '$/shared/entity/collectionBase';
import TagName from '$/shared/tag/valueObject/tagName';
import Tag from './tag';

export default class Tags extends CollectionBase<Tag>() {
  public addTag(tagName: TagName): Tags {
    if (!this.collections.find(item => item.tagName.equals(tagName))) {
      return Tags.create([
        ...this.collections,
        Tag.create(tagName),
      ]);
    }

    return this;
  }

  public removeTag(tagName: TagName): Tags {
    return Tags.create([
      ...this.collections.filter(item => !item.tagName.equals(tagName)),
    ]);
  }
}
