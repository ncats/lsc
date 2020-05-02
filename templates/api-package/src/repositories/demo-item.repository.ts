import {DefaultCrudRepository} from '@loopback/repository';
import {DemoItem, DemoItemRelations} from '../models';
import {ApiDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DemoItemRepository extends DefaultCrudRepository<
  DemoItem,
  typeof DemoItem.prototype.id,
  DemoItemRelations
> {
  constructor(@inject('datasources.ApiDS') dataSource: ApiDsDataSource) {
    super(DemoItem, dataSource);
  }
}
