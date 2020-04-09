import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {DemoItem} from '../models';
import {DemoItemRepository} from '../repositories';

export class DemoItemController {
  constructor(
    @repository(DemoItemRepository)
    public demoItemRepository: DemoItemRepository,
  ) {}

  @post('/demo-items', {
    responses: {
      '200': {
        description: 'DemoItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(DemoItem)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemoItem, {
            title: 'NewDemoItem',
            exclude: ['id'],
          }),
        },
      },
    })
    demoItem: Omit<DemoItem, 'id'>,
  ): Promise<DemoItem> {
    return this.demoItemRepository.create(demoItem);
  }

  @get('/demo-items/count', {
    responses: {
      '200': {
        description: 'DemoItem model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(DemoItem) where?: Where<DemoItem>): Promise<Count> {
    return this.demoItemRepository.count(where);
  }

  @get('/demo-items', {
    responses: {
      '200': {
        description: 'Array of DemoItem model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DemoItem, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(DemoItem) filter?: Filter<DemoItem>,
  ): Promise<DemoItem[]> {
    return this.demoItemRepository.find(filter);
  }

  @patch('/demo-items', {
    responses: {
      '200': {
        description: 'DemoItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemoItem, {partial: true}),
        },
      },
    })
    demoItem: DemoItem,
    @param.where(DemoItem) where?: Where<DemoItem>,
  ): Promise<Count> {
    return this.demoItemRepository.updateAll(demoItem, where);
  }

  @get('/demo-items/{id}', {
    responses: {
      '200': {
        description: 'DemoItem model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DemoItem, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DemoItem, {exclude: 'where'})
    filter?: FilterExcludingWhere<DemoItem>,
  ): Promise<DemoItem> {
    return this.demoItemRepository.findById(id, filter);
  }

  @patch('/demo-items/{id}', {
    responses: {
      '204': {
        description: 'DemoItem PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DemoItem, {partial: true}),
        },
      },
    })
    demoItem: DemoItem,
  ): Promise<void> {
    await this.demoItemRepository.updateById(id, demoItem);
  }

  @put('/demo-items/{id}', {
    responses: {
      '204': {
        description: 'DemoItem PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() demoItem: DemoItem,
  ): Promise<void> {
    await this.demoItemRepository.replaceById(id, demoItem);
  }

  @del('/demo-items/{id}', {
    responses: {
      '204': {
        description: 'DemoItem DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.demoItemRepository.deleteById(id);
  }
}
