import { ILogger } from '../logger/ilogger';
import { TDBServiceEntity } from './tdb-service-entity';
import { TDBServiceSchema } from './tdb-service-schema';
import { TDBServiceValue } from './tdb-service-value';

/**
 * DB service interface.
 */
export interface IDBService {
  /**
   * Connect to db, and register entities and schemas.
   * @param {ILogger} logger - logger services provider.
   * @param {string} connection - connection string.
   * @param {DBServiceSchema[]} schema - entities and associated schemas.
   * @return {Promise<void>} promise on connection completion.
   */
  connect: (logger: ILogger, connection: string, schema: TDBServiceSchema[]) => Promise<void>;

  /**
   * Create a new instance of an entity type.
   * @param {string} entityType - entity type to create.
   * @return {Promise<DBServiceEntity>} new entity instance.
   */
  create: (entityType: string) => Promise<TDBServiceEntity>;

  /**s
   * Set a property value on a given entity.
   * @param {DBServiceEntity} entity - data entity set property on.
   * @param {string} propName - name of property to set.
   * @param {DBServiceValue} value - value to set on property.
   */
  setProp: (entity: TDBServiceEntity, propName: string, value: TDBServiceValue) => void;

  /**
   * Get the value of a given property on a data enity.
   * @param {DBServiceEntity} entity - data entity to get value of.
   * @param {string} propName - name of property to get value for.
   * @return {DBServiceValue} value of property on entity.
   */
  getProp: (entity: TDBServiceEntity, propName: string) => TDBServiceValue;

  /**
   * Save a given entity back to the db.
   * @param {DBServiceEntity} entity - entity to save.
   * @return {Promise<boolean>} success.
   */
  save: (entity: TDBServiceEntity) => Promise<boolean>;

  /**
   * Fetch entities of type who's property matches the given value.
   * @param {string} entityType - entity type to fetch.
   * @param {string} propName - name of property to search on.
   * @param {DBServiceValue} value - value to find.
   * @return {Promise<DBServiceEntity>} entity fetched.
   */
  fetch: (entityType: string, propName: string, value: TDBServiceValue) => Promise<TDBServiceEntity>;
}
