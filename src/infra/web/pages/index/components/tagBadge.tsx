import type { IBadgeProps } from '#/data/badge';
import type Tag from '$/server/tag/tag';
import type { VFC } from 'react';
import { memo } from 'react';
import Badge from '#/data/badge';

const TagBadge: VFC<IBadgeProps & { tag: Tag; }> = ({ tag, ...props }) => {
  return <Badge m={1} flexShrink={1} {...props}>{tag.tagName.value}</Badge>;
};

TagBadge.displayName = 'TagBadge';
export default memo(TagBadge);
