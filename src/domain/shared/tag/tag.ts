import type TagName from '$/shared/tag/valueObject/tagName';
import Entity from '@technote-space/vo-entity-ts/dist/entity';
import TagId from './valueObject/tagId';

export default class Tag extends Entity {
  public constructor(
    public readonly tagId: TagId,
    public readonly tagName: TagName,
  ) {
    super();
  }

  public equals(other: Tag): boolean {
    return this.tagName.equals(other.tagName);
  }

  public static create(tagName: TagName): Tag {
    return Tag._create(TagId.create(null), tagName);
  }

  public static reconstruct(tagId: TagId, tagName: TagName): Tag {
    return Tag._reconstruct(tagId, tagName);
  }

  private update({ tagId, tagName }: { tagId?: TagId; tagName?: TagName }): Tag {
    return Tag._update(this, tagId ?? this.tagId, tagName ?? this.tagName);
  }

  public setId(tagId: TagId): Tag {
    return this.update({ tagId });
  }

  public setName(tagName: TagName): Tag {
    return this.update({ tagName });
  }
}
