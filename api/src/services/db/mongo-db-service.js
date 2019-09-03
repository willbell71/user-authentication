// @ts-check
'use strict';

const mongoose = require('mongoose');

const DBService = require('./db-service');

/**
 * Mongo DB service interface.
 */
class MongoDBService extends DBService {
  /**
   * Constructor.
   * @param {Logger} logger - logger service.
   * @param {string} connection - connection string.
   * @param {any[]} mappings - service mappings.
   */
  constructor(logger, connection, mappings) {
    super(logger, mappings);

    // connect to mongo
    mongoose.connect(connection, {
      useNewUrlParser: true
    })
      .then(() => this.logger.info('MongoDBService', 'Mongo database connected'))
      .catch(err => this.logger.error('Failed to connect to mongo db'));

    // generate mongoose schemas and mappings
    this.mongooseMappings = {};
    if (mappings) {
      mappings.forEach(mapping => {
        const {name, schema} = mapping;
        const mongooseSchema = new mongoose.Schema(schema);
        this.mongooseMappings[name] = {
          mongooseSchema,
          model: mongoose.model(name, mongooseSchema)
        };
      });
    }
  }

  /**
   * Create a new instance of an entity type.
   * @param {string} entityType - entity type to create.
   * @return {Promise<any>} new entity instance.
   */
  async create(entityType) {
    // get model from mongoose mappings
    const model = this.mongooseMappings[entityType];
    if (model) {
      const EntityModel = model.model;

      // create a new instance
      let entity;
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
  }

  /**
   * Set a property value on a given entity.
   * @param {any} entity - data entity set property on.
   * @param {string} propName - name of property to set.
   * @param {any} value - value to set on property.
   */
  setProp(entity, propName, value) {
    if (entity) {
      entity[propName] = value;
    }
  }

  /**
   * Get the value of a given property on a data enity.
   * @param {any} entity - data entity to get value of.
   * @param {string} propName - name of property to get value for.
   * @return {any} value of property on entity.
   */
  getProp(entity, propName) {
    return entity ? entity[propName] : undefined;
  }

  /**
   * Save a given entity back to the db.
   * @param {any} entity - entity to save.
   * @return {Promise<boolean>} success.
   */
  async save(entity) {
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
   * @param {any} value - value to find.
   * @return {Promise<any>} entity fetched.
   */
  async fetch(entityType, propName, value) {
    // get model from mongoose mappings
    const model = this.mongooseMappings[entityType];
    if (model) {
      const entityModel = model.model;

      if ('id' === propName) {
        return await entityModel.findById(value);
      } else {
        return await entityModel.findOne({[propName]: value});
      }
    } else {
      throw (new Error('Model doesnt exist'));
    }
  }
}

module.exports = MongoDBService;
