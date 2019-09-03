// @ts-check
'use strict';

/**
 * DB service interface.
 */
class DBService {
  /**
   * Constructor.
   * @param {Logger} logger - logger service.
   * @param {any[]} mappings - mappings.
   */
  constructor(logger, mappings) {
    this.logger = logger;
    this.mappings = mappings;
  }

  /**
   * Create a new instance of an entity type.
   * @param {string} entityType - entity type to create.
   * @return {Promise<any>} new entity instance.
   */
  async create(entityType) {
    throw new Error('Not implemented');
  }

  /**
   * Set a property value on a given entity.
   * @param {any} entity - data entity set property on.
   * @param {string} propName - name of property to set.
   * @param {any} value - value to set on property.
   */
  setProp(entity, propName, value) {}

  /**
   * Get the value of a given property on a data enity.
   * @param {any} entity - data entity to get value of.
   * @param {string} propName - name of property to get value for.
   * @return {any} value of property on entity.
   */
  getProp(entity, propName) {
    return false;
  }

  /**
   * Save a given entity back to the db.
   * @param {any} entity - entity to save.
   * @return {Promise<boolean>} success.
   */
  async save(entity) {
    throw new Error('Not implemented');
  }

  /**
   * Fetch entities of type who's property matches the given value.
   * @param {string} entityType - entity type to fetch.
   * @param {string} propName - name of property to search on.
   * @param {any} value - value to find.
   */
  async fetch(entityType, propName, value) {
    throw new Error('Not implemented');
  }
}

module.exports = DBService;
