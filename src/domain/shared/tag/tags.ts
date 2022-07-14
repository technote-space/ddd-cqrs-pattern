import Collection from '@technote-space/vo-entity-ts/dist/entity/collection';
import TagName from '$/shared/tag/valueObject/tagName';
import Tag from './tag';

export default class Tags extends Collection<Tag> {
  public addTag(tagName: TagName): Tags {
    if (!this.find(item => item.tagName.equals(tagName))) {
      return Tags.create([
        ...this.collections,
        Tag.create(tagName),
      ]);
    }

    return this;
  }

  public removeTag(tagName: TagName): Tags {
    return Tags.create([
      ...this.filter(item => !item.tagName.equals(tagName)),
    ]);
  }
}
