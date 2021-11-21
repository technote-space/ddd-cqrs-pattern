import TagName from '$/server/tag/valueObject/tagName';
import CollectionBase from '$/shared/entity/collectionBase';
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
