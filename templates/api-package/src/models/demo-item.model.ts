import {Entity, model, property} from '@loopback/repository';

@model()
export class DemoItem extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<DemoItem>) {
    super(data);
  }
}

export interface DemoItemRelations {
  // describe navigational properties here
}

export type DemoItemWithRelations = DemoItem & DemoItemRelations;
