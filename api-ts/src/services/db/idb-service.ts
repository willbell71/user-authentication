import { ILogger } from '../logger/ilogger';

export type DBServiceSchema = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaDefinition: any;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DBServiceEntity = any;
export type DBServiceValue = string | number | boolean | Date;

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
  connect: (logger: ILogger, connection: string, schema: DBServiceSchema[]) => Promise<void>;

  /**
   * Create a new instance of an entity type.
   * @param {string} entityType - entity type to create.
   * @return {Promise<DBServiceEntity>} new entity instance.
   */
  create: (entityType: string) => Promise<DBServiceEntity>;

  /**s
   * Set a property value on a given entity.
   * @param {DBServiceEntity} entity - data entity set property on.
   * @param {string} propName - name of property to set.
   * @param {DBServiceValue} value - value to set on property.
   */
  setProp: (entity: DBServiceEntity, propName: string, value: DBServiceValue) => void;

  /**
   * Get the value of a given property on a data enity.
   * @param {DBServiceEntity} entity - data entity to get value of.
   * @param {string} propName - name of property to get value for.
   * @return {DBServiceValue} value of property on entity.
   */
  getProp: (entity: DBServiceEntity, propName: string) => DBServiceValue;

  /**
   * Save a given entity back to the db.
   * @param {DBServiceEntity} entity - entity to save.
   * @return {Promise<boolean>} success.
   */
  save: (entity: DBServiceEntity) => Promise<boolean>;

  /**
   * Fetch entities of type who's property matches the given value.
   * @param {string} entityType - entity type to fetch.
   * @param {string} propName - name of property to search on.
   * @param {DBServiceValue} value - value to find.
   * @return {Promise<DBServiceEntity>} entity fetched.
   */
  fetch: (entityType: string, propName: string, value: DBServiceValue) => Promise<DBServiceEntity>;
}
