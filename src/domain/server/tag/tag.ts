import type TagName from '$/server/tag/valueObject/tagName';
import Base from '$/shared/entity/base';
import TagId from './valueObject/tagId';

export default class Tag extends Base {
  private _tagId!: TagId;
  private _tagName!: TagName;

  public get tagId(): TagId {
    return this._tagId;
  }

  public get tagName(): TagName {
    return this._tagName;
  }

  public static reconstruct(tagId: TagId, tagName: TagName): Tag {
    const instance = new this();
    instance._tagId = tagId;
    instance._tagName = tagName;

    return instance;
  }

  public static create(tagName: TagName): Tag {
    return Tag.reconstruct(TagId.create(null), tagName);
  }
}
