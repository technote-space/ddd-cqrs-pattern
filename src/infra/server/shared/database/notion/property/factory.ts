import type { TableColumn } from '$/server/shared/database';
import type Base from './base';
import type { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import NotionDatabase from '..';
import DateProperty from './date';
import NumberProperty from './number';
import RelationProperty from './relation';
import RichTextProperty from './richText';
import TitleProperty from './title';

export default class Factory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private properties: Partial<Record<GetDatabaseResponse['properties'][string]['type'], Base>> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(database: NotionDatabase) {
    this.properties['title'] = new TitleProperty(database);
    this.properties['rich_text'] = new RichTextProperty(database);
    this.properties['number'] = new NumberProperty(database);
    this.properties['date'] = new DateProperty(database);
    this.properties['relation'] = new RelationProperty(database);
  }

  public getProperty<T extends GetDatabaseResponse['properties'][string]['type']>(type: T): Base {
    const property = this.properties[type];
    /* istanbul ignore next */
    if (!property) {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    return property;
  }

  public getPropertyByColumn<T extends TableColumn['type']>(type: T): Base {
    const property = Object.values(this.properties).find(property => property.columnType === type);
    /* istanbul ignore next */
    if (!property) {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    return property;
  }
}
