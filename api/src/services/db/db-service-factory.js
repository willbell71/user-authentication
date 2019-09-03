// @ts-check
'use strict';

const MongoDBService = require('./mongo-db-service');

/**
 * DB service factory.
 */
class DBServiceFactory {
  /**
   * Create a db service based on type.
   * @param {string} type - type of token service to create.
   * @param {Logger} logger - logger service.
   * @param {string} connection - connection string;
   * @param {any[]} mappings - service mappings.
   * @return {DBService} db service created.
   */
  static createDBService(type, logger, connection, mappings) {
    switch (type) {
      case 'mongo': return new MongoDBService(logger, connection, mappings);
      default:
        logger.error(`Unhandled db service type - ${type}`);
        throw (new Error(`Unhandled db service type - ${type}`));
    }
  }
}

module.exports = DBServiceFactory;
