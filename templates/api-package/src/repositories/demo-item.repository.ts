import {DefaultCrudRepository} from '@loopback/repository';
import {DemoItem, DemoItemRelations} from '../models';
import {DemoItemsDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DemoItemRepository extends DefaultCrudRepository<
  DemoItem,
  typeof DemoItem.prototype.id,
  DemoItemRelations
> {
  constructor(
    @inject('datasources.DemoItemsDS') dataSource: DemoItemsDsDataSource,
  ) {
    super(DemoItem, dataSource);
  }
}
