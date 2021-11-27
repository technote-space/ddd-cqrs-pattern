import type { CreateTableColumn } from '$/server/shared/database';
import type Base from './base';
import type { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import DateProperty from './date';
import NumberProperty from './number';
import RelationProperty from './relation';
import RichTextProperty from './richText';
import TitleProperty from './title';

export default class Factory {
  private properties: Partial<Record<GetDatabaseResponse['properties'][string]['type'], Base<any>>> = {};

  public constructor() {
    this.properties['title'] = new TitleProperty();
    this.properties['rich_text'] = new RichTextProperty();
    this.properties['number'] = new NumberProperty();
    this.properties['date'] = new DateProperty();
    this.properties['relation'] = new RelationProperty();
  }

  public getProperty<T extends GetDatabaseResponse['properties'][string]['type']>(type: T): Base<T> {
    const property = this.properties[type];
    if (!property) {
      throw new Error('サポートされていません');
    }

    return property;
  }

  public getPropertyByColumn<T extends GetDatabaseResponse['properties'][string]['type'], C extends CreateTableColumn['type']>(type: C): Base<T> {
    const property = Object.values(this.properties).find(property => property.columnType === type);
    if (!property) {
      throw new Error('サポートされていません');
    }

    return property;
  }
}
