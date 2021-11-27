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
  private properties: Partial<Record<GetDatabaseResponse['properties'][string]['type'], Base<any>>> = {};

  public constructor(database: NotionDatabase<any>) {
    this.properties['title'] = new TitleProperty(database);
    this.properties['rich_text'] = new RichTextProperty(database);
    this.properties['number'] = new NumberProperty(database);
    this.properties['date'] = new DateProperty(database);
    this.properties['relation'] = new RelationProperty(database);
  }

  public getProperty<T extends GetDatabaseResponse['properties'][string]['type']>(type: T): Base<T> {
    const property = this.properties[type];
    /* istanbul ignore next */
    if (!property) {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    return property;
  }

  public getPropertyByColumn<T extends GetDatabaseResponse['properties'][string]['type'], C extends TableColumn['type']>(type: C): Base<T> {
    const property = Object.values(this.properties).find(property => property.columnType === type);
    /* istanbul ignore next */
    if (!property) {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    return property;
  }
}
