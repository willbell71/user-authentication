import * as mongoose from 'mongoose';

import { IDBService, DBServiceEntity,　DBServiceValue } from './idb-service';
import { ILogger } from '../logger/ilogger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EntityModel = any;

type EntityMapping = {
  schema: mongoose.Schema;
  model: mongoose.Model<EntityModel>;
};

type Mappings = {
  [key: string]: EntityMapping;
};

type SchemaMapping = {
  name: string;
  schemaDefinition: mongoose.SchemaDefinition;
};

/**
 * DB service interface.
 */
export class MongoDBService implements IDBService {
  // logger service
  private logger?: ILogger;
  // db schemas
  private schema?: SchemaMapping[];
  // db schema mapping to mongoose schema and model
  private mappings?: Mappings;

  /**
   * Connect to db and set up schema.
   * @param {ILogger} logger - logger services provider.
   * @param {string} connection - connection string.
   * @param {SchemaMapping[]} schema - entity names and schemas.
   */
  public connect(logger: ILogger, connection: string, schema: SchemaMapping[]): void {
    this.logger = logger;
    this.schema = schema;

    // connect to mongo
    mongoose.connect(connection, {
      useNewUrlParser: true
    })
      .then(() => this.logger!.info('MongoDBService', 'Mongo database connected'))
      .catch(() => this.logger!.error('Failed to connect to mongo db'));

    // generate mongoose schemas and mappings
    this.mappings = {};
    if (this.schema) {
      this.schema.forEach((entity: SchemaMapping) => {
        const {name, schemaDefinition}: {name: string; schemaDefinition: mongoose.SchemaDefinition} = entity;
        const mSchema: mongoose.Schema = new mongoose.Schema(schemaDefinition);
        this.mappings![name] = {
          schema: mSchema,
          model: mongoose.model(name, mSchema)
        };
      });
    }    
  }

  /**
   * Create a new instance of an entity type.
   * @param {string} entityType - entity type to create.
   * @return {Promise<DBServiceEntity>} new entity instance.
   */
  public async create(entityType: string): Promise<DBServiceEntity> {
    if (this.mappings) {
      // get model from mongoose mappings
      const model: EntityMapping = this.mappings[entityType];
      if (model) {
        const EntityModel: mongoose.Model<EntityModel> = model.model;

        // create a new instance
        let entity: mongoose.Model<EntityModel>;
        try {
          entity = new EntityModel();
        } catch (_) {
          throw (new Error('Failed to instantiate new entity'));
        }

        // return instance
        return entity;
      } else {
        throw (new Error('Model doesnt exist'));
      }
    } else {
      throw (new Error('Mappings not set, connection must be called with a schema for this entity'));
    }
  }

  /**
   * Set a property value on a given entity.
   * @param {DBServiceEntity} entity - data entity set property on.
   * @param {string} propName - name of property to set.
   * @param {DBServiceValue} value - value to set on property.
   */
  public setProp(entity: DBServiceEntity, propName: string, value: DBServiceValue): void {
    if (entity) {
      entity[propName] = value;
    }
  }

  /**
   * Get the value of a given property on a data enity.
   * @param {DBServiceEntity} entity - data entity to get value of.
   * @param {string} propName - name of property to get value for.
   * @return {DBServiceValue} value of property on entity.
   */
  public getProp(entity: DBServiceEntity, propName: string): DBServiceValue {
    return entity ? entity[propName] : undefined;
  }

  /**
   * Save a given entity back to the db.
   * @param {DBServiceEntity} entity - entity to save.
   * @return {Promise<boolean>} success.
   */
  public async save(entity: DBServiceEntity): Promise<boolean> {
    if (entity) {
      await entity.save();
      return true;
    } else {
      throw new Error('No entity to save');
    }
  }

  /**
   * Fetch entities of type who's property matches the given value.
   * @param {string} entityType - entity type to fetch.
   * @param {string} propName - name of property to search on.
   * @param {DBServiceValue} value - value to find.
   * @return {Promise<DBServiceEntity>} entity fetched.
   */
  public async fetch(entityType: string, propName: string, value: DBServiceValue): Promise<DBServiceEntity> {
    if (this.mappings) {
      // get model from mongoose mappings
      const model: EntityMapping = this.mappings[entityType];
      if (model) {
        const entityModel: mongoose.Model<EntityModel> = model.model;

        if ('id' === propName) {
          return await entityModel.findById(value);
        } else {
          return await entityModel.findOne({[propName]: value});
        }
      } else {
        throw (new Error('Model doesnt exist'));
      }
    } else {
      throw (new Error('Mappings not set, connection must be called with a schema for this entity'));
    }
  }
}
